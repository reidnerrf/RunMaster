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

