"use client";

import { ReactNode, useMemo, useState } from "react";
import { Search } from "lucide-react";

export interface AdminTableColumn<T> {
  header: string;
  accessor: keyof T | ((record: T) => ReactNode);
  className?: string;
}

interface AdminDataTableProps<T> {
  title?: string;
  records: T[];
  columns: AdminTableColumn<T>[];
  emptyText?: string;
  searchPlaceholder?: string;
  getRecordKey?: (record: T, index: number) => string | number;
}

export default function AdminDataTable<T extends Record<string, unknown>>({
  title,
  records,
  columns,
  emptyText = "No records found.",
  searchPlaceholder = "Search records...",
  getRecordKey,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(normalizedQuery));
  }, [query, records]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-50 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 px-5 py-4">
        {title && <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">{title}</h3>}
        <div className="relative min-w-[220px] flex-1 sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border border-gray-100 bg-gray-50 pl-9 pr-3 text-xs font-bold text-gray-600 outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/70">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={`px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 ${column.className || ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRecords.map((record, index) => (
              <tr key={getRecordKey?.(record, index) || index} className="transition-colors hover:bg-gray-50/70">
                {columns.map((column) => (
                  <td key={column.header} className={`px-5 py-4 text-xs font-bold text-gray-600 ${column.className || ""}`}>
                    {typeof column.accessor === "function" ? column.accessor(record) : (record[column.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-xs font-black uppercase tracking-widest text-gray-400">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
