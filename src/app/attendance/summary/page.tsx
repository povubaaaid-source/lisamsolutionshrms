"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Plus, Calendar, Check, X, Star, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

type ShiftSummary = {
  id?: number | string;
  shift_name?: string;
  code?: string;
  start_time?: string;
  end_time?: string;
  late_grace_minutes?: number;
  half_day_mark_time?: string;
};

type EmployeeOption = {
  id: number | string;
  name: string;
  employee_detail?: {
    shift_type?: ShiftSummary;
  };
};

type AttendanceRecord = {
  id: number | string;
  employee_id?: number | string;
  user_id?: number | string;
  employee?: EmployeeOption;
  date: string;
  status: string;
  clock_in?: string;
  late?: boolean;
  half_day?: boolean;
  shift_type?: ShiftSummary;
};

const thisYear = new Date("2026-05-08").getFullYear();

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

const calculateStatus = (row: AttendanceRecord, shift?: ShiftSummary) => {
  if (row.status === "absent") return "absent";
  if (row.half_day || row.status === "half-day") return "half-day";

  const clockIn = normalizeShiftMinute(row.clock_in, shift);
  const shiftStart = normalizeShiftMinute(shift?.start_time, shift);
  const halfDayMark = normalizeShiftMinute(shift?.half_day_mark_time, shift);

  if (clockIn !== null && halfDayMark !== null && clockIn >= halfDayMark) return "half-day";
  if (row.late) return "late";
  if (clockIn !== null && shiftStart !== null && clockIn > shiftStart + Number(shift?.late_grace_minutes || 0)) return "late";
  return row.status || "present";
};

export default function AttendanceSummaryPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(thisYear);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeeResponse, attendanceResponse] = await Promise.all([
        api.get("/employee"),
        api.get("/attendance"),
      ]);
      setEmployees(employeeResponse.data.data || []);
      setAttendance(attendanceResponse.data.data || []);
    } catch (err) {
      console.error("Fetch Attendance Summary Error:", err);
      showToast("Failed to load attendance summary", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const visibleEmployees = useMemo(
    () => employees.filter((employee) => selectedEmployee === "all" || String(employee.id) === selectedEmployee),
    [employees, selectedEmployee],
  );

  const attendanceByEmployeeDay = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance.forEach((row) => {
      const date = new Date(row.date);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return;
      const employeeId = String(row.employee_id || row.user_id || row.employee?.id || "");
      map.set(`${employeeId}-${date.getDate()}`, row);
    });
    return map;
  }, [attendance, month, year]);

  const getDayStatus = (employeeId: number | string, day: number) => {
    const record = attendanceByEmployeeDay.get(`${employeeId}-${day}`);
    if (record) {
      const shift = record.shift_type || employees.find((employee) => String(employee.id) === String(employeeId))?.employee_detail?.shift_type;
      return calculateStatus(record, shift);
    }
    const date = new Date(year, month - 1, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return isWeekend ? "holiday" : "empty";
  };

  const getTotal = (employeeId: number | string) =>
    daysArray.reduce((total, day) => {
      const status = getDayStatus(employeeId, day);
      if (status === "half-day") return total + 0.5;
      return ["present", "late"].includes(status) ? total + 1 : total;
    }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="row bg-title mb-6">
          <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
            <h4 className="page-title m-0">
              <Calendar className="h-5 w-5 mr-2 inline-block text-primary" />
              Attendance Summary
            </h4>
          </div>
          <div className="col-sm-9 text-right flex justify-end items-center space-x-2">
            <Link href="/attendance/create">
              <Button className="btn-success btn-sm">
                Mark Attendance <Plus className="h-4 w-4 ml-1 inline-block" />
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
                <Link href="/attendance/summary" className="py-4 text-[13px] font-bold text-primary border-b-2 border-primary transition-all">Summary</Link>
                <Link href="/attendance" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Attendance By Member</Link>
                <Link href="/attendance/date" className="py-4 text-[13px] font-bold text-gray-400 border-b-2 border-transparent hover:text-primary transition-all">Attendance By Date</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="white-box">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-2">Employee Name</label>
              <select className="form-control" value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)}>
                <option value="all">All Employees</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-2">Select Month</label>
              <select className="form-control" value={month} onChange={(event) => setMonth(Number(event.target.value))}>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>{new Date(0, index).toLocaleString("default", { month: "long" })}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-2">Select Year</label>
              <select className="form-control" value={year} onChange={(event) => setYear(Number(event.target.value))}>
                {[2026, 2025, 2024, 2023].map((yearOption) => (
                  <option key={yearOption} value={yearOption}>{yearOption}</option>
                ))}
              </select>
            </div>
            <div>
              <Button onClick={fetchData} className="btn-success btn-block h-[34px]">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Apply
              </Button>
            </div>
          </div>
        </div>

        <div className="flex space-x-6 px-2 mb-4">
          <div className="flex items-center space-x-2"><div className="h-4 w-4 bg-[#00c292] rounded-sm flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div><span className="text-[11px] font-bold text-gray-500 uppercase">Present</span></div>
          <div className="flex items-center space-x-2"><div className="h-4 w-4 bg-[#fec107] rounded-sm flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div><span className="text-[11px] font-bold text-gray-500 uppercase">Half Day</span></div>
          <div className="flex items-center space-x-2"><div className="h-4 w-4 bg-[#fb9678] rounded-sm flex items-center justify-center"><X className="h-2.5 w-2.5 text-white" /></div><span className="text-[11px] font-bold text-gray-500 uppercase">Absent</span></div>
          <div className="flex items-center space-x-2"><div className="h-4 w-4 bg-[#5475ed] rounded-sm flex items-center justify-center"><Star className="h-2.5 w-2.5 text-white" /></div><span className="text-[11px] font-bold text-gray-500 uppercase">Holiday</span></div>
        </div>

        <div className="white-box p-0 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className="table-responsive">
            <table className="table-bordered min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-[180px] px-4 py-3 text-[11px] font-bold uppercase sticky left-0 z-10 bg-gray-50 border-r">Employee</th>
                  {daysArray.map((day) => (
                    <th key={day} className="w-10 text-center px-1 py-3 text-[10px] font-bold border-r">{day}</th>
                  ))}
                  <th className="w-24 text-center px-4 py-3 text-[11px] font-bold uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {visibleEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[13px] font-bold border-r sticky left-0 z-10 bg-white">{employee.name}</td>
                    {daysArray.map((day) => {
                      const status = getDayStatus(employee.id, day);
                      return (
                        <td key={day} className="p-1 border-r text-center">
                          {(status === "present" || status === "late") && <div className="mx-auto h-4 w-4 bg-[#00c292] rounded-sm flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>}
                          {status === "half-day" && <div className="mx-auto h-4 w-4 bg-[#fec107] rounded-sm flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>}
                          {status === "absent" && <div className="mx-auto h-4 w-4 bg-[#fb9678] rounded-sm flex items-center justify-center"><X className="h-2.5 w-2.5 text-white" /></div>}
                          {status === "holiday" && <div className="mx-auto h-4 w-4 bg-[#5475ed] rounded-sm flex items-center justify-center"><Star className="h-2.5 w-2.5 text-white" /></div>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-bold text-success border-l">{getTotal(employee.id)} / {daysInMonth}</td>
                  </tr>
                ))}
                {!loading && visibleEmployees.length === 0 && (
                  <tr>
                    <td colSpan={daysInMonth + 2} className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">No employees found</td>
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
