import React from 'react';
import { Select } from './Select';
import { Label } from './Label';
import { UseFormRegisterReturn } from 'react-hook-form';
import { getYear } from 'date-fns';
import { cn } from '@/lib/utils';

interface YearSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    registration: UseFormRegisterReturn;
    error?: string;
    className?: string;
    startYear?: number;
    futureYears?: number;
}

export const YearSelect = React.forwardRef<HTMLSelectElement, YearSelectProps>(
    ({ label, registration, error, className, startYear = 1980, futureYears = 5, ...props }, ref) => {
        const currentYear = getYear(new Date());
        const endYear = currentYear + futureYears;

        const years = [];
        for (let year = endYear; year >= startYear; year--) {
            years.push(year);
        }

        return (
            <div className={cn("space-y-2", className)}>
                <Label>{label}</Label>
                <Select
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
                >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </Select>
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
        );
    }
);

YearSelect.displayName = 'YearSelect';
