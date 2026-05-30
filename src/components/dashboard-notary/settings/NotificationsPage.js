const emailNotifications = [
  ["New Order Assigned", "Receive an email when a new notarization order is available."],
  ["Order Status Updates", "Get notified when client signs or documents are updated."],
  ["Payment Received", "Instant email confirmation for every successful transaction."],
];

const inAppNotifications = [
  ["New Messages", "Real-time alerts for client messages in the secure portal."],
  ["Document Upload Updates", "Badges on files when a user uploads supporting identification."],
  ["Meeting Requests", "Pop-up notification for incoming video call invitations."],
];

function NotificationCard({ title, description }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-5 rounded-2xl border border-zinc-200">
      <div>
        <p className="text-lg font-bold text-zinc-900">{title}</p>
        <p className="text-sm font-medium text-zinc-500 mt-1">{description}</p>
      </div>
      <div className="w-16 h-8 rounded-full bg-[#2c49df] relative shrink-0">
        <div className="absolute right-1 top-1 w-6 h-6 rounded-full bg-white"></div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="border border-indigo-100 rounded-[24px] overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">Email Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {emailNotifications.map(([title, description]) => (
            <NotificationCard key={title} title={title} description={description} />
          ))}
        </div>
      </div>

      <div className="border border-indigo-100 rounded-[24px] overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">In-App Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {inAppNotifications.map(([title, description]) => (
            <NotificationCard key={title} title={title} description={description} />
          ))}
        </div>
      </div>
    </div>
  );
}
