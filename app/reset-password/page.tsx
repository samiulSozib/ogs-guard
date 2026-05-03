// app/auth/reset-password/page.tsx
'use client';

import ResetPasswordForm from '@/components/reset-password/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#5F0015] border-t-transparent" />
      </div>

      <ResetPasswordForm />
    </div>
  );
}
