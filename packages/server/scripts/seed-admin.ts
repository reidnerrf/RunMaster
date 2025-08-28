import { MongoClient } from 'mongodb';
import { ulid } from 'ulid';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/?authSource=pulse';
const dbName = 'pulse';

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');
        const email = 'admin@admin.com';
        const exists = await users.findOne({ email });
        if (exists) {
            console.log('Admin already exists');
            return;
        }
        const now = new Date().toISOString();
        const passwordHash = await bcrypt.hash('Reidadmin', 10);
        const admin = {
            id: ulid(),
            name: 'Admin',
            email,
            locale: 'pt',
            isPremium: true,
            createdAt: now,
            updatedAt: now,
            passwordHash
        };
        await users.insertOne(admin);
        console.log('Seeded admin user:', email);
    } finally {
        await client.close();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

