"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Plus, Users, RefreshCw, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

type EmployeeOption = {
  id: number | string;
  name: string;
  email?: string;
  role?: string;
  employee_detail?: {
    shift_type_id?: number | string;
    shift_type?: ShiftSummary;
  };
};

type ShiftSummary = {
  id?: number | string;
  shift_name?: string;
  code?: string;
  type?: string;
  start_time?: string;
  end_time?: string;
  break_minutes?: number;
  late_grace_minutes?: number;
  half_day_mark_time?: string;
  min_hours?: number;
};

type AttendanceRecord = {
  id: number | string;
  employee_id?: number | string;
  user_id?: number | string;
  employee?: EmployeeOption;
  date: string;
  status: string;
  clock_in?: string;
  clock_out?: string;
  clock_in_ip?: string;
  clock_out_ip?: string;
  working_from?: string;
  half_day?: boolean;
  late?: boolean;
  shift_type_id?: number | string;
  shift_type?: ShiftSummary;
};

const today = new Date();
const defaultFrom = new Date(today);
defaultFrom.setDate(today.getDate() - 30);

const formatTime = (value?: string) => value || "--:--";

const getEmployeeName = (row: AttendanceRecord, employees: EmployeeOption[]) =>
  row.employee?.name || employees.find((employee) => String(employee.id) === String(row.employee_id || row.user_id))?.name || "Unknown";

