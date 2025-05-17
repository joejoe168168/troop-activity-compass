
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, HelpCircle, User } from "lucide-react";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-white h-16 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4 hover:bg-scout-green/10 rounded-full transition-colors duration-200" />
        <h1 className="text-xl font-bold text-scout-green">Scout Manager</h1>
      </div>
      <div className="flex items-center gap-3">
        {!isMobile && (
          <Button variant="ghost" size="icon" className="text-scout-green hover:text-scout-green-dark hover:bg-scout-green/10">
            <Bell className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" className="text-scout-green hover:text-scout-green-dark hover:bg-scout-green/10">
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
        <Button variant="outline" size="sm" className="gap-2 border-scout-green/20 hover:bg-scout-green/10 hover:text-scout-green-dark">
          <User className="h-4 w-4" />
          <span>Admin</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
