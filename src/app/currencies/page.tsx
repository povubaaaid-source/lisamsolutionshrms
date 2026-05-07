"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await api.get("/currency");
      setCurrencies(response.data.data);
    } catch (err) {
      console.error("Fetch Currencies Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this currency?")) {
      try {
        await api.delete(`/currency/${id}`);
        setCurrencies(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error("Delete Currency Error:", err);
        alert("Failed to delete currency");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700 uppercase tracking-widest font-black">Currency Settings</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold uppercase tracking-tighter">Home</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold uppercase tracking-tighter">Currencies</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchCurrencies}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/settings">
              <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-3 hover:bg-gray-200 uppercase tracking-widest font-black">
                <ArrowLeft className="h-3 w-3 mr-1" />
                <span>Back</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden relative min-h-[300px]">
              {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-800 tracking-wide flex items-center uppercase">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" /> 
                    Currencies
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">Manage currency types and their conversion rates.</p>
                </div>
                <Button className="bg-primary/10 text-primary border-none text-[10px] font-black px-4 h-8 uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
                </Button>
              </div>

              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Code</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Symbol</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Exchange Rate</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currencies.length > 0 ? currencies.map((currency) => (
                      <tr key={currency.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-800">{currency.currency_name || currency.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">{currency.currency_code || currency.code}</td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-600">{currency.currency_symbol || currency.symbol}</td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-600 text-right">{currency.exchange_rate || currency.exchangeRate}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-40 hover:opacity-100 transition-opacity">
                            <button className="text-blue-400 hover:text-blue-600 transition-colors p-1"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(currency.id)} className="text-red-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-xs font-medium text-gray-500">
                          No currencies found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-blue-200 bg-blue-50/50 shadow-sm">
              <h3 className="text-[10px] font-black text-blue-800 mb-2 uppercase tracking-widest">Exchange Rates</h3>
              <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                Exchange rates are used to convert currency amounts in reports and dashboards. You can manually update them or use the automatic update feature.
              </p>
            </Card>

            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Automatic Update</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-700 uppercase">Auto Update Rate</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Converter API Key</label>
                  <input type="text" placeholder="Enter API Key" className="w-full border-gray-200 rounded-xl bg-gray-50 p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <Button className="w-full bg-primary text-white text-[10px] font-black h-11 uppercase tracking-widest shadow-lg shadow-primary/20 mt-2">
                  Save Config
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
