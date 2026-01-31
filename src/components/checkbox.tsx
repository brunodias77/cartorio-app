import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

export const Checkbox = ({ label, id, ...props }: CheckboxProps) => (
    <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative flex items-center">
            <input
                type="checkbox"
                id={id}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 bg-slate-800/50 checked:border-violet-500 checked:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                {...props}
            />
            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
        </div>
        <label htmlFor={id} className="cursor-pointer text-sm text-slate-400 group-hover:text-slate-300 select-none transition-colors">
            {label}
        </label>
    </div>
);
