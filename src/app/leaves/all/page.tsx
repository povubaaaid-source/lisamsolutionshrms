"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { 
  Calendar, 
  Filter, 
  RefreshCw, 
  User, 
  FileText, 
  ChevronDown,
  Download,
  Eye,
  Trash2,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type LeaveRecord = {
  id: number;
  employee: {
    name: string;
    avatar: string | null;
  };
  date: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
};

type EmployeeOption = {
  id: number;
  name: string;
};

const mockLeaves: LeaveRecord[] = [
  { id: 101, employee: { name: "Alice Smith", avatar: null }, date: "2026-05-10", type: "Casual", status: "pending", reason: "Family event" },
  { id: 102, employee: { name: "Bob Johnson", avatar: null }, date: "2026-05-12", type: "Sick", status: "approved", reason: "Medical" },
  { id: 103, employee: { name: "Charlie Brown", avatar: null }, date: "2026-05-01", type: "Earned", status: "rejected", reason: "Project deadline" },
  { id: 104, employee: { name: "Diana Ross", avatar: null }, date: "2026-04-25", type: "Sick", status: "approved", reason: "Flu" },
  { id: 105, employee: { name: "Edward Norton", avatar: null }, date: "2026-04-20", type: "Casual", status: "approved", reason: "Travel" },
];

const mockEmployees: EmployeeOption[] = [
  { id: 1, name: "Alice Smith" },
  { id: 2, name: "Bob Johnson" },
  { id: 3, name: "Charlie Brown" },
];

export default function AllLeavesPage() {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRecord[]>(mockLeaves);
  const [employees] = useState<EmployeeOption[]>(mockEmployees);
  
  // Filters matching all-leaves.blade.php
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchData = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLeaves(mockLeaves);
      setLoading(false);
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-50 border-green-100';
      case 'rejected': return 'text-red-500 bg-red-50 border-red-100';
      case 'pending': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-full overflow-x-hidden pb-10">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
          <div className="flex items-center space-x-4">
             <Link href="/leaves">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer">
                   <ChevronLeft className="h-5 w-5" />
                </div>
             </Link>
            <div>
              <h1 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-widest truncate">
                Leave Records
              </h1>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider uppercase">HR / Personnel History / All Logs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
             <Button className="bg-gray-50 text-gray-400 border-none px-4 h-11 text-[9px] font-black uppercase tracking-widest rounded-xl hover:text-primary transition-all">
                <Download className="h-4 w-4 mr-2" /> Export CSV
             </Button>
             <Link href="/leaves/create">
               <Button className="bg-primary text-white text-[9px] md:text-[10px] font-black px-4 md:px-6 h-11 uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all rounded-xl">
                  Assign Leave
               </Button>
             </Link>
          </div>
        </div>

        {/* Filters Bar parity with all-leaves.blade.php */}
        <Card className="p-5 border-none shadow-sm bg-white rounded-2xl flex flex-col lg:flex-row lg:items-end gap-6 border border-gray-50">
           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center"><User className="h-3 w-3 mr-2 text-primary" /> Employee</label>
              <div className="relative">
                 <select 
                   value={filterEmployee}
                   onChange={(e) => setFilterEmployee(e.target.value)}
                   className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                 >
                    <option value="">All Employees</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
              </div>
           </div>

           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center"><Calendar className="h-3 w-3 mr-2 text-primary" /> Date Range</label>
              <div className="flex items-center space-x-2">
                 <input 
                   type="date" 
                   value={filterStartDate}
                   onChange={(e) => setFilterStartDate(e.target.value)}
                   className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20"
                 />
                 <span className="text-gray-300 text-xs font-black">TO</span>
                 <input 
                   type="date" 
                   value={filterEndDate}
                   onChange={(e) => setFilterEndDate(e.target.value)}
                   className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20"
                 />
              </div>
           </div>

           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center"><Filter className="h-3 w-3 mr-2 text-primary" /> Status</label>
              <div className="relative">
                 <select 
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                   className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                 >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
              </div>
           </div>

           <div className="flex items-center space-x-2">
              <Button onClick={fetchData} className="bg-primary text-white h-12 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                 Apply Filters
              </Button>
              <Button onClick={() => {setFilterEmployee(""); setFilterStatus("all");}} className="bg-gray-50 text-gray-400 h-12 w-12 p-0 rounded-xl hover:text-primary transition-all">
                 <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
           </div>
        </Card>

        {/* Table Results parity with all-leaves.blade.php */}
        <Card className="p-0 border-none shadow-sm bg-white rounded-3xl overflow-hidden border border-gray-50 min-h-[500px]">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                       <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                       <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Leave Date</th>
                       <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                       <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {!loading ? leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50/20 transition-all group">
                         <td className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase">#{leave.id}</td>
                         <td className="px-6 py-5">
                            <div className="flex items-center space-x-3">
                               <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/5 shadow-sm">
                                  {leave.employee.name.charAt(0)}
                               </div>
                               <span className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{leave.employee.name}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                               {new Date(leave.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-gray-200">
                               {leave.type}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(leave.status)}`}>
                               {leave.status}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center justify-center space-x-2">
                               <Link href={`/leaves/${leave.id}`} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm" title="View Details">
                                  <Eye className="h-4 w-4" />
                               </Link>
                               <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete Record">
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    )) : (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan={6} className="px-6 py-8"><div className="h-6 bg-gray-50 rounded-xl w-full"></div></td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
           
           {!loading && leaves.length === 0 && (
              <div className="py-20 text-center">
                 <FileText className="h-12 w-12 text-gray-100 mx-auto mb-4" />
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No leave records found</p>
              </div>
           )}

           <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {leaves.length} Total Records</p>
              <div className="flex space-x-2">
                 <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 hover:text-primary transition-all shadow-sm disabled:opacity-50" disabled>PREVIOUS</button>
                 <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 hover:text-primary transition-all shadow-sm disabled:opacity-50" disabled>NEXT</button>
              </div>
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
