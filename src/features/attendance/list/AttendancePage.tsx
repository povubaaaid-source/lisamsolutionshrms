"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import AttendanceOverrideModal, {
  AttendanceEmployeeOption,
  AttendanceRecordForOverride,
} from "@/features/attendance/components/AttendanceOverrideModal";
import api from "@/lib/api";
import {
  calculateAttendanceStatus,
  calculateLateAfterGraceMinutes,
  calculateLateMinutes,
  formatDuration,
  getHolidayDate,
  getLeaveDate,
  getLeaveEmployeeId,
  minutesBetween,
  parseOfficeOpenDays,
  ShiftDefinition,
} from "@/lib/hr-utils";
import { Activity, AlertTriangle, CalendarDays, Clock, Cpu, Edit3, History, RefreshCw, ShieldCheck, TimerReset, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ShiftSummary = {
  id?: number | string;
  shift_name?: string;
  type?: string;
  start_time?: string;
  end_time?: string;
  break_minutes?: number;
  late_grace_minutes?: number;
  half_day_mark_time?: string;
  min_hours?: number;
};

type EmployeeOption = AttendanceEmployeeOption & {
  role?: string;
  status?: string;
  employee_detail?: AttendanceEmployeeOption["employee_detail"] & {
    department?: { name?: string; team_name?: string };
  };
};

type AttendanceRecord = AttendanceRecordForOverride & {
  id: number | string;
  employee?: EmployeeOption;
  manual_override?: boolean;
  override_reason?: string;
  override_history?: unknown[];
};

type HolidayRecord = { date?: string; holiday_date?: string; name?: string; occassion?: string };
type LeaveRecord = {
  user_id?: number | string;
  employee_id?: number | string;
  user?: { id?: number | string; name?: string };
  employee?: { id?: number | string; name?: string };
  leave_date?: string;
  date?: string;
  status?: string;
  reason?: string;
  leave_type?: { type_name?: string };
};

type DailyStatus = "present" | "late" | "absent" | "half-day" | "holiday" | "leave" | "weekly-off" | "future" | "missing-checkout";

type DailyAttendanceRow = {
  employee: EmployeeOption;
  attendance?: AttendanceRecord;
  shift?: ShiftSummary;
  holiday?: HolidayRecord;
  leave?: LeaveRecord;
  status: DailyStatus;
  contextLabel: string;
  lateMinutes: number;
  lateAfterGraceMinutes: number;
  workingMinutes: number;
  isException: boolean;
};

const todayString = () => new Date().toISOString().slice(0, 10);
const DEFAULT_ATTENDANCE_DATE = todayString();
const isValidDateParam = (value: string | null) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

const formatTime = (value?: string) => value || "--:--";
const statusLabel = (status: DailyStatus) => {
  if (status === "present") return "On Time";
  if (status === "half-day") return "Half Day";
  if (status === "weekly-off") return "Weekly Off";
  if (status === "missing-checkout") return "Missing Checkout";
  return status.replace("-", " ");
};

const getShiftForEmployee = (employee: EmployeeOption, attendance?: AttendanceRecord): ShiftSummary | undefined =>
  attendance?.shift_type || employee.employee_detail?.shift_type;

const getStatusClass = (status: DailyStatus) => {
  if (status === "present") return "bg-green-50 text-green-700 border-green-100";
  if (status === "late") return "bg-orange-50 text-orange-700 border-orange-100";
  if (status === "half-day") return "bg-yellow-50 text-yellow-700 border-yellow-100";
  if (status === "absent" || status === "missing-checkout") return "bg-red-50 text-red-700 border-red-100";
  if (status === "holiday") return "bg-blue-50 text-blue-700 border-blue-100";
  if (status === "leave") return "bg-purple-50 text-purple-700 border-purple-100";
  return "bg-gray-50 text-gray-600 border-gray-100";
};

const getSourceLabel = (attendance?: AttendanceRecord) => {
  const source = String(attendance?.source_type || attendance?.source || "").toLowerCase();
  if (!attendance) return "Not recorded";
  if (source.includes("machine") || source.includes("device")) return "Machine";
  if (source.includes("override")) return "Manual override";
  if (source.includes("import")) return "Imported";
  return "Manual";
};

const getDeviceLabel = (attendance?: AttendanceRecord) => {
  const deviceId = attendance?.attendance_device_id || attendance?.device_id;
  return deviceId ? `Device ${deviceId}` : "No device";
};

const isPastDate = (date: string) => date < todayString();
const isFutureDate = (date: string) => date > todayString();

const getDateDay = (date: string) => new Date(`${date}T00:00:00`).getDay();

type AttendancePageProps = {
  mode?: "daily" | "date-wise";
};

export default function AttendancePage({ mode = "daily" }: AttendancePageProps) {
  const isDateWise = mode === "date-wise";
  const searchParams = useSearchParams();
  const queryDate = searchParams.get("date");
  const { showToast } = useToast();
  const { user, hasPermission } = useAuth();
  const canManageAttendance =
    user?.role === "admin" ||
    hasPermission("attendance.manage") ||
    hasPermission("attendance.edit") ||
    hasPermission("attendance.approve") ||
    hasPermission("attendance.export");

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [holidays, setHolidays] = useState<HolidayRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [officeOpenDays, setOfficeOpenDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [date, setDate] = useState(() => (isDateWise && isValidDateParam(queryDate) ? String(queryDate) : DEFAULT_ATTENDANCE_DATE));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [editingRow, setEditingRow] = useState<DailyAttendanceRow | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const [employeeResponse, attendanceResponse, holidayResponse, leaveResponse, settingsResponse] = await Promise.all([
        api.get("/employee"),
        api.get("/attendance"),
        api.get("/holidays"),
        api.get("/leaves"),
        api.get("/attendance-settings"),
      ]);
      const employeeList = (employeeResponse.data.data || []) as EmployeeOption[];
      const attendanceList = (attendanceResponse.data.data || []) as AttendanceRecord[];
      const holidayList = (holidayResponse.data.data || []) as HolidayRecord[];
      const leaveList = (leaveResponse.data.data || []) as LeaveRecord[];
      const settingsRecords = settingsResponse.data.data;
      const attendanceSettings = Array.isArray(settingsRecords) ? settingsRecords[0] : settingsRecords;
      const selfEmployee = employeeList.find((employee) =>
        String(employee.id) === String(user?.id) ||
        employee.email === user?.email ||
        employee.name === user?.name
      );
      const selfId = String(selfEmployee?.id || user?.id || "");

      setEmployees(canManageAttendance ? employeeList : employeeList.filter((employee) => String(employee.id) === selfId));
      setAttendance(canManageAttendance ? attendanceList : attendanceList.filter((row) => String(row.employee_id || row.user_id || row.employee?.id || "") === selfId || row.employee?.name === user?.name));
      setHolidays(holidayList);
      setLeaves(canManageAttendance ? leaveList : leaveList.filter((leave) => getLeaveEmployeeId(leave) === selfId || leave.user?.name === user?.name || leave.employee?.name === user?.name));
      setOfficeOpenDays(parseOfficeOpenDays(attendanceSettings?.office_open_days));
    } catch (err) {
      console.error("Fetch Daily Attendance Error:", err);
      showToast("Failed to load attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isDateWise || !isValidDateParam(queryDate) || queryDate === date) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(String(queryDate));
  }, [date, isDateWise, queryDate]);

  const dailyRows = useMemo<DailyAttendanceRow[]>(() => {
    const holiday = holidays.find((item) => getHolidayDate(item) === date);
    const isOfficeOpen = officeOpenDays.includes(getDateDay(date));

    return employees.map((employee) => {
      const employeeId = String(employee.id);
      const attendanceRecord = attendance.find((row) =>
        String(row.date) === date &&
        String(row.employee_id || row.user_id || row.employee?.id || "") === employeeId
      );
      const approvedLeave = leaves.find((leave) => getLeaveEmployeeId(leave) === employeeId && getLeaveDate(leave) === date && String(leave.status || "").toLowerCase() === "approved");
      const shift = getShiftForEmployee(employee, attendanceRecord);
      const calculatedStatus = attendanceRecord
        ? calculateAttendanceStatus(attendanceRecord, shift as ShiftDefinition)
        : undefined;
      const hasMissingCheckout = Boolean(attendanceRecord?.clock_in && !attendanceRecord?.clock_out && isPastDate(date));

      let status: DailyStatus;
      if (hasMissingCheckout) {
        status = "missing-checkout";
      } else if (attendanceRecord && calculatedStatus) {
        status = calculatedStatus as DailyStatus;
      } else if (holiday) {
        status = "holiday";
      } else if (approvedLeave) {
        status = "leave";
      } else if (!isOfficeOpen) {
        status = "weekly-off";
      } else if (isFutureDate(date)) {
        status = "future";
      } else {
        status = "absent";
      }

      const contextParts = [
        holiday ? holiday.name || holiday.occassion || "Holiday" : "",
        approvedLeave ? approvedLeave.leave_type?.type_name || approvedLeave.reason || "Approved leave" : "",
        !isOfficeOpen ? "Weekly off" : "",
      ].filter(Boolean);
      const lateMinutes = attendanceRecord ? calculateLateMinutes(attendanceRecord.clock_in, shift as ShiftDefinition) : 0;
      const lateAfterGraceMinutes = attendanceRecord ? calculateLateAfterGraceMinutes(attendanceRecord.clock_in, shift as ShiftDefinition) : 0;
      const workingMinutes = attendanceRecord ? minutesBetween(attendanceRecord.clock_in, attendanceRecord.clock_out) : 0;
      const hasCalendarOverrideContext = Boolean(attendanceRecord && contextParts.length > 0);
      const isException =
        ["late", "absent", "half-day", "missing-checkout"].includes(status) ||
        hasCalendarOverrideContext ||
        Boolean(attendanceRecord?.manual_override);

      return {
        employee,
        attendance: attendanceRecord,
        shift,
        holiday,
        leave: approvedLeave,
        status,
        contextLabel: contextParts.join(" / "),
        lateMinutes,
        lateAfterGraceMinutes,
        workingMinutes,
        isException,
      };
    });
  }, [attendance, date, employees, holidays, leaves, officeOpenDays]);

  const filteredRows = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return dailyRows.filter((row) => {
      const employeeMatch = !searchTerm || JSON.stringify(row.employee).toLowerCase().includes(searchTerm);
      const statusMatch = statusFilter === "all" || row.status === statusFilter;
      const exceptionMatch = !exceptionsOnly || row.isException;
      return employeeMatch && statusMatch && exceptionMatch;
    });
  }, [dailyRows, exceptionsOnly, search, statusFilter]);

  const stats = useMemo(() => {
    const present = dailyRows.filter((row) => row.status === "present").length;
    const late = dailyRows.filter((row) => row.status === "late").length;
    const halfDay = dailyRows.filter((row) => row.status === "half-day").length;
    const absent = dailyRows.filter((row) => row.status === "absent").length;
    const review = dailyRows.filter((row) => row.isException).length;
    return { total: dailyRows.length, present, late, halfDay, absent, review };
  }, [dailyRows]);

  const resetFilters = () => {
    if (isDateWise) setDate(DEFAULT_ATTENDANCE_DATE);
    setSearch("");
    setStatusFilter("all");
    setExceptionsOnly(false);
  };

  const handleAttendanceSaved = (record: AttendanceRecordForOverride) => {
    const savedRecord = record as AttendanceRecord;
    setAttendance((current) => {
      const withoutSameRecord = current.filter((item) => {
        if (savedRecord.id && String(item.id) === String(savedRecord.id)) return false;
        return !(String(item.date) === String(savedRecord.date) && String(item.employee_id || item.user_id) === String(savedRecord.employee_id || savedRecord.user_id));
      });
      return [savedRecord, ...withoutSameRecord];
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="row bg-title mb-6">
          <div className="col-lg-4 col-md-5 col-sm-5 col-xs-12">
            <h4 className="page-title m-0">
              <Users className="mr-2 inline-block h-5 w-5 text-primary" />
              {isDateWise ? "Date Wise Attendance" : "Daily Attendance"}
            </h4>
          </div>
          <div className="col-sm-8 flex items-center justify-end space-x-2 text-right">
            <ol className="breadcrumb hidden-xs">
              <li><Link href="/dashboard">Home</Link></li>
              <li className="active">Attendance</li>
            </ol>
          </div>
        </div>

        <div className="row mb-6">
          <div className="col-md-12">
            <div className="white-box border-b border-[#eee] p-0">
              <nav className="flex flex-wrap gap-6 px-6">
                <Link href="/attendance/summary" className="border-b-2 border-transparent py-4 text-[13px] font-bold text-gray-400 transition-all hover:text-primary">Summary</Link>
                <Link href="/attendance" className={`border-b-2 py-4 text-[13px] font-bold transition-all ${isDateWise ? "border-transparent text-gray-400 hover:text-primary" : "border-primary text-primary"}`}>Daily Attendance</Link>
                <Link href="/attendance/date" className={`border-b-2 py-4 text-[13px] font-bold transition-all ${isDateWise ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-primary"}`}>Date Wise Attendance</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="white-box">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:items-end">
            {isDateWise ? (
              <div>
                <label className="mb-2 block text-[12px] font-bold text-gray-600">Attendance Date</label>
                <input type="date" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
            ) : (
              <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Today</p>
                <p className="mt-1 text-xs font-bold text-gray-700">{date}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="mb-2 block text-[12px] font-bold text-gray-600">Search Employee</label>
              <input type="search" className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, department" />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-bold text-gray-600">Status</label>
              <select className="form-control" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All Statuses</option>
                <option value="present">On Time / Full Day</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
                <option value="absent">Absent</option>
                <option value="holiday">Holiday</option>
                <option value="leave">Leave</option>
                <option value="weekly-off">Weekly Off</option>
                <option value="missing-checkout">Missing Checkout</option>
              </select>
            </div>
            <div className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2">
              <input id="exceptionsOnly" type="checkbox" checked={exceptionsOnly} onChange={(event) => setExceptionsOnly(event.target.checked)} />
              <label htmlFor="exceptionsOnly" className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Exceptions only</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchAttendance} className="btn-success btn-block h-[34px]">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Apply
              </Button>
              <Button onClick={resetFilters} className="btn-default btn-block h-[34px]">
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="white-box overflow-hidden p-0">
          <div className="flex flex-wrap divide-x divide-[#eee]">
            <div className="min-w-[150px] flex-1 p-6 text-center">
              <h4 className="m-0 text-xl font-bold">{stats.total}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">All Employees</p>
            </div>
            <div className="min-w-[150px] flex-1 p-6 text-center">
              <h4 className="m-0 text-xl font-bold text-success">{stats.present}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">On Time / Full Day</p>
            </div>
            <div className="min-w-[150px] flex-1 border-l border-[#eee] p-6 text-center">
              <h4 className="m-0 text-xl font-bold text-warning">{stats.late}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">Late</p>
            </div>
            <div className="min-w-[150px] flex-1 border-l border-[#eee] p-6 text-center">
              <h4 className="m-0 text-xl font-bold text-warning">{stats.halfDay}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">Half Day</p>
            </div>
            <div className="min-w-[150px] flex-1 border-l border-[#eee] p-6 text-center">
              <h4 className="m-0 text-xl font-bold text-danger">{stats.absent}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">Absent</p>
            </div>
            <div className="min-w-[150px] flex-1 border-l border-[#eee] p-6 text-center">
              <h4 className="m-0 text-xl font-bold text-info">{stats.review}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">Needs Review</p>
            </div>
          </div>
        </div>

        <div className="white-box relative overflow-hidden p-0">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className="table-responsive">
            <table className="min-w-[1180px] border-separate border-spacing-y-2 px-3 text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="rounded-l-lg px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Employee</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Shift</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Check In</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Check Out</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Late Time</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Work Hours</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Source</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Context</th>
                  <th className="rounded-r-lg px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const shiftLabel = row.shift ? `${row.shift.start_time || "--:--"}-${row.shift.end_time || "--:--"}` : "Unassigned";
                  return (
                    <tr key={`${row.employee.id}-${date}`} className="bg-gray-50/60 transition hover:bg-blue-50/60">
                      <td className="rounded-l-lg px-4 py-4">
                        <div className="font-bold text-[13px] text-gray-800">{row.employee.name}</div>
                        <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-gray-400">
                          {row.employee.employee_detail?.designation?.name || row.employee.email || "Staff"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-gray-700">{row.shift?.shift_name || "No shift assigned"}</div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{shiftLabel}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusClass(row.status)}`}>
                          {statusLabel(row.status)}
                        </span>
                        {row.attendance?.manual_override && (
                          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                            <ShieldCheck className="h-3 w-3" /> Override
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-gray-700">{formatTime(row.attendance?.clock_in)}</div>
                        <div className="mt-1 text-[10px] text-gray-400">{row.attendance?.clock_in_ip || "-"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-gray-700">{formatTime(row.attendance?.clock_out)}</div>
                        <div className="mt-1 text-[10px] text-gray-400">{row.attendance?.clock_out_ip || "-"}</div>
                      </td>
                      <td className="px-4 py-4">
                        {row.lateMinutes > 0 ? (
                          <div>
                            <div className="flex items-center gap-1 text-xs font-black text-orange-600">
                              <TimerReset className="h-3.5 w-3.5" /> {formatDuration(row.lateMinutes)}
                            </div>
                            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              After grace {formatDuration(row.lateAfterGraceMinutes)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">On time / N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {row.workingMinutes > 0 ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                            <Clock className="h-3.5 w-3.5 text-primary" /> {formatDuration(row.workingMinutes)}
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Not complete</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                          <Cpu className="h-3.5 w-3.5 text-primary" /> {getSourceLabel(row.attendance)}
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{getDeviceLabel(row.attendance)}</div>
                      </td>
                      <td className="px-4 py-4">
                        {row.contextLabel ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                            <CalendarDays className="h-3.5 w-3.5 text-primary" /> {row.contextLabel}
                          </div>
                        ) : row.isException ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                            <AlertTriangle className="h-3.5 w-3.5" /> Needs review
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                            <Activity className="h-3.5 w-3.5" /> Normal
                          </div>
                        )}
                      </td>
                      <td className="rounded-r-lg px-4 py-4">
                        <div className="flex justify-end gap-2">
                          {canManageAttendance && (
                            <button
                              type="button"
                              onClick={() => setEditingRow(row)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition hover:text-blue-600"
                              title={row.attendance ? "Edit attendance" : "Create attendance"}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                      No attendance found for selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editingRow && (
          <AttendanceOverrideModal
            key={`${editingRow.employee.id}-${date}-${editingRow.attendance?.id || "new"}-${editingRow.status}`}
            isOpen={Boolean(editingRow)}
            date={date}
            employee={editingRow.employee}
            attendance={editingRow.attendance}
            contextLabel={editingRow.contextLabel || (editingRow.status === "absent" ? "Absent correction" : "")}
            onClose={() => setEditingRow(null)}
            onSaved={handleAttendanceSaved}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
