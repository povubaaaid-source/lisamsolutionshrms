"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

export default function EventCalendarPage() {
  const [currentDate] = useState(new Date());
  
  const events = [
    { id: 1, title: "Product Launch", date: "2024-05-15", time: "10:00 AM", color: "bg-blue-500" },
    { id: 2, title: "Team Meeting", date: "2024-05-18", time: "02:00 PM", color: "bg-green-500" },
    { id: 3, title: "Client Dinner", date: "2024-05-20", time: "07:30 PM", color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-3 border-b border-gray-50">
          <div>
             <h1 className="text-base font-black text-gray-800 uppercase tracking-widest">Event Calendar</h1>
             <p className="text-[10px] text-gray-400 font-bold mt-0.5">Manage company events and scheduled meetings</p>
          </div>
          <Button className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
             <Plus className="h-4 w-4 mr-2" /> Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Sidebar Events */}
           <div className="space-y-6">
              <Card title="Upcoming Events" className="border-none shadow-sm bg-white p-6">
                 <div className="space-y-4 mt-2">
                    {events.map((event) => (
                       <div key={event.id} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                          <div className={`h-2 w-2 rounded-full mt-1.5 ${event.color}`} />
                          <div>
                             <p className="text-xs font-bold text-gray-700">{event.title}</p>
                             <div className="flex items-center space-x-2 mt-1">
                                <Clock className="h-3 w-3 text-gray-300" />
                                <span className="text-[9px] text-gray-400 font-black uppercase">{event.time}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
              
              <Card className="border-none shadow-sm bg-primary/5 p-6 border border-primary/10">
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Pro Tip</p>
                 <p className="text-xs text-primary/70 font-medium leading-relaxed">
                    Click on any date in the calendar to quickly create a new event for that day.
                 </p>
              </Card>
           </div>

           {/* Calendar Grid */}
           <div className="lg:col-span-3">
              <Card className="border-none shadow-sm bg-white p-6">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">May 2024</h2>
                    <div className="flex items-center space-x-1">
                       <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
                       <button className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-colors">Today</button>
                       <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight className="h-5 w-5 text-gray-400" /></button>
                    </div>
                 </div>

                 <div className="grid grid-cols-7 border-t border-l border-gray-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                       <div key={day} className="py-4 text-center border-r border-b border-gray-50">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                       </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                       const day = i - 2; // Offset for May 2024
                       const isToday = day === 1;
                       const hasEvent = events.find(e => parseInt(e.date.split('-')[2]) === day);
                       
                       return (
                          <div key={i} className="min-h-[100px] p-2 border-r border-b border-gray-50 hover:bg-gray-50/30 transition-colors cursor-pointer relative group">
                             <span className={`inline-block h-6 w-6 text-center leading-6 rounded-lg text-[10px] font-black ${
                                isToday ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 group-hover:text-gray-700"
                             }`}>
                                {day > 0 && day <= 31 ? day : ""}
                             </span>
                             {hasEvent && (
                                <div className={`mt-2 p-1.5 rounded-lg ${hasEvent.color} text-white text-[8px] font-black uppercase truncate tracking-tighter shadow-sm`}>
                                   {hasEvent.title}
                                </div>
                             )}
                          </div>
                       );
                    })}
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
