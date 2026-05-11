"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock,
  Download,
  Edit,
  Moon,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

type ShiftType = {
  id: number | string;
  shift_name: string;
  code: string;
  type: "fixed" | "flexible" | "night" | "rotating" | "split";
  start_time: string;
  end_time: string;
  break_minutes: number;
  late_grace_minutes: number;
  early_clock_in_minutes: number;
  half_day_mark_time: string;
  min_hours: number;
  auto_attendance: "enabled" | "disabled" | "manual-review";
  status: "active" | "inactive";
  color: string;
  description: string;
};

type ShiftFormValues = Omit<ShiftType, "id" | "break_minutes" | "late_grace_minutes" | "early_clock_in_minutes" | "min_hours"> & {
  break_minutes: string;
  late_grace_minutes: string;
  early_clock_in_minutes: string;
  min_hours: string;
};

const emptyForm: ShiftFormValues = {
  shift_name: "",
  code: "",
  type: "fixed",
  start_time: "09:00",
  end_time: "18:00",
  break_minutes: "60",
  late_grace_minutes: "15",
  early_clock_in_minutes: "30",
  half_day_mark_time: "13:00",
  min_hours: "8",
  auto_attendance: "enabled",
  status: "active",
  color: "#03a9f3",
  description: "",
};

const shiftTypeOptions: Array<{ label: string; value: ShiftType["type"] }> = [
  { label: "Fixed", value: "fixed" },
  { label: "Flexible", value: "flexible" },
  { label: "Night", value: "night" },
  { label: "Rotating", value: "rotating" },
  { label: "Split", value: "split" },
];

const autoAttendanceOptions: Array<{ label: string; value: ShiftType["auto_attendance"] }> = [
  { label: "Enabled", value: "enabled" },
  { label: "Manual Review", value: "manual-review" },
  { label: "Disabled", value: "disabled" },
];

const statusOptions: Array<{ label: string; value: ShiftType["status"] }> = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

function extractRecords(payload: unknown): ShiftType[] {
  const root = payload as { data?: unknown } | null;
  const data = root && typeof root === "object" && "data" in root ? root.data : payload;
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ShiftType => Boolean(item) && typeof item === "object");
}

function extractRecord(payload: unknown): ShiftType | null {
  const records = extractRecords(payload);
  if (records[0]) return records[0];
  const root = payload as { data?: unknown } | null;
  return root?.data && typeof root.data === "object" ? (root.data as ShiftType) : null;
}

