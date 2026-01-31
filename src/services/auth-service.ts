// services/auth-service.ts
// Serviço de autenticação do Firebase

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    type User,
    type NextOrObserver
} from 'firebase/auth';
import { auth } from '../config/firebase-config';

const googleProvider = new GoogleAuthProvider();

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

// Registrar novo usuário
export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Login
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Logout
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Recuperar senha
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Observar mudanças no estado de autenticação
export const observeAuthState = (callback: NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callback);
};

// Login com Google
export const loginWithGoogle = async (): Promise<AuthResponse> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { success: true, user: result.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

// Verificar se está autenticado
export const isAuthenticated = (): boolean => {
    return !!auth.currentUser;
};