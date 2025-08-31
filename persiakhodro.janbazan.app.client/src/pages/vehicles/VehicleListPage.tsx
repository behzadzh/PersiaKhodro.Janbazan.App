import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../../types';
import api from '../../services/api';
import { Car, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const VehicleListPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles/my-vehicles');
      setVehicles(response.data);
    } catch (error) {
      setError('خطا در دریافت اطلاعات خودروها');
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Submitted': 'ثبت شده',
      'AwaitingDocuments': 'در انتظار مدارک',
      'UnderReview': 'در حال بررسی',
      'AwaitingPayment': 'در انتظار پرداخت',
      'Completed': 'تکمیل شده',
      'Rejected': 'رد شده'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      'Submitted': 'status-submitted',
      'AwaitingDocuments': 'status-under-review',
      'UnderReview': 'status-under-review',
      'AwaitingPayment': 'status-awaiting-payment',
      'Completed': 'status-completed',
      'Rejected': 'status-rejected'
    };
    return statusClasses[status] || 'status-submitted';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin.includes(searchTerm) ||
                         (vehicle.plateNumber && vehicle.plateNumber.includes(searchTerm));
    const matchesStatus = statusFilter === '' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Car className="h-8 w-8 text-primary-600 ml-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">خودروهای من</h1>
            <p className="text-gray-600">مدیریت خودروها و پیگیری وضعیت گارانتی</p>
          </div>
        </div>
        <Link to="/vehicles/new" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 ml-1" />
          افزودن خودرو جدید
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="جستجو بر اساس مدل، شماره شاسی یا پلاک..."
                className="input-field pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="Submitted">ثبت شده</option>
              <option value="AwaitingDocuments">در انتظار مدارک</option>
              <option value="UnderReview">در حال بررسی</option>
              <option value="AwaitingPayment">در انتظار پرداخت</option>
              <option value="Completed">تکمیل شده</option>
              <option value="Rejected">رد شده</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 ml-2" />
          {error}
        </div>
      )}

      {/* Vehicles List */}
      <div className="card">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {vehicles.length === 0 ? 'هنوز خودرویی ثبت نکرده‌اید' : 'خودرویی یافت نشد'}
            </h3>
            <p className="text-gray-500 mb-6">
              {vehicles.length === 0 
                ? 'برای شروع فرآیند گارانتی، ابتدا خودرو خود را ثبت کنید'
                : 'فیلترهای جستجو را تغییر دهید'
              }
            </p>
            {vehicles.length === 0 && (
              <Link to="/vehicles/new" className="btn-primary">
                ثبت خودرو جدید
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مدل خودرو
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سال تولید
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره شاسی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره پلاک
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-gray-400 ml-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.modelName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.productionYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {vehicle.vin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.plateNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusClass(vehicle.status)}>
                        {getStatusText(vehicle.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="text-primary-600 hover:text-primary-900 ml-3"
                      >
                        مشاهده جزئیات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleListPage;