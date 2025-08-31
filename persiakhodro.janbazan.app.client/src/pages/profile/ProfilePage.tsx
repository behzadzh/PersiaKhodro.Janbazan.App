import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Save, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const schema = yup.object({
  firstName: yup.string().required('نام الزامی است'),
  lastName: yup.string().required('نام خانوادگی الزامی است'),
  email: yup.string().email('ایمیل معتبر وارد کنید'),
  address: yup.string(),
  postalCode: yup.string().matches(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
});

type ProfileFormData = yup.InferType<typeof schema>;

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || '',
        address: user.address || '',
        postalCode: user.postalCode || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      await api.put('/profile/me', data);
      await refreshUser();
      setMessage({ type: 'success', text: 'پروفایل با موفقیت به‌روزرسانی شد' });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-primary-600 ml-3" />
            <h1 className="text-xl font-semibold text-gray-900">ویرایش پروفایل</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Read-only Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">اطلاعات غیرقابل تغییر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">کد ملی:</span>
                <span className="font-medium text-gray-900 mr-2">{user.nationalCode}</span>
              </div>
              <div>
                <span className="text-gray-500">شماره موبایل:</span>
                <span className="font-medium text-gray-900 mr-2">{user.mobileNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">تاریخ تولد:</span>
                <span className="font-medium text-gray-900 mr-2">
                  {new Date(user.dateOfBirth).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
          </div>

          {/* Editable Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                نام *
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="input-field"
                placeholder="نام"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-error-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی *
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="input-field"
                placeholder="نام خانوادگی"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-error-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              آدرس
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="input-field"
              placeholder="آدرس کامل"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <input
              {...register('postalCode')}
              type="text"
              className="input-field"
              placeholder="کد پستی ۱۰ رقمی"
              maxLength={10}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-error-600">{errors.postalCode.message}</p>
            )}
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-success-50 border border-success-200 text-success-700' 
                : 'bg-error-50 border border-error-200 text-error-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 ml-2" />
              ) : (
                <AlertCircle className="h-5 w-5 ml-2" />
              )}
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !isDirty}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  ذخیره تغییرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;