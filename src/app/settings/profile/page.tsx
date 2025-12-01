'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { FormError } from '@/components/ui/FormError';
import { FormSuccess } from '@/components/ui/FormSuccess';
import { changePasswordSchema } from '@/lib/validations';

// --- Personal Details Form ---

const personalDetailsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    location: z.string().optional(),
    headline: z.string().optional(),
    portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

function PersonalDetailsForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PersonalDetailsFormValues>({
        resolver: zodResolver(personalDetailsSchema),
        defaultValues: {
            name: '',
            email: '',
            location: '',
            headline: '',
            portfolioUrl: '',
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/users/profile');
                if (res.ok) {
                    const data = await res.json();
                    reset({
                        name: data.name || '',
                        email: data.email || '',
                        location: data.location || '',
                        headline: data.headline || '',
                        portfolioUrl: data.portfolioUrl || '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        }
        fetchProfile();
    }, [reset]);

    const onSubmit = async (data: PersonalDetailsFormValues) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            setMessage('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={error || undefined} />
            <FormSuccess message={message || undefined} />

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register('name')} error={!!errors.name} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...register('email')} error={!!errors.email} disabled />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register('location')} placeholder="e.g. San Francisco, CA" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input id="headline" {...register('headline')} placeholder="e.g. Senior Product Designer" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <Input id="portfolioUrl" {...register('portfolioUrl')} placeholder="https://..." />
                    {errors.portfolioUrl && <p className="text-sm text-red-500">{errors.portfolioUrl.message}</p>}
                </div>
            </div>

            <Button type="submit" isLoading={isLoading}>
                Save changes
            </Button>
        </form>
    );
}

// --- Change Password Form ---

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

function ChangePasswordForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormValues) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Something went wrong');
                return;
            }

            setMessage('Password updated successfully');
            reset();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={error || undefined} />
            <FormSuccess message={message || undefined} />

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        {...register('currentPassword')}
                        error={!!errors.currentPassword}
                    />
                    {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        {...register('newPassword')}
                        error={!!errors.newPassword}
                    />
                    {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                        id="confirmNewPassword"
                        type="password"
                        {...register('confirmNewPassword')}
                        error={!!errors.confirmNewPassword}
                    />
                    {errors.confirmNewPassword && <p className="text-sm text-red-500">{errors.confirmNewPassword.message}</p>}
                </div>
            </div>

            <Button type="submit" isLoading={isLoading}>
                Update password
            </Button>
        </form>
    );
}

// --- Main Profile Page ---

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

// ... (imports)

// ... (PersonalDetailsForm)

// ... (ChangePasswordForm)

// --- Main Profile Page ---

export default function ProfileSettingsPage() {
    const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal');

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                    <p className="text-slate-600">Manage your account settings and preferences.</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-6">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'personal'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Personal Details
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'password'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Change Password
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'personal' ? <PersonalDetailsForm /> : <ChangePasswordForm />}
                </div>
            </div>
        </DashboardLayout>
    );
}
