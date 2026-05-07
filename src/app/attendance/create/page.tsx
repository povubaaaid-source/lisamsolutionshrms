"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  ArrowLeft, 
  Plus, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Check, 
  Save,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function MarkAttendancePage() {
  const { showToast } = useToast();
  const [date, setDate] = useState("2024-05-05");
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", designation: "Developer" },
    { id: 2, name: "Jane Smith", designation: "Designer" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Users className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Attendance
                </h4>
            </div>
            <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12 flex justify-end items-center space-x-2">
                <ol className="breadcrumb">
                    <li><Link href="/dashboard">Home</Link></li>
                    <li><Link href="/attendance">Attendance</Link></li>
                    <li className="active">Mark Attendance</li>
                </ol>
            </div>
        </div>

        <div className="white-box">
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="block text-[12px] font-bold text-gray-600 mb-2">Attendance Date</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {employees.map((emp) => (
                    <div key={emp.id} className="border border-[#f2f2f3] rounded overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-[#f2f2f3] flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[12px] mr-3">
                                    {emp.name.charAt(0)}
                                </div>
                                <span className="text-[13px] font-bold text-gray-700 uppercase">{emp.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{emp.designation}</span>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="form-group">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Clock In Time</label>
                                    <input type="time" className="form-control" defaultValue="09:00" />
                                </div>
                                <div className="form-group">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Clock In IP</label>
                                    <input type="text" className="form-control" defaultValue="192.168.1.1" />
                                </div>
                                <div className="col-span-2 flex items-center pt-6 space-x-8">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-[12px] font-bold text-gray-700 uppercase">Late Entry</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-[12px] font-bold text-gray-700 uppercase">Half Day</span>
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                                <div className="form-group">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Clock Out Time</label>
                                    <input type="time" className="form-control" defaultValue="18:00" />
                                </div>
                                <div className="form-group">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Clock Out IP</label>
                                    <input type="text" className="form-control" defaultValue="192.168.1.1" />
                                </div>
                                <div className="form-group">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Working From</label>
                                    <input type="text" className="form-control" defaultValue="office" />
                                </div>
                                <div className="flex items-end">
                                    <Button className="btn-success btn-block" onClick={() => showToast("Attendance saved", "success")}>
                                        <Check className="h-4 w-4 mr-2" /> Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
