import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { Plus, Filter, RefreshCw, Edit, Trash2, Eye, CreditCard } from "lucide-react";

const payments = [
  { id: 1, invoiceNumber: "INV#001", project: "Website Redesign", amount: "$500.00", date: "2026-05-01", status: "complete", gateway: "Paypal" },
  { id: 2, invoiceNumber: "INV#002", project: "Mobile App", amount: "$1,200.00", date: "2026-05-02", status: "complete", gateway: "Stripe" },
  { id: 3, invoiceNumber: "INV#003", project: "API Integration", amount: "$800.00", date: "2026-05-03", status: "pending", gateway: "Bank Transfer" },
  { id: 4, invoiceNumber: "INV#004", project: "Website Redesign", amount: "$2,500.00", date: "2026-05-04", status: "complete", gateway: "Paypal" },
  { id: 5, invoiceNumber: "INV#005", project: "Mobile App", amount: "$350.00", date: "2026-05-05", status: "complete", gateway: "Stripe" },
];

const statusColors: Record<string, string> = {
  complete: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
};

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Title Bar */}
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-5 gap-3">
          <h1 className="text-base font-semibold text-gray-700">Payments</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/payments/create" className="flex items-center space-x-1 rounded border border-green-500 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-500 hover:text-white transition-colors">
              <span>Add Payment</span><Plus className="h-3.5 w-3.5" />
            </Link>
            <ol className="flex text-sm text-gray-500 space-x-1">
              <li><Link href="/dashboard" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li className="text-gray-700">Payments</li>
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option>
                <option value="complete">Complete</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project</label>
              <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="all">All</option>
                <option>Website Redesign</option>
                <option>Mobile App</option>
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
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Paid On</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Gateway</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{payment.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-primary hover:underline">
                      <Link href={`/invoices/${payment.id}`}>{payment.invoiceNumber}</Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{payment.project}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{payment.amount}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{payment.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <div className="flex items-center space-x-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                        <span>{payment.gateway}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <Link href={`/payments/${payment.id}`} className="text-gray-400 hover:text-primary"><Eye className="h-4 w-4" /></Link>
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
