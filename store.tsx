import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sale, User, UserRole, PriceHistoryEntry } from './types';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// --- Data Context ---
interface DataContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string, permanent?: boolean) => void;
  restoreProduct: (id: string) => void;
  addSale: (s: Sale) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

// --- Initial Mock Data ---
const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', name: 'Dewalt 20V Max Cordless Drill', category: 'Power Tools', sku: 'DCD771C2', 
    buyPrice: 70.00, sellPrice: 99.00, description: 'Compact drill driver kit', 
    isDeleted: false, history: [], lastUpdated: new Date().toISOString(), status: 'ACTIVE' 
  },
  { 
    id: '2', name: 'Stanley FatMax Tape Measure 25ft', category: 'Hand Tools', sku: 'STHT33989', 
    buyPrice: 10.50, sellPrice: 19.99, description: 'Durable tape measure', 
    isDeleted: false, history: [], lastUpdated: new Date().toISOString(), status: 'ACTIVE' 
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kh_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('kh_theme') as 'light' | 'dark') || 'light';
  });

  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kh_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('kh_sales');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => {
    if (user) localStorage.setItem('kh_user', JSON.stringify(user));
    else localStorage.removeItem('kh_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kh_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kh_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('kh_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Auth Actions
  const login = (u: string, p: string) => {
    // Hardcoded secure login for Owner
    if (u === 'admin' && p === 'admin123') {
      setUser({ username: 'Owner', role: 'OWNER' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Data Actions
  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => {
      if (p.id === updated.id) {
        // Check for price changes to record history
        if (p.buyPrice !== updated.buyPrice || p.sellPrice !== updated.sellPrice) {
          const entry: PriceHistoryEntry = {
            timestamp: new Date().toISOString(),
            oldBuyPrice: p.buyPrice,
            newBuyPrice: updated.buyPrice,
            oldSellPrice: p.sellPrice,
            newSellPrice: updated.sellPrice,
            user: user?.username || 'System'
          };
          return { ...updated, history: [entry, ...p.history] };
        }
        return updated;
      }
      return p;
    }));
  };

  const deleteProduct = (id: string, permanent = false) => {
    if (permanent) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true } : p));
    }
  };

  const restoreProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false } : p));
  };

  const addSale = (sale: Sale) => setSales(prev => [sale, ...prev]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, theme, toggleTheme }}>
      <DataContext.Provider value={{ products, sales, addProduct, updateProduct, deleteProduct, restoreProduct, addSale }}>
        {children}
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useData = () => useContext(DataContext);
