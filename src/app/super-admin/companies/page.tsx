"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Check,
  Languages,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function CompaniesPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [packageFilter, setPackageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Mock data for legacy parity
      setCompanies([
        { id: 1, name: "Lisam Solutions", email: "info@lisam.com", package: "Enterprise", status: "active", lastLogin: "2024-05-06" },
        { id: 2, name: "Tech Prodigy", email: "contact@prodigy.io", package: "Professional", status: "active", lastLogin: "2024-05-05" },
        { id: 3, name: "Global HR", email: "admin@globalhr.com", package: "Basic", status: "inactive", lastLogin: "2024-04-20" }
      ]);
    } catch (err) {
      console.error("Fetch Companies Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="row bg-title mb-6">
            <div className="col-lg-6 col-md-6 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Shield className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Manage Companies
                    <span className="text-info border-l border-[#eee] ml-2 pl-2">24</span>
                    <span className="text-[10px] text-gray-400 ml-1 uppercase">Total Companies</span>
                </h4>
            </div>
            <div className="col-lg-6 col-sm-8 col-md-6 col-xs-12 flex justify-end space-x-2">
                <Button className="btn-info btn-outline btn-sm">
                    Manage Default Language <Languages className="h-4 w-4 ml-1 inline-block" />
                </Button>
                <Link href="/super-admin/companies/create">
                    <Button className="btn-success btn-outline btn-sm">
                        Add Company <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                </Link>
            </div>
        </div>

        {/* Filter Section */}
        <div className="white-box">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Package</label>
                    <select 
                        value={packageFilter}
                        onChange={(e) => setPackageFilter(e.target.value)}
                        className="form-control"
                    >
                        <option value="all">All Packages</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="professional">Professional</option>
                        <option value="basic">Basic</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Package Type</label>
                    <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="form-control"
                    >
                        <option value="all">All Types</option>
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={fetchCompanies} className="btn-success btn-sm flex-1">
                        <Check className="h-4 w-4 mr-1 inline-block" /> Apply
                    </Button>
                    <Button className="btn-inverse btn-sm flex-1">
                        <RefreshCw className="h-4 w-4 mr-1 inline-block" /> Reset
                    </Button>
                </div>
            </div>
        </div>

        {/* Companies Table */}
        <div className="white-box p-0">
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="w-16">#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Package</th>
                            <th>Status</th>
                            <th>Last Activity</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company, index) => (
                            <tr key={company.id}>
                                <td>{index + 1}</td>
                                <td>{company.name}</td>
                                <td>{company.email}</td>
                                <td>
                                    <span className="label label-info">{company.package}</span>
                                </td>
                                <td>
                                    <span className={`label ${company.status === 'active' ? 'label-success' : 'label-danger'}`}>
                                        {company.status}
                                    </span>
                                </td>
                                <td>{company.lastLogin}</td>
                                <td className="text-right">
                                    <div className="flex justify-end space-x-1">
                                        <button className="btn-info btn-outline p-1 rounded"><Eye className="h-4 w-4" /></button>
                                        <button className="btn-success btn-outline p-1 rounded"><Edit className="h-4 w-4" /></button>
                                        <button className="btn-danger btn-outline p-1 rounded"><Trash2 className="h-4 w-4" /></button>
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
