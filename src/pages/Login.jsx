import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import TextInput from '../components/TextInput'
import { useAuth } from '../context/AuthContext'
import { getHomeRoute } from '../utils/roleHome'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@hms.com', password: 'Admin@123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' })

  const fillDemoAccount = (account) => {
    setValue('email', account.email, { shouldValidate: true })
    setValue('password', account.password, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    try {
      const user = login(data)
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`)
      const redirectTo = location.state?.from?.pathname ?? getHomeRoute(user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access the front desk dashboard."
      footer={
        <>
          New to Grandview?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium text-ink-400">Quick demo access</p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => fillDemoAccount(account)}
              className="group rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-left transition hover:border-brand-400 hover:bg-brand-100"
            >
              <p className="text-xs font-semibold text-brand-700">{account.label}</p>
              <p className="truncate text-[11px] text-brand-600/80 group-hover:text-brand-700">
                {account.email}
              </p>
            </button>
          ))}
        </div>
      </div>

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

        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required.' })}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
