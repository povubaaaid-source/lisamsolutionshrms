"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { imgAsset } from "@/utils/helpers";
import { clearSession, getStoredUser } from "@/lib/session";
import type { UserRole } from "@/lib/auth-contract";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  UserSquare2,
  Layers,
  DollarSign,
  ShoppingBag,
  Ticket,
  MessageSquare,
  Calendar,
  LayoutPanelLeft,
  PieChart,
  Settings,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Bell,
  Power,
  LogIn,
  User,
  Search,
  Shield,
} from "lucide-react";

interface SubItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  submenu?: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    icon: Shield,
    label: "Super Admin",
    href: "/super-admin/dashboard",
    submenu: [
      { label: "Dashboard", href: "/super-admin/dashboard" },
      { label: "Companies", href: "/super-admin/companies" },
      { label: "Packages", href: "/super-admin/packages" },
      { label: "Invoices", href: "/super-admin/invoices" },
      { label: "Settings", href: "/super-admin/settings" },
    ],
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    submenu: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Project Dashboard", href: "/dashboard/project" },
      { label: "Client Dashboard", href: "/dashboard/client" },
      { label: "HR Dashboard", href: "/dashboard/hr" },
      { label: "Ticket Dashboard", href: "/dashboard/ticket" },
      { label: "Finance Dashboard", href: "/dashboard/finance" },
    ],
  },
  {
    icon: FileText,
    label: "Lead",
    href: "/leads",
    submenu: [
      { label: "Leads", href: "/leads" },
      { label: "Lead Kanban", href: "/leads/kanban" },
      { label: "Lead Form", href: "/lead-form" },
      { label: "Lead Settings", href: "/lead-settings" },
    ],
  },
  {
    icon: Users,
    label: "Clients",
    href: "/clients",
    submenu: [
      { label: "Clients", href: "/clients" },
      { label: "Client Contacts", href: "/client-contacts" },
      { label: "Client Notes", href: "/notes" },
    ],
  },
  {
    icon: UserSquare2,
    label: "HR",
    href: "/employees",
    submenu: [
      { label: "Employee List", href: "/employees" },
      { label: "Department", href: "/teams" },
      { label: "Designation", href: "/designation" },
      { label: "Attendance", href: "/attendance" },
      { label: "Holidays", href: "/holidays" },
      { label: "Leaves", href: "/leaves" },
    ],
  },
  {
    icon: Layers,
    label: "Work",
    href: "/projects",
    submenu: [
      { label: "Contracts", href: "/contracts" },
      { label: "Projects", href: "/projects" },
      { label: "Project Categories", href: "/project-category" },
      { label: "Tasks", href: "/tasks" },
      { label: "Task Board", href: "/taskboard" },
      { label: "Task Calendar", href: "/task-calendar" },
      { label: "Task Labels", href: "/task-label" },
      { label: "Task Requests", href: "/task-request" },
      { label: "Sub Tasks", href: "/sub-task" },
      { label: "Time Logs", href: "/time-logs" },
      { label: "Discussion", href: "/discussion" },
      { label: "Discussion Categories", href: "/discussion-categories" },
    ],
  },
  {
    icon: Briefcase,
    label: "Recruit",
    href: "/recruitment/dashboard",
    submenu: [
      { label: "Dashboard", href: "/recruitment/dashboard" },
      { label: "Job Openings", href: "/recruitment/jobs" },
      { label: "Applications", href: "/recruitment/applications" },
      { label: "Interview Schedule", href: "/recruitment/interviews" },
      { label: "Onboarding", href: "/recruitment/onboarding" },
      { label: "Skill", href: "/recruitment/skills" },
      { label: "Job Location", href: "/recruitment/locations" },
      { label: "Job Category", href: "/recruitment/categories" },
      { label: "Department", href: "/recruitment/departments" },
      { label: "Custom Question", href: "/recruitment/questions" },
      { label: "Candidate Database", href: "/recruitment/archive" },
      { label: "Recruit Settings", href: "/recruitment/settings" },
      { label: "Update Application", href: "/recruitment/update" },
    ],
  },
  {
    icon: DollarSign,
    label: "Finance",
    href: "/invoices",
    submenu: [
      { label: "Estimates", href: "/estimates" },
      { label: "Invoices", href: "/invoices" },
      { label: "Invoice Recurring", href: "/invoice-recurring" },
      { label: "Payments", href: "/payments" },
      { label: "Expenses", href: "/expenses" },
      { label: "Expenses Recurring", href: "/expenses-recurring" },
      { label: "Credit Notes", href: "/credit-notes" },
    ],
  },
  {
    icon: LayoutDashboard,
    label: "Payroll",
    href: "/payroll",
    submenu: [
      { label: "Payroll Dashboard", href: "/payroll" },
      { label: "Salary Settings", href: "/payroll/settings" },
    ],
  },
  { icon: ShoppingBag, label: "Products", href: "/products" },
  {
    icon: Ticket,
    label: "Tickets",
    href: "/tickets",
    submenu: [
      { label: "Tickets", href: "/tickets" },
      { label: "Support Tickets", href: "/support-tickets" },
      { label: "Ticket Form", href: "/ticket-form" },
      { label: "Ticket Settings", href: "/ticket-settings" },
    ],
  },
  { icon: MessageSquare, label: "Messages", href: "/user-chat" },
  {
    icon: Calendar,
    label: "Events",
    href: "/event-calendar",
    submenu: [
      { label: "Event Calendar", href: "/event-calendar" },
      { label: "Event Types", href: "/event-type" },
    ],
  },
  { icon: LayoutPanelLeft, label: "Notice Board", href: "/notices" },
  {
    icon: PieChart,
    label: "Reports",
    href: "/reports",
    submenu: [
      { label: "Task Report", href: "/reports/tasks" },
      { label: "Time Log Report", href: "/reports/time-log" },
      { label: "Finance Report", href: "/reports/finance" },
      { label: "Income vs Expense", href: "/reports/income-expense" },
      { label: "Leave Report", href: "/reports/leave" },
      { label: "Attendance Report", href: "/reports/attendance" },
    ],
  },
  { icon: BookOpen, label: "Billing", href: "/billing" },
  {
    icon: HelpCircle,
    label: "FAQ",
    href: "/faqs",
    submenu: [
      { label: "My FAQ", href: "/faqs" },
      { label: "Employee FAQ", href: "/employees/faq" },
      { label: "FAQ Categories", href: "/employees/faq/category" },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    submenu: [
      { label: "Settings Home", href: "/settings" },
      { label: "Account Setup", href: "/account-setup" },
      { label: "Role Permissions", href: "/role-permission" },
      { label: "Custom Fields", href: "/custom-fields" },
      { label: "Module Settings", href: "/module-settings" },
    ],
  },
  { icon: Search, label: "Search", href: "/search" },
];

