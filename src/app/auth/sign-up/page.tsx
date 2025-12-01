'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/lib/validations';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpForm) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.error && typeof result.error === 'object') {
                    setError('Please check your input.');
                } else {
                    setError(result.error || 'Something went wrong');
                }
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
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign up</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <FormError message={error || undefined} />

                <FormField label="Name" error={errors.name?.message}>
                    <Input
                        id="name"
                        type="text"
                        error={!!errors.name}
                        {...register('name')}
                    />
                </FormField>

                <FormField label="Email address" error={errors.email?.message}>
                    <Input
                        id="email"
                        type="email"
                        error={!!errors.email}
                        {...register('email')}
                    />
                </FormField>

                <FormField label="Headline (Optional)" error={errors.headline?.message}>
                    <Input
                        id="headline"
                        type="text"
                        placeholder="e.g. Senior Product Designer"
                        error={!!errors.headline}
                        {...register('headline')}
                    />
                </FormField>

                <FormField label="Location (Optional)" error={errors.location?.message}>
                    <Input
                        id="location"
                        type="text"
                        placeholder="e.g. New York, NY"
                        error={!!errors.location}
                        {...register('location')}
                    />
                </FormField>

                <FormField label="Portfolio URL (Optional)" error={errors.portfolioUrl?.message}>
                    <Input
                        id="portfolioUrl"
                        type="url"
                        placeholder="https://..."
                        error={!!errors.portfolioUrl}
                        {...register('portfolioUrl')}
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

                <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
                    <Input
                        id="confirmPassword"
                        type="password"
                        error={!!errors.confirmPassword}
                        {...register('confirmPassword')}
                    />
                </FormField>

                <div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        Sign up
                    </Button>
                </div>
            </form>
        </div>
    );
}
