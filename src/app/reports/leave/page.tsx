"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Filter, RefreshCw, Calendar, User, CheckCircle2, XCircle, Clock, Download, Search, FileText, ChevronDown, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const leaveStats = [
  { label: "Approved", value: 45, color: "#10b981", bg: "bg-green-50" },
  { label: "Pending", value: 12, color: "#f59e0b", bg: "bg-yellow-50" },
  { label: "Rejected", value: 5, color: "#ef4444", bg: "bg-red-50" },
];

const leaveData = [
  { id: 1, employee: { name: "John Doe", id: "EMP001" }, total: 15, taken: 5, remaining: 10, pending: 2 },
  { id: 2, employee: { name: "Jane Smith", id: "EMP002" }, total: 15, taken: 12, remaining: 3, pending: 0 },
  { id: 3, employee: { name: "Mike Tyson", id: "EMP003" }, total: 15, taken: 0, remaining: 15, pending: 1 },
];

const chartData = leaveStats.map(stat => ({
  name: stat.label,
  value: stat.value,
  color: stat.color
}));

export default function LeaveReportPage() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-50">
          <div>
            <h1 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              Leave Report
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider">Home / Reports / Employee Leave Summary</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
               <Download className="h-4 w-4 mr-2" /> Export Report
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-none shadow-sm p-6 bg-white mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
              <div className="relative cursor-pointer">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <div className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-gray-500">
                   All Time
                </div>
              </div>
            </div>
            <div className="md:col-span-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Employee</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-10 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                   <option value="all">All Employees</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-4 flex items-end space-x-2">
              <Button className="flex-1 bg-primary text-white text-[10px] font-black h-11 uppercase tracking-widest">
                Generate
              </Button>
              <Button className="bg-gray-100 text-gray-500 border-none px-6 h-11 text-[10px] font-black uppercase tracking-widest">
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Leaves Taken', value: '17 Days', sub: 'Across all employees', color: 'text-primary', icon: BarChart2, bg: 'bg-primary/5' },
            { label: 'Pending Approvals', value: '03', sub: 'Awaiting HR review', color: 'text-orange-500', icon: Clock, bg: 'bg-orange-50' },
            { label: 'Remaining Balance', value: '28 Days', sub: 'Average pool', color: 'text-green-500', icon: PieChart, bg: 'bg-green-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm p-6 bg-white overflow-hidden relative group">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">{stat.sub}</p>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart & Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 border-none shadow-sm p-6 bg-white flex flex-col">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-primary" />
              Status Breakdown
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    content={({ payload }) => (
                      <ul className="flex justify-center space-x-4 mt-6">
                        {payload?.map((entry: any, index: number) => (
                          <li key={`item-${index}`} className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }}></span>
                            {entry.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-8 border-none shadow-sm bg-white overflow-hidden p-0 relative">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Search className="h-4 w-4 mr-2 text-primary" />
                Staff Leave Balances
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">#</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Total Pool</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Taken</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Remaining</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leaveData.map((row, i) => (
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
                      <td className="px-8 py-5 text-center text-xs font-bold text-gray-500">{row.total}</td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">{row.taken}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">{row.remaining}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-xs font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{row.pending}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
