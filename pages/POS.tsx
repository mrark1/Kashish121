import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Sale, SaleItem } from '../types';
import { useData } from '../store';
import { Search, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export const POS = () => {
  const { products, addSale } = useData();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Only show active, non-deleted products
  const activeProducts = products.filter(p => !p.isDeleted && p.status === 'ACTIVE');
  
  const filteredProducts = activeProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, priceAtSale: product.sellPrice }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item; 
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.quantity * item.priceAtSale), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Calculate total profit for this sale based on current buy prices
    let totalProfit = 0;
    cart.forEach(item => {
       const product = products.find(p => p.id === item.productId);
       if (product) {
         totalProfit += (item.priceAtSale - product.buyPrice) * item.quantity;
       }
    });

    const newSale: Sale = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      items: [...cart],
      total: totalAmount,
      profit: totalProfit,
      paymentMethod: 'CASH'
    };

    addSale(newSale);
    setCart([]);
    alert('Order completed successfully!');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      {/* Product List */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 relative">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
           <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-amazon-blue outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              autoFocus
            />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4 pr-2">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product.id)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-amazon-blue dark:hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.sku}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-gray-900 dark:text-white">${product.sellPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <Card className="w-full lg:w-96 flex flex-col h-full border-0 lg:border bg-white dark:bg-gray-800">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart size={20} /> Current Order
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">${item.priceAtSale} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item.productId)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded ml-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <Button 
            variant="secondary" 
            className="w-full py-3 text-lg" 
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Complete Payment
          </Button>
        </div>
      </Card>
    </div>
  );
};
