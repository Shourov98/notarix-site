import Sidebar from "@/components/dashboard-notary/Sidebar";
import Navbar from "@/components/dashboard-notary/Navbar";

export default function DashboardNotaryLayout({ children }) {
  return (
    <div className="flex bg-[#f7f7ff] h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto pb-12">{children}</div>
        </main>
        <footer className="py-4 px-8 border-t border-zinc-100 text-center text-sm text-gray-700 font-medium bg-white shrink-0">
          © 2026 Notarix™ Technologies Inc. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
