/**
 * Service Type API calls
 */
import apiClient from './client';

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  duration: number; // in minutes
  price?: number;
  color: string; // hex color
  is_active: boolean;
  clinic_id: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceTypeCreate {
  name: string;
  description?: string;
  duration: number;
  price?: number;
  color: string;
  is_active: boolean;
}

export interface ServiceTypeUpdate {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  color?: string;
  is_active?: boolean;
}

export const serviceTypesAPI = {
  /**
   * Get all service types
   */
  getAll: async (params?: { active_only?: boolean; skip?: number; limit?: number }): Promise<ServiceType[]> => {
    const response = await apiClient.get('/api/v1/service-types', { params });
    return response.data;
  },

  /**
   * Get a single service type by ID
   */
  getById: async (id: number): Promise<ServiceType> => {
    const response = await apiClient.get(`/api/v1/service-types/${id}`);
    return response.data;
  },

  /**
   * Create a new service type
   */
  create: async (data: ServiceTypeCreate): Promise<ServiceType> => {
    const response = await apiClient.post('/api/v1/service-types', data);
    return response.data;
  },

  /**
   * Update a service type
   */
  update: async (id: number, data: ServiceTypeUpdate): Promise<ServiceType> => {
    const response = await apiClient.put(`/api/v1/service-types/${id}`, data);
    return response.data;
  },

  /**
   * Delete a service type
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/service-types/${id}`);
  },
};
