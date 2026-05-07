"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Sliders, Calendar, Search, RefreshCw, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialExpenses = [
  { id: 1, item: "Office Rent", employee: "Admin", price: "$2,000.00", frequency: "Monthly", nextExpense: "2026-06-01", status: "Active" },
  { id: 2, item: "Internet Bill", employee: "John Doe", price: "$150.00", frequency: "Monthly", nextExpense: "2026-06-05", status: "Active" },
  { id: 3, item: "Cleaning Service", employee: "Admin", price: "$300.00", frequency: "Weekly", nextExpense: "2026-05-14", status: "Inactive" },
];

export default function ExpensesRecurringPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Recurring Expenses</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-700">Recurring Expenses</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-800 text-white border-none text-[10px] h-8 px-3"
            >
              <Sliders className="h-3 w-3" />
              <span>Filter Results</span>
            </Button>
            <Button className="flex items-center space-x-1 bg-primary hover:bg-primary/90 text-white border-none text-[10px] h-8 px-3">
              <Plus className="h-3 w-3" />
              <span>Add Recurring Expense</span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="p-6 bg-gray-50/50 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Select Date Range</label>
                <div className="flex items-center w-full text-xs border border-gray-200 rounded p-2 bg-white cursor-pointer hover:bg-gray-50">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span>All Time</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Employee</label>
                <select className="w-full text-xs border-gray-200 rounded p-2 bg-white">
                  <option>All</option>
                  <option>Admin</option>
                  <option>John Doe</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                <select className="w-full text-xs border-gray-200 rounded p-2 bg-white">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end space-x-2">
                <Button className="bg-primary text-white text-[10px] h-9 px-6">Apply</Button>
                <Button className="bg-gray-200 text-gray-600 text-[10px] h-9 px-6">Reset</Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-0 overflow-hidden shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2 border border-gray-100 rounded px-3 py-1.5 bg-gray-50/50 w-64 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <Search className="h-3.5 w-3.5 text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none text-xs w-full focus:outline-none text-gray-600" />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Next Expense</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((expense, i) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700">{expense.item}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{expense.employee}</td>
                  <td className="px-6 py-4 text-xs font-black text-gray-800">{expense.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <RefreshCw className="h-3 w-3 text-primary" />
                      <span className="font-medium">{expense.frequency}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">{expense.nextExpense}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      expense.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded transition-all" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-500 rounded transition-all" title="Edit">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-all" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span>Showing 1 to 3 of 3 entries</span>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white transition-colors">Prev</button>
              <button className="px-3 py-1 bg-primary text-white rounded border border-primary">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white transition-colors">Next</button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
