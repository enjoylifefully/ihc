import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Wind, BookOpen, X, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const links = [
    { to: "/", icon: Home, label: "Início" },
    { to: "/chat", icon: MessageSquare, label: "Chat" },
    { to: "/breathe", icon: Wind, label: "Respirar" },
    { to: "/journal", icon: BookOpen, label: "Diário" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Slypy</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            
            return (
              <Link key={link.to} to={link.to} onClick={onClose}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{user?.username}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
};
