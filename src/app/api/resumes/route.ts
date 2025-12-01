import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes } from '@/db/schema';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { role, experienceLevel, targetRole } = body;

        if (!role || !experienceLevel) {
            return NextResponse.json({ error: 'Role and Experience Level are required' }, { status: 400 });
        }

        const [newResume] = await db.insert(resumes).values({
            userId: session.userId,
            title: `${role} Resume`,
            role,
            experienceLevel,
            targetRole: targetRole || role,
        }).returning();

        return NextResponse.json(newResume);
    } catch (error) {
        console.error('Error initializing resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const userResumes = await db.query.resumes.findMany({
            where: (resumes, { eq, and }) => {
                const conditions = [eq(resumes.userId, session.userId)];
                if (status) {
                    conditions.push(eq(resumes.status, status));
                }
                return and(...conditions);
            },
            orderBy: (resumes, { desc }) => [desc(resumes.updatedAt)],
        });

        return NextResponse.json(userResumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
