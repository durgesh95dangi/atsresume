'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { DownloadButton } from '@/components/resume/DownloadButton';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResumePreviewPage() {
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
        <DashboardLayout>
            <div className="flex flex-col h-full">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <Link href={`/resume/${params.id}/edit`}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Edit Content
                            </Button>
                        </Link>
                        <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
                            Resume Preview
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <DownloadButton />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto print:overflow-visible">
                    <div className="flex justify-center items-start pb-8">
                        <div className="scale-[0.8] sm:scale-100 origin-top transition-transform duration-200">
                            <ResumePreview data={resume.content} />
                        </div>
                    </div>
                </div>

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
                 padding: 0;
               }
               /* Hide dashboard layout elements when printing */
               nav, aside, header {
                 display: none !important;
               }
             }
           `}</style>
            </div>
        </DashboardLayout>
    );
}
