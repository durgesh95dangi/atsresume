import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { generateResumeDraft } from '@/lib/ai';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { content, role, status } = body;

        // Generate draft if not already generated (mock AI)
        const refinedContent = await generateResumeDraft(content, role || 'Professional');

        const updateData: any = {
            content: JSON.stringify(refinedContent),
            updatedAt: new Date(),
        };

        if (status) {
            updateData.status = status;
        }

        const [updatedResume] = await db.update(resumes)
            .set(updateData)
            .where(and(eq(resumes.id, id), eq(resumes.userId, session.userId)))
            .returning();

        if (!updatedResume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(updatedResume);
    } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const [resume] = await db.select()
            .from(resumes)
            .where(and(eq(resumes.id, id), eq(resumes.userId, session.userId)))
            .limit(1);

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
