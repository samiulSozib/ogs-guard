// components/auth/ClientGuardedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ClientGuardedRouteProps {
  children: React.ReactNode;
}

const ClientGuardedRoute: React.FC<ClientGuardedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { token: guardToken, isLoading: isGuardLoading } = useAppSelector((state) => state.auth);
  const { token: clientToken, isLoading: isClientLoading } = useAppSelector((state) => state.clientProfile);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for client authentication
    const checkAuth = () => {
      const storedClientToken = localStorage.getItem('client_token');
      const userType = localStorage.getItem('user_type');
      
      console.log('ClientGuardedRoute - Checking auth:', { 
        clientToken: !!clientToken, 
        storedClientToken: !!storedClientToken,
        userType,
        isClientLoading 
      });
      
      if (!isClientLoading && (!storedClientToken || userType !== 'client')) {
        console.log('No client token found, redirecting to login');
        router.replace('/auth/login');
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [clientToken, isClientLoading, router]);

  // Show loading state
  if (isClientLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if authenticated as client
  const isAuthenticated = !!localStorage.getItem('client_token') && localStorage.getItem('user_type') === 'client';
  
  return isAuthenticated ? <>{children}</> : null;
};

export default ClientGuardedRoute;