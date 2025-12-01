'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wizard } from '@/components/onboarding/Wizard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { fetchWithTimeout } from '@/lib/utils';
import { ResumeSchema } from '@/lib/resume-schema';

export default function EditResumePage() {
    const params = useParams();
    const router = useRouter();
    const [resume, setResume] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchResume() {
            try {
                const res = await fetchWithTimeout(`/api/resumes/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Parse content if it's a string
                    if (typeof data.content === 'string') {
                        data.content = JSON.parse(data.content);
                    }
                    setResume(data);
                } else {
                    setError('Failed to fetch resume');
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
                setError('Failed to load resume');
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            fetchResume();
        }
    }, [params.id]);

    const handleUpdate = async (data: ResumeSchema) => {
        setIsLoading(true);
        try {
            const res = await fetchWithTimeout(`/api/resumes/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: data,
                    role: resume.role, // Preserve role
                    status: 'completed'
                }),
            });

            if (res.ok) {
                router.push(`/resume/${params.id}/preview`);
            } else {
                throw new Error('Failed to update resume');
            }
        } catch (error) {
            console.error('Error updating resume:', error);
            setError('Failed to update resume. Please try again.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !resume) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full text-red-600">
                    {error || 'Resume not found'}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Edit Resume</h1>
                    <p className="text-slate-600">Update your resume details below.</p>
                </div>

                <Wizard
                    role={resume.role || 'Full Stack Developer'} // Fallback if role missing
                    initialData={resume.content}
                    onComplete={handleUpdate}
                />
            </div>
        </DashboardLayout>
    );
}
