import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Moji Termini</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dobrodošli!</h2>
          <p className="text-gray-600 mb-4">
            Uspešno ste se prijavili na Moji Termini administraciju.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">✅ Phase 1 Complete!</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Backend API pokrenut</li>
              <li>• PostgreSQL baza povezana</li>
              <li>• JWT autentifikacija radi</li>
              <li>• React frontend postavljen</li>
              <li>• Login/Logout funkcionalnost</li>
            </ul>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-3">🚀 Dostupne Stranice:</h3>
            <div className="space-y-2">
              <Link
                to="/appointments"
                className="block px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                📅 Kalendar Termina
              </Link>
              <Link
                to="/patients"
                className="block px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                👥 Pacijenti
              </Link>
              <Link
                to="/service-types"
                className="block px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                🔧 Tipovi Usluga
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Informacije o nalogu:</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Ime</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rola</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Clinic ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.clinic_id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
