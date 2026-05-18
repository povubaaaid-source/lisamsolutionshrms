"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Mail, 
  Layout, 
  Bell, 
  Lock, 
  Clock, 
  MessageSquare, 
  Monitor, 
  CreditCard,
  User,
  ShieldCheck,
  Languages,
  Palette,
  Cloud,
  FileText,
  Calendar
} from "lucide-react";
import Link from "next/link";

const settingsGroups = [
  {
    title: "General Settings",
    items: [
      { label: "Company Settings", href: "/settings/company", icon: Globe, description: "Manage your company information and branding." },
      { label: "Account Setup", href: "/account-setup", icon: SettingsIcon, description: "Complete company, invoice, and account defaults." },
      { label: "Email Settings", href: "/email-settings", icon: Mail, description: "Configure your email server and templates." },
      { label: "Module Settings", href: "/module-settings", icon: Layout, description: "Enable or disable specific system modules." },
      { label: "App Settings", href: "/settings/app", icon: SettingsIcon, description: "System-wide application configurations." },
      { label: "Pusher Settings", href: "/pusher-settings", icon: Cloud, description: "Configure Pusher for real-time notifications." },
      { label: "Custom Fields", href: "/custom-fields", icon: Layout, description: "Add extra data fields to system modules." },
    ]
  },
  {
    title: "Project & Task",
    items: [
      { label: "Project Settings", href: "/project-settings", icon: FileText, description: "Manage project categories and statuses." },
      { label: "Project Categories", href: "/project-category", icon: FileText, description: "Maintain project category records." },
      { label: "Task Settings", href: "/task-settings", icon: Clock, description: "Configure task labels and board settings." },
      { label: "Task Labels", href: "/task-label", icon: Clock, description: "Manage task labels used across task screens." },
      { label: "Task Requests", href: "/task-request", icon: FileText, description: "Approve or reject requested tasks." },
      { label: "Log Time Settings", href: "/log-time-settings", icon: Clock, description: "Control how time is logged in projects." },
    ]
  },
  {
    title: "HR & Support",
    items: [
      { label: "Attendance Settings", href: "/attendance-settings", icon: Clock, description: "Configure clock-in and office timings." },
      { label: "Leave Settings", href: "/leaves-settings", icon: Calendar, description: "Manage leave types and approval policies." },
      { label: "Leave Types", href: "/leave-type", icon: Calendar, description: "Configure leave balances and colors." },
      { label: "Ticket Settings", href: "/ticket-settings", icon: ShieldCheck, description: "Configure support ticket types and channels." },
      { label: "Ticket Form", href: "/ticket-form", icon: ShieldCheck, description: "Customize public ticket form fields." },
    ]
  },
  {
    title: "Security & Access",
    items: [
      { label: "Roles & Permissions", href: "/role-permission", icon: ShieldCheck, description: "Define what different users can access." },
      { label: "GDPR Settings", href: "/gdpr", icon: Lock, description: "Manage data privacy and protection settings." },
      { label: "Two Factor Authentication", href: "/profile/security", icon: ShieldCheck, description: "Enable extra security for user accounts." },
    ]
  },
  {
    title: "Finance & Sales",
    items: [
      { label: "Currency Settings", href: "/currencies", icon: CreditCard, description: "Manage currencies and exchange rates." },
      { label: "Payment Credentials", href: "/payment-gateway-credentials", icon: CreditCard, description: "Setup Stripe, PayPal, and other gateways." },
      { label: "Tax Settings", href: "/taxes", icon: FileText, description: "Configure VAT, GST, and other tax types." },
      { label: "Invoice Settings", href: "/invoice-settings", icon: FileText, description: "Customize invoice prefixes and templates." },
      { label: "Lead Settings", href: "/lead-settings", icon: FileText, description: "Configure lead sources and statuses." },
    ]
  },
  {
    title: "Appearance & Communication",
    items: [
      { label: "Theme Settings", href: "/theme-settings", icon: Palette, description: "Customize the system colors and layout." },
      { label: "Notification Settings", href: "/push-settings", icon: Bell, description: "Control email and push notifications." },
      { label: "Message Settings", href: "/message-settings", icon: MessageSquare, description: "Configure internal chat and messaging." },
      { label: "Slack Settings", href: "/slack-settings", icon: Cloud, description: "Integrate with Slack for notifications." },
      { label: "Google Calendar", href: "/google-calendar-settings", icon: Calendar, description: "Sync tasks and events with Google Calendar." },
    ]
  }

];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-8 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Settings</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Settings</span>
            </div>
          </div>
        </div>

        {settingsGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item, i) => (
                <Link key={i} href={item.href}>
                  <Card className="p-5 hover:shadow-md transition-all group border-gray-100 hover:border-primary/20 flex items-start space-x-4 cursor-pointer h-full bg-white">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 mb-1 group-hover:text-primary transition-colors">{item.label}</h3>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{item.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
