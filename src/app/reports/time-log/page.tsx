"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Filter, RefreshCw, Clock, Calendar, Search, Download, TrendingUp, BarChart as BarChartIcon, Briefcase, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const timeLogs = [
  { id: 1, project: "Website Redesign", task: "Design Homepage", employee: "John Doe", startTime: "2026-05-01 09:00 AM", endTime: "2026-05-01 12:00 PM", hours: 3 },
  { id: 2, project: "Mobile App", task: "Bug Fixing", employee: "Jane Smith", startTime: "2026-05-01 10:00 AM", endTime: "2026-05-01 01:00 PM", hours: 3 },
  { id: 3, project: "API Integration", task: "Unit Testing", employee: "Mike Tyson", startTime: "2026-05-01 02:00 PM", endTime: "2026-05-01 05:00 PM", hours: 3 },
  { id: 4, project: "Website Redesign", task: "CSS Styling", employee: "John Doe", startTime: "2026-05-02 09:00 AM", endTime: "2026-05-02 02:00 PM", hours: 5 },
  { id: 5, project: "Mobile App", task: "UI Enhancements", employee: "Jane Smith", startTime: "2026-05-02 10:00 AM", endTime: "2026-05-02 04:00 PM", hours: 6 },
];

const chartData = [
  { date: '2026-05-01', hours: 9 },
  { date: '2026-05-02', hours: 11 },
  { date: '2026-05-03', hours: 7 },
  { date: '2026-05-04', hours: 12 },
  { date: '2026-05-05', hours: 8 },
  { date: '2026-05-06', hours: 10 },
  { date: '2026-05-07', hours: 9 },
];

export default function TimeLogReportPage() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              Time Log Report
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider">Home / Reports / Employee Efficiency Analytics</p>
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
               <Download className="h-4 w-4 mr-2" /> Export Logs
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-none shadow-sm p-6 bg-white mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <div className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-gray-500 cursor-pointer">
                   Select Date Range
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Task</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-10 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                  <option value="">All Tasks</option>
                  <option>Website Redesign</option>
                  <option>Mobile App</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Employee</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-10 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                  <option value="">All Employees</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-3 flex items-end space-x-2">
              <Button className="flex-1 bg-primary text-white text-[10px] font-black h-11 uppercase tracking-widest">
                Apply
              </Button>
              <Button className="bg-gray-100 text-gray-500 border-none px-6 h-11 text-[10px] font-black uppercase tracking-widest">
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Logged Hours", value: "450 hrs", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Average Hours/Day", value: "7.5 hrs", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
            { label: "Total Projects", value: "12", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50" },
          ].map((stat, i) => (
            <Card key={i} className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-all flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Card className="p-6 border-none shadow-sm bg-white">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
            <BarChartIcon className="h-4 w-4 mr-2 text-primary" />
            Hours Logged Over Time
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Table Section */}
        <Card className="p-0 overflow-hidden shadow-sm border-none bg-white">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              Detailed Logs
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">#</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Task</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">End Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {timeLogs.map((log, i) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs text-gray-300 font-bold text-center">{i + 1}</td>
                    <td className="px-6 py-4 text-xs font-black text-primary uppercase tracking-tight hover:underline cursor-pointer">{log.project}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700">{log.task}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400 border border-gray-200 uppercase">
                          {log.employee.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{log.employee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">{log.startTime}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">{log.endTime}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {log.hours} hrs
                      </span>
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

