export type HRRecord = Record<string, any>;

export const toDateString = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export const getEmployeeId = (record: HRRecord) =>
  String(record.employee_id || record.user_id || record.employee?.id || record.user?.id || record.id || "");

export const getAttendanceEmployeeId = (record: HRRecord) =>
  String(record.employee_id || record.user_id || record.employee?.id || "");

export const getLeaveEmployeeId = (record: HRRecord) =>
  String(record.user_id || record.employee_id || record.user?.id || record.employee?.id || "");

export const getLeaveDate = (record: HRRecord) => String(record.leave_date || record.date || "");

export const getHolidayDate = (record: HRRecord) => String(record.holiday_date || record.date || "");

export const getEmployeeDisplayId = (employee: HRRecord) =>
  String(employee.employee_detail?.employee_id || employee.employee_id || `EMP-${employee.id}`);

export const parseOfficeOpenDays = (value: unknown, fallback = [1, 2, 3, 4, 5]) => {
  if (Array.isArray(value)) return value.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6) : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const dateRange = (start: string, end: string) => {
  const days: Date[] = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (cursor <= last) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

export const leaveUnits = (leave: HRRecord) => {
  const duration = String(leave.duration || "").toLowerCase();
  return duration.includes("half") ? 0.5 : 1;
};

export const timeToMinutes = (value?: string) => {
  if (!value) return null;
  const clean = value.includes("T") ? value.slice(11, 16) : value.slice(0, 5);
  const [hours, minutes] = clean.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

export const normalizeShiftMinute = (value?: string, shift?: HRRecord) => {
  const minutes = timeToMinutes(value);
  const start = timeToMinutes(shift?.start_time);
  const end = timeToMinutes(shift?.end_time);
  if (minutes === null) return null;
  if (start !== null && end !== null && end <= start && minutes < start) return minutes + 24 * 60;
  return minutes;
};

export const attendanceStatus = (row: HRRecord, shift?: HRRecord) => {
  const explicit = String(row.status || "").toLowerCase();
  if (explicit === "absent") return "absent";
  if (row.half_day || explicit === "half-day" || explicit === "half day") return "half-day";

  const clockIn = normalizeShiftMinute(row.clock_in || row.clock_in_time, shift);
  const shiftStart = normalizeShiftMinute(shift?.start_time, shift);
  const halfDayMark = normalizeShiftMinute(shift?.half_day_mark_time || shift?.halfday_mark_time, shift);

  if (clockIn !== null && halfDayMark !== null && clockIn >= halfDayMark) return "half-day";
  if (row.late || explicit === "late") return "late";
  if (clockIn !== null && shiftStart !== null && clockIn > shiftStart + Number(shift?.late_grace_minutes || 0)) return "late";
  return explicit || "present";
};

export const minutesBetween = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const startDate = start.includes("T") ? new Date(start) : null;
  const endDate = end.includes("T") ? new Date(end) : null;
  if (startDate && endDate && !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
    return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 60000));
  }
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes === null || endMinutes === null) return 0;
  return Math.max(0, (endMinutes <= startMinutes ? endMinutes + 1440 : endMinutes) - startMinutes);
};

export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours} hrs ${remainder} mins` : `${hours} hrs`;
};
