export default function InquiriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Customer Inquiries</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <input 
            type="text" 
            placeholder="Search inquiries..." 
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64"
          />
          <div className="flex gap-2">
            <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option>Status: All</option>
              <option>Status: Pending</option>
              <option>Status: Contacted</option>
              <option>Status: Closed</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Customer Details</th>
                <th className="px-6 py-3 font-medium">Interested Product</th>
                <th className="px-6 py-3 font-medium">Message</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">Dr. Rahul Sharma</div>
                  <div className="text-slate-500 text-xs">+91 9876543210</div>
                  <div className="text-slate-500 text-xs">Pune, Maharashtra</div>
                </td>
                <td className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer">
                  Niscomed 3-Channel ECG
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                  Need best price for clinic setup in Pune.
                </td>
                <td className="px-6 py-4 text-slate-500">Just now</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-3 py-1.5 rounded shadow-sm text-xs">
                    Update Status
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">City Hospital</div>
                  <div className="text-slate-500 text-xs">contact@cityhosp.com</div>
                  <div className="text-slate-500 text-xs">Delhi</div>
                </td>
                <td className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer">
                  Medisys Anesthesia Machine
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                  Looking for bulk order quotation for 3 units.
                </td>
                <td className="px-6 py-4 text-slate-500">2 hours ago</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Contacted</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-3 py-1.5 rounded shadow-sm text-xs">
                    Update Status
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