const timeToMinutes = (value?: string) => {
  if (!value) return null;
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const normalizeShiftMinute = (value?: string, shift?: ShiftSummary) => {
  const minutes = timeToMinutes(value);
  const start = timeToMinutes(shift?.start_time);
  const end = timeToMinutes(shift?.end_time);
  if (minutes === null) return null;
  if (start !== null && end !== null && end <= start && minutes < start) return minutes + 24 * 60;
  return minutes;
};

const getShiftForRow = (row: AttendanceRecord, employees: EmployeeOption[]) => {
  const employeeId = String(row.employee_id || row.user_id || row.employee?.id || "");
  return (
    row.shift_type ||
    row.employee?.employee_detail?.shift_type ||
    employees.find((employee) => String(employee.id) === employeeId)?.employee_detail?.shift_type
  );
};

const calculateStatus = (row: AttendanceRecord, shift?: ShiftSummary) => {
  if (row.status === "absent") return "absent";
  if (row.half_day || row.status === "half-day") return "half-day";

  const clockIn = normalizeShiftMinute(row.clock_in, shift);
  const shiftStart = normalizeShiftMinute(shift?.start_time, shift);
  const halfDayMark = normalizeShiftMinute(shift?.half_day_mark_time, shift);

  if (clockIn !== null && halfDayMark !== null && clockIn >= halfDayMark) return "half-day";
  if (row.late) return "late";
  if (clockIn !== null && shiftStart !== null) {
    const grace = Number(shift?.late_grace_minutes || 0);
    if (clockIn > shiftStart + grace) return "late";
  }

  return row.status || "present";
};

const getShiftLabel = (shift?: ShiftSummary) => {
  if (!shift) return "Unassigned";
  const code = shift.code ? `${shift.code} ` : "";
  return `${code}${formatTime(shift.start_time)}-${formatTime(shift.end_time)}`;
};

const getStatusClass = (status: string) => {
  if (status === "present") return "label-success";
  if (status === "late" || status === "absent") return "label-danger";
  return "label-info";
};

export default function AttendancePage() {
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
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [dateFrom, setDateFrom] = useState(defaultFrom.toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(today.toISOString().slice(0, 10));

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const [employeeResponse, attendanceResponse] = await Promise.all([
        api.get("/employee"),
        api.get("/attendance"),
      ]);
      const employeeList = (employeeResponse.data.data || []) as EmployeeOption[];
      const attendanceList = (attendanceResponse.data.data || []) as AttendanceRecord[];
      const selfEmployee = employeeList.find((employee) =>
        String(employee.id) === String(user?.id) ||
        employee.email === user?.email ||
        employee.name === user?.name
      );
      const scopedEmployees = canManageAttendance ? employeeList : employeeList.filter((employee) => String(employee.id) === String(selfEmployee?.id || user?.id));
      const scopedAttendance = canManageAttendance
        ? attendanceList
        : attendanceList.filter((row) => {
          const rowEmployeeId = String(row.employee_id || row.user_id || row.employee?.id || "");
          return rowEmployeeId === String(selfEmployee?.id || user?.id) || row.employee?.name === user?.name;
        });
      setEmployees(scopedEmployees);
      setAttendance(scopedAttendance);
    } catch (err) {
      console.error("Fetch Attendance Error:", err);
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

  const resetFilters = () => {
    setSelectedEmployee("all");
    setDateFrom(defaultFrom.toISOString().slice(0, 10));
    setDateTo(today.toISOString().slice(0, 10));
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((row) => {
      const rowEmployeeId = String(row.employee_id || row.user_id || row.employee?.id || "");
      const employeeMatch = selectedEmployee === "all" || rowEmployeeId === selectedEmployee;
      const dateMatch = row.date >= dateFrom && row.date <= dateTo;
      return employeeMatch && dateMatch;
    });
  }, [attendance, dateFrom, dateTo, selectedEmployee]);

  const stats = useMemo(() => {
    const calculatedRows = filteredAttendance.map((row) => calculateStatus(row, getShiftForRow(row, employees)));
    const present = calculatedRows.filter((status) => status === "present").length;
    const late = calculatedRows.filter((status) => status === "late").length;
    const absent = calculatedRows.filter((status) => status === "absent").length;
    const halfDay = calculatedRows.filter((status) => status === "half-day").length;
    return { present, late, absent, halfDay, total: filteredAttendance.length };
  }, [employees, filteredAttendance]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="row bg-title mb-6">
          <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
            <h4 className="page-title m-0">
              <Users className="h-5 w-5 mr-2 inline-block text-primary" />
              Attendance
            </h4>
          </div>
          <div className="col-sm-9 text-right flex justify-end items-center space-x-2">
            <Link href="/attendance/create">
              <Button className="btn-success btn-sm">
                {canManageAttendance ? "Mark Attendance" : "Clock In"} <Plus className="h-4 w-4 ml-1 inline-block" />
              </Button>
            </Link>
            <ol className="breadcrumb hidden-xs">
              <li><Link href="/dashboard">Home</Link></li>
              <li className="active">Attendance</li>
            </ol>
          </div>
        </div>

        <div className="row mb-6">
          <div className="col-md-12">
            <div className="white-box p-0 border-b border-[#eee]">
              <nav className="flex space-x-8 px-6">
                <Link href="/attendance/summary" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Summary</Link>
                <Link href="/attendance" className="py-4 text-[13px] font-bold text-primary border-b-2 border-primary transition-all">Attendance By Member</Link>
                <Link href="/attendance/date" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Attendance By Date</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="white-box">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-2">From Date</label>
              <input type="date" className="form-control" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-2">To Date</label>
              <input type="date" className="form-control" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12px] font-bold text-gray-600 mb-2">{canManageAttendance ? "Employee Name" : "My Profile"}</label>
              <select className="form-control" value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)}>
                <option value="all">{canManageAttendance ? "All Employees" : "My Attendance"}</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchAttendance} className="btn-success btn-block h-[34px]">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Apply
              </Button>
              <Button onClick={resetFilters} className="btn-default btn-block h-[34px]">
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="white-box p-0 overflow-hidden">
          <div className="flex flex-wrap divide-x divide-[#eee]">
            <div className="flex-1 min-w-[150px] p-6 text-center">
              <h4 className="m-0 text-xl font-bold">{stats.total}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Filtered Entries</p>
            </div>
            <div className="flex-1 min-w-[150px] p-6 text-center">
              <h4 className="m-0 text-xl font-bold text-success">{stats.present}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Days Present</p>
            </div>
            <div className="flex-1 min-w-[150px] p-6 text-center border-l border-[#eee]">
              <h4 className="m-0 text-xl font-bold text-danger">{stats.late}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Days Late</p>
            </div>
            <div className="flex-1 min-w-[150px] p-6 text-center border-l border-[#eee]">
              <h4 className="m-0 text-xl font-bold text-warning">{stats.halfDay}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Half Day</p>
            </div>
            <div className="flex-1 min-w-[150px] p-6 text-center border-l border-[#eee]">
              <h4 className="m-0 text-xl font-bold text-info">{stats.absent}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Days Absent</p>
            </div>
          </div>
        </div>

        <div className="white-box p-0 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Shift</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Working From</th>
                  <th>Others</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((row) => {
                  const shift = getShiftForRow(row, employees);
                  const status = calculateStatus(row, shift);

                  return (
                  <tr key={row.id}>
                    <td className="font-bold">{getEmployeeName(row, employees)}</td>
                    <td>
                      <div className="font-medium">{shift?.shift_name || "Unassigned"}</div>
                      <div className="text-[10px] text-gray-400">{getShiftLabel(shift)}</div>
                    </td>
                    <td>{row.date}</td>
                    <td>
                      <span className={`label ${getStatusClass(status)}`}>{status}</span>
                    </td>
                    <td>
                      <div className="font-medium">{formatTime(row.clock_in)}</div>
                      <div className="text-[10px] text-gray-400">{row.clock_in_ip || "-"}</div>
                    </td>
                    <td>
                      <div className="font-medium">{formatTime(row.clock_out)}</div>
                      <div className="text-[10px] text-gray-400">{row.clock_out_ip || "-"}</div>
                    </td>
                    <td>{row.working_from || "-"}</td>
                    <td>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2 text-primary" />
                        {status === "half-day"
                          ? "Half day"
                          : status === "late"
                            ? `Late after ${shift?.late_grace_minutes || 0}m grace`
                            : "Full day"}
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {!loading && filteredAttendance.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                      No attendance found for selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
