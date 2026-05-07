"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tasks = [
  { id: 1, title: "Design homepage mockup", date: "2026-05-10", color: "#d21010" },
  { id: 2, title: "Fix login bug", date: "2026-05-12", color: "#fec107" },
  { id: 3, title: "Create API docs", date: "2026-05-15", color: "#03a9f3" },
  { id: 4, title: "Unit testing", date: "2026-05-08", color: "#00c292" },
];

export default function TaskCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth(year, month); i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth(year, month); i++) {
    days.push(i);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Task Calendar</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span className="text-gray-700">Task Calendar</span>
            </div>
          </div>
          <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white border-none text-xs h-9">
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-700">{monthName} {year}</h3>
            <div className="flex items-center space-x-2">
              <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full border border-gray-200 text-gray-400 hover:text-primary transition-all shadow-sm bg-white/50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold bg-white border border-gray-200 rounded text-gray-600 hover:text-primary transition-all shadow-sm">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full border border-gray-200 text-gray-400 hover:text-primary transition-all shadow-sm bg-white/50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
              const dayTasks = tasks.filter(t => t.date === dateStr);

              return (
                <div key={i} className={`min-h-[120px] border-r border-b border-gray-50 p-2 transition-colors hover:bg-gray-50/50 ${!day ? "bg-gray-50/30" : ""}`}>
                  {day && (
                    <>
                      <span className={`text-xs font-bold ${day === new Date().getDate() && month === new Date().getMonth() ? "bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center -ml-1 -mt-1 shadow-sm" : "text-gray-400"}`}>
                        {day}
                      </span>
                      <div className="mt-2 space-y-1">
                        {dayTasks.map(task => (
                          <div 
                            key={task.id} 
                            className="text-[9px] font-bold px-2 py-1 rounded border-l-2 truncate cursor-pointer hover:brightness-95 transition-all shadow-sm"
                            style={{ backgroundColor: `${task.color}15`, color: task.color, borderLeftColor: task.color }}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Plus className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-blue-700 font-medium">
                Note: This calendar shows tasks based on their due dates. Drag and drop functionality to be implemented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
