import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Menu, Save, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface JournalEntry {
  id: number;
  title?: string;
  content: string;
  created_at: string;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentEntry, setCurrentEntry] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedEntryId, setExpandedEntryId] = useState<number | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (!user) return;
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/get-diary/${user?.userId}`);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Erro ao carregar entradas:", error);
    }
  };

  const saveEntry = async () => {
    if (!currentTitle.trim() || !currentEntry.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo.",
        variant: "destructive",
      });
      return;
    }
    if (!user) return;

    setIsLoading(true);
    try {
      const fullContent = `${currentTitle}\n${currentEntry}`;
      const response = await fetch(`${API_URL}/save-diary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, content: fullContent }),
      });

      if (!response.ok) throw new Error("Erro ao salvar entrada");

      await loadEntries();
      setCurrentTitle("");
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
      if (!response.ok) throw new Error("Erro ao excluir entrada");

      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: "Entrada excluída",
        description: "Removida com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Helpers para UI
  const getTitle = (content: string) => content.split("\n")[0];
  const getContent = (content: string) => content.split("\n").slice(1).join("\n");

  const toggleExpand = (id: number) => {
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(id);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Diário Pessoal
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Card de Nova Entrada */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Nova Entrada
            </h2>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Título da entrada"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="Escreva seus pensamentos..."
              className="min-h-[150px] resize-none focus:border-purple-800"
            />
            <Button
              onClick={saveEntry}
              className="w-full gap-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar Entrada"}
            </Button>
          </Card>

          {/* Lista de Entradas */}
          {entries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Entradas Anteriores
              </h2>
              {entries.map((entry) => {
                const isExpanded = expandedEntryId === entry.id;

                return (
                  <Card
                    key={entry.id}
                    className="p-4 animate-fade-in transition-all duration-200"
                  >
                    {/* Header do Card (Sempre visível - Título) */}
                    <div
                      className="flex justify-between items-center cursor-pointer hover:opacity-80"
                      onClick={() => toggleExpand(entry.id)}
                    >
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-foreground">
                          {getTitle(entry.content)}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {!isExpanded && (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                        {isExpanded && (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Conteúdo Expandido */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                          {getContent(entry.content)}
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            className="hover:bg-red-500 hover:text-white"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEntry(entry.id);
                            }}
                          >
                            <Trash2 className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
