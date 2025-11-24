import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const Breathe = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setPhase((currentPhase) => {
            if (currentPhase === "inhale") return "hold";
            if (currentPhase === "hold") return "exhale";
            return "inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Inspire";
      case "hold":
        return "Segure";
      case "exhale":
        return "Expire";
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
          <h1 className="text-xl font-semibold text-foreground">
            Exercício de Respiração
          </h1>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Respire com calma
              </h2>
              <p className="text-muted-foreground">
                Siga o círculo e respire no ritmo indicado
              </p>
            </div>

            <div className="relative flex items-center justify-center h-64">
              <div
                className={`w-48 h-48 rounded-full bg-primary/20 border-4 border-primary transition-all duration-1000 flex items-center justify-center ${
                  isBreathing
                    ? phase === "inhale"
                      ? "scale-125"
                      : phase === "exhale"
                        ? "scale-75"
                        : "scale-100"
                    : "scale-100"
                }`}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-2">
                    {count}
                  </p>
                  {isBreathing && (
                    <p className="text-lg text-foreground">{getPhaseText()}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsBreathing(!isBreathing)}
              size="lg"
              className="w-full hover:bg-purple-600"
            >
              {isBreathing ? "Pausar" : "Começar"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Inspire por 4 segundos, segure por 4, expire por 4
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Breathe;
