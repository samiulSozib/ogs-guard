// components/auth/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout as guardLogout } from '@/store/slices/authSlice';
import { clientLogout } from '@/store/slices/client/clientProfileSlice';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import SweetAlertService from '@/lib/sweetAlert';

export function LogoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const result = await SweetAlertService.confirm(
      'Logout',
      'Are you sure you want to logout?',
      'Yes, logout',
      'Cancel'
    );

    if (result.isConfirmed) {
      const userType = localStorage.getItem('user_type');

      if (userType === 'client') {
        dispatch(clientLogout());
      } else {
        dispatch(guardLogout());
      }

      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('client_token');
      localStorage.removeItem('client_user');
      localStorage.removeItem('user_type');

      router.push('/auth/login');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}