import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import client from 'prom-client';
import { monitorEventLoopDelay } from 'perf_hooks';

const registry = new client.Registry();

// Collect default metrics with event loop lag monitoring disabled
client.collectDefaultMetrics({ 
	register: registry, 
	prefix: 'runx_',
	eventLoopLag: false // Disable event loop lag monitoring to prevent TypeError
});

const httpRequestsTotal = new client.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'route', 'status_code'] as const,
});

const httpRequestDurationMs = new client.Histogram({
	name: 'http_request_duration_ms',
	help: 'Duration of HTTP requests in ms',
	buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
	labelNames: ['method', 'route', 'status_code'] as const,
});

registry.registerMetric(httpRequestsTotal);
registry.registerMetric(httpRequestDurationMs);

// AI-specific metrics
export const aiLogCreated = new client.Counter({
    name: 'ai_log_created_total',
    help: 'Total AI log records created',
    labelNames: ['type', 'model'] as const,
});

export const aiLogDurationMs = new client.Histogram({
    name: 'ai_log_duration_ms',
    help: 'Duration of AI log writes in ms',
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
    labelNames: ['type'] as const,
});

export const dbErrors = new client.Counter({
    name: 'db_errors_total',
    help: 'Total number of database errors',
    labelNames: ['operation', 'collection'] as const,
});

registry.registerMetric(aiLogCreated);
registry.registerMetric(aiLogDurationMs);
registry.registerMetric(dbErrors);

const startTimeKey = Symbol('startTime');

export function setupMetrics(app: FastifyInstance) {
	app.addHook('onRequest', (request: FastifyRequest, _reply: FastifyReply, done) => {
		(request as any)[startTimeKey] = process.hrtime.bigint();
		done();
	});

	app.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done) => {
		try {
			const startNs = (request as any)[startTimeKey] as bigint | undefined;
			if (startNs) {
				const endNs = process.hrtime.bigint();
				const durationMs = Number(endNs - startNs) / 1_000_000;
				const route = (request.routeOptions && request.routeOptions.url) || request.url;
				const labels = {
					method: request.method,
					route,
					status_code: String(reply.statusCode)
				} as const;
				httpRequestsTotal.inc(labels);
				httpRequestDurationMs.observe(labels, durationMs);
			}
		} catch {
			// ignore metrics errors
		} finally {
			done();
		}
	});
}

export async function metricsHandler(_request: FastifyRequest, reply: FastifyReply) {
	reply.header('Content-Type', registry.contentType);
	return reply.send(await registry.metrics());
}

