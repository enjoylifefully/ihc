import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { MessageSquare, Wind, BookOpen } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  { to: "/", icon: MessageSquare, label: "Chat" },
  { to: "/breathe", icon: Wind, label: "Respirar" },
  { to: "/journal", icon: BookOpen, label: "Diário" },
];

export const Sidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();

  return (
    <ShadcnSidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-xl font-bold text-primary px-4 py-6">
              Slypy
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.to}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={link.to}
                        end
                        className="hover:bg-muted/50"
                        activeClassName="bg-secondary text-foreground font-medium"
                      >
                        <Icon className="h-5 w-5" />
                        {state !== "collapsed" && <span>{link.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};
