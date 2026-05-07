"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  Calendar, 
  Users, 
  Check, 
  X,
  Clock,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AttendanceByDatePage() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("05-05-2024");
  const [attendance, setAttendance] = useState([
    { id: 1, name: "John Doe", designation: "Developer", status: "present", clockIn: "09:00 AM", clockOut: "06:00 PM", ip: "192.168.1.1" },
    { id: 2, name: "Jane Smith", designation: "Designer", status: "late", clockIn: "09:45 AM", clockOut: "06:15 PM", ip: "192.168.1.5" },
    { id: 3, name: "Mike Tyson", designation: "Manager", status: "absent", clockIn: "--:--", clockOut: "--:--", ip: "-" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Clock className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Daily Attendance
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
                        <Link href="/attendance/summary" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Summary</Link>
                        <Link href="/attendance" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Attendance By Member</Link>
                        <Link href="/attendance/date" className="py-4 text-[13px] font-bold text-primary border-b-2 border-primary transition-all">Attendance By Date</Link>
                    </nav>
                </div>
            </div>
        </div>

        {/* Filter Section */}
        <div className="white-box">
            <div className="row items-end">
                <div className="col-md-4">
                    <label className="block text-[12px] font-bold text-gray-600 mb-2">Select Date</label>
                    <div className="form-control flex items-center justify-between cursor-pointer">
                        <span className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-400" /> {date}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
                <div className="col-md-3">
                    <Button className="btn-success btn-block h-[34px]">Apply</Button>
                </div>
            </div>
        </div>

        {/* Stats Row */}
        <div className="white-box p-0 overflow-hidden">
            <div className="flex flex-wrap divide-x divide-[#eee]">
                <div className="flex-1 min-w-[150px] p-6 text-center">
                    <h4 className="m-0 text-xl font-bold">10</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Total Employees</p>
                </div>
                <div className="flex-1 min-w-[150px] p-6 text-center">
                    <h4 className="m-0 text-xl font-bold text-success">8</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Present</p>
                </div>
                <div className="flex-1 min-w-[150px] p-6 text-center border-l border-[#eee]">
                    <h4 className="m-0 text-xl font-bold text-danger">2</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Absent</p>
                </div>
            </div>
        </div>

        {/* Daily Attendance Table */}
        <div className="white-box p-0 overflow-hidden">
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Status</th>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <div className="font-bold text-[13px]">{row.name}</div>
                                    <div className="text-[10px] text-gray-400 font-medium uppercase">{row.designation}</div>
                                </td>
                                <td>
                                    <span className={`label ${
                                        row.status === 'present' ? 'label-success' :
                                        row.status === 'late' ? 'label-danger' : 'label-info'
                                    }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="font-medium">{row.clockIn}</div>
                                    <div className="text-[10px] text-gray-400">IP: {row.ip}</div>
                                </td>
                                <td>
                                    <div className="font-medium">{row.clockOut}</div>
                                    <div className="text-[10px] text-gray-400">IP: {row.ip}</div>
                                </td>
                                <td className="text-right">
                                    <Button className="btn-info btn-outline btn-sm p-1 px-2">View</Button>
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
