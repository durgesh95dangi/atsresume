export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox' | 'array';
    placeholder?: string;
    options?: string[]; // For select
    arrayFields?: FieldConfig[]; // For array type
}

export interface StepConfig {
    id: string;
    title: string;
    fields: FieldConfig[];
}

export const getFormConfig = (role: string): StepConfig[] => {
    const isDesigner = role.includes('Designer');

    const steps: StepConfig[] = [];

    if (isDesigner) {
        steps.push({
            id: 'portfolio',
            title: 'Portfolio',
            fields: [
                { name: 'portfolio.main', label: 'Main Portfolio Link', type: 'text', placeholder: 'https://yourportfolio.com' },
                { name: 'portfolio.other', label: 'Other Links (Behance, Dribbble)', type: 'text', placeholder: 'Comma separated links' }
            ]
        });
    }

    steps.push({
        id: 'summary',
        title: 'Summary',
        fields: [
            { name: 'summary.years', label: 'Years of Experience', type: 'text', placeholder: 'e.g. 5 years' },
            { name: 'summary.strengths', label: 'Key Strengths', type: 'textarea', placeholder: 'What are you best at?' },
            { name: 'summary.background', label: 'Industry Background', type: 'text', placeholder: 'e.g. Fintech, E-commerce' }
        ]
    });

    steps.push({
        id: 'skills',
        title: 'Skills',
        fields: [
            { name: 'skills.core', label: 'Core Skills', type: 'textarea', placeholder: 'e.g. React, Node.js, Python' },
            { name: 'skills.tools', label: 'Tools', type: 'textarea', placeholder: 'e.g. VS Code, Figma, Jira' },
            { name: 'skills.soft', label: 'Soft Skills', type: 'textarea', placeholder: 'e.g. Leadership, Communication' }
        ]
    });

    steps.push({
        id: 'experience',
        title: 'Experience',
        fields: [
            {
                name: 'experience',
                label: 'Experience',
                type: 'array',
                arrayFields: [
                    { name: 'company', label: 'Company', type: 'text' },
                    { name: 'title', label: 'Title', type: 'text' },
                    { name: 'startDate', label: 'Joining Date', type: 'date' },
                    { name: 'endDate', label: 'Last Working Day', type: 'date' },
                    { name: 'currentlyWorking', label: 'Currently working here', type: 'checkbox' },
                    { name: 'responsibilities', label: 'Responsibilities & Achievements', type: 'textarea', placeholder: 'Describe what you did...' }
                ]
            }
        ]
    });

    steps.push({
        id: 'projects',
        title: 'Projects',
        fields: [
            {
                name: 'projects',
                label: 'Projects',
                type: 'array',
                arrayFields: [
                    { name: 'title', label: 'Project Title', type: 'text' },
                    { name: 'role', label: 'Your Role', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'impact', label: 'Impact / Metrics', type: 'text', placeholder: 'e.g. Increased conversion by 20%' }
                ]
            }
        ]
    });

    steps.push({
        id: 'education',
        title: 'Education',
        fields: [
            {
                name: 'education',
                label: 'Education',
                type: 'array',
                arrayFields: [
                    { name: 'degree', label: 'Degree', type: 'text' },
                    { name: 'institute', label: 'Institute', type: 'text' },
                    { name: 'year', label: 'Pass-out Year', type: 'select' } // Special handling for YearSelect
                ]
            }
        ]
    });

    steps.push({
        id: 'certifications',
        title: 'Certifications',
        fields: [
            { name: 'certifications', label: 'Certifications & Extras', type: 'textarea', placeholder: 'List your certifications, awards, or languages...' }
        ]
    });

    steps.push({
        id: 'review',
        title: 'Review & Finish',
        fields: []
    });

    return steps;
};
