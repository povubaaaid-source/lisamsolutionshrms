"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Sliders, MoreVertical, MessageSquare, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialColumns = [
  { id: 1, name: "New", color: "#03a9f3", leads: [
    { id: 101, name: "John Smith", company: "TechStart Inc.", value: "$5,000", agent: "Alice S.", source: "Email" },
    { id: 102, name: "Peter Parker", company: "Daily Bugle", value: "$1,200", agent: "Bob J.", source: "Social Media" },
  ]},
  { id: 2, name: "Qualified", color: "#00c292", leads: [
    { id: 103, name: "Sarah Connor", company: "Global Corp", value: "$10,000", agent: "Alice S.", source: "Website" },
  ]},
  { id: 3, name: "Proposal Sent", color: "#ab8ce4", leads: [
    { id: 104, name: "Diana Prince", company: "Amazonia Ltd.", value: "$7,500", agent: "Carol W.", source: "Cold Call" },
  ]},
  { id: 4, name: "In Contact", color: "#fec107", leads: [] },
  { id: 5, name: "Junk", color: "#e46a76", leads: [
    { id: 105, name: "Mike Tyson", company: "BoxTech", value: "$0", agent: "Alice S.", source: "Referral" },
  ]},
];

export default function LeadsKanbanPage() {
  const [columns, setColumns] = useState(initialColumns);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Lead Kanban Board</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link href="/leads" className="hover:text-primary">Leads</Link>
              <span>/</span>
              <span className="text-gray-700">Kanban Board</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/leads" className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold h-8 flex items-center hover:bg-gray-200 transition-all">
              List View
            </Link>
            <Button className="flex items-center space-x-1 bg-primary hover:bg-primary/90 text-white border-none text-[10px] h-8 px-3">
              <Plus className="h-3 w-3" />
              <span>Add Lead</span>
            </Button>
          </div>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-thin scrollbar-thumb-gray-200">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-72">
              <div 
                className="flex items-center justify-between p-3 rounded-t-lg bg-white border-t-4 shadow-sm mb-4"
                style={{ borderTopColor: column.color }}
              >
                <div className="flex items-center space-x-2">
                  <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-wider">{column.name}</h3>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {column.leads.length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {column.leads.map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-grab active:scale-95 group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{lead.source}</span>
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {lead.agent.split(' ')[0][0]}{lead.agent.split(' ')[1][0]}
                      </div>
                    </div>
                    <Link href={`/leads/${lead.id}`} className="text-xs font-bold text-gray-800 mb-1 leading-tight hover:text-primary transition-colors block">
                      {lead.name}
                    </Link>
                    <p className="text-[10px] text-gray-400 mb-3 font-medium">{lead.company}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                      <div className="text-[11px] font-black text-gray-700">{lead.value}</div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-primary rounded transition-all">
                          <Mail className="h-3 w-3" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-primary rounded transition-all">
                          <Phone className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {column.leads.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-gray-100 rounded-lg flex flex-center justify-center text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No Leads</p>
                  </div>
                )}

                <button className="w-full py-2 border border-gray-100 rounded bg-white text-gray-400 hover:text-primary hover:border-primary/20 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                  <Plus className="h-3 w-3" />
                  <span>Add Lead</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
