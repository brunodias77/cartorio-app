// ==========================================
// GET ALL (Listagem)
// ==========================================

export interface ItbiItemResponse {
    id: string; // Firestore usa IDs do tipo string por padrão
    nomeCliente: string;
    telefoneCliente: string;
    numeroProtocolo: string;
    solicitadoDescricao: string;
    enviadoDescricao: string;
    enviadoId: number;
    solicitadoId: number;
    dataCadastro: Date | string; // No Firestore é Timestamp, mapeado para Date ou ISO string
}

// Alias para uso simplificado
export interface Itbi extends ItbiItemResponse { }

export interface GetAllItbiResponse {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    items: ItbiItemResponse[];
}

export interface GetAllItbiParams {
    pageNumber?: number;
    pageSize?: number;
}

// ==========================================
// CREATE
// ==========================================

export interface CreateItbiRequest {
    nomeCliente: string;
    telefoneCliente: string;
    numeroProtocolo: string; // Obrigatório conforme validateITBI
    dataCadastro: Date;      // Obrigatório conforme validateITBI
    enviadoId: number;       // Obrigatório (deve ser entre 1 e 3)
    solicitadoId: number;    // Obrigatório (deve ser entre 1 e 3)
}

export interface CreateItbiResponse extends CreateItbiRequest {
    id: string;
    solicitadoDescricao: string;
    enviadoDescricao: string;
}

// ==========================================
// UPDATE
// ==========================================

export interface UpdateItbiRequest {
    id: string;
    nomeCliente: string;
    numeroProtocolo: string;
    dataCadastro: Date;
    enviadoId: number;
    solicitadoId: number;
    telefoneCliente?: string | null;
}

export interface UpdateItbiResponse {
    id: string;
    nomeCliente: string;
    telefoneCliente: string;
    numeroProtocolo: string;
    solicitadoDescricao: string;
    enviadoDescricao: string;
}

// ==========================================
// DELETE
// ==========================================

export interface DeleteItbiResponse {
    id: string;
    sucesso: boolean;
    dataExclusao: string;
}