import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, Square, Play, Flower } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const Breathe = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "empty">(
    "inhale",
  );
  const [count, setCount] = useState(4);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 100 + 20,
      opacity: Math.random() * 0.25 + 0.05,
      floatDuration: Math.random() * 10 + 10 + "s",
      floatDelay: Math.random() * -20 + "s",
      blurLevel: Math.random() > 0.5 ? "blur-sm" : "blur-md",
    }));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isBreathing) {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            setPhase((currentPhase) => {
              if (currentPhase === "inhale") return "hold";
              if (currentPhase === "hold") return "exhale";
              if (currentPhase === "exhale") return "empty";
              return "inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathing]);

  const stopBreathing = () => {
    setIsBreathing(false);
    setPhase("inhale");
    setCount(4);
  };

  const startBreathing = () => {
    setIsBreathing(true);
  };

  const getPhaseText = () => {
    if (!isBreathing) return "Pronto?";
    switch (phase) {
      case "inhale":
        return "Inspire...";
      case "hold":
        return "Segure...";
      case "exhale":
        return "Expire...";
      case "empty":
        return "Pulmão vazio...";
    }
  };

  const getContainerTransform = () => {
    if (!isBreathing) return "translateY(0)";
    return phase === "exhale" || phase === "empty"
      ? "translateY(0)"
      : "translateY(-20%)";
  };

  const shouldAnimateParticles = () => {
    return isBreathing && phase !== "hold" && phase !== "empty";
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden relative select-none">
      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(2%, 3%); }
            50% { transform: translate(4%, 0%); }
            75% { transform: translate(2%, -3%); }
          }
        `}
      </style>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        className="absolute inset-[-20%] pointer-events-none z-0 transition-transform ease-in-out"
        style={{
          transitionDuration: "4000ms",
          transitionTimingFunction:
            phase === "exhale" ? "ease-in-out" : "ease-out",
          transform: getContainerTransform(),
        }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full bg-primary ${particle.blurLevel}`}
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: shouldAnimateParticles()
                ? `float-slow ${particle.floatDuration} ease-in-out infinite`
                : "none",
              animationDelay: particle.floatDelay,
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col z-10">
        <header className="bg-transparent p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 pb-20">
          <Card className="w-full max-w-md p-12 text-center space-y-12 bg-purple-200/20 backdrop-blur-lg border-primary/10 shadow-2xl relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 transition-opacity duration-[4000ms] ${phase === "inhale" || phase === "hold" ? "opacity-100" : "opacity-0"}`}
            ></div>

            <div className="relative flex items-center justify-center h-40 z-20">
              <div
                className={`transition-all duration-[4000ms] ease-in-out flex items-center justify-center
                  ${
                    isBreathing
                      ? phase === "inhale" || phase === "hold"
                        ? "scale-125"
                        : phase === "exhale" || phase === "empty"
                          ? "scale-90"
                          : "scale-100"
                      : "scale-100"
                  }
                `}
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-primary/30 blur-2xl rounded-full transition-all duration-[4000ms] ${phase === "hold" ? "scale-150 opacity-100" : "scale-100 opacity-70"}`}
                  />

                  <Flower
                    className={`w-32 h-32 text-primary transition-all duration-[10000ms] ${isBreathing ? "animate-[spin_12s_linear_infinite]" : ""}`}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 z-20 relative">
              <h2 className="text-3xl font-bold text-primary animate-fade-in transition-all">
                {getPhaseText()}
              </h2>
              <div className="h-6">
                {isBreathing && (
                  <p className="text-primary/80 text-lg font-medium uppercase tracking-[0.2em] animate-pulse">
                    {count}
                  </p>
                )}
              </div>
            </div>

            {!isBreathing && (
              <p className="text-xl font-bold text-purple-700 text-center z-20 relative">
                Respiração quadrática: 4 tempos de 4 segundos (Inspire,
                Segure,Expire e Pulmões vazios)
              </p>
            )}

            <div className="flex justify-center z-20 relative">
              <Button
                onClick={isBreathing ? stopBreathing : startBreathing}
                size="lg"
                className={`w-48 rounded-full font-bold transition-all duration-500 shadow-lg ${
                  isBreathing
                    ? "bg-primary/20 hover:bg-destructive/80 text-primary hover:text-destructive-foreground border-2 border-primary/50 hover:border-destructive/20"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/50"
                }`}
              >
                {isBreathing ? (
                  <>
                    <Square className="mr-2 h-4 w-4 fill-current" /> Parar
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4 fill-current ml-1" /> Iniciar
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Breathe;
