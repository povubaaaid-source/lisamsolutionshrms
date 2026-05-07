"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Clock, 
  FileText, 
  Edit, 
  Key, 
  Award,
  CheckCircle2,
  XCircle,
  Activity,
  Download,
  Trash2,
  Eye,
  FilePlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Employee } from "@/types";
import { useToast } from "@/context/ToastContext";
import { RefreshCw, AlertCircle, ChevronLeft } from "lucide-react";

const tabs = [
  { id: "activity", label: "Activity", icon: Activity },
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 },
  { id: "leaves", label: "Leaves", icon: FileText },
  { id: "time-logs", label: "Time Logs", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
];

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employee/${params.id}?include=employeeDetail,projects,tasks,leaves`);
        setEmployee(response.data.data);
        setProjects(response.data.data.projects || []);
        setTasks(response.data.data.tasks || []);
        setLeaves(response.data.data.leaves || []);
      } catch (err: any) {
        console.error("Fetch Employee Error:", err);
        setError(err.response?.data?.message || "Failed to load employee details.");
        showToast("Error loading employee details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [params.id, showToast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading profile details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4 opacity-20" />
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-2">Oops! Profile not found</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md">{error || "Employee not found."}</p>
          <Button onClick={() => router.push("/employees")} className="bg-primary text-white text-[10px] font-black px-8 h-10 uppercase tracking-widest shadow-lg shadow-primary/20">
            Go Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const initial = employee.name.charAt(0);
  const detail = employee.employee_detail;
  const designationName = detail?.designation?.name || "N/A";
  const departmentName = detail?.department?.team_name || "N/A";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-6 -mx-6 -mt-6 mb-6">
           <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary text-3xl font-black shadow-inner border border-primary/5 uppercase">
                 {initial}
              </div>
              <div>
                 <h1 className="text-2xl font-black text-gray-800 uppercase tracking-widest">{employee.name}</h1>
                 <p className="text-[11px] text-primary font-black uppercase tracking-[0.2em] mt-1">{designationName} • {departmentName}</p>
                 <div className="flex items-center space-x-4 mt-3">
                    <span className="flex items-center text-[10px] text-gray-400 font-bold"><Mail className="h-3 w-3 mr-1.5" /> {employee.email}</span>
                    {employee.employee_detail?.mobile && (
                      <span className="flex items-center text-[10px] text-gray-400 font-bold"><Phone className="h-3 w-3 mr-1.5" /> {employee.employee_detail.mobile}</span>
                    )}
                 </div>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
              <Link href={`/employees/${employee.id}/edit`}>
                <Button className="bg-white text-gray-400 border border-gray-100 p-2.5 rounded-xl hover:text-primary transition-colors shadow-sm">
                   <Edit className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={() => router.push("/employees")} className="bg-gray-50 text-gray-400 border border-gray-100 p-2.5 rounded-xl hover:text-gray-600 transition-colors shadow-sm">
                 <ChevronLeft className="h-5 w-5" />
              </Button>
           </div>
        </div>
        
        {/* Stats Cards (Laravel Parity) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Tasks Done</p>
                <h3 className="text-2xl font-black text-gray-800">{employee.tasks_count || 0}</h3>
              </div>
              <div className="h-12 w-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Hours Logged</p>
                <h3 className="text-2xl font-black text-gray-800">{employee.hours_logged || 0} hrs</h3>
              </div>
              <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Leaves Taken</p>
                <h3 className="text-2xl font-black text-gray-800">{employee.leaves_count || 0}</h3>
              </div>
              <div className="h-12 w-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Remaining Leaves</p>
                <h3 className="text-2xl font-black text-gray-800">{(employee.allowed_leaves || 0) - (employee.leaves_count || 0)}</h3>
              </div>
              <div className="h-12 w-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-50 overflow-x-auto scrollbar-hide">
           {tabs.map((tab) => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center space-x-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                 }`}
              >
                 <tab.icon className="h-4 w-4" />
                 <span>{tab.label}</span>
              </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              {activeTab === "activity" && (
                 <Card title="Recent Activity" className="border-none shadow-sm bg-white p-8">
                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                       {[
                          { title: "Task Completed", desc: "Completed the 'Dashboard UI' task.", time: "2 hours ago", color: "bg-green-500" },
                          { title: "Attendance Marked", desc: "Marked attendance for today.", time: "4 hours ago", color: "bg-blue-500" },
                          { title: "Leave Requested", desc: "Applied for a casual leave for next Friday.", time: "1 day ago", color: "bg-orange-500" }
                       ].map((item, idx) => (
                          <div key={idx} className="relative pl-10">
                             <div className={`absolute left-0 top-1.5 h-[23px] w-[23px] rounded-full border-4 border-white shadow-sm ${item.color}`} />
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1">{item.time}</p>
                             <h4 className="text-sm font-bold text-gray-700">{item.title}</h4>
                             <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                          </div>
                       ))}
                    </div>
                 </Card>
              )}

              {activeTab === "profile" && (
                 <Card title="Personal Information" className="border-none shadow-sm bg-white p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Full Name</p>
                             <p className="text-sm font-bold text-gray-700">{employee.name}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Employee ID</p>
                             <p className="text-sm font-bold text-gray-700">{detail?.employee_id || "N/A"}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Joining Date</p>
                             <p className="text-sm font-bold text-gray-700">{detail?.joining_date || "N/A"}</p>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Department</p>
                             <p className="text-sm font-bold text-gray-700">{departmentName}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Designation</p>
                             <p className="text-sm font-bold text-gray-700">{designationName}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Gender</p>
                             <p className="text-sm font-bold text-gray-700 capitalize">{employee.gender || "Not specified"}</p>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Mobile</p>
                             <p className="text-sm font-bold text-gray-700">{employee.mobile || "N/A"}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Slack Username</p>
                             <p className="text-sm font-bold text-primary">@{detail?.slack_username || "n/a"}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Hourly Rate</p>
                             <p className="text-sm font-bold text-gray-700">${detail?.hourly_rate || "0.00"}</p>
                          </div>
                       </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50">
                       <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-3 flex items-center">
                          <MapPin className="h-3 w-3 mr-2" /> Current Address
                       </p>
                       <p className="text-sm font-bold text-gray-700 leading-relaxed">{detail?.address || "No address provided."}</p>
                    </div>
                 </Card>
              )}

              {activeTab === "documents" && (
                 <Card className="border-none shadow-sm bg-white p-0 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-50">
                       <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Employee Documents</h3>
                       <Button className="bg-primary/10 text-primary text-[10px] font-black px-4 py-2 uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                          <FilePlus className="h-4 w-4 mr-2" /> Add Document
                       </Button>
                    </div>
                    <div className="divide-y divide-gray-50">
                       {[
                          { name: "ID Proof.pdf", size: "1.2 MB", date: "2024-01-15" },
                          { name: "Joining Letter.pdf", size: "850 KB", date: "2024-01-20" }
                       ].map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                             <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                   <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-gray-700">{doc.name}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{doc.size} • {doc.date}</p>
                                </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-300 hover:text-primary transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                                <button className="p-2 text-gray-300 hover:text-primary transition-colors" title="Download"><Download className="h-4 w-4" /></button>
                                <button className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </Card>
              )}

              {activeTab === "projects" && (
                 <Card title="Projects Worked" className="border-none shadow-sm bg-white p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Name</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Deadline</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {projects.length > 0 ? projects.map((project, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4">
                                      <span className="text-sm font-bold text-gray-700">{project.project_name}</span>
                                   </td>
                                   <td className="px-6 py-4 min-w-[150px]">
                                      <div className="flex items-center space-x-3">
                                         <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-primary rounded-full transition-all duration-1000" 
                                              style={{ width: `${project.completion_percent || 0}%` }}
                                            />
                                         </div>
                                         <span className="text-[10px] font-black text-gray-400">{project.completion_percent || 0}%</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                         project.status === 'finished' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                      }`}>
                                         {project.status}
                                      </span>
                                   </td>
                                </tr>
                             )) : (
                                <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No projects assigned</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </Card>
              )}

              {activeTab === "tasks" && (
                 <Card title="Task History" className="border-none shadow-sm bg-white p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Task</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {tasks.length > 0 ? tasks.map((task, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4">
                                      <span className="text-sm font-bold text-gray-700">{task.heading}</span>
                                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{task.project?.project_name || 'Personal'}</div>
                                   </td>
                                   <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                         task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                      }`}>
                                         {task.status}
                                      </span>
                                   </td>
                                </tr>
                             )) : (
                                <tr><td colSpan={3} className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No tasks found</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </Card>
              )}

              {activeTab === "leaves" && (
                 <Card title="Leave Records" className="border-none shadow-sm bg-white p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Leave Type</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {leaves.length > 0 ? leaves.map((leave, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4 text-xs font-bold text-gray-700">
                                      {new Date(leave.leave_date).toLocaleDateString()}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{leave.type?.type_name || 'Casual'}</span>
                                   </td>
                                   <td className="px-6 py-4 text-xs text-gray-500 italic max-w-[200px] truncate">
                                      {leave.reason || 'No reason provided'}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                         leave.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                      }`}>
                                         {leave.status}
                                      </span>
                                   </td>
                                </tr>
                             )) : (
                                <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No leave records</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </Card>
              )}

              {activeTab !== "profile" && activeTab !== "activity" && activeTab !== "documents" && 
               activeTab !== "projects" && activeTab !== "tasks" && activeTab !== "leaves" && (
                 <Card className="border-none shadow-sm bg-white py-24 text-center">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                       <Award className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No detailed records found in {activeTab}</p>
                 </Card>
              )}
           </div>

           <div className="space-y-6">
              <Card title="Skills & Expertise" className="border-none shadow-sm bg-white p-6">
                 <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1.5 bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-lg border border-gray-100">
                        Generalist
                    </span>
                 </div>
              </Card>

              <Card title="Work Summary" className="border-none shadow-sm bg-white p-6">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3 text-gray-400">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Active Projects</span>
                       </div>
                       <span className="text-sm font-black text-gray-800">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Attendance</span>
                       </div>
                       <span className="text-sm font-black text-gray-800">100%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3 text-gray-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Tasks Done</span>
                       </div>
                       <span className="text-sm font-black text-gray-800">0</span>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
