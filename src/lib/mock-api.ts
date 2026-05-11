import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { makeDevUserFromEmail, normalizeRole, type AuthUser, type UserRole } from "./auth-contract";

type MockRecord = Record<string, unknown> & { id: number | string };

type MockStore = Record<string, MockRecord[]>;

const STORAGE_KEY = "worksuite_mock_api_store";
const NETWORK_DELAY_MS = 120;

const now = new Date("2026-05-08T09:00:00+05:00").toISOString();

const seedStore: MockStore = {
  companies: [
    {
      id: 1,
      name: "Lisam Solutions",
      company_name: "Lisam Solutions",
      email: "info@lisam.com",
      package: "Enterprise",
      package_type: "annual",
      status: "active",
      lastLogin: "2026-05-07",
      admin_name: "Company Admin",
      admin_email: "admin@lisam.com",
      created_at: now,
    },
    {
      id: 2,
      name: "Tech Prodigy",
      company_name: "Tech Prodigy",
      email: "contact@prodigy.io",
      package: "Professional",
      package_type: "monthly",
      status: "active",
      lastLogin: "2026-05-06",
      admin_name: "Ayesha Khan",
      admin_email: "admin@prodigy.io",
      created_at: now,
    },
    {
      id: 3,
      name: "Global HR",
      company_name: "Global HR",
      email: "admin@globalhr.com",
      package: "Basic",
      package_type: "monthly",
      status: "inactive",
      lastLogin: "2026-04-28",
      admin_name: "Global Admin",
      admin_email: "owner@globalhr.com",
      created_at: now,
    },
  ],
  employees: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      company_id: 1,
      employee_detail: {
        designation: { id: 1, name: "Company Admin" },
        department: { id: 1, team_name: "Administration", name: "Administration" },
        joining_date: "2023-01-15",
        shift_type_id: 1,
        shift_type: {
          id: 1,
          shift_name: "General Day Shift",
          code: "DAY",
          type: "fixed",
          start_time: "09:00",
          end_time: "18:00",
          break_minutes: 60,
          late_grace_minutes: 15,
          half_day_mark_time: "13:00",
          min_hours: 8,
        },
      },
      created_at: now,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "employee",
      status: "active",
      company_id: 1,
      employee_detail: {
        designation: { id: 2, name: "UI Designer" },
        department: { id: 2, team_name: "Design", name: "Design" },
        joining_date: "2023-03-20",
        shift_type_id: 3,
        shift_type: {
          id: 3,
          shift_name: "Flexible Remote Shift",
          code: "FLEX",
          type: "flexible",
          start_time: "10:00",
          end_time: "19:00",
          break_minutes: 60,
          late_grace_minutes: 30,
          half_day_mark_time: "14:00",
          min_hours: 8,
        },
      },
      created_at: now,
    },
    {
      id: 3,
      name: "Mike Tyson",
      email: "mike@example.com",
      role: "employee",
      status: "deactive",
      company_id: 1,
      employee_detail: {
        designation: { id: 3, name: "HR Manager" },
        department: { id: 3, team_name: "HR", name: "HR" },
        joining_date: "2022-11-01",
        shift_type_id: 1,
        shift_type: {
          id: 1,
          shift_name: "General Day Shift",
          code: "DAY",
          type: "fixed",
          start_time: "09:00",
          end_time: "18:00",
          break_minutes: 60,
          late_grace_minutes: 15,
          half_day_mark_time: "13:00",
          min_hours: 8,
        },
      },
      created_at: now,
    },
  ],
  clients: [
    {
      id: 1,
      name: "Sarah Client",
      email: "sarah@northwind.com",
      status: "active",
      company_id: 1,
      client_detail: {
        company_name: "Northwind Studio",
        mobile: "+1 555 0101",
        address: "221 Market Street",
      },
      created_at: now,
    },
    {
      id: 2,
      name: "Robert Fox",
      email: "robert@acme.test",
      status: "active",
      company_id: 1,
      client_detail: {
        company_name: "Acme Ventures",
        mobile: "+1 555 0102",
        address: "77 Business Avenue",
      },
      created_at: now,
    },
  ],
  projects: [
    {
      id: 1,
      project_name: "HR Portal Migration",
      name: "HR Portal Migration",
      status: "in progress",
      total_earnings: 2400,
      client_id: 1,
      company_id: 1,
      client: { id: 1, name: "Sarah Client", client_detail: { company_name: "Northwind Studio" } },
      members: [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Smith" }],
      deadline: "2026-06-30",
      created_at: now,
    },
    {
      id: 2,
      project_name: "Payroll Automation",
      name: "Payroll Automation",
      status: "not started",
      total_earnings: 0,
      client_id: 2,
      company_id: 1,
      client: { id: 2, name: "Robert Fox", client_detail: { company_name: "Acme Ventures" } },
      members: [{ id: 3, name: "Mike Tyson" }],
      deadline: "2026-07-15",
      created_at: now,
    },
  ],
  tasks: [
    {
      id: 1,
      heading: "Finalize dashboard permissions",
      title: "Finalize dashboard permissions",
      status: "incomplete",
      priority: "high",
      project_id: 1,
      project: { id: 1, project_name: "HR Portal Migration" },
      users: [{ id: 2, name: "Jane Smith" }],
      due_date: "2026-05-18",
      created_at: now,
    },
    {
      id: 2,
      heading: "Invoice PDF review",
      title: "Invoice PDF review",
      status: "completed",
      priority: "medium",
      project_id: 2,
      project: { id: 2, project_name: "Payroll Automation" },
      users: [{ id: 1, name: "John Doe" }],
      due_date: "2026-05-12",
      created_at: now,
    },
  ],
  tickets: [
    {
      id: 1,
      subject: "Unable to download invoice",
      status: "open",
      priority: "high",
      requester: { id: 1, name: "Sarah Client" },
      agent: { id: 1, name: "John Doe" },
      date: "2026-05-08",
      created_at: now,
    },
    {
      id: 2,
      subject: "Login loop on mobile",
      status: "pending",
      priority: "urgent",
      requester: { id: 2, name: "Robert Fox" },
      agent: { id: 1, name: "John Doe" },
      date: "2026-05-07",
      created_at: now,
    },
  ],
  invoices: [
    {
      id: 1,
      invoice_number: "INV-001",
      status: "unpaid",
      total: 2400,
      client: { id: 1, name: "Sarah Client", client_detail: { company_name: "Northwind Studio" } },
      project: { id: 1, project_name: "HR Portal Migration" },
      created_at: now,
    },
  ],
  estimates: [
    {
      id: 1,
      estimate_number: "EST-001",
      status: "sent",
      total: 5200,
      client: { id: 2, name: "Robert Fox", client_detail: { company_name: "Acme Ventures" } },
      created_at: now,
    },
  ],
  proposals: [
    {
      id: 1,
      proposal_number: "PROP-001",
      status: "open",
      total: 7800,
      client: { id: 1, name: "Sarah Client", client_detail: { company_name: "Northwind Studio" } },
      created_at: now,
    },
  ],
  "credit-notes": [
    {
      id: 1,
      credit_note_number: "CN-001",
      status: "open",
      total: 300,
      client: { id: 1, name: "Sarah Client", client_detail: { company_name: "Northwind Studio" } },
      created_at: now,
    },
  ],
  payments: [
    {
      id: 1,
      amount: 1200,
      status: "pending",
      payment_gateway: "offline",
      client: { id: 1, name: "Sarah Client" },
      created_at: now,
    },
  ],
  expenses: [
    {
      id: 1,
      item_name: "Software subscriptions",
      price: 450,
      status: "pending",
      user: { id: 2, name: "Jane Smith" },
      project: { id: 1, project_name: "HR Portal Migration" },
      created_at: now,
    },
  ],
  leaves: [
    {
      id: 1,
      leave_type: { id: 1, type_name: "Sick Leave" },
      user: { id: 2, name: "Jane Smith" },
      status: "pending",
      leave_date: "2026-05-14",
      created_at: now,
    },
  ],
  attendance: [
    {
      id: 1,
      employee_id: 1,
      user_id: 1,
      employee: { id: 1, name: "John Doe", employee_detail: { designation: { name: "Company Admin" } } },
      date: "2026-05-01",
      status: "present",
      clock_in: "09:00",
      clock_out: "18:00",
      clock_in_ip: "192.168.1.1",
      clock_out_ip: "192.168.1.1",
      working_from: "office",
      late: false,
      half_day: false,
      created_at: now,
    },
    {
      id: 2,
      employee_id: 2,
      user_id: 2,
      employee: { id: 2, name: "Jane Smith", employee_detail: { designation: { name: "UI Designer" } } },
      date: "2026-05-01",
      status: "late",
      clock_in: "09:45",
      clock_out: "18:15",
      clock_in_ip: "192.168.1.5",
      clock_out_ip: "192.168.1.5",
      working_from: "office",
      late: true,
      half_day: false,
      created_at: now,
    },
    {
      id: 3,
      employee_id: 3,
      user_id: 3,
      employee: { id: 3, name: "Mike Tyson", employee_detail: { designation: { name: "HR Manager" } } },
      date: "2026-05-01",
      status: "absent",
      clock_in: "",
      clock_out: "",
      clock_in_ip: "-",
      clock_out_ip: "-",
      working_from: "",
      late: false,
      half_day: false,
      created_at: now,
    },
    {
      id: 4,
      employee_id: 2,
      user_id: 2,
      employee: { id: 2, name: "Jane Smith", employee_detail: { designation: { name: "UI Designer" } } },
      date: "2026-05-02",
      status: "present",
      clock_in: "09:05",
      clock_out: "18:00",
      clock_in_ip: "192.168.1.5",
      clock_out_ip: "192.168.1.5",
      working_from: "office",
      late: false,
      half_day: false,
      created_at: now,
    },
  ],
  departments: [
    { id: 1, name: "Administration", team_name: "Administration" },
    { id: 2, name: "Design", team_name: "Design" },
    { id: 3, name: "HR", team_name: "HR" },
    { id: 4, name: "Engineering", team_name: "Engineering" },
  ],
  teams: [
    { id: 1, name: "Administration", team_name: "Administration" },
    { id: 2, name: "Design", team_name: "Design" },
    { id: 3, name: "HR", team_name: "HR" },
    { id: 4, name: "Engineering", team_name: "Engineering" },
  ],
  designations: [
    { id: 1, name: "Company Admin" },
    { id: 2, name: "UI Designer" },
    { id: 3, name: "HR Manager" },
    { id: 4, name: "Senior Developer" },
  ],
  currencies: [
    { id: 1, currency_name: "US Dollar", currency_symbol: "$", currency_code: "USD" },
    { id: 2, currency_name: "Pakistani Rupee", currency_symbol: "Rs", currency_code: "PKR" },
  ],
  "leave-types": [
    { id: 1, type_name: "Sick Leave", color: "#ef4444" },
    { id: 2, type_name: "Casual Leave", color: "#0ea5e9" },
  ],
  "shift-types": [
    {
      id: 1,
      shift_name: "General Day Shift",
      code: "DAY",
      type: "fixed",
      start_time: "09:00",
      end_time: "18:00",
      break_minutes: 60,
      late_grace_minutes: 15,
      early_clock_in_minutes: 30,
      half_day_mark_time: "13:00",
      min_hours: 8,
      auto_attendance: "enabled",
      status: "active",
      color: "#03a9f3",
      description: "Default office shift for weekday staff.",
      created_at: now,
    },
    {
      id: 2,
      shift_name: "Night Support Shift",
      code: "NIGHT",
      type: "night",
      start_time: "22:00",
      end_time: "06:00",
      break_minutes: 45,
      late_grace_minutes: 10,
      early_clock_in_minutes: 20,
      half_day_mark_time: "02:00",
      min_hours: 7.5,
      auto_attendance: "enabled",
      status: "active",
      color: "#6366f1",
      description: "Overnight coverage shift for support and operations.",
      created_at: now,
    },
    {
      id: 3,
      shift_name: "Flexible Remote Shift",
      code: "FLEX",
      type: "flexible",
      start_time: "10:00",
      end_time: "19:00",
      break_minutes: 60,
      late_grace_minutes: 30,
      early_clock_in_minutes: 60,
      half_day_mark_time: "14:00",
      min_hours: 8,
      auto_attendance: "manual-review",
      status: "active",
      color: "#10b981",
      description: "Flexible attendance window for remote employees.",
      created_at: now,
    },
  ],
  "task-categories": [
    { id: 1, category_name: "Development" },
    { id: 2, category_name: "Design" },
  ],
  "project-categories": [
    { id: 1, category_name: "Client Work" },
    { id: 2, category_name: "Internal" },
  ],
  "lead-sources": [
    { id: 1, type: "Website" },
    { id: 2, type: "Referral" },
  ],
  "lead-statuses": [
    { id: 1, type: "New" },
    { id: 2, type: "Qualified" },
  ],
  settings: [
    {
      id: 1,
      type: "platform_admin",
      name: "Platform Owner",
      email: "super@worksuite.test",
      role: "super_admin",
      status: "active",
      created_at: now,
    },
  ],
};

const wait = () => new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readStore = (): MockStore => {
  if (!isBrowser()) return clone(seedStore);

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seeded = clone(seedStore);
    const hydrated = hydrateStore(seeded);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    return hydrated;
  }

  try {
    const hydrated = hydrateStore({ ...clone(seedStore), ...(JSON.parse(stored) as MockStore) });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    return hydrated;
  } catch {
    const seeded = clone(seedStore);
    const hydrated = hydrateStore(seeded);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    return hydrated;
  }
};

const writeStore = (store: MockStore) => {
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
};

const jsonResponse = <T>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: T,
): AxiosResponse<T> => ({
  data,
  status,
  statusText: status >= 400 ? "Error" : "OK",
  headers: {},
  config,
});

const apiEnvelope = <T>(data: T, message = "OK") => ({
  success: true,
  data,
  message,
});

const parseRequestUrl = (config: InternalAxiosRequestConfig) => {
  const rawUrl = config.url || "";
  const base = config.baseURL || "http://localhost";
  const parsed = new URL(rawUrl, base.endsWith("/") ? base : `${base}/`);
  const segments = parsed.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const v1Index = segments.indexOf("v1");

  return {
    searchParams: parsed.searchParams,
    segments: v1Index >= 0 ? segments.slice(v1Index + 1) : segments,
  };
};

