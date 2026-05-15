"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Eye, EyeOff, Mail, Save, Shield, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import apiClient from "@/lib/api-client";
import { emailPattern, validateAdminPassword } from "@/lib/admin-password";
import { useToast } from "@/context/ToastContext";

type CompanyAdminPayload = {
  company: {
    name: string;
    email: string;
    phone: string;
    website: string;
    status: string;
  };
  admin: {
    name: string;
    email: string;
    password: string;
    role: "admin";
  };
};

export default function CreateCompanyPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [form, setForm] = useState<CompanyAdminPayload>({
    company: {
      name: "",
      email: "",
      phone: "",
      website: "",
      status: "active",
    },
    admin: {
      name: "",
      email: "",
      password: "",
      role: "admin",
    },
  });

  const updateCompany = (name: keyof CompanyAdminPayload["company"], value: string) => {
    setForm((current) => ({ ...current, company: { ...current.company, [name]: value } }));
  };

  const updateAdmin = (name: keyof CompanyAdminPayload["admin"], value: string) => {
    setForm((current) => ({ ...current, admin: { ...current.admin, [name]: value } }));
  };

  const passwordValidationMessage = useMemo(
    () =>
      validateAdminPassword({
        password: form.admin.password,
        required: true,
        name: form.admin.name,
        email: form.admin.email,
        companyName: form.company.name,
      }),
    [form.admin.email, form.admin.name, form.admin.password, form.company.name],
  );

  const visiblePasswordError = passwordTouched && passwordValidationMessage;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.company.name.trim() || !form.company.email.trim() || !form.admin.name.trim() || !form.admin.email.trim()) {
      showToast("Company name, company email, admin name, and admin email are required.", "error");
      return;
    }
    if (!emailPattern.test(form.company.email.trim())) {
      showToast("Enter a valid company email address.", "error");
      return;
    }
    if (!emailPattern.test(form.admin.email.trim())) {
      showToast("Enter a valid admin email address.", "error");
      return;
    }
    if (passwordValidationMessage) {
      setPasswordTouched(true);
      showToast(passwordValidationMessage, "error");
      return;
    }

    setSaving(true);

    try {
      await apiClient.create("companies", {
        company: {
          ...form.company,
          name: form.company.name.trim(),
          email: form.company.email.trim(),
        },
        admin: {
          ...form.admin,
          name: form.admin.name.trim(),
          email: form.admin.email.trim(),
          password: form.admin.password.trim(),
        },
      });
      showToast("Company and admin created successfully.");
      router.push("/super-admin/admins");
    } catch (err) {
      console.warn("Create company endpoint pending:", err);
      showToast("Unable to create company and admin.", "error");
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="-mx-6 -mt-6 flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-base font-black uppercase tracking-widest text-gray-800">Add Company / Branch</h1>
            <p className="mt-1 text-xs font-bold text-gray-400">Create an internal company or branch record and assign the first admin</p>
          </div>
          <Link href="/super-admin/companies">
            <Button className="h-9 border border-gray-200 bg-gray-100 text-xs text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-6">
          <Card title="Company / Branch Workspace" className="border-none bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Company / Branch Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required autoComplete="off" value={form.company.name} onChange={(event) => updateCompany("name", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Company Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required type="email" autoComplete="off" value={form.company.email} onChange={(event) => updateCompany("email", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                <input value={form.company.phone} onChange={(event) => updateCompany("phone", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Website</label>
                <input value={form.company.website} onChange={(event) => updateCompany("website", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                <select value={form.company.status} onChange={(event) => updateCompany("status", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Company Admin Access" className="border-none bg-white p-8 shadow-sm">
            <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs font-bold leading-relaxed text-blue-700">
              This user becomes the first admin for this company or branch. Admin users can manage records based on permissions assigned by Super Admin.
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required autoComplete="off" value={form.admin.name} onChange={(event) => updateAdmin("name", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required type="email" autoComplete="new-email" value={form.admin.email} onChange={(event) => updateAdmin("email", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input
                    required
                    minLength={8}
                    type={showAdminPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.admin.password}
                    onBlur={() => setPasswordTouched(true)}
                    onChange={(event) => {
                      setPasswordTouched(true);
                      updateAdmin("password", event.target.value);
                    }}
                    className={`w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-12 text-xs font-bold outline-none focus:ring-2 ${
                      visiblePasswordError
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-100 focus:ring-primary/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword((current) => !current)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label={showAdminPassword ? "Hide password" : "Show password"}
                    title={showAdminPassword ? "Hide password" : "Show password"}
                  >
                    {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {visiblePasswordError ? (
                  <p className="mt-1.5 text-[10px] font-bold text-red-500">{passwordValidationMessage}</p>
                ) : (
                  <p className="mt-1.5 text-[10px] font-bold text-gray-400">Required. Use a unique password with 8 or more characters.</p>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={saving} className="h-12 bg-primary px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
              <Save className="mr-2 h-4 w-4" /> Create Record and Admin
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
