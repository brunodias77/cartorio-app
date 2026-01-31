import type { ButtonHTMLAttributes, ReactNode, ElementType } from "react";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: ElementType;
}

export const SocialButton = ({ children, icon: Icon, ...props }: SocialButtonProps) => (
    <button
        type="button"
        className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-200 transition-all"
        {...props}
    >
        {Icon ? <Icon className="h-5 w-5 mr-2 text-slate-900" /> : null}
        {children}
    </button>
);
