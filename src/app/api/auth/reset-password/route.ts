import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/db/schema';
import { hashPassword } from '@/lib/password';
import { resetPasswordSchema } from '@/lib/validations';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = resetPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { token, newPassword } = result.data;

        // Verify token
        const resetToken = await db.select()
            .from(passwordResetTokens)
            .where(and(
                eq(passwordResetTokens.token, token),
                gt(passwordResetTokens.expiresAt, new Date())
            ))
            .get();

        if (!resetToken) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user password
        await db.update(users)
            .set({ passwordHash: hashedPassword, updatedAt: new Date() })
            .where(eq(users.id, resetToken.userId));

        // Delete used token
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
