// services/itbi-service.ts
// Serviço CRUD para gerenciar registros ITBI no Firestore

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    type DocumentData,
    type Query
} from 'firebase/firestore';
import { db } from '../config/firebase-config';

// Interfaces
export interface ITBIData {
    id?: string;
    nomeCliente: string;
    telefoneCliente?: string | null;
    numeroProtocolo?: string;
    dataCadastro: Timestamp;
    enviadoId: number;
    solicitadoId: number;
    enviadoDescricao: string;
    solicitadoDescricao: string;
}

export interface StatusData {
    id: string;
    descricao: string;
}

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    id?: string;
}

// Referências das coleções
const itbiCollection = collection(db, 'itbi');
const statusCollection = collection(db, 'status_confirmacao');

// Buscar descrição do status
async function getStatusDescricao(statusId: number | string): Promise<string> {
    try {
        const statusDoc = await getDoc(doc(statusCollection, statusId.toString()));
        return statusDoc.exists() ? (statusDoc.data() as StatusData).descricao : 'Desconhecido';
    } catch (error) {
        console.error('Erro ao buscar descrição do status:', error);
        return 'Desconhecido';
    }
}

// CREATE - Criar novo ITBI
export const criarITBI = async (dados: Partial<ITBIData>): Promise<ServiceResponse<null>> => {
    try {
        const enviadoDescricao = await getStatusDescricao(1);
        const solicitadoDescricao = await getStatusDescricao(1);

        const novoITBI = {
            nomeCliente: dados.nomeCliente!,
            telefoneCliente: dados.telefoneCliente || null,
            numeroProtocolo: dados.numeroProtocolo || '',
            dataCadastro: Timestamp.now(),
            enviadoId: 1,
            solicitadoId: 1,
            enviadoDescricao,
            solicitadoDescricao
        };

        const docRef = await addDoc(itbiCollection, novoITBI);
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error('Erro ao criar ITBI:', error);
        return { success: false, error: error.message };
    }
};

// READ - Buscar ITBI por ID
export const buscarITBI = async (id: string): Promise<ServiceResponse<ITBIData>> => {
    try {
        const docSnap = await getDoc(doc(itbiCollection, id));

        if (docSnap.exists()) {
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() } as ITBIData
            };
        } else {
            return { success: false, error: 'ITBI não encontrado' };
        }
    } catch (error: any) {
        console.error('Erro ao buscar ITBI:', error);
        return { success: false, error: error.message };
    }
};

// READ - Listar todos os ITBIs
export const listarITBIs = async (): Promise<ServiceResponse<ITBIData[]>> => {
    try {
        const q = query(itbiCollection, orderBy('dataCadastro', 'desc'));
        const querySnapshot = await getDocs(q);

        const itbis: ITBIData[] = [];
        querySnapshot.forEach((doc) => {
            itbis.push({ id: doc.id, ...doc.data() } as ITBIData);
        });

        return { success: true, data: itbis };
    } catch (error: any) {
        console.error('Erro ao listar ITBIs:', error);
        return { success: false, error: error.message };
    }
};

// READ - Buscar por número de protocolo
export const buscarPorProtocolo = async (numeroProtocolo: string): Promise<ServiceResponse<ITBIData>> => {
    try {
        const q = query(
            itbiCollection,
            where('numeroProtocolo', '==', numeroProtocolo),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const document = querySnapshot.docs[0];
            return {
                success: true,
                data: { id: document.id, ...document.data() } as ITBIData
            };
        } else {
            return { success: false, error: 'Protocolo não encontrado' };
        }
    } catch (error: any) {
        console.error('Erro ao buscar por protocolo:', error);
        return { success: false, error: error.message };
    }
};

// READ - Buscar por status
export const buscarPorStatus = async (enviadoId: number | null = null, solicitadoId: number | null = null): Promise<ServiceResponse<ITBIData[]>> => {
    try {
        let q: Query<DocumentData> = itbiCollection;

        if (enviadoId !== null) {
            q = query(q, where('enviadoId', '==', enviadoId));
        }

        if (solicitadoId !== null) {
            q = query(q, where('solicitadoId', '==', solicitadoId));
        }

        // Nota: O orderBy pode exigir um índice composto no Firestore se usado com múltiplos 'where'
        q = query(q, orderBy('dataCadastro', 'desc'));

        const querySnapshot = await getDocs(q);
        const itbis: ITBIData[] = [];
        querySnapshot.forEach((doc) => {
            itbis.push({ id: doc.id, ...doc.data() } as ITBIData);
        });

        return { success: true, data: itbis };
    } catch (error: any) {
        console.error('Erro ao buscar por status:', error);
        return { success: false, error: error.message };
    }
};

// UPDATE - Atualizar status do ITBI
export const atualizarStatus = async (id: string, campo: 'enviadoId' | 'solicitadoId', novoStatusId: number): Promise<ServiceResponse<null>> => {
    try {
        const statusDescricao = await getStatusDescricao(novoStatusId);
        const descricaoCampo = campo === 'enviadoId' ? 'enviadoDescricao' : 'solicitadoDescricao';

        await updateDoc(doc(itbiCollection, id), {
            [campo]: novoStatusId,
            [descricaoCampo]: statusDescricao
        });

        return { success: true };
    } catch (error: any) {
        console.error('Erro ao atualizar status:', error);
        return { success: false, error: error.message };
    }
};

// UPDATE - Atualizar dados do ITBI
export const atualizarITBI = async (id: string, dados: Partial<ITBIData>): Promise<ServiceResponse<null>> => {
    try {
        const updateData: Partial<DocumentData> = {
            nomeCliente: dados.nomeCliente,
            telefoneCliente: dados.telefoneCliente || null,
            numeroProtocolo: dados.numeroProtocolo
        };

        if (dados.enviadoId !== undefined) {
            updateData.enviadoId = Number(dados.enviadoId);
            updateData.enviadoDescricao = await getStatusDescricao(dados.enviadoId);
        }

        if (dados.solicitadoId !== undefined) {
            updateData.solicitadoId = Number(dados.solicitadoId);
            updateData.solicitadoDescricao = await getStatusDescricao(dados.solicitadoId);
        }

        await updateDoc(doc(itbiCollection, id), updateData);
        return { success: true };
    } catch (error: any) {
        console.error('Erro ao atualizar ITBI:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Deletar ITBI
export const deletarITBI = async (id: string): Promise<ServiceResponse<null>> => {
    try {
        await deleteDoc(doc(itbiCollection, id));
        return { success: true };
    } catch (error: any) {
        console.error('Erro ao deletar ITBI:', error);
        return { success: false, error: error.message };
    }
};

// UTILITY - Listar todos os status disponíveis
export const listarStatus = async (): Promise<ServiceResponse<StatusData[]>> => {
    try {
        const querySnapshot = await getDocs(statusCollection);
        const status: StatusData[] = [];
        querySnapshot.forEach((doc) => {
            status.push({ id: doc.id, ...doc.data() } as StatusData);
        });

        return { success: true, data: status };
    } catch (error: any) {
        console.error('Erro ao listar status:', error);
        return { success: false, error: error.message };
    }
};