const parseBody = (data: unknown): Record<string, unknown> => {
  if (!data) return {};
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    return Object.fromEntries(data.entries());
  }
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof data === "object") return data as Record<string, unknown>;
  return {};
};

const nextId = (records: MockRecord[]) =>
  records.reduce((max, record) => Math.max(max, Number(record.id) || 0), 0) + 1;

const getResourceRecords = (store: MockStore, resource: string) => store[resource] || [];

const setResourceRecords = (store: MockStore, resource: string, records: MockRecord[]) => {
  store[resource] = records;
  writeStore(store);
};

const textIncludes = (record: MockRecord, query: string) => JSON.stringify(record).toLowerCase().includes(query);

const filterRecords = (records: MockRecord[], searchParams: URLSearchParams) => {
  const search = (searchParams.get("search") || "").toLowerCase();
  const status = searchParams.get("status");

  return records.filter((record) => {
    const searchMatch = !search || textIncludes(record, search);
    const statusMatch = !status || status === "all" || String(record.status) === status;
    return searchMatch && statusMatch;
  });
};

const makeShiftSummary = (shiftType?: MockRecord) =>
  shiftType
    ? {
        id: shiftType.id,
        shift_name: shiftType.shift_name,
        code: shiftType.code,
        type: shiftType.type,
        start_time: shiftType.start_time,
        end_time: shiftType.end_time,
        break_minutes: shiftType.break_minutes,
        late_grace_minutes: shiftType.late_grace_minutes,
        half_day_mark_time: shiftType.half_day_mark_time,
        min_hours: shiftType.min_hours,
      }
    : undefined;

