"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  RefreshCw, 
  Ticket, 
  Search, 
  Filter, 
  Calendar,
  User,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Check,
  Trash2,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function TicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Mock data for legacy parity
      setTickets([
        { id: 101, subject: "Server access issue", requester: "John Doe", priority: "urgent", status: "open", agent: "Admin", date: "2024-05-01" },
        { id: 102, subject: "Login loop on mobile", requester: "Jane Smith", priority: "high", status: "pending", agent: "Super Admin", date: "2024-05-03" },
        { id: 103, subject: "Reset password help", requester: "Robert Fox", priority: "medium", status: "resolved", agent: "Admin", date: "2024-05-05" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Ticket className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Support Tickets
                </h4>
            </div>
            <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12 flex justify-end items-center space-x-2">
                <Link href="/tickets/create">
                    <Button className="btn-success btn-outline btn-sm">
                        Add Ticket <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                </Link>
                <ol className="breadcrumb hidden-xs">
                    <li><Link href="/dashboard">Home</Link></li>
                    <li className="active">Support Tickets</li>
                </ol>
            </div>
        </div>

        {/* Filter Section (Legacy Pattern) */}
        <div className="white-box">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Date Range</label>
                    <div className="relative">
                        <input type="text" className="form-control pl-8" placeholder="01-05-2024 - 07-05-2024" />
                        <Calendar className="h-3 w-3 absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                    <select className="form-control">
                        <option>All</option>
                        <option>Open</option>
                        <option>Pending</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Priority</label>
                    <select className="form-control">
                        <option>All</option>
                        <option>Urgent</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <Button className="btn-success btn-sm flex-1"><Check className="h-4 w-4 mr-1" /> Apply</Button>
                    <Button className="btn-inverse btn-sm flex-1"><RefreshCw className="h-4 w-4 mr-1" /> Reset</Button>
                </div>
            </div>
        </div>

        {/* Tickets Table */}
        <div className="white-box p-0">
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="w-16 text-center">ID</th>
                            <th>Subject</th>
                            <th>Requester</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Agent</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td className="text-center font-bold text-primary">#{ticket.id}</td>
                                <td>
                                    <div className="font-bold text-[13px]">{ticket.subject}</div>
                                    <div className="text-[10px] text-gray-400 font-medium">Created: {ticket.date}</div>
                                </td>
                                <td>
                                    <div className="flex items-center">
                                        <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-[10px] font-bold text-gray-500 border border-gray-200">
                                            {ticket.requester.charAt(0)}
                                        </div>
                                        <span className="font-medium">{ticket.requester}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        ticket.priority === 'urgent' ? 'bg-red-500 text-white' :
                                        ticket.priority === 'high' ? 'bg-orange-400 text-white' : 'bg-blue-400 text-white'
                                    }`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td>
                                    <span className={`label ${
                                        ticket.status === 'open' ? 'label-success' :
                                        ticket.status === 'pending' ? 'label-warning' : 'label-inverse'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td>{ticket.agent}</td>
                                <td className="text-right">
                                    <div className="flex justify-end space-x-1">
                                        <button className="btn-info btn-outline p-1 rounded hover:bg-info hover:text-white transition-all">
                                            <MessageSquare className="h-4 w-4" />
                                        </button>
                                        <button className="btn-danger btn-outline p-1 rounded hover:bg-danger hover:text-white transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
