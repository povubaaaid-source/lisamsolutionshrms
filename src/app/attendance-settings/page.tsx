"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  RefreshCw, 
  Clock, 
  Settings, 
  Check, 
  ChevronRight,
  MapPin,
  Globe,
  Bell,
  Trash2,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function AttendanceSettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("attendance");
  const [ipAddresses, setIpAddresses] = useState([""]);
  const [radiusCheck, setRadiusCheck] = useState(false);
  const [ipCheck, setIpCheck] = useState(false);
  const [reminderStatus, setReminderStatus] = useState(true);

  const menu = [
    { id: 'attendance', label: 'Attendance Settings', icon: Clock },
  ];

  const handleAddIp = () => setIpAddresses([...ipAddresses, ""]);
  const handleRemoveIp = (index: number) => setIpAddresses(ipAddresses.filter((_, i) => i !== index));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-6 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Settings className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Attendance Settings
                </h4>
            </div>
            <div className="col-lg-6 col-sm-8 col-md-8 col-xs-12 flex justify-end">
                <ol className="breadcrumb">
                    <li><Link href="/dashboard">Home</Link></li>
                    <li className="active">Attendance Settings</li>
                </ol>
            </div>
        </div>

        <div className="panel panel-inverse white-box">
            <div className="panel-heading border-b border-[#f2f2f3] pb-4 mb-6">
                Update Attendance Settings
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 border-r border-[#f2f2f3]">
                    <nav className="flex flex-col">
                        <button className="flex items-center px-6 py-4 text-[12px] font-bold uppercase tracking-wider bg-[#03a9f3] text-white transition-all">
                            <Clock className="h-4 w-4 mr-3" />
                            Attendance Settings
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 px-4 py-2">
                    <form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Office Start Time</label>
                                <input type="time" className="form-control" defaultValue="09:00" />
                            </div>
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Office End Time</label>
                                <input type="time" className="form-control" defaultValue="18:00" />
                            </div>
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Half Day Mark Time</label>
                                <input type="time" className="form-control" defaultValue="13:00" />
                            </div>
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Late Mark (Minutes)</label>
                                <input type="number" className="form-control" defaultValue="15" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="form-group col-md-3">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Check-ins in a day</label>
                                <input type="number" className="form-control" defaultValue="1" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span className="text-[12px] font-bold text-gray-700 uppercase tracking-tight">Allow employees to mark their own attendance</span>
                            </label>
                            
                            <div className="space-y-4">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-3" 
                                        checked={radiusCheck}
                                        onChange={(e) => setRadiusCheck(e.target.checked)}
                                    />
                                    <span className="text-[12px] font-bold text-gray-700 uppercase tracking-tight">Check radius for attendance marking</span>
                                </label>
                                {radiusCheck && (
                                    <div className="pl-7 max-w-xs">
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Radius (Meters)</label>
                                        <input type="number" className="form-control" defaultValue="100" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-3" 
                                        checked={ipCheck}
                                        onChange={(e) => setIpCheck(e.target.checked)}
                                    />
                                    <span className="text-[12px] font-bold text-gray-700 uppercase tracking-tight">Check IP for attendance marking</span>
                                </label>
                                {ipCheck && (
                                    <div className="pl-7 space-y-3">
                                        {ipAddresses.map((ip, idx) => (
                                            <div key={idx} className="flex items-center space-x-2 max-w-md">
                                                <input type="text" className="form-control" placeholder="e.g. 192.168.1.1" value={ip} onChange={(e) => {
                                                    const newIps = [...ipAddresses];
                                                    newIps[idx] = e.target.value;
                                                    setIpAddresses(newIps);
                                                }} />
                                                {idx > 0 && (
                                                    <button type="button" onClick={() => handleRemoveIp(idx)} className="btn-danger btn-outline p-1.5 rounded">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <Button type="button" onClick={handleAddIp} className="btn-info btn-sm">
                                            Add More <Plus className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-[#f2f2f3]">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-4">Office Open Days</label>
                            <div className="flex flex-wrap gap-4">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                    <label key={day} className="flex items-center cursor-pointer mr-6">
                                        <input type="checkbox" className="mr-2" defaultChecked={day !== 'Sunday'} />
                                        <span className="text-[12px] font-medium text-gray-600">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-[#f2f2f3] grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="form-group">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-4">Attendance Reminder Status</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={reminderStatus}
                                        onChange={(e) => setReminderStatus(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00c292]"></div>
                                </label>
                            </div>
                            {reminderStatus && (
                                <div className="form-group">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Reminder After (Minutes)</label>
                                    <input type="number" className="form-control" defaultValue="30" />
                                </div>
                            )}
                        </div>

                        <div className="form-actions pt-8 border-t border-[#f2f2f3]">
                            <Button className="btn-success px-10">
                                Update Settings
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
