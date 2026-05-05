import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceTypesAPI, ServiceType } from '@/api/serviceTypes';

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

export default function ServiceTypesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);

  // Fetch service types
  const { data: serviceTypes = [], isLoading, error } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => serviceTypesAPI.getAll(),
  });

  // Create service type mutation
  const createMutation = useMutation({
    mutationFn: serviceTypesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      setShowForm(false);
    },
  });

  // Update service type mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => serviceTypesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      setEditingServiceType(null);
      setShowForm(false);
    },
  });

  // Delete service type mutation
  const deleteMutation = useMutation({
    mutationFn: serviceTypesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const serviceTypeData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      duration: parseInt(formData.get('duration') as string),
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
      color: formData.get('color') as string,
      is_active: formData.get('is_active') === 'on',
    };

    if (editingServiceType) {
      updateMutation.mutate({ id: editingServiceType.id, data: serviceTypeData });
    } else {
      createMutation.mutate(serviceTypeData);
    }
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu uslugu?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingServiceType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Tipovi Usluga</h1>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              + Dodaj Uslugu
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Type Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingServiceType ? 'Izmeni Uslugu' : 'Nova Usluga'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Naziv *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingServiceType?.name}
                    placeholder="npr. Kontrolni pregled"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opis</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingServiceType?.description}
                    placeholder="Kratak opis usluge"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trajanje (minuti) *</label>
                  <input
                    name="duration"
                    type="number"
                    required
                    min="5"
                    max="480"
                    defaultValue={editingServiceType?.duration || 30}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cena (RSD)</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={editingServiceType?.price}
                    placeholder="npr. 2000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boja *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <label key={color} className="cursor-pointer">
                        <input
                          type="radio"
                          name="color"
                          value={color}
                          defaultChecked={editingServiceType?.color === color || (!editingServiceType && color === '#3B82F6')}
                          className="sr-only peer"
                        />
                        <div
                          className="w-full h-10 rounded-md border-2 border-transparent peer-checked:border-gray-900"
                          style={{ backgroundColor: color }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    name="is_active"
                    type="checkbox"
                    defaultChecked={editingServiceType?.is_active ?? true}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Aktivna</label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {editingServiceType ? 'Sačuvaj' : 'Kreiraj'}
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

        {/* Service Types List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Greška pri učitavanju usluga
          </div>
        ) : serviceTypes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nema definisanih usluga. Dodajte prvu uslugu!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((serviceType) => (
              <div
                key={serviceType.id}
                className="bg-white rounded-lg shadow p-6 border-l-4 hover:shadow-lg transition-shadow"
                style={{ borderLeftColor: serviceType.color }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{serviceType.name}</h3>
                    {!serviceType.is_active && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                        Neaktivna
                      </span>
                    )}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: serviceType.color }}
                  />
                </div>
                {serviceType.description && (
                  <p className="text-sm text-gray-600 mb-3">{serviceType.description}</p>
                )}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {serviceType.duration} min
                  </div>
                  {serviceType.price && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {serviceType.price.toLocaleString('sr-RS')} RSD
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(serviceType)}
                    className="flex-1 px-3 py-2 text-sm text-primary hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Izmeni
                  </button>
                  <button
                    onClick={() => handleDelete(serviceType.id)}
                    className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
