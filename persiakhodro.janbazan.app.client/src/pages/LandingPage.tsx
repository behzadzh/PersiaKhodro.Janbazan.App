import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Users, FileText, ArrowLeft } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Car className="h-8 w-8 text-primary-600" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">سیستم گارانتی</span>
                <span className="text-xs text-gray-500">ایران خودرو - جانبازان</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ورود
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                ثبت نام
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary-600 p-4 rounded-full">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            سیستم مدیریت گارانتی
            <span className="block text-primary-600">ایران خودرو - جانبازان</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            سامانه‌ای جامع برای مدیریت درخواست‌های گارانتی خودروهای جانبازان عزیز
            با امکان پیگیری آنلاین و ارتباط مستقیم با تیم پشتیبانی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
            >
              شروع کنید
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-3"
            >
              ورود به حساب کاربری
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ویژگی‌های سیستم
          </h2>
          <p className="text-lg text-gray-600">
            تمام امکانات مورد نیاز برای مدیریت گارانتی در یک مکان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ثبت خودرو
            </h3>
            <p className="text-gray-600">
              ثبت آسان اطلاعات خودرو با شماره شاسی و مدارک مربوطه
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              پیگیری آنلاین
            </h3>
            <p className="text-gray-600">
              پیگیری وضعیت درخواست گارانتی به صورت آنلاین و لحظه‌ای
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-warning-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              پشتیبانی ۲۴/۷
            </h3>
            <p className="text-gray-600">
              ارتباط مستقیم با تیم پشتیبانی و دریافت پاسخ سریع
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 space-x-reverse mb-4">
              <Car className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900">
                سیستم گارانتی ایران خودرو - جانبازان
              </span>
            </div>
            <p className="text-gray-600">
              © ۱۴۰۳ تمامی حقوق محفوظ است
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;