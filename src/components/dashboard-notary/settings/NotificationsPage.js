"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotaryNotificationPreferences,
  saveNotaryNotificationPrefs,
  selectSitePortal,
} from "@/store/sitePortalSlice";

const emailNotifications = [
  {
    key: "emailNewOrderAssigned",
    title: "New Order Assigned",
    description: "Receive an email when a new notarization order is available.",
  },
  {
    key: "emailOrderStatusUpdates",
    title: "Order Status Updates",
    description: "Get notified when client signs or documents are updated.",
  },
  {
    key: "emailPaymentReceived",
    title: "Payment Received",
    description: "Instant email confirmation for every successful transaction.",
  },
];

const inAppNotifications = [
  {
    key: "inAppNewMessages",
    title: "New Messages",
    description: "Real-time alerts for client messages in the secure portal.",
  },
  {
    key: "inAppDocumentUploadUpdates",
    title: "Document Upload Updates",
    description: "Badges on files when a user uploads supporting identification.",
  },
  {
    key: "inAppMeetingRequests",
    title: "Meeting Requests",
    description: "Pop-up notification for incoming video call invitations.",
  },
];

const defaultPrefs = {
  emailNewOrderAssigned: true,
  emailOrderStatusUpdates: true,
  emailPaymentReceived: true,
  inAppNewMessages: true,
  inAppDocumentUploadUpdates: true,
  inAppMeetingRequests: true,
};

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-16 h-8 rounded-full relative shrink-0 transition-colors ${checked ? "bg-[#2c49df]" : "bg-zinc-300"}`}
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${checked ? "right-1" : "left-1"}`}
      ></div>
    </button>
  );
}

function NotificationCard({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-5 rounded-2xl border border-zinc-200">
      <div>
        <p className="text-lg font-bold text-zinc-900">{title}</p>
        <p className="text-sm font-medium text-gray-700 mt-1">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const {
    notaryNotificationPreferences,
    notaryNotificationPreferencesStatus,
    notaryNotificationSaveStatus,
  } = useAppSelector(selectSitePortal);
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    dispatch(fetchNotaryNotificationPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (notaryNotificationPreferences) {
      setPrefs({
        ...defaultPrefs,
        ...notaryNotificationPreferences,
      });
    }
  }, [notaryNotificationPreferences]);

  const updatePref = (key, value) => {
    setPrefs((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(saveNotaryNotificationPrefs(prefs)).unwrap();
      toast.success("Notification preferences saved.");
    } catch (error) {
      toast.error(error?.message || "Unable to save notification preferences.");
    }
  };

  const loading = notaryNotificationPreferencesStatus === "loading" && !notaryNotificationPreferences;
  const saving = notaryNotificationSaveStatus === "loading";

  const isDirty = useMemo(() => {
    if (!notaryNotificationPreferences) return false;
    return Object.keys(defaultPrefs).some((key) => prefs[key] !== notaryNotificationPreferences[key]);
  }, [prefs, notaryNotificationPreferences]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Notifications</h2>
          <p className="mt-1 text-sm text-gray-700">
            Choose how you want to be alerted about orders, payments, and portal activity.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !notaryNotificationPreferences}
          className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-60"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : isDirty ? (
            "Save Preferences"
          ) : (
            "Saved"
          )}
        </button>
      </div>

      <div className="border border-indigo-100 rounded-[24px] overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">Email Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {emailNotifications.map((notification) => (
            <NotificationCard
              key={notification.key}
              title={notification.title}
              description={notification.description}
              checked={Boolean(prefs[notification.key])}
              onChange={(value) => updatePref(notification.key, value)}
            />
          ))}
        </div>
      </div>

      <div className="border border-indigo-100 rounded-[24px] overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">In-App Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {inAppNotifications.map((notification) => (
            <NotificationCard
              key={notification.key}
              title={notification.title}
              description={notification.description}
              checked={Boolean(prefs[notification.key])}
              onChange={(value) => updatePref(notification.key, value)}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-700 inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading preferences...
        </p>
      ) : null}
    </div>
  );
}