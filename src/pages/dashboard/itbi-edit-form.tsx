import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { User, Phone, FileText, CheckCircle, Send } from 'lucide-react';
import { atualizarITBI, listarStatus, type StatusData } from '../../services/itbi-service';
import { useToast } from '../../components/sonner-custom';
import type { ITBIData } from '../../services/itbi-service';

interface ItbiEditFormProps {
    itbi: ITBIData;
    onSuccess: () => void;
    onCancel: () => void;
}

// Phone masking utilities
const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length <= 10) return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
};

const unformatPhone = (value: string): string => {
    return value.replace(/\D/g, '');
};

export const ItbiEditForm = ({ itbi, onSuccess, onCancel }: ItbiEditFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [telefone, setTelefone] = useState('');
    const [statusList, setStatusList] = useState<StatusData[]>([]);
    const [solicitadoId, setSolicitadoId] = useState(itbi.solicitadoId);
    const [enviadoId, setEnviadoId] = useState(itbi.enviadoId);
    const toast = useToast();

    // Initialize form with existing data
    useEffect(() => {
        if (itbi.telefoneCliente) {
            setTelefone(formatPhone(itbi.telefoneCliente));
        }
        setSolicitadoId(itbi.solicitadoId);
        setEnviadoId(itbi.enviadoId);
        loadStatus();
    }, [itbi]);

    const loadStatus = async () => {
        const result = await listarStatus();
        if (result.success && result.data) {
            setStatusList(result.data);
        } else {
            toast.error("Erro ao carregar status");
        }
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setTelefone(formatted);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Phone validation
        const phoneNumbers = unformatPhone(telefone);
        if (phoneNumbers && (phoneNumbers.length < 10 || phoneNumbers.length > 11)) {
            toast.error('Telefone inválido', 'Digite um telefone com DDD (10 ou 11 dígitos)');
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const updateData: Partial<ITBIData> = {
            nomeCliente: formData.get('nomeCliente') as string,
            telefoneCliente: phoneNumbers || null,
            numeroProtocolo: formData.get('numeroProtocolo') as string,
            solicitadoId: solicitadoId,
            enviadoId: enviadoId,
        };

        try {
            if (itbi.id) {
                await atualizarITBI(itbi.id, updateData);
                toast.success('ITBI atualizado com sucesso!');
                onSuccess();
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar ITBI';
            toast.error('Erro ao atualizar', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    id="nomeCliente"
                    name="nomeCliente"
                    type="text"
                    label="Nome do Cliente"
                    defaultValue={itbi.nomeCliente}
                    placeholder="Digite o nome completo"
                    required
                    icon={User}
                />

                <Input
                    id="telefoneCliente"
                    name="telefoneCliente"
                    type="tel"
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    icon={Phone}
                    value={telefone}
                    onChange={handlePhoneChange}
                />
            </div>

            <Input
                id="numeroProtocolo"
                name="numeroProtocolo"
                type="text"
                label="Número de Protocolo"
                defaultValue={itbi.numeroProtocolo}
                placeholder="Ex: 2024-1234"
                required
                icon={FileText}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="solicitadoId" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <CheckCircle size={16} className="text-slate-400" />
                        Status Solicitação
                    </label>
                    <div className="relative">
                        <select
                            id="solicitadoId"
                            name="solicitadoId"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                            value={solicitadoId}
                            onChange={(e) => setSolicitadoId(Number(e.target.value))}
                        >
                            {statusList.map(status => (
                                <option key={`sol-${status.id}`} value={status.id}>
                                    {status.descricao}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="enviadoId" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Send size={16} className="text-slate-400" />
                        Status Envio
                    </label>
                    <div className="relative">
                        <select
                            id="enviadoId"
                            name="enviadoId"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                            value={enviadoId}
                            onChange={(e) => setEnviadoId(Number(e.target.value))}
                        >
                            {statusList.map(status => (
                                <option key={`env-${status.id}`} value={status.id}>
                                    {status.descricao}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancelar
                </button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                    {!isLoading && 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    );
};
