'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/lib/validations';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInForm) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/sign-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Something went wrong');
                return;
            }

            router.push('/dashboard');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <Link href="/auth/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
                        create an account
                    </Link>
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <FormError message={error || undefined} />

                <FormField label="Email address" error={errors.email?.message}>
                    <Input
                        id="email"
                        type="email"
                        error={!!errors.email}
                        {...register('email')}
                    />
                </FormField>

                <FormField label="Password" error={errors.password?.message}>
                    <Input
                        id="password"
                        type="password"
                        error={!!errors.password}
                        {...register('password')}
                    />
                </FormField>

                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
    );
}
