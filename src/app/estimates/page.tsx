import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { Plus, Filter, RefreshCw, Edit, Trash2, Eye, Download, Send } from "lucide-react";

const estimates = [
  { id: 1, estimateNumber: "EST#001", client: "John Anderson", total: "$500.00", date: "2026-05-01", validTill: "2026-05-15", status: "waiting" },
  { id: 2, estimateNumber: "EST#002", client: "Sarah Williams", total: "$1,200.00", date: "2026-05-02", validTill: "2026-05-16", status: "accepted" },
  { id: 3, estimateNumber: "EST#003", client: "Michael Brown", total: "$800.00", date: "2026-05-03", validTill: "2026-05-17", status: "declined" },
  { id: 4, estimateNumber: "EST#004", client: "Emily Davis", total: "$2,500.00", date: "2026-05-04", validTill: "2026-05-18", status: "waiting" },
  { id: 5, estimateNumber: "EST#005", client: "Robert Wilson", total: "$350.00", date: "2026-05-05", validTill: "2026-05-19", status: "accepted" },
];

const statusColors: Record<string, string> = {
  waiting: "bg-yellow-100 text-yellow-600",
  accepted: "bg-green-100 text-green-600",
  declined: "bg-red-100 text-red-500",
};

export default function EstimatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Title Bar */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-5 gap-3">
          <h1 className="text-base font-semibold text-gray-700">Estimates</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/estimates/create" className="flex items-center space-x-1 rounded border border-green-500 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-500 hover:text-white transition-colors">
              <span>Create Estimate</span><Plus className="h-3.5 w-3.5" />
            </Link>
            <ol className="flex text-sm text-gray-500 space-x-1">
              <li><Link href="/dashboard" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li className="text-gray-700">Estimates</li>
            </ol>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Date Range</label>
              <input type="text" placeholder="Select date range" className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary" readOnly />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option>
                <option value="waiting">Waiting</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 rounded bg-green-500 px-6 py-2 text-xs font-semibold text-white hover:bg-green-600">
                <Filter className="h-3.5 w-3.5" /><span>Apply</span>
              </button>
              <button className="flex items-center space-x-1 rounded bg-gray-600 px-6 py-2 text-xs font-semibold text-white hover:bg-gray-700">
                <RefreshCw className="h-3.5 w-3.5" /><span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Estimate #</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Estimate Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Valid Till</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estimates.map((est) => (
                  <tr key={est.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-medium text-primary hover:underline">
                      <Link href={`/estimates/${est.id}`}>{est.estimateNumber}</Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-800">{est.client}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{est.total}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{est.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{est.validTill}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[est.status]}`}>
                        {est.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button className="text-gray-400 hover:text-primary" title="View"><Eye className="h-4 w-4" /></button>
                        <button className="text-blue-400 hover:text-blue-600" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button className="text-green-500 hover:text-green-700" title="Send"><Send className="h-4 w-4" /></button>
                        <button className="text-gray-600 hover:text-gray-800" title="Download"><Download className="h-4 w-4" /></button>
                        <button className="text-red-400 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
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
