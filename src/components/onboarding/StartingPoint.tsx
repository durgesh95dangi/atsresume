'use client';

import { Button } from '@/components/ui/Button';
import { FileText, Upload } from 'lucide-react';

interface StartingPointProps {
    onSelect: (mode: 'scratch' | 'import') => void;
}

export function StartingPoint({ onSelect }: StartingPointProps) {
    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">How would you like to start?</h2>
                <p className="text-slate-600 mt-2">Choose the best way to build your resume.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <button
                    onClick={() => onSelect('scratch')}
                    className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all group"
                >
                    <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4 group-hover:bg-blue-100">
                        <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Start from Scratch</h3>
                    <p className="text-sm text-slate-500 mt-2 text-center">Build step-by-step with AI guidance.</p>
                </button>

                <button
                    onClick={() => onSelect('import')}
                    className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all group"
                >
                    <div className="p-4 bg-green-50 rounded-full text-green-600 mb-4 group-hover:bg-green-100">
                        <Upload className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Import Resume</h3>
                    <p className="text-sm text-slate-500 mt-2 text-center">Upload an existing PDF or DOCX.</p>
                </button>
            </div>
        </div>
    );
}
