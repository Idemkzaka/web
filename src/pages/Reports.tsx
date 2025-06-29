import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';

const Reports: React.FC = () => {
  const { employees, attendanceRecords } = useAttendance();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [...new Set(employees.map(emp => emp.department))];

  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedMonth));
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const workDays = daysInMonth.filter(day => !isWeekend(day));
    
    const filteredEmployees = selectedDepartment === 'all' 
      ? employees 
      : employees.filter(emp => emp.department === selectedDepartment);

    const attendanceByDay = workDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayRecords = attendanceRecords.filter(record => 
        record.date === dayStr && 
        filteredEmployees.some(emp => emp.id === record.employeeId)
      );
      
      const present = dayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
      const late = dayRecords.filter(r => r.status === 'late').length;
      const absent = filteredEmployees.length - present;
      
      return {
        date: format(day, 'dd/MM'),
        present,
        absent,
        late,
        total: filteredEmployees.length
      };
    });

    return attendanceByDay;
  }, [selectedMonth, selectedDepartment, employees, attendanceRecords]);

  const departmentStats = useMemo(() => {
    const stats = departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      const monthStart = startOfMonth(new Date(selectedMonth));
      const monthEnd = endOfMonth(new Date(selectedMonth));
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      const workDays = daysInMonth.filter(day => !isWeekend(day));
      
      const totalPossibleAttendance = deptEmployees.length * workDays.length;
      const actualAttendance = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && 
               recordDate <= monthEnd && 
               deptEmployees.some(emp => emp.id === record.employeeId) &&
               (record.status === 'present' || record.status === 'late');
      }).length;
      
      const attendanceRate = totalPossibleAttendance > 0 
        ? Math.round((actualAttendance / totalPossibleAttendance) * 100)
        : 0;
      
      return {
        name: dept,
        employees: deptEmployees.length,
        attendanceRate,
        totalDays: totalPossibleAttendance,
        presentDays: actualAttendance
      };
    });
    
    return stats;
  }, [selectedMonth, employees, attendanceRecords, departments]);

  const overallStats = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedMonth));
    const monthRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const present = monthRecords.filter(r => r.status === 'present').length;
    const late = monthRecords.filter(r => r.status === 'late').length;
    const absent = monthRecords.filter(r => r.status === 'absent').length;
    const total = present + late + absent;

    return [
      { name: 'Presente', value: present, color: '#22c55e' },
      { name: 'Tarde', value: late, color: '#f59e0b' },
      { name: 'Ausente', value: absent, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [selectedMonth, attendanceRecords]);

  const exportReport = () => {
    const csvContent = [
      ['Fecha', 'Presentes', 'Ausentes', 'Tarde', 'Total'],
      ...monthlyData.map(day => [
        day.date,
        day.present,
        day.absent,
        day.late,
        day.total
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-asistencia-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Asistencia</h1>
          <p className="text-gray-600">Análisis y estadísticas del personal</p>
        </div>
        <button onClick={exportReport} className="btn-primary mt-4 sm:mt-0">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <label className="label">Mes:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <label className="label">Departamento:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input"
            >
              <option value="all">Todos los departamentos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Asistencia diaria */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Asistencia Diaria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#22c55e" name="Presentes" />
                <Bar dataKey="late" fill="#f59e0b" name="Tarde" />
                <Bar dataKey="absent" fill="#ef4444" name="Ausentes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico circular - Resumen general */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Mes</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {overallStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Estadísticas por departamento */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Estadísticas por Departamento</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Días Presentes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Días
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasa de Asistencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentStats.map((dept) => (
                <tr key={dept.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.presentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.totalDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${dept.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {dept.attendanceRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;