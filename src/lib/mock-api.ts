import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getModulesFromPermissions, makeDevUserFromEmail, normalizeRole, rolePermissions, type AuthUser, type PermissionKey, type UserRole } from "./auth-contract";
import {
  buildSalarySlip,
  canGeneratePayrollForEmployee,
  employeeIdOf,
  getEmployeeMonthlySalary,
  getMonthRange,
  monthName,
  roundMoney,
  toNumber,
  type PayrollGenerationOptions,
  type PayrollRecord,
  type PayrollStatus,
} from "./payroll-utils";

type MockRecord = Record<string, unknown> & { id: number | string };

type MockStore = Record<string, MockRecord[]>;

const STORAGE_KEY = "worksuite_mock_api_store";
const NETWORK_DELAY_MS = 120;

const now = new Date("2026-05-08T09:00:00+05:00").toISOString();
const mockChatImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='420' viewBox='0 0 720 420'%3E%3Crect width='720' height='420' rx='36' fill='%2303a9f3'/%3E%3Ccircle cx='594' cy='94' r='92' fill='%23ffffff' fill-opacity='.22'/%3E%3Cpath d='M92 296c94-112 162-126 252-40 54 52 118 64 196 14 38-24 66-26 88-4v82H92z' fill='%23ffffff' fill-opacity='.28'/%3E%3Crect x='84' y='72' width='282' height='42' rx='21' fill='%23ffffff' fill-opacity='.9'/%3E%3Crect x='84' y='138' width='430' height='26' rx='13' fill='%23ffffff' fill-opacity='.62'/%3E%3Crect x='84' y='184' width='338' height='26' rx='13' fill='%23ffffff' fill-opacity='.42'/%3E%3C/svg%3E";

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
  "attendance-devices": [
    { id: 1, name: "Front Gate (MB460)", serial_number: "ZK-MB460-9901", ip_address: "192.168.1.50", status: "online", last_sync_at: now, location: "Main Entrance" },
    { id: 2, name: "Production Floor", serial_number: "ZK-F22-8822", ip_address: "192.168.1.55", status: "offline", last_sync_at: new Date(Date.now() - 86400000).toISOString(), location: "Sector B" }
  ],
  admins: [
    {
      id: 1,
      name: "Company Admin",
      email: "admin@lisam.com",
      role: "admin",
      company_id: 1,
      company: { id: 1, name: "Lisam Solutions", company_name: "Lisam Solutions" },
      status: "active",
      permissions: rolePermissions.admin,
      modules: getModulesFromPermissions(rolePermissions.admin),
      last_login_at: "2026-05-07T09:30:00+05:00",
      created_at: now,
    },
    {
      id: 2,
      name: "HR Admin",
      email: "hr.admin@lisam.com",
      role: "admin",
      company_id: 1,
      company: { id: 1, name: "Lisam Solutions", company_name: "Lisam Solutions" },
      status: "active",
      permissions: [
        "dashboard.view",
        "employees.*",
        "hr.*",
        "shifts.*",
        "attendance.*",
        "leaves.*",
        "recruitment.*",
        "reports.view",
        "reports.export",
        "events.view",
        "notices.view",
        "profile.*",
      ],
      modules: ["dashboard", "employees", "hr", "shifts", "attendance", "leaves", "recruitment", "reports", "events", "notices"],
      last_login_at: "2026-05-06T15:15:00+05:00",
      created_at: now,
    },
    {
      id: 3,
      name: "Project Admin",
      email: "project.admin@prodigy.io",
      role: "admin",
      company_id: 2,
      company: { id: 2, name: "Tech Prodigy", company_name: "Tech Prodigy" },
      status: "active",
      permissions: [
        "dashboard.view",
        "clients.view",
        "projects.*",
        "tasks.*",
        "tickets.*",
        "reports.view",
        "messages.*",
        "events.view",
        "profile.*",
      ],
      modules: ["dashboard", "clients", "projects", "tasks", "tickets", "reports", "messages", "events"],
      last_login_at: "2026-05-05T11:10:00+05:00",
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
  "chat-conversations": [
    {
      id: "direct-employee-2",
      type: "direct",
      name: "Jane Smith",
      participant_keys: ["admin:1", "employee:2"],
      participants: [
        { key: "admin:1", id: 1, type: "admin", name: "Company Admin", role: "Admin", avatar: "" },
        { key: "employee:2", id: 2, type: "employee", name: "Jane Smith", role: "UI Designer", avatar: "" },
      ],
      last_message: "Sent the final assets.",
      last_message_at: "2026-05-08T10:18:00+05:00",
      unread_by: ["admin:1"],
      muted_by: [],
      archived_by: [],
      created_at: now,
    },
    {
      id: "direct-client-1",
      type: "direct",
      name: "Sarah Client",
      participant_keys: ["admin:1", "client:1"],
      participants: [
        { key: "admin:1", id: 1, type: "admin", name: "Company Admin", role: "Admin", avatar: "" },
        { key: "client:1", id: 1, type: "client", name: "Sarah Client", role: "Northwind Studio", avatar: "" },
      ],
      last_message: "The payment proof has been uploaded.",
      last_message_at: "2026-05-08T09:40:00+05:00",
      unread_by: [],
      muted_by: [],
      archived_by: [],
      created_at: now,
    },
    {
      id: "group-frontend",
      type: "group",
      name: "Frontend Delivery",
      description: "Frontend delivery room for HRMS releases.",
      avatar: mockChatImage,
      participant_keys: ["admin:1", "employee:2", "client:1"],
      admin_keys: ["admin:1"],
      created_by: "admin:1",
      participants: [
        { key: "admin:1", id: 1, type: "admin", name: "Company Admin", role: "Admin", avatar: "" },
        { key: "employee:2", id: 2, type: "employee", name: "Jane Smith", role: "UI Designer", avatar: "" },
        { key: "client:1", id: 1, type: "client", name: "Sarah Client", role: "Client", avatar: "" },
      ],
      settings: {
        only_admins_can_send: false,
        only_admins_can_edit_info: true,
        allow_member_uploads: true,
        disappearing_messages_days: 0,
      },
      last_message: "Please review the attached UI reference.",
      last_message_at: "2026-05-08T11:05:00+05:00",
      unread_by: [],
      muted_by: [],
      archived_by: [],
      pinned_message_id: "msg-group-2",
      created_at: now,
    },
  ],
  "chat-messages": [
    {
      id: "msg-1",
      conversation_id: "direct-employee-2",
      sender_key: "admin:1",
      sender_name: "Company Admin",
      body: "Hey Jane, how is the dashboard polish going?",
      attachments: [],
      status_by: { "admin:1": "seen", "employee:2": "seen" },
      reactions: [],
      created_at: "2026-05-08T10:00:00+05:00",
    },
    {
      id: "msg-2",
      conversation_id: "direct-employee-2",
      sender_key: "employee:2",
      sender_name: "Jane Smith",
      body: "Almost done. I am checking spacing and mobile states now.",
      attachments: [],
      status_by: { "admin:1": "seen", "employee:2": "seen" },
      reactions: [{ key: "like", count: 1, user_keys: ["admin:1"] }],
      created_at: "2026-05-08T10:06:00+05:00",
    },
    {
      id: "msg-client-1",
      conversation_id: "direct-client-1",
      sender_key: "client:1",
      sender_name: "Sarah Client",
      body: "The payment proof has been uploaded.",
      attachments: [
        { id: "att-client-1", name: "payment-proof-preview.png", type: "image", url: mockChatImage, size_label: "148 KB" },
      ],
      status_by: { "admin:1": "delivered", "client:1": "seen" },
      reactions: [],
      created_at: "2026-05-08T09:40:00+05:00",
    },
    {
      id: "msg-group-1",
      conversation_id: "group-frontend",
      sender_key: "admin:1",
      sender_name: "Company Admin",
      body: "Welcome to the release group. Only admins can create groups, but assigned group admins can manage members.",
      attachments: [],
      status_by: { "admin:1": "seen", "employee:2": "seen", "client:1": "delivered" },
      reactions: [],
      created_at: "2026-05-08T11:00:00+05:00",
    },
    {
      id: "msg-group-2",
      conversation_id: "group-frontend",
      sender_key: "admin:1",
      sender_name: "Company Admin",
      body: "Please review the attached UI reference.",
      attachments: [
        { id: "att-group-1", name: "login-gradient-reference.png", type: "image", url: mockChatImage, size_label: "210 KB" },
      ],
      status_by: { "admin:1": "seen", "employee:2": "delivered", "client:1": "delivered" },
      reactions: [{ key: "heart", count: 1, user_keys: ["employee:2"] }],
      created_at: "2026-05-08T11:05:00+05:00",
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
    {
      id: 3,
      heading: "Prepare monthly leave audit",
      title: "Prepare monthly leave audit",
      status: "completed",
      priority: "medium",
      project_id: 1,
      project: { id: 1, project_name: "HR Portal Migration" },
      users: [{ id: 3, name: "Mike Tyson" }],
      due_date: "2026-05-09",
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
      amount: 450,
      status: "approved",
      can_claim: "yes",
      user_id: 2,
      employee_id: 2,
      user: { id: 2, name: "Jane Smith" },
      project: { id: 1, project_name: "HR Portal Migration" },
      purchase_date: "2026-05-07",
      created_at: now,
    },
  ],
  leaves: [
    {
      id: 1,
      leave_type_id: 1,
      leave_type: { id: 1, type_name: "Sick Leave", color: "#ef4444", no_of_leaves: 8 },
      type: { id: 1, type_name: "Sick Leave", color: "#ef4444" },
      user: { id: 2, name: "Jane Smith" },
      employee: { id: 2, name: "Jane Smith" },
      user_id: 2,
      employee_id: 2,
      status: "pending",
      leave_date: "2026-05-14",
      reason: "Medical appointment",
      duration: "single",
      created_at: now,
    },
    {
      id: 2,
      leave_type_id: 2,
      leave_type: { id: 2, type_name: "Casual Leave", color: "#0ea5e9", no_of_leaves: 10 },
      type: { id: 2, type_name: "Casual Leave", color: "#0ea5e9" },
      user: { id: 1, name: "John Doe" },
      employee: { id: 1, name: "John Doe" },
      user_id: 1,
      employee_id: 1,
      status: "approved",
      leave_date: "2026-05-06",
      reason: "Family work",
      duration: "single",
      created_at: now,
    },
    {
      id: 3,
      leave_type_id: 1,
      leave_type: { id: 1, type_name: "Sick Leave", color: "#ef4444", no_of_leaves: 8 },
      type: { id: 1, type_name: "Sick Leave", color: "#ef4444" },
      user: { id: 3, name: "Mike Tyson" },
      employee: { id: 3, name: "Mike Tyson" },
      user_id: 3,
      employee_id: 3,
      status: "approved",
      leave_date: "2026-05-02",
      reason: "Sick leave",
      duration: "half day",
      created_at: now,
    },
  ],
  holidays: [
    { id: 1, date: "2026-05-01", holiday_date: "2026-05-01", occassion: "Labour Day", name: "Labour Day", created_at: now },
    { id: 2, date: "2026-05-25", holiday_date: "2026-05-25", occassion: "Company Holiday", name: "Company Holiday", created_at: now },
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
  "attendance-settings": [
    {
      id: 1,
      office_start_time: "09:00",
      office_end_time: "18:00",
      halfday_mark_time: "13:00",
      late_mark_duration: 15,
      clockin_in_day: 1,
      employee_clock_in_out: "yes",
      office_open_days: [1, 2, 3, 4, 5],
      radius_check: "no",
      radius: 100,
      ip_check: "no",
      ip_address: [],
      alert_after_status: 1,
      alert_after: 30,
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
    { id: 1, type_name: "Sick Leave", color: "#ef4444", no_of_leaves: 8, leave_number: 8, paid: 1 },
    { id: 2, type_name: "Casual Leave", color: "#0ea5e9", no_of_leaves: 10, leave_number: 10, paid: 1 },
    { id: 3, type_name: "Unpaid Leave", color: "#64748b", no_of_leaves: 4, leave_number: 4, paid: 0 },
  ],
  "leave-quotas": [
    { id: 1, user_id: 1, employee_id: 1, leave_type_id: 1, no_of_leaves: 8 },
    { id: 2, user_id: 1, employee_id: 1, leave_type_id: 2, no_of_leaves: 10 },
    { id: 3, user_id: 2, employee_id: 2, leave_type_id: 1, no_of_leaves: 8 },
    { id: 4, user_id: 2, employee_id: 2, leave_type_id: 2, no_of_leaves: 10 },
    { id: 5, user_id: 3, employee_id: 3, leave_type_id: 1, no_of_leaves: 8 },
    { id: 6, user_id: 3, employee_id: 3, leave_type_id: 2, no_of_leaves: 10 },
  ],
  "time-logs": [
    {
      id: 1,
      user_id: 1,
      employee_id: 1,
      project_id: 1,
      project: { id: 1, project_name: "HR Portal Migration" },
      project_name: "HR Portal Migration",
      start_time: "2026-05-07T09:00:00+05:00",
      end_time: "2026-05-07T17:30:00+05:00",
      total_minutes: 450,
      total_hours: 7.5,
      memo: "Dashboard permissions review",
      created_at: now,
    },
    {
      id: 2,
      user_id: 2,
      employee_id: 2,
      project_id: 1,
      project: { id: 1, project_name: "HR Portal Migration" },
      project_name: "HR Portal Migration",
      start_time: "2026-05-08T10:00:00+05:00",
      end_time: "2026-05-08T18:00:00+05:00",
      total_minutes: 420,
      total_hours: 7,
      memo: "UI polish",
      created_at: now,
    },
    {
      id: 3,
      user_id: 3,
      employee_id: 3,
      project_id: 2,
      project: { id: 2, project_name: "Payroll Automation" },
      project_name: "Payroll Automation",
      start_time: "2026-05-06T09:15:00+05:00",
      end_time: "2026-05-06T17:15:00+05:00",
      total_minutes: 405,
      total_hours: 6.75,
      memo: "Payroll report QA",
      created_at: now,
    },
  ],
  "payroll-cycles": [
    { id: 1, cycle: "monthly", name: "Monthly", duration: "calendar_month", status: "active" },
    { id: 2, cycle: "weekly", name: "Weekly", duration: "7_days", status: "active" },
    { id: 3, cycle: "biweekly", name: "Biweekly", duration: "14_days", status: "active" },
    { id: 4, cycle: "semimonthly", name: "Semimonthly", duration: "twice_monthly", status: "active" },
  ],
  "salary-components": [
    {
      id: 1,
      component_name: "House Rent Allowance",
      component_type: "earning",
      type: "earning",
      value_type: "percent",
      component_value: 20,
      weekly_value: 20,
      biweekly_value: 20,
      semimonthly_value: 20,
      status: "active",
      created_at: now,
    },
    {
      id: 2,
      component_name: "Transport Allowance",
      component_type: "earning",
      type: "earning",
      value_type: "fixed",
      component_value: 300,
      weekly_value: 75,
      biweekly_value: 150,
      semimonthly_value: 150,
      status: "active",
      created_at: now,
    },
    {
      id: 3,
      component_name: "Medical Allowance",
      component_type: "earning",
      type: "earning",
      value_type: "fixed",
      component_value: 200,
      weekly_value: 50,
      biweekly_value: 100,
      semimonthly_value: 100,
      status: "active",
      created_at: now,
    },
    {
      id: 4,
      component_name: "Provident Fund",
      component_type: "deduction",
      type: "deduction",
      value_type: "percent",
      component_value: 5,
      weekly_value: 5,
      biweekly_value: 5,
      semimonthly_value: 5,
      status: "active",
      created_at: now,
    },
    {
      id: 5,
      component_name: "Professional Tax",
      component_type: "deduction",
      type: "deduction",
      value_type: "fixed",
      component_value: 100,
      weekly_value: 25,
      biweekly_value: 50,
      semimonthly_value: 50,
      status: "active",
      created_at: now,
    },
  ],
  "salary-groups": [
    {
      id: 1,
      group_name: "Administration Payroll",
      description: "Default salary structure for HR and administration employees.",
      components: [1, 2, 3, 4, 5],
      component_ids: [1, 2, 3, 4, 5],
      status: "active",
      created_at: now,
    },
    {
      id: 2,
      group_name: "Creative Team Payroll",
      description: "Salary structure for design and project delivery employees.",
      components: [1, 2, 4],
      component_ids: [1, 2, 4],
      status: "active",
      created_at: now,
    },
  ],
  "employee-salaries": [
    { id: 1, user_id: 1, employee_id: 1, amount: 6500, type: "initial", date: "2023-01-15", allow_generate_payroll: "yes", created_at: now },
    { id: 2, user_id: 2, employee_id: 2, amount: 5200, type: "initial", date: "2023-03-20", allow_generate_payroll: "yes", created_at: now },
    { id: 3, user_id: 2, employee_id: 2, amount: 350, type: "increment", date: "2026-01-01", allow_generate_payroll: "yes", created_at: now },
    { id: 4, user_id: 3, employee_id: 3, amount: 4700, type: "initial", date: "2022-11-01", allow_generate_payroll: "yes", created_at: now },
  ],
  "employee-salary-groups": [
    { id: 1, user_id: 1, employee_id: 1, salary_group_id: 1, created_at: now },
    { id: 2, user_id: 2, employee_id: 2, salary_group_id: 2, created_at: now },
    { id: 3, user_id: 3, employee_id: 3, salary_group_id: 1, created_at: now },
  ],
  "employee-payroll-cycles": [
    { id: 1, user_id: 1, employee_id: 1, payroll_cycle_id: 1, created_at: now },
    { id: 2, user_id: 2, employee_id: 2, payroll_cycle_id: 1, created_at: now },
    { id: 3, user_id: 3, employee_id: 3, payroll_cycle_id: 1, created_at: now },
  ],
  "salary-tds": [
    { id: 1, salary_from: 0, salary_to: 60000, salary_percent: 0, created_at: now },
    { id: 2, salary_from: 60001, salary_to: 100000, salary_percent: 4, created_at: now },
    { id: 3, salary_from: 100001, salary_to: 250000, salary_percent: 7.5, created_at: now },
  ],
  "salary-payment-methods": [
    { id: 1, payment_method: "Bank Transfer", is_default: true, status: "active", created_at: now },
    { id: 2, payment_method: "Cash", is_default: false, status: "active", created_at: now },
    { id: 3, payment_method: "Cheque", is_default: false, status: "active", created_at: now },
  ],
  "payroll-settings": [
    {
      id: 1,
      tds_status: "yes",
      finance_month: "04",
      tds_salary: 60000,
      extra_fields: [
        { label: "Employee Code", key: "employee_code", enabled: true },
        { label: "Department", key: "department", enabled: true },
      ],
      created_at: now,
    },
  ],
  payroll: [
    {
      id: 1,
      user_id: 1,
      employee_id: 1,
      employee: { id: 1, name: "John Doe", employee_detail: { designation: { name: "Company Admin" }, department: { name: "Administration" } } },
      user: { id: 1, name: "John Doe" },
      salary_group_id: 1,
      payroll_cycle_id: 1,
      basic_salary: 6500,
      monthly_salary: 6500,
      gross_salary: 8200,
      total_deductions: 425,
      net_salary: 7775,
      month: 4,
      month_name: "April",
      year: 2026,
      salary_from: "2026-04-01",
      salary_to: "2026-04-30",
      pay_days: 30,
      working_days: 30,
      present_days: 30,
      leave_days: 0,
      absent_days: 0,
      holiday_days: 0,
      expense_claims: 0,
      timelog_earnings: 0,
      tds: 0,
      status: "paid",
      paid_on: "2026-05-05",
      salary_payment_method_id: 1,
      salary_json: {
        earnings: [
          { id: 1, title: "House Rent Allowance", type: "earning", value_type: "percent", amount: 1300 },
          { id: 2, title: "Transport Allowance", type: "earning", value_type: "fixed", amount: 300 },
          { id: 3, title: "Medical Allowance", type: "earning", value_type: "fixed", amount: 200 },
        ],
        deductions: [
          { id: 4, title: "Provident Fund", type: "deduction", value_type: "percent", amount: 325 },
          { id: 5, title: "Professional Tax", type: "deduction", value_type: "fixed", amount: 100 },
        ],
        attendance_summary: { total_days: 30, working_days: 30, present_days: 30, leave_days: 0, absent_days: 0, holiday_days: 0, pay_days: 30 },
      },
      created_at: now,
    },
    {
      id: 2,
      user_id: 2,
      employee_id: 2,
      employee: { id: 2, name: "Jane Smith", employee_detail: { designation: { name: "UI Designer" }, department: { name: "Design" } } },
      user: { id: 2, name: "Jane Smith" },
      salary_group_id: 2,
      payroll_cycle_id: 1,
      basic_salary: 5550,
      monthly_salary: 5550,
      gross_salary: 6960,
      total_deductions: 278,
      net_salary: 6682,
      month: 4,
      month_name: "April",
      year: 2026,
      salary_from: "2026-04-01",
      salary_to: "2026-04-30",
      pay_days: 30,
      working_days: 30,
      present_days: 30,
      leave_days: 0,
      absent_days: 0,
      holiday_days: 0,
      expense_claims: 0,
      timelog_earnings: 0,
      tds: 0,
      status: "review",
      salary_json: {
        earnings: [
          { id: 1, title: "House Rent Allowance", type: "earning", value_type: "percent", amount: 1110 },
          { id: 2, title: "Transport Allowance", type: "earning", value_type: "fixed", amount: 300 },
        ],
        deductions: [
          { id: 4, title: "Provident Fund", type: "deduction", value_type: "percent", amount: 278 },
        ],
        attendance_summary: { total_days: 30, working_days: 30, present_days: 30, leave_days: 0, absent_days: 0, holiday_days: 0, pay_days: 30 },
      },
      created_at: now,
    },
  ],
  "employee-docs": [
    { id: 1, user_id: 1, employee_id: 1, name: "Joining Letter.pdf", file_url: "#", size: "850 KB", created_at: "2026-04-02T09:00:00+05:00" },
    { id: 2, user_id: 2, employee_id: 2, name: "ID Proof.pdf", file_url: "#", size: "1.2 MB", created_at: "2026-04-10T09:00:00+05:00" },
    { id: 3, user_id: 3, employee_id: 3, name: "Contract.pdf", file_url: "#", size: "980 KB", created_at: "2026-04-12T09:00:00+05:00" },
  ],
  "user-activities": [
    { id: 1, user_id: 1, employee_id: 1, activity: "Updated attendance settings", created_at: "2026-05-08T09:30:00+05:00" },
    { id: 2, user_id: 2, employee_id: 2, activity: "Applied for sick leave", created_at: "2026-05-08T11:20:00+05:00" },
    { id: 3, user_id: 3, employee_id: 3, activity: "Completed monthly leave audit task", created_at: "2026-05-07T16:40:00+05:00" },
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
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const cycle = searchParams.get("cycle") || searchParams.get("payroll_cycle_id");
  const employeeId = searchParams.get("employee_id") || searchParams.get("user_id");
  const departmentId = searchParams.get("department_id");
  const designationId = searchParams.get("designation_id");

  return records.filter((record) => {
    const searchMatch = !search || textIncludes(record, search);
    const statusMatch = !status || status === "all" || String(record.status) === status;
    const monthMatch = !month || String(record.month) === month;
    const yearMatch = !year || String(record.year) === year;
    const cycleMatch = !cycle || String(record.payroll_cycle_id || record.cycle_id || record.cycle) === cycle;
    const employeeMatch = !employeeId || String(record.employee_id || record.user_id || getNestedId(record.employee) || getNestedId(record.user)) === employeeId;
    const employee = getNestedObject(record.employee) || getNestedObject(record.user);
    const detail = getNestedObject(employee?.employee_detail);
    const department = getNestedObject(detail?.department);
    const designation = getNestedObject(detail?.designation);
    const departmentMatch = !departmentId || String(detail?.department_id || department?.id || record.department_id) === departmentId;
    const designationMatch = !designationId || String(detail?.designation_id || designation?.id || record.designation_id) === designationId;
    return searchMatch && statusMatch && monthMatch && yearMatch && cycleMatch && employeeMatch && departmentMatch && designationMatch;
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

const getNestedObject = (value: unknown) => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

const makeEmployeePayload = (store: MockStore, payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const existingDetail = getNestedObject(existing?.employee_detail);
  const detailPayload = getNestedObject(payload.employee_detail);
  const existingDesignation = getNestedObject(existingDetail.designation);
  const existingDepartment = getNestedObject(existingDetail.department);
  const firstName = String(payload.name || payload.first_name || existing?.name || "New");
  const lastName = String(payload.last_name || "");
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const designationId = detailPayload.designation_id || payload.designation_id || payload.designation || existingDesignation.id || existingDetail.designation_id || id;
  const departmentId = detailPayload.department_id || payload.department_id || payload.team_id || payload.department || existingDepartment.id || existingDetail.department_id || id;
  const designationRecord = store.designations.find((record) => String(record.id) === String(designationId));
  const departmentRecord = [...(store.departments || []), ...(store.teams || [])].find((record) => String(record.id) === String(departmentId));
  const designationName = String(payload.designation_name || designationRecord?.name || existingDesignation.name || payload.designation || "Employee");
  const departmentName = String(payload.department_name || departmentRecord?.team_name || departmentRecord?.name || existingDepartment.team_name || existingDepartment.name || payload.department || "General");
  const shiftTypeId = detailPayload.shift_type_id || payload.shift_type_id || payload.shift_id || existingDetail.shift_type_id;
  const shiftType = store["shift-types"].find((record) => String(record.id) === String(shiftTypeId));

  return {
    ...(existing || {}),
    id,
    ...payload,
    name: fullName,
    email: String(payload.email || existing?.email || `employee-${id}@example.com`),
    role: normalizeRole(String(payload.role || existing?.role || "employee")) === "admin" ? "admin" : "employee",
    status: String(payload.status || existing?.status || "active"),
    employee_detail: {
      ...existingDetail,
      ...detailPayload,
      employee_id: detailPayload.employee_id || payload.employee_id || existingDetail.employee_id || "",
      designation_id: designationId,
      department_id: departmentId,
      designation: { id: designationId, name: designationName },
      department: {
        id: departmentId,
        name: departmentName,
        team_name: departmentName,
      },
      shift_type_id: shiftTypeId || null,
      shift_type: makeShiftSummary(shiftType) || payload.shift_type || existingDetail.shift_type,
      joining_date: detailPayload.joining_date || payload.joining_date || existingDetail.joining_date || new Date().toISOString().slice(0, 10),
      mobile: detailPayload.mobile || payload.mobile || existingDetail.mobile || "",
      address: detailPayload.address || payload.address || existingDetail.address || "",
    },
    created_at: existing?.created_at || new Date().toISOString(),
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

const makeCompanyPayload = (payload: Record<string, unknown>, id: number): MockRecord => {
  const companyPayload = getNestedObject(payload.company);
  const flatPayload = Object.keys(companyPayload).length ? companyPayload : payload;

  return {
    id,
    ...flatPayload,
    name: String(flatPayload.company_name || flatPayload.name || `Company ${id}`),
    company_name: String(flatPayload.company_name || flatPayload.name || `Company ${id}`),
    email: String(flatPayload.email || payload.admin_email || `company-${id}@example.com`),
    phone: String(flatPayload.phone || ""),
    website: String(flatPayload.website || ""),
    package: String(flatPayload.package || "Trial"),
    package_type: String(flatPayload.package_type || "monthly"),
    status: String(flatPayload.status || "active"),
    lastLogin: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  };
};

const normalizePermissionList = (value: unknown, fallback: PermissionKey[] = rolePermissions.admin) => {
  if (!Array.isArray(value)) return fallback;
  return value.map((permission) => String(permission)).filter(Boolean) as PermissionKey[];
};

const makeAdminPayload = (store: MockStore, payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const safePayload = { ...payload };
  delete safePayload.password;
  const companyId = getNestedId(payload.company) || payload.company_id || existing?.company_id || 1;
  const company = store.companies.find((record) => String(record.id) === String(companyId));
  const permissions = normalizePermissionList(payload.permissions, normalizePermissionList(existing?.permissions, rolePermissions.admin));
  const nextPassword = typeof payload.password === "string" && payload.password.trim()
    ? payload.password.trim()
    : String(existing?.password || "");

  return {
    ...(existing || {}),
    id,
    ...safePayload,
    name: String(payload.name || existing?.name || `Admin ${id}`),
    email: String(payload.email || existing?.email || `admin-${id}@company.test`),
    role: "admin",
    company_id: companyId,
    company: company
      ? {
          id: company.id,
          name: company.name,
          company_name: company.company_name || company.name,
        }
      : payload.company || existing?.company,
    status: String(payload.status || existing?.status || "active"),
    password: nextPassword,
    permissions,
    modules: getModulesFromPermissions(permissions),
    last_login_at: existing?.last_login_at || null,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

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

const makeSalaryComponentPayload = (payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const componentType = String(payload.component_type || payload.type || existing?.component_type || "earning");
  const valueType = String(payload.value_type || existing?.value_type || "fixed");

  return {
    ...(existing || {}),
    id,
    ...payload,
    component_name: String(payload.component_name || payload.name || existing?.component_name || `Component ${id}`),
    component_type: componentType,
    type: componentType,
    value_type: valueType,
    component_value: toNumber(payload.component_value ?? payload.value ?? existing?.component_value),
    weekly_value: toNumber(payload.weekly_value ?? existing?.weekly_value ?? payload.component_value ?? payload.value),
    biweekly_value: toNumber(payload.biweekly_value ?? existing?.biweekly_value ?? payload.component_value ?? payload.value),
    semimonthly_value: toNumber(payload.semimonthly_value ?? existing?.semimonthly_value ?? payload.component_value ?? payload.value),
    status: String(payload.status || existing?.status || "active"),
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const normalizeIdList = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => getNestedId(item)).filter((item) => item !== undefined && item !== null && item !== "");
};

const makeSalaryGroupPayload = (payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const componentIds = normalizeIdList(payload.component_ids).length
    ? normalizeIdList(payload.component_ids)
    : normalizeIdList(payload.components).length
      ? normalizeIdList(payload.components)
      : Array.isArray(existing?.component_ids)
        ? existing.component_ids
        : [];

  return {
    ...(existing || {}),
    id,
    ...payload,
    group_name: String(payload.group_name || payload.name || existing?.group_name || `Salary Group ${id}`),
    description: String(payload.description || existing?.description || ""),
    components: componentIds,
    component_ids: componentIds,
    status: String(payload.status || existing?.status || "active"),
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const makeEmployeeSalaryPayload = (store: MockStore, payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const employeeId = payload.employee_id || payload.user_id || getNestedId(payload.employee) || getNestedId(payload.user) || existing?.employee_id;
  const employee = store.employees.find((record) => String(record.id) === String(employeeId));

  return {
    ...(existing || {}),
    id,
    ...payload,
    user_id: employeeId || null,
    employee_id: employeeId || null,
    employee: employee ? { id: employee.id, name: employee.name, employee_detail: employee.employee_detail } : payload.employee || existing?.employee,
    amount: toNumber(payload.amount ?? existing?.amount),
    type: String(payload.type || existing?.type || "initial"),
    date: String(payload.date || existing?.date || new Date().toISOString().slice(0, 10)),
    allow_generate_payroll: String(payload.allow_generate_payroll || existing?.allow_generate_payroll || "yes"),
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const makeEmployeeSalaryGroupPayload = (store: MockStore, payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const employeeId = payload.employee_id || payload.user_id || getNestedId(payload.employee) || existing?.employee_id;
  const salaryGroupId = payload.salary_group_id || getNestedId(payload.salary_group) || existing?.salary_group_id || null;
  const employee = store.employees.find((record) => String(record.id) === String(employeeId));
  const salaryGroup = store["salary-groups"].find((record) => String(record.id) === String(salaryGroupId));

  return {
    ...(existing || {}),
    id,
    ...payload,
    user_id: employeeId || null,
    employee_id: employeeId || null,
    salary_group_id: salaryGroupId,
    employee: employee ? { id: employee.id, name: employee.name } : payload.employee || existing?.employee,
    salary_group: salaryGroup ? { id: salaryGroup.id, group_name: salaryGroup.group_name } : payload.salary_group || existing?.salary_group,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const makeEmployeePayrollCyclePayload = (store: MockStore, payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => {
  const employeeId = payload.employee_id || payload.user_id || getNestedId(payload.employee) || existing?.employee_id;
  const payrollCycleId = payload.payroll_cycle_id || getNestedId(payload.payroll_cycle) || existing?.payroll_cycle_id || 1;
  const employee = store.employees.find((record) => String(record.id) === String(employeeId));
  const payrollCycle = store["payroll-cycles"].find((record) => String(record.id) === String(payrollCycleId));

  return {
    ...(existing || {}),
    id,
    ...payload,
    user_id: employeeId || null,
    employee_id: employeeId || null,
    payroll_cycle_id: payrollCycleId,
    employee: employee ? { id: employee.id, name: employee.name } : payload.employee || existing?.employee,
    payroll_cycle: payrollCycle ? { id: payrollCycle.id, name: payrollCycle.name, cycle: payrollCycle.cycle } : payload.payroll_cycle || existing?.payroll_cycle,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const makeSalaryTdsPayload = (payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => ({
  ...(existing || {}),
  id,
  ...payload,
  salary_from: toNumber(payload.salary_from ?? existing?.salary_from),
  salary_to: toNumber(payload.salary_to ?? existing?.salary_to),
  salary_percent: toNumber(payload.salary_percent ?? existing?.salary_percent),
  created_at: existing?.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const makeSalaryPaymentMethodPayload = (payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => ({
  ...(existing || {}),
  id,
  ...payload,
  payment_method: String(payload.payment_method || payload.name || existing?.payment_method || `Payment Method ${id}`),
  is_default: payload.is_default ?? existing?.is_default ?? false,
  status: String(payload.status || existing?.status || "active"),
  created_at: existing?.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const makePayrollSettingPayload = (payload: Record<string, unknown>, id: number | string, existing?: MockRecord): MockRecord => ({
  ...(existing || {}),
  id,
  ...payload,
  tds_status: String(payload.tds_status || existing?.tds_status || "no"),
  finance_month: String(payload.finance_month || existing?.finance_month || "04"),
  tds_salary: toNumber(payload.tds_salary ?? existing?.tds_salary),
  extra_fields: Array.isArray(payload.extra_fields) ? payload.extra_fields : existing?.extra_fields || [],
  created_at: existing?.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const makeGenericPayload = (store: MockStore, resource: string, payload: Record<string, unknown>, id: number): MockRecord => {
  if (resource === "clients") return makeClientPayload(payload, id);
  if (resource === "employees") return makeEmployeePayload(store, payload, id);
  if (resource === "companies") return makeCompanyPayload(payload, id);
  if (resource === "admins") return makeAdminPayload(store, payload, id);
  if (resource === "projects") return makeProjectPayload(store, payload, id);
  if (resource === "tasks") return makeTaskPayload(store, payload, id);
  if (resource === "tickets") return makeTicketPayload(store, payload, id);
  if (resource === "attendance") return makeAttendancePayload(store, payload, id);
  if (resource === "leaves") return makeLeavePayload(store, payload, id);
  if (resource === "salary-components") return makeSalaryComponentPayload(payload, id);
  if (resource === "salary-groups") return makeSalaryGroupPayload(payload, id);
  if (resource === "employee-salaries") return makeEmployeeSalaryPayload(store, payload, id);
  if (resource === "employee-salary-groups") return makeEmployeeSalaryGroupPayload(store, payload, id);
  if (resource === "employee-payroll-cycles") return makeEmployeePayrollCyclePayload(store, payload, id);
  if (resource === "salary-tds") return makeSalaryTdsPayload(payload, id);
  if (resource === "salary-payment-methods") return makeSalaryPaymentMethodPayload(payload, id);
  if (resource === "payroll-settings") return makePayrollSettingPayload(payload, id);
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

const login = (store: MockStore, payload: Record<string, unknown>) => {
  const email = String(payload.email || "admin@company.com");
  const admin = (store.admins || []).find((record) => String(record.email || "").toLowerCase() === email.toLowerCase());
  const adminCompanyId = typeof admin?.company_id === "string" || typeof admin?.company_id === "number" ? admin.company_id : null;
  const user: AuthUser = admin
    ? {
        id: admin.id,
        name: String(admin.name || "Admin"),
        email: String(admin.email || email),
        role: "admin",
        company_id: adminCompanyId,
        permissions: normalizePermissionList(admin.permissions, []),
        modules: Array.isArray(admin.modules) ? (admin.modules as string[]) : getModulesFromPermissions(normalizePermissionList(admin.permissions, [])),
      }
    : makeDevUserFromEmail(email);
  const token = `mock_${user.role}_${Date.now()}`;

  return apiEnvelope<{ token: string; user: AuthUser }>({ token, user }, "Login successful");
};

const loginAsCompany = (store: MockStore, company: MockRecord) => {
  const companyName = String(company.company_name || company.name || "Company");
  const companyAdmin = (store.admins || []).find(
    (record) => String(record.company_id) === String(company.id) && String(record.status || "active") === "active",
  );
  const adminPermissions = normalizePermissionList(companyAdmin?.permissions, rolePermissions.admin);
  const user: AuthUser = {
    id: companyAdmin?.id || `company-admin-${company.id}`,
    name: String(companyAdmin?.name || `${companyName} Admin`),
    email: String(companyAdmin?.email || company.admin_email || company.email || `admin-${company.id}@company.test`),
    role: "admin",
    company_id: company.id,
    impersonator_role: "super_admin",
    permissions: adminPermissions,
    modules: getModulesFromPermissions(adminPermissions),
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

const truthyPayload = (payload: Record<string, unknown>, keys: string[], fallback = false) => {
  const found = keys.map((key) => payload[key]).find((value) => value !== undefined);
  if (found === undefined) return fallback;
  if (typeof found === "boolean") return found;
  return ["yes", "true", "1", "on"].includes(String(found).toLowerCase());
};

const normalizePayrollOptions = (payload: Record<string, unknown>): PayrollGenerationOptions => ({
  useAttendance: truthyPayload(payload, ["useAttendance", "use_attendance"], true),
  markApprovedLeavesPaid: truthyPayload(payload, ["markApprovedLeavesPaid", "markLeavesPaid", "mark_leaves_paid", "markApprovedLeavesPaid"], true),
  markAbsentUnpaid: truthyPayload(payload, ["markAbsentUnpaid", "mark_absent_unpaid"], false),
  includeExpenseClaims: truthyPayload(payload, ["includeExpenseClaims", "include_expense_claims"], true),
  addTimelogs: truthyPayload(payload, ["addTimelogs", "add_timelogs"], false),
});

const normalizeIdArray = (value: unknown) => {
  if (Array.isArray(value)) return value.map((item) => String(getNestedId(item))).filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const buildCycleRanges = (cycleId: number | string, year: number, month: number, payrollCycles: MockRecord[]) => {
  const cycle = payrollCycles.find((record) => String(record.id) === String(cycleId)) || payrollCycles[0];
  const range = getMonthRange(year, month);
  const cycleName = String(cycle?.cycle || cycle?.name || "monthly").toLowerCase();

  if (cycleName.includes("semi")) {
    const mid = `${year}-${String(month).padStart(2, "0")}-15`;
    return [
      { label: `${monthName(month)} 1-15`, salary_from: range.start, salary_to: mid },
      { label: `${monthName(month)} 16-${range.days}`, salary_from: `${year}-${String(month).padStart(2, "0")}-16`, salary_to: range.end },
    ];
  }

  if (cycleName.includes("week")) {
    const chunk = cycleName.includes("bi") ? 14 : 7;
    const ranges = [];
    for (let day = 1; day <= range.days; day += chunk) {
      const startDay = day;
      const endDay = Math.min(range.days, day + chunk - 1);
      const start = `${year}-${String(month).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
      const end = `${year}-${String(month).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
      ranges.push({ label: `${monthName(month)} ${startDay}-${endDay}`, salary_from: start, salary_to: end });
    }
    return ranges;
  }

  return [{ label: `${monthName(month)} ${year}`, salary_from: range.start, salary_to: range.end }];
};

const generatePayrollSlips = (store: MockStore, payload: Record<string, unknown>) => {
  const year = toNumber(payload.year, new Date().getFullYear());
  const month = toNumber(payload.month, new Date().getMonth() + 1);
  const period = getMonthRange(year, month);
  const startDate = String(payload.salary_from || payload.start_date || period.start);
  const endDate = String(payload.salary_to || payload.end_date || period.end);
  const payrollCycleId = payload.payroll_cycle_id || payload.payroll_cycle || payload.cycle || 1;
  const requestedIds = normalizeIdArray(payload.userIds || payload.user_ids || payload.employee_ids || payload.employeeIds);
  const options = normalizePayrollOptions(payload);
  const existingSlips = getResourceRecords(store, "payroll");
  const nextSlipId = nextId(existingSlips);
  const eligibleEmployees = (store.employees || [])
    .filter((employee) => !requestedIds.length || requestedIds.includes(String(employeeIdOf(employee as PayrollRecord))))
    .filter((employee) => {
      const employeeCycle = (store["employee-payroll-cycles"] || []).find((record) => String(employeeIdOf(record as PayrollRecord)) === String(employee.id));
      return String(employeeCycle?.payroll_cycle_id || 1) === String(payrollCycleId);
    });

  const skipped: Array<{ id: number | string | undefined; name: unknown; reason: string }> = [];
  const generated = eligibleEmployees
    .map((employee, index) => {
      const readiness = canGeneratePayrollForEmployee(employee as PayrollRecord, store["employee-salaries"] || [], store["employee-salary-groups"] || []);
      if (!readiness.ok) {
        skipped.push({ id: employee.id, name: employee.name, reason: readiness.reason });
        return null;
      }

      return buildSalarySlip({
        employee: employee as PayrollRecord,
        salaryRecords: (store["employee-salaries"] || []) as PayrollRecord[],
        salaryGroups: (store["salary-groups"] || []) as PayrollRecord[],
        salaryComponents: (store["salary-components"] || []) as PayrollRecord[],
        employeeSalaryGroups: (store["employee-salary-groups"] || []) as PayrollRecord[],
        employeePayrollCycles: (store["employee-payroll-cycles"] || []) as PayrollRecord[],
        payrollCycles: (store["payroll-cycles"] || []) as PayrollRecord[],
        attendance: (store.attendance || []) as PayrollRecord[],
        leaves: (store.leaves || []) as PayrollRecord[],
        holidays: (store.holidays || []) as PayrollRecord[],
        expenses: (store.expenses || []) as PayrollRecord[],
        timeLogs: (store["time-logs"] || []) as PayrollRecord[],
        settings: (store["payroll-settings"] || [])[0] as PayrollRecord | undefined,
        salaryTds: (store["salary-tds"] || []) as PayrollRecord[],
        year,
        month,
        startDate,
        endDate,
        options,
        id: nextSlipId + index,
      }) as MockRecord;
    })
    .filter(Boolean) as MockRecord[];

  const generatedKeys = new Set(generated.map((slip) => `${slip.employee_id}-${slip.year}-${slip.month}-${slip.payroll_cycle_id}-${slip.salary_from}-${slip.salary_to}`));
  const preserved = existingSlips.filter(
    (slip) => !generatedKeys.has(`${slip.employee_id}-${slip.year}-${slip.month}-${slip.payroll_cycle_id}-${slip.salary_from}-${slip.salary_to}`),
  );
  setResourceRecords(store, "payroll", [...generated, ...preserved]);

  return {
    generated,
    skipped,
    period: { year, month, salary_from: startDate, salary_to: endDate, payroll_cycle_id: payrollCycleId },
  };
};

const updatePayrollStatuses = (store: MockStore, payload: Record<string, unknown>) => {
  const ids = normalizeIdArray(payload.ids || payload.salary_slip_ids || payload.payroll_ids || payload.selected_ids);
  const status = String(payload.status || "generated") as PayrollStatus;
  const paidOn = String(payload.paid_on || new Date().toISOString().slice(0, 10));
  const paymentMethodId = payload.salary_payment_method_id || payload.payment_method_id || null;
  const records = getResourceRecords(store, "payroll");
  let updatedTotal = 0;
  const updated = records.map((record) => {
    if (!ids.includes(String(record.id))) return record;
    updatedTotal += toNumber(record.net_salary);
    return {
      ...record,
      status,
      paid_on: status === "paid" ? paidOn : record.paid_on || null,
      salary_payment_method_id: status === "paid" ? paymentMethodId : record.salary_payment_method_id || null,
      updated_at: new Date().toISOString(),
    };
  });

  setResourceRecords(store, "payroll", updated);

  if (status === "paid" && truthyPayload(payload, ["add_expenses", "addExpenses"], false) && updatedTotal > 0) {
    const expenseRecords = getResourceRecords(store, "expenses");
    const expense = makeFinancePayload(
      store,
      "expenses",
      {
        item_name: `Payroll salary expense ${paidOn}`,
        price: roundMoney(updatedTotal),
        amount: roundMoney(updatedTotal),
        status: "approved",
        purchase_date: paidOn,
        can_claim: "no",
      },
      nextId(expenseRecords),
    );
    setResourceRecords(store, "expenses", [expense, ...expenseRecords]);
  }

  return updated.filter((record) => ids.includes(String(record.id)));
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
    return jsonResponse(config, 200, login(store, payload));
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

  // Attendance Device Management
  if (resource === "attendance-devices" || resource === "v1/attendance-devices") {
    if (method === "get") {
      return jsonResponse(config, 200, apiEnvelope(store["attendance-devices"] || []));
    }
    if (method === "post" && id) {
      return jsonResponse(config, 200, apiEnvelope({ success: true }, "Device action executed"));
    }
  }

  // Attendance Audit Logs
  if (resource === "attendance" && id === "audit") {
    const employeeId = action; // From ['attendance', 'audit', 'employeeId', 'date']
    const date = segments[3] || new Date().toISOString().slice(0, 10);
    
    return jsonResponse(config, 200, apiEnvelope({
      id: `${employeeId}-${date}`,
      date,
      punches: [
        { id: 'p1', employee_id: employeeId, device_id: 1, timestamp: `${date}T09:05:22`, type: 'check_in', status: 'processed', metadata: { ip: '192.168.1.50', auth_mode: 'Fingerprint' } },
        { id: 'p2', employee_id: employeeId, device_id: 1, timestamp: `${date}T09:07:11`, type: 'check_in', status: 'ignored', metadata: { ip: '192.168.1.50', auth_mode: 'Face' } },
        { id: 'p3', employee_id: employeeId, device_id: 2, timestamp: `${date}T18:15:45`, type: 'check_out', status: 'processed', metadata: { ip: '192.168.1.55', auth_mode: 'Card' } },
      ],
      processed_attendance: {
        clock_in: '09:05:22',
        clock_out: '18:15:45',
        status: 'present'
      }
    }));
  }

  // Attendance Override
  if (resource === "attendance" && id === "override" && method === "post") {
    return jsonResponse(config, 200, apiEnvelope({ success: true }, "Attendance overridden successfully"));
  }

  if (resource === "admins" && !requireRole(config, "super_admin")) {
    return jsonResponse(config, 403, { success: false, message: "Only super admins can manage company admins." });
  }

  const records = getResourceRecords(store, resource);

  if (resource === "companies" && method === "post" && id && action === "login") {
    if (!requireRole(config, "super_admin")) {
      return jsonResponse(config, 403, { success: false, message: "Only super admins can login as a company." });
    }
    const company = records.find((item) => String(item.id) === id);
    return jsonResponse(config, company ? 200 : 404, company ? loginAsCompany(store, company) : { success: false, message: "Company not found" });
  }

  if (resource === "payroll" && method === "post" && id === "generate") {
    const result = generatePayrollSlips(store, payload);
    return jsonResponse(config, 200, apiEnvelope(result, `${result.generated.length} payslip(s) generated`));
  }

  if (resource === "payroll" && method === "post" && (id === "update-status" || id === "updateStatus")) {
    const updated = updatePayrollStatuses(store, payload);
    return jsonResponse(config, 200, apiEnvelope(updated, "Payroll status updated"));
  }

  if (resource === "payroll" && method === "post" && id === "cycle-data") {
    const year = toNumber(payload.year, new Date().getFullYear());
    const month = toNumber(payload.month, new Date().getMonth() + 1);
    const payrollCycleId = String(payload.payroll_cycle_id || payload.payroll_cycle || payload.cycle || 1);
    return jsonResponse(config, 200, apiEnvelope(buildCycleRanges(payrollCycleId, year, month, store["payroll-cycles"] || [])));
  }

  if (resource === "employee-salaries" && method === "post" && id === "status") {
    const employeeId = payload.employee_id || payload.user_id;
    const allow = String(payload.allow_generate_payroll || payload.status || "yes");
    const salaryRecords = getResourceRecords(store, "employee-salaries");
    const updated = salaryRecords.map((record) =>
      String(employeeIdOf(record as PayrollRecord)) === String(employeeId)
        ? { ...record, allow_generate_payroll: allow, updated_at: new Date().toISOString() }
        : record,
    );
    setResourceRecords(store, "employee-salaries", updated);
    return jsonResponse(config, 200, apiEnvelope(updated.filter((record) => String(employeeIdOf(record as PayrollRecord)) === String(employeeId)), "Payroll status updated"));
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
    if (resource === "companies") {
      const adminPayload = getNestedObject(payload.admin);
      if (adminPayload.name || adminPayload.email) {
        const adminRecords = getResourceRecords(store, "admins");
        const admin = makeAdminPayload(
          { ...store, companies: [created, ...records] },
          {
            ...adminPayload,
            company_id: created.id,
            role: "admin",
            permissions: normalizePermissionList(adminPayload.permissions, rolePermissions.admin),
          },
          nextId(adminRecords),
        );
        setResourceRecords(store, "admins", [admin, ...adminRecords]);
      }
    }
    return jsonResponse(config, 201, apiEnvelope(created, "Created successfully"));
  }

  if ((method === "put" || method === "patch") && id) {
    const updatedRecords = records.map((record) => {
      if (String(record.id) !== id) return record;
      if (resource === "employees") return { ...makeEmployeePayload(store, payload, record.id, record), updated_at: new Date().toISOString() };
      if (resource === "admins") return makeAdminPayload(store, payload, record.id, record);
      if (resource === "salary-components") return makeSalaryComponentPayload(payload, record.id, record);
      if (resource === "salary-groups") return makeSalaryGroupPayload(payload, record.id, record);
      if (resource === "employee-salaries") return makeEmployeeSalaryPayload(store, payload, record.id, record);
      if (resource === "employee-salary-groups") return makeEmployeeSalaryGroupPayload(store, payload, record.id, record);
      if (resource === "employee-payroll-cycles") return makeEmployeePayrollCyclePayload(store, payload, record.id, record);
      if (resource === "salary-tds") return makeSalaryTdsPayload(payload, record.id, record);
      if (resource === "salary-payment-methods") return makeSalaryPaymentMethodPayload(payload, record.id, record);
      if (resource === "payroll-settings") return makePayrollSettingPayload(payload, record.id, record);
      return { ...record, ...payload, updated_at: new Date().toISOString() };
    });
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
