import { Building2, FileText } from 'lucide-react';

export const Sidebar = () => (
    <aside className="fixed hidden lg:flex flex-col top-0 left-0 h-full w-64 bg-white border-r border-slate-200 text-white z-30">
        <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight text-slate-800">
            <Building2 className="mr-3 text-blue-400" aria-hidden="true" />
            <h2 className='text-sm' >CARTÓRIO DE NOTAS </h2>
        </div>

        <nav className="p-4 space-y-2" aria-label="Menu principal">
            <div className="px-4 py-3 bg-blue-600 rounded-xl text-sm font-medium shadow-lg shadow-blue-900/50 flex items-center gap-3">
                <FileText size={18} aria-hidden="true" />
                Dashboard ITBI
            </div>
        </nav>
    </aside>
);