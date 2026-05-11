"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Timer, 
  ChevronRight, 
  Briefcase, 
  FileText,
  UserCheck,
  MapPin,
  Coffee
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [time, setTime] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  const tasks = [
    { id: 1, title: "Review UI feedback for HR module", project: "Worksuite SaaS", priority: "High", status: "In Progress" },
    { id: 2, title: "Fix API connection in Login page", project: "Worksuite SaaS", priority: "Medium", status: "Pending" },
    { id: 3, title: "Prepare weekly status report", project: "Internal", priority: "Low", status: "Pending" },
  ];

  const summaryStats = [
    { label: "My Leaves", value: "8/12", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tasks Done", value: "24", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Attendance", value: "98%", icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Requests", value: "2", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-white px-6 py-8 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-50 gap-6">
          <div className="flex items-center space-x-5">
             <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <span className="text-2xl font-black">{user?.name?.charAt(0) || "U"}</span>
             </div>
             <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}, {user?.name?.split(' ')[0] || "User"}!
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1.5 text-primary" /> Remote Workspace • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
             </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="text-right pr-4 border-r border-gray-100 hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Working Hours</p>
                <p className="text-xl font-black text-gray-800">{time}</p>
             </div>
             <button 
                onClick={handleClockToggle}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                  isClockedIn 
                  ? "bg-red-500 text-white shadow-red-200 hover:bg-red-600 active:scale-95" 
                  : "bg-primary text-white shadow-primary/20 hover:bg-primary/90 active:scale-95"
                }`}
             >
                <Timer className={`h-4 w-4 ${isClockedIn ? "animate-pulse" : ""}`} />
                <span>{isClockedIn ? "Clock Out" : "Clock In"}</span>
             </button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryStats.map((stat, i) => (
            <Card key={i} className="p-5 border-none shadow-sm hover:shadow-md transition-shadow bg-white flex items-center space-x-4">
               <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
               </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> My Tasks
                 </h3>
                 <Link href="/tasks" className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest">View All</Link>
              </div>
              <div className="p-0">
                 <div className="divide-y divide-gray-50">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                        <div className="flex items-start justify-between">
                           <div className="flex items-start space-x-4">
                              <div className={`mt-1 h-2 w-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                              <div>
                                 <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{task.title}</h4>
                                 <div className="flex items-center space-x-4 mt-2">
                                    <span className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                       <Briefcase className="h-3 w-3 mr-1" /> {task.project}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                      task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                       {task.status}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <button className="text-gray-300 hover:text-primary transition-colors p-1">
                              <ChevronRight className="h-5 w-5" />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </Card>

            {/* Recent Documents / Announcements */}
            <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                 <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" /> Recent Notices
                 </h3>
              </div>
              <div className="p-6 space-y-4">
                 {[
                   { title: "Quarterly Performance Review Schedule", date: "2 days ago", tag: "HR" },
                   { title: "New Remote Work Policy Guidelines", date: "1 week ago", tag: "Policy" },
                 ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                       <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                          <AlertCircle className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-800">{item.title}</p>
                          <div className="flex items-center space-x-3 mt-1.5">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.date}</span>
                             <span className="h-1 w-1 rounded-full bg-gray-300" />
                             <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.tag}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Status & Activity */}
          <div className="space-y-6">
            {/* Clock In Status Detail */}
            <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-primary to-secondary text-white overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform group-hover:scale-110 duration-700">
                 <Timer size={160} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Shift Status</h3>
                 <div className="mt-6 flex items-center justify-between">
                    <div>
                       <p className="text-3xl font-black">{isClockedIn ? "ON DUTY" : "OFF DUTY"}</p>
                       <p className="text-[10px] font-bold mt-1 opacity-80 uppercase tracking-widest">
                          {isClockedIn ? `Clocked in at ${clockInTime}` : "You haven't clocked in yet"}
                       </p>
                    </div>
                    <div className={`h-12 w-12 rounded-full border-4 border-white/20 flex items-center justify-center ${isClockedIn ? 'animate-pulse' : ''}`}>
                       <div className={`h-4 w-4 rounded-full ${isClockedIn ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'bg-white/40'}`} />
                    </div>
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Overtime</p>
                       <p className="text-sm font-black">0.0 Hrs</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Break</p>
                       <p className="text-sm font-black">0.0 Hrs</p>
                    </div>
                 </div>
                 
                 <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center">
                    <Coffee className="h-3 w-3 mr-2" /> Take a Break
                 </button>
              </div>
            </Card>

            {/* Upcoming Holidays */}
            <Card className="p-0 border-none shadow-sm bg-white overflow-hidden">
               <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Upcoming Holidays</h3>
               </div>
               <div className="p-6 space-y-4">
                  {[
                    { name: "Eid-ul-Adha", date: "May 15", day: "Friday" },
                    { name: "Global HR Day", date: "May 20", day: "Wednesday" },
                  ].map((holiday, i) => (
                     <div key={i} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center space-x-3">
                           <div className="h-10 w-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                              <span className="text-[8px] font-black text-primary uppercase leading-none">{holiday.date.split(' ')[0]}</span>
                              <span className="text-sm font-black text-gray-800">{holiday.date.split(' ')[1]}</span>
                           </div>
                           <div>
                              <p className="text-xs font-bold text-gray-800">{holiday.name}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{holiday.day}</p>
                           </div>
                        </div>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/30 group-hover:scale-150 transition-transform" />
                     </div>
                  ))}
                  <div className="pt-2">
                     <Link href="/holidays" className="w-full py-3 border border-dashed border-gray-200 hover:border-primary hover:text-primary rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center justify-center">
                        View Holiday Calendar
                     </Link>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
