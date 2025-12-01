'use client';

import { cn } from '@/lib/utils';

interface ResumePreviewProps {
    data: any;
    className?: string;
}

export function ResumePreview({ data, className }: ResumePreviewProps) {
    if (!data) return null;

    const { personalDetails, summary, experience, education, skills, projects, certifications } = data;

    // ATS Friendly Colors: Pure Black for text
    const colors = {
        black: '#000000',
        link: '#0000EE', // Standard link blue
    };

    return (
        <div
            className={cn("shadow-lg mx-auto p-[1in] max-w-[210mm] min-h-[297mm] font-arial", className)}
            id="resume-preview"
            style={{ backgroundColor: '#ffffff', color: colors.black, fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
            {/* Header */}
            <div className="border-b border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2" style={{ color: colors.black }}>{personalDetails?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: colors.black }}>
                    {personalDetails?.email && <span>{personalDetails.email}</span>}
                    {personalDetails?.phone && <span>| {personalDetails.phone}</span>}
                    {personalDetails?.location && <span>| {personalDetails.location}</span>}
                    {personalDetails?.portfolioUrl && <span>| <a href={personalDetails.portfolioUrl} className="hover:underline" style={{ color: colors.link }}>{personalDetails.portfolioUrl}</a></span>}
                </div>
                {personalDetails?.headline && <div className="mt-2 text-lg font-medium" style={{ color: colors.black }}>{personalDetails.headline}</div>}
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-2" style={{ color: colors.black }}>Professional Summary</h2>
                    <p className="text-sm leading-relaxed" style={{ color: colors.black }}>{summary.summary || summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-3" style={{ color: colors.black }}>Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp: any, index: number) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-sm" style={{ color: colors.black }}>{exp.title}</h3>
                                    <span className="text-sm font-medium" style={{ color: colors.black }}>{exp.duration}</span>
                                </div>
                                <div className="text-sm font-medium mb-2 italic" style={{ color: colors.black }}>{exp.company}</div>
                                <ul className="list-disc list-outside ml-5 space-y-1 text-sm" style={{ color: colors.black }}>
                                    {Array.isArray(exp.responsibilities) ? (
                                        exp.responsibilities.map((resp: string, i: number) => (
                                            <li key={i}>{resp.replace(/^•\s*/, '')}</li>
                                        ))
                                    ) : (
                                        <li>{exp.responsibilities}</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-3" style={{ color: colors.black }}>Projects</h2>
                    <div className="space-y-4">
                        {projects.map((proj: any, index: number) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-sm" style={{ color: colors.black }}>{proj.title}</h3>
                                    <span className="text-sm font-medium" style={{ color: colors.black }}>{proj.role}</span>
                                </div>
                                <p className="text-sm mb-1" style={{ color: colors.black }}>{proj.description}</p>
                                {proj.impact && <p className="text-sm italic" style={{ color: colors.black }}>Impact: {proj.impact}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-3" style={{ color: colors.black }}>Skills</h2>
                    <div className="text-sm space-y-2">
                        {skills.core && (
                            <div>
                                <span className="font-bold" style={{ color: colors.black }}>Core: </span>
                                <span style={{ color: colors.black }}>{skills.core}</span>
                            </div>
                        )}
                        {skills.tools && (
                            <div>
                                <span className="font-bold" style={{ color: colors.black }}>Tools: </span>
                                <span style={{ color: colors.black }}>{skills.tools}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-3" style={{ color: colors.black }}>Education</h2>
                    <div className="space-y-2">
                        {education.map((edu: any, index: number) => (
                            <div key={index} className="flex justify-between items-baseline text-sm">
                                <div>
                                    <span className="font-bold" style={{ color: colors.black }}>{edu.degree}</span>
                                    <span style={{ color: colors.black }}>, {edu.institute}</span>
                                </div>
                                <span className="font-medium" style={{ color: colors.black }}>{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
