"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { 
  Layers, 
  RefreshCw, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    expiredCompanies: 0,
    inactiveCompanies: 0,
    totalPackages: 0
  });
  const [recentCompanies, setRecentCompanies] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for legacy parity
      setStats({
        totalCompanies: 24,
        activeCompanies: 18,
        expiredCompanies: 3,
        inactiveCompanies: 3,
        totalPackages: 5
      });
      setRecentCompanies([
        { id: 1, name: "Lisam Solutions", email: "info@lisam.com", package: "Enterprise", date: "2024-05-01" },
        { id: 2, name: "Tech Prodigy", email: "contact@prodigy.io", package: "Professional", date: "2024-05-03" },
        { id: 3, name: "Global HR", email: "admin@globalhr.com", package: "Basic", date: "2024-05-05" }
      ]);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
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
                { label: 'Total Companies', value: stats.totalCompanies, icon: Layers, color: 'bg-info' },
                { label: 'Active Companies', value: stats.activeCompanies, icon: TrendingUp, color: 'bg-success' },
                { label: 'License Expired', value: stats.expiredCompanies, icon: AlertCircle, color: 'bg-danger' },
                { label: 'Inactive Companies', value: stats.inactiveCompanies, icon: Clock, color: 'bg-warning' },
                { label: 'Total Packages', value: stats.totalPackages, icon: ShieldCheck, color: 'bg-secondary' }
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
                <h4 className="box-title mb-6">Recent Registered Companies</h4>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th className="text-center w-16">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Package</th>
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
                                        <span className="label label-info">{company.package}</span>
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