const hydrateStore = (store: MockStore): MockStore => {
  const shifts = store["shift-types"] || [];

  return {
    ...store,
    employees: (store.employees || []).map((employee) => {
      const detail = (employee.employee_detail || {}) as Record<string, unknown>;
      const currentShift = (detail.shift_type || {}) as { id?: unknown };
      const shiftTypeId = detail.shift_type_id || currentShift.id;
      const shift = shifts.find((record) => String(record.id) === String(shiftTypeId));

      if (!shiftTypeId || !shift) return employee;

      return {
        ...employee,
        employee_detail: {
          ...detail,
          shift_type_id: shiftTypeId,
          shift_type: makeShiftSummary(shift),
        },
      };
    }),
  };
};

const makeEmployeePayload = (store: MockStore, payload: Record<string, unknown>, id: number): MockRecord => {
  const firstName = String(payload.name || payload.first_name || "New");
  const lastName = String(payload.last_name || "");
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const shiftTypeId = payload.shift_type_id || payload.shift_id;
  const shiftType = store["shift-types"].find((record) => String(record.id) === String(shiftTypeId));

  return {
    id,
    ...payload,
    name: fullName,
    email: String(payload.email || `employee-${id}@example.com`),
    role: normalizeRole(String(payload.role || "employee")) === "admin" ? "admin" : "employee",
    status: String(payload.status || "active"),
    employee_detail: {
      designation: { id: payload.designation_id || id, name: payload.designation || "Employee" },
      department: {
        id: payload.department_id || payload.team_id || id,
        name: payload.department || "General",
        team_name: payload.department || "General",
      },
      shift_type_id: shiftTypeId || null,
      shift_type: makeShiftSummary(shiftType) || payload.shift_type,
      joining_date: payload.joining_date || new Date().toISOString().slice(0, 10),
    },
    created_at: new Date().toISOString(),
  };
};

