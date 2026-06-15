export default function ProfileDetailsPage() {
  const specialties = ["RON", "HELOC", "Purchase", "Seller Pkg"];

  return (
    <div className="p-8 space-y-8">
      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h2 className="text-xl font-bold text-zinc-900">Professional and Contact Details</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["Full Name", "Nadia Jackson"],
            ["Email", "n.jackson@notarymail.com"],
            ["Phone", "(555) 982-1142"],
            ["Coverage Areas", "e.g. Manhattan, Brooklyn"],
          ].map(([label, value]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <input defaultValue={value} className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
            </div>
          ))}
        </div>
        <div className="border border-zinc-200 rounded-[24px] p-6 space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700">Business Address</p>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Address Line 1</label>
            <input defaultValue="742 Evergreen Terrace" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[
              ["Address Line 2", "Suite, Apt"],
              ["City", "New York"],
              ["State", "New York"],
              ["Zip Code", "10001"],
            ].map(([label, value]) => (
              <div key={label} className="space-y-2">
                <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
                <input defaultValue={value} className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h2 className="text-xl font-bold text-zinc-900">Commission and Credentials</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["Commission Number", "COMM-98452-NY"],
            ["Commission State", "New York"],
            ["Commission Expiration Date", "mm/dd/yyyy"],
            ["Travel Radius (Miles)", "50"],
          ].map(([label, value]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <input defaultValue={value} className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
            </div>
          ))}
          <div className="space-y-2 xl:col-span-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">E&amp;O Coverage Amount ($)</label>
            <input defaultValue="100,000" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
        </div>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h2 className="text-xl font-bold text-zinc-900">Additional Information</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["RON Approval", "Select Option"],
            ["Background Check Date", "mm/dd/yyyy"],
          ].map(([label, value]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <input defaultValue={value} className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Specialties</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {specialties.map((specialty) => (
              <label key={specialty} className="flex items-center gap-3 px-4 py-4 rounded-2xl border border-zinc-200">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-zinc-800">{specialty}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
