'use client';

import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function DownloadButton() {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        const element = document.getElementById('resume-preview');
        if (!element) {
            console.error('Resume preview element not found');
            return;
        }

        try {
            setIsGenerating(true);

            // Capture the element as a canvas
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Handle images from other domains if any
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            } as any); // Cast to any to avoid type error with scale if types are outdated

            const imgData = canvas.toDataURL('image/png');

            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // If content is shorter than A4, it will just fit. 
            // If longer, we might need multiple pages, but requirements said "full-page single image".
            // We'll scale to fit width and let height be what it is, but for A4 strictness we might want to fit or crop.
            // The requirement says: "Adjust width/height ratio to 210 x 297 mm".
            // Let's stick to fitting width and adding image.

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('resume.pdf');

        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button onClick={handleDownload} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2">
            {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Download PDF'}
        </Button>
    );
}
