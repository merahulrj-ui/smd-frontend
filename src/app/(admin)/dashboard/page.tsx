export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Products</h3>
          <p className="text-3xl font-bold text-slate-800">4,209</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Active Categories</h3>
          <p className="text-3xl font-bold text-slate-800">38</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">New Inquiries</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Views</h3>
          <p className="text-3xl font-bold text-slate-800">15.2K</p>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Recent Customer Inquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">Dr. Rahul Sharma<br/><span className="text-slate-500 text-xs">+91 9876543210</span></td>
                <td className="px-6 py-4 font-medium text-slate-800">Niscomed 3-Channel ECG</td>
                <td className="px-6 py-4 text-slate-500">Just now</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span></td>
                <td className="px-6 py-4"><button className="text-blue-600 font-medium hover:underline">View</button></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">City Hospital<br/><span className="text-slate-500 text-xs">contact@cityhosp.com</span></td>
                <td className="px-6 py-4 font-medium text-slate-800">Medisys Anesthesia Machine</td>
                <td className="px-6 py-4 text-slate-500">2 hours ago</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Contacted</span></td>
                <td className="px-6 py-4"><button className="text-blue-600 font-medium hover:underline">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
