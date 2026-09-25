import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import TextInput from '../components/TextInput'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSent(true)
    toast.success('Password reset link sent (demo only).')
  }

  return (
    <AuthLayout
      eyebrow="Account Recovery"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          ← Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <path
                d="M4 6h16v12H4z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-ink-800">Check your inbox</p>
          <p className="mt-1.5 text-sm text-ink-400">
            We sent a password reset link to{' '}
            <span className="font-semibold text-ink-700">{getValues('email')}</span>. This is a
            UI-only demo, so no email was actually sent.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-6 w-full rounded-xl border border-ink-200 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextInput
            id="email"
            label="Email address"
            type="email"
            placeholder="you@hotel.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
              pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' },
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
