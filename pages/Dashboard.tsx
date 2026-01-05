import React from 'react';
import { Card } from '../components/ui';
import { useData } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Package } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: { title: string, value: string, icon: any, trend?: string, trendUp?: boolean }) => (
  <Card className="p-6 flex flex-col justify-between h-full border-l-4 border-l-amazon-blue dark:bg-gray-800 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-full text-amazon-blue dark:text-sky-400">
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${trendUp ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {trendUp ? '+' : '-'}{trend}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    )}
  </Card>
);

export const Dashboard = () => {
  const { products, sales } = useData();

  // Calculate metrics
  // Filter active products
  const activeProducts = products.filter(p => !p.isDeleted);
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalOrders = sales.length;
  // Low margin check: Sell Price < Buy Price + 10%
  const lowMarginProducts = activeProducts.filter(p => p.sellPrice < p.buyPrice * 1.1);
  const totalPotentialProfit = activeProducts.reduce((acc, p) => acc + (p.sellPrice - p.buyPrice), 0);

  // Prepare chart data (Last 7 sales aggregation)
  const salesByDay = sales.reduce((acc: any, sale) => {
    const date = new Date(sale.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {});

  const chartData = Object.keys(salesByDay).map(date => ({
    name: date,
    sales: salesByDay[date]
  })).slice(-7);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Operational Overview for Kashish Hardware.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="12.5%" 
          trendUp={true} 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon={Package} 
          trend="8.1%" 
          trendUp={true} 
        />
        <StatCard 
          title="Avg. Margin Potential" 
          value={`$${(totalPotentialProfit / (activeProducts.length || 1)).toFixed(2)}`} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Low Margin Alerts" 
          value={lowMarginProducts.length.toString()} 
          icon={AlertTriangle}
          trend={lowMarginProducts.length > 0 ? "Review Pricing" : "Healthy"}
          trendUp={lowMarginProducts.length === 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.length > 0 ? chartData : [{name: 'No Data', sales: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb' }} 
                />
                <Line type="monotone" dataKey="sales" stroke="#007185" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pricing Alerts</h3>
          <div className="space-y-4">
            {lowMarginProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">All products have healthy margins.</p>
            ) : (
              lowMarginProducts.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/30">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-500">Buy: ${p.buyPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">${p.sellPrice}</p>
                    <p className="text-xs text-red-500">Low Margin</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};