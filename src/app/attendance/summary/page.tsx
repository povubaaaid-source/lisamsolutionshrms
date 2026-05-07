"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  Calendar, 
  Users, 
  Check, 
  X,
  Star,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AttendanceSummaryPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Tyson" },
  ]);
  
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2024);

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Calendar className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Attendance Summary
                </h4>
            </div>
            <div className="col-sm-9 text-right flex justify-end items-center space-x-2">
                <Link href="/attendance/create">
                    <Button className="btn-success btn-sm">
                        Mark Attendance <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                </Link>
                <ol className="breadcrumb hidden-xs">
                    <li><Link href="/dashboard">Home</Link></li>
                    <li className="active">Attendance</li>
                </ol>
            </div>
        </div>

        {/* Navigation Tabs (tabs-style-line) */}
        <div className="row mb-6">
            <div className="col-md-12">
                <div className="white-box p-0 border-b border-[#eee]">
                    <nav className="flex space-x-8 px-6">
                        <Link href="/attendance/summary" className="py-4 text-[13px] font-bold text-primary border-b-2 border-primary transition-all">Summary</Link>
                        <Link href="/attendance" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Attendance By Member</Link>
                        <Link href="/attendance/date" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Attendance By Date</Link>
                    </nav>
                </div>
            </div>
        </div>

        {/* Filter Section */}
        <div className="white-box">
            <div className="row items-end">
                <div className="col-md-3">
                    <label className="block text-[12px] font-bold text-gray-600 mb-2">Employee Name</label>
                    <select className="form-control">
                        <option>All Employees</option>
                        {employees.map(emp => (
                            <option key={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="block text-[12px] font-bold text-gray-600 mb-2">Select Month</label>
                    <select className="form-control" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="block text-[12px] font-bold text-gray-600 mb-2">Select Year</label>
                    <select className="form-control" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <Button className="btn-success btn-block h-[34px]">Apply</Button>
                </div>
            </div>
        </div>

        {/* Legend */}
        <div className="flex space-x-6 px-2 mb-4">
            <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-[#00c292] rounded-sm flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">Present</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-[#fb9678] rounded-sm flex items-center justify-center"><X className="h-2.5 w-2.5 text-white" /></div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-[#5475ed] rounded-sm flex items-center justify-center"><Star className="h-2.5 w-2.5 text-white" /></div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">Holiday</span>
            </div>
        </div>

        {/* Attendance Summary Grid */}
        <div className="white-box p-0 overflow-hidden">
            <div className="table-responsive">
                <table className="table-bordered min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="w-[180px] px-4 py-3 text-[11px] font-bold uppercase sticky left-0 z-10 bg-gray-50 border-r">Employee</th>
                            {daysArray.map(day => (
                                <th key={day} className="w-10 text-center px-1 py-3 text-[10px] font-bold border-r">{day}</th>
                            ))}
                            <th className="w-24 text-center px-4 py-3 text-[11px] font-bold uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-[13px] font-bold border-r sticky left-0 z-10 bg-white">{emp.name}</td>
                                {daysArray.map(day => {
                                    const rand = Math.random();
                                    let status = 'present';
                                    if (day % 7 === 0 || day % 7 === 6) status = 'holiday';
                                    else if (rand > 0.9) status = 'absent';
                                    
                                    return (
                                        <td key={day} className="p-1 border-r text-center">
                                            {status === 'present' && <div className="mx-auto h-4 w-4 bg-[#00c292] rounded-sm flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>}
                                            {status === 'absent' && <div className="mx-auto h-4 w-4 bg-[#fb9678] rounded-sm flex items-center justify-center"><X className="h-2.5 w-2.5 text-white" /></div>}
                                            {status === 'holiday' && <div className="mx-auto h-4 w-4 bg-[#5475ed] rounded-sm flex items-center justify-center"><Star className="h-2.5 w-2.5 text-white" /></div>}
                                        </td>
                                    )
                                })}
                                <td className="px-4 py-3 text-center font-bold text-success border-l">20 / {daysInMonth}</td>
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
