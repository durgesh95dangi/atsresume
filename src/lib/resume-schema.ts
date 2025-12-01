import { z } from 'zod';

export const resumeSchema = z.object({
    portfolio: z.object({
        main: z.string().optional(),
        other: z.union([z.string(), z.array(z.string())]).optional(),
    }).optional(),
    summary: z.object({
        years: z.string().optional(),
        strengths: z.string().optional(),
        background: z.string().optional(),
    }).optional(),
    skills: z.object({
        core: z.string().optional(),
        tools: z.string().optional(),
        soft: z.string().optional(),
    }).optional(),
    experience: z.array(z.object({
        company: z.string().min(1, "Company is required"),
        title: z.string().min(1, "Title is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        currentlyWorking: z.boolean().optional(),
        responsibilities: z.string().optional(),
    })).superRefine((data, ctx) => {
        data.forEach((exp, index) => {
            if (!exp.currentlyWorking && !exp.endDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "End date is required",
                    path: [index, "endDate"],
                });
            }
            if (exp.startDate && exp.endDate && !exp.currentlyWorking) {
                if (new Date(exp.endDate) < new Date(exp.startDate)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "End date cannot be before start date",
                        path: [index, "endDate"],
                    });
                }
            }
        });
    }),
    projects: z.array(z.object({
        title: z.string().optional(),
        role: z.string().optional(),
        description: z.string().optional(),
        impact: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
        degree: z.string().min(1, "Degree is required"),
        institute: z.string().min(1, "Institute is required"),
        year: z.string().min(1, "Year is required"),
    })).optional(),
    certifications: z.string().optional(),
});

export type ResumeSchema = z.infer<typeof resumeSchema>;
