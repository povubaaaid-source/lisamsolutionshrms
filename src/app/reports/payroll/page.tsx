"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Filter, RefreshCw, DollarSign, Download, FileText, User } from "lucide-react";
import Link from "next/link";

const payrollData = [
  { id: 1, employee: "John Doe", month: "April 2026", basic: "$3,000", allowance: "$500", deductions: "$200", net: "$3,300", status: "Paid" },
  { id: 2, employee: "Jane Smith", month: "April 2026", basic: "$3,500", allowance: "$400", deductions: "$150", net: "$3,750", status: "Paid" },
  { id: 3, employee: "Mike Tyson", month: "April 2026", basic: "$2,800", allowance: "$300", deductions: "$100", net: "$3,000", status: "Unpaid" },
];

export default function PayrollReportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Payroll Report</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/reports" className="hover:text-primary transition-colors">Reports</Link>
              <span>/</span>
              <span className="text-gray-700">Payroll Report</span>
            </div>
          </div>
          <Button className="bg-primary text-white text-[10px] h-9 px-6 uppercase tracking-widest font-black shadow-lg shadow-primary/20">
             <Download className="h-3.5 w-3.5 mr-2" /> Export PDF
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-gray-50/50 border border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Select Month</label>
                 <select className="w-full text-xs border-gray-200 rounded p-2 bg-white outline-none">
                    <option>April 2026</option>
                    <option>March 2026</option>
                 </select>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Employee</label>
                 <select className="w-full text-xs border-gray-200 rounded p-2 bg-white outline-none">
                    <option>All Employees</option>
                    <option>John Doe</option>
                 </select>
              </div>
              <div className="md:col-span-1"></div>
              <div className="flex items-end space-x-2">
                 <Button className="bg-primary text-white text-[10px] h-9 px-6 flex-1 font-black uppercase tracking-widest">Filter</Button>
                 <Button className="bg-white text-gray-400 border border-gray-100 text-[10px] h-9 px-4 hover:bg-gray-50 transition-all"><RefreshCw className="h-3.5 w-3.5" /></Button>
              </div>
           </div>
        </Card>

        {/* Data Table */}
        <Card className="p-0 overflow-hidden shadow-sm border border-gray-100 bg-white">
           <div className="p-5 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Monthly Payroll Summary</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Basic Salary</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Allowances</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-red-400">Deductions</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider">Net Payable</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {payrollData.map((row) => (
                       <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-[10px]">
                                   {row.employee.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-gray-700">{row.employee}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.basic}</td>
                          <td className="px-6 py-4 text-xs font-medium text-green-600">{row.allowance}</td>
                          <td className="px-6 py-4 text-xs font-medium text-red-400">{row.deductions}</td>
                          <td className="px-6 py-4 text-xs font-black text-gray-900">{row.net}</td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                row.status === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                             }`}>{row.status}</span>
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
