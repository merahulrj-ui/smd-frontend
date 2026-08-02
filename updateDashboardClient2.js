const fs = require('fs');
const file = 'c:/wamp64/www/smd-frontend/src/app/admin/DashboardClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const splitToken = '{isModalOpen && (';
const parts = content.split(splitToken);

if (parts.length > 1) {
    const newJSX = `{isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4 transition-opacity duration-300 opacity-100 pointer-events-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 transform flex flex-col max-h-[90vh] translate-y-0 scale-100"
          >
              <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 flex items-center justify-between shrink-0">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h2>
                      <p className="text-teal-100 text-sm">
                          {editingProduct ? \`Updating \${editingProduct.name}\` : 'Create a new product listing in your catalog.'}
                      </p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <i className="fas fa-times text-xl"></i>
                  </button>
              </div>
              
              <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50 shrink-0">
                  <button type="button" onClick={() => setActiveTab('basic')} className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${activeTab === 'basic' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}>Basic Info</button>
                  <button type="button" onClick={() => setActiveTab('details')} className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${activeTab === 'details' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}>Details & Specs</button>
                  <button type="button" onClick={() => setActiveTab('media')} className={\`px-6 py-3 text-sm font-bold border-b-2 transition-colors \${activeTab === 'media' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}>Media</button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                  <form id="productSaveForm" onSubmit={handleSave} className="space-y-6">
                      
                      <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                              <div className="md:col-span-2">
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name*</label>
                                  <input type="text" name="name" required defaultValue={editingProduct?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                                  <select name="category" defaultValue={editingProduct?.category || ''} onChange={handleCatChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white">
                                      <option value="">Select Category...</option>
                                      {allCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub Category</label>
                                  <select name="sub_category_id" defaultValue={editingProduct?.sub_category_id || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white">
                                      <option value="">Select Sub Category...</option>
                                      {filteredSubCats.map((sc: any) => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand</label>
                                  <input type="text" name="brand" defaultValue={editingProduct?.brand || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity*</label>
                                  <input type="number" name="stock_quantity" required defaultValue={editingProduct?.stock_quantity || '100'} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price (₹)*</label>
                                  <input type="number" step="0.01" name="price" required defaultValue={editingProduct?.price || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">MRP (₹)</label>
                                  <input type="number" step="0.01" name="mrp" defaultValue={editingProduct?.mrp || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                          </div>
                      </div>

                      <div className={activeTab === 'details' ? 'block' : 'hidden'}>
                          <div className="space-y-5 animate-fade-in">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Description</label>
                                  <textarea name="description" rows={3} defaultValue={editingProduct?.description || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"></textarea>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Features</label>
                                      <textarea name="features" rows={3} defaultValue={editingProduct?.features || ''} placeholder="Feature 1\\nFeature 2" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"></textarea>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usage Guidelines</label>
                                      <textarea name="usage" rows={3} defaultValue={editingProduct?.usage || ''} placeholder="Guideline 1\\nGuideline 2" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"></textarea>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Packaging</label>
                                      <input type="text" name="packaging" defaultValue={editingProduct?.packaging || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shelf Life</label>
                                      <input type="text" name="shelf_life" defaultValue={editingProduct?.shelf_life || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Warranty</label>
                                      <input type="text" name="warranty" defaultValue={editingProduct?.warranty || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                  </div>
                              </div>
                              <div className="border-t border-slate-200 pt-5 mt-5">
                                  <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-bold text-slate-800"><i className="fas fa-list-ul mr-2 text-teal-600"></i> Technical Specifications</h4>
                                      <button type="button" onClick={() => setSpecs([...specs, {name: '', description: ''}])} className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors">+ Add Row</button>
                                  </div>
                                  {specs.map((spec, i) => (
                                      <div key={i} className="flex gap-3 mb-2 items-center">
                                          <input type="text" placeholder="Property" value={spec.name} onChange={e => {const s=[...specs]; s[i].name=e.target.value; setSpecs(s);}} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                                          <input type="text" placeholder="Value" value={spec.description} onChange={e => {const s=[...specs]; s[i].description=e.target.value; setSpecs(s);}} className="flex-[2] px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                                          <button type="button" onClick={() => {const s=[...specs]; s.splice(i,1); setSpecs(s);}} className="w-9 h-9 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0"><i className="fas fa-times"></i></button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className={activeTab === 'media' ? 'block' : 'hidden'}>
                          <div className="space-y-6 animate-fade-in">
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">Main Image*</label>
                                  {editingProduct?.image && <div className="mb-2"><img src={\`/backend-media/\${editingProduct.image}\`} className="h-16 rounded border border-slate-200" /></div>}
                                  <input type="file" name="image" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">Image 2 (Optional)</label>
                                  {editingProduct?.image2 && <div className="mb-2"><img src={\`/backend-media/\${editingProduct.image2}\`} className="h-16 rounded border border-slate-200" /></div>}
                                  <input type="file" name="image2" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">Image 3 (Optional)</label>
                                  {editingProduct?.image3 && <div className="mb-2"><img src={\`/backend-media/\${editingProduct.image3}\`} className="h-16 rounded border border-slate-200" /></div>}
                                  <input type="file" name="image3" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                                  <label className="block text-sm font-semibold text-teal-800 mb-2">Catalogue PDF (Optional)</label>
                                  {editingProduct?.catalogue_pdf && <div className="mb-2 text-sm text-teal-700"><i className="fas fa-file-pdf mr-1"></i> {editingProduct.catalogue_pdf}</div>}
                                  <input type="file" name="catalogue_pdf" accept=".pdf" className="w-full text-sm" />
                              </div>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200 shrink-0">
                          <button type="submit" disabled={isSaving} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50">
                              {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                              {isSaving ? 'Saving...' : 'Save Product'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
        </div>
      )}
    </>
  );
}`;
    
    fs.writeFileSync(file, parts[0] + newJSX);
    console.log('Successfully replaced Modal UI.');
} else {
    console.log('Token not found!');
}
