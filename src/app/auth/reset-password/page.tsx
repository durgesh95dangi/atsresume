'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validations';
import { z } from 'zod';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token || '',
        },
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Something went wrong');
                return;
            }

            router.push('/auth/sign-in?reset=success');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-600">
                Invalid or missing token.
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormError message={error || undefined} />

            <input type="hidden" {...register('token')} />

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
                    Reset Password
                </Button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Set new password</h2>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordFormContent />
            </Suspense>
        </div>
    );
}
