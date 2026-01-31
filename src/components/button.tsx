import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isLoading?: boolean;
    className?: string;
}

export const Button = ({ children, isLoading, className = "", ...props }: ButtonProps) => (
    <button
        disabled={isLoading || props.disabled}
        className={`relative w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group ${className}`}
        {...props}
    >
        {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
            children
        )}
    </button>
);
