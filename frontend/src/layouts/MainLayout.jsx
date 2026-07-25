import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Common/Sidebar';
import { Navbar } from '../components/Common/Navbar';
import { Footer } from '../components/Common/Footer';
import { MobileBottomNav } from '../components/Common/MobileBottomNav';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 sm:pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav />
    </div>
  );
};
