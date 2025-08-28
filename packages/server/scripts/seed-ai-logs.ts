import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/?authSource=pulse';
const dbName = 'pulse';

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('ai_logs');

        await col.createIndex({ createdAt: -1 }, { name: 'createdAt_desc' });
        await col.createIndex({ type: 1, userId: 1 }, { name: 'type_userId' });

        const now = Date.now();
        const docs = Array.from({ length: 50 }).map((_, i) => ({
            type: ['chat', 'route', 'weather', 'plan'][i % 4],
            model: 'z-ai/glm-4.5-air:free',
            userId: i % 3 === 0 ? 'user_123' : 'user_anon',
            input: { msg: `input_${i}` },
            output: { text: `output_${i}` },
            createdAt: new Date(now - i * 60_000).toISOString(),
        }));

        const res = await col.insertMany(docs);
        console.log(`Inserted ${res.insertedCount} ai_logs`);
    } finally {
        await client.close();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

