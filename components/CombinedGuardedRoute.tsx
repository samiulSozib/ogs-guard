// components/auth/CombinedGuardedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';

interface CombinedGuardedRouteProps {
  children: React.ReactNode;
}

const CombinedGuardedRoute: React.FC<CombinedGuardedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token: guardToken, isLoading: isGuardLoading } = useAppSelector((state) => state.auth);
  const { token: clientToken, isLoading: isClientLoading } = useAppSelector((state) => state.clientProfile);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isClientRoute = pathname?.startsWith('/client');
      const isGuardRoute = !isClientRoute || pathname === '/' || pathname?.startsWith('/profile');
      
      const guardTokenStorage = localStorage.getItem('token');
      const clientTokenStorage = localStorage.getItem('client_token');
      const userType = localStorage.getItem('user_type');
      
      console.log('CombinedGuardedRoute:', { 
        pathname,
        isClientRoute,
        guardToken: !!guardTokenStorage,
        clientToken: !!clientTokenStorage,
        userType
      });
      
      if (isClientRoute) {
        // Client route protection
        if (!clientTokenStorage || userType !== 'client') {
          console.log('Redirecting to login from client route');
          router.replace('/auth/login');
        }
      } else if (isGuardRoute) {
        // Guard route protection
        if (!guardTokenStorage || userType === 'client') {
          console.log('Redirecting to login from guard route');
          router.replace('/auth/login');
        }
      }
      
      setIsChecking(false);
    };

    if (!isGuardLoading && !isClientLoading) {
      checkAuth();
    }
  }, [pathname, router, isGuardLoading, isClientLoading]);

  // Show loading state
  if (isGuardLoading || isClientLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b0016]"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CombinedGuardedRoute;