const makeClientPayload = (payload: Record<string, unknown>, id: number): MockRecord => {
  const detail = (payload.client_detail || {}) as Record<string, unknown>;

  return {
    id,
    ...payload,
    name: String(payload.name || `Client ${id}`),
    email: String(payload.email || `client-${id}@example.com`),
    status: String(payload.status || "active"),
    client_detail: {
      company_name: String(detail.company_name || payload.company_name || payload.name || `Client Company ${id}`),
      website: detail.website || payload.website || "",
      mobile: detail.mobile || payload.mobile || "",
      address: detail.address || payload.address || "",
    },
    created_at: new Date().toISOString(),
  };
};

const makeCompanyPayload = (payload: Record<string, unknown>, id: number): MockRecord => ({
  id,
  ...payload,
  name: String(payload.company_name || payload.name || `Company ${id}`),
  company_name: String(payload.company_name || payload.name || `Company ${id}`),
  email: String(payload.email || payload.admin_email || `company-${id}@example.com`),
  package: String(payload.package || "Trial"),
  package_type: String(payload.package_type || "monthly"),
  status: String(payload.status || "active"),
  lastLogin: new Date().toISOString().slice(0, 10),
  created_at: new Date().toISOString(),
});

const getNestedId = (value: unknown) => {
  if (!value || typeof value !== "object") return value;
  return (value as { id?: unknown }).id;
};

const makeProjectPayload = (store: MockStore, payload: Record<string, unknown>, id: number): MockRecord => {
  const clientId = getNestedId(payload.client) || payload.client_id;
  const client = store.clients.find((record) => String(record.id) === String(clientId));
  const clientDetail = (client?.client_detail || {}) as { company_name?: string };

  return {
    id,
    ...payload,
    project_name: String(payload.project_name || payload.name || `Project ${id}`),
    name: String(payload.project_name || payload.name || `Project ${id}`),
    status: String(payload.status || "not started"),
    client_id: clientId || null,
    client: client
      ? {
          id: client.id,
          name: String(client.name || clientDetail.company_name || "Client"),
          client_detail: clientDetail,
        }
      : undefined,
    members: [],
    total_earnings: Number(payload.total_earnings || 0),
    created_at: new Date().toISOString(),
  };
};

