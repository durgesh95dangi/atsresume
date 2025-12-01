'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';
import { FormSuccess } from '@/components/ui/FormSuccess';

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Something went wrong');
                return;
            }

            setMessage(result.message);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email to receive a reset link
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <FormError message={error || undefined} />
                <FormSuccess message={message || undefined} />

                <FormField label="Email address" error={errors.email?.message}>
                    <Input
                        id="email"
                        type="email"
                        error={!!errors.email}
                        {...register('email')}
                    />
                </FormField>

                <div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        Send reset link
                    </Button>
                </div>

                <div className="text-center text-sm">
                    <Link href="/auth/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
                        Back to sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
