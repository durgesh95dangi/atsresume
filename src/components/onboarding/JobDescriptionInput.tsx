'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

interface JobDescriptionInputProps {
    onNext: (jdText?: string) => void;
    onSkip: () => void;
    isLoading?: boolean;
}

export function JobDescriptionInput({ onNext, onSkip, isLoading }: JobDescriptionInputProps) {
    const [jdText, setJdText] = useState('');

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Add a Job Description (Optional)</h2>
                <p className="text-slate-600 mt-2">Paste the JD to help our AI optimize your resume with the right keywords.</p>
            </div>

            <div className="space-y-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="jdText">Job Description</Label>
                    <Textarea
                        id="jdText"
                        placeholder="Paste the job description here..."
                        className="min-h-[200px]"
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={onSkip}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Skip
                    </Button>
                    <Button
                        onClick={() => onNext(jdText)}
                        disabled={!jdText.trim() || isLoading}
                        className="flex-1"
                        isLoading={isLoading}
                    >
                        Analyze & Continue
                    </Button>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800 text-sm">
                {jdText ? (
                    <p><strong>AI Agent:</strong> "Perfect! I’ll use this to optimize your resume with the right keywords."</p>
                ) : (
                    <p><strong>AI Agent:</strong> "All good — I’ll still create a strong resume for your role."</p>
                )}
            </div>
        </div>
    );
}
