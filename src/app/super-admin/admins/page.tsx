"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import {
  getModulesFromPermissions,
  rolePermissions,
  type PermissionKey,
} from "@/lib/auth-contract";
import { emailPattern, validateAdminPassword } from "@/lib/admin-password";
import { useToast } from "@/context/ToastContext";

type Company = {
  id: number | string;
  name?: string;
  company_name?: string;
  status?: string;
};

type AdminAccount = {
  id: number | string;
  name: string;
  email: string;
  password?: string;
  role: "admin";
  company_id: number | string;
  company?: Company;
  status: "active" | "inactive";
  permissions: PermissionKey[];
  modules?: string[];
  last_login_at?: string | null;
  created_at?: string;
};

type AdminFormState = {
  name: string;
  email: string;
  password: string;
  company_id: string;
  status: "active" | "inactive";
  permissions: PermissionKey[];
};

const profilePermission: PermissionKey = "profile.*";

const permissionTemplates: Array<{ id: string; label: string; permissions: PermissionKey[] }> = [
  { id: "full", label: "Full Access", permissions: rolePermissions.admin },
  {
    id: "hr",
    label: "HR Admin",
    permissions: [
      "dashboard.view",
      "employees.*",
      "hr.*",
      "shifts.*",
      "attendance.*",
      "leaves.*",
      "recruitment.*",
      "reports.view",
      "reports.export",
      "events.view",
      "notices.view",
      profilePermission,
    ],
  },
  {
    id: "project",
    label: "Project Admin",
    permissions: [
      "dashboard.view",
      "clients.view",
      "projects.*",
      "tasks.*",
      "tickets.*",
      "reports.view",
      "messages.*",
      "events.view",
      profilePermission,
    ],
  },
  {
    id: "finance",
    label: "Finance Admin",
    permissions: [
      "dashboard.view",
      "clients.view",
      "products.*",
      "finance.*",
      "payroll.view",
      "reports.view",
      "reports.export",
      profilePermission,
    ],
  },
];

const emptyForm: AdminFormState = {
  name: "",
  email: "",
  password: "",
  company_id: "",
  status: "active",
  permissions: ["dashboard.view", profilePermission],
};

const normalizePermissions = (permissions: PermissionKey[]) => Array.from(new Set([...permissions, profilePermission]));

const getCompanyName = (company?: Company) => company?.company_name || company?.name || "Unassigned";

const getAdminCompanyId = (admin: AdminAccount) => String(admin.company_id || admin.company?.id || "");

const sameId = (left?: number | string, right?: number | string) => String(left ?? "") === String(right ?? "");

const getPermissionSignature = (permissions: PermissionKey[]) => normalizePermissions(permissions).sort().join("|");

const getAdminRoleLabel = (permissions: PermissionKey[] = []) => {
  const permissionSignature = getPermissionSignature(permissions);
  const exactTemplate = permissionTemplates.find((template) => getPermissionSignature(template.permissions) === permissionSignature);
  if (exactTemplate) return exactTemplate.label;
  if (permissions.includes("*")) return "Full Access";
  return "Custom Admin";
};

