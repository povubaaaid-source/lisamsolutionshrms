"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye, 
  Check,
  Languages,
  Shield,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";
import PermissionGate from "@/components/auth/PermissionGate";
import { useAuth } from "@/context/AuthContext";
import type { LoginResponse } from "@/lib/auth-contract";

type Company = {
  id: number | string;
  name?: string;
  company_name?: string;
  email?: string;
  package?: string;
  package_type?: string;
  status?: string;
  lastLogin?: string;
};

export default function CompaniesPage() {
  const { showToast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [impersonatingCompanyId, setImpersonatingCompanyId] = useState<number | string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [packageFilter, setPackageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deletingCompanyId, setDeletingCompanyId] = useState<number | string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get("/companies");
      setCompanies(response.data.data || []);
    } catch (err) {
      console.error("Fetch Companies Error:", err);
      showToast("Unable to load companies", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const packageMatch = packageFilter === "all" || company.package?.toLowerCase() === packageFilter;
    const typeMatch = typeFilter === "all" || company.package_type === typeFilter;
    return packageMatch && typeMatch;
  });

  const handleDelete = async () => {
    if (!deletingCompanyId) return;

    try {
      await api.delete(`/companies/${deletingCompanyId}`);
      setCompanies((prev) => prev.filter((company) => company.id !== deletingCompanyId));
      showToast("Company deleted successfully", "success");
      setDeletingCompanyId(null);
    } catch (err) {
      console.error("Delete Company Error:", err);
      showToast("Failed to delete company", "error");
    }
  };

  const handleLoginAsCompany = async (company: Company) => {
    setImpersonatingCompanyId(company.id);
    try {
      const response = await api.post<{ data: LoginResponse }>(`/companies/${company.id}/login`);
      const { token, user } = response.data.data;
      login(token, user, false, "/dashboard");
      showToast(`Logged in as ${company.company_name || company.name} admin.`);
    } catch (err) {
      console.error("Login As Company Error:", err);
      showToast("Unable to login as this company.", "error");
    } finally {
      setImpersonatingCompanyId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="row bg-title mb-6">
            <div className="col-lg-6 col-md-6 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Shield className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Manage Companies
                    <span className="text-info border-l border-[#eee] ml-2 pl-2">{companies.length}</span>
                    <span className="text-[10px] text-gray-400 ml-1 uppercase">Total Companies</span>
                </h4>
            </div>
            <div className="col-lg-6 col-sm-8 col-md-6 col-xs-12 flex justify-end space-x-2">
                <Button className="btn-info btn-outline btn-sm">
                    Manage Default Language <Languages className="h-4 w-4 ml-1 inline-block" />
                </Button>
                <Link href="/super-admin/companies/create">
                  <PermissionGate permission="company.create">
                    <Button className="btn-success btn-outline btn-sm">
                        Add Company <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                  </PermissionGate>
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
                    <Button
                      onClick={() => {
                        setPackageFilter("all");
                        setTypeFilter("all");
                      }}
                      className="btn-inverse btn-sm flex-1"
                    >
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
                        {filteredCompanies.map((company, index) => (
                            <tr key={company.id}>
                                <td>{index + 1}</td>
                                <td>{company.company_name || company.name}</td>
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
                                        <button
                                          type="button"
                                          onClick={() => handleLoginAsCompany(company)}
                                          disabled={impersonatingCompanyId === company.id}
                                          className="btn-info btn-outline p-1 rounded disabled:opacity-60"
                                          title="Login as company admin"
                                        >
                                          {impersonatingCompanyId === company.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <PermissionGate permission="company.edit">
                                          <button type="button" className="btn-success btn-outline p-1 rounded" title="Edit company"><Edit className="h-4 w-4" /></button>
                                        </PermissionGate>
                                        <PermissionGate permission="company.delete">
                                          <button type="button" onClick={() => setDeletingCompanyId(company.id)} className="btn-danger btn-outline p-1 rounded" title="Delete company"><Trash2 className="h-4 w-4" /></button>
                                        </PermissionGate>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredCompanies.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    No companies match this filter
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {loading && (
              <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loading companies...
              </div>
            )}
        </div>

      </div>

      <Modal
        isOpen={!!deletingCompanyId}
        onClose={() => setDeletingCompanyId(null)}
        title="Delete Company"
        size="sm"
      >
        <div className="px-4 py-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <p className="mb-8 text-xs font-bold leading-relaxed text-gray-500">
            This removes the company from the frontend mock store and matches the future PHP delete flow.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setDeletingCompanyId(null)} className="btn-default flex-1">Cancel</Button>
            <Button onClick={handleDelete} className="btn-danger flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
