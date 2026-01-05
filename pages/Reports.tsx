import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { useData } from '../store';
import { generateBusinessReport } from '../services/geminiService';
import { Bot, FileText, Loader2, Sparkles } from 'lucide-react';

export const Reports = ({ products: _p, sales: _s }: { products: any[], sales: any[] }) => {
  // Ignore props, use store
  const { products, sales } = useData();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const recentSales = sales.slice(-20); 
      // Changed lowStock logic to just check status or recent updates since stock is gone
      const recentUpdates = products.filter(p => !p.isDeleted).slice(0, 10);
      
      const result = await generateBusinessReport(recentSales, recentUpdates);
      setReport(result);
    } catch (e) {
      setReport("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Business Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Strategic analysis powered by Gemini 3.</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={loading} variant="primary">
          {loading ? <Loader2 className="animate-spin mr-2 inline" /> : <Bot className="mr-2 inline" />}
          {loading ? 'Analyzing Data...' : 'Generate New Report'}
        </Button>
      </div>

      {!report && !loading && (
        <Card className="p-12 text-center text-gray-400 dark:text-gray-600 border-dashed border-2 dark:border-gray-700">
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">No report generated yet</h3>
          <p className="mt-2">Click the button above to have our AI analyze your sales and pricing data.</p>
        </Card>
      )}

      {loading && (
        <Card className="p-12 text-center">
          <Loader2 size={48} className="mx-auto mb-4 animate-spin text-amazon-blue" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">Generating Insights...</h3>
          <p className="text-gray-500 text-sm mt-2">Gemini is reviewing your transactions and margins.</p>
        </Card>
      )}

      {report && !loading && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-amazon-blue to-blue-800 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles size={20} /> Weekly Strategic Brief
            </h2>
            <p className="text-blue-100 text-sm mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="p-8 prose prose-blue dark:prose-invert max-w-none">
             <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {report.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('#') ? "font-bold text-lg mt-4 mb-2 text-gray-900 dark:text-white" : "mb-2"}>
                        {line.replace(/^#+\s/, '')}
                    </p>
                ))}
             </div>
          </div>
        </Card>
      )}
    </div>
  );
};
