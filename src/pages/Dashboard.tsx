import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { stats, employees, getTodayAttendance } = useAttendance();
  const todayAttendance = getTodayAttendance();

  const statCards = [
    {
      title: 'Total Empleados',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Presentes Hoy',
      value: stats.presentToday,
      icon: Clock,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Ausentes Hoy',
      value: stats.absentToday,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Llegadas Tarde',
      value: stats.lateToday,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asistencia de hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de asistencia */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Asistencia de Hoy</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayAttendance.length > 0 ? (
                todayAttendance.map((record) => {
                  const employee = employees.find(emp => emp.id === record.employeeId);
                  if (!employee) return null;

                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            record.status === 'present' 
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status === 'present' ? 'Presente' : 
                             record.status === 'late' ? 'Tarde' : 'Ausente'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Entrada: {record.checkIn || 'No registrada'}
                        </p>
                        {record.checkOut && (
                          <p className="text-xs text-gray-500">
                            Salida: {record.checkOut}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No hay registros de asistencia para hoy</p>
              )}
            </div>
          </div>
        </div>

        {/* Resumen rápido */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Resumen Rápido</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasa de Asistencia</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalEmployees > 0 
                  ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${stats.totalEmployees > 0 
                    ? (stats.presentToday / stats.totalEmployees) * 100 
                    : 0}%` 
                }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Promedio de Horas</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.averageHours.toFixed(1)}h
              </span>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full btn-primary text-left">
                  Registrar Asistencia Manual
                </button>
                <button className="w-full btn-secondary text-left">
                  Ver Reportes del Mes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;