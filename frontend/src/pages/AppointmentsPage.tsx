import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI, Appointment, AppointmentStatus } from '@/api/appointments';
import { patientsAPI } from '@/api/patients';
import { serviceTypesAPI } from '@/api/serviceTypes';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Zakazan',
  confirmed: 'Potvrđen',
  completed: 'Završen',
  cancelled: 'Otkazan',
  no_show: 'Nije se pojavio',
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-orange-100 text-orange-800',
};

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Fetch appointments for selected date
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: () => appointmentsAPI.getAll({
      start_date: selectedDate,
      end_date: selectedDate,
    }),
  });

  // Fetch patients and service types for form
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientsAPI.getAll(),
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => serviceTypesAPI.getAll({ active_only: true }),
  });

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: appointmentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowForm(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Greška pri kreiranju termina');
    },
  });

  // Update appointment mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => appointmentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setEditingAppointment(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Greška pri ažuriranju termina');
    },
  });

  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: appointmentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const serviceTypeId = parseInt(formData.get('service_type_id') as string);
    const serviceType = serviceTypes.find(st => st.id === serviceTypeId);

    const startTime = formData.get('start_time') as string;
    const startDateTime = new Date(`${selectedDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (serviceType?.duration || 30) * 60000);

    const appointmentData = {
      patient_id: parseInt(formData.get('patient_id') as string),
      service_type_id: serviceTypeId,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: (formData.get('status') as AppointmentStatus) || 'scheduled',
      notes: formData.get('notes') as string || undefined,
    };

    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, data: appointmentData });
    } else {
      createMutation.mutate(appointmentData);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  };

  // Sort appointments by start time
  const sortedAppointments = [...appointments].sort((a, b) =>
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Termini</h1>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              + Zakaži Termin
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Navigator */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousDay}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              ← Prethodni dan
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToday}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Danas
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleNextDay}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Sledeći dan →
            </button>
          </div>
          <div className="text-center mt-3 text-lg font-medium text-gray-700">
            {formatDate(selectedDate)}
          </div>
        </div>

        {/* Appointment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingAppointment ? 'Izmeni Termin' : 'Novi Termin'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pacijent *</label>
                  <select
                    name="patient_id"
                    required
                    defaultValue={editingAppointment?.patient_id}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Izaberite pacijenta</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usluga *</label>
                  <select
                    name="service_type_id"
                    required
                    defaultValue={editingAppointment?.service_type_id}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Izaberite uslugu</option>
                    {serviceTypes.map((serviceType) => (
                      <option key={serviceType.id} value={serviceType.id}>
                        {serviceType.name} ({serviceType.duration} min)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vreme *</label>
                  <input
                    name="start_time"
                    type="time"
                    required
                    defaultValue={editingAppointment ? formatTime(editingAppointment.start_time).replace(':', ':') : '09:00'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status *</label>
                  <select
                    name="status"
                    defaultValue={editingAppointment?.status || 'scheduled'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Napomene</label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editingAppointment?.notes}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {editingAppointment ? 'Sačuvaj' : 'Zakaži'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Otkaži
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Greška pri učitavanju termina
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nema zakazanih termina za ovaj dan
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow p-4 border-l-4 hover:shadow-md transition-shadow"
                style={{ borderLeftColor: appointment.service_type.color }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${STATUS_COLORS[appointment.status]}`}>
                        {STATUS_LABELS[appointment.status]}
                      </span>
                    </div>
                    <div className="text-base font-medium text-gray-800 mb-1">
                      {appointment.patient.first_name} {appointment.patient.last_name}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      📞 {appointment.patient.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: appointment.service_type.color }}
                      />
                      {appointment.service_type.name} ({appointment.service_type.duration} min)
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="px-3 py-1 text-sm text-primary hover:bg-blue-50 rounded"
                    >
                      Izmeni
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
