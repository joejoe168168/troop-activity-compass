
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  Calendar,
  CheckSquare,
  Mail,
  Settings,
  User,
  Users,
  Shield,
  FileText,
  MapPin,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Use state to determine if collapsed
  const collapsed = state === "collapsed";

  const menuItems = [
    { title: "Dashboard", url: "/", icon: Activity },
    { title: "Scouts", url: "/scouts", icon: Users },
    { title: "Activities", url: "/activities", icon: Calendar },
    { title: "Attendance", url: "/attendance", icon: CheckSquare },
    { title: "Communications", url: "/communications", icon: Mail },
  ];

  const adminItems = [
    { title: "Admin", url: "/admin", icon: Shield },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Locations", url: "/locations", icon: MapPin },
  ];

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-primary font-medium transition-all duration-300 shadow-sm" 
      : "hover:bg-sidebar-accent/50 transition-all duration-300";

  return (
    <Sidebar
      className={`border-r border-sidebar-border/50 ${collapsed ? "w-14" : "w-64"} transition-all duration-300 overflow-hidden`}
      collapsible="icon"
    >
      <div className={`py-4 px-3 flex justify-center items-center mb-2 ${collapsed ? "px-1" : ""}`}>
        {!collapsed ? (
          <h2 className="font-bold text-xl text-scout-green animate-fade-in">Scout Manager</h2>
        ) : (
          <div className="h-8 w-8 rounded-md bg-scout-green flex items-center justify-center text-white font-bold animate-fade-in">
            S
          </div>
        )}
      </div>
      
      <SidebarTrigger className="ml-auto mr-2 mb-2 hover:bg-sidebar-accent/50 rounded-full h-7 w-7" />
      <SidebarSeparator />

      <SidebarContent className="pt-4 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-scout-green-light/80 uppercase text-xs tracking-wider">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4 text-scout-green-light" />
                      {!collapsed && <span className="transition-all duration-300">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-2" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-scout-green-light/80 uppercase text-xs tracking-wider">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4 text-scout-green-light" />
                      {!collapsed && <span className="transition-all duration-300">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-2" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-scout-green-light/80 uppercase text-xs tracking-wider">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
                    <Settings className="mr-2 h-4 w-4 text-scout-green-light" />
                    {!collapsed && <span className="transition-all duration-300">Settings</span>}
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
