"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, Palette, Layout, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ThemeSettingsPage() {
  const [primaryColor, setPrimaryColor] = useState("#1d82f5");
  const [sidebarTheme, setSidebarTheme] = useState("dark");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-sm -mx-6 -mt-6 mb-6 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">Theme Settings</h1>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Link href="/dashboard" className="hover:text-primary transition-colors font-bold">Home</Link>
              <span className="font-bold">/</span>
              <Link href="/settings" className="hover:text-primary transition-colors font-bold">Settings</Link>
              <span className="font-bold">/</span>
              <span className="text-gray-700 font-bold">Theme Settings</span>
            </div>
          </div>
          <Link href="/settings">
            <Button className="bg-gray-100 text-gray-600 border-none text-[10px] h-8 px-3 hover:bg-gray-200">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>Back to Settings</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-gray-100 bg-white">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 mb-6 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Color Configuration
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-700">Primary Color</h4>
                    <p className="text-[10px] text-gray-400">Choose the main brand color for the application.</p>
                  </div>
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20 border-0 p-0 cursor-pointer rounded overflow-hidden" 
                  />
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Sidebar Theme</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSidebarTheme("light")}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                        sidebarTheme === "light" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Light Sidebar</span>
                    </button>
                    <button 
                      onClick={() => setSidebarTheme("dark")}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                        sidebarTheme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Dark Sidebar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-10 flex justify-end">
                <Button className="bg-primary text-white text-[10px] font-bold px-10 h-11 uppercase tracking-widest shadow-lg shadow-primary/20">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 border-gray-100 bg-gray-50/50 space-y-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                <Layout className="h-3.5 w-3.5 mr-2" />
                Live Preview
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm h-64 relative">
                <div className={`absolute left-0 top-0 bottom-0 w-12 border-r border-gray-100 ${sidebarTheme === "dark" ? "bg-[#1a2332]" : "bg-white"}`}></div>
                <div className="absolute top-0 right-0 left-12 h-6 border-b border-gray-100 bg-[#3c4451]"></div>
                <div className="absolute top-8 left-16 right-4 bottom-4 space-y-3">
                  <div className="h-2 w-24 bg-gray-100 rounded"></div>
                  <div className="h-20 w-full bg-gray-50 rounded border border-gray-100 p-2 flex items-center justify-center">
                    <div style={{ backgroundColor: primaryColor }} className="h-6 w-16 rounded shadow-sm"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-gray-50 rounded"></div>
                    <div className="h-10 bg-gray-50 rounded"></div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center italic">This is a live preview of how your dashboard will look.</p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
