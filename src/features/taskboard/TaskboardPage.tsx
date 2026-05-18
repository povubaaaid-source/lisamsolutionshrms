"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, MoreVertical, Calendar, MessageSquare, Paperclip, User } from "lucide-react";
import Link from "next/link";

const boardData = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-gray-100 border-gray-200",
    tasks: [
      { id: 1, title: "Website Redesign", desc: "Redesign the homepage and about page.", priority: "High", comments: 3, files: 2, users: ["JD"] },
      { id: 2, title: "Mobile App API", desc: "Create endpoints for user authentication.", priority: "Medium", comments: 0, files: 1, users: ["JS"] },
    ]
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "bg-blue-50 border-blue-100",
    tasks: [
      { id: 3, title: "Database Migration", desc: "Migrate legacy data to new schema.", priority: "High", comments: 5, files: 0, users: ["MT", "JD"] },
    ]
  },
  {
    id: "review",
    title: "Review",
    color: "bg-yellow-50 border-yellow-100",
    tasks: [
      { id: 4, title: "Unit Testing", desc: "Write tests for the auth service.", priority: "Low", comments: 1, files: 4, users: ["SC"] },
    ]
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-50 border-green-100",
    tasks: [
      { id: 5, title: "UI Components", desc: "Build base UI components with Tailwind.", priority: "Medium", comments: 8, files: 12, users: ["BW"] },
    ]
  }
];

export default function TaskBoardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Task Board</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Task Board</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="bg-primary text-white text-[10px] font-bold px-6 h-9 uppercase tracking-widest shadow-sm shadow-primary/20">
              <Plus className="h-3.5 w-3.5 mr-2" /> Add New Task
            </Button>
          </div>
        </div>

        <div className="flex-1 flex space-x-6 overflow-x-auto pb-6 scrollbar-thin">
          {boardData.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
              <div className={`p-4 rounded-t-lg border-b-2 flex items-center justify-between ${column.color}`}>
                 <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                    {column.title}
                 </h3>
                 <span className="text-[10px] font-bold text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">{column.tasks.length}</span>
              </div>
              <div className="flex-1 bg-gray-50/50 p-3 space-y-4 rounded-b-lg border border-t-0 border-gray-100 overflow-y-auto">
                {column.tasks.map((task) => (
                  <Card key={task.id} className="p-4 border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                         task.priority === "High" ? "bg-red-100 text-red-600" : task.priority === "Medium" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                       }`}>
                         {task.priority}
                       </span>
                       <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="h-3.5 w-3.5" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2">{task.title}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">{task.desc}</p>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex -space-x-2">
                         {task.users.map((u, i) => (
                           <div key={i} className="h-6 w-6 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[8px] font-bold text-primary">
                             {u}
                           </div>
                         ))}
                       </div>
                       <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold">
                          {task.comments > 0 && <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" /> {task.comments}</span>}
                          {task.files > 0 && <span className="flex items-center"><Paperclip className="h-3 w-3 mr-1" /> {task.files}</span>}
                       </div>
                    </div>
                  </Card>
                ))}
                <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-primary hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-all">
                  + Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
