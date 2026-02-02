import { getCurrentUser, logoutUser } from "../services/auth-service";
import { formatLongDate } from "../utils/date-util";
import { Building2, Clock, LogOut } from 'lucide-react';

const getInitials = (name?: string | null) => {
    if (!name) return "";

    const parts = name.trim().split(" ");

    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

    return (first + last).toUpperCase();
};


export const Header = () => {
    const handleLogout = async () => {
        await logoutUser();
    };

    const currentDate = formatLongDate(new Date());
    const user = getCurrentUser();
    const userName = user?.displayName || user?.email || "Usuário";
    const initials = getInitials(userName);

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-200 z-20 flex items-center px-6 justify-between lg:pl-64">
            <div className="lg:hidden flex items-center gap-3 font-bold text-slate-700">
                <Building2 className="text-blue-600" aria-hidden="true" />
                Cartório Digital
            </div>

            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 ml-10">
                <Clock size={16} aria-hidden="true" />
                <time dateTime={new Date().toISOString()}>{currentDate}</time>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">Olá, {userName}</span>
                <div
                    className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs"
                    aria-label="Avatar do usuário"
                >
                    {initials}
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Sair do sistema"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};
