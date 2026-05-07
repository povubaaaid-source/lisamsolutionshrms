"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Settings,
  Package,
  CheckCircle2,
  XCircle,
  HardDrive,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function PackagesPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      // Mock data for legacy parity
      setPackages([
        { id: 1, name: "Free", annualPrice: 0, monthlyPrice: 0, employees: 5, storage: "100 MB", modules: 10, isDefault: true },
        { id: 2, name: "Starter", annualPrice: 199, monthlyPrice: 19, employees: 20, storage: "1 GB", modules: 25, isDefault: false },
        { id: 3, name: "Enterprise", annualPrice: 999, monthlyPrice: 99, employees: 1000, storage: "Unlimited", modules: "All", isDefault: false }
      ]);
    } catch (err) {
      console.error("Fetch Packages Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="row bg-title mb-6">
            <div className="col-lg-6 col-md-6 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <Package className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Packages List
                    <span className="text-info border-l border-[#eee] ml-2 pl-2">3</span>
                    <span className="text-[10px] text-gray-400 ml-1 uppercase font-bold">Total Packages</span>
                </h4>
            </div>
            <div className="col-lg-6 col-sm-8 col-md-6 col-xs-12 flex justify-end space-x-2">
                <Button className="btn-info btn-outline btn-sm">
                    Free Trial Settings <Settings className="h-4 w-4 ml-1 inline-block" />
                </Button>
                <Link href="/super-admin/packages/create">
                    <Button className="btn-success btn-outline btn-sm">
                        Add Package <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                </Link>
            </div>
        </div>

        {/* Packages Table */}
        <div className="white-box p-0">
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="w-16">#</th>
                            <th>Name</th>
                            <th>Annual Price ($)</th>
                            <th>Monthly Price ($)</th>
                            <th><Users className="h-4 w-4 inline-block mr-1" /> Employees</th>
                            <th><HardDrive className="h-4 w-4 inline-block mr-1" /> Storage</th>
                            <th>Modules</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg, index) => (
                            <tr key={pkg.id}>
                                <td>{index + 1}</td>
                                <td className="font-bold">{pkg.name}</td>
                                <td>${pkg.annualPrice}</td>
                                <td>${pkg.monthlyPrice}</td>
                                <td>{pkg.employees}</td>
                                <td>{pkg.storage}</td>
                                <td>
                                    <span className="label label-info">{pkg.modules}</span>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end space-x-1">
                                        <button className="btn-success btn-outline p-1 rounded"><Edit className="h-4 w-4" /></button>
                                        {!pkg.isDefault && (
                                            <button className="btn-danger btn-outline p-1 rounded"><Trash2 className="h-4 w-4" /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Note Section (Parity with legacy) */}
        <div className="white-box bg-[#eef6fe] border-none">
            <h5 className="text-[#3594fa] font-bold mb-3 uppercase flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Note:
            </h5>
            <ul className="space-y-1 text-[11px] text-gray-500 font-medium">
                <li>• The first package created will be the default package for new registrations unless configured otherwise.</li>
                <li>• Default packages cannot be deleted to ensure system stability.</li>
                <li>• Changing a package price will only affect new subscriptions.</li>
            </ul>
        </div>

      </div>
    </DashboardLayout>
  );
}
