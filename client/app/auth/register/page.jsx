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
import { registeration } from '@/services/auth.service.js';

// --- Schema (Unchanged) ---
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must include at least one letter')
  .regex(/\d/, 'Password must include at least one number');

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const createToast = (message, type = 'info') => ({
  id: crypto?.randomUUID?.() ?? `toast-${Date.now()}`,
  message,
  type,
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingRedirect = searchParams.get('redirect');

  const authRegister = useAuthStore((s) => s.register);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toasts, setToasts] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const pushToast = (message, type = 'info') =>
    setToasts((prev) => [...prev, createToast(message, type)]);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const onSubmit = async (values) => {
    try {
      const res = await registeration(values.name, values.email, values.password);
      await authRegister({ user: res.user });

      pushToast('Account created! Redirecting...', 'success');

      setTimeout(() => {
        router.replace(pendingRedirect || '/auth/login');
      }, 900);
    } catch (error) {
      const message = error?.message || 'Unable to register, please try again.';
      pushToast(message, 'error');

      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'manual', message });
      }
    }
  };

  // --- Password Strength Logic ---
  const passwordValue = watch('password');
  const confirmValue = watch('confirmPassword');

  const passwordChecklist = useMemo(
    () => [
      { label: '8+ chars', satisfied: passwordValue?.length >= 8 },
      { label: 'Letter', satisfied: /[A-Za-z]/.test(passwordValue || '') },
      { label: 'Number', satisfied: /\d/.test(passwordValue || '') },
      { label: 'Match', satisfied: Boolean(passwordValue) && passwordValue === confirmValue },
    ],
    [confirmValue, passwordValue]
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      
      {/* Background Ambience (Matching Login Page) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        // Card is slightly wider (max-w-[500px]) to accommodate the extra fields comfortably
        className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative z-10 border border-white"
      >
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-serif font-medium text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join InkVerse to track orders and save favorites.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          
          <Input
            label="Full Name"
            placeholder="Enter Name here...."
            error={errors.name?.message}
            className="bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all"
            required
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="reader@inkverse.com"
            error={errors.email?.message}
            className="bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all"
            required
            {...register('email')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-indigo-600 text-xs font-semibold uppercase"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                }
                {...register('password')}
              />
            </div>

            <div className="relative">
              <Input
                label="Confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                className="bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all"
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="text-slate-400 hover:text-indigo-600 text-xs font-semibold uppercase"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                }
                {...register('confirmPassword')}
              />
            </div>
          </div>

          {/* Integrated Password Checklist */}
          {/* Only show if user has started typing to keep UI clean */}
          {(passwordValue || confirmValue) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
              {passwordChecklist.map((item) => (
                <div 
                  key={item.label} 
                  className={`text-[10px] sm:text-xs font-medium flex items-center gap-1.5 transition-colors duration-300 ${
                    item.satisfied ? 'text-teal-600' : 'text-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.satisfied ? 'bg-teal-500' : 'bg-slate-200'
                  }`} />
                  {item.label}
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 mt-2 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
               <span className="flex items-center justify-center gap-2">
                 <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                 Creating...
               </span>
            ) : (
              'Create Account'
            )}
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
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="font-semibold text-indigo-600 hover:text-teal-600 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}