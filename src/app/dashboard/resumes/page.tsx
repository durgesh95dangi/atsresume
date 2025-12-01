'use client';

import { FileText, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fetchWithTimeout } from '@/lib/utils';

interface Resume {
    id: string;
    title: string;
    updatedAt: string;
}

export default function MyResumesPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await fetchWithTimeout('/api/resumes?status=completed');
                if (res.ok) {
                    const data = await res.json();
                    setResumes(data);
                }
            } catch (error) {
                console.error('Error fetching resumes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResumes();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
                    <p className="text-sm text-slate-500">Manage all your created resumes.</p>
                </div>
                <Link href="/resume/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Resume
                    </Button>
                </Link>
            </div>

            {/* Resumes List */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="divide-y divide-slate-200">
                    {isLoading ? (
                        <div className="p-6 text-center text-slate-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2">Loading resumes...</p>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            No resumes found. Create one to get started!
                        </div>
                    ) : (
                        resumes.map((resume) => (
                            <div key={resume.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{resume.title}</p>
                                        <p className="text-sm text-slate-500">
                                            Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/resume/${resume.id}/editor`}>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </Link>
                                    <Link href={`/resume/${resume.id}/preview`}>
                                        <Button variant="ghost" size="sm">Preview</Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
