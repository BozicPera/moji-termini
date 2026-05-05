/**
 * Patient API calls
 */
import apiClient from './client';

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  notes?: string;
  clinic_id: number;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  notes?: string;
}

export interface PatientUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  notes?: string;
}

export const patientsAPI = {
  /**
   * Get all patients with optional search
   */
  getAll: async (params?: { search?: string; skip?: number; limit?: number }): Promise<Patient[]> => {
    const response = await apiClient.get('/api/v1/patients', { params });
    return response.data;
  },

  /**
   * Get a single patient by ID
   */
  getById: async (id: number): Promise<Patient> => {
    const response = await apiClient.get(`/api/v1/patients/${id}`);
    return response.data;
  },

  /**
   * Create a new patient
   */
  create: async (data: PatientCreate): Promise<Patient> => {
    const response = await apiClient.post('/api/v1/patients', data);
    return response.data;
  },

  /**
   * Update a patient
   */
  update: async (id: number, data: PatientUpdate): Promise<Patient> => {
    const response = await apiClient.put(`/api/v1/patients/${id}`, data);
    return response.data;
  },

  /**
   * Delete a patient
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/patients/${id}`);
  },
};
