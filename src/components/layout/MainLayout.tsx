
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col w-full bg-gray-50">
          <Header />
          <div className="flex flex-1 w-full">
            <AppSidebar />
            <main className="flex-1 p-6 overflow-auto animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default MainLayout;
