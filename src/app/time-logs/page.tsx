import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { Plus, Filter, RefreshCw, Edit, Trash2, Eye, Calendar, User, Clock, Timer } from "lucide-react";

const timeLogs = [
  { id: 1, employee: "John Doe", project: "Website Redesign", task: "Design Homepage", startTime: "2026-05-01 09:00 AM", endTime: "2026-05-01 01:00 PM", totalHours: "4 Hrs", status: "Approved" },
  { id: 2, employee: "Jane Smith", project: "Mobile App", task: "Bug Fixing", startTime: "2026-05-01 10:00 AM", endTime: "2026-05-01 03:00 PM", totalHours: "5 Hrs", status: "Pending" },
  { id: 3, employee: "Mike Tyson", project: "API Integration", task: "Unit Testing", startTime: "2026-05-02 09:00 AM", endTime: "2026-05-02 06:00 PM", totalHours: "9 Hrs", status: "Approved" },
  { id: 4, employee: "Sarah Connor", project: "Website Redesign", task: "CSS Styling", startTime: "2026-05-02 11:00 AM", endTime: "2026-05-02 02:00 PM", totalHours: "3 Hrs", status: "Pending" },
  { id: 5, employee: "Bruce Wayne", project: "Mobile App", task: "UI Enhancements", startTime: "2026-05-03 09:30 AM", endTime: "2026-05-03 12:30 PM", totalHours: "3 Hrs", status: "Approved" },
];

export default function TimeLogsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Title Bar */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-5 gap-3">
          <h1 className="text-base font-semibold text-gray-700">Time Logs</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/time-logs/active" className="flex items-center space-x-1 rounded bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors">
              <Timer className="h-3.5 w-3.5" /><span>Active Timers</span>
              <span className="ml-1 bg-white/20 px-1.5 rounded text-[10px]">3</span>
            </Link>
            <Link href="/time-logs/calendar" className="flex items-center space-x-1 rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors">
              <Calendar className="h-3.5 w-3.5" /><span>Calendar View</span>
            </Link>
            <Link href="/invoices/create?type=timelog" className="flex items-center space-x-1 rounded border border-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-800 hover:text-white transition-colors">
              <Plus className="h-3.5 w-3.5" /><span>Create Invoice</span>
            </Link>
            <Link href="/time-logs/by-employee" className="flex items-center space-x-1 rounded border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
              <User className="h-3.5 w-3.5" /><span>By Employee</span>
            </Link>
            <button className="flex items-center space-x-1 rounded border border-green-500 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-500 hover:text-white transition-colors">
              <Clock className="h-3.5 w-3.5" /><span>Log Time</span>
            </button>
            <ol className="flex text-sm text-gray-500 space-x-1">
              <li><Link href="/dashboard" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li className="text-gray-700">Time Logs</li>
            </ol>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Date Range</label>
              <input type="text" placeholder="Select date range" className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Project</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option><option>Website Redesign</option><option>Mobile App</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Task</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option><option>Design Homepage</option><option>Bug Fixing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Employee Name</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option><option>John Doe</option><option>Jane Smith</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <button className="flex items-center space-x-1 rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600">
              <Filter className="h-3.5 w-3.5" /><span>Apply</span>
            </button>
            <button className="flex items-center space-x-1 rounded bg-gray-600 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700">
              <RefreshCw className="h-3.5 w-3.5" /><span>Reset</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">#</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Task</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Start Time</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">End Time</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Total Hours</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {timeLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{log.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800">{log.employee}</td>
                    <td className="px-4 py-3 text-xs text-primary font-medium">{log.project}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{log.task}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.startTime}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.endTime}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{log.totalHours}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        log.status === "Approved" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button className="text-blue-400 hover:text-blue-600"><Edit className="h-4 w-4" /></button>
                        <button className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
