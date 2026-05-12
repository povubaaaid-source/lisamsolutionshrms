"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/context/ToastContext";
import { RefreshCw, Save, ArrowLeft, AlertCircle, Shield, Clock } from "lucide-react";
import { Employee } from "@/types";

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
  employee_id: z.string().min(1, "Employee ID is required"),
  joining_date: z.string().min(1, "Joining date is required"),
  department_id: z.string().min(1, "Please select a department"),
  designation_id: z.string().min(1, "Please select a designation"),
  shift_type_id: z.string().optional(),
  role: z.enum(["admin", "employee"]),
  mobile: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

type DepartmentOption = {
  id: number | string;
  team_name: string;
};

type DesignationOption = {
  id: number | string;
  name: string;
};

type ShiftTypeOption = {
  id: number | string;
  shift_name: string;
  code?: string;
  start_time?: string;
  end_time?: string;
};

type EmployeeUpdatePayload = {
  name: string;
  email: string;
  role: "admin" | "employee";
  password?: string;
  department_id: string;
  designation_id: string;
  shift_type_id?: string;
  employee_detail: {
    employee_id: string;
    joining_date: string;
    department_id: string;
    designation_id: string;
    shift_type_id?: string;
    mobile?: string;
    address?: string;
  };
};

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [designations, setDesignations] = useState<DesignationOption[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftTypeOption[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, desigRes, shiftRes] = await Promise.all([
          api.get(`/employee/${params.id}`),
          api.get("/department"),
          api.get("/designation"),
          api.get("/shift-types"),
        ]);

        const data = empRes.data.data as Employee;
        setEmployee(data);
        setDepartments(deptRes.data.data || []);
        setDesignations(desigRes.data.data || []);
        setShiftTypes(shiftRes.data.data || []);

        reset({
          name: data.name,
          email: data.email,
          employee_id: data.employee_detail?.employee_id || "",
          joining_date: data.employee_detail?.joining_date || "",
          department_id: data.employee_detail?.department_id?.toString() || "",
          designation_id: data.employee_detail?.designation_id?.toString() || "",
          shift_type_id: data.employee_detail?.shift_type_id?.toString() || "",
          role: data.role === "admin" ? "admin" : "employee",
          mobile: data.employee_detail?.mobile || "",
          address: data.employee_detail?.address || "",
        });
      } catch (err: unknown) {
        console.error("Fetch Edit Data Error:", err);
        showToast("Failed to load employee data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, reset, showToast]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setSaving(true);
      try {
      const payload: EmployeeUpdatePayload = {
        name: data.name,
        email: data.email,
        role: data.role,
        department_id: data.department_id,
        designation_id: data.designation_id,
        shift_type_id: data.shift_type_id,
        employee_detail: {
          employee_id: data.employee_id,
          joining_date: data.joining_date,
            department_id: data.department_id,
            designation_id: data.designation_id,
            shift_type_id: data.shift_type_id,
            mobile: data.mobile,
          address: data.address
        }
      };
      
      if (data.password) {
        payload.password = data.password;
      }

      await api.put(`/employee/${params.id}`, payload);
      await api.post("/employees/assignRole", {
        user_id: params.id,
        role: data.role,
      });
      showToast("Employee updated successfully!");
      router.push(`/employees/${params.id}`);
      router.refresh();
    } catch (err: unknown) {
      console.error("Update Employee Error:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      showToast(errorMessage || "Failed to update employee.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading employee data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4 opacity-20" />
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-2">Profile Not Found</h2>
          <Button onClick={() => router.push("/employees")} className="bg-primary text-white text-[10px] font-black px-8 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
            Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between -mx-6 -mt-6 mb-6">
           <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                 <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                 <h1 className="text-base font-black text-gray-800 uppercase tracking-widest">Edit Employee</h1>
                 <p className="text-[10px] text-gray-400 font-bold mt-0.5">Update profile for {employee.name}</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <Button onClick={() => router.back()} className="bg-gray-50 text-gray-500 border-none px-6 h-10 text-[10px] font-black uppercase tracking-widest">Cancel</Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={saving} className="bg-primary text-white text-[10px] font-black px-6 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
                 {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                 {saving ? "Updating..." : "Update Employee"}
              </Button>
           </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <Card title="Personal Details" className="border-none shadow-sm p-8 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
                       <input 
                          type="text" 
                          {...register("name")}
                          className={`w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 outline-none ${errors.name ? "ring-1 ring-red-500" : "focus:ring-primary"}`} 
                       />
                       {errors.name && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address <span className="text-red-500">*</span></label>
                       <input 
                          type="email" 
                          {...register("email")}
                          className={`w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 outline-none ${errors.email ? "ring-1 ring-red-500" : "focus:ring-primary"}`} 
                       />
                       {errors.email && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                       <input 
                          type="text" 
                          {...register("mobile")}
                          className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" 
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID <span className="text-red-500">*</span></label>
                       <input 
                          type="text" 
                          {...register("employee_id")}
                          className={`w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 outline-none ${errors.employee_id ? "ring-1 ring-red-500" : "focus:ring-primary"}`} 
                       />
                       {errors.employee_id && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.employee_id.message}</p>}
                    </div>
                 </div>
              </Card>

              <Card title="Job Information" className="border-none shadow-sm p-8 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joining Date <span className="text-red-500">*</span></label>
                       <input 
                          type="date" 
                          {...register("joining_date")}
                          className={`w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 outline-none ${errors.joining_date ? "ring-1 ring-red-500" : "focus:ring-primary"}`} 
                       />
                       {errors.joining_date && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.joining_date.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department <span className="text-red-500">*</span></label>
                       <select 
                          {...register("department_id")}
                          className={`w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 outline-none appearance-none cursor-pointer ${errors.department_id ? "ring-1 ring-red-500" : "focus:ring-primary"}`}
                       >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.team_name}</option>
                          ))}
                       </select>
                       {errors.department_id && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.department_id.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation <span className="text-red-500">*</span></label>
                       <select 
                          {...register("designation_id")}
                          className={`w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 outline-none appearance-none cursor-pointer ${errors.designation_id ? "ring-1 ring-red-500" : "focus:ring-primary"}`}
                       >
                          <option value="">Select Designation</option>
                          {designations.map(desig => (
                            <option key={desig.id} value={desig.id}>{desig.name}</option>
                          ))}
                       </select>
                       {errors.designation_id && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.designation_id.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Type</label>
                       <div className="relative">
                          <Clock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                          <select
                             {...register("shift_type_id")}
                             className="w-full bg-gray-50 border-none rounded-xl p-3 pl-12 text-xs font-bold focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                          >
                             <option value="">Select Shift</option>
                             {shiftTypes.map((shift) => (
                               <option key={shift.id} value={shift.id}>
                                 {shift.shift_name} {shift.start_time && shift.end_time ? `(${shift.start_time}-${shift.end_time})` : ""}
                               </option>
                             ))}
                          </select>
                       </div>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Used by attendance calculations.</p>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Address</label>
                       <textarea 
                          {...register("address")}
                          className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none h-24"
                       />
                    </div>
                 </div>
              </Card>

              <Card title="Access & Role" className="border-none shadow-sm p-8 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Access Role</label>
                       <div className="relative">
                          <Shield className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                          <select
                             {...register("role")}
                             className="w-full bg-gray-50 border-none rounded-xl p-3 pl-12 text-xs font-bold focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                          >
                             <option value="employee">Employee</option>
                             <option value="admin">Company Admin</option>
                          </select>
                       </div>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                         Company Admin grants access to company management modules. Employee keeps member portal access.
                       </p>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="space-y-6">
              <Card title="Profile Photo" className="border-none shadow-sm p-8 bg-white text-center">
                 <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary text-3xl font-black shadow-inner border border-primary/5 mx-auto mb-6 relative group overflow-hidden uppercase">
                    {employee.name.charAt(0)}
                 </div>
                 <div className="bg-green-50 text-green-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100 mb-4">
                    Active Account
                 </div>
                 <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Password</label>
                    <input 
                        type="password" 
                        placeholder="Leave blank to keep"
                        {...register("password")}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" 
                    />
                 </div>
              </Card>

              <Card title="Account Stats" className="border-none shadow-sm p-8 bg-white">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System ID</p>
                       <p className="text-xs font-black text-gray-800">#{employee.id}</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Type</p>
                       <p className="text-xs font-black text-gray-800 uppercase">{employee.role || "employee"}</p>
                    </div>
                 </div>
              </Card>
           </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
