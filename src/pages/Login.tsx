import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        await register(username, password);
        toast({
          title: "Conta criada!",
          description: "Bem-vindo ao Slypy",
        });
      } else {
        await login(username, password);
        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!",
        });
      }
      navigate("/chat");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-3xl">
            S
          </div>
          <h1 className="text-2xl font-bold text-foreground">Slypy</h1>
          <p className="text-muted-foreground">Seu assistente zen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Usuário</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Carregando..." : isRegistering ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isRegistering ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
