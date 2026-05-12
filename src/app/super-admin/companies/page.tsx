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
  AlertTriangle,
  Save
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
  status?: string;
  lastLogin?: string;
};

export default function CompaniesPage() {
  const { showToast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [impersonatingCompanyId, setImpersonatingCompanyId] = useState<number | string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingCompanyId, setDeletingCompanyId] = useState<number | string | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    status: "active",
  });

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
    const query = search.trim().toLowerCase();
    const searchMatch = !query || `${company.company_name || company.name || ""} ${company.email || ""}`.toLowerCase().includes(query);
    const statusMatch = statusFilter === "all" || company.status === statusFilter;
    return searchMatch && statusMatch;
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

  const openCompanyEditor = (company: Company) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.company_name || company.name || "",
      email: company.email || "",
      status: company.status || "active",
    });
  };

  const handleCompanyUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingCompany) return;

    try {
      await api.put(`/companies/${editingCompany.id}`, companyForm);
      showToast("Company updated successfully", "success");
    } catch (err) {
      console.warn("Update Company Error:", err);
      showToast("Company updated locally. PHP endpoint should persist this payload.", "error");
    } finally {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === editingCompany.id
            ? { ...company, name: companyForm.name, company_name: companyForm.name, email: companyForm.email, status: companyForm.status }
            : company
        )
      );
      setEditingCompany(null);
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
                    Company / Branches
                    <span className="text-info border-l border-[#eee] ml-2 pl-2">{companies.length}</span>
                    <span className="text-[10px] text-gray-400 ml-1 uppercase">Total Records</span>
                </h4>
            </div>
            <div className="col-lg-6 col-sm-8 col-md-6 col-xs-12 flex justify-end space-x-2">
                <Button className="btn-info btn-outline btn-sm">
                    Manage Default Language <Languages className="h-4 w-4 ml-1 inline-block" />
                </Button>
                <Link href="/super-admin/companies/create">
                  <PermissionGate permission="company.create">
                    <Button className="btn-success btn-outline btn-sm">
                        Add Company / Branch <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                  </PermissionGate>
                </Link>
            </div>
        </div>

        {/* Filter Section */}
        <div className="white-box">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Search</label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        placeholder="Name or email"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Status</label>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-control"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={fetchCompanies} className="btn-success btn-sm flex-1">
                        <Check className="h-4 w-4 mr-1 inline-block" /> Apply
                    </Button>
                    <Button
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("all");
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
                                          <button type="button" onClick={() => openCompanyEditor(company)} className="btn-success btn-outline p-1 rounded" title="Edit company"><Edit className="h-4 w-4" /></button>
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
                                <td colSpan={6} className="py-16 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    No company or branch records match this filter
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {loading && (
              <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loading company / branch records...
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
            This removes the company or branch from the frontend mock store and matches the future PHP delete flow.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setDeletingCompanyId(null)} className="btn-default flex-1">Cancel</Button>
            <Button onClick={handleDelete} className="btn-danger flex-1">Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!editingCompany}
        onClose={() => setEditingCompany(null)}
        title="Edit Company"
        size="md"
      >
        <form onSubmit={handleCompanyUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Company / Branch Name</label>
              <input required value={companyForm.name} onChange={(event) => setCompanyForm((prev) => ({ ...prev, name: event.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</label>
              <input required type="email" value={companyForm.email} onChange={(event) => setCompanyForm((prev) => ({ ...prev, email: event.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-bold" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
              <select value={companyForm.status} onChange={(event) => setCompanyForm((prev) => ({ ...prev, status: event.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-bold">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 border-t border-gray-100 pt-5">
            <Button type="button" onClick={() => setEditingCompany(null)} className="btn-default flex-1">Cancel</Button>
            <Button type="submit" className="btn-success flex-1"><Save className="h-4 w-4 mr-2" /> Save Record</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
