import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import client from 'prom-client';
import { monitorEventLoopDelay } from 'perf_hooks';

const registry = new client.Registry();

// Only collect default metrics if event loop monitoring is available
if (typeof monitorEventLoopDelay === 'function') {
	client.collectDefaultMetrics({ register: registry, prefix: 'runx_' });
} else {
	// Collect default metrics without event loop lag if not available
	client.collectDefaultMetrics({ 
		register: registry, 
		prefix: 'runx_',
		eventLoopMonitoringPrecision: 0 // Disable event loop monitoring
	});
}

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

