import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, AttendanceRecord, Department, AttendanceStats } from '../types';
import { format, isToday, parseISO } from 'date-fns';

interface AttendanceContextType {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  departments: Department[];
  stats: AttendanceStats;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  getEmployeeAttendance: (employeeId: string, date?: string) => AttendanceRecord | undefined;
  getTodayAttendance: () => AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [departments] = useState<Department[]>([
    { id: '1', name: 'Recursos Humanos', description: 'Gestión del personal' },
    { id: '2', name: 'Tecnología', description: 'Desarrollo y sistemas' },
    { id: '3', name: 'Ventas', description: 'Comercialización' },
    { id: '4', name: 'Marketing', description: 'Promoción y publicidad' },
    { id: '5', name: 'Finanzas', description: 'Contabilidad y finanzas' },
  ]);

  // Datos de ejemplo
  useEffect(() => {
    const sampleEmployees: Employee[] = [
      {
        id: '1',
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        department: 'Recursos Humanos',
        position: 'Gerente de RRHH',
        employeeId: 'EMP001',
        phone: '+1234567890',
        hireDate: '2023-01-15',
        status: 'active',
        workSchedule: {
          startTime: '09:00',
          endTime: '18:00',
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        department: 'Tecnología',
        position: 'Desarrollador Senior',
        employeeId: 'EMP002',
        phone: '+1234567891',
        hireDate: '2023-02-01',
        status: 'active',
        workSchedule: {
          startTime: '08:30',
          endTime: '17:30',
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      {
        id: '3',
        name: 'María López',
        email: 'maria.lopez@empresa.com',
        department: 'Ventas',
        position: 'Ejecutiva de Ventas',
        employeeId: 'EMP003',
        phone: '+1234567892',
        hireDate: '2023-03-10',
        status: 'active',
        workSchedule: {
          startTime: '09:00',
          endTime: '18:00',
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      }
    ];

    const sampleAttendance: AttendanceRecord[] = [
      {
        id: '1',
        employeeId: '1',
        date: format(new Date(), 'yyyy-MM-dd'),
        checkIn: '09:05',
        status: 'late',
        hoursWorked: 0
      },
      {
        id: '2',
        employeeId: '2',
        date: format(new Date(), 'yyyy-MM-dd'),
        checkIn: '08:30',
        checkOut: '17:30',
        status: 'present',
        hoursWorked: 9
      }
    ];

    setEmployees(sampleEmployees);
    setAttendanceRecords(sampleAttendance);
  }, []);

  const [stats, setStats] = useState<AttendanceStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    averageHours: 0
  });

  // Calcular estadísticas
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = attendanceRecords.filter(record => record.date === today);
    
    const presentToday = todayRecords.filter(record => record.status === 'present' || record.status === 'late').length;
    const lateToday = todayRecords.filter(record => record.status === 'late').length;
    const absentToday = employees.length - presentToday;
    
    const totalHours = todayRecords.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
    const averageHours = presentToday > 0 ? totalHours / presentToday : 0;

    setStats({
      totalEmployees: employees.length,
      presentToday,
      absentToday,
      lateToday,
      averageHours
    });
  }, [employees, attendanceRecords]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString()
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updatedEmployee: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setAttendanceRecords(prev => prev.filter(record => record.employeeId !== id));
  };

  const checkIn = (employeeId: string) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const time = format(now, 'HH:mm');
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const existingRecord = attendanceRecords.find(
      record => record.employeeId === employeeId && record.date === today
    );

    if (existingRecord) {
      // Actualizar registro existente
      setAttendanceRecords(prev => prev.map(record =>
        record.id === existingRecord.id
          ? { ...record, checkIn: time, status: time > employee.workSchedule.startTime ? 'late' : 'present' }
          : record
      ));
    } else {
      // Crear nuevo registro
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        employeeId,
        date: today,
        checkIn: time,
        status: time > employee.workSchedule.startTime ? 'late' : 'present',
        hoursWorked: 0
      };
      setAttendanceRecords(prev => [...prev, newRecord]);
    }
  };

  const checkOut = (employeeId: string) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const time = format(now, 'HH:mm');
    
    const existingRecord = attendanceRecords.find(
      record => record.employeeId === employeeId && record.date === today
    );

    if (existingRecord && existingRecord.checkIn) {
      const checkInTime = parseISO(`${today}T${existingRecord.checkIn}:00`);
      const checkOutTime = parseISO(`${today}T${time}:00`);
      const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      setAttendanceRecords(prev => prev.map(record =>
        record.id === existingRecord.id
          ? { ...record, checkOut: time, hoursWorked: Math.round(hoursWorked * 100) / 100 }
          : record
      ));
    }
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString()
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const getEmployeeAttendance = (employeeId: string, date?: string) => {
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');
    return attendanceRecords.find(
      record => record.employeeId === employeeId && record.date === targetDate
    );
  };

  const getTodayAttendance = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return attendanceRecords.filter(record => record.date === today);
  };

  return (
    <AttendanceContext.Provider value={{
      employees,
      attendanceRecords,
      departments,
      stats,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      checkIn,
      checkOut,
      addAttendanceRecord,
      getEmployeeAttendance,
      getTodayAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};