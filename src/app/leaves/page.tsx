"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { 
  Plus, 
  Calendar, 
  List, 
  Settings, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function LeaveDashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Dashboard parity with Laravel index.blade.php
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data for leaves/index.blade.php
      const mockPending = [
        { id: 1, user: { name: "Alice Smith" }, date: "2024-05-10", reason: "Family emergency", status: "pending", type: "Casual" },
        { id: 2, user: { name: "Bob Johnson" }, date: "2024-05-12", reason: "Medical checkup", status: "pending", type: "Sick" }
      ];
      setPendingLeaves(mockPending);

      const mockAll = [
        ...mockPending,
        { id: 3, user: { name: "Charlie Brown" }, date: "2024-05-01", status: "approved", type: "Earned" },
        { id: 4, user: { name: "Diana Ross" }, date: "2024-05-05", status: "approved", type: "Sick" }
      ];
      setLeaves(mockAll);
    } catch (err) {
      showToast("Failed to load leaves", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-full overflow-x-hidden pb-10">
        
        {/* Header Section */}
        <div className="white-box flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                 <h4 className="m-0">
                   Leave Calendar
                 </h4>
                 <span className="label label-warning">
                    {pendingLeaves.length} Pending
                 </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase">HR / Time Management / Schedule</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <Link href="/leaves/all">
               <Button className="btn-default">
                  <List className="h-4 w-4 mr-2" /> All Leaves
               </Button>
             </Link>
             <Link href="/leaves/settings">
               <Button className="btn-default p-2">
                  <Settings className="h-4 w-4" />
               </Button>
             </Link>
             <Link href="/leaves/create">
               <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" /> Assign Leave
               </Button>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Calendar Area */}
           <div className="lg:col-span-8">
              <Card className="p-0 overflow-hidden">
                 <div className="p-6 border-b border-[#f2f2f3] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <button onClick={prevMonth} className="p-1 hover:text-primary"><ChevronLeft className="h-5 w-5" /></button>
                       <h4 className="m-0 min-w-[150px] text-center">
                          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                       </h4>
                       <button onClick={nextMonth} className="p-1 hover:text-primary"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="label label-success">Approved</span>
                       <span className="label label-warning">Pending</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-7 border-b border-[#f2f2f3]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                       <div key={day} className="py-2 text-center text-[10px] uppercase text-gray-400 font-bold">{day}</div>
                    ))}
                 </div>
                 <div className="grid grid-cols-7 min-h-[400px]">
                    {Array.from({ length: 35 }).map((_, i) => {
                       const day = i - 3;
                       const leave = leaves.find(l => new Date(l.date).getDate() === day);
                       
                       return (
                         <div key={i} className={`relative p-2 border-r border-b border-[#f2f2f3] min-h-[80px] ${day < 1 || day > 31 ? 'bg-gray-50' : ''}`}>
                            {day >= 1 && day <= 31 && (
                              <span className={`text-[10px] font-bold ${day === new Date().getDate() ? 'text-primary' : 'text-gray-400'}`}>
                                 {day}
                              </span>
                            )}
                            
                            {day >= 1 && day <= 31 && leave && (
                              <div className={`mt-1 p-1 text-[9px] border-l-2 ${leave.status === 'approved' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-orange-50 border-orange-500 text-orange-700'}`}>
                                 <div className="truncate">{leave.user.name}</div>
                              </div>
                            )}
                         </div>
                       );
                    })}
                 </div>
              </Card>
           </div>

           {/* Pending & Actions Column */}
           <div className="lg:col-span-4 space-y-6">
              <Card className="p-6">
                 <h4 className="mb-4">Pending Requests</h4>
                 <div className="space-y-4">
                    {pendingLeaves.length > 0 ? pendingLeaves.map((request) => (
                      <div key={request.id} className="p-4 bg-gray-50 border border-[#f2f2f3]">
                         <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-bold">{request.user.name}</div>
                            <span className="text-[10px] text-gray-400">{request.date}</span>
                         </div>
                         <div className="text-[11px] text-gray-500 mb-3">{request.reason}</div>
                         <div className="flex space-x-2">
                            <Button className="btn-success p-1 text-[10px]">Approve</Button>
                            <Button className="btn-danger p-1 text-[10px]">Reject</Button>
                         </div>
                      </div>
                    )) : (
                      <div className="text-center text-gray-400 py-10">No pending requests</div>
                    )}
                 </div>
              </Card>

              <div className="white-box bg-secondary text-white">
                 <h4 className="text-white mb-4">Quick Search</h4>
                 <input 
                   type="text" 
                   placeholder="FIND STAFF..."
                   className="form-control bg-white/10 border-white/20 text-white"
                 />
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
