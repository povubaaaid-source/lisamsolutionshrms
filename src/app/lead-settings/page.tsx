"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, FileText, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LeadSettingsPage() {
  const [activeTab, setActiveTab] = useState("sources");

  const sources = ["Email", "Google", "Facebook", "Friend", "Direct Visit", "Tv Ads"];
  const statuses = ["Pending", "In Process", "Converted", "Lost"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Lead Settings</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/settings" className="hover:text-primary transition-colors font-bold">Settings</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Lead Settings</span>
            </div>
          </div>
          <Link href="/settings">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-3 hover:bg-gray-200">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>Back to Settings</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Configuration</h3>
              </div>
              <div className="p-2 space-y-1">
                {[
                  { id: "sources", label: "Lead Sources" },
                  { id: "status", label: "Lead Status" },
                  { id: "agents", label: "Lead Agents" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded text-sm font-bold transition-colors flex items-center justify-between ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Config Content */}
          <div className="lg:col-span-3">
            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-800 tracking-wide flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" /> 
                    Manage {activeTab === "sources" ? "Lead Sources" : activeTab === "status" ? "Lead Status" : "Lead Agents"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure {activeTab} for your sales pipeline.</p>
                </div>
                <Button className="bg-primary text-white text-[10px] font-bold px-6 h-9 uppercase tracking-widest shadow-sm shadow-primary/20">
                  <Plus className="h-3.5 w-3.5 mr-2" /> Add {activeTab.slice(0, -1)}
                </Button>
              </div>

              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(activeTab === "sources" ? sources : statuses).map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">{item}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-400 hover:text-blue-600 transition-colors p-1"><Edit className="h-4 w-4" /></button>
                            <button className="text-red-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
