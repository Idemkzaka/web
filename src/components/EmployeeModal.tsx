import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: string | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, employeeId }) => {
  const { employees, departments, addEmployee, updateEmployee } = useAttendance();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    employeeId: '',
    phone: '',
    hireDate: '',
    status: 'active' as 'active' | 'inactive',
    workSchedule: {
      startTime: '09:00',
      endTime: '18:00',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  });

  const isEditing = !!employeeId;

  useEffect(() => {
    if (isEditing && employeeId) {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        setFormData({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          employeeId: employee.employeeId,
          phone: employee.phone,
          hireDate: employee.hireDate,
          status: employee.status,
          workSchedule: employee.workSchedule
        });
      }
    } else {
      // Reset form for new employee
      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        employeeId: '',
        phone: '',
        hireDate: '',
        status: 'active',
        workSchedule: {
          startTime: '09:00',
          endTime: '18:00',
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      });
    }
  }, [isEditing, employeeId, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && employeeId) {
      updateEmployee(employeeId, formData);
    } else {
      addEmployee(formData);
    }
    
    onClose();
  };

  const handleWorkDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        workDays: checked
          ? [...prev.workSchedule.workDays, day]
          : prev.workSchedule.workDays.filter(d => d !== day)
      }
    }));
  };

  const workDays = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Empleado' : 'Agregar Empleado'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">ID Empleado</label>
                <input
                  type="text"
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Departamento</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="input"
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Posición</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Fecha de Contratación</label>
                <input
                  type="date"
                  required
                  value={formData.hireDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="input"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Horario de trabajo */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Horario de Trabajo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="label">Hora de Entrada</label>
                  <input
                    type="time"
                    value={formData.workSchedule.startTime}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workSchedule: { ...prev.workSchedule, startTime: e.target.value }
                    }))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Hora de Salida</label>
                  <input
                    type="time"
                    value={formData.workSchedule.endTime}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workSchedule: { ...prev.workSchedule, endTime: e.target.value }
                    }))}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label mb-3">Días de Trabajo</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {workDays.map(day => (
                    <label key={day.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.workSchedule.workDays.includes(day.key)}
                        onChange={(e) => handleWorkDayChange(day.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {isEditing ? 'Actualizar' : 'Agregar'} Empleado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;