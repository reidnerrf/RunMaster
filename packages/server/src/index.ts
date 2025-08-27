import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { env } from './env';
import { metricsHandler, setupMetrics } from './metrics';
import { authRoutes } from './routes/auth';
import fastifyMongodb from '@fastify/mongodb';

const app = Fastify({
	logger: {
		level: env.NODE_ENV === 'production' ? 'info' : 'debug',
		transport: env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' }
	}
});

await app.register(cors, { origin: true });
await app.register(helmet);
await app.register(rateLimit, {
	max: env.RATE_LIMIT_MAX,
	timeWindow: env.RATE_LIMIT_TIME_WINDOW_MS
});
await app.register(jwt, { secret: env.JWT_SECRET });

// Basic request id propagation
app.addHook('onSend', async (request, reply) => {
	reply.header('x-request-id', request.id);
	return;
});

// Metrics hooks
setupMetrics(app);

if (env.ENABLE_DB) {
	const uri = env.MONGODB_URI || 'mongodb://localhost:27017/?authSource=pulse';
	const dbName = 'pulse';
	try {
		await app.register(fastifyMongodb, { forceClose: true, url: uri, database: dbName });
		app.log.info({ uri, dbName }, 'MongoDB connected');
	} catch (err) {
		app.log.error({ err }, 'Failed to connect to MongoDB');
	}
} else {
	app.log.warn('MongoDB disabled (ENABLE_DB=false). Skipping database connection.');
}

app.get('/health', async () => ({ ok: true }));
app.get('/metrics', metricsHandler);
app.decorate('authenticate', async (request: any, reply: any) => {
	try {
		await request.jwtVerify();
	} catch (err: unknown) {
		return reply.code(401).send({ error: 'unauthorized' });
	}
});
await authRoutes(app);

// DB health check endpoint
app.get('/db/health', async (request, reply) => {
	if (!env.ENABLE_DB) return reply.code(200).send({ ok: true, db: 'disabled' });
	try {
		// @ts-ignore
		const client = (app as any).mongo?.client as import('mongodb').MongoClient | undefined;
		if (!client) return reply.code(503).send({ ok: false, error: 'mongo not registered' });
		await client.db().command({ ping: 1 });
		return { ok: true };
	} catch (err) {
		app.log.error({ err }, 'Mongo ping failed');
		return reply.code(503).send({ ok: false });
	}
});

const start = async () => {
	try {
		await app.listen({ port: env.PORT, host: '0.0.0.0' });
		app.log.info(`server listening on :${env.PORT}`);
	} catch (err: unknown) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
