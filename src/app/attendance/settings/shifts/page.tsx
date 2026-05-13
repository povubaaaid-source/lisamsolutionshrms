"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ShiftTimeline from "@/components/attendance/shift/ShiftTimeline";
import { Clock, Plus, Settings2, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { ShiftDefinition } from "@/lib/hr-utils";

export default function ShiftManagementPage() {
  const [shifts, setShifts] = useState<ShiftDefinition[]>([
    { id: 1, shift_name: "General Shift", code: "GS", start_time: "09:00", end_time: "18:00", late_grace_minutes: 15, half_day_mark_time: "13:30" },
    { id: 2, shift_name: "Night Shift", code: "NS", start_time: "21:00", end_time: "06:00", late_grace_minutes: 10, half_day_mark_time: "01:30" },
    { id: 3, shift_name: "Morning Peak", code: "MP", start_time: "06:00", end_time: "14:00", late_grace_minutes: 5, half_day_mark_time: "10:00" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="white-box flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="m-0 font-black uppercase tracking-tight text-gray-800">Shift Configuration</h4>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-bold tracking-widest">Attendance / Scheduling Rules</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" /> New Shift
             </Button>
          </div>
        </div>

        {/* Shift Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {shifts.map((shift) => (
            <div key={shift.id} className="white-box p-6 hover:shadow-xl transition-all border border-gray-50">
               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-primary text-xs border border-gray-100">
                        {shift.code}
                     </div>
                     <div>
                        <h5 className="text-sm font-black text-gray-800">{shift.shift_name}</h5>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Type: Fixed Duration</p>
                     </div>
                  </div>
                  <div className="flex gap-1">
                     <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Settings2 className="h-4 w-4" /></button>
                     <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Users className="h-4 w-4" /></button>
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                  <div>
                     <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Start Time</p>
                     <p className="text-sm font-black text-gray-800">{shift.start_time}</p>
                  </div>
                  <div>
                     <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">End Time</p>
                     <p className="text-sm font-black text-gray-800">{shift.end_time}</p>
                  </div>
                  <div>
                     <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Grace Period</p>
                     <p className="text-sm font-black text-warning">{shift.late_grace_minutes}m</p>
                  </div>
                  <div>
                     <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Half Day Mark</p>
                     <p className="text-sm font-black text-gray-800">{shift.half_day_mark_time}</p>
                  </div>
               </div>

               <ShiftTimeline shift={shift} />
            </div>
          ))}
        </div>

        {/* Global Rules / Policies */}
        <div className="white-box bg-gray-50/50 border-dashed border-2 border-gray-200 p-8 text-center">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Policy Engine Settings</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold max-w-md mx-auto">
               Changes here will affect payroll calculations and biometric log processing for all organizations in the current cluster.
            </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
