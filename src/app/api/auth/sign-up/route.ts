import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { createSession } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { signUpSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = signUpSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, email, password, headline, location, portfolioUrl } = result.data;

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await db.insert(users).values({
            name,
            email,
            passwordHash: hashedPassword,
            headline,
            location,
            portfolioUrl,
        }).returning().get();

        // Create session
        await createSession(newUser.id);

        return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error('Sign up error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
