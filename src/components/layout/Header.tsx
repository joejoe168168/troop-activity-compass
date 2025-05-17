
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-white h-16 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-xl font-bold text-scout-green">Scout Manager</h1>
      </div>
      <div className="flex items-center gap-2">
        {!isMobile && (
          <Button variant="outline" size="sm">
            Help
          </Button>
        )}
        <Button size="sm">
          Admin
        </Button>
      </div>
    </header>
  );
};

export default Header;
