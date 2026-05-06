// app/auth/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { register, clearProfileError, clearProfileSuccess, resetRegisterState } from '@/store/slices/profileSlice';
import SweetAlertService from '@/lib/sweetAlert';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isRegistering, isRegistered, error, successMessage } = useAppSelector((state) => state.profile);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');

  useEffect(() => {
    if (successMessage) {
      SweetAlertService.success('Success', successMessage);
      dispatch(clearProfileSuccess());
    }
    if (error) {
      SweetAlertService.error('Registration Failed', error);
      dispatch(clearProfileError());
    }
  }, [successMessage, error, dispatch]);

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        dispatch(resetRegisterState());
        router.push('/auth/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, router, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(register(data));

    if (register.fulfilled.match(result)) {
      SweetAlertService.success(
        'Registration Successful!',
        'Your account has been created. Please login to continue.'
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden shadow-xl">
        <CardContent className="flex flex-col p-0 md:flex-row">

          {/* LEFT PANEL - Same as login */}
          <div className="flex flex-1 flex-col items-center justify-center bg-[#fbf7f2] p-8 text-center md:p-10">
            <h2 className="text-lg font-semibold text-neutral-800 md:text-xl">
              Join the
            </h2>
            <h1 className="mt-1 text-xl font-bold tracking-wide md:text-2xl">
              One Guard{" "}
              <span className="font-light text-[#b9a58b]">
                Security
              </span>{" "}
              
            </h1>

            <div className="mt-8 md:mt-10">
              <Image
                src="/img/og-image.png"
                width={140}
                height={140}
                alt="One Guard Logo"
                priority
              />
            </div>
          </div>

          {/* RIGHT PANEL - Register Form */}
          <div className="flex flex-2 flex-col bg-[#6b0016] p-8 text-white md:p-16">
            <h2 className="mb-6 text-left text-xl font-semibold md:text-2xl">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
              <FieldGroup>
                {/* Full Name Field */}
                <Field>
                  <FieldLabel className="sr-only">
                    Full Name
                  </FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      className={`pl-10 bg-white text-black placeholder:text-gray-500 ${errors.full_name ? 'border-red-500' : ''}`}
                      {...registerField('full_name')}
                      autoComplete="name"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red-300">
                      {errors.full_name.message}
                    </p>
                  )}
                </Field>

                {/* Email Field */}
                <Field>
                  <FieldLabel className="sr-only">
                    Email
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className={`pl-10 bg-white text-black placeholder:text-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                      {...registerField('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-300">
                      {errors.email.message}
                    </p>
                  )}
                </Field>

                {/* Password Field */}
                <Field>
                  <FieldLabel className="sr-only">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`pl-10 pr-10 bg-white text-black placeholder:text-gray-500 ${errors.password ? 'border-red-500' : ''}`}
                      {...registerField('password')}
                      autoComplete="new-password"
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
                    <p className="mt-1 text-xs text-red-300">
                      {errors.password.message}
                    </p>
                  )}
                </Field>

                {/* Confirm Password Field */}
                <Field>
                  <FieldLabel className="sr-only">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`pl-10 pr-10 bg-white text-black placeholder:text-gray-500 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                      {...registerField('password_confirmation')}
                      autoComplete="new-password"
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
                    <p className="mt-1 text-xs text-red-300">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </Field>

                {/* Password Requirements */}
                {password && password.length > 0 && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-white/70">Password requirements:</p>
                    <ul className="space-y-1 text-white/50">
                      <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : ''}`}>
                        <span className="text-xs">•</span>
                        At least 8 characters
                      </li>
                    </ul>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="border-white data-[state=checked]:bg-[#b9a58b] data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-white/70 cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <button type="button" className="text-white hover:underline">
                      Terms and Conditions
                    </button>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isRegistering || !isValid || !acceptTerms}
                  className="mt-6 w-full bg-[#b9a58b] text-black hover:bg-[#a89478] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <Link
                    href="/auth/login"
                    className="text-sm text-white/70 hover:text-white underline transition-colors"
                  >
                    Already have an account? Login
                  </Link>
                </div>
              </FieldGroup>
            </form>
          </div>

        </CardContent>
      </div>
    </div>
  );
}
