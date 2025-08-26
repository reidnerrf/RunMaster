import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ulid } from 'ulid';
import { hashPassword, verifyPassword } from '../utils/hash';
import { UserSchema } from '../models/schemas';
import { getCollection } from '../db';

type StoredUser = z.infer<typeof UserSchema> & { passwordHash: string };

const SignupBody = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8) });
const LoginBody = z.object({ email: z.string().email(), password: z.string().min(8) });

const memoryUsers = new Map<string, StoredUser>();

export async function authRoutes(app: FastifyInstance) {
	app.post('/auth/signup', async (request, reply) => {
		const { name, email, password } = SignupBody.parse(request.body);
		const now = new Date().toISOString();
		const col = getCollection<StoredUser>(app, 'users');
		const exists = col ? await col.findOne({ email }) : Array.from(memoryUsers.values()).find((u) => u.email === email) || null;
		if (exists) {
			return reply.code(409).send({ error: 'email_already_exists' });
		}
		const user: StoredUser = {
			id: ulid(),
			name,
			email,
			locale: 'pt',
			isPremium: false,
			createdAt: now,
			updatedAt: now,
			passwordHash: await hashPassword(password)
		};
		if (col) {
			await col.insertOne(user);
		} else {
			memoryUsers.set(user.id, user);
		}
		const token = app.jwt.sign({ sub: user.id });
		return reply.code(201).send({ token });
	});

	app.post('/auth/login', async (request, reply) => {
		const { email, password } = LoginBody.parse(request.body);
		const col = getCollection<StoredUser>(app, 'users');
		const user = col ? await col.findOne({ email }) : Array.from(memoryUsers.values()).find((u) => u.email === email) || null;
		if (!user) return reply.code(401).send({ error: 'invalid_credentials' });
		const ok = await verifyPassword(password, user.passwordHash);
		if (!ok) return reply.code(401).send({ error: 'invalid_credentials' });
		const token = app.jwt.sign({ sub: user.id });
		return reply.send({ token });
	});

	app.get('/auth/me', { preValidation: [app.authenticate] }, async (request) => {
		const auth = request.user as { sub: string };
		const col = getCollection<StoredUser>(app, 'users');
		const user = col ? await col.findOne({ id: auth.sub }) : memoryUsers.get(auth.sub) || null;
		if (!user) return { user: null };
		const { passwordHash, ...safe } = user;
		return { user: safe };
	});
}

