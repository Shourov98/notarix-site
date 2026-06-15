"use client";

import { 
  Mail, 
  Bell, 
  FileText, 
  Settings2,
  Clock
} from "lucide-react";

export default function NotificationsPage() {
  const notificationSections = [
    {
      title: "Email Notifications",
      description: "Receive updates and alerts via your registered email address.",
      icon: Mail,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1a4fdb]",
      options: [
        { label: "Order Confirmations", description: "Get emailed whenever a new order is successfully created.", enabled: true },
        { label: "Payment Receipts", description: "Receive digital receipts for every completed transaction.", enabled: true },
        { label: "Security Alerts", description: "Get notified about suspicious login attempts or password changes.", enabled: true },
      ]
    },
    {
      title: "Push Notifications",
      description: "Get real-time alerts on your browser or mobile device.",
      icon: Bell,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      options: [
        { label: "Messages & Chat", description: "Instant alerts when a notary or support sends you a message.", enabled: true },
        { label: "Status Changes", description: "Real-time updates when your order moves to a new stage.", enabled: false },
      ]
    },
    {
      title: "Order Updates",
      description: "Configure specific alerts for your notarization process.",
      icon: FileText,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      options: [
        { label: "Notary Assignment", description: "Alert when a notary is successfully assigned to your order.", enabled: true },
        { label: "Document Reminders", description: "Reminders for pending document uploads or signatures.", enabled: true },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Notifications</h2>
        <p className="text-gray-700 font-medium text-xs mt-1">Choose what updates you want to receive and how they are delivered.</p>
      </div>

      <div className="p-8 space-y-12">
        {notificationSections.map((section, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${section.iconBg} rounded-2xl flex items-center justify-center`}>
                <section.icon className={`w-5 h-5 ${section.iconColor}`} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">{section.title}</h3>
                <p className="text-xs font-medium text-gray-700">{section.description}</p>
              </div>
            </div>

            <div className="space-y-3 max-w-4xl pt-2">
              {section.options.map((option, optIdx) => (
                <div key={optIdx} className="flex items-center justify-between p-5 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors bg-white group">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-900">{option.label}</h4>
                    <p className="text-xs font-medium text-gray-700">{option.description}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${option.enabled ? 'bg-[#1a4fdb]' : 'bg-zinc-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${option.enabled ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            {idx < notificationSections.length - 1 && <hr className="border-zinc-50 mt-10" />}
          </section>
        ))}

        {/* Action Bar */}
        <div className="pt-4 flex justify-end max-w-4xl">
          <button className="bg-[#1a4fdb] text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
