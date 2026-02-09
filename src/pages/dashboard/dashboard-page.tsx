import { useState, useEffect, useMemo } from "react";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import type { Itbi } from "../../types/itbi";
import { useToast } from "../../components/sonner-custom";
import { ItbiSearch } from "../../components/itbi-search";
import { ItbiTableList } from "../../components/itbi-table-list";
import { ItbiModal } from "../../components/itbi-modal";
import { ProtocolStats } from "../../components/protocol-stats";
import { ItbiForm } from "./itbi-form";
import { ItbiEditForm } from "./itbi-edit-form";
import { listarITBIs, deletarITBI, type ITBIData } from "../../services/itbi-service";

export const DashboardPage = () => {
    const [stats, setStats] = useState({ total: 0, pendingSent: 0, completed: 0 });
    const [itbis, setItbis] = useState<Itbi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItbi, setEditingItbi] = useState<ITBIData | null>(null);
    const toast = useToast();

    // Fetch data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await listarITBIs();
            if (result.success && result.data) {
                // Map ITBIData to Itbi if necessary, assuming structures are compatible
                // For now, casting or mapping specific fields
                const mappedItbis = result.data.map(item => ({
                    ...item,
                    id: item.id!,
                    // dataCadastro é tratado pelo formatDate agora, não precisamos converter aqui
                })) as unknown as Itbi[];

                setItbis(mappedItbis);
                calculateStats(mappedItbis);
            } else {
                toast.error("Erro ao carregar dados", result.error);
            }
        } catch (error) {
            toast.error("Erro", "Falha ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculateStats = (data: Itbi[]) => {
        const total = data.length;
        // Pendentes: Enviado != Sim
        const pendingSent = data.filter(i => i.enviadoDescricao?.toLowerCase() !== 'sim').length;
        // Concluídos: Solicitado = Sim E Enviado = Sim
        const completed = data.filter(i =>
            i.solicitadoDescricao?.toLowerCase() === 'sim' &&
            i.enviadoDescricao?.toLowerCase() === 'sim'
        ).length;

        setStats({ total, pendingSent, completed });
    };

    // Handlers
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditClick = (itbi: Itbi) => {
        // Cast to ITBIData because service expects ITBIData (optional id)
        // types/Itbi requires id string.
        setEditingItbi(itbi as unknown as ITBIData);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        toast.confirm("Tem certeza?", async () => {
            const result = await deletarITBI(id);
            if (result.success) {
                toast.success("ITBI excluído com sucesso");
                fetchData();
            } else {
                toast.error("Erro ao excluir", result.error);
            }
        }, "Esta ação não pode ser desfeita.");
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchData();
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setEditingItbi(null);
        fetchData();
    };

    // Filter
    const filteredItbis = useMemo(() => {
        if (!searchTerm) return itbis;
        const lowerTerm = searchTerm.toLowerCase();
        return itbis.filter(itbi =>
            itbi.nomeCliente.toLowerCase().includes(lowerTerm) ||
            itbi.numeroProtocolo?.toLowerCase().includes(lowerTerm)
        );
    }, [itbis, searchTerm]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Header />
            <Sidebar />

            <main className="pt-24 px-4 pb-12 lg:pl-72 lg:pr-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Controle de ITBI</h1>
                    <p className="text-slate-500 text-sm">
                        Gerencie solicitações e envios de documentos do cartório.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <ProtocolStats stats={stats} />
                )}

                <ItbiSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onCreateClick={handleCreateClick}
                />

                <ItbiTableList
                    itbis={filteredItbis}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                />

            </main>

            {/* Modal de criação */}
            <ItbiModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Novo ITBI"
            >
                <ItbiForm
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </ItbiModal>

            {/* Modal de edição */}
            {isEditModalOpen && editingItbi && (
                <ItbiModal
                    isOpen={true}
                    onClose={() => { setIsEditModalOpen(false); setEditingItbi(null); }}
                    title="Editar ITBI"
                >
                    <ItbiEditForm
                        itbi={editingItbi}
                        onSuccess={handleEditSuccess}
                        onCancel={() => { setIsEditModalOpen(false); setEditingItbi(null); }}
                    />
                </ItbiModal>
            )}

        </div>
    );
}