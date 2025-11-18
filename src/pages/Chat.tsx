import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages, (key, value) => {
        if (key === "timestamp") return new Date(value);
        return value;
      }));
    } else {
      const welcomeMessage: Message = {
        id: "1",
        content: "Olá! Sou Slypy, seu assistente zen. Como posso ajudá-lo hoje?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("olá") || lowerMessage.includes("oi") || lowerMessage.includes("hey")) {
      return "Olá! É um prazer conversar com você. Como você está se sentindo hoje?";
    }
    if (lowerMessage.includes("ansioso") || lowerMessage.includes("ansiedade")) {
      return "Entendo que você está se sentindo ansioso. Que tal fazer um exercício de respiração? Acesse a opção 'Respirar' no menu.";
    }
    if (lowerMessage.includes("triste") || lowerMessage.includes("tristeza")) {
      return "Sinto muito que você esteja se sentindo assim. Lembre-se de que sentimentos são passageiros. Quer falar mais sobre isso?";
    }
    if (lowerMessage.includes("feliz") || lowerMessage.includes("bem")) {
      return "Que maravilhoso ouvir isso! Momentos de alegria merecem ser celebrados. O que está trazendo essa felicidade?";
    }
    if (lowerMessage.includes("ajuda") || lowerMessage.includes("socorro")) {
      return "Estou aqui para você. Posso oferecer exercícios de respiração, conversas reflexivas ou um espaço para escrever no diário. O que você precisa agora?";
    }
    if (lowerMessage.includes("obrigado") || lowerMessage.includes("obrigada")) {
      return "Por nada! É um prazer poder ajudá-lo. Sempre que precisar, estarei aqui.";
    }
    
    return "Compreendo. Conte-me mais sobre isso. Estou aqui para ouvir e ajudar no que for possível.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="bg-card border-b border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
          S
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Slypy</h1>
          <p className="text-sm text-muted-foreground">Seu assistente zen</p>
        </div>
      </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4 bg-card">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
  );
};

export default Chat;
