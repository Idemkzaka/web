export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive';
  workSchedule: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  notes?: string;
  hoursWorked?: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageHours: number;
}