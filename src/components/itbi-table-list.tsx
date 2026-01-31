import { Pencil, Search, Trash2 } from 'lucide-react';
import type { Itbi } from '../types/itbi';
import { MESSAGES } from '../constants/messages';
import { Badge } from "./badge";
import { Card } from './card';
import { formatDate } from '../utils/date-util';

interface ItbiTableListProps {
    itbis: Itbi[];
    onEdit: (itbi: Itbi) => void;
    onDelete: (id: string) => void;
}

export const ItbiTableList = ({ itbis, onEdit, onDelete }: ItbiTableListProps) => {
    if (itbis.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                Nenhum registro encontrado.
            </div>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Telefone</th>
                            <th className="px-6 py-4 text-center">Solicitado?</th>
                            <th className="px-6 py-4">Protocolo</th>
                            <th className="px-6 py-4 text-center">Enviado?</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {itbis.length > 0 ? (
                            itbis.map((itbis) => (
                                <tr key={itbis.id} className="group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-800">
                                            {itbis.nomeCliente}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Cadastrado em {formatDate(itbis.dataCadastro)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                        {itbis.telefoneCliente}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge status={itbis.solicitadoDescricao} />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">
                                        {itbis.numeroProtocolo}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge status={itbis.enviadoDescricao} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(itbis)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                aria-label="Editar itbi"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(itbis.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                aria-label="Excluir itbi"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <Search size={24} className="text-slate-300" />
                                        </div>
                                        <p>{MESSAGES.noDataFound}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

