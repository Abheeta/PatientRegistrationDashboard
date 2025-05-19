import { Outlet } from 'react-router';
import { Navbar } from '@/components/Navbar';
import { SideBar } from '@/components/SideBar';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col max-w-screen">
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center border-b p-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SideBar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <Navbar />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-1 overflow-hidden">
        <aside className="w-64 border-r flex-shrink-0">
          <SideBar />
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b">
            <Navbar />
          </header>
          <main className="flex-1 pl-4 pr-2 pt-4 pb-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Content */}
      <main className="md:hidden flex-1 p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
