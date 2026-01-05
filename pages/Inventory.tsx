import React, { useState, useRef } from 'react';
import { Card, Button, Input, Badge, Modal, SlideOver } from '../components/ui';
import { Product, PriceHistoryEntry } from '../types';
import { useData } from '../store';
import { Plus, Search, Edit2, Trash2, Camera, Loader2, Sparkles, X, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyzeProductImage } from '../services/geminiService';

export const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [formState, setFormState] = useState<Partial<Product>>({
    name: '', category: '', sku: '', buyPrice: 0, sellPrice: 0, description: '', status: 'ACTIVE'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter active (non-deleted) products
  const activeProducts = products.filter(p => !p.isDeleted);
  
  const filteredProducts = activeProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateProfit = (buy: number, sell: number) => {
    if (!buy || !sell) return 0;
    return sell - buy;
  };

  const handleEdit = (p: Product) => {
    setSelectedProduct(p);
    setFormState(p);
    setIsModalOpen(true);
  };

  const handleHistory = (p: Product) => {
    setSelectedProduct(p);
    setIsHistoryOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure? Item will be moved to Recycle Bin.")) {
      deleteProduct(id);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const analysis = await analyzeProductImage(base64Data);
          setFormState(prev => ({
            ...prev,
            name: analysis.name || prev.name,
            category: analysis.category || prev.category,
            description: analysis.description || prev.description,
            // Gemini suggests retail price, map to sellPrice
            sellPrice: (analysis as any).suggestedPrice || prev.sellPrice
          }));
        } catch (err) {
          alert('Failed to analyze image.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.sellPrice) return;

    const productPayload: Product = {
      id: selectedProduct ? selectedProduct.id : Math.random().toString(36).substr(2, 9),
      name: formState.name,
      category: formState.category || 'General',
      sku: formState.sku || `SKU-${Math.floor(Math.random()*10000)}`,
      buyPrice: Number(formState.buyPrice),
      sellPrice: Number(formState.sellPrice),
      description: formState.description || '',
      isDeleted: false,
      history: selectedProduct ? selectedProduct.history : [],
      lastUpdated: new Date().toISOString(),
      status: formState.status || 'ACTIVE'
    };

    if (selectedProduct) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }
    
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormState({ name: '', category: '', sku: '', buyPrice: 0, sellPrice: 0, description: '', status: 'ACTIVE' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Price Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage buy/sell rates and view price history.</p>
        </div>
        <Button onClick={() => { setSelectedProduct(null); setFormState({}); setIsModalOpen(true); }} variant="secondary">
          <Plus size={16} className="inline mr-2" />
          Add Item
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, SKU, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue outline-none bg-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Buy Price</th>
                <th className="px-6 py-3">Sell Price</th>
                <th className="px-6 py-3">Profit</th>
                <th className="px-6 py-3">History</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const profit = calculateProfit(product.buyPrice, product.sellPrice);
                const isLoss = profit < 0;
                
                return (
                <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.sku}</div>
                  </td>
                  <td className="px-6 py-4">${product.buyPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${product.sellPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 ${isLoss ? "text-red-600 font-bold" : "text-green-600 font-medium"}`}>
                      {isLoss && <AlertTriangle size={12} />}
                      ${profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <button onClick={() => handleHistory(product)} className="text-gray-400 hover:text-amazon-blue transition-colors">
                       <Clock size={18} />
                     </button>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400" onClick={() => handleEdit(product)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
           {/* AI Section (Only for new products) */}
           {!selectedProduct && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Sparkles size={18} />
                  <span className="text-sm font-medium">AI Autofill</span>
                </div>
                <div className="relative">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <Button variant="outline" className="py-1 px-2 text-xs h-8" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : 'Scan Image'}
                  </Button>
                </div>
              </div>
           )}

           <Input label="Name" value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} />
           <div className="grid grid-cols-2 gap-4">
             <Input label="Category" value={formState.category || ''} onChange={e => setFormState({...formState, category: e.target.value})} />
             <Input label="SKU" value={formState.sku || ''} onChange={e => setFormState({...formState, sku: e.target.value})} />
           </div>
           
           <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600">
             <Input label="Buy Price ($)" type="number" value={formState.buyPrice || 0} onChange={e => setFormState({...formState, buyPrice: parseFloat(e.target.value)})} />
             <Input label="Sell Price ($)" type="number" value={formState.sellPrice || 0} onChange={e => setFormState({...formState, sellPrice: parseFloat(e.target.value)})} />
           </div>

           <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input 
                  type="checkbox" 
                  checked={formState.status === 'DRAFT'} 
                  onChange={(e) => setFormState({...formState, status: e.target.checked ? 'DRAFT' : 'ACTIVE'})}
                  className="rounded text-amazon-blue focus:ring-amazon-blue"
                />
                Save as Draft
              </label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">{selectedProduct ? "Update" : "Add Product"}</Button>
              </div>
           </div>
        </form>
      </Modal>

      {/* History SlideOver */}
      <SlideOver isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Price History">
        {selectedProduct && selectedProduct.history.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No history recorded yet.</div>
        ) : (
          <div className="space-y-6">
            <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6">
              {selectedProduct?.history.map((entry, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-0 h-4 w-4 rounded-full bg-amazon-blue border-2 border-white dark:border-gray-800"></div>
                  <p className="text-xs text-gray-500 mb-1">{new Date(entry.timestamp).toLocaleString()}</p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                    <div className="flex justify-between">
                       <span className="text-gray-500 dark:text-gray-400">Buy Price:</span>
                       <span className="font-mono">
                         <span className="line-through text-gray-400 mr-2">${entry.oldBuyPrice}</span>
                         <span className="font-bold text-gray-900 dark:text-white">${entry.newBuyPrice}</span>
                       </span>
                    </div>
                    <div className="flex justify-between mt-1">
                       <span className="text-gray-500 dark:text-gray-400">Sell Price:</span>
                       <span className="font-mono">
                         <span className="line-through text-gray-400 mr-2">${entry.oldSellPrice}</span>
                         <span className="font-bold text-amazon-blue dark:text-sky-400">${entry.newSellPrice}</span>
                       </span>
                    </div>
                    <div className="mt-2 text-xs text-right text-gray-400">By: {entry.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
};
