"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PortalHeader from "@/components/portal/PortalHeader";

const SidebarContext = createContext({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function ClientShell({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return (
    <SidebarContext.Provider value={value}>
      <div className="flex bg-[#fcfcfd] h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <PortalHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto pb-12">{children}</div>
          </main>
          <footer className="py-4 px-4 sm:px-8 border-t border-zinc-100 text-center text-sm text-gray-700 font-medium bg-white shrink-0">
            © 2026 Notarix™ Technologies Inc. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}