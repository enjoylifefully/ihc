import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Wind, BookOpen, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Flower } from "lucide-react";

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
          "fixed lg:static inset-y-0 left-0 z-50 w-60 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="text-xl font-bold text-sidebar-primary">Slypy</h2>
          <Flower className="text-sidebar-primary" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground"
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
                  // We use 'ghost' as base to avoid conflicting backgrounds,
                  // and apply manual styling for the active state below
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200",
                    // Default text color
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    // ACTIVE STATE STYLES:
                    isActive && [
                      "bg-sidebar-accent", // Visible background
                      "text-sidebar-primary", // Highlighted text
                      "border border-sidebar-primary/50", // THE FIX: Explicit outline
                      "shadow-sm",
                    ],
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive && "text-sidebar-primary",
                    )}
                  />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="mb-4 text-xl text-purple-700">
            <p className="font-bold">Olá, {user?.username}!</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
