"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Plus, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";

export default function TaxesSettingsPage() {
  const taxes = [
    { id: 1, name: "VAT", rate: "10%" },
    { id: 2, name: "GST", rate: "18%" },
    { id: 3, name: "Sales Tax", rate: "5%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Tax Settings</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/settings" className="hover:text-primary transition-colors font-bold">Settings</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Taxes</span>
            </div>
          </div>
          <Link href="/settings">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-3 hover:bg-gray-200">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>Back to Settings</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-800 tracking-wide flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" /> 
                    Tax Rates
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Manage the tax rates applied to your invoices and estimates.</p>
                </div>
                <Button className="bg-primary/10 text-primary border-none text-[10px] font-bold px-4 h-8 uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Tax
                </Button>
              </div>

              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Tax Name</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Rate (%)</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {taxes.map((tax) => (
                      <tr key={tax.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">{tax.name}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-600">{tax.rate}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-400 hover:text-blue-600 transition-colors p-1"><Edit className="h-4 w-4" /></button>
                            <button className="text-red-400 hover:text-red-600 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card className="p-6 border-blue-200 bg-blue-50/50 shadow-sm">
              <h3 className="text-sm font-bold text-blue-800 mb-2">How Taxes Work</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Taxes added here will be available to select when creating new invoices, estimates, or expenses. You can add multiple tax rates to a single item.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
