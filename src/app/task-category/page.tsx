"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: 1, name: "Development", tasks: 45 },
  { id: 2, name: "Design", tasks: 22 },
  { id: 3, name: "Bug Fix", tasks: 12 },
  { id: 4, name: "Marketing", tasks: 8 },
];

export default function TaskCategoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 gap-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Task Categories</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-700">Task Categories</span>
            </div>
          </div>
          <Button className="flex items-center space-x-1 bg-primary hover:bg-primary/90 text-white border-none text-[10px] h-8 px-3">
            <Plus className="h-3 w-3" />
            <span>Add Category</span>
          </Button>
        </div>

        <Card className="p-0 overflow-hidden shadow-sm border border-gray-100 max-w-4xl mx-auto">
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
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Tasks</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-3.5 w-3.5 text-primary opacity-60" />
                      <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {cat.tasks} Tasks
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