const makeTaskPayload = (store: MockStore, payload: Record<string, unknown>, id: number): MockRecord => {
  const projectId = getNestedId(payload.project) || payload.project_id;
  const project = store.projects.find((record) => String(record.id) === String(projectId));
  const taskUsers = Array.isArray(payload.task_users) ? payload.task_users : [];
  const users = taskUsers
    .map((item) => store.employees.find((employee) => String(employee.id) === String(getNestedId(item))))
    .filter(Boolean)
    .map((employee) => ({ id: employee?.id, name: employee?.name }));

  return {
    id,
    ...payload,
    heading: String(payload.heading || payload.title || `Task ${id}`),
    title: String(payload.heading || payload.title || `Task ${id}`),
    status: String(payload.status || "incomplete"),
    priority: String(payload.priority || "medium"),
    project_id: projectId || null,
    project: project ? { id: project.id, project_name: project.project_name || project.name } : undefined,
    users,
    created_at: new Date().toISOString(),
  };
};

const makeTicketPayload = (store: MockStore, payload: Record<string, unknown>, id: number): MockRecord => {
  const requesterId = getNestedId(payload.requester) || payload.requester_id;
  const requester = [...store.employees, ...store.clients].find((record) => String(record.id) === String(requesterId));

  return {
    id,
    ...payload,
    subject: String(payload.subject || `Ticket ${id}`),
    status: String(payload.status || "open"),
    priority: String(payload.priority || "medium"),
    requester: requester ? { id: requester.id, name: requester.name } : payload.requester,
    agent: payload.agent || { id: 1, name: "John Doe" },
    date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  };
};

const makeAttendancePayload = (store: MockStore, payload: Record<string, unknown>, id: number): MockRecord => {
  const employeeId = payload.employee_id || payload.user_id;
  const employee = store.employees.find((record) => String(record.id) === String(employeeId));
  const employeeDetail = (employee?.employee_detail || {}) as Record<string, unknown>;
  const shiftTypeId = payload.shift_type_id || employeeDetail.shift_type_id;
  const shiftType = store["shift-types"].find((record) => String(record.id) === String(shiftTypeId));
  const late = Boolean(payload.late || payload.is_late);
  const halfDay = Boolean(payload.half_day || payload.is_half_day);
  const status = String(payload.status || (late ? "late" : halfDay ? "half-day" : "present"));

  return {
    id,
    ...payload,
    employee_id: employeeId || null,
    user_id: employeeId || null,
    employee: employee
      ? {
          id: employee.id,
          name: employee.name,
          employee_detail: employeeDetail,
        }
      : payload.employee,
    shift_type_id: shiftTypeId || null,
    shift_type: shiftType
      ? makeShiftSummary(shiftType)
      : payload.shift_type,
    date: String(payload.date || new Date().toISOString().slice(0, 10)),
    status,
    clock_in: String(payload.clock_in || "09:00"),
    clock_out: String(payload.clock_out || "18:00"),
    clock_in_ip: String(payload.clock_in_ip || "192.168.1.1"),
    clock_out_ip: String(payload.clock_out_ip || "192.168.1.1"),
    working_from: String(payload.working_from || "office"),
    late,
    half_day: halfDay,
    created_at: new Date().toISOString(),
  };
};

const makeFinancePayload = (store: MockStore, resource: string, payload: Record<string, unknown>, id: number): MockRecord => {
  const clientId = getNestedId(payload.client) || payload.client_id;
  const projectId = getNestedId(payload.project) || payload.project_id;
  const client = store.clients.find((record) => String(record.id) === String(clientId));
  const project = store.projects.find((record) => String(record.id) === String(projectId));
  const prefixMap: Record<string, string> = {
    invoices: "INV",
    estimates: "EST",
    proposals: "PROP",
    payments: "PAY",
    expenses: "EXP",
  };
  const numberKeyMap: Record<string, string> = {
    invoices: "invoice_number",
    estimates: "estimate_number",
    proposals: "proposal_number",
  };
  const numberKey = numberKeyMap[resource];

  return {
    id,
    ...payload,
    ...(numberKey ? { [numberKey]: payload[numberKey] || `${prefixMap[resource]}-${String(id).padStart(3, "0")}` } : {}),
    amount: Number(payload.amount || payload.total || payload.price || 0),
    total: Number(payload.total || payload.amount || payload.price || 0),
    price: Number(payload.price || payload.amount || payload.total || 0),
    status: String(payload.status || (resource === "payments" ? "pending" : "draft")),
    client: client ? { id: client.id, name: client.name, client_detail: client.client_detail || {} } : payload.client,
    project: project ? { id: project.id, project_name: project.project_name || project.name } : payload.project,
    user: payload.user || store.employees.find((record) => String(record.id) === String(getNestedId(payload.user) || payload.user_id)),
    issue_date: payload.issue_date || new Date().toISOString().slice(0, 10),
    date: payload.date || payload.payment_date || payload.purchase_date || new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  };
};

