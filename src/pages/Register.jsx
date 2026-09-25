import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import TextInput from '../components/TextInput'
import { useAuth } from '../context/AuthContext'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const ROLES = ['Front Desk', 'Manager', 'Admin']

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: { role: 'Front Desk' } })

  const password = watch('password')

  const onSubmit = async ({ fullName, email, password, role }) => {
    try {
      registerUser({ fullName, email, password, role })
      toast.success('Account created! Please sign in.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthLayout
      eyebrow="Join the Team"
      title="Create your account"
      subtitle="Set up staff access to the hotel management console."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextInput
          id="fullName"
          label="Full name"
          placeholder="Jane Cooper"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName', {
            required: 'Full name is required.',
            minLength: { value: 3, message: 'Name must be at least 3 characters.' },
          })}
        />

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

        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-ink-700">
            Role
          </label>
          <select
            id="role"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
            {...register('role')}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
            pattern: {
              value: PASSWORD_PATTERN,
              message: 'Min 8 characters, with upper, lower, number & symbol.',
            },
          })}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password.',
            validate: (value) => value === password || 'Passwords do not match.',
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
