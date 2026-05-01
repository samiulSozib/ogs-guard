// app/auth/reset-password/page.tsx
'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { resetPassword, clearProfileError, clearProfileSuccess } from '@/store/slices/profileSlice';
import SweetAlertService from '@/lib/sweetAlert';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isResettingPassword } = useAppSelector((state) => state.profile);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (!tokenParam || !emailParam) {
      SweetAlertService.error(
        'Invalid Reset Link',
        'The password reset link is invalid or has expired.',
        {
          confirmButtonColor: '#5F0015',
        }
      ).then(() => {
        router.push('/auth/login');
      });
    } else {
      setToken(tokenParam);
      setValue('email', emailParam);
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    const result = await dispatch(resetPassword({
      email: data.email,
      token: token,
      password: data.password,
      password_confirmation: data.password_confirmation,
    }));

    if (resetPassword.fulfilled.match(result)) {
      SweetAlertService.success(
        'Password Reset Successful',
        'Your password has been reset. Please login with your new password.',
        {
          confirmButtonColor: '#5F0015',
        }
      ).then(() => {
        router.push('/auth/login');
      });
    } else if (resetPassword.rejected.match(result)) {
      SweetAlertService.error(
        'Reset Failed',
        result.payload as string || 'Unable to reset password. Please try again.',
        {
          confirmButtonColor: '#5F0015',
        }
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#5F0015] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/img/login_logo.png"
              width={80}
              height={80}
              alt="Logo"
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Security Management System</h1>
          <p className="text-gray-600 mt-2">Create new password</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email (hidden/disabled) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="bg-gray-50"
                  {...register('email')}
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="Enter new password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="Confirm new password"
                    {...register('password_confirmation')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${password?.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password || '') ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(password || '') ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least one number
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isResettingPassword || !isValid}
                className="w-full bg-[#5F0015] hover:bg-[#5F0015]/90"
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-[#5F0015] hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
