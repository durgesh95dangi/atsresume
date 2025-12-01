import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';

export async function GET() {
    try {
        const allUsers = await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                email: true,
                headline: true,
                location: true,
                createdAt: true,
            },
            orderBy: (users, { desc }) => [desc(users.createdAt)],
        });

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Create user
        // Note: In a real app, hash the password!
        const newUser = await db.insert(users).values({
            name,
            email,
            passwordHash: password, // TODO: Hash this
        }).returning();

        return NextResponse.json(newUser[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
