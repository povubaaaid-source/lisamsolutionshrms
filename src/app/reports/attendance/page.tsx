"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Filter, 
  RefreshCw, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronDown,
  Download,
  FileText,
  Search,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AttendanceReportPage() {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, employee: { name: "John Doe", id: "EMP001" }, present: 20, absent: 2, late: 1, halfDay: 0, total: 23 },
    { id: 2, employee: { name: "Jane Smith", id: "EMP002" }, present: 18, absent: 5, late: 0, halfDay: 0, total: 23 },
    { id: 3, employee: { name: "Mike Tyson", id: "EMP003" }, present: 22, absent: 0, late: 0, halfDay: 1, total: 23 },
    { id: 4, employee: { name: "Sarah Connor", id: "EMP004" }, present: 15, absent: 8, late: 3, halfDay: 0, total: 23 },
    { id: 5, employee: { name: "Bruce Wayne", id: "EMP005" }, present: 23, absent: 0, late: 0, halfDay: 0, total: 23 },
  ]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchReport = async () => {
    setLoading(true);
    try {
      // API call placeholder
      // const response = await api.get(`/reports/attendance?month=${month}&year=${year}`);
      // setAttendanceData(response.data.data);
      setTimeout(() => setLoading(false), 800); // Simulate loading
    } catch (err) {
      console.error("Fetch Attendance Report Error:", err);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-50">
          <div>
            <h1 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              Attendance Report
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider">Home / Reports / Staff Attendance Summary</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchReport}
              className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
               <Download className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-none shadow-sm p-6 bg-white mb-6">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Month</label>
                 <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <select 
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-10 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
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
              <div className="md:col-span-4">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Employee</label>
                 <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-10 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                       <option value="all">All Staff Members</option>
                       <option value="1">John Doe</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                 </div>
              </div>
              <div className="md:col-span-4 flex items-end space-x-2">
                 <Button 
                   onClick={fetchReport}
                   className="flex-1 bg-primary text-white text-[10px] font-black h-11 uppercase tracking-widest"
                 >
                    Generate Report
                 </Button>
                 <Button className="bg-gray-100 text-gray-500 border-none px-6 h-11 text-[10px] font-black uppercase tracking-widest">
                    Reset
                 </Button>
              </div>
           </div>
        </Card>

        {/* Report Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
           {[
             { label: 'Avg Presence', value: '92%', color: 'text-green-500', icon: CheckCircle2, bg: 'bg-green-50' },
             { label: 'Total Absents', value: '12 Days', color: 'text-red-500', icon: XCircle, bg: 'bg-red-50' },
             { label: 'Late Entries', value: '08', color: 'text-orange-500', icon: Clock, bg: 'bg-orange-50' },
             { label: 'Half Days', value: '03', color: 'text-yellow-600', icon: FileText, bg: 'bg-yellow-50' },
           ].map((stat, i) => (
             <Card key={i} className="border-none shadow-sm p-5 bg-white flex items-center space-x-4 group hover:shadow-md transition-all">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                   <stat.icon className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                   <h3 className="text-sm font-black text-gray-800 tracking-tight">{stat.value}</h3>
                </div>
             </Card>
           ))}
        </div>

        {/* Report Table */}
        <Card className="border-none shadow-sm bg-white overflow-hidden p-0 relative min-h-[400px]">
           {loading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
             </div>
           )}
           
           <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Search className="h-4 w-4 mr-2 text-primary" />
                Staff Attendance Details
              </h3>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">#</th>
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Present</th>
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Absent</th>
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Late</th>
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Half Day</th>
                       <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Total Working</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {attendanceData.map((row, i) => (
                       <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-5 text-xs font-bold text-gray-300 text-center">{i + 1}</td>
                          <td className="px-8 py-5">
                             <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-[10px] uppercase border border-primary/10 group-hover:rotate-3 transition-transform">
                                   {row.employee.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{row.employee.name}</p>
                                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{row.employee.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">{row.present}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">{row.absent}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-xs font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{row.late}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-xs font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">{row.halfDay}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-xs font-black text-gray-700">{row.total}</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
