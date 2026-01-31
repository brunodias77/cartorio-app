import type { ReactNode } from "react";

export interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
        {children}
    </div>
);