'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore, { queueAuthRedirect } from '@/stores/authStore';

const buildLoginPath = (nextPath) => {
  if (!nextPath) {
    return '/auth/login';
  }
  const params = new URLSearchParams();
  params.set('next', nextPath);
  return `/auth/login?${params.toString()}`;
};

export default function useAuthGuard({
  requireAdmin = false,
  redirect = true,
  toastMessage = 'Please login to continue',
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const redirectRef = useRef(false);

  const { user, isAuthenticated, hasHydrated, init } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    hasHydrated: state.hasHydrated,
    init: state.init,
  }));

  const [status, setStatus] = useState('checking');

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      setStatus('redirecting');
      if (redirect && !redirectRef.current) {
        redirectRef.current = true;
        if (pathname) {
          queueAuthRedirect(pathname, toastMessage);
        }
        router.replace(buildLoginPath(pathname));
      }
      return;
    }

    if (requireAdmin && !user?.isAdmin) {
      setStatus('denied');
      return;
    }

    setStatus('ready');
  }, [hasHydrated, isAuthenticated, pathname, redirect, router, requireAdmin, toastMessage, user]);

  const summary = useMemo(
    () => ({
      user,
      isAuthenticated,
      hasHydrated,
      status,
      isChecking: !hasHydrated || status === 'checking',
      isReady: status === 'ready',
      isDenied: status === 'denied',
    }),
    [hasHydrated, isAuthenticated, status, user]
  );

  return summary;
}


