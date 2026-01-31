import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { User, Phone } from 'lucide-react';
import { criarITBI } from '../../services/itbi-service';
import { useToast } from '../../components/sonner-custom';

interface ItbiFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

// Função para aplicar máscara de telefone brasileiro
const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica a máscara
    if (limited.length <= 2) {
        return limited;
    } else if (limited.length <= 7) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
};

// Remove a máscara e retorna apenas números
const unformatPhone = (value: string): string => {
    return value.replace(/\D/g, '');
};

const generateProtocol = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}-${random}`;
};

export const ItbiForm = ({ onSuccess, onCancel }: ItbiFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [telefone, setTelefone] = useState('');
    const toast = useToast();

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setTelefone(formatted);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validação do telefone (deve ter 10 ou 11 dígitos)
        const phoneNumbers = unformatPhone(telefone);
        if (phoneNumbers && (phoneNumbers.length < 10 || phoneNumbers.length > 11)) {
            toast.error('Telefone inválido', 'Digite um telefone com DDD (10 ou 11 dígitos)');
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await criarITBI({
                nomeCliente: formData.get('nomeCliente') as string,
                telefoneCliente: phoneNumbers, // Envia sem máscara
                numeroProtocolo: generateProtocol(),
            });
            toast.success('ITBI criado com sucesso!');
            onSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao criar ITBI';
            toast.error('Erro ao criar', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                id="nomeCliente"
                name="nomeCliente"
                type="text"
                label="Nome do Cliente"
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
                required
                icon={Phone}
                value={telefone}
                onChange={handlePhoneChange}
            />

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancelar
                </button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                    {!isLoading && 'Criar ITBI'}
                </Button>
            </div>
        </form>
    );
};