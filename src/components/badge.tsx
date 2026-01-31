import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface BadgeProps {
    status: string;
    onClick?: () => void;
    isInteractive?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
    Pendente: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    Sim: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    Não: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
};

const BADGE_ICONS: Record<string, ReactNode> = {
    Pendente: <Clock size={14} className="mr-1.5" />,
    Sim: <CheckCircle2 size={14} className="mr-1.5" />,
    Não: <XCircle size={14} className="mr-1.5" />,
};

export const Badge = ({ status, onClick, isInteractive = false }: BadgeProps) => {
    const styles = BADGE_STYLES[status] || BADGE_STYLES.Pendente;
    const icon = BADGE_ICONS[status] || BADGE_ICONS.Pendente;

    return (
        <button
            onClick={onClick}
            disabled={!isInteractive}
            className={`
        relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
        ${styles}
        ${isInteractive ? 'cursor-pointer hover:shadow-sm active:scale-95' : 'cursor-default'}
      `}
            aria-label={`Status: ${status}`}
        >
            {icon}
            {status}
        </button>
    );
};