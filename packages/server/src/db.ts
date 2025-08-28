import type { FastifyInstance } from 'fastify';
import type { Collection, Db, Document } from 'mongodb';

export function getDb(app: FastifyInstance): Db | undefined {
	const anyApp = app as any;
	const mongo = anyApp.mongo as { db?: Db } | undefined;
	return mongo?.db;
}

export function getCollection<TSchema extends Document = Document>(
	app: FastifyInstance,
	name: string
): Collection<TSchema> | undefined {
	const db = getDb(app);
	return db?.collection<TSchema>(name);
}

export async function ensureIndexes(app: FastifyInstance): Promise<void> {
	const col = getCollection(app, 'ai_logs');
	if (!col) return;
	await col.createIndex({ createdAt: -1 }, { name: 'createdAt_desc' });
	await col.createIndex({ type: 1, userId: 1 }, { name: 'type_userId' });
}