const makeLeavePayload = (store: MockStore, payload: Record<string, unknown>, id: number): MockRecord => {
  const userId = getNestedId(payload.user) || payload.user_id;
  const typeId = getNestedId(payload.type) || payload.type_id;
  const user = store.employees.find((record) => String(record.id) === String(userId));
  const leaveType = store["leave-types"].find((record) => String(record.id) === String(typeId));

  return {
    id,
    ...payload,
    user_id: userId || null,
    type_id: typeId || null,
    user: user ? { id: user.id, name: user.name } : payload.user,
    employee: user ? { id: user.id, name: user.name, avatar: null } : payload.employee,
    leave_type: leaveType || payload.leave_type || payload.type,
    type: leaveType?.type_name || payload.type || "Leave",
    date: payload.leave_date || payload.date || new Date().toISOString().slice(0, 10),
    leave_date: payload.leave_date || payload.date || new Date().toISOString().slice(0, 10),
    status: String(payload.status || "pending"),
    reason: String(payload.reason || ""),
    created_at: new Date().toISOString(),
  };
};

const makeGenericPayload = (store: MockStore, resource: string, payload: Record<string, unknown>, id: number): MockRecord => {
  if (resource === "clients") return makeClientPayload(payload, id);
  if (resource === "employees") return makeEmployeePayload(store, payload, id);
  if (resource === "companies") return makeCompanyPayload(payload, id);
  if (resource === "projects") return makeProjectPayload(store, payload, id);
  if (resource === "tasks") return makeTaskPayload(store, payload, id);
  if (resource === "tickets") return makeTicketPayload(store, payload, id);
  if (resource === "attendance") return makeAttendancePayload(store, payload, id);
  if (resource === "leaves") return makeLeavePayload(store, payload, id);
  if (["invoices", "estimates", "proposals", "payments", "expenses"].includes(resource)) {
    return makeFinancePayload(store, resource, payload, id);
  }

  return {
    id,
    ...payload,
    status: payload.status || "active",
    created_at: new Date().toISOString(),
  };
};

const login = (payload: Record<string, unknown>) => {
  const email = String(payload.email || "admin@company.com");
  const user = makeDevUserFromEmail(email);
  const token = `mock_${user.role}_${Date.now()}`;

  return apiEnvelope<{ token: string; user: AuthUser }>({ token, user }, "Login successful");
};

const loginAsCompany = (company: MockRecord) => {
  const companyName = String(company.company_name || company.name || "Company");
  const user: AuthUser = {
    id: `company-admin-${company.id}`,
    name: `${companyName} Admin`,
    email: String(company.admin_email || company.email || `admin-${company.id}@company.test`),
    role: "admin",
    company_id: company.id,
    impersonator_role: "super_admin",
    permissions: ["admin.*"],
    modules: ["hr", "work", "finance", "tickets", "messages", "settings"],
  };

  return apiEnvelope<{ token: string; user: AuthUser }>({
    token: `mock_impersonated_admin_${company.id}_${Date.now()}`,
    user,
  }, "Company login successful");
};

const updateRecordForAction = (record: MockRecord, action: string, payload: Record<string, unknown>) => {
  if (action === "approve") return { ...record, status: "approved", approved_at: new Date().toISOString(), ...payload };
  if (action === "reject") return { ...record, status: "rejected", rejected_at: new Date().toISOString(), ...payload };
  if (action === "send") return { ...record, status: "sent", sent_at: new Date().toISOString() };
  if (action === "mark-paid") return { ...record, status: "paid", paid_at: new Date().toISOString(), ...payload };
  if (action === "archive") return { ...record, status: "archived" };

  return {
    ...record,
    last_action: action,
    last_action_payload: payload,
    updated_at: new Date().toISOString(),
  };
};

