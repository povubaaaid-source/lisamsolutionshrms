import { useEffect } from "react";
import socket from "./socket";

export type AttendanceScanEvent = {
  employee_id: string | number;
  employee_name: string;
  employee_image?: string;
  device_name: string;
  timestamp: string;
  type: "IN" | "OUT";
};

export type DeviceStatusEvent = {
  device_id: string | number;
  status: "online" | "offline";
};

/**
 * Hook to listen for live attendance scans
 */
export function useAttendanceEvents(onScan: (event: AttendanceScanEvent) => void) {
  useEffect(() => {
    socket.on("attendance.scanned", onScan);
    return () => socket.off("attendance.scanned", onScan);
  }, [onScan]);
}

/**
 * Hook to listen for device status changes
 */
export function useDeviceStatusEvents(onChange: (event: DeviceStatusEvent) => void) {
  useEffect(() => {
    socket.on("device.status.changed", onChange);
    return () => socket.off("device.status.changed", onChange);
  }, [onChange]);
}

/**
 * For development: Simulate a scan event
 */
export function simulateScan() {
  const names = ["John Doe", "Jane Smith", "Mike Tyson", "Sarah Wilson"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  
  socket.simulate("attendance.scanned", {
    employee_id: Math.floor(Math.random() * 1000),
    employee_name: randomName,
    device_name: "Front Gate (MB460)",
    timestamp: new Date().toISOString(),
    type: Math.random() > 0.5 ? "IN" : "OUT"
  });
}
