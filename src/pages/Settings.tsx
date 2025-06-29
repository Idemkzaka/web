import React, { useState } from 'react';
import { Settings as SettingsIcon, Clock, Users, Bell, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    workingHours: {
      start: '09:00',
      end: '18:00',
      lunchBreak: 60
    },
    notifications: {
      lateArrival: true,
      earlyDeparture: true,
      absence: true,
      emailReports: false
    },
    attendance: {
      graceTime: 15,
      autoCheckout: false,
      requireNotes: false
    },
    company: {
      name: 'Mi Empresa',
      timezone: 'America/Mexico_City',
      currency: 'MXN'
    }
  });

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // Aquí guardarías la configuración
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Personaliza el sistema según tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de empresa */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Información de la Empresa</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="label">Nombre de la Empresa</label>
              <input
                type="text"
                value={settings.company.name}
                onChange={(e) => handleSettingChange('company', 'name', e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">Zona Horaria</label>
              <select
                value={settings.company.timezone}
                onChange={(e) => handleSettingChange('company', 'timezone', e.target.value)}
                className="input"
              >
                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                <option value="America/New_York">Nueva York (GMT-5)</option>
                <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                <option value="Europe/Madrid">Madrid (GMT+1)</option>
              </select>
            </div>
            
            <div>
              <label className="label">Moneda</label>
              <select
                value={settings.company.currency}
                onChange={(e) => handleSettingChange('company', 'currency', e.target.value)}
                className="input"
              >
                <option value="MXN">Peso Mexicano (MXN)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Horarios de trabajo */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Horarios de Trabajo</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="label">Hora de Entrada</label>
              <input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => handleSettingChange('workingHours', 'start', e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">Hora de Salida</label>
              <input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => handleSettingChange('workingHours', 'end', e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">Tiempo de Almuerzo (minutos)</label>
              <input
                type="number"
                value={settings.workingHours.lunchBreak}
                onChange={(e) => handleSettingChange('workingHours', 'lunchBreak', parseInt(e.target.value))}
                className="input"
                min="0"
                max="120"
              />
            </div>
          </div>
        </div>

        {/* Configuración de asistencia */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Control de Asistencia</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="label">Tiempo de Gracia (minutos)</label>
              <input
                type="number"
                value={settings.attendance.graceTime}
                onChange={(e) => handleSettingChange('attendance', 'graceTime', parseInt(e.target.value))}
                className="input"
                min="0"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tiempo permitido de retraso antes de marcar como tarde
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoCheckout"
                checked={settings.attendance.autoCheckout}
                onChange={(e) => handleSettingChange('attendance', 'autoCheckout', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="autoCheckout" className="ml-2 text-sm text-gray-700">
                Salida automática al final del horario
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNotes"
                checked={settings.attendance.requireNotes}
                onChange={(e) => handleSettingChange('attendance', 'requireNotes', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="requireNotes" className="ml-2 text-sm text-gray-700">
                Requerir notas para ausencias
              </label>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lateArrival"
                checked={settings.notifications.lateArrival}
                onChange={(e) => handleSettingChange('notifications', 'lateArrival', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="lateArrival" className="ml-2 text-sm text-gray-700">
                Notificar llegadas tarde
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="earlyDeparture"
                checked={settings.notifications.earlyDeparture}
                onChange={(e) => handleSettingChange('notifications', 'earlyDeparture', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="earlyDeparture" className="ml-2 text-sm text-gray-700">
                Notificar salidas tempranas
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="absence"
                checked={settings.notifications.absence}
                onChange={(e) => handleSettingChange('notifications', 'absence', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="absence" className="ml-2 text-sm text-gray-700">
                Notificar ausencias
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailReports"
                checked={settings.notifications.emailReports}
                onChange={(e) => handleSettingChange('notifications', 'emailReports', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="emailReports" className="ml-2 text-sm text-gray-700">
                Enviar reportes por email
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones de datos */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Datos</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-secondary">
            Exportar Todos los Datos
          </button>
          <button className="btn-secondary">
            Importar Empleados
          </button>
          <button className="btn-error">
            Limpiar Datos de Prueba
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Las acciones de datos son permanentes. Asegúrate de hacer una copia de seguridad antes de proceder.
        </p>
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <button onClick={saveSettings} className="btn-primary">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default Settings;