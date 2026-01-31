import type { InputHTMLAttributes, ReactNode, ElementType } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ElementType;
    rightElement?: ReactNode;
}

export const Input = ({ id, name, label, type = "text", icon: Icon, rightElement, ...props }: InputProps) => (
    <div className="space-y-2">
        {label && <label htmlFor={id} className="text-sm font-medium text-slate-900">{label}</label>}
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                {Icon && <Icon className="h-5 w-5" />}
            </div>
            <input
                id={id}
                name={name}
                type={type}
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-blue-500 transition-all shadow-sm"
                {...props}
            />
            {rightElement && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
);
