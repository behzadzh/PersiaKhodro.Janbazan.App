import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from '../../services/authService';
import { Car, Eye, EyeOff, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const schema = yup.object({
  firstName: yup.string().required('نام الزامی است'),
  lastName: yup.string().required('نام خانوادگی الزامی است'),
  nationalCode: yup
    .string()
    .required('کد ملی الزامی است')
    .matches(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
  mobileNumber: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'),
  password: yup
    .string()
    .required('رمز عبور الزامی است')
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  confirmPassword: yup
    .string()
    .required('تکرار رمز عبور الزامی است')
    .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن باید یکسان باشند'),
  dateOfBirth: yup
    .string()
    .required('تاریخ تولد الزامی است'),
});

type RegisterFormData = yup.InferType<typeof schema>;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        nationalCode: data.nationalCode,
        mobileNumber: data.mobileNumber,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
      };

      const result = await authService.register(registerData);
      
      if (result.isSuccess) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'خطا در ثبت نام');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Car className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ثبت نام در سیستم
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            سیستم مدیریت گارانتی ایران خودرو - جانبازان
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  نام
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
                  نام خانوادگی
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
              <label htmlFor="nationalCode" className="block text-sm font-medium text-gray-700 mb-1">
                کد ملی
              </label>
              <input
                {...register('nationalCode')}
                type="text"
                className="input-field"
                placeholder="کد ملی ۱۰ رقمی"
                maxLength={10}
              />
              {errors.nationalCode && (
                <p className="mt-1 text-sm text-error-600">{errors.nationalCode.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                شماره موبایل
              </label>
              <input
                {...register('mobileNumber')}
                type="text"
                className="input-field"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                maxLength={11}
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-error-600">{errors.mobileNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                تاریخ تولد
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                className="input-field"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-error-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10"
                  placeholder="رمز عبور"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-field pl-10"
                  placeholder="تکرار رمز عبور"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 ml-2" />
              {successMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  در حال ثبت نام...
                </>
              ) : (
                'ثبت نام'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                وارد شوید
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;