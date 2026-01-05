import React, { useState } from 'react';
import { useData } from '../store';
import { Search, ArrowLeft } from 'lucide-react';
import { AppRoute } from '../types';

export const PublicPriceList = ({ onNavigate }: { onNavigate: (r: AppRoute) => void }) => {
  const { products } = useData();
  const [term, setTerm] = useState('');

  const publicProducts = products
    .filter(p => !p.isDeleted && p.status === 'ACTIVE')
    .filter(p => p.name.toLowerCase().includes(term.toLowerCase()));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-amazon-nav py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">
             <span className="text-amazon-orange">Kashish</span> Hardware Price List
          </div>
          <button onClick={() => onNavigate(AppRoute.LOGIN)} className="text-gray-300 hover:text-white text-sm flex items-center gap-1">
             <ArrowLeft size={16} /> Admin Login
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="relative mb-8">
           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
           <input 
              type="text" 
              placeholder="Search for tools, items..." 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:border-amazon-orange outline-none bg-gray-50 dark:bg-gray-800"
              autoFocus
            />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {publicProducts.map(p => (
            <div key={p.id} className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors">
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-500 dark:text-gray-400">{p.category}</span>
              </div>
              <div className="text-2xl font-bold text-amazon-blue dark:text-sky-400">
                ${p.sellPrice.toFixed(2)}
              </div>
            </div>
          ))}
          {publicProducts.length === 0 && (
             <div className="text-center text-gray-400 mt-12">No products found.</div>
          )}
        </div>
      </main>
    </div>
  );
};
