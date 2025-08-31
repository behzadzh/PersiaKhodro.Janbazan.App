import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateVehicleDto } from '../../types';
import api from '../../services/api';
import { Car, Save, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const schema = yup.object({
  vin: yup
    .string()
    .required('شماره شاسی الزامی است')
    .length(17, 'شماره شاسی باید دقیقاً ۱۷ کاراکتر باشد'),
  modelName: yup.string().required('مدل خودرو الزامی است'),
  productionYear: yup
    .number()
    .required('سال تولید الزامی است')
    .min(1380, 'سال تولید نمی‌تواند کمتر از ۱۳۸۰ باشد')
    .max(new Date().getFullYear() + 1, 'سال تولید نمی‌تواند بیشتر از سال جاری باشد'),
  plateNumber: yup.string(),
  color: yup.string(),
});

type VehicleFormData = yup.InferType<typeof schema>;

const NewVehiclePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const vehicleData: CreateVehicleDto = {
        vin: data.vin.toUpperCase(),
        modelName: data.modelName,
        productionYear: data.productionYear,
        plateNumber: data.plateNumber || undefined,
        color: data.color || undefined,
      };

      await api.post('/vehicles', vehicleData);
      setMessage({ type: 'success', text: 'خودرو با موفقیت ثبت شد' });
      
      setTimeout(() => {
        navigate('/vehicles');
      }, 2000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'خطا در ثبت خودرو' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowRight className="h-5 w-5 ml-1" />
          بازگشت
        </button>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="h-6 w-6 text-primary-600 ml-3" />
            <h1 className="text-xl font-semibold text-gray-900">ثبت خودرو جدید</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            اطلاعات خودرو خود را برای درخواست گارانتی وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
              شماره شاسی (VIN) *
            </label>
            <input
              {...register('vin')}
              type="text"
              className="input-field font-mono"
              placeholder="شماره شاسی ۱۷ کاراکتری"
              maxLength={17}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.vin && (
              <p className="mt-1 text-sm text-error-600">{errors.vin.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              شماره شاسی را دقیقاً همانطور که روی خودرو نوشته شده وارد کنید
            </p>
          </div>

          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
              مدل خودرو *
            </label>
            <input
              {...register('modelName')}
              type="text"
              className="input-field"
              placeholder="مثال: پژو ۲۰۶، سمند LX، دنا پلاس"
            />
            {errors.modelName && (
              <p className="mt-1 text-sm text-error-600">{errors.modelName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productionYear" className="block text-sm font-medium text-gray-700 mb-1">
                سال تولید *
              </label>
              <input
                {...register('productionYear', { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="۱۴۰۲"
                min={1380}
                max={new Date().getFullYear() + 1}
              />
              {errors.productionYear && (
                <p className="mt-1 text-sm text-error-600">{errors.productionYear.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                رنگ خودرو
              </label>
              <input
                {...register('color')}
                type="text"
                className="input-field"
                placeholder="مثال: سفید، مشکی، نقره‌ای"
              />
            </div>
          </div>

          <div>
            <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-1">
              شماره پلاک
            </label>
            <input
              {...register('plateNumber')}
              type="text"
              className="input-field"
              placeholder="مثال: ۱۲ ج ۳۴۵ ایران ۶۷"
            />
            <p className="mt-1 text-xs text-gray-500">
              اختیاری - در صورت داشتن پلاک وارد کنید
            </p>
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

          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="btn-secondary"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  ثبت خودرو
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVehiclePage;