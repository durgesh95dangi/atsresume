import * as React from 'react';
import { Label } from './Label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
    error?: string;
    children: React.ReactNode;
}

export function FormField({ label, error, children, className, ...props }: FormFieldProps) {
    return (
        <div className={cn('space-y-1', className)} {...props}>
            {label && <Label>{label}</Label>}
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
