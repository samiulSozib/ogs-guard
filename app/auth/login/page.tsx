// 'use client'

// import { LoginForm } from "@/components/auth/login-form"
// import { useAppSelector } from "@/hooks/useAppSelector";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function LoginPage() {
//   const router = useRouter();
//   const { token } = useAppSelector((state) => state.auth);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (token) {
//       router.push('/');
//     }
//   }, [token, router]);

//   const handleLoginSuccess = () => {
//     console.log('Login successful!');
//     router.push('/');
//   };
//   return (
//     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm md:max-w-4xl">
//         <LoginForm onSuccess={handleLoginSuccess} />
//       </div>
//     </div>
//   )
// }

// app/auth/login/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, Loader2, Shield, Users } from "lucide-react"
import SweetAlertService from "@/lib/sweetAlert"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { login as guardLogin } from "@/store/slices/authSlice"
import { clientLogin, clearClientError } from "@/store/slices/client/clientProfileSlice"

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

type UserType = 'guard' | 'client'

// Storage keys
const STORAGE_KEYS = {
  SAVED_EMAIL: 'saved_email',
  SAVED_PASSWORD: 'saved_password',
  REMEMBER_ME: 'remember_me',
  USER_TYPE: 'user_type'
} as const

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading: isGuardLoading } = useAppSelector((state) => state.auth)
  const { isLoading: isClientLoading } = useAppSelector((state) => state.client)
  const { token: guardToken } = useAppSelector((state) => state.auth)
  const { token: clientToken } = useAppSelector((state) => state.clientProfile)

  const [userType, setUserType] = useState<UserType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType) || 'guard'
    }
    return 'guard'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    }
    return false
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
    reset,
    setValue,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  })

  const isLoading = userType === 'guard' ? isGuardLoading : isClientLoading

  // Redirect if already logged in
  useEffect(() => {
    if (userType === 'guard' && guardToken) {
      router.push('/')
    }
    if (userType === 'client' && clientToken) {
      router.push('/client/dashboard')
    }
  }, [ router])

  // Load saved credentials on mount
  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem(`${STORAGE_KEYS.SAVED_EMAIL}_${userType}`)
      const savedPassword = localStorage.getItem(`${STORAGE_KEYS.SAVED_PASSWORD}_${userType}`)

      if (savedEmail && savedPassword) {
        setValue('email', savedEmail)
        setValue('password', savedPassword)
        trigger(['email', 'password'])
      }
    }
    setFocus('email')
  }, [rememberMe, setValue, setFocus, trigger, userType])

  const saveCredentials = (email: string, password: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem(`${STORAGE_KEYS.SAVED_EMAIL}_${userType}`, email)
      localStorage.setItem(`${STORAGE_KEYS.SAVED_PASSWORD}_${userType}`, password)
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
      localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType)
    } else {
      localStorage.removeItem(`${STORAGE_KEYS.SAVED_EMAIL}_${userType}`)
      localStorage.removeItem(`${STORAGE_KEYS.SAVED_PASSWORD}_${userType}`)
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      let result
      if (userType === 'guard') {
        result = await dispatch(guardLogin(data))
        if (guardLogin.fulfilled.match(result)) {
          saveCredentials(data.email, data.password, rememberMe)
          reset()
          await SweetAlertService.success(
            'Login Successful!',
            `Welcome back, ${result.payload.user.first_name}!`,
            { timer: 1500, showConfirmButton: false }
          )
          setTimeout(() => router.push('/'), 1600)
        } else if (guardLogin.rejected.match(result)) {
          SweetAlertService.error('Login Failed', result.payload as string, {
            confirmButtonColor: '#6b0016',
          })
        }
      } else {
        result = await dispatch(clientLogin(data))
        if (clientLogin.fulfilled.match(result)) {
          saveCredentials(data.email, data.password, rememberMe)
          reset()
          await SweetAlertService.success(
            'Login Successful!',
            `Welcome back, ${result.payload.client.full_name}!`,
            { timer: 1500, showConfirmButton: false }
          )
          setTimeout(() => router.push('/client/dashboard'), 1600)
        } else if (clientLogin.rejected.match(result)) {
          SweetAlertService.error('Login Failed', result.payload as string, {
            confirmButtonColor: '#2563eb',
          })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      SweetAlertService.error('Login Error', 'An unexpected error occurred. Please try again.')
    }
  }

  const hasSavedCredentials = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(`${STORAGE_KEYS.SAVED_EMAIL}_${userType}`)
    }
    return false
  }

  const getThemeColors = () => {
    if (userType === 'guard') {
      return {
        primary: '#6b0016',
        primaryHover: '#5F0015',
        secondary: '#b9a58b',
        secondaryHover: '#a89478',
        gradient: 'from-[#6b0016] to-[#8B0020]',
        panelBg: '#fbf7f2',
      }
    }
    return {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#60a5fa',
      secondaryHover: '#3b82f6',
      gradient: 'from-blue-600 to-blue-800',
      panelBg: '#eff6ff',
    }
  }

  const colors = getThemeColors()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-5xl overflow-hidden shadow-xl rounded-2xl">
        <CardContent className="flex flex-col p-0 md:flex-row">

          {/* LEFT PANEL */}
          <div className={`flex flex-1 flex-col items-center justify-center bg-[${colors.panelBg}] p-8 text-center md:p-10`}>
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setUserType('guard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  userType === 'guard'
                    ? 'bg-[#6b0016] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-4 w-4" />
                Guard
              </button>
              <button
                onClick={() => setUserType('client')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  userType === 'client'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                Client
              </button>
            </div>

            <h2 className="text-lg font-semibold text-neutral-800 md:text-xl">
              Welcome to the
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
              {userType === 'guard' 
                ? 'Login as a Guard to manage your assignments and attendance'
                : 'Login as a Client to manage your sites and contracts'}
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className={`flex flex-2 flex-col p-8 text-white md:p-16`}
            style={{ backgroundColor: colors.primary }}>
            <h2 className="mb-6 text-left text-xl font-semibold md:text-2xl">
              {userType === 'guard' ? 'Guard Login' : 'Client Login'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
              <FieldGroup>
                {/* Email Field */}
                <Field>
                  <FieldLabel className="sr-only">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className={`pl-10 bg-white text-black placeholder:text-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                      {...register('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
                  )}
                </Field>

                {/* Password Field */}
                <Field>
                  <FieldLabel className="sr-only">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`pl-10 pr-10 bg-white text-black placeholder:text-gray-500 ${errors.password ? 'border-red-500' : ''}`}
                      {...register('password')}
                      autoComplete="current-password"
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

                {/* Remember Me Section */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-white data-[state=checked]:bg-[#b9a58b] data-[state=checked]:text-white"
                    />
                    <label htmlFor="remember-me" className="text-sm text-white cursor-pointer select-none">
                      Remember me
                    </label>
                  </div>
                </div>

                {/* Links Section */}
                <div className="flex items-center justify-between mt-2">
                  <Link
                    href={userType === 'guard' ? "/auth/register" : "/auth/client/register"}
                    className="text-xs text-white/70 hover:text-white underline transition-colors"
                  >
                    {userType === 'guard' ? "Don't have an account? Register" : "Don't have a client account? Register"}
                  </Link>

                  <button
                    type="button"
                    className="text-xs text-white/70 hover:text-white underline transition-colors"
                    onClick={() => {
                      router.push(userType === 'guard' ? '/auth/forgot-password' : '/auth/client/forgot-password')
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="mt-6 w-full bg-[#b9a58b] text-black hover:bg-[#a89478] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.secondary, color: '#000' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </FieldGroup>
            </form>

            {hasSavedCredentials() && !rememberMe && (
              <p className="mt-4 text-xs text-white/50 text-center">
                Saved credentials available. Check "Remember me" to auto-fill.
              </p>
            )}
          </div>

        </CardContent>
      </div>
    </div>
  )
}