import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
    loading?: boolean;
};

const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-to-r from-indigo-400 to-purple-600 text-white dark:from-indigo-600 dark:to-purple-800',
    secondary: 'bg-purole-100 text-indigo-700 border-purple border dark:bg-zinc-800 dark:text-purple-200 dark:border-purple-700',
    danger: 'bg-red-500 text-white dark:bg-red-700 dark:text-white',
};

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className = '',
    loading = false,
    disabled,
    ...props
}) => (
    <button
        className={twMerge(`
            px-5 hover:opacity-90 py-1 rounded font-semibold text-base cursor-pointer transition`,
            variantClasses[variant],
            className)}
        disabled={loading || disabled}
        {...props}
    >
        {loading ? (
            <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Loading...
            </span>
        ) : (
            children
        )}
    </button>
);

export default Button;