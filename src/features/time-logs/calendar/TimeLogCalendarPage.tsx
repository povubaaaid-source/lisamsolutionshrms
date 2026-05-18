"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const entries = [
  { day: 3, employee: "John Doe", hours: "4h", project: "Website" },
  { day: 8, employee: "Jane Smith", hours: "6h", project: "Mobile App" },
  { day: 12, employee: "Mike Brown", hours: "3h", project: "API" },
  { day: 18, employee: "Sarah Connor", hours: "7h", project: "QA" },
];

export default function TimeLogCalendarPage() {
  const [month, setMonth] = useState(new Date());

  const shiftMonth = (amount: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="-mx-6 -mt-6 flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-base font-black uppercase tracking-widest text-gray-800">Time Log Calendar</h1>
            <p className="mt-1 text-xs font-bold text-gray-400">Monthly time distribution</p>
          </div>
          <Link href="/time-logs">
            <Button className="h-9 border border-gray-200 bg-gray-100 text-xs text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden border-none bg-white p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 p-6">
            <button onClick={() => shiftMonth(-1)} className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
                {month.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
            </div>
            <button onClick={() => shiftMonth(1)} className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 hover:text-primary">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, index) => {
              const day = index - 2;
              const dayEntries = entries.filter((entry) => entry.day === day);
              return (
                <div key={index} className={`min-h-28 border-b border-r border-gray-50 p-2 ${day < 1 || day > 31 ? "bg-gray-50/50" : "bg-white"}`}>
                  {day >= 1 && day <= 31 && <span className="text-xs font-black text-gray-400">{day}</span>}
                  <div className="mt-2 space-y-1">
                    {dayEntries.map((entry) => (
                      <div key={`${entry.employee}-${entry.day}`} className="rounded-lg border-l-2 border-primary bg-primary/5 px-2 py-1">
                        <p className="truncate text-[10px] font-black text-gray-700">{entry.employee}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary">{entry.hours} / {entry.project}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
