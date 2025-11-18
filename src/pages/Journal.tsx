import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  content: string;
  date: Date;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries, (key, value) => {
        if (key === "date") return new Date(value);
        return value;
      }));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Entrada vazia",
        description: "Escreva algo antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentEntry,
      date: new Date(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    setCurrentEntry("");

    toast({
      title: "Entrada salva",
      description: "Sua reflexão foi salva com sucesso.",
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="bg-card border-b border-border p-4">
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
            <Button onClick={saveEntry} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Salvar Entrada
            </Button>
          </Card>

          {entries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Entradas Anteriores</h2>
              {entries.map((entry) => (
                <Card key={entry.id} className="p-6 space-y-2 animate-fade-in">
                  <p className="text-sm text-muted-foreground">
                    {entry.date.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default Journal;
