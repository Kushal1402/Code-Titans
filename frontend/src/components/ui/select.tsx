import React from 'react';
import { twMerge } from 'tailwind-merge';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { id: string; name: string }[];
    label?: string;
    error?: string;
};

const Select: React.FC<SelectProps> = ({ options, id, label, error, className = '', ...props }) => (
    <div>
        {label && (
            <label
                htmlFor={id}
                className="block text-sm font-medium mb-1"
            >
                {label}
            </label>
        )}
        <select
            className={twMerge(' px-4 py-2 rounded-lg border border-gray-300 w-full bg-white text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition mb-1',
                className)}
            {...props}
        >
            {options.map((opt,idx) => (
                <option key={idx} id={opt.id} value={opt.id} >
                    {opt.name}
                </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);

export default Select;