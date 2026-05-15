"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Layers, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalBranches: 0,
    activeBranches: 0,
    inactiveBranches: 0,
    admins: 0,
    permissionProfiles: 0
  });
  const [recentCompanies, setRecentCompanies] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      // Mock data for legacy parity
      setStats({
        totalBranches: 6,
        activeBranches: 5,
        inactiveBranches: 1,
        admins: 4,
        permissionProfiles: 8
      });
      setRecentCompanies([
        { id: 1, name: "Head Office", email: "info@lisam.com", status: "Active", date: "2024-05-01" },
        { id: 2, name: "Operations Branch", email: "operations@lisam.com", status: "Active", date: "2024-05-03" },
        { id: 3, name: "Remote Team", email: "remote@lisam.com", status: "Inactive", date: "2024-05-05" }
      ]);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="row bg-title mb-6">
            <div className="col-lg-12">
                <h4 className="page-title m-0">
                    <ShieldCheck className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Super Admin Dashboard
                </h4>
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
                { label: 'Company / Branches', value: stats.totalBranches, icon: Layers, color: 'bg-info' },
                { label: 'Active Branches', value: stats.activeBranches, icon: TrendingUp, color: 'bg-success' },
                { label: 'Inactive Branches', value: stats.inactiveBranches, icon: AlertCircle, color: 'bg-warning' },
                { label: 'Company Admins', value: stats.admins, icon: Users, color: 'bg-secondary' },
            ].map((stat, i) => (
                <div key={i} className="white-box p-4 flex items-center">
                    <div className={`h-10 w-10 ${stat.color} text-white flex items-center justify-center rounded mr-4`}>
                        <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="white-box">
                <h4 className="box-title mb-6">Recent Company / Branch Records</h4>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th className="text-center w-16">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th className="text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCompanies.map((company, i) => (
                                <tr key={company.id}>
                                    <td className="text-center">{i + 1}</td>
                                    <td>{company.name}</td>
                                    <td>{company.email}</td>
                                    <td>
                                        <span className={`label ${company.status === "Active" ? "label-success" : "label-warning"}`}>{company.status}</span>
                                    </td>
                                    <td className="text-center">{new Date(company.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
