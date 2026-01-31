import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context'; // Import useAuth
import type { JSX } from 'react';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    const { isAuthenticated, loading } = useAuth(); // Use hook

    if (loading) {
        // Pode retornar um componente de Spinner/Loading aqui
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
