import { Search, Plus } from 'lucide-react';
import { MESSAGES } from '../constants/messages';

interface ItbiSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onCreateClick: () => void;
}

export const ItbiSearch = ({ searchTerm, onSearchChange, onCreateClick }: ItbiSearchProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
            <div className="relative w-full md:w-96 group">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    size={20}
                />
                <input
                    type="text"
                    placeholder={MESSAGES.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                />
            </div>
            <button
                onClick={onCreateClick}
                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                <Plus size={20} />
                Novo Protocolo
            </button>
        </div>
    );
};