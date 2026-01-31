import { LoginForm } from "./login-forms"

export const LoginPage = () => {
    return (
        <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">

            {/* Lado Esquerdo - Container do Formulário */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 xl:p-24 animate-in fade-in slide-in-from-left-4 duration-700">
                <LoginForm />
            </div>

            {/* Lado Direito - Imagem e Estilo */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900">
                <div className="absolute inset-0 mix-blend-overlay z-10" />
                <img
                    src="https://images.unsplash.com/photo-1583521214690-73421a1829a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Office Workspace"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-20 flex flex-col justify-end p-16 text-white h-full w-full">
                    <div className="flex justify-between items-end border-t border-white/20 pt-8">
                        <p className="text-sm text-indigo-200">© 2026 @diasdev_  Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}