export default function SuperAdminAdminsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminAccount | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<AdminFormState>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminsResponse, companiesResponse] = await Promise.all([api.get("/admins"), api.get("/companies")]);
      setAdmins((adminsResponse.data.data || []).map((admin: AdminAccount) => ({
        ...admin,
        status: admin.status || "active",
        permissions: normalizePermissions(admin.permissions || []),
      })));
      setCompanies(companiesResponse.data.data || []);
    } catch (error) {
      console.error("Load platform admins failed:", error);
      showToast("Unable to load company admins.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const companyMap = useMemo(() => new Map(companies.map((company) => [String(company.id), company])), [companies]);

  const selectedCompanyName = useMemo(() => {
    const selectedCompany = companyMap.get(form.company_id) || (editingAdmin && sameId(getAdminCompanyId(editingAdmin), form.company_id) ? editingAdmin.company : undefined);
    return getCompanyName(selectedCompany);
  }, [companyMap, editingAdmin, form.company_id]);

  const passwordValidationMessage = useMemo(
    () =>
      validateAdminPassword({
        password: form.password,
        required: false,
        name: form.name,
        email: form.email,
        companyName: selectedCompanyName,
      }),
    [form.email, form.name, form.password, selectedCompanyName],
  );

  const visiblePasswordError = passwordTouched && passwordValidationMessage;

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();

    return admins.filter((admin) => {
      const company = admin.company || companyMap.get(getAdminCompanyId(admin));
      const text = `${admin.name} ${admin.email} ${getCompanyName(company)} ${getAdminRoleLabel(admin.permissions || [])}`.toLowerCase();
      const searchMatch = !query || text.includes(query);
      const companyMatch = companyFilter === "all" || getAdminCompanyId(admin) === companyFilter;
      const statusMatch = statusFilter === "all" || admin.status === statusFilter;
      return searchMatch && companyMatch && statusMatch;
    });
  }, [admins, companyFilter, companyMap, search, statusFilter]);

  const stats = useMemo(() => {
    const activeAdmins = admins.filter((admin) => admin.status === "active").length;
    const companyIds = new Set(admins.map((admin) => getAdminCompanyId(admin)).filter(Boolean));
    const restrictedAdmins = admins.filter((admin) => !(admin.permissions || []).includes("*") && admin.permissions.length < rolePermissions.admin.length).length;
    return {
      total: admins.length,
      active: activeAdmins,
      companies: companyIds.size,
      restricted: restrictedAdmins,
    };
  }, [admins]);

  const openEditForm = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setForm({
      name: admin.name || "",
      email: admin.email || "",
      password: String(admin.password || ""),
      company_id: getAdminCompanyId(admin),
      status: admin.status || "active",
      permissions: normalizePermissions(admin.permissions || []),
    });
    setShowPassword(false);
    setPasswordTouched(false);
    setFormOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingAdmin) {
      showToast("Admins can only be edited from this panel for now.", "error");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.company_id) {
      showToast("Name, email, and company are required.", "error");
      return;
    }
    if (!emailPattern.test(form.email.trim())) {
      showToast("Enter a valid admin email address.", "error");
      return;
    }
    if (passwordValidationMessage) {
      setPasswordTouched(true);
      showToast(passwordValidationMessage, "error");
      return;
    }

    const duplicateEmail = admins.some(
      (admin) => admin.email.toLowerCase() === form.email.trim().toLowerCase() && String(admin.id) !== String(editingAdmin?.id || ""),
    );
    if (duplicateEmail) {
      showToast("Another admin already uses this email.", "error");
      return;
    }

    const nextPermissions = normalizePermissions(form.permissions);
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim() || undefined,
      role: "admin",
      company_id: form.company_id,
      status: form.status,
      permissions: nextPermissions,
      modules: getModulesFromPermissions(nextPermissions),
    };

    try {
      const response = await api.put(`/admins/${editingAdmin.id}`, payload);
      const updated = response.data.data || { ...editingAdmin, ...payload };
      setAdmins((current) => current.map((admin) => (sameId(admin.id, editingAdmin.id) ? updated : admin)));
      showToast("Admin access updated successfully.");
      setFormOpen(false);
      setEditingAdmin(null);
    } catch (error) {
      console.error("Save admin failed:", error);
      showToast("Unable to save admin access.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (admin: AdminAccount) => {
    const nextStatus = admin.status === "active" ? "inactive" : "active";

    try {
      const response = await api.put(`/admins/${admin.id}`, { ...admin, status: nextStatus });
      const updated = response.data.data || { ...admin, status: nextStatus };
      setAdmins((current) => current.map((item) => (sameId(item.id, admin.id) ? updated : item)));
      showToast(`Admin ${nextStatus === "active" ? "activated" : "deactivated"}.`);
    } catch (error) {
      console.error("Status update failed:", error);
      showToast("Unable to update admin status.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingAdmin) return;

    try {
      await api.delete(`/admins/${deletingAdmin.id}`);
      setAdmins((current) => current.filter((admin) => !sameId(admin.id, deletingAdmin.id)));
      showToast("Admin deleted successfully.");
    } catch (error) {
      console.error("Delete admin failed:", error);
      showToast("Unable to delete admin.", "error");
    } finally {
      setDeletingAdmin(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="-mx-4 -mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 shadow-sm sm:-mx-6 sm:-mt-6 sm:px-6">
          <div>
            <h1 className="text-base font-black uppercase tracking-widest text-gray-800">Company Admins</h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Platform controlled admin access</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Total Admins", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Company / Branches", value: stats.companies },
            { label: "Restricted", value: stats.restricted },
          ].map((item) => (
            <Card key={item.label} className="border-none bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-gray-900">{item.value}</p>
            </Card>
          ))}
        </div>

        <Card className="border-none bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_180px_auto]">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-xs font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Name, email, company"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Company / Branch</label>
              <select
                value={companyFilter}
                onChange={(event) => setCompanyFilter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="all">All Company / Branches</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {getCompanyName(company)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="button" onClick={fetchData} loading={loading} className="h-11 border-none bg-gray-100 px-4 text-gray-600">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCompanyFilter("all");
                  setStatusFilter("all");
                }}
                className="h-11 border-none bg-gray-100 px-4 text-gray-600"
              >
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-none bg-white p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="min-w-64 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Admin</th>
                  <th className="min-w-52 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Company</th>
                  <th className="min-w-40 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Role</th>
                  <th className="min-w-56 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Modules</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAdmins.map((admin) => {
                  const company = admin.company || companyMap.get(getAdminCompanyId(admin));
                  const modules = getModulesFromPermissions(admin.permissions || []);
                  const roleLabel = getAdminRoleLabel(admin.permissions || []);
                  return (
                    <tr key={admin.id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserCog className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800">{admin.name}</p>
                            <p className="mt-1 text-[11px] font-bold text-gray-400">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {getCompanyName(company)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-600">
                          {roleLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex max-w-md flex-wrap gap-1.5">
                          {modules.slice(0, 5).map((moduleKey) => (
                            <span key={moduleKey} className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-blue-600">
                              {moduleKey}
                            </span>
                          ))}
                          {modules.length > 5 && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
                              +{modules.length - 5}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${admin.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(admin)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:bg-primary/10"
                            title={admin.status === "active" ? "Deactivate admin" : "Activate admin"}
                          >
                            {admin.status === "active" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditForm(admin)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            title="Edit admin"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingAdmin(admin)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            title="Delete admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                      No admins match this filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading admins...</div>}
        </Card>
      </div>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Edit Admin" size="xl">
        <form key={editingAdmin ? `edit-admin-${editingAdmin.id}` : "edit-admin"} onSubmit={handleSave} noValidate autoComplete="off" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
              <input
                required
                autoComplete="off"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
              <input
                required
                type="email"
                autoComplete="new-email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Company / Branch</label>
              <input
                readOnly
                value={form.company_id ? selectedCompanyName : "Unassigned"}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-bold text-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as AdminFormState["status"] }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onBlur={() => setPasswordTouched(true)}
                  onChange={(event) => {
                    setPasswordTouched(true);
                    setForm((current) => ({ ...current, password: event.target.value }));
                  }}
                  className={`w-full rounded-xl border bg-white py-3 pl-4 pr-12 text-xs font-bold text-gray-700 outline-none transition focus:ring-2 ${
                    visiblePasswordError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 focus:border-primary focus:ring-primary/10"
                  }`}
                  placeholder="Saved admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {visiblePasswordError ? (
                <p className="mt-1.5 text-[10px] font-bold text-red-500">{passwordValidationMessage}</p>
              ) : (
                <p className="mt-1.5 text-[10px] font-bold text-gray-400">
                  Saved password is loaded here. Use the eye button to view it or type a new one.
                </p>
              )}
            </div>
          </div>


          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
            <Button type="button" onClick={() => setFormOpen(false)} className="h-10 border-none bg-gray-100 px-5 text-gray-600">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="h-10 bg-primary px-6 text-[10px] font-black uppercase tracking-widest text-white">
              <Save className="h-4 w-4" />
              Save Admin
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingAdmin} onClose={() => setDeletingAdmin(null)} title="Delete Admin" size="sm">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <p className="text-sm font-black text-gray-800">{deletingAdmin?.name}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-gray-500">{deletingAdmin?.email}</p>
          <div className="mt-6 flex gap-3">
            <Button type="button" onClick={() => setDeletingAdmin(null)} className="h-10 flex-1 border-none bg-gray-100 text-gray-600">
              Cancel
            </Button>
            <Button type="button" onClick={handleDelete} className="h-10 flex-1 border-none bg-red-500 text-white">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
