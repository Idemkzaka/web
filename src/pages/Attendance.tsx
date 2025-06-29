import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Attendance: React.FC = () => {
  const { employees, checkIn, checkOut, getEmployeeAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleCheckIn = (employeeId: string) => {
    checkIn(employeeId);
  };

  const handleCheckOut = (employeeId: string) => {
    checkOut(employeeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
          <p className="text-gray-600">Registra entradas y salidas del personal</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Lista de empleados */}
      <div className="grid gap-6">
        {employees.map((employee) => {
          const attendance = getEmployeeAttendance(employee.id, selectedDate);
          const hasCheckedIn = attendance?.checkIn;
          const hasCheckedOut = attendance?.checkOut;

          return (
            <div key={employee.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.department} • {employee.position}</p>
                    <p className="text-xs text-gray-400">ID: {employee.employeeId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Estado de asistencia */}
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-2">
                      {attendance?.status === 'present' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {attendance?.status === 'late' && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {attendance?.status === 'absent' && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {!attendance && (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        attendance?.status === 'present' ? 'text-green-600' :
                        attendance?.status === 'late' ? 'text-yellow-600' :
                        attendance?.status === 'absent' ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {attendance?.status === 'present' ? 'Presente' :
                         attendance?.status === 'late' ? 'Tarde' :
                         attendance?.status === 'absent' ? 'Ausente' :
                         'Sin registro'}
                      </span>
                    </div>
                    
                    {attendance && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {attendance.checkIn && (
                          <div>Entrada: {attendance.checkIn}</div>
                        )}
                        {attendance.checkOut && (
                          <div>Salida: {attendance.checkOut}</div>
                        )}
                        {attendance.hoursWorked && (
                          <div>Horas: {attendance.hoursWorked}h</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCheckIn(employee.id)}
                      disabled={hasCheckedIn}
                      className={`btn ${
                        hasCheckedIn 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'btn-success'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {hasCheckedIn ? 'Registrado' : 'Entrada'}
                    </button>
                    
                    <button
                      onClick={() => handleCheckOut(employee.id)}
                      disabled={!hasCheckedIn || hasCheckedOut}
                      className={`btn ${
                        !hasCheckedIn || hasCheckedOut
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'btn-warning'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {hasCheckedOut ? 'Salida Reg.' : 'Salida'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Horario de trabajo */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Horario: {employee.workSchedule.startTime} - {employee.workSchedule.endTime}
                  </span>
                  <span>
                    Días: {employee.workSchedule.workDays.length} días/semana
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empleados</h3>
          <p className="mt-1 text-sm text-gray-500">
            Agrega empleados para comenzar a registrar asistencia.
          </p>
        </div>
      )}
    </div>
  );
};

export default Attendance;