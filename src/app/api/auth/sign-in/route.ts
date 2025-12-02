import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { createSession } from '@/lib/auth';
import { comparePassword } from '@/lib/password';
import { signInSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('SignIn API: Attempting login for', body.email);
        const result = signInSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { email, password } = result.data;

        // Find user
        const user = await db.select().from(users).where(eq(users.email, email)).get();
        if (!user) {
            console.log('SignIn API: User not found');
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Verify password
        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            console.log('SignIn API: Invalid password');
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Create session
        await createSession(user.id);
        console.log('SignIn API: Login successful for', user.email);

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Sign in error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
