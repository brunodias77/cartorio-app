import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// --- Tipos ---

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface Toast {
    id: string;
    title?: string;
    description?: string;
    type: ToastType;
    persistent?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

// --- Contexto ---

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    const { addToast, removeToast } = context;

    // Helpers para facilitar o uso: toast.success('...'), toast.error('...')
    return {
        toast: (props: Omit<Toast, 'id' | 'type'> & { type?: ToastType } | string) => {
            if (typeof props === 'string') {
                addToast({ title: props, type: 'default' });
            } else {
                addToast({ ...props, type: props.type || 'default' });
            }
        },
        success: (title: string, description?: string) =>
            addToast({ title, description, type: 'success' }),
        error: (title: string, description?: string) =>
            addToast({ title, description, type: 'error' }),
        warning: (title: string, description?: string) =>
            addToast({ title, description, type: 'warning' }),
        confirm: (title: string, onConfirm: () => void, description?: string) =>
            addToast({
                title,
                description,
                type: 'confirm',
                persistent: true,
                action: {
                    label: 'Confirmar',
                    onClick: onConfirm
                }
            }),
        dismiss: (id: string) => removeToast(id),
    };
};

// --- Ícones ---

const Icons = {
    success: <CheckCircle className="size-5 text-green-500" />,
    error: <XCircle className="size-5 text-red-500" />,
    warning: <AlertTriangle className="size-5 text-amber-500" />,
    confirm: <AlertTriangle className="size-5 text-amber-500" />,
    info: <Info className="size-5 text-blue-500" />,
    close: <X className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
};

// --- Componente Individual do Toast ---

const toastAnimation = {
    animation: 'slideInFromTop 0.3s ease-out forwards',
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
    // Auto-dismiss após 4 segundos (apenas se não for persistente)
    useEffect(() => {
        if (toast.persistent) return;

        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.persistent, onRemove]);

    const handleActionClick = () => {
        toast.action?.onClick();
        onRemove(toast.id);
    };

    return (
        <div
            role="alert"
            style={toastAnimation}
            className="group relative pointer-events-auto flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg bg-white border-zinc-200 text-zinc-950"
        >
            {/* Ícone baseado no tipo */}
            {toast.type !== 'default' && (
                <div className="shrink-0 mt-0.5">
                    {Icons[toast.type]}
                </div>
            )}

            <div className="flex-1 grid gap-1">
                {toast.title && (
                    <div className="text-sm font-semibold leading-none tracking-tight text-[#0a0a0a]">
                        {toast.title}
                    </div>
                )}
                {toast.description && (
                    <div className="text-sm opacity-90 text-[#3f3f3f]">
                        {toast.description}
                    </div>
                )}
                {toast.action && (
                    <button
                        onClick={handleActionClick}
                        className="mt-2 inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-transparent px-3 text-xs font-medium shadow-sm transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            {/* Botão de Fechar */}
            <button
                onClick={() => onRemove(toast.id)}
                className="absolute right-2 top-2 rounded-md p-1 text-zinc-950/50 opacity-0 transition-opacity hover:text-zinc-950 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100"
            >
                {Icons.close}
            </button>
        </div>
    );
};

// --- Componente do Toast de Confirmação (Centro da tela) ---

const ConfirmToast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
    const handleActionClick = () => {
        toast.action?.onClick();
        onRemove(toast.id);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => onRemove(toast.id)}
            />

            {/* Toast centralizado */}
            <div
                role="alertdialog"
                style={toastAnimation}
                className="relative pointer-events-auto flex w-full max-w-md items-start gap-3 overflow-hidden rounded-xl border p-6 shadow-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 mx-4"
            >
                {/* Ícone */}
                <div className="shrink-0 mt-0.5">
                    <AlertTriangle className="size-6 text-amber-500" />
                </div>

                <div className="flex-1 grid gap-2">
                    {toast.title && (
                        <div className="text-base font-semibold leading-none tracking-tight">
                            {toast.title}
                        </div>
                    )}
                    {toast.description && (
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            {toast.description}
                        </div>
                    )}

                    {/* Botões de ação */}
                    <div className="flex gap-3 mt-3">
                        <button
                            onClick={() => onRemove(toast.id)}
                            className="flex-1 h-9 px-4 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleActionClick}
                            className="flex-1 h-9 px-4 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                        >
                            {toast.action?.label || 'Confirmar'}
                        </button>
                    </div>
                </div>

                {/* Botão de Fechar */}
                <button
                    onClick={() => onRemove(toast.id)}
                    className="absolute right-3 top-3 rounded-md p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
};

// --- Provider + Toaster (Renderizador) ---

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Separar toasts normais dos de confirmação
    const regularToasts = toasts.filter(t => t.type !== 'confirm');
    const confirmToasts = toasts.filter(t => t.type === 'confirm');

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}

            {/* Container Fixo do Toaster - Top Right (toasts normais) */}
            <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 md:max-w-[420px]">
                {regularToasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>

            {/* Toasts de Confirmação (centro da tela) */}
            {confirmToasts.map((toast) => (
                <ConfirmToast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </ToastContext.Provider>
    );
};