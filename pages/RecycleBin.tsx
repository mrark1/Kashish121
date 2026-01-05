import React from 'react';
import { Card, Button, Badge } from '../components/ui';
import { useData } from '../store';
import { RotateCcw, Trash2, AlertOctagon } from 'lucide-react';

export const RecycleBin = () => {
  const { products, restoreProduct, deleteProduct } = useData();
  const deletedProducts = products.filter(p => p.isDeleted);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recycle Bin</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Restore accidentally deleted items or remove them permanently.</p>
      </div>

      <Card className="p-4">
        {deletedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Trash2 size={48} className="mx-auto mb-4 opacity-20" />
            <p>Recycle Bin is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Last Price</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedProducts.map((product) => (
                  <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 opacity-75">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4"><Badge>{product.category}</Badge></td>
                    <td className="px-6 py-4">${product.sellPrice}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <Button variant="secondary" onClick={() => restoreProduct(product.id)} className="py-1 px-3 text-xs">
                        <RotateCcw size={14} className="mr-1 inline" /> Restore
                      </Button>
                      <Button variant="danger" onClick={() => {
                          if(confirm("Permanently delete? This cannot be undone.")) deleteProduct(product.id, true);
                      }} className="py-1 px-3 text-xs">
                        <AlertOctagon size={14} className="mr-1 inline" /> Destroy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
