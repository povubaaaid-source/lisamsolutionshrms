"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Clock, Plus, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ShiftCreateModal, { type ShiftTypeOption } from "@/features/attendance/settings/shifts/components/ShiftCreateModal";

const fallbackShifts: ShiftTypeOption[] = [
  { id: 1, shift_name: "General Shift", type: "fixed", start_time: "09:00", end_time: "18:00", break_minutes: 60, late_grace_minutes: 15, half_day_mark_time: "13:30", min_hours: 8, auto_attendance: "enabled", status: "active" },
  { id: 2, shift_name: "Night Shift", type: "night", start_time: "21:00", end_time: "06:00", break_minutes: 45, late_grace_minutes: 10, half_day_mark_time: "01:30", min_hours: 7.5, auto_attendance: "enabled", status: "active" },
  { id: 3, shift_name: "Morning Peak", type: "fixed", start_time: "06:00", end_time: "14:00", break_minutes: 30, late_grace_minutes: 5, half_day_mark_time: "10:00", min_hours: 7, auto_attendance: "manual-review", status: "active" },
];

const extractShiftRecords = (payload: unknown): ShiftTypeOption[] => {
  const root = payload as { data?: unknown } | null;
  const data = root && typeof root === "object" && "data" in root ? root.data : payload;
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ShiftTypeOption => Boolean(item) && typeof item === "object");
};

const formatMinutes = (value?: number) => `${Number(value || 0)} min`;

export default function AttendanceShiftsPage() {
  const { showToast } = useToast();
  const [shifts, setShifts] = useState<ShiftTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/shift-types");
      const records = extractShiftRecords(response.data);
      setShifts(records.length ? records : fallbackShifts);
    } catch (error) {
      console.error("Fetch Shift Settings Error:", error);
      setShifts(fallbackShifts);
      showToast("Shift API is not available. Showing fallback shifts.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchShifts();
  }, [fetchShifts]);

  const handleShiftCreated = (shift: ShiftTypeOption) => {
    setShifts((current) => [shift, ...current.filter((item) => String(item.id) !== String(shift.id))]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="white-box flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="m-0 font-black uppercase tracking-tight text-gray-800">Shift Settings</h4>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Manage attendance shift timings used by employees and attendance processing
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchShifts} className="btn-default" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Sync
            </Button>
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Shift
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Shift Name</th>
                  <th>Type</th>
                  <th>Timing</th>
                  <th>Break</th>
                  <th>Late Grace</th>
                  <th>Half Day Mark</th>
                  <th>Min Hours</th>
                  <th>Auto Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-8 py-16 text-center">
                      <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-gray-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading shifts</p>
                    </td>
                  </tr>
                )}

                {!loading && shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>
                      <span className="font-bold text-gray-800">{shift.shift_name}</span>
                    </td>
                    <td className="capitalize">{shift.type || "fixed"}</td>
                    <td>{shift.start_time || "--:--"} - {shift.end_time || "--:--"}</td>
                    <td>{formatMinutes(shift.break_minutes)}</td>
                    <td>{formatMinutes(shift.late_grace_minutes)}</td>
                    <td>{shift.half_day_mark_time || "--:--"}</td>
                    <td>{Number(shift.min_hours || 0)}</td>
                    <td className="capitalize">{String(shift.auto_attendance || "disabled").replace("-", " ")}</td>
                    <td className="capitalize">{shift.status || "active"}</td>
                  </tr>
                ))}

                {!loading && shifts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-8 py-16 text-center">
                      <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No shift records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <ShiftCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleShiftCreated}
      />
    </DashboardLayout>
  );
}
