/**
 * Appointment API calls
 */
import apiClient from './client';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: number;
  patient_id: number;
  service_type_id: number;
  clinic_id: number;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
  };
  service_type: {
    id: number;
    name: string;
    duration: number;
    color: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreate {
  patient_id: number;
  service_type_id: number;
  start_time: string;
  end_time: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface AppointmentUpdate {
  patient_id?: number;
  service_type_id?: number;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export const appointmentsAPI = {
  /**
   * Get all appointments with optional filters
   */
  getAll: async (params?: {
    start_date?: string;
    end_date?: string;
    patient_id?: number;
    status?: AppointmentStatus;
  }): Promise<Appointment[]> => {
    const response = await apiClient.get('/api/v1/appointments', { params });
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  getById: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get(`/api/v1/appointments/${id}`);
    return response.data;
  },

  /**
   * Create a new appointment
   */
  create: async (data: AppointmentCreate): Promise<Appointment> => {
    const response = await apiClient.post('/api/v1/appointments', data);
    return response.data;
  },

  /**
   * Update an appointment
   */
  update: async (id: number, data: AppointmentUpdate): Promise<Appointment> => {
    const response = await apiClient.put(`/api/v1/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Delete an appointment
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/appointments/${id}`);
  },
};
