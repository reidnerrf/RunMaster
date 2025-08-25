import { z } from 'zod';

// Common primitives
export const UlidSchema = z.string().min(26).max(26);
export const ISODateSchema = z.string().datetime();

// User
export const UserSchema = z.object({
	id: UlidSchema,
	email: z.string().email(),
	name: z.string().min(1),
	locale: z.enum(['pt', 'en', 'es']).default('pt'),
	isPremium: z.boolean().default(false),
	createdAt: ISODateSchema,
	updatedAt: ISODateSchema
});
export type User = z.infer<typeof UserSchema>;

// Route
export const CoordinateSchema = z.object({ lat: z.number(), lng: z.number() });
export const RouteSchema = z.object({
	id: UlidSchema,
	userId: UlidSchema,
	name: z.string().min(1),
	coordinates: z.array(CoordinateSchema).min(2),
	distanceMeters: z.number().nonnegative(),
	version: z.number().int().min(1).default(1),
	createdAt: ISODateSchema,
	updatedAt: ISODateSchema,
	audit: z.object({ reason: z.string().optional(), actorId: UlidSchema.optional() }).optional()
});
export type Route = z.infer<typeof RouteSchema>;

// Run
export const SplitSchema = z.object({
	index: z.number().int().min(0),
	durationMs: z.number().int().nonnegative(),
	distanceMeters: z.number().nonnegative(),
	paceSecPerKm: z.number().nonnegative(),
	avgHr: z.number().int().min(0).max(250).optional()
});

export const RunSchema = z.object({
	id: UlidSchema,
	userId: UlidSchema,
	routeId: UlidSchema.optional(),
	startTime: ISODateSchema,
	endTime: ISODateSchema,
	durationMs: z.number().int().positive(),
	distanceMeters: z.number().nonnegative(),
	splits: z.array(SplitSchema).default([]),
	avgHr: z.number().int().min(0).max(250).optional(),
	maxHr: z.number().int().min(0).max(250).optional(),
	vo2maxEstimate: z.number().min(0).max(100).optional(),
	hrvRmssdMs: z.number().nonnegative().optional(),
	createdAt: ISODateSchema,
	updatedAt: ISODateSchema
});
export type Run = z.infer<typeof RunSchema>;

// Export job (PDF)
export const ExportStatusSchema = z.enum(['pending', 'processing', 'done', 'error']);
export const ExportSchema = z.object({
	id: UlidSchema,
	userId: UlidSchema,
	runId: UlidSchema,
	format: z.literal('pdf'),
	status: ExportStatusSchema,
	url: z.string().url().optional(),
	errorMessage: z.string().optional(),
	createdAt: ISODateSchema,
	finishedAt: ISODateSchema.optional()
});
export type ExportJob = z.infer<typeof ExportSchema>;

// SyncQueue item (offline-first)
export const SyncOperationSchema = z.enum(['upsert', 'delete']);
export const SyncStatusSchema = z.enum(['pending', 'synced', 'conflict']);
export const SyncQueueItemSchema = z.object({
	id: UlidSchema,
	userId: UlidSchema,
	entityType: z.enum(['user', 'run', 'route', 'export', 'poi']),
	entityId: UlidSchema,
	op: SyncOperationSchema,
	payload: z.record(z.any()).optional(),
	status: SyncStatusSchema.default('pending'),
	createdAt: ISODateSchema,
	updatedAt: ISODateSchema
});
export type SyncQueueItem = z.infer<typeof SyncQueueItemSchema>;

// POI (collectible/challenge)
export const RaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);
export const PoiTypeSchema = z.enum(['collectible', 'challenge']);
export const RewardSchema = z.object({
	type: z.enum(['badge', 'coupon', 'xp']),
	amount: z.number().int().positive().optional()
});
export const PoiSchema = z.object({
	id: UlidSchema,
	type: PoiTypeSchema,
	location: CoordinateSchema,
	rarity: RaritySchema,
	activeFrom: ISODateSchema,
	activeTo: ISODateSchema,
	context: z.object({ dayOfWeek: z.number().int().min(0).max(6).optional(), hour: z.number().int().min(0).max(23).optional(), event: z.string().optional() }).optional(),
	rewards: z.array(RewardSchema).default([]),
	createdAt: ISODateSchema,
	updatedAt: ISODateSchema
});
export type Poi = z.infer<typeof PoiSchema>;

