export async function extractKeywords(jdText: string): Promise<string[]> {
    // Mock AI keyword extraction for now
    // In a real app, this would call an LLM API
    const commonKeywords = ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Next.js', 'Figma', 'User Research', 'Prototyping', 'Agile', 'Scrum'];
    const extracted = commonKeywords.filter(keyword => jdText.toLowerCase().includes(keyword.toLowerCase()));
    return extracted.length > 0 ? extracted : ['Communication', 'Teamwork', 'Problem Solving'];
}

export async function generateResumeDraft(data: any, role: string, jdText?: string): Promise<any> {
    // Mock AI draft generation
    const skillsString = typeof data.skills === 'object'
        ? [data.skills.core, data.skills.tools].filter(Boolean).join(', ')
        : (Array.isArray(data.skills) ? data.skills.join(', ') : 'relevant technologies');

    return {
        ...data,
        summary: `Experienced ${role} with a proven track record. Skilled in ${skillsString}. Committed to delivering high-quality results.`,
        experience: data.experience?.map((exp: any) => ({
            ...exp,
            responsibilities: typeof exp.responsibilities === 'string'
                ? `• ${exp.responsibilities} (Enhanced by AI)`
                : (Array.isArray(exp.responsibilities) ? exp.responsibilities.map((resp: string) => `• ${resp} (Enhanced by AI)`) : exp.responsibilities),
        })),
    };
}

export async function rewriteBullet(bullet: string, role: string): Promise<string> {
    return `• ${bullet} [Optimized for ${role}]`;
}

export async function rewriteSummary(data: any, role: string): Promise<string> {
    return `Professional ${role} summary generated based on provided details.`;
}

export async function calculateMatchScore(resumeContent: any, jdText: string): Promise<{ score: number; missingKeywords: string[]; suggestions: string[] }> {
    // Mock ATS scoring
    return {
        score: 75,
        missingKeywords: ['GraphQL', 'AWS'],
        suggestions: ['Include more metrics in your experience.', 'Add a skills section matching the JD.'],
    };
}
