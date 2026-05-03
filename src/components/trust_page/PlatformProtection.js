import { BadgeInfo, ListChecks, CloudCog } from "lucide-react";

export default function PlatformProtection() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Platform Protection
            </h2>
            <p className="text-zinc-600 leading-relaxed text-lg">
              Our ecosystem is monitored 24/7 by advanced intrusion detection systems and verified legal professionals.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#eff1f9] px-6 py-4 rounded-xl text-center min-w-[140px]">
              <div className="text-[#1a4fdb] text-3xl font-bold mb-1">100%</div>
              <div className="text-xs text-zinc-600 font-medium">Verified Notaries</div>
            </div>
            <div className="bg-[#eff1f9] px-6 py-4 rounded-xl text-center min-w-[140px]">
              <div className="text-[#1a4fdb] text-3xl font-bold mb-1">24/7</div>
              <div className="text-xs text-zinc-600 font-medium">Active Monitoring</div>
            </div>
          </div>
        </div>

        {/* Bottom Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Onboarding Rigor */}
          <div className="border border-zinc-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 text-[#1a4fdb]">
              <BadgeInfo className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Onboarding Rigor</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Notary credentials, including commission status, are reviewed prior to joining the platform
            </p>
          </div>

          {/* Activity Logs */}
          <div className="border border-zinc-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 text-[#1a4fdb]">
              <ListChecks className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Activity Logs</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              System activity is logged with alerts to help identify unusual or suspicious behavior
            </p>
          </div>

          {/* Cloud Infrastructure */}
          <div className="border border-zinc-200 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 text-[#1a4fdb]">
              <CloudCog className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Cloud Infrastructure</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Hosted on cloud providers with ISO 27001, 27017, and 27018 certified infrastructure.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
