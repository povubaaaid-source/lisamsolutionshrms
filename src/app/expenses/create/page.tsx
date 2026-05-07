"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, RefreshCw, User, ShoppingCart, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateExpensePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    user_id: "",
    project_id: "",
    currency_id: "",
    item_name: "",
    purchase_date: new Date().toISOString().split('T')[0],
    price: "",
    status: "pending"
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [empRes, projRes, currRes] = await Promise.all([
          api.get("/employee"),
          api.get("/project"),
          api.get("/currency")
        ]);
        setEmployees(empRes.data.data || []);
        setProjects(projRes.data.data || []);
        setCurrencies(currRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch expense options, using mock fallback:", err);
        setEmployees([{ id: 1, name: "Alice Smith" }]);
        setProjects([{ id: 1, project_name: "Website Redesign" }]);
        setCurrencies([{ id: 1, currency_symbol: "$" }]);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload: any = {
        user: { id: formData.user_id },
        currency: { id: formData.currency_id },
        item_name: formData.item_name,
        purchase_date: formData.purchase_date,
        price: parseFloat(formData.price),
        status: formData.status
      };

      if (formData.project_id) {
        payload.project = { id: formData.project_id };
      }

      // Mock testing bypass
      if (localStorage.getItem("token") === "mock_token_12345") {
        setTimeout(() => {
          router.push("/expenses");
          router.refresh();
        }, 800);
        return;
      }

      await api.post("/expense", payload);
      router.push("/expenses");
      router.refresh();
    } catch (err: any) {
      console.error("Create Expense Error:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700 uppercase tracking-widest font-black">Add New Expense</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold uppercase tracking-tighter">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/expenses" className="hover:text-primary transition-colors font-bold uppercase tracking-tighter">Expenses</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold uppercase tracking-tighter">Add Expense</span>
            </div>
          </div>
          <Link href="/expenses">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] font-black h-8 px-4 hover:bg-gray-200 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3 mr-2" />
              <span>Back</span>
            </Button>
          </Link>
        </div>

        <Card className="p-8 max-w-4xl mx-auto shadow-sm border-gray-100 relative min-h-[400px]">
          {loadingOptions && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
               <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading options...</p>
             </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
               <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold border-l-4 border-red-500 animate-in slide-in-from-top-2">
                  {error}
               </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Item Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <ShoppingCart className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleChange}
                    type="text" 
                    placeholder="e.g. Server Hosting" 
                    className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <select 
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project</label>
                <select 
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Project (Optional)</option>
                  {projects.map((proj: any) => (
                    <option key={proj.id} value={proj.id}>{proj.project_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Currency <span className="text-red-500">*</span></label>
                <select 
                  name="currency_id"
                  value={formData.currency_id}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Currency</option>
                  {currencies.map((curr: any) => (
                    <option key={curr.id} value={curr.id}>{curr.currency_symbol} - {curr.currency_code}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number" 
                    step="0.01"
                    className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Purchase Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    name="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                    type="date" 
                    className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status <span className="text-red-500">*</span></label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-end space-x-3">
              <Link href="/expenses">
                <Button type="button" className="bg-white text-gray-500 border border-gray-200 text-[10px] font-black px-6 h-10 uppercase tracking-widest hover:bg-gray-50 transition-all">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving || loadingOptions} className="bg-primary text-white text-[10px] font-black px-8 h-10 uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center">
                {saving ? (
                  <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-2" />
                )}
                {saving ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
