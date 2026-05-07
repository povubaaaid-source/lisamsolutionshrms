"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, Shield, Check, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RolePermissionPage() {
  const [activeRole, setActiveRole] = useState("Admin");

  const roles = ["Admin", "Employee", "Client"];

  const permissionsList = [
    { module: "Projects", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Tasks", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Clients", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Employees", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Invoices", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Tickets", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Time Logs", actions: ["Add", "View", "Edit", "Delete"] },
    { module: "Messages", actions: ["Add", "View", "Edit", "Delete"] },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Roles & Permissions</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/settings" className="hover:text-primary transition-colors font-bold">Settings</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Roles & Permissions</span>
            </div>
          </div>
          <Link href="/settings">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-3 hover:bg-gray-200">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>Back to Settings</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Roles</h3>
                <Button className="bg-primary/10 text-primary border-none text-[10px] h-7 px-2 hover:bg-primary hover:text-white transition-colors">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-2 space-y-1">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`w-full text-left px-4 py-3 rounded text-sm font-bold transition-colors flex items-center justify-between group ${
                      activeRole === role
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <Shield className={`h-4 w-4 mr-3 ${activeRole === role ? "text-white/70" : "text-gray-400"}`} />
                      {role}
                    </div>
                    {role !== "Admin" && (
                       <Trash2 className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeRole === role ? "text-white/50 hover:text-white" : "text-red-400 hover:text-red-600"}`} />
                    )}
                  </button>
                ))}
              </div>
            </Card>
            
            <Card className="p-4 border-gray-100 bg-yellow-50 shadow-sm border border-yellow-200">
              <h4 className="text-xs font-bold text-yellow-800 mb-2">Note:</h4>
              <p className="text-[10px] text-yellow-700 leading-relaxed">The <strong>Admin</strong> role has full access to all modules by default and cannot be deleted or restricted.</p>
            </Card>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-3">
            <Card className="p-0 border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-800 tracking-wide flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" /> 
                    {activeRole} Permissions
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure access levels for the {activeRole} role across the platform.</p>
                </div>
                <Button className="bg-primary text-white text-[10px] font-bold px-6 h-9 uppercase tracking-widest shadow-sm shadow-primary/20">
                  <Save className="h-3.5 w-3.5 mr-2" /> Save Changes
                </Button>
              </div>

              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest w-1/3">Module Name</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Add</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">View</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Edit</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {permissionsList.map((perm) => (
                      <tr key={perm.module} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{perm.module}</td>
                        {perm.actions.map((action, idx) => {
                          // Mocking checked state based on role
                          let isChecked = false;
                          if (activeRole === "Admin") isChecked = true;
                          else if (activeRole === "Employee" && (action === "View" || action === "Add")) isChecked = true;
                          else if (activeRole === "Client" && action === "View" && (perm.module === "Projects" || perm.module === "Invoices")) isChecked = true;

                          return (
                            <td key={idx} className="px-6 py-4 text-center">
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={isChecked}
                                    readOnly
                                    disabled={activeRole === "Admin"}
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary opacity-80 peer-disabled:opacity-50"></div>
                                </label>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
