"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Calendar, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  SlidersHorizontal,
  Check,
  X,
  Clock,
  User,
  MessageSquare,
  Columns
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InterviewSchedulePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"table" | "calendar">("table");

  const interviews = [
    { id: 1, candidate: "Alice Johnson", job: "Full Stack Developer", date: "2024-05-10", time: "10:00 AM", employee: "John Doe", status: "Pending", statusColor: "label-warning" },
    { id: 2, candidate: "Bob Williams", job: "Full Stack Developer", date: "2024-05-11", time: "02:00 PM", employee: "Jane Smith", status: "Hired", statusColor: "label-success" },
    { id: 3, candidate: "Carol Davis", job: "UI/UX Designer", date: "2024-05-12", time: "11:30 AM", employee: "Mike Tyson", status: "Rejected", statusColor: "label-danger" },
    { id: 4, candidate: "Frank Wilson", job: "UI/UX Designer", date: "2024-05-13", time: "03:00 PM", employee: "John Doe", status: "Pending", statusColor: "label-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="row bg-title mb-6">
          <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
            <h4 className="page-title m-0">
              <Calendar className="h-5 w-5 mr-2 inline-block text-primary" />
              Interview Schedule
            </h4>
          </div>
          <div className="col-sm-9 text-right flex justify-end items-center space-x-2">
            <Link href="/recruitment/interviews/create">
              <Button className="btn-inverse btn-sm">
                <Plus className="h-4 w-4 mr-1 inline-block" /> Add Interview Schedule
              </Button>
            </Link>
            <ol className="breadcrumb hidden-xs">
              <li><Link href="/dashboard">Home</Link></li>
              <li><Link href="/recruitment/dashboard">Recruitment</Link></li>
              <li className="active">Interviews</li>
            </ol>
          </div>
        </div>

        {/* Tabs */}
        <div className="white-box p-0 border-b border-[#eee]">
          <nav className="flex space-x-8 px-6">
            <button onClick={() => setView("table")} className={`py-4 text-[13px] font-bold border-b-2 transition-all ${view === "table" ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-primary"}`}>
              All Candidates
            </button>
            <button onClick={() => setView("calendar")} className={`py-4 text-[13px] font-bold border-b-2 transition-all ${view === "calendar" ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-primary"}`}>
              Calendar View
            </button>
          </nav>
        </div>

        {/* Filter Bar */}
        <div className="white-box">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Status</label>
              <select className="form-control">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Job</label>
              <select className="form-control">
                <option value="all">All Jobs</option>
                <option>Full Stack Developer</option>
                <option>UI/UX Designer</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Candidate</label>
              <select className="form-control">
                <option value="all">All Candidates</option>
                <option>Alice Johnson</option>
                <option>Bob Williams</option>
              </select>
            </div>
            <div>
              <Button className="btn-success btn-block h-[34px]">Apply</Button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {view === "table" && (
          <div className="white-box p-0">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th>Candidate</th>
                    <th>Applied For</th>
                    <th><Clock className="h-3 w-3 inline-block mr-1" /> Schedule Date</th>
                    <th>Time</th>
                    <th>Assigned Employee</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, index) => (
                    <tr key={interview.id}>
                      <td>{index + 1}</td>
                      <td className="font-bold">{interview.candidate}</td>
                      <td>{interview.job}</td>
                      <td>{new Date(interview.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{interview.time}</td>
                      <td>
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[9px] mr-2">{interview.employee.charAt(0)}</div>
                          {interview.employee}
                        </div>
                      </td>
                      <td><span className={`label ${interview.statusColor}`}>{interview.status}</span></td>
                      <td className="text-right">
                        <div className="flex justify-end space-x-1">
                          <button className="btn-info btn-outline p-1 rounded hover:bg-info hover:text-white transition-all"><Eye className="h-4 w-4" /></button>
                          <button className="btn-success btn-outline p-1 rounded hover:bg-success hover:text-white transition-all"><Edit className="h-4 w-4" /></button>
                          <button className="btn-default btn-outline p-1 rounded hover:bg-gray-200 transition-all"><MessageSquare className="h-4 w-4" /></button>
                          <button className="btn-danger btn-outline p-1 rounded hover:bg-danger hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar View (Placeholder) */}
        {view === "calendar" && (
          <div className="white-box min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-[12px] font-bold text-gray-400 uppercase">Calendar view will display here</p>
              <p className="text-[10px] text-gray-300 mt-1">Connect to API for full calendar integration</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
