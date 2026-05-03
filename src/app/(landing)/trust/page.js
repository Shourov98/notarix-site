import ComplianceStandards from "@/components/trust_page/ComplianceStandards";
import PrivacyFirst from "@/components/trust_page/PrivacyFirst";
import PlatformProtection from "@/components/trust_page/PlatformProtection";
import TrustCTA from "@/components/trust_page/TrustCTA";

export default function TrustCenterPage() {
  return (
    <main>
      <div className="bg-[#f8f9ff] py-20 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">Trust Center</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Our commitment to security, compliance, and transparency.
        </p>
      </div>
      
      <ComplianceStandards />
      <PrivacyFirst />
      <PlatformProtection />
      <TrustCTA />
    </main>
  );
}
