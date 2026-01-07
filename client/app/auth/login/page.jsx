'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui/UI'; 
import { ToastContainer } from '@/components/ui/Toast';
import useAuthStore from '@/stores/authStore';
import { login } from '@/services/auth.service.js';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const createToast = (message, type = 'info') => ({
  id: crypto?.randomUUID?.() ?? `toast-${Date.now()}`,
  message,
  type
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const authLogin = useAuthStore((s) => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const pushToast = (message, type = "info") => {
    setToasts((prev) => [...prev, createToast(message, type)]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const onSubmit = async (values) => {
    try {
      const res = await login(values.email.trim(), values.password);
      await authLogin({ user: res.user });
      
      pushToast('Welcome back to InkVerse!', 'success');

      setTimeout(() => {
        router.replace(redirect || '/');
      }, 900);
    } catch (error) {
      pushToast(error?.message || 'Invalid credentials', 'error');
    }
  };

  const passwordValue = watch('password');
  const passwordHelper = useMemo(() => {
    return (!passwordValue || passwordValue.length < 8) 
      ? 'Minimum 8 characters' 
      : 'Password looks good';
  }, [passwordValue]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Optional: Very subtle background accents to keep it 'magical' but clean */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative z-10 border border-white"
      >
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-serif font-medium text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">
            Enter your details to access your library.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="reader@inkverse.com"
              error={errors.email?.message}
              // Using light slate bg for inputs to contrast against the white card
              className="bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all"
              required
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                className="bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all"
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-indigo-600 text-xs font-semibold transition-colors uppercase"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                }
                {...register('password')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                {...register('remember')}
              />
              <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">
                Remember me
              </span>
            </label>

            <Link 
              href="/auth/forgot-password" 
              className="text-sm font-medium text-indigo-600 hover:text-teal-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* Footer Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400">Or</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <Link 
                href="/auth/register" 
                className="font-semibold text-indigo-600 hover:text-teal-600 transition-colors"
              >
                Register now
              </Link>
            </p>
          </div>
        </form>
      </motion.div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}