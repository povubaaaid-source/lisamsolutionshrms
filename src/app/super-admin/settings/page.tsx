"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Settings, 
  Mail, 
  CreditCard, 
  Shield,
  Save,
  Languages,
  Layout,
  Plus,
  Trash2,
  User
} from "lucide-react";
import { useState } from "react";
import apiClient from "@/lib/api-client";

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [platformAdmins, setPlatformAdmins] = useState([
    { id: 1, name: "Platform Owner", email: "superadmin@example.com", status: "active" },
  ]);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'payment', label: 'Payment Settings', icon: CreditCard },
    { id: 'theme', label: 'Theme Settings', icon: Layout },
    { id: 'auth', label: 'Auth Settings', icon: Shield },
    { id: 'language', label: 'Language Settings', icon: Languages },
  ];

  const addPlatformAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;

    const nextAdmin = {
      id: Date.now(),
      name: newAdmin.name,
      email: newAdmin.email,
      status: "active",
    };

    setPlatformAdmins((current) => [...current, nextAdmin]);
    setNewAdmin({ name: "", email: "", password: "" });

    try {
      await apiClient.create("settings", {
        type: "platform_admin",
        ...newAdmin,
        role: "super_admin",
      });
    } catch (err) {
      console.warn("Platform admin endpoint pending:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="row bg-title mb-6">
            <div className="col-lg-12">
                <h4 className="page-title m-0">
                    <Settings className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Global Settings
                </h4>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64">
                <div className="white-box p-0 overflow-hidden">
                    <nav className="flex flex-col">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-4 text-[12px] font-bold uppercase tracking-wider border-b border-[#f2f2f3] transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-[#03a9f3] text-white' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <tab.icon className="h-4 w-4 mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <div className="white-box">
                    <h3 className="box-title mb-8 border-b border-[#f2f2f3] pb-4">{tabs.find(t => t.id === activeTab)?.label}</h3>
                    
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Company Name</label>
                                <input type="text" className="form-control" defaultValue="Lisam Solutions HR" />
                            </div>
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Company Email</label>
                                <input type="email" className="form-control" defaultValue="admin@lisam.com" />
                            </div>
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Company Phone</label>
                                <input type="text" className="form-control" defaultValue="+1 234 567 890" />
                            </div>
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Company Website</label>
                                <input type="url" className="form-control" defaultValue="https://lisam.com" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Company Address</label>
                                <textarea className="form-control min-h-[100px] py-3"></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'auth' && (
                        <div className="space-y-8">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs font-bold leading-relaxed text-blue-700">
                                Super admins are internal system owners. They can manage company or branch records, admins, permissions, and global settings. They should not be treated as regular employee workspace users.
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Name</label>
                                    <input value={newAdmin.name} onChange={(event) => setNewAdmin((current) => ({ ...current, name: event.target.value }))} className="form-control" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Email</label>
                                    <input type="email" value={newAdmin.email} onChange={(event) => setNewAdmin((current) => ({ ...current, email: event.target.value }))} className="form-control" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Password</label>
                                    <input type="password" value={newAdmin.password} onChange={(event) => setNewAdmin((current) => ({ ...current, password: event.target.value }))} className="form-control" />
                                </div>
                                <div className="flex items-end">
                                    <Button type="button" onClick={addPlatformAdmin} className="btn-success w-full">
                                        <Plus className="h-4 w-4 mr-2" /> Add Super Admin
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Email</th>
                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                            <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {platformAdmins.map((admin) => (
                                            <tr key={admin.id}>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                            <User className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-xs font-black text-gray-800">{admin.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-xs font-bold text-gray-500">{admin.email}</td>
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-green-600">{admin.status}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <button onClick={() => setPlatformAdmins((current) => current.filter((item) => item.id !== admin.id))} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'general' && activeTab !== 'auth' && (
                        <div className="py-20 text-center text-gray-400">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Settings className="h-8 w-8 text-gray-200" />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Configuration for {tabs.find(t => t.id === activeTab)?.label} coming soon.</p>
                        </div>
                    )}

                    <div className="mt-10 pt-6 border-t border-[#f2f2f3] flex justify-end">
                        <Button className="btn-success">
                            <Save className="h-4 w-4 mr-2" /> Save Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
