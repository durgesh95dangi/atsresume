import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

console.log('URL:', url);
console.log('Token length:', authToken?.length);

const client = createClient({ url, authToken });

async function test() {
    try {
        const result = await client.execute('SELECT name FROM sqlite_master WHERE type="table"');
        console.log('Tables:', result.rows);
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

test();
