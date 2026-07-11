"use client";

import { useEffect, useState } from "react";
import { Bell, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchClientNotificationPreferences,
  saveClientNotificationPrefs,
  selectSitePortal,
} from "@/store/sitePortalSlice";

const sections = [
  {
    key: "emailNotifications",
    title: "Email Notifications",
    description: "Receive order updates, payment alerts, and direct messages via your registered email.",
    icon: Bell,
    iconBg: "bg-blue-50",
    iconColor: "text-[#1a4fdb]",
  },
  {
    key: "orderUpdates",
    title: "Order Updates",
    description: "Get notified when your order status changes, documents are verified, or a notary is assigned.",
    icon: Bell,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    key: "paymentAlerts",
    title: "Payment Alerts",
    description: "Get notified about payments, refunds, and payout releases.",
    icon: Bell,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    key: "directMessages",
    title: "Direct Messages",
    description: "Get notified when a notary, admin, or support sends you a message.",
    icon: Bell,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const {
    clientNotificationPreferences,
    clientNotificationPreferencesStatus,
    clientNotificationSaveStatus,
  } = useAppSelector(selectSitePortal);

  const [form, setForm] = useState({
    emailNotifications: true,
    orderUpdates: true,
    paymentAlerts: false,
    directMessages: true,
  });

  useEffect(() => {
    dispatch(fetchClientNotificationPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (clientNotificationPreferences) {
      setForm({
        emailNotifications: Boolean(clientNotificationPreferences.emailNotifications),
        orderUpdates: Boolean(clientNotificationPreferences.orderUpdates),
        paymentAlerts: Boolean(clientNotificationPreferences.paymentAlerts),
        directMessages: Boolean(clientNotificationPreferences.directMessages),
      });
    }
  }, [clientNotificationPreferences]);

  const toggle = (key) => {
    setForm((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSave = async () => {
    try {
      await dispatch(saveClientNotificationPrefs(form)).unwrap();
      toast.success("Notification preferences saved.");
    } catch (error) {
      toast.error(error || "Unable to save notification preferences.");
    }
  };

  const loading = clientNotificationPreferencesStatus === "loading";
  const saving = clientNotificationSaveStatus === "loading";

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Notifications</h2>
        <p className="text-gray-700 font-medium text-xs mt-1">Choose what updates you want to receive and how they are delivered.</p>
      </div>

      <div className="p-8 space-y-10">
        {loading ? (
          <p className="text-sm font-medium text-gray-700">Loading preferences…</p>
        ) : (
          sections.map((section, idx) => {
            const enabled = form[section.key];
            return (
              <section key={section.key} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${section.iconBg} rounded-2xl flex items-center justify-center`}>
                    <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{section.title}</h3>
                    <p className="text-xs font-medium text-gray-700">{section.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(section.key)}
                  aria-pressed={enabled}
                  className="w-full max-w-4xl flex items-center justify-between p-5 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors bg-white group"
                >
                  <div className="space-y-1 text-left">
                    <h4 className="text-sm font-bold text-zinc-900">
                      Receive {section.title.toLowerCase()}
                    </h4>
                    <p className="text-xs font-medium text-gray-700">
                      {enabled ? "Enabled" : "Disabled"} — click to toggle.
                    </p>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                      enabled ? "bg-[#1a4fdb]" : "bg-zinc-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${
                        enabled ? "left-7" : "left-1"
                      }`}
                    />
                  </div>
                </button>
                {idx < sections.length - 1 ? <hr className="border-zinc-50 mt-4" /> : null}
              </section>
            );
          })
        )}

        <div className="pt-4 flex justify-end max-w-4xl">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#1a4fdb] text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {saving ? "Saving…" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}