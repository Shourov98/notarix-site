import { FileSignature, ClipboardCheck } from "lucide-react";

export default function ComplianceStandards() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* Left Side: Headline */}
        <div className="lg:col-span-1">
          <div className="w-12 h-1 bg-[#1a4fdb] mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight mb-6">
            Compliance & Legal Standards
          </h2>
          <p className="text-zinc-600 leading-relaxed max-w-sm">
            We don't just follow the rules; we set the standard for digital legal proceedings.
          </p>
        </div>

        {/* Right Side: Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RON Compliance Card */}
          <div className="bg-[#eff1f9] p-8 rounded-2xl">
            <div className="mb-6">
              <FileSignature className="w-6 h-6 text-[#1a4fdb]" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">RON Compliance</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Full adherence to Remote Online Notarization (RON) laws across all 50 states, ensuring your documents are legally recognized everywhere.
            </p>
          </div>

          {/* Audit Trails Card */}
          <div className="bg-[#eff1f9] p-8 rounded-2xl">
            <div className="mb-6">
              <ClipboardCheck className="w-6 h-6 text-[#1a4fdb]" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Audit Trails</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Every interaction is logged in an immutable audit trail, providing a clear chain of custody for every signature and seal applied.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
