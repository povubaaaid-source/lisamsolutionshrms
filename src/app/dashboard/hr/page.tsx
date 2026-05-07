"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { UserCheck, UserPlus, UserMinus, FileCheck } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const stats = [
  { label: "Total Leaves Approved", value: "12", icon: FileCheck, color: "text-green-500", bg: "bg-green-50", href: "/leaves" },
  { label: "Total New Employee", value: "3", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50", href: "/employees" },
  { label: "Total Employee Exits", value: "1", icon: UserMinus, color: "text-red-500", bg: "bg-red-50", href: "/employees" },
  { label: "Average Attendance", value: "94%", icon: UserCheck, color: "text-purple-500", bg: "bg-purple-50", href: "/attendance" },
];

const leavesTaken = [
  { id: 1, name: "Alice Smith", count: 4, avatar: "AS" },
  { id: 2, name: "Bob Johnson", count: 2, avatar: "BJ" },
  { id: 3, name: "Charlie Brown", count: 1, avatar: "CB" },
  { id: 4, name: "Diana Prince", count: 1, avatar: "DP" },
];

const lateAttendance = [
  { id: 5, name: "David Lee", count: 3, avatar: "DL" },
  { id: 6, name: "Eve Davis", count: 2, avatar: "ED" },
  { id: 7, name: "Frank Wright", count: 2, avatar: "FW" },
  { id: 8, name: "Grace Hall", count: 1, avatar: "GH" },
];

// Mock Data for Charts
const deptData = [
  { name: 'IT', value: 15, color: '#3b82f6' },
  { name: 'Sales', value: 12, color: '#a855f7' },
  { name: 'HR', value: 5, color: '#22c55e' },
  { name: 'Finance', value: 8, color: '#eab308' },
  { name: 'Marketing', value: 8, color: '#f97316' },
];

const designationData = [
  { name: 'Manager', value: 6, color: '#6366f1' },
  { name: 'Developer', value: 24, color: '#ec4899' },
  { name: 'Designer', value: 8, color: '#14b8a6' },
  { name: 'Analyst', value: 10, color: '#f59e0b' },
];

const genderData = [
  { name: 'Male', value: 28, color: '#60a5fa' },
  { name: 'Female', value: 20, color: '#f472b6' },
];

const roleData = [
  { name: 'Admin', value: 4, color: '#ef4444' },
  { name: 'Employee', value: 44, color: '#1f2937' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-xs font-bold text-gray-800">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function HRDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-50">
          <div>
            <h1 className="font-black text-gray-800 uppercase tracking-widest flex items-center">
              HR Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-2">
             <ol className="flex text-[10px] font-black uppercase tracking-widest text-gray-400 space-x-2">
               <li><Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link></li>
               <li>/</li>
               <li className="text-gray-700">HR Dashboard</li>
             </ol>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-none group bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white shadow-sm flex-shrink-0`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Doughnut Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Wise */}
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Department Wise Employee</h3>
               <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest flex items-center">
                  Download
               </button>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Designation Wise */}
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Designation Wise Employee</h3>
               <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest flex items-center">
                  Download
               </button>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={designationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {designationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Doughnut Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Wise */}
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Gender Wise Employee</h3>
               <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest flex items-center">
                  Download
               </button>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Role Wise */}
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Role Wise Employee</h3>
               <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest flex items-center">
                  Download
               </button>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaves Taken */}
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
               <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Leaves Taken</h3>
            </div>
            <div className="p-0">
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase">Employee</th>
                        <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase text-right">Leaves Taken</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {leavesTaken.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4">
                             <div className="flex items-center space-x-3">
                               <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                 {emp.avatar}
                               </div>
                               <Link href={`/employees/${emp.id}`} className="text-xs font-bold text-gray-800 hover:text-primary transition-colors">
                                 {emp.name}
                               </Link>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                                 {emp.count}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </Card>

          {/* Late Attendance Mark */}
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
               <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Late Attendance Mark</h3>
            </div>
            <div className="p-0">
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase">Employee</th>
                        <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase text-right">Late Mark</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {lateAttendance.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4">
                             <div className="flex items-center space-x-3">
                               <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                 {emp.avatar}
                               </div>
                               <Link href={`/employees/${emp.id}`} className="text-xs font-bold text-gray-800 hover:text-primary transition-colors">
                                 {emp.name}
                               </Link>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                                 {emp.count}
                              </span>
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
