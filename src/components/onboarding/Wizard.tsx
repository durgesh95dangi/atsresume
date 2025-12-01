'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { DateField } from '@/components/ui/DateField';
import { YearSelect } from '@/components/ui/YearSelect';
import { Checkbox } from '@/components/ui/Checkbox';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, ResumeSchema } from '@/lib/resume-schema';
import { fetchWithTimeout } from '@/lib/utils';
import { StepConfig, FieldConfig } from '@/lib/form-config';
import { FormError } from '@/components/ui/FormError';

interface WizardProps {
    role: string;
    initialData?: ResumeSchema;
    onComplete: (data: any) => void;
}

export function Wizard({ role, initialData, onComplete }: WizardProps) {
    const [steps, setSteps] = useState<StepConfig[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);
    const [configError, setConfigError] = useState('');

    const { register, control, handleSubmit, watch, trigger, formState: { errors } } = useForm<ResumeSchema>({
        resolver: zodResolver(resumeSchema),
        defaultValues: initialData || {
            portfolio: { main: '', other: [] },
            summary: { years: '', strengths: '', background: '' },
            skills: { core: '', tools: '', soft: '' },
            experience: [{ company: '', title: '', startDate: '', endDate: '', currentlyWorking: false, responsibilities: '' }],
            projects: [{ title: '', role: '', description: '', impact: '' }],
            education: [{ degree: '', institute: '', year: '' }],
            certifications: '',
        },
    });

    // Always initialize field arrays for supported array types
    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });
    const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: 'projects' });
    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetchWithTimeout(`/api/forms/resume?role=${encodeURIComponent(role)}`);
                if (!res.ok) throw new Error('Failed to load form configuration');
                const data = await res.json();
                setSteps(data);
            } catch (error) {
                console.error('Error fetching form config:', error);
                setConfigError('Failed to load form. Please refresh.');
            } finally {
                setIsLoadingConfig(false);
            }
        };
        fetchConfig();
    }, [role]);

    const onSubmit = (data: ResumeSchema) => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            // Transform experience dates to duration string
            const transformedData = {
                ...data,
                experience: data.experience?.map((exp) => ({
                    ...exp,
                    duration: exp.currentlyWorking
                        ? `${exp.startDate} - Present`
                        : `${exp.startDate} - ${exp.endDate}`,
                }))
            };
            onComplete(transformedData);
        }
    };

    const renderField = (field: FieldConfig, parentName?: string, index?: number) => {
        const fieldName = parentName ? `${parentName}.${index}.${field.name}` : field.name;
        // Helper to get nested error
        const getError = (name: string) => {
            const parts = name.split('.');
            let current: any = errors;
            for (const part of parts) {
                if (current && current[part]) {
                    current = current[part];
                } else {
                    return undefined;
                }
            }
            return current?.message;
        };

        const errorMsg = getError(fieldName);

        switch (field.type) {
            case 'text':
                return (
                    <div key={fieldName} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Input {...register(fieldName as any)} placeholder={field.placeholder} error={!!errorMsg} />
                        {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
                    </div>
                );
            case 'textarea':
                return (
                    <div key={fieldName} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Textarea {...register(fieldName as any)} placeholder={field.placeholder} error={!!errorMsg} />
                        {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
                    </div>
                );
            case 'date':
                // Special handling for End Date disabling
                const isEndDate = field.name === 'endDate';
                const isCurrent = parentName && index !== undefined ? watch(`${parentName}.${index}.currentlyWorking` as any) : false;

                return (
                    <DateField
                        key={fieldName}
                        label={field.label}
                        registration={register(fieldName as any)}
                        error={errorMsg}
                        disabled={isEndDate && isCurrent}
                    />
                );
            case 'select':
                if (field.name === 'year') {
                    return (
                        <YearSelect
                            key={fieldName}
                            label={field.label}
                            registration={register(fieldName as any)}
                            error={errorMsg}
                        />
                    );
                }
                // Generic select if needed
                return null;
            case 'checkbox':
                return (
                    <div key={fieldName} className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id={fieldName}
                            {...register(fieldName as any)}
                        />
                        <Label htmlFor={fieldName} className="mb-0">{field.label}</Label>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderArrayField = (field: FieldConfig) => {
        let fields: any[] = [];
        let append: any;
        let remove: any;
        let defaultItem: any = {};

        if (field.name === 'experience') {
            fields = expFields;
            append = appendExp;
            remove = removeExp;
            defaultItem = { company: '', title: '', startDate: '', endDate: '', currentlyWorking: false, responsibilities: '' };
        } else if (field.name === 'projects') {
            fields = projFields;
            append = appendProj;
            remove = removeProj;
            defaultItem = { title: '', role: '', description: '', impact: '' };
        } else if (field.name === 'education') {
            fields = eduFields;
            append = appendEdu;
            remove = removeEdu;
            defaultItem = { degree: '', institute: '', year: '' };
        }

        return (
            <div className="space-y-6">
                {fields.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-md space-y-4 relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 gap-4">
                            {field.arrayFields?.map(subField => {
                                // Group Start/End date and Checkbox logic visually if needed, 
                                // but for generic rendering, simple list is fine.
                                // To match previous layout (grid), we can check names.
                                return renderField(subField, field.name, index);
                            })}
                        </div>
                    </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => append(defaultItem)}>
                    <Plus className="h-4 w-4 mr-2" /> Add {field.label}
                </Button>
            </div>
        );
    };

    if (isLoadingConfig) {
        return <div className="text-center py-12">Loading form...</div>;
    }

    if (configError) {
        return <FormError message={configError} />;
    }

    if (steps.length === 0) {
        return <div>No steps found.</div>;
    }

    const currentStep = steps[currentStepIndex];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">{currentStep.title}</h2>
                <p className="text-slate-600 mt-2">Step {currentStepIndex + 1} of {steps.length}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-4">
                    {currentStep.fields.length === 0 && (
                        <div className="text-center py-8 space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-lg inline-block">
                                <p className="font-medium">You have completed all sections!</p>
                            </div>
                            <p className="text-slate-600">
                                Click <strong>Generate Resume</strong> below to create your professional resume.
                            </p>
                        </div>
                    )}
                    {currentStep.fields.map(field => {
                        if (field.type === 'array') {
                            return <div key={field.name}>{renderArrayField(field)}</div>;
                        }
                        return renderField(field);
                    })}
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                        disabled={currentStepIndex === 0}
                    >
                        Back
                    </Button>
                    <Button
                        type={currentStepIndex === steps.length - 1 ? 'submit' : 'button'}
                        onClick={async () => {
                            if (currentStepIndex < steps.length - 1) {
                                const fields = currentStep.fields.map(f => f.name);
                                console.log('Validating fields:', fields);
                                console.log('Current form values:', watch());
                                const isValid = await trigger(fields as any);
                                console.log('Validation result:', isValid);
                                console.log('Errors:', errors);
                                if (isValid) {
                                    setCurrentStepIndex(currentStepIndex + 1);
                                }
                            }
                        }}
                    >
                        {currentStepIndex === steps.length - 1 ? 'Generate Resume' : 'Next'}
                    </Button>
                </div>
            </form>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800 text-sm">
                <p><strong>AI Agent:</strong> "Tell me about your {currentStep.title.toLowerCase()}. Be specific!"</p>
            </div>
        </div>
    );
}
