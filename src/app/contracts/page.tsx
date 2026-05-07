import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { Plus, Filter, RefreshCw, Edit, Trash2, Eye, FileText, Send } from "lucide-react";

const contracts = [
  { id: 1, subject: "Web Development Agreement", client: "John Anderson", amount: "$5,000.00", startDate: "2026-05-01", endDate: "2026-12-31", type: "Fixed Price" },
  { id: 2, subject: "SEO Services Contract", client: "Sarah Williams", amount: "$1,200.00/mo", startDate: "2026-05-15", endDate: "2027-05-14", type: "Monthly" },
  { id: 3, subject: "Graphic Design Retainer", client: "Michael Brown", amount: "$800.00", startDate: "2026-06-01", endDate: "2026-09-30", type: "Retainer" },
  { id: 4, subject: "Consulting Agreement", client: "Emily Davis", amount: "$2,500.00", startDate: "2026-04-01", endDate: "2026-06-30", type: "One Time" },
  { id: 5, subject: "App Maintenance Contract", client: "Robert Wilson", amount: "$350.00/mo", startDate: "2026-05-01", endDate: "2027-05-01", type: "Maintenance" },
];

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Title Bar */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-5 gap-3">
          <h1 className="text-base font-semibold text-gray-700">Contracts</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/contracts/create" className="flex items-center space-x-1 rounded border border-green-500 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-500 hover:text-white transition-colors">
              <span>Create Contract</span><Plus className="h-3.5 w-3.5" />
            </Link>
            <ol className="flex text-sm text-gray-500 space-x-1">
              <li><Link href="/dashboard" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li className="text-gray-700">Contracts</li>
            </ol>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-gray-200 text-center gap-y-4 sm:gap-y-0">
            <div>
              <h4 className="text-xl font-bold text-gray-800">12</h4>
              <p className="text-[10px] text-gray-500 mt-1 uppercase">Total Contracts</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-yellow-500">2</h4>
              <p className="text-[10px] text-gray-500 mt-1 uppercase">About To Expire</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-red-500">1</h4>
              <p className="text-[10px] text-gray-500 mt-1 uppercase">Expired</p>
            </div>
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Client</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option>
                <option>John Anderson</option>
                <option>Sarah Williams</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contract Type</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option>
                <option>Fixed Price</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600">
                <Filter className="h-3.5 w-3.5" /><span>Apply</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 rounded bg-gray-600 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700">
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
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">#</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Subject</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Start Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">End Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{contract.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3.5 w-3.5 text-gray-400" />
                        <Link href={`/contracts/${contract.id}`} className="text-xs font-medium text-primary hover:underline">{contract.subject}</Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-800">{contract.client}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{contract.amount}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{contract.startDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{contract.endDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button className="text-gray-400 hover:text-primary"><Eye className="h-4 w-4" /></button>
                        <button className="text-blue-400 hover:text-blue-600"><Edit className="h-4 w-4" /></button>
                        <button className="text-green-500 hover:text-green-700"><Send className="h-4 w-4" /></button>
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
