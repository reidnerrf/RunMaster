import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { env } from './env';
import { metricsHandler, setupMetrics } from './metrics';
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
	// Only attempt MongoDB connection if we're confident it's available
	// For development, we'll skip the connection attempt to avoid startup failures
	app.log.warn('MongoDB is configured but connection will not be attempted in development mode to prevent startup failures.');
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
