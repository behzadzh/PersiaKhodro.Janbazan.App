import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Vehicle } from '../../types';
import api from '../../services/api';
import { Car, Plus, FileText, MessageSquare, CreditCard, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              خوش آمدید، {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              سیستم مدیریت گارانتی ایران خودرو - جانبازان
            </p>
          </div>
          <Car className="h-12 w-12 text-primary-600" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/vehicles/new"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Plus className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
            </div>
            <div className="mr-4">
              <h3 className="text-lg font-medium text-gray-900">ثبت خودرو جدید</h3>
              <p className="text-sm text-gray-500">افزودن خودرو برای درخواست گارانتی</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
            </div>
            <div className="mr-4">
              <h3 className="text-lg font-medium text-gray-900">ویرایش پروفایل</h3>
              <p className="text-sm text-gray-500">مدیریت اطلاعات شخصی</p>
            </div>
          </div>
        </Link>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <div className="mr-4">
              <h3 className="text-lg font-medium text-gray-900">پشتیبانی</h3>
              <p className="text-sm text-gray-500">ارتباط با تیم پشتیبانی</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">خودروهای من</h2>
            <Link
              to="/vehicles/new"
              className="btn-primary text-sm flex items-center"
            >
              <Plus className="h-4 w-4 ml-1" />
              افزودن خودرو
            </Link>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 ml-2" />
              {error}
            </div>
          )}

          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                هنوز خودرویی ثبت نکرده‌اید
              </h3>
              <p className="text-gray-500 mb-6">
                برای شروع فرآیند گارانتی، ابتدا خودرو خود را ثبت کنید
              </p>
              <Link to="/vehicles/new" className="btn-primary">
                ثبت خودرو جدید
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{vehicle.modelName}</h3>
                      <p className="text-sm text-gray-500">سال تولید: {vehicle.productionYear}</p>
                    </div>
                    <span className={getStatusClass(vehicle.status)}>
                      {getStatusText(vehicle.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>شماره شاسی: {vehicle.vin}</p>
                    {vehicle.plateNumber && (
                      <p>شماره پلاک: {vehicle.plateNumber}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Link
                      to={`/vehicles/${vehicle.id}`}
                      className="flex-1 text-center py-2 px-3 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors text-sm font-medium"
                    >
                      مشاهده جزئیات
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;