function toNumber(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizePayload(form: ShiftFormValues) {
  return {
    ...form,
    shift_name: form.shift_name.trim(),
    code: form.code.trim().toUpperCase(),
    break_minutes: toNumber(form.break_minutes),
    late_grace_minutes: toNumber(form.late_grace_minutes),
    early_clock_in_minutes: toNumber(form.early_clock_in_minutes),
    min_hours: toNumber(form.min_hours),
  };
}

function toFormValues(shift: ShiftType): ShiftFormValues {
  return {
    ...shift,
    break_minutes: String(shift.break_minutes ?? 0),
    late_grace_minutes: String(shift.late_grace_minutes ?? 0),
    early_clock_in_minutes: String(shift.early_clock_in_minutes ?? 0),
    min_hours: String(shift.min_hours ?? 0),
  };
}

function minutesFromTime(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isOvernightShift(shift: Pick<ShiftType, "start_time" | "end_time">) {
  return minutesFromTime(shift.end_time) <= minutesFromTime(shift.start_time);
}

function getShiftDuration(shift: Pick<ShiftType, "start_time" | "end_time" | "break_minutes">) {
  const start = minutesFromTime(shift.start_time);
  const end = minutesFromTime(shift.end_time);
  const totalMinutes = (end <= start ? end + 1440 : end) - start - Number(shift.break_minutes || 0);
  const hours = Math.max(0, totalMinutes / 60);
  return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)} hrs`;
}

function statusBadgeClass(status: ShiftType["status"]) {
  return status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500";
}

function autoAttendanceBadgeClass(value: ShiftType["auto_attendance"]) {
  if (value === "enabled") return "bg-blue-50 text-blue-600";
  if (value === "manual-review") return "bg-yellow-50 text-yellow-700";
  return "bg-gray-100 text-gray-500";
}

export default function ShiftTypesPage() {
  const { showToast } = useToast();
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formValues, setFormValues] = useState<ShiftFormValues>(emptyForm);
  const [editingShift, setEditingShift] = useState<ShiftType | null>(null);
  const [deletingShift, setDeletingShift] = useState<ShiftType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchShiftTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/shift-types");
      setShiftTypes(extractRecords(response.data));
    } catch {
      showToast("Shift Types API is not available yet. Showing local starter data.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // Data fetch effect mirrors the rest of the admin modules and only runs on mount/callback change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchShiftTypes();
  }, [fetchShiftTypes]);

  const filteredShiftTypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return shiftTypes.filter((shift) => {
      const searchMatch =
        !normalizedQuery ||
        `${shift.shift_name} ${shift.code} ${shift.description}`.toLowerCase().includes(normalizedQuery);
      const typeMatch = typeFilter === "all" || shift.type === typeFilter;
      const statusMatch = statusFilter === "all" || shift.status === statusFilter;
      return searchMatch && typeMatch && statusMatch;
    });
  }, [query, shiftTypes, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const active = shiftTypes.filter((shift) => shift.status === "active").length;
    const overnight = shiftTypes.filter(isOvernightShift).length;
    const autoAttendance = shiftTypes.filter((shift) => shift.auto_attendance === "enabled").length;
    return { total: shiftTypes.length, active, overnight, autoAttendance };
  }, [shiftTypes]);

  const updateField = (field: keyof ShiftFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const openCreate = () => {
    setEditingShift(null);
    setFormValues(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (shift: ShiftType) => {
    setEditingShift(shift);
    setFormValues(toFormValues(shift));
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const payload = normalizePayload(formValues);

    try {
      if (editingShift) {
        const response = await api.put(`/shift-types/${editingShift.id}`, payload);
        const updated = extractRecord(response.data) ?? { ...editingShift, ...payload };
        setShiftTypes((current) => current.map((shift) => (shift.id === editingShift.id ? updated : shift)));
        showToast("Shift type updated successfully.");
      } else {
        const response = await api.post("/shift-types", payload);
        const created = extractRecord(response.data) ?? { id: Date.now(), ...payload };
        setShiftTypes((current) => [created, ...current]);
        showToast("Shift type created successfully.");
      }
      setIsFormOpen(false);
    } catch {
      showToast("Saved locally because the future PHP endpoint is not ready.", "error");
      if (editingShift) {
        setShiftTypes((current) => current.map((shift) => (shift.id === editingShift.id ? { ...shift, ...payload } : shift)));
      } else {
        setShiftTypes((current) => [{ id: Date.now(), ...payload }, ...current]);
      }
      setIsFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingShift) return;
    try {
      await api.delete(`/shift-types/${deletingShift.id}`);
      showToast("Shift type deleted successfully.");
    } catch {
      showToast("Removed locally because the future PHP endpoint is not ready.", "error");
    } finally {
      setShiftTypes((current) => current.filter((shift) => shift.id !== deletingShift.id));
      setDeletingShift(null);
    }
  };

  const handleExport = () => {
    const rows = [
      ["Name", "Code", "Type", "Start", "End", "Break", "Late Grace", "Min Hours", "Auto Attendance", "Status"],
      ...filteredShiftTypes.map((shift) => [
        shift.shift_name,
        shift.code,
        shift.type,
        shift.start_time,
        shift.end_time,
        String(shift.break_minutes),
        String(shift.late_grace_minutes),
        String(shift.min_hours),
        shift.auto_attendance,
        shift.status,
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shift-types.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="-mx-4 -mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 shadow-sm sm:-mx-6 sm:-mt-6 sm:px-6">
          <div>
            <h1 className="text-base font-black uppercase tracking-widest text-gray-800">Shift Types</h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Configure work shifts, grace periods, and attendance rules
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchShiftTypes}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors hover:text-primary"
              aria-label="Refresh shift types"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Button
              type="button"
              onClick={handleExport}
              className="h-10 border-none bg-gray-50 px-5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              type="button"
              onClick={openCreate}
              className="h-10 bg-primary px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              Add Shift Type
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Total Shifts", value: stats.total, icon: Clock, color: "text-primary", bg: "bg-blue-50" },
            { label: "Active", value: stats.active, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
            { label: "Overnight", value: stats.overnight, icon: Moon, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Auto Attendance", value: stats.autoAttendance, icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((item) => (
            <Card key={item.label} className="border-none bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                  <p className="text-xl font-black text-gray-900">{item.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="border-none bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="form-control pl-11"
                placeholder="Search shift name, code, or description..."
              />
            </div>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="form-control">
              <option value="all">All Types</option>
              {shiftTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="form-control">
              <option value="all">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="overflow-hidden border-none bg-white p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {["Shift", "Timing", "Attendance Rules", "Auto Attendance", "Status", "Action"].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Loading shift types</p>
                    </td>
                  </tr>
                )}

                {!loading && filteredShiftTypes.map((shift) => (
                  <tr key={shift.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-1.5 rounded-full" style={{ backgroundColor: shift.color }} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight text-gray-800">{shift.shift_name}</p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {shift.code} - {shift.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-gray-700">{shift.start_time} - {shift.end_time}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {getShiftDuration(shift)} {isOvernightShift(shift) ? "- Overnight" : ""}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <p>Break: {shift.break_minutes} min</p>
                        <p>Late grace: {shift.late_grace_minutes} min</p>
                        <p>Half day mark: {shift.half_day_mark_time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${autoAttendanceBadgeClass(shift.auto_attendance)}`}>
                        {shift.auto_attendance.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusBadgeClass(shift.status)}`}>
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => openEdit(shift)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600" aria-label={`Edit ${shift.shift_name}`}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setDeletingShift(shift)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${shift.shift_name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredShiftTypes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">No shift types found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingShift ? "Edit Shift Type" : "Create Shift Type"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Shift Name</span>
              <input value={formValues.shift_name} onChange={(event) => updateField("shift_name", event.target.value)} className="form-control" placeholder="General Day Shift" required />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Code</span>
              <input value={formValues.code} onChange={(event) => updateField("code", event.target.value)} className="form-control uppercase" placeholder="DAY" required />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Shift Type</span>
              <select value={formValues.type} onChange={(event) => updateField("type", event.target.value)} className="form-control">
                {shiftTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Color</span>
              <input type="color" value={formValues.color} onChange={(event) => updateField("color", event.target.value)} className="form-control h-11 p-1" />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Start Time</span>
              <input type="time" value={formValues.start_time} onChange={(event) => updateField("start_time", event.target.value)} className="form-control" required />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">End Time</span>
              <input type="time" value={formValues.end_time} onChange={(event) => updateField("end_time", event.target.value)} className="form-control" required />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Break Minutes</span>
              <input type="number" min="0" value={formValues.break_minutes} onChange={(event) => updateField("break_minutes", event.target.value)} className="form-control" />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Late Grace Minutes</span>
              <input type="number" min="0" value={formValues.late_grace_minutes} onChange={(event) => updateField("late_grace_minutes", event.target.value)} className="form-control" />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Early Clock-in Window</span>
              <input type="number" min="0" value={formValues.early_clock_in_minutes} onChange={(event) => updateField("early_clock_in_minutes", event.target.value)} className="form-control" />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Half Day Mark Time</span>
              <input type="time" value={formValues.half_day_mark_time} onChange={(event) => updateField("half_day_mark_time", event.target.value)} className="form-control" />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Minimum Paid Hours</span>
              <input type="number" min="0" step="0.5" value={formValues.min_hours} onChange={(event) => updateField("min_hours", event.target.value)} className="form-control" />
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Auto Attendance</span>
              <select value={formValues.auto_attendance} onChange={(event) => updateField("auto_attendance", event.target.value)} className="form-control">
                {autoAttendanceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Status</span>
              <select value={formValues.status} onChange={(event) => updateField("status", event.target.value)} className="form-control">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</span>
              <textarea value={formValues.description} onChange={(event) => updateField("description", event.target.value)} className="form-control min-h-24" placeholder="Where this shift applies and any manager notes." />
            </label>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Calculated Duration</p>
            <p className="mt-1 text-sm font-bold text-gray-700">
              {getShiftDuration({
                start_time: formValues.start_time,
                end_time: formValues.end_time,
                break_minutes: toNumber(formValues.break_minutes),
              })}
              {isOvernightShift(formValues) ? " - crosses midnight" : ""}
            </p>
          </div>

          <div className="flex gap-4 border-t border-gray-50 pt-4">
            <Button type="button" onClick={() => setIsFormOpen(false)} className="h-12 flex-1 border-none bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="h-12 flex-1 bg-primary text-[10px] font-black uppercase tracking-widest text-white">
              Save Shift Type
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingShift)} onClose={() => setDeletingShift(null)} title="Delete Shift Type" size="sm">
        <div className="py-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-800">Delete this shift?</h3>
          <p className="mx-auto mt-2 max-w-xs text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Existing attendance history should keep its stored timings, but new assignments should use another active shift.
          </p>
          <div className="mt-8 flex gap-4">
            <Button type="button" onClick={() => setDeletingShift(null)} className="h-12 flex-1 border-none bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
              Cancel
            </Button>
            <Button type="button" onClick={handleDelete} className="h-12 flex-1 bg-red-500 text-[10px] font-black uppercase tracking-widest text-white">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
