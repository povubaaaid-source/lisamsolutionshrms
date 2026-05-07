"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, CreditCard, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default function CreatePaymentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Add Payment</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/payments" className="hover:text-primary transition-colors font-bold">Payments</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Add Payment</span>
            </div>
          </div>
          <Link href="/payments">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-3 hover:bg-gray-200">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>Back to Payments</span>
            </Button>
          </Link>
        </div>

        <Card className="p-8 max-w-4xl mx-auto shadow-sm border-gray-100">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project <span className="text-red-500">*</span></label>
                <select className="w-full border-gray-200 rounded p-2.5 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all" required>
                  <option value="">Select Project</option>
                  <option>Website Redesign</option>
                  <option>Mobile App</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Invoice</label>
                <select className="w-full border-gray-200 rounded p-2.5 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all">
                  <option value="">Select Invoice</option>
                  <option>INV#001</option>
                  <option>INV#002</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Paid On <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input type="date" className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount <span className="text-red-500">*</span></label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input type="number" placeholder="0.00" className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payment Gateway</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <select className="w-full border-gray-200 rounded p-2.5 pl-9 text-xs focus:ring-1 focus:ring-primary/20 outline-none transition-all">
                    <option>Paypal</option>
                    <option>Stripe</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Remarks</label>
              <textarea className="w-full border-gray-200 rounded p-2.5 text-xs focus:ring-1 focus:ring-primary/20 outline-none h-24 transition-all" placeholder="Enter payment remarks..."></textarea>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-end space-x-3">
              <Link href="/payments">
                <Button className="bg-white text-gray-500 border border-gray-200 text-[10px] font-bold px-6 h-10 uppercase tracking-widest hover:bg-gray-50 transition-all">
                  Cancel
                </Button>
              </Link>
              <Button className="bg-primary text-white text-[10px] font-bold px-8 h-10 uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
                <Save className="h-3.5 w-3.5 mr-2" />
                Save Payment
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
