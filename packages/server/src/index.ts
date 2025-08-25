import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifyMongo from '@fastify/mongodb';
import { env } from './env';
import { setupMetrics, metricsHandler } from './metrics';
import { authRoutes } from './routes/auth';

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

if (env.ENABLE_DB && env.MONGODB_URI) {
	await app.register(fastifyMongo, { url: env.MONGODB_URI });
} else {
	app.log.warn('MongoDB disabled (ENABLE_DB=false). Skipping database connection.');
}

app.get('/health', async () => ({ ok: true }));
app.get('/metrics', metricsHandler);
app.decorate('authenticate', async (request: any, reply: any) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		return reply.code(401).send({ error: 'unauthorized' });
	}
});
await authRoutes(app);

const start = async () => {
	try {
		await app.listen({ port: env.PORT, host: '0.0.0.0' });
		app.log.info(`server listening on :${env.PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
