export default function PaymentsSettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Payment Settings</h2>
          <p className="text-zinc-500 font-medium text-sm mt-1">Manage your billing accounts, payout preferences, and financial security.</p>
        </div>
        <button className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
          + Add Payment Method
        </button>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h3 className="text-xl font-bold text-zinc-900">Default Payout Method</h3>
        <div className="border border-zinc-200 rounded-[24px] px-5 py-5 flex items-center gap-4">
          <div className="w-6 h-6 rounded-full border border-zinc-400"></div>
          <div>
            <p className="text-lg font-bold text-zinc-900">Stripe Connect</p>
            <p className="text-sm font-medium text-zinc-500 mt-1">Instant payouts available</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
          <h3 className="text-xl font-bold text-zinc-900">Payout Schedule</h3>
          <div className="bg-zinc-100 rounded-2xl p-2 flex">
            {["Weekly", "Bi-weekly", "Monthly"].map((item, index) => (
              <button key={item} className={`flex-1 py-3 rounded-xl font-bold ${index === 1 ? "bg-white text-[#2c49df]" : "text-zinc-600"}`}>
                {item}
              </button>
            ))}
          </div>
          <p className="italic text-sm font-medium text-zinc-500">Your next payout is scheduled for Friday, Apr 27.</p>
        </div>

        <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
          <h3 className="text-xl font-bold text-zinc-900">Financial Summary</h3>
          <div className="space-y-6 text-base">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Available for Payout</span>
              <span className="font-bold text-[#2c49df]">$1,240.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Pending Processing</span>
              <span className="font-bold text-zinc-900">$340.50</span>
            </div>
            <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-lg">
              <span className="text-zinc-500">Last Payout</span>
              <span className="font-bold text-zinc-900">$980.00 (Oct 12)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#eef4ff] rounded-[24px] p-6 flex items-center gap-5">
        <div className="w-10 h-10 rounded-full bg-[#2c49df]"></div>
        <div>
          <p className="text-[#2c49df] font-bold text-lg">Security Note</p>
          <p className="text-sm font-medium text-zinc-600 mt-2">
            Payment details are securely stored and only visible to Super Admin.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-10 py-4 rounded-2xl border border-zinc-200 text-zinc-600 font-bold">Cancel Changes</button>
        <button className="px-10 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
          Save Payment Settings
        </button>
      </div>
    </div>
  );
}
