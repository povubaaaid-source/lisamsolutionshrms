"use client";

import { Search, Power, ChevronDown, User, LogIn, Menu, RefreshCw, Briefcase } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type SearchItem = {
  id: number | string;
  name?: string;
  project_name?: string;
  status?: string;
  client_detail?: { company_name?: string };
  employee_detail?: { designation?: { name?: string } };
};

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{
    clients: SearchItem[];
    employees: SearchItem[];
    projects: SearchItem[];
  }>({ clients: [], employees: [], projects: [] });
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setSearching(true);
        setShowResults(true);
        try {
          // In a real production app, you'd have a single /search endpoint
          // Here we simulate it by querying main modules in parallel
          const [clientsRes, employeesRes, projectsRes] = await Promise.all([
            api.get("/client"),
            api.get("/employee"),
            api.get("/project")
          ]);

          const query = searchQuery.toLowerCase();
          const clients = (clientsRes.data.data || []) as SearchItem[];
          const employees = (employeesRes.data.data || []) as SearchItem[];
          const projects = (projectsRes.data.data || []) as SearchItem[];

          setResults({
            clients: clients.filter((c) => 
              c.name?.toLowerCase().includes(query) || 
              c.client_detail?.company_name?.toLowerCase().includes(query)
            ).slice(0, 3),
            employees: employees.filter((e) => 
              e.name?.toLowerCase().includes(query)
            ).slice(0, 3),
            projects: projects.filter((p) => 
              p.project_name?.toLowerCase().includes(query)
            ).slice(0, 3)
          });
        } catch (err) {
          console.error("Global Search Error:", err);
        } finally {
          setSearching(false);
        }
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const hasResults = results.clients.length > 0 || results.employees.length > 0 || results.projects.length > 0;
  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "admin@company.com";
  const displayRole = (user?.role || "admin").replace("_", " ");

  return (
    <header className="sticky top-0 z-40 flex h-[60px] w-full items-center justify-between bg-white px-6 text-gray-800 border-b border-[#f2f2f3]">
      {/* Left side: mobile toggle + search */}
      <div className="flex items-center space-x-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="block rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden"
          aria-label="Open navigation menu"
          aria-controls="mobile-sidebar"
        >
           <Menu className="h-6 w-6" />
        </button>
        
        <div className="relative hidden md:block group" ref={searchRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 1 && setShowResults(true)}
            className="form-control w-64 pl-10"
          />
          <div className="absolute left-4 top-3">
            {searching ? (
              <RefreshCw className="h-4 w-4 text-primary animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
            )}
          </div>

          {showResults && (
            <div className="absolute left-0 top-12 w-[350px] bg-white shadow-lg border border-[#f2f2f3]">
              <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Search Results</p>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto p-2 space-y-4">
                {!searching && !hasResults && (
                  <div className="py-8 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No matches found</p>
                  </div>
                )}

                {/* Clients Section */}
                {results.clients.length > 0 && (
                  <div className="space-y-1">
                    <p className="px-3 text-[9px] font-black text-primary uppercase tracking-widest mb-2">Clients</p>
                    {results.clients.map(client => (
                      <Link 
                        key={client.id} 
                        href={`/clients/${client.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs uppercase group-hover:bg-blue-100">
                          {client.client_detail?.company_name?.charAt(0) || client.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-700">{client.client_detail?.company_name || client.name}</p>
                          <p className="text-[9px] text-gray-400 font-medium">Primary: {client.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Employees Section */}
                {results.employees.length > 0 && (
                  <div className="space-y-1">
                    <p className="px-3 text-[9px] font-black text-green-500 uppercase tracking-widest mb-2">Employees</p>
                    {results.employees.map(emp => (
                      <Link 
                        key={emp.id} 
                        href={`/employees/${emp.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500 font-bold text-xs uppercase group-hover:bg-green-100">
                          {emp.name?.charAt(0) || "E"}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-700">{emp.name}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{emp.employee_detail?.designation?.name || "Staff"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <div className="space-y-1">
                    <p className="px-3 text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2">Projects</p>
                    {results.projects.map(proj => (
                      <Link 
                        key={proj.id} 
                        href={`/projects/${proj.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-xs group-hover:bg-orange-100">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-700">{proj.project_name}</p>
                          <p className="text-[9px] text-gray-400 font-medium capitalize">{proj.status}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-50 bg-gray-50/50">
                <p className="text-[8px] text-center font-black text-gray-400 uppercase tracking-widest italic">Showing top results</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: user */}
      <div className="flex items-center space-x-3">
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center space-x-3 rounded-xl p-1.5 pr-3 transition-all ${showUserDropdown ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden shadow-sm">
               <User className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden text-left md:block">
               <p className="text-xs font-black text-gray-800 leading-tight">{displayName}</p>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest capitalize">{displayRole}</p>
            </div>
            <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`} />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-12 z-50 w-56 bg-white text-gray-800 shadow-lg border border-[#f2f2f3]">
              <div className="p-5 border-b border-gray-50 bg-gray-50/30 rounded-t-2xl">
                <p className="text-xs font-black text-gray-800">{displayName}</p>
                <p className="text-[10px] text-gray-400 font-medium">{displayEmail}</p>
              </div>
              <div className="p-2">
                <Link href="/profile" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-primary transition-all">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/member/dashboard" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-primary transition-all">
                    <LogIn className="h-4 w-4" />
                    <span>Login as Employee</span>
                  </Link>
                )}
              </div>
              <div className="p-2 border-t border-gray-50">
                <button onClick={logout} className="flex w-full items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest">
                  <Power className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
