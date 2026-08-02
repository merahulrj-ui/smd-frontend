export default function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Products Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add New Product
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64"
          />
          <div className="flex gap-2">
            <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option>All Categories</option>
              <option>ECG Machines</option>
              <option>Ventilators</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4"><div className="w-12 h-12 bg-slate-200 rounded object-cover flex items-center justify-center text-slate-400">Img</div></td>
                <td className="px-6 py-4 font-medium text-slate-800">Niscomed 3-Channel ECG</td>
                <td className="px-6 py-4 text-slate-500">ECG Machines</td>
                <td className="px-6 py-4 font-medium">₹18,070</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-medium hover:underline mr-3">Edit</button>
                  <button className="text-red-600 font-medium hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4"><div className="w-12 h-12 bg-slate-200 rounded object-cover flex items-center justify-center text-slate-400">Img</div></td>
                <td className="px-6 py-4 font-medium text-slate-800">Medisys Anesthesia Machine</td>
                <td className="px-6 py-4 text-slate-500">Anesthesia</td>
                <td className="px-6 py-4 font-medium">₹151,899</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-medium hover:underline mr-3">Edit</button>
                  <button className="text-red-600 font-medium hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
          <span>Showing 1 to 2 of 4,209 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white bg-white font-medium text-blue-600">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white">2</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white">3</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
