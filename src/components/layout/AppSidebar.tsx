
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  Calendar,
  CheckSquare,
  Mail,
  Settings,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { title: "Dashboard", url: "/", icon: Activity },
    { title: "Scouts", url: "/scouts", icon: User },
    { title: "Activities", url: "/activities", icon: Calendar },
    { title: "Attendance", url: "/attendance", icon: CheckSquare },
    { title: "Communications", url: "/communications", icon: Mail },
  ];

  const isActive = (path: string) => currentPath === path;
  const isMainExpanded = menuItems.some((item) => isActive(item.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-primary font-medium" 
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar
      className={`border-r ${collapsed ? "w-14" : "w-64"} transition-all duration-300`}
      collapsible
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="pt-4">
        <SidebarGroup defaultOpen={true} open={isMainExpanded}>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
                    <Settings className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
