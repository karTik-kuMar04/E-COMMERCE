'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, SectionHeader } from '@/components/ui/UI';
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

  const authLogin = useAuthStore((s) => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState([]);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });



  const pushToast = (message, type = "info") => {
    setToasts((prev) => [...prev, createToast(message, type)])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };



  const onSubmit = async (values) => {
    try {
      const res = await login(
        values.email.trim(),
        values.password,
      );
      
      await authLogin({ user: res.user })

      pushToast('Welcome back! Redirecting...', 'success');
      
      setTimeout(() => {
        router.replace(searchParams.get('next') || '/');
      }, 900);

    } catch (error) {
      pushToast(error?.message || 'Invalid credentials', 'error');
    }
  };

  const passwordValue = watch('password');
  const passwordHelper = useMemo(() => {
    if (!passwordValue) return 'Password must be at least 8 characters.';
    if (passwordValue.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }, [passwordValue]);



  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      <SectionHeader>Login</SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 space-y-8">
          <div>
            <h1 className="text-display-2 font-serif text-brand-primary mb-2">Welcome back example</h1>
            <p className="text-body text-brand-muted">
              Sign in to manage your account, view orders, and continue checkout.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              aria-label="Account password"
              error={errors.password?.message}
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-brand-muted text-sm font-semibold focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
              {...register('password')}
            />
            <p className="text-caption -mt-4" aria-live="polite">
              {errors.password?.message ? (
                <span className="text-red-500">{errors.password.message}</span>
              ) : (
                <span className="text-brand-muted">{passwordHelper || 'Password looks good!'}</span>
              )}
            </p>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <label className="inline-flex items-center gap-3 text-body text-brand-muted">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                  aria-label="Remember me"
                  {...register('remember')}
                />
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-3"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting && (
                <span
                  className="inline-block w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
              )}
              Sign in
            </Button>
          </form>

          <div className="flex items-center justify-between flex-wrap gap-2 text-body text-brand-muted">
            <span>Need an account?</span>
            <Link href="/auth/register" className="text-brand-primary font-semibold underline">
              Register now
            </Link>
          </div>
        </Card>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.section>
  );
}


