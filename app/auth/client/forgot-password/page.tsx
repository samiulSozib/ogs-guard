// // components/client/client-reset-password-form.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { clientResetPassword, clearClientError, clearClientSuccess } from '@/store/slices/client/clientProfileSlice';
// import SweetAlertService from '@/lib/sweetAlert';

// const resetPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   password_confirmation: z.string(),
// }).refine((data) => data.password === data.password_confirmation, {
//   message: "Passwords do not match",
//   path: ["password_confirmation"],
// });

// type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// export default function ClientResetPasswordForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useAppDispatch();
//   const { isResettingPassword, error, successMessage } = useAppSelector((state) => state.clientProfile);

//   const token = searchParams.get('token');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isTokenValid, setIsTokenValid] = useState(true);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     watch,
//     setValue,
//   } = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//       password_confirmation: '',
//     },
//     mode: 'onChange',
//   });

//   const password = watch('password');

//   useEffect(() => {
//     if (!token) {
//       setIsTokenValid(false);
//       SweetAlertService.error(
//         'Invalid Reset Link',
//         'The password reset link is invalid or has expired. Please request a new one.',
//         {
//           confirmButtonColor: '#2563eb',
//         }
//       ).then(() => {
//         router.push('/auth/client/forgot-password');
//       });
//     }
//   }, [token, router]);

//   useEffect(() => {
//     if (successMessage) {
//       SweetAlertService.success('Success', successMessage, {
//         timer: 2000,
//         showConfirmButton: false,
//       });
//       setTimeout(() => {
//         router.push('/auth/login');
//       }, 2000);
//     }
//     if (error) {
//       SweetAlertService.error('Reset Failed', error, {
//         confirmButtonColor: '#2563eb',
//       });
//     }
//   }, [successMessage, error, router]);

//   const onSubmit = async (data: ResetPasswordFormData) => {
//     if (!token) return;

//     const result = await dispatch(clientResetPassword({
//       email: data.email,
//       token: token,
//       password: data.password,
//       password_confirmation: data.password_confirmation,
//     }));
//   };

//   if (!isTokenValid) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
//       <div className="w-full max-w-md">
//         {/* Logo Section */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <Image
//               src="/img/login_logo.png"
//               width={80}
//               height={80}
//               alt="Logo"
//               className="rounded-full"
//             />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Security Management System</h1>
//           <p className="text-gray-600 mt-2">Client Portal - Create New Password</p>
//         </div>

//         <Card className="border-0 shadow-lg">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
//             <CardDescription className="text-center">
//               Enter your email address and create a new password
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               {/* Email Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     className="pl-10"
//                     {...register('email')}
//                     autoFocus
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-sm text-red-500">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* New Password Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="password">New Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter new password"
//                     className="pl-10 pr-10"
//                     {...register('password')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-red-500">{errors.password.message}</p>
//                 )}
//               </div>

//               {/* Confirm Password Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="password_confirmation">Confirm New Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="password_confirmation"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm new password"
//                     className="pl-10 pr-10"
//                     {...register('password_confirmation')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 {errors.password_confirmation && (
//                   <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
//                 )}
//               </div>

//               {/* Password Requirements */}
//               {password && password.length > 0 && (
//                 <div className="bg-gray-50 rounded-lg p-3 space-y-1">
//                   <p className="text-xs font-medium text-gray-700">Password requirements:</p>
//                   <ul className="text-xs text-gray-600 space-y-1">
//                     <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : ''}`}>
//                       <span className="text-xs">•</span>
//                       At least 8 characters
//                     </li>
//                     <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
//                       <span className="text-xs">•</span>
//                       At least one uppercase letter
//                     </li>
//                     <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
//                       <span className="text-xs">•</span>
//                       At least one number
//                     </li>
//                   </ul>
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 disabled={isResettingPassword || !isValid}
//                 className="w-full bg-blue-600 hover:bg-blue-700"
//               >
//                 {isResettingPassword ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Resetting Password...
//                   </>
//                 ) : (
//                   'Reset Password'
//                 )}
//               </Button>

//               <div className="text-center">
//                 <Link
//                   href="/auth/login"
//                   className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
//                 >
//                   <ArrowLeft className="h-3 w-3" />
//                   Back to Login
//                 </Link>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


import React from 'react'

const page = () => {
  return (
    <div>
      
    </div>
  )
}

export default page
