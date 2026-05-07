"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Settings, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw,
  Wallet,
  Percent,
  Layers,
  CheckCircle2,
  XCircle
} from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PayrollSettings() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compRes, groupRes] = await Promise.all([
          api.get("/salary-components"),
          api.get("/salary-groups")
        ]);
        setComponents(compRes.data.data || []);
        setGroups(groupRes.data.data || []);
      } catch (err: any) {
        console.error("Fetch Settings Error:", err);
        // showToast("Could not load all settings.", "info");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-4 -mx-6 -mt-6 mb-6">
           <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                 <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                 <h1 className="text-base font-black text-gray-800 uppercase tracking-widest">Payroll Settings</h1>
                 <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider">Configure salary components and grouping rules</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <Button className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
                 <Plus className="h-4 w-4 mr-2" /> Add New Group
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Salary Components */}
           <Card title="Salary Components" className="border-none shadow-sm bg-white p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Earnings & Deductions</p>
                 <Button className="bg-gray-50 text-primary border-none h-8 px-4 text-[9px] font-black uppercase tracking-widest">
                    <Plus className="h-3 w-3 mr-1.5" /> Component
                 </Button>
              </div>

              <div className="space-y-4">
                 {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)
                 ) : components.length > 0 ? (
                    components.map((comp: any) => (
                       <div key={comp.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center space-x-4">
                             <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${comp.type === 'earning' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {comp.type === 'earning' ? <Wallet className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-800">{comp.component_name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{comp.type}</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit className="h-4 w-4" /></button>
                             <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="py-12 text-center">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No components configured</p>
                    </div>
                 )}
              </div>
           </Card>

           {/* Salary Groups */}
           <Card title="Salary Groups" className="border-none shadow-sm bg-white p-8">
              <div className="flex items-center justify-between mb-8">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Logical Team Groupings</p>
              </div>

              <div className="space-y-4">
                 {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)
                 ) : groups.length > 0 ? (
                    groups.map((group: any) => (
                       <div key={group.id} className="p-5 border border-gray-100 rounded-2xl hover:border-primary/30 transition-all group relative">
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                                   <Layers className="h-4 w-4" />
                                </div>
                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{group.group_name}</h4>
                             </div>
                             <div className="flex items-center space-x-1">
                                <button className="p-2 text-gray-300 hover:text-primary transition-colors"><Edit className="h-4 w-4" /></button>
                                <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                             </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{group.description || "Default grouping for administrative staff and developers."}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">4 Components Active</span>
                             <span className="text-[9px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">View Structure</span>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="py-12 text-center">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No salary groups created</p>
                    </div>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
