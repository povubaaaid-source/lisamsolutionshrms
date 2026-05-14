"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import {
    FileText,
    Download,
    Search,
    Filter,
    DollarSign,
    Calendar,
    Building
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function SuperAdminInvoicesPage() {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            // Mock data for legacy parity
            setInvoices([
                { id: 1, company: "Lisam Solutions", package: "Enterprise", amount: 999, status: "paid", date: "2024-05-01" },
                { id: 2, company: "Tech Prodigy", package: "Professional", amount: 199, status: "paid", date: "2024-04-28" },
                { id: 3, company: "Global HR", package: "Basic", amount: 49, status: "pending", date: "2024-05-05" }
            ]);
        } catch (err) {
            console.error("Fetch Invoices Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="row bg-title mb-6">
                    <div className="col-lg-12">
                        <h4 className="page-title m-0">
                            <FileText className="h-5 w-5 mr-2 inline-block text-primary" />
                            Invoices
                        </h4>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="white-box">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-[10px] text-gray-400 uppercase mb-1">Company</label>
                            <div className="relative">
                                <input type="text" className="form-control pl-8" placeholder="Search Company..." />
                                <Search className="h-3 w-3 absolute left-3 top-2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-400 uppercase mb-1">Status</label>
                            <select className="form-control">
                                <option>All Status</option>
                                <option>Paid</option>
                                <option>Unpaid</option>
                                <option>Pending</option>
                            </select>
                        </div>
                        <div>
                            <Button className="btn-success btn-sm w-full">
                                <Filter className="h-4 w-4 mr-2" /> Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="white-box p-0">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="w-16">#</th>
                                    <th><Building className="h-4 w-4 inline-block mr-1" /> Company</th>
                                    <th>Package</th>
                                    <th><DollarSign className="h-4 w-4 inline-block mr-1" /> Amount</th>
                                    <th>Status</th>
                                    <th><Calendar className="h-4 w-4 inline-block mr-1" /> Date</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, index) => (
                                    <tr key={inv.id}>
                                        <td>{index + 1}</td>
                                        <td className="font-bold text-primary cursor-pointer hover:underline">{inv.company}</td>
                                        <td>{inv.package}</td>
                                        <td>${inv.amount}</td>
                                        <td>
                                            <span className={`label ${inv.status === 'paid' ? 'label-success' : 'label-warning'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td>{new Date(inv.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="text-right">
                                            <button className="btn-info btn-outline p-1 rounded hover:bg-info hover:text-white transition-all">
                                                <Download className="h-4 w-4" />
                                            </button>
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
