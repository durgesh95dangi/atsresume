import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/db/schema';
import { forgotPasswordSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { email } = result.data;

        // Check if user exists
        const user = await db.select().from(users).where(eq(users.email, email)).get();

        // Always return success to prevent enumeration
        if (!user) {
            return NextResponse.json({ success: true, message: 'If the email exists, we sent a reset link.' });
        }

        // Generate token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        // Save token
        await db.insert(passwordResetTokens).values({
            userId: user.id,
            token,
            expiresAt,
        });

        // Log reset link
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        console.log(`Password Reset Link: ${appUrl}/auth/reset-password?token=${token}`);

        return NextResponse.json({ success: true, message: 'If the email exists, we sent a reset link.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