const quickAddItems = [
  { label: "Add Project", href: "/projects/create" },
  { label: "Add Task", href: "/tasks/create" },
  { label: "Add Client", href: "/clients/create" },
  { label: "Add Employee", href: "/employees/create" },
  { label: "Add Payment", href: "/payments/create" },
  { label: "Add Ticket", href: "/tickets/create" },
  { label: "Add Payroll", href: "/payroll" },
];

const roleMenuAccess: Record<UserRole, string[]> = {
  super_admin: ["Super Admin"],
  admin: menuItems.filter((item) => item.label !== "Super Admin").map((item) => item.label),
  employee: ["Dashboard", "HR", "Work", "Tickets", "Messages", "Events", "Notice Board", "FAQ", "Search"],
  client: ["Dashboard", "Work", "Finance", "Tickets", "Messages", "Events", "Notice Board", "FAQ", "Search"],
};

const roleSubmenuAccess: Partial<Record<UserRole, Record<string, string[]>>> = {
  employee: {
    Dashboard: ["Dashboard", "HR Dashboard", "Project Dashboard", "Ticket Dashboard"],
    HR: ["Attendance", "Holidays", "Leaves"],
    Work: ["Projects", "Tasks", "Task Board", "Task Calendar", "Time Logs", "Discussion"],
    Tickets: ["Tickets"],
  },
  client: {
    Dashboard: ["Client Dashboard", "Project Dashboard", "Ticket Dashboard"],
    Work: ["Projects", "Tasks", "Task Board", "Task Calendar", "Discussion"],
    Finance: ["Estimates", "Invoices", "Payments", "Credit Notes"],
    Tickets: ["Tickets", "Support Tickets"],
  },
};

