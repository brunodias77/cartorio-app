import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/sonner-custom";
import { loginUser, loginWithGoogle } from "../../services/auth-service";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface LoginUserRequest {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null); // Added error state
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Usando FormData para capturar os dados do formulário
        const formData = new FormData(e.currentTarget);

        const loginData: LoginUserRequest = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        };

        try {
            const response = await loginUser(loginData.email, loginData.password);

            if (response.success) {
                toast.success(`Bem-vindo!`);
                navigate('/dashboard');
            } else {
                // If response.success is false, we have an error
                throw new Error(response.error || 'Falha no login');
            }
        } catch (error: any) {
            // Fallback para outros tipos de erro
            const errorMessage = error.message || 'Verifique suas credenciais.';
            toast.error('Falha no login', errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const result = await loginWithGoogle();

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Erro ao fazer login com Google');
                toast.error('Erro Google', result.error || 'Erro ao fazer login com Google');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            {/* Cabeçalho */}
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bem-vindo de volta</h1>
                <p className="mt-2 text-slate-500">Por favor, insira seus dados para acessar sua conta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="E-mail"
                    placeholder="nome@exemplo.com"
                    required
                    icon={Mail}
                />

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        {/* Label renderizado manualmente para layout customizado */}
                        <label htmlFor="password" className="text-sm font-medium text-slate-900">Senha</label>
                        <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Esqueceu a senha?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        icon={Lock}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        }
                    />
                </div>

                {/* Checkbox customizado (simples demais para abstrair agora, mas poderia ser um componente) */}
                <div className="flex items-center">
                    <div className="flex items-center h-5">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                        />
                    </div>
                    <div className="ml-2 text-sm">
                        <label htmlFor="remember-me" className="text-slate-500 cursor-pointer select-none">Lembrar deste dispositivo</label>
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <Button type="submit" isLoading={isLoading} className="cursor-pointer">
                    {!isLoading && (
                        <>
                            <span className="mr-2">Entrar na conta</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <img
                            className="h-5 w-5 mr-2"
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                        />
                        Google
                    </button>
                </div>
            </form>


        </div>
    );
}