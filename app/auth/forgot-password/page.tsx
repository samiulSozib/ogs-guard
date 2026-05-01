// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { forgotPassword, clearProfileError, clearProfileSuccess } from '@/store/slices/profileSlice';
import SweetAlertService from '@/lib/sweetAlert';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSendingResetLink, error, successMessage } = useAppSelector((state) => state.profile);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await dispatch(forgotPassword(data));

    if (forgotPassword.fulfilled.match(result)) {
      setSubmitted(true);
      SweetAlertService.success(
        'Reset Link Sent',
        'Please check your email for password reset instructions.',
        {
          confirmButtonColor: '#5F0015',
        }
      );
    } else if (forgotPassword.rejected.match(result)) {
      SweetAlertService.error(
        'Failed to Send',
        result.payload as string || 'Unable to send reset link. Please try again.',
        {
          confirmButtonColor: '#5F0015',
        }
      );
    }
  };

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
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we will send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...register('email')}
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSendingResetLink || !isValid}
                  className="w-full bg-[#5F0015] hover:bg-[#5F0015]/90"
                >
                  {isSendingResetLink ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
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
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    We have sent a password reset link to your email address.
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="bg-[#5F0015] hover:bg-[#5F0015]/90"
                >
                  Return to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
