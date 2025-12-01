'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResumeEditorPage() {
    const params = useParams();
    const [resume, setResume] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchResume() {
            try {
                const res = await fetch(`/api/resumes/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Parse content if it's a string
                    if (typeof data.content === 'string') {
                        data.content = JSON.parse(data.content);
                    }
                    setResume(data);
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            fetchResume();
        }
    }, [params.id]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!resume) {
        return <div className="flex h-screen items-center justify-center">Resume not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Toolbar */}
            <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 shadow-sm print:hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
                            {resume.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm">
                            Edit Content
                        </Button>
                        <Link href={`/resume/${params.id}/preview`}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2">
                                Generate Resume
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto print:p-0 print:overflow-visible">
                <div className="max-w-[210mm] mx-auto print:max-w-none print:mx-0">
                    <ResumePreview data={resume.content} />
                </div>
            </main>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white;
          }
          #resume-preview {
            box-shadow: none;
            margin: 0;
            width: 100%;
            max-width: none;
            padding: 20mm; /* Add print padding */
          }
        }
      `}</style>
        </div>
    );
}
