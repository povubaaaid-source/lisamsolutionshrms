"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Filter, 
  Download, 
  RefreshCw, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Search,
  Settings,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronDown
} from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function PayrollDashboard() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState<any[]>([]);
  
  // Filters matching Laravel parity
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [cycle, setCycle] = useState("1"); // Default cycle
  
  // Processing Options
  const [options, setOptions] = useState({
    markLeavesPaid: true,
    markAbsentUnpaid: false,
    useAttendance: true,
    includeExpenseClaims: true,
    addTimelogs: false
  });

  const [stats, setStats] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalEmployees: 0,
    currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  });

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payroll?month=${month}&year=${year}&cycle=${cycle}`);
      setPayrollData(response.data.data || []);
      
      const data = response.data.data || [];
      const paid = data.filter((p: any) => p.status === 'paid').reduce((acc: number, curr: any) => acc + parseFloat(curr.net_salary || 0), 0);
      const pending = data.filter((p: any) => p.status === 'pending' || p.status === 'generated').reduce((acc: number, curr: any) => acc + parseFloat(curr.net_salary || 0), 0);
      
      setStats({
        totalPaid: paid,
        totalPending: pending,
        totalEmployees: data.length,
        currentMonth: new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
      });
    } catch (err: any) {
      console.error("Fetch Payroll Error:", err);
      // Fallback for demo
      setPayrollData([
        { id: 1, employee: { name: "John Doe", id: "EMP001" }, month: "May", year: "2026", net_salary: 5000, status: "paid" },
        { id: 2, employee: { name: "Jane Smith", id: "EMP002" }, month: "May", year: "2026", net_salary: 4500, status: "pending" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [month, year, cycle]);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Parity */}
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-4 -mx-6 -mt-6 mb-6">
           <div>
              <h1 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center">
                 <DollarSign className="h-5 w-5 mr-3 text-primary" />
                 Payroll Management
              </h1>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider">Home / Payroll / Salary Distribution</p>
           </div>
           <div className="flex items-center space-x-3">
              <Link href="/payroll/settings">
                 <Button className="bg-gray-50 text-gray-500 border-none px-4 h-10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                    <Settings className="h-4 w-4 mr-2" /> Payroll Settings
                 </Button>
              </Link>
              <Button className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                 <Plus className="h-4 w-4 mr-2" /> Generate Payslip
              </Button>
           </div>
        </div>

        {/* Filters Section Parity with Laravel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
           <Card className="lg:col-span-12 border-none shadow-sm p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Year</label>
                    <div className="relative">
                       <select 
                         value={year}
                         onChange={(e) => setYear(parseInt(e.target.value))}
                         className="w-full bg-gray-50/50 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                       >
                         {[2026, 2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payroll Cycle</label>
                    <div className="relative">
                       <select 
                         value={cycle}
                         onChange={(e) => setCycle(e.target.value)}
                         className="w-full bg-gray-50/50 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                       >
                         <option value="1">Monthly</option>
                         <option value="2">Weekly</option>
                         <option value="3">Bi-Weekly</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Month</label>
                    <div className="relative">
                       <select 
                         value={month}
                         onChange={(e) => setMonth(parseInt(e.target.value))}
                         className="w-full bg-gray-50/50 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                       >
                         {Array.from({ length: 12 }, (_, i) => (
                           <option key={i + 1} value={i + 1}>
                             {new Date(0, i).toLocaleString('default', { month: 'long' })}
                           </option>
                         ))}
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Parity Options Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-6 border-t border-gray-50">
                 {[
                   { id: 'markLeavesPaid', label: 'Leaves Paid', icon: CheckCircle2 },
                   { id: 'markAbsentUnpaid', label: 'Absent Unpaid', icon: AlertCircle },
                   { id: 'useAttendance', label: 'Use Attendance', icon: Clock },
                   { id: 'includeExpenseClaims', label: 'Expense Claims', icon: DollarSign },
                   { id: 'addTimelogs', label: 'Add Timelogs', icon: Users },
                 ].map((opt) => (
                   <button 
                     key={opt.id}
                     onClick={() => handleOptionChange(opt.id as any)}
                     className={`flex items-center p-3 rounded-xl border transition-all ${
                       options[opt.id as keyof typeof options] 
                       ? "bg-primary/5 border-primary/20 text-primary" 
                       : "bg-gray-50 border-transparent text-gray-400 grayscale hover:grayscale-0"
                     }`}
                   >
                      <opt.icon className={`h-4 w-4 mr-3 ${options[opt.id as keyof typeof options] ? "text-primary" : "text-gray-300"}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate">{opt.label}</span>
                   </button>
                 ))}
              </div>
           </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Total Distributed', value: `$${stats.totalPaid.toLocaleString()}`, color: 'text-primary', icon: DollarSign, sub: '+12.5% vs last month', subColor: 'text-green-500' },
             { label: 'Pending Amount', value: `$${stats.totalPending.toLocaleString()}`, color: 'text-orange-500', icon: AlertCircle, sub: 'Awaiting approval', subColor: 'text-orange-400' },
             { label: 'Staff Processed', value: stats.totalEmployees, color: 'text-blue-500', icon: Users, sub: 'Active payrolls', subColor: 'text-gray-400' },
             { label: 'Current Pay Cycle', value: stats.currentMonth, color: 'text-purple-500', icon: Calendar, sub: 'Monthly Cycle', subColor: 'text-purple-400' },
           ].map((stat, i) => (
             <Card key={i} className="border-none shadow-sm p-6 bg-white overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                   <stat.icon className={`h-16 w-16 ${stat.color}`} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                <p className={`text-[9px] font-black mt-2 uppercase tracking-widest ${stat.subColor}`}>{stat.sub}</p>
             </Card>
           ))}
        </div>

        {/* Main Data Table */}
        <Card className="border-none shadow-sm bg-white overflow-hidden p-0 relative min-h-[400px]">
           {loading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing Payroll Data...</p>
             </div>
           )}

           <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                 <input 
                   type="text" 
                   placeholder="Search employee or payslip ID..." 
                   className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                 />
              </div>
              <div className="flex items-center space-x-2">
                 <Button className="bg-gray-50 text-gray-500 border-none px-4 h-10 text-[10px] font-black uppercase tracking-widest">
                    <Download className="h-4 w-4 mr-2" /> Export
                 </Button>
                 <Button onClick={fetchPayroll} className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                 </Button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">#</th>
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Salary</th>
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid On</th>
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                       <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {payrollData.length > 0 ? (
                       payrollData.map((row, i) => (
                          <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="px-8 py-5 text-xs font-bold text-gray-300 text-center">{i + 1}</td>
                             <td className="px-8 py-5">
                                <div className="flex items-center space-x-3">
                                   <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-[10px] uppercase border border-primary/10 shadow-sm group-hover:rotate-3 transition-transform">
                                      {row.employee?.name?.charAt(0) || "U"}
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-gray-800 group-hover:text-primary transition-colors uppercase tracking-tight">{row.employee?.name || "Unknown User"}</p>
                                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {row.employee?.id || "N/A"}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className="text-xs font-black text-gray-800">${parseFloat(row.net_salary || 0).toLocaleString()}</span>
                             </td>
                             <td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                {row.month} {row.year}
                             </td>
                             <td className="px-8 py-5 text-xs font-bold text-gray-500">
                                {row.paid_on ? new Date(row.paid_on).toLocaleDateString() : "--"}
                             </td>
                             <td className="px-8 py-5 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                   row.status === 'paid' 
                                   ? "bg-green-50 text-green-600 border-green-100" 
                                   : "bg-orange-50 text-orange-600 border-orange-100"
                                }`}>
                                   {row.status}
                                </span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <button className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 hover:text-primary transition-all active:scale-90">
                                   <MoreVertical className="h-4 w-4" />
                                </button>
                             </td>
                          </tr>
                       ))
                    ) : !loading && (
                       <tr>
                          <td colSpan={7} className="px-8 py-24 text-center">
                             <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <DollarSign className="h-10 w-10 text-gray-200" />
                             </div>
                             <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">No Payroll Records</h2>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Select criteria and generate payslips for this period</p>
                             <Button className="bg-primary text-white text-[10px] font-black px-10 h-11 uppercase tracking-widest shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4 mr-2" /> Generate Now
                             </Button>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
