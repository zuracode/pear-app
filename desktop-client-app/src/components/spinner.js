import { Loader2 } from 'lucide-react';
import { html } from 'htm/react';
import { cn } from '../lib/utils';

export const LoadingSpinner = ({
    size = 'md',
    variant = 'primary',
    className,
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const variantClasses = {
        primary: 'text-primary',
        secondary: 'text-secondary',
    };

    return html`<${Loader2}
        className=${cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant],
            className
        )}
    />`;
};
