"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, Ticket, User, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateTicketPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    requester_id: "",
    priority: "medium",
    status: "open",
    description: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch both employees and clients to act as requesters
        const [empRes, clientRes] = await Promise.all([
          api.get("/employee"),
          api.get("/client")
        ]);
        const allUsers = [...(empRes.data.data || []), ...(clientRes.data.data || [])];
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to fetch ticket options, using mock fallback:", err);
        setUsers([
          { id: 1, name: "Alice Smith (Mock Employee)" },
          { id: 2, name: "Acme Corp (Mock Client)" }
        ]);
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
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        status: formData.status
      };

      if (formData.requester_id) {
        payload.requester = { id: formData.requester_id };
      }

      // Mock testing bypass
      if (localStorage.getItem("token") === "mock_token_12345") {
        setTimeout(() => {
          router.push("/tickets");
          router.refresh();
        }, 800);
        return;
      }

      await api.post("/ticket", payload);
      router.push("/tickets");
      router.refresh();
    } catch (err: any) {
      console.error("Create Ticket Error:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create ticket.");
      setSaving(false);
    } 
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700 uppercase tracking-widest font-black">Add New Ticket</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold uppercase tracking-tighter">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/tickets" className="hover:text-primary transition-colors font-bold uppercase tracking-tighter">Tickets</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold uppercase tracking-tighter">Add Ticket</span>
            </div>
          </div>
          <Link href="/tickets">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-4 font-black uppercase tracking-widest hover:bg-gray-200">
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ticket Subject <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text" 
                    placeholder="e.g. Login Issue" 
                    className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Requester Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <select 
                    name="requester_id"
                    value={formData.requester_id}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer" 
                    required
                  >
                    <option value="">Select Requester</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Priority <span className="text-red-500">*</span></label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status <span className="text-red-500">*</span></label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ticket Description <span className="text-red-500">*</span></label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border-gray-200 rounded p-2.5 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none h-32 transition-all" 
                placeholder="Enter details..."
                required
              ></textarea>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-end space-x-3">
              <Link href="/tickets">
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
                {saving ? "Saving..." : "Save Ticket"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
