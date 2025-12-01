import React from 'react';
import { Input } from './Input';
import { Label } from './Label';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    registration: UseFormRegisterReturn;
    error?: string;
    className?: string;
}

export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
    ({ label, registration, error, className, ...props }, ref) => {
        return (
            <div className={cn("space-y-2", className)}>
                <Label>{label}</Label>
                <Input
                    type="date"
                    error={!!error}
                    {...props}
                    {...registration}
                    ref={(e) => {
                        registration.ref(e);
                        if (typeof ref === 'function') {
                            ref(e);
                        } else if (ref) {
                            ref.current = e;
                        }
                    }}
                />
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
        );
    }
);

DateField.displayName = 'DateField';
