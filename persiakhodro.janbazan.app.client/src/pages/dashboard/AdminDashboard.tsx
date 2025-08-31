import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Vehicle } from '../../types';
import api from '../../services/api';
import { 
  Car, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

interface DashboardStats {
  totalVehicles: number;
  totalUsers: number;
  pendingCases: number;
  completedCases: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalUsers: 0,
    pendingCases: 0,
    completedCases: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Note: These endpoints would need to be implemented in the backend
      // For now, we'll use mock data
      
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalVehicles: 1247,
          totalUsers: 892,
          pendingCases: 156,
          completedCases: 1091,
          totalRevenue: 45600000,
          monthlyGrowth: 12.5
        });

        setRecentVehicles([
          {
            id: '1',
            vin: '1HGBH41JXMN109186',
            modelName: 'پژو ۲۰۶',
            productionYear: 1402,
            plateNumber: '۱۲ ج ۳۴۵ ایران ۶۷',
            status: 'Submitted'
          },
          {
            id: '2',
            vin: '2HGBH41JXMN109187',
            modelName: 'سمند LX',
            productionYear: 1401,
            plateNumber: '۸۹ الف ۱۲۳ ایران ۴۵',
            status: 'UnderReview'
          }
        ]);

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
              داشبورد مدیریت
            </h1>
            <p className="text-gray-600 mt-1">
              خوش آمدید، {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="bg-primary-100 p-3 rounded-full">
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-primary-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">کل خودروها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-success-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">کل کاربران</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-warning-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">پرونده‌های در انتظار</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingCases.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">پرونده‌های تکمیل شده</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCases.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">درآمد کل</h3>
            <DollarSign className="h-6 w-6 text-success-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalRevenue.toLocaleString('fa-IR')} تومان
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-success-600 ml-1" />
            <span className="text-sm text-success-600">
              {stats.monthlyGrowth}% رشد نسبت به ماه قبل
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">عملکرد سیستم</h3>
            <AlertTriangle className="h-6 w-6 text-warning-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">نرخ تکمیل پرونده‌ها</span>
              <span className="text-sm font-medium text-gray-900">87.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">آخرین خودروهای ثبت شده</h2>
        </div>
        <div className="p-6">
          {recentVehicles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">هیچ خودرویی یافت نشد</p>
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
                  {recentVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vehicle.modelName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.productionYear}
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
                        <button className="text-primary-600 hover:text-primary-900 ml-3">
                          مشاهده
                        </button>
                        <button className="text-warning-600 hover:text-warning-900">
                          ویرایش
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;