const roleQuickAddAccess: Record<UserRole, string[]> = {
  super_admin: [],
  admin: quickAddItems.map((item) => item.label),
  employee: ["Add Task", "Add Ticket"],
  client: ["Add Ticket"],
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [userRole] = useState<UserRole>(() => getStoredUser()?.role || "admin");
  const [userName] = useState(() => getStoredUser()?.name || "Admin User");

  const filteredMenuItems = useMemo(() => {
    const allowedMenus = roleMenuAccess[userRole];
    const submenuAccess = roleSubmenuAccess[userRole] || {};

    return menuItems
      .filter((item) => allowedMenus.includes(item.label))
      .map((item) => {
        const allowedSubmenuLabels = submenuAccess[item.label];
        if (!item.submenu || !allowedSubmenuLabels) return item;

        return {
          ...item,
          submenu: item.submenu.filter((sub) => allowedSubmenuLabels.includes(sub.label)),
        };
      });
  }, [userRole]);

  const filteredQuickAddItems = useMemo(() => {
    const allowedItems = roleQuickAddAccess[userRole];
    return quickAddItems.filter((item) => allowedItems.includes(item.label));
  }, [userRole]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const toggleMenu = (item: MenuItem) => {
    if (item.submenu) {
      setOpenMenus((prev) =>
        prev.includes(item.label) ? [] : [item.label]
      );
      // Also navigate to the parent href if it exists and we're not already there
      if (item.href && !isActive(item.href)) {
        router.push(item.href);
      }
    } else {
      router.push(item.href);
      setOpenMenus([]);
    }
  };

  const isMenuOpen = (item: MenuItem) =>
    openMenus.includes(item.label) || (item.submenu?.some((s) => isActive(s.href)) ?? false);

  return (
    <>

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-secondary text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${isHovered
          ? "w-[260px] shadow-2xl"
          : "w-[70px] shadow-lg"
          }`}
      >
        {/* Logo */}
        <div className={`flex h-[65px] items-center border-b border-white/10 bg-secondary px-4 transition-all duration-300 ${isHovered ? "justify-start" : "justify-center"}`}>
          <Link href="/dashboard" onClick={() => setOpenMenus([])} className="flex-shrink-0">
            {isHovered ? (
              <Image
                src={imgAsset("worksuite-logo.png")}
                alt="Worksuite"
                width={130}
                height={38}
                className="max-h-[38px] object-contain animate-in fade-in duration-500"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20">W</div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 
          [&::-webkit-scrollbar]:w-1 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-white/10 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          hover:[&::-webkit-scrollbar-thumb]:bg-white/20 
          transition-colors">
          <ul className="space-y-1.5 px-3">
            {filteredMenuItems.map((item) => {
              const isOpen = isMenuOpen(item);
              const isItemActive = isActive(item.href);

              return (
                <li key={item.label}>
                  <div
                    className={`flex items-center rounded-xl px-3 py-3 text-[15px] transition-all cursor-pointer group ${isItemActive || isOpen
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                      } ${!isHovered ? "justify-center px-0 w-10 mx-auto" : "justify-between"}`}
                    onClick={() => toggleMenu(item)}
                    title={!isHovered ? item.label : ""}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isItemActive || isOpen ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                      {isHovered && (
                        <span className="truncate animate-in slide-in-from-left-2 duration-300">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {isHovered && item.submenu && (
                      <div className="transition-transform duration-200">
                        {isOpen ? (
                          <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submenu */}
                  {item.submenu && isOpen && isHovered && (
                    <ul className="mt-1 space-y-1 ml-4 border-l border-white/10 pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {item.submenu.map((sub) => {
                        const isSubActive = isActive(sub.href);
                        return (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className={`block rounded-lg py-2 px-3 text-[13px] font-medium transition-all ${isSubActive
                                ? "text-primary bg-primary/5 font-black"
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                                }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>


        {/* Footer – User / Quick Add / Notifications */}
        <div className={`border-t border-white/10 bg-secondary/80 p-3 transition-all duration-300 ${!isHovered ? "flex flex-col items-center space-y-4" : ""}`}>
          <div className={`flex items-center ${isHovered ? "justify-between" : "flex-col space-y-4"}`}>
            {/* User avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gray-700/50 hover:ring-2 hover:ring-primary transition-all"
              >
                <User className="h-5 w-5 text-gray-300" />
              </button>
              {showUserMenu && isHovered && (
                <div className="absolute bottom-12 left-0 z-50 w-52 rounded-2xl bg-secondary shadow-2xl border border-white/10 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="px-3 py-3 border-b border-white/5 mb-1">
                    <p className="text-xs font-black text-primary truncate">{userName}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{userRole}</p>
                  </div>
                  {userRole === "admin" && (
                    <Link href="/member/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                      <LogIn className="h-4 w-4" /> <span>Login as Employee</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                    <Power className="h-4 w-4" /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Add */}
            <div className="relative">
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Plus className="h-5 w-5" />
              </button>
              {showQuickAdd && isHovered && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-48 rounded-2xl bg-secondary shadow-2xl border border-white/10 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {filteredQuickAddItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-3 py-2.5 rounded-xl text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-700/50 text-gray-400 hover:text-white transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#151e2d]"></span>
            </button>
          </div>

          {isHovered && (
            <div className="mt-4 pt-3 border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Worksuite v3.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
