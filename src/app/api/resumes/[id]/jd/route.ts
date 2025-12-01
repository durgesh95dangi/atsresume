import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes, jobDescriptions } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { extractKeywords } from '@/lib/ai';
import { eq } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: 'Job description text is required' }, { status: 400 });
        }

        // Extract keywords using AI
        const keywords = await extractKeywords(text);

        // Save JD
        const [newJD] = await db.insert(jobDescriptions).values({
            userId: session.userId,
            text,
            keywords: JSON.stringify(keywords),
        }).returning();

        // Link JD to Resume
        await db.update(resumes)
            .set({ jobDescriptionId: newJD.id })
            .where(eq(resumes.id, id));

        return NextResponse.json({ ...newJD, keywords });
    } catch (error) {
        console.error('Error saving JD:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
