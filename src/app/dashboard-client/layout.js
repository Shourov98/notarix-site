import Sidebar from "@/components/dashboard-client/Sidebar";
import Navbar from "@/components/dashboard-client/Navbar";
import PortalHeader from "@/components/portal/PortalHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#fcfcfd] h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        <PortalHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto pb-12">
            {children}
          </div>
        </main>
        <footer className="py-4 px-8 border-t border-zinc-100 text-center text-sm text-gray-700 font-medium bg-white shrink-0">
          © 2026 Notarix™ Technologies Inc. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
