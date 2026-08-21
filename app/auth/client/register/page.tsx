// app/auth/client/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, User, Building, Phone, MapPin, Globe, Briefcase, Users, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { clientRegister, resetClientRegisterState, clearClientError, clearClientSuccess } from '@/store/slices/client/clientProfileSlice';
import SweetAlertService from '@/lib/sweetAlert';

const clientRegisterSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zip_code: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  business_type: z.string().optional(),
  industry: z.string().optional(),
  contact_person: z.string().optional(),
  contact_person_phone: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ClientRegisterFormData = z.infer<typeof clientRegisterSchema>;

const BUSINESS_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "corporate", label: "Corporate" },
  { value: "industrial", label: "Industrial" },
  { value: "residential", label: "Residential" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other" },
];

const INDUSTRIES = [
  { value: "security", label: "Security" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

export default function ClientRegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isRegistering, isRegistered, error, successMessage } = useAppSelector((state) => state.clientProfile);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ClientRegisterFormData>({
    resolver: zodResolver(clientRegisterSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      company_name: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      zip_code: '',
      website: '',
      business_type: '',
      industry: '',
      contact_person: '',
      contact_person_phone: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');

  useEffect(() => {
    if (successMessage) {
      SweetAlertService.success('Success', successMessage);
      dispatch(clearClientSuccess());
    }
    if (error) {
      SweetAlertService.error('Registration Failed', error);
      dispatch(clearClientError());
    }
  }, [successMessage, error, dispatch]);

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        dispatch(resetClientRegisterState());
        router.push('/auth/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, router, dispatch]);

  const onSubmit = async (data: ClientRegisterFormData) => {
    // Remove empty optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
    );
    // const result = await dispatch(clientRegister(cleanedData));

    // if (clientRegister.fulfilled.match(result)) {
    //   SweetAlertService.success(
    //     'Registration Successful!',
    //     'Your client account has been created. Please login to continue.'
    //   );
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-5xl overflow-hidden shadow-xl rounded-2xl">
        <CardContent className="flex flex-col p-0 md:flex-row">

          {/* LEFT PANEL */}
          <div className="flex flex-1 flex-col items-center justify-center bg-blue-50 dark:bg-blue-950/20 p-8 text-center md:p-10">
            <h2 className="text-lg font-semibold text-neutral-800 md:text-xl">
              Join the
            </h2>
            <h1 className="mt-1 text-xl font-bold tracking-wide md:text-2xl">
              One Guard{" "}
              <span className="font-light text-[#b9a58b]">
                Security
              </span>
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

            <p className="mt-6 text-sm text-gray-500">
              Create a client account to manage your security services
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-2 flex-col bg-blue-600 p-8 text-white md:p-16 overflow-y-auto max-h-[90vh]">
            <h2 className="mb-6 text-left text-xl font-semibold md:text-2xl">
              Client Registration
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
              <FieldGroup>
                {/* Full Name Field */}
                <Field>
                  <FieldLabel className="sr-only">Full Name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Full Name *"
                      className={`pl-10 bg-white text-black placeholder:text-gray-500 ${errors.full_name ? 'border-red-500' : ''}`}
                      {...registerField('full_name')}
                      autoComplete="name"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red-300">{errors.full_name.message}</p>
                  )}
                </Field>

                {/* Email Field */}
                <Field>
                  <FieldLabel className="sr-only">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      className={`pl-10 bg-white text-black placeholder:text-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                      {...registerField('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
                  )}
                </Field>

                {/* Phone Field */}
                <Field>
                  <FieldLabel className="sr-only">Phone</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      className={`pl-10 bg-white text-black placeholder:text-gray-500 ${errors.phone ? 'border-red-500' : ''}`}
                      {...registerField('phone')}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>
                  )}
                </Field>

                {/* Toggle Business Info Button */}
                <button
                  type="button"
                  onClick={() => setShowBusinessInfo(!showBusinessInfo)}
                  className="text-sm text-white/70 hover:text-white underline transition-colors text-left mt-2"
                >
                  {showBusinessInfo ? '− Hide Company Information' : '+ Add Company Information (Optional)'}
                </button>

                {/* Business Information (Optional) */}
                {showBusinessInfo && (
                  <div className="space-y-4 mt-2 pt-2 border-t border-white/20">
                    <h3 className="text-sm font-semibold text-white/90">Company Information</h3>

                    {/* Company Name */}
                    <Field>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          type="text"
                          placeholder="Company Name"
                          className="pl-10 bg-white text-black placeholder:text-gray-500"
                          {...registerField('company_name')}
                        />
                      </div>
                    </Field>

                    {/* Business Type & Industry in grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <select
                          className="w-full h-10 px-3 rounded-md bg-white text-black border-0 focus:ring-2 focus:ring-blue-300"
                          {...registerField('business_type')}
                        >
                          <option value="">Business Type</option>
                          {BUSINESS_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field>
                        <select
                          className="w-full h-10 px-3 rounded-md bg-white text-black border-0 focus:ring-2 focus:ring-blue-300"
                          {...registerField('industry')}
                        >
                          <option value="">Industry</option>
                          {INDUSTRIES.map(industry => (
                            <option key={industry.value} value={industry.value}>{industry.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {/* Website */}
                    <Field>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          type="url"
                          placeholder="Website URL"
                          className="pl-10 bg-white text-black placeholder:text-gray-500"
                          {...registerField('website')}
                        />
                      </div>
                      {errors.website && (
                        <p className="mt-1 text-xs text-red-300">{errors.website.message}</p>
                      )}
                    </Field>

                    {/* Contact Person */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          <Input
                            type="text"
                            placeholder="Contact Person"
                            className="pl-10 bg-white text-black placeholder:text-gray-500"
                            {...registerField('contact_person')}
                          />
                        </div>
                      </Field>
                      <Field>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          <Input
                            type="tel"
                            placeholder="Contact Phone"
                            className="pl-10 bg-white text-black placeholder:text-gray-500"
                            {...registerField('contact_person_phone')}
                          />
                        </div>
                      </Field>
                    </div>

                    {/* Address Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          <Input
                            type="text"
                            placeholder="Country"
                            className="pl-10 bg-white text-black placeholder:text-gray-500"
                            {...registerField('country')}
                          />
                        </div>
                      </Field>
                      <Field>
                        <Input
                          type="text"
                          placeholder="City"
                          className="bg-white text-black placeholder:text-gray-500"
                          {...registerField('city')}
                        />
                      </Field>
                    </div>

                    <Field>
                      <Input
                        type="text"
                        placeholder="Address"
                        className="bg-white text-black placeholder:text-gray-500"
                        {...registerField('address')}
                      />
                    </Field>

                    <Field>
                      <Input
                        type="text"
                        placeholder="Zip Code"
                        className="bg-white text-black placeholder:text-gray-500"
                        {...registerField('zip_code')}
                      />
                    </Field>
                  </div>
                )}

                {/* Password Field */}
                <Field>
                  <FieldLabel className="sr-only">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password *"
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
                    <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
                  )}
                </Field>

                {/* Confirm Password Field */}
                <Field>
                  <FieldLabel className="sr-only">Confirm Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password *"
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
                    <p className="mt-1 text-xs text-red-300">{errors.password_confirmation.message}</p>
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
                    'Register as Client'
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