const requireRole = (config: InternalAxiosRequestConfig, role: UserRole) => {
  const token = String(config.headers.Authorization || "");
  return token.includes(role) || !token;
};

export const isMockApiEnabled = () => process.env.NEXT_PUBLIC_API_MODE !== "live";

export const mockApiAdapter: AxiosAdapter = async (config) => {
  await wait();

  const method = (config.method || "get").toLowerCase();
  const { segments, searchParams } = parseRequestUrl(config);
  const [resource, id, action] = segments;
  const payload = parseBody(config.data);
  const store = readStore();

  if (resource === "auth" && id === "login" && method === "post") {
    return jsonResponse(config, 200, login(payload));
  }

  if (!resource) {
    return jsonResponse(config, 200, apiEnvelope({ status: "ok", mock: true }));
  }

  if (resource === "dashboard" || resource === "reports") {
    return jsonResponse(
      config,
      200,
      apiEnvelope({
        totals: {
          companies: store.companies.length,
          employees: store.employees.length,
          clients: store.clients.length,
          projects: store.projects.length,
          tasks: store.tasks.length,
          invoices: store.invoices.length,
        },
        generated_at: new Date().toISOString(),
      }),
    );
  }

  if (resource === "settings" && method === "post" && payload.type === "platform_admin") {
    if (!requireRole(config, "super_admin")) {
      return jsonResponse(config, 403, { success: false, message: "Only super admins can create platform admins." });
    }
  }

  const records = getResourceRecords(store, resource);

  if (resource === "companies" && method === "post" && id && action === "login") {
    if (!requireRole(config, "super_admin")) {
      return jsonResponse(config, 403, { success: false, message: "Only super admins can login as a company." });
    }
    const company = records.find((item) => String(item.id) === id);
    return jsonResponse(config, company ? 200 : 404, company ? loginAsCompany(company) : { success: false, message: "Company not found" });
  }

  if (method === "get" && !id) {
    const filtered = filterRecords(records, searchParams);
    return jsonResponse(config, 200, {
      ...apiEnvelope(filtered),
      meta: {
        current_page: Number(searchParams.get("page") || 1),
        last_page: 1,
        per_page: filtered.length,
        total: filtered.length,
      },
    });
  }

  if (method === "get" && id) {
    const record = records.find((item) => String(item.id) === id);
    return jsonResponse(config, record ? 200 : 404, record ? apiEnvelope(record) : { success: false, message: "Record not found" });
  }

  if (method === "post" && !id) {
    const created = makeGenericPayload(store, resource, payload, nextId(records));
    setResourceRecords(store, resource, [created, ...records]);
    return jsonResponse(config, 201, apiEnvelope(created, "Created successfully"));
  }

  if ((method === "put" || method === "patch") && id) {
    const updatedRecords = records.map((record) =>
      String(record.id) === id ? { ...record, ...payload, updated_at: new Date().toISOString() } : record,
    );
    setResourceRecords(store, resource, updatedRecords);
    const updated = updatedRecords.find((record) => String(record.id) === id);
    return jsonResponse(config, updated ? 200 : 404, updated ? apiEnvelope(updated, "Updated successfully") : { success: false, message: "Record not found" });
  }

  if (method === "delete" && id) {
    const updatedRecords = records.filter((record) => String(record.id) !== id);
    setResourceRecords(store, resource, updatedRecords);
    return jsonResponse(config, 200, apiEnvelope({ id }, "Deleted successfully"));
  }

  if (method === "post" && id && action) {
    const updatedRecords = records.map((record) =>
      String(record.id) === id ? updateRecordForAction(record, action, payload) : record,
    );
    setResourceRecords(store, resource, updatedRecords);
    const updated = updatedRecords.find((record) => String(record.id) === id);
    return jsonResponse(config, 200, apiEnvelope(updated || { id, action }, "Action completed"));
  }

  return jsonResponse(config, 200, apiEnvelope(method === "get" ? [] : { ok: true }, "Mock endpoint handled"));
};
