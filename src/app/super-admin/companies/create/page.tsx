"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Save, Shield, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import apiClient from "@/lib/api-client";

type CompanyAdminPayload = {
  company: {
    name: string;
    email: string;
    phone: string;
    website: string;
    package: string;
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
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CompanyAdminPayload>({
    company: {
      name: "",
      email: "",
      phone: "",
      website: "",
      package: "starter",
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      await apiClient.create("companies", form);
    } catch (err) {
      console.warn("Create company endpoint pending:", err);
    } finally {
      setSaving(false);
      router.push("/super-admin/companies");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="-mx-6 -mt-6 flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-base font-black uppercase tracking-widest text-gray-800">Add Company</h1>
            <p className="mt-1 text-xs font-bold text-gray-400">Create company workspace and assign the first company admin</p>
          </div>
          <Link href="/super-admin/companies">
            <Button className="h-9 border border-gray-200 bg-gray-100 text-xs text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Company Workspace" className="border-none bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required value={form.company.name} onChange={(event) => updateCompany("name", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Company Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required type="email" value={form.company.email} onChange={(event) => updateCompany("email", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
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
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Package</label>
                <select value={form.company.package} onChange={(event) => updateCompany("package", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10">
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="enterprise">Enterprise</option>
                </select>
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
              This user becomes the first admin for the company. Admin users can manage that company&apos;s employees, clients, projects, finance, tickets, and settings.
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required value={form.admin.name} onChange={(event) => updateAdmin("name", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required type="email" value={form.admin.email} onChange={(event) => updateAdmin("email", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input required type="password" value={form.admin.password} onChange={(event) => updateAdmin("password", event.target.value)} className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={saving} className="h-12 bg-primary px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
              <Save className="mr-2 h-4 w-4" /> Create Company and Admin
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
