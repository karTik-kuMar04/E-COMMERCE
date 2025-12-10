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
import { registeration } from '@/services/auth.service.js';


const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must include at least one letter')
  .regex(/\d/, 'Password must include at least one number');

const registerSchema = z
  .object({
    name: z.string().min(6, 'Name must be at least 6 characters'),
    displayName: z.string().optional(),
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
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    init();
  }, [init]);

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
        router.replace(pendingRedirect || '/book');
      }, 900);
    } catch (error) {
      const message = error?.message || 'Unable to register, please try again.';
      pushToast(message, 'error');

      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'manual', message });
      }
    }
  };

  const passwordValue = watch('password');
  const confirmValue = watch('confirmPassword');

  const passwordChecklist = useMemo(
    () => [
      { label: 'At least 8 characters', satisfied: passwordValue?.length >= 8 },
      { label: 'Contains a letter', satisfied: /[A-Za-z]/.test(passwordValue || '') },
      { label: 'Contains a number', satisfied: /\d/.test(passwordValue || '') },
      { label: 'Matches confirmation', satisfied: Boolean(passwordValue) && passwordValue === confirmValue },
    ],
    [confirmValue, passwordValue]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12"
    >
      <SectionHeader>Create an Account</SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 space-y-8">
          <div>
            <h1 className="text-display-2 font-serif text-brand-primary mb-2">Join the BookStore club</h1>
            <p className="text-body text-brand-muted">
              Create an account to save favorites, track orders, and enjoy faster checkout.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Full name"
              placeholder="Enter Full Name"
              aria-label="Full name"
              error={errors.name?.message}
              required
              {...register('name')}
            />


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
              placeholder="Create a password"
              aria-label="Create password"
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

            <Input
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat password"
              aria-label="Confirm password"
              error={errors.confirmPassword?.message}
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="text-brand-muted text-sm font-semibold focus:outline-none"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              }
              {...register('confirmPassword')}
            />

            <div className="rounded-2xl bg-brand-bg p-4 space-y-2">
              <p className="text-caption text-brand-muted uppercase tracking-wide">Password requirements</p>
              <ul className="space-y-1 text-sm">
                {passwordChecklist.map((item) => (
                  <li
                    key={item.label}
                    className={`flex items-center gap-2 ${
                      item.satisfied ? 'text-success font-semibold' : 'text-brand-muted'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.satisfied ? 'bg-success' : 'bg-brand-border'
                      }`}
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full flex items-center justify-center gap-3"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting && (
                <span
                  className="inline-block w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
              )}
              Create account
            </Button>
          </form>

          <div className="flex items-center justify-between flex-wrap gap-2 text-body text-brand-muted">
            <span>Already have an account?</span>
            <Link href="/auth/login" className="text-brand-primary font-semibold underline">
              Login
            </Link>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-8 space-y-4 bg-brand-bg">
            <h2 className="text-display-3 font-serif text-brand-primary">Why register?</h2>
            <ul className="space-y-3 text-body text-brand-muted list-disc pl-6">
              <li>Save and sync your favorites across devices.</li>
              <li>Securely store checkout details for faster orders.</li>
              <li>Track order history and delivery status anytime.</li>
            </ul>
          </Card>

          <Card className="p-8 space-y-4">
            <h3 className="text-display-4 font-serif text-brand-primary">Password tips</h3>
            <p className="text-body text-brand-muted">
              Use a mix of letters and numbers. This demo keeps passwords in localStorage only for showcasing the UI—replace
              with a real backend before shipping.
            </p>
          </Card>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.section>
  );
}

