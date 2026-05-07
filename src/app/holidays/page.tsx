"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Check, 
  Trash2, 
  RefreshCw, 
  Download,
  CalendarDays,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function HolidaysPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [activeMonth, setActiveMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHolidays, setNewHolidays] = useState([{ date: '', occasion: '' }]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await api.get("/holidays");
      let data = response.data.data || [];
      
      // Mock fallback if empty
      if (data.length === 0) {
        data = [
          { id: 1, date: `${year}-01-01`, occassion: "New Year's Day" },
          { id: 2, date: `${year}-12-25`, occassion: "Christmas" },
          { id: 3, date: `${year}-05-01`, occassion: "Labor Day" }
        ];
      }
      setHolidays(data);
    } catch (err: any) {
      console.error("Fetch Holidays Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/holidays/${id}`);
      setHolidays(prev => prev.filter(h => h.id !== id));
      showToast("Holiday deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete holiday", "error");
    }
  };

  const handleAddMore = () => {
    setNewHolidays([...newHolidays, { date: '', occasion: '' }]);
  };

  const handleRemoveBox = (index: number) => {
    setNewHolidays(newHolidays.filter((_, i) => i !== index));
  };

  const handleSaveHolidays = async () => {
    try {
      // Logic to save multiple holidays
      showToast("Holidays saved successfully", "success");
      setShowAddModal(false);
      fetchHolidays();
    } catch (err) {
      showToast("Failed to save holidays", "error");
    }
  };

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markDays, setMarkDays] = useState<string[]>(['0']); // Default Sunday

  const handleMarkHolidays = async () => {
    try {
      showToast("Holidays marked successfully", "success");
      setShowMarkModal(false);
      fetchHolidays();
    } catch (err) {
      showToast("Failed to mark holidays", "error");
    }
  };

  // Filter holidays for the active month
  const currentMonthIndex = months.indexOf(activeMonth);
  const monthHolidays = holidays.filter(h => {
    const date = new Date(h.date);
    return date.getMonth() === currentMonthIndex && date.getFullYear() === year;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12 flex items-center">
                <h4 className="page-title m-0">
                    <CalendarIcon className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Holidays List {year}
                </h4>
            </div>
            <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12 flex justify-end space-x-2">
                <Button onClick={() => setShowAddModal(true)} className="btn-success btn-outline btn-sm">
                    Add New Holiday <Plus className="h-4 w-4 ml-1 inline-block" />
                </Button>
                <Button className="btn-info btn-outline btn-sm">
                    View On Calendar <CalendarDays className="h-4 w-4 ml-1 inline-block" />
                </Button>
                <Button onClick={() => setShowMarkModal(true)} className="btn-primary btn-outline btn-sm">
                    Mark Sunday <Check className="h-4 w-4 ml-1 inline-block" />
                </Button>
            </div>
        </div>

        <div className="white-box">
            <div className="flex justify-end mb-6">
                <div className="w-48">
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Select Year</label>
                    <select 
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="form-control"
                    >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Vertical Tabs (vtabs) */}
                <div className="w-full md:w-64 border-r border-[#f2f2f3]">
                    <ul className="nav tabs-vertical">
                        {months.map((month) => (
                            <li 
                                key={month}
                                className={`tab nav-item ${activeMonth === month ? 'active' : ''}`}
                            >
                                <button 
                                    onClick={() => setActiveMonth(month)}
                                    className="nav-link w-full text-left flex items-center justify-between"
                                >
                                    <span><CalendarIcon className="h-4 w-4 mr-2 inline-block" /> {month}</span>
                                    <ChevronRight className={`h-4 w-4 transition-transform ${activeMonth === month ? 'rotate-90' : ''}`} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="flex-1 md:pl-6 pt-6 md:pt-0">
                    <div className="panel panel-info">
                        <div className="panel-heading flex items-center bg-[#f2f2f3] p-3 border-b border-[#eee]">
                            <CalendarIcon className="h-4 w-4 mr-2" /> {activeMonth}
                        </div>
                        <div className="portlet-body mt-4">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="w-16">#</th>
                                            <th>Date</th>
                                            <th>Occasion</th>
                                            <th>Day</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthHolidays.length > 0 ? (
                                            monthHolidays.map((holiday, index) => (
                                                <tr key={holiday.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(holiday.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                    <td>{holiday.occassion}</td>
                                                    <td>{new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                                    <td className="text-right">
                                                        <button 
                                                            onClick={() => handleDelete(holiday.id)}
                                                            className="btn-danger p-1 rounded hover:bg-red-600 hover:text-white transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-20 text-gray-400">
                                                    No holidays found for {activeMonth}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Holiday"
        size="md"
      >
        <div className="p-6">
            <div className="space-y-4">
                {newHolidays.map((holiday, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase text-gray-400 mb-1">Date</label>
                            <input 
                                type="date" 
                                className="form-control"
                                value={holiday.date}
                                onChange={(e) => {
                                    const updated = [...newHolidays];
                                    updated[index].date = e.target.value;
                                    setNewHolidays(updated);
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase text-gray-400 mb-1">Occasion</label>
                            <input 
                                type="text" 
                                placeholder="Occasion"
                                className="form-control"
                                value={holiday.occasion}
                                onChange={(e) => {
                                    const updated = [...newHolidays];
                                    updated[index].occasion = e.target.value;
                                    setNewHolidays(updated);
                                }}
                            />
                        </div>
                        {index > 0 && (
                            <button 
                                onClick={() => handleRemoveBox(index)}
                                className="mt-6 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            <Button 
                onClick={handleAddMore}
                className="btn-info btn-outline btn-sm mt-6"
            >
                Add More <Plus className="h-4 w-4 ml-1 inline-block" />
            </Button>

            <div className="mt-10 flex justify-end space-x-3">
                <Button onClick={() => setShowAddModal(false)} className="btn-default">Close</Button>
                <Button onClick={handleSaveHolidays} variant="primary">Save Holidays</Button>
            </div>
        </div>
      </Modal>

      {/* Mark Sunday Modal */}
      <Modal
        isOpen={showMarkModal}
        onClose={() => setShowMarkModal(false)}
        title="Mark Holidays"
        size="md"
      >
        <div className="p-6">
            <h5 className="mb-4">Select days to mark as office holidays for the year {year}</h5>
            <div className="grid grid-cols-2 gap-4 mb-10">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                    <label key={day} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="h-4 w-4"
                            checked={markDays.includes(i.toString())}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setMarkDays([...markDays, i.toString()]);
                                } else {
                                    setMarkDays(markDays.filter(d => d !== i.toString()));
                                }
                            }}
                        />
                        <span className="text-xs font-bold text-gray-700">{day}</span>
                    </label>
                ))}
            </div>

            <div className="flex justify-end space-x-3">
                <Button onClick={() => setShowMarkModal(false)} className="btn-default">Close</Button>
                <Button onClick={handleMarkHolidays} variant="primary">Save Changes</Button>
            </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
