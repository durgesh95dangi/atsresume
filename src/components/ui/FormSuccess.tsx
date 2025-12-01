import { cn } from '@/lib/utils';

interface FormSuccessProps {
    message?: string;
    className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
    if (!message) return null;

    return (
        <div className={cn('rounded-md bg-green-50 p-3 text-sm text-green-700', className)}>
            <div className="flex items-center gap-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <p>{message}</p>
            </div>
        </div>
    );
}
