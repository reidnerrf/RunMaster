import type { FastifyInstance } from 'fastify';
import type { Document, ObjectId } from 'mongodb';
import { getCollection } from '../db';
import { aiLogCreated, aiLogDurationMs, dbErrors } from '../metrics';

type AILog = {
    _id?: ObjectId;
    type: 'chat' | 'route' | 'weather' | 'plan' | 'nutrition' | 'injury';
    model?: string;
    userId?: string;
    input: any;
    output: any;
    createdAt: string; // ISO
};

export async function aiRoutes(app: FastifyInstance) {
    app.post('/ai/log', async (request, reply) => {
        const start = Date.now();
        try {
            const body = request.body as Partial<AILog>;
            const doc: AILog = {
                type: (body.type as AILog['type']) || 'chat',
                model: body.model || 'openrouter',
                userId: body.userId,
                input: body.input ?? {},
                output: body.output ?? {},
                createdAt: new Date().toISOString(),
            };

            const col = getCollection<Document>(app, 'ai_logs');
            if (!col) return reply.code(503).send({ error: 'db_unavailable' });
            const res = await col.insertOne(doc as Document);

            aiLogCreated.inc({ type: doc.type, model: doc.model || 'unknown' });
            aiLogDurationMs.observe({ type: doc.type }, Date.now() - start);
            return reply.code(201).send({ id: res.insertedId });
        } catch (err) {
            dbErrors.inc({ operation: 'insertOne', collection: 'ai_logs' });
            app.log.error({ err }, 'Failed to insert AI log');
            return reply.code(500).send({ error: 'internal_error' });
        }
    });

    app.get('/ai/logs', async (request, reply) => {
        try {
            const col = getCollection<AILog>(app, 'ai_logs');
            if (!col) return reply.code(503).send({ error: 'db_unavailable' });
            const { userId, type, limit } = (request.query as any) || {};
            const q: any = {};
            if (userId) q.userId = userId;
            if (type) q.type = type;
            const lim = Math.min(Number(limit) || 50, 200);
            const items = await col
                .find(q, { sort: { createdAt: -1 }, limit: lim })
                .toArray();
            return items;
        } catch (err) {
            dbErrors.inc({ operation: 'find', collection: 'ai_logs' });
            app.log.error({ err }, 'Failed to list AI logs');
            return reply.code(500).send({ error: 'internal_error' });
        }
    });

    app.get('/ai/logs/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const col = getCollection<AILog>(app, 'ai_logs');
            if (!col) return reply.code(503).send({ error: 'db_unavailable' });
            const { ObjectId } = await import('mongodb');
            const item = await col.findOne({ _id: new ObjectId(id) } as any);
            if (!item) return reply.code(404).send({ error: 'not_found' });
            return item;
        } catch (err) {
            dbErrors.inc({ operation: 'findOne', collection: 'ai_logs' });
            app.log.error({ err }, 'Failed to fetch AI log');
            return reply.code(500).send({ error: 'internal_error' });
        }
    });

    // Simple personalization scores per user based on counts by type
    app.get('/ai/personalization/scores', async (request, reply) => {
        try {
            const { userId } = (request.query as any) || {};
            const col = getCollection<AILog>(app, 'ai_logs');
            if (!col) return reply.code(503).send({ error: 'db_unavailable' });
            const match: any = {};
            if (userId) match.userId = userId;
            const agg = await col.aggregate([
                { $match: match },
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]).toArray();
            // Normalize into weights 0..1
            const total = agg.reduce((s, a) => s + a.count, 0) || 1;
            const weights: Record<string, number> = {};
            for (const a of agg) weights[a._id] = a.count / total;
            return { userId: userId || null, weights };
        } catch (err) {
            dbErrors.inc({ operation: 'aggregate', collection: 'ai_logs' });
            app.log.error({ err }, 'Failed to compute personalization scores');
            return reply.code(500).send({ error: 'internal_error' });
        }
    });
}

