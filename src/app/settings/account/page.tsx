'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@/lib/validations';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';
import { FormSuccess } from '@/components/ui/FormSuccess';

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function AccountSettingsPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordForm>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordForm) => {
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
        <div className="mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Account Settings</h2>
                    <p className="mt-1 text-sm text-gray-600">Change your password</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <FormError message={error || undefined} />
                    <FormSuccess message={message || undefined} />

                    <FormField label="Current Password" error={errors.currentPassword?.message}>
                        <Input
                            id="currentPassword"
                            type="password"
                            error={!!errors.currentPassword}
                            {...register('currentPassword')}
                        />
                    </FormField>

                    <FormField label="New Password" error={errors.newPassword?.message}>
                        <Input
                            id="newPassword"
                            type="password"
                            error={!!errors.newPassword}
                            {...register('newPassword')}
                        />
                    </FormField>

                    <FormField label="Confirm New Password" error={errors.confirmNewPassword?.message}>
                        <Input
                            id="confirmNewPassword"
                            type="password"
                            error={!!errors.confirmNewPassword}
                            {...register('confirmNewPassword')}
                        />
                    </FormField>

                    <div>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
