"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Save, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditLeadPage() {
  const router = useRouter();

  const [lead, setLead] = useState({
    name: "Mark Peterson",
    company: "Peterson Solutions",
    email: "mark@peterson.com",
    status: "In Process",
    source: "Google",
    value: "$5,000",
    phone: "+1 555 987 654"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/leads');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between -mx-6 -mt-6 mb-6">
           <div className="flex items-center space-x-4">
              <Link href="/leads" className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                 <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                 <h1 className="text-base font-black text-gray-800 uppercase tracking-widest">Edit Lead</h1>
                 <p className="text-[10px] text-gray-400 font-bold mt-0.5">Update details for {lead.name}</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <Button onClick={() => router.back()} className="bg-gray-50 text-gray-500 border-none px-6 h-10 text-[10px] font-black uppercase tracking-widest">Cancel</Button>
              <Button onClick={handleSave} className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
                 <Save className="h-4 w-4 mr-2" /> Update Lead
              </Button>
           </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <Card title="Lead Information" className="border-none shadow-sm p-8 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Name</label>
                       <input type="text" value={lead.name} onChange={(e) => setLead({...lead, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company Name</label>
                       <input type="text" value={lead.company} onChange={(e) => setLead({...lead, company: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                       <input type="email" value={lead.email} onChange={(e) => setLead({...lead, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                       <input type="text" value={lead.phone} onChange={(e) => setLead({...lead, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                 </div>
              </Card>

              <Card title="Deal Details" className="border-none shadow-sm p-8 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Value</label>
                       <input type="text" value={lead.value} onChange={(e) => setLead({...lead, value: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</label>
                       <select value={lead.source} onChange={(e) => setLead({...lead, source: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer">
                          <option>Google</option>
                          <option>Facebook</option>
                          <option>Direct Visit</option>
                          <option>Referral</option>
                       </select>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="space-y-6">
              <Card title="Lead Status" className="border-none shadow-sm p-8 bg-white">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                    <select value={lead.status} onChange={(e) => setLead({...lead, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer">
                       <option>New Lead</option>
                       <option>In Process</option>
                       <option>Converted</option>
                       <option>Lost</option>
                    </select>
                 </div>
              </Card>
           </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
