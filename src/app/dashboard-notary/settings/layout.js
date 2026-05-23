"use client";

import { Bell, CreditCard, ShieldCheck, User, UserRoundCog, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { icon: User, label: "Profile", href: "/dashboard-notary/settings" },
  { icon: UserRoundCog, label: "Profile Details", href: "/dashboard-notary/settings/profile-details" },
  { icon: BadgeCheck, label: "Verification", href: "/dashboard-notary/settings/verification" },
  { icon: ShieldCheck, label: "Security", href: "/dashboard-notary/settings/security" },
  { icon: Bell, label: "Notifications", href: "/dashboard-notary/settings/notifications" },
  { icon: CreditCard, label: "Payments", href: "/dashboard-notary/settings/payments" },
];

export default function NotarySettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      <div className="w-full xl:w-72 shrink-0 xl:sticky xl:top-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Manage account preferences</p>
        </div>
        <nav className="mt-8 space-y-2">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-white text-[#2c49df] border border-indigo-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-white/70"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 w-full bg-white border border-indigo-100 rounded-[28px] shadow-sm min-h-[700px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
