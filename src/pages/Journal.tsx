import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Menu, Save, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface JournalEntry {
  id: number;
  content: string;
  created_at: string;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (!user) return;

    const loadEntries = async () => {
      try {
        const response = await fetch(`${API_URL}/get-diary/${user.userId}`);
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Erro ao carregar entradas:", error);
      }
    };

    loadEntries();
  }, [user]);

  const saveEntry = async () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Entrada vazia",
        description: "Escreva algo antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/save-diary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          content: currentEntry,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar entrada");
      }

      const listResponse = await fetch(`${API_URL}/get-diary/${user.userId}`);
      const data = await listResponse.json();
      setEntries(data);
      setCurrentEntry("");

      toast({
        title: "Entrada salva",
        description: "Sua reflexão foi salva com sucesso.",
      });
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

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/delete-diary/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir entrada");
      }

      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: "Entrada excluída",
        description: "A entrada foi removida com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Diário Pessoal</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Nova Entrada</h2>
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="Como você está se sentindo hoje? O que está em sua mente?"
              className="min-h-[200px] resize-none"
            />
            <Button onClick={saveEntry} className="w-full gap-2" disabled={isLoading}>
              <Save className="h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar Entrada"}
            </Button>
          </Card>

          {entries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Entradas Anteriores</h2>
              {entries.map((entry) => (
                <Card key={entry.id} className="p-6 space-y-2 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEntry(entry.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
