"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  Filter, 
  RefreshCw, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

export default function EventsPage() {
  const [currentMonth, setCurrentMonth] = useState("May 2026");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Parity */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-50">
          <div>
            <h1 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center">
              <CalendarIcon className="h-5 w-5 mr-3 text-primary" />
              Event Calendar
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wider">Home / Events / Calendar View</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all">
              <RefreshCw className="h-4 w-4" />
            </button>
            <Button className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
               <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>
        </div>

        {/* Filters Section Parity */}
        <Card className="border-none shadow-sm p-6 bg-white mb-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Employees</label>
                 <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                       <option value="all">All Employees</option>
                    </select>
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Client</label>
                 <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                       <option value="all">All Clients</option>
                    </select>
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Category</label>
                 <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <select className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                       <option value="all">All Categories</option>
                    </select>
                 </div>
              </div>
              <div className="flex items-end space-x-2">
                 <Button className="flex-1 bg-primary text-white text-[10px] font-black h-11 uppercase tracking-widest">
                    Apply
                 </Button>
                 <Button className="flex-1 bg-gray-100 text-gray-500 border-none h-11 text-[10px] font-black uppercase tracking-widest">
                    Reset
                 </Button>
              </div>
           </div>
        </Card>

        {/* Calendar UI */}
        <Card className="border-none shadow-sm bg-white overflow-hidden p-0">
          <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
               <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
                 {currentMonth}
               </h2>
               <div className="flex bg-gray-50 p-1 rounded-xl">
                  <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-primary"><ChevronLeft className="h-4 w-4" /></button>
                  <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-primary"><ChevronRight className="h-4 w-4" /></button>
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-5 py-2.5 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">Today</button>
              <div className="flex bg-gray-50 p-1 rounded-xl shadow-inner border border-gray-100/50">
                {['Month', 'Week', 'Day', 'List'].map(view => (
                   <button 
                     key={view} 
                     className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'Month' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                      {view}
                   </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="py-4 bg-gray-50/30 border-b border-r border-gray-50 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
            {/* Calendar Grid */}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasEvents = day === 4 || day === 12 || day === 18;
              return (
                <div key={day} className={`group relative p-3 border-r border-b border-gray-50 min-h-[140px] transition-colors hover:bg-gray-50/50 ${day === 4 ? 'bg-primary/[0.02]' : ''}`}>
                   <span className={`text-[11px] font-black ${day === 4 ? 'text-primary' : 'text-gray-300 group-hover:text-gray-500'} transition-colors`}>
                      {day < 10 ? `0${day}` : day}
                   </span>
                   
                   {day === 4 && (
                     <div className="mt-3 space-y-2">
                        <div className="bg-primary/10 border-l-2 border-primary p-2 rounded-r-lg">
                           <p className="text-[9px] font-black text-primary uppercase leading-tight truncate">Product Launch</p>
                           <div className="flex items-center text-[7px] font-bold text-primary/60 mt-1 uppercase">
                              <Clock className="h-2 w-2 mr-1" /> 09:00 AM
                           </div>
                        </div>
                        <div className="bg-blue-500/10 border-l-2 border-blue-500 p-2 rounded-r-lg">
                           <p className="text-[9px] font-black text-blue-600 uppercase leading-tight truncate">Team Review</p>
                        </div>
                     </div>
                   )}

                   {day === 12 && (
                     <div className="mt-3">
                        <div className="bg-purple-500/10 border-l-2 border-purple-500 p-2 rounded-r-lg">
                           <p className="text-[9px] font-black text-purple-600 uppercase leading-tight truncate">Client Meeting</p>
                           <div className="flex items-center text-[7px] font-bold text-purple/60 mt-1 uppercase">
                              <MapPin className="h-2 w-2 mr-1" /> Zoom
                           </div>
                        </div>
                     </div>
                   )}

                   {day === 18 && (
                     <div className="mt-3">
                        <div className="bg-green-500/10 border-l-2 border-green-500 p-2 rounded-r-lg">
                           <p className="text-[9px] font-black text-green-600 uppercase leading-tight truncate">Company Holiday</p>
                        </div>
                     </div>
                   )}
                </div>
              );
            })}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3 border-r border-b border-gray-50 min-h-[140px] bg-gray-50/20"></div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
