import { useForm } from 'react-hook-form'
import {
  EMAIL_PATTERN,
  MOBILE_PATTERN,
  NAME_PATTERN,
  NATIONALITIES,
} from '../../data/guestConstants'
import { useGuests } from '../../context/GuestsContext'
import Modal from '../Modal'
import TextInput from '../TextInput'

const fieldClass =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition placeholder:text-ink-300 focus:ring-2 focus:ring-brand-400/60'

export default function GuestFormModal({ guest, onClose, onSubmit }) {
  const isEditing = Boolean(guest)
  const { guests } = useGuests()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: guest?.fullName ?? '',
      email: guest?.email ?? '',
      mobile: guest?.mobile ?? '',
      address: guest?.address ?? '',
      nationality: guest?.nationality ?? '',
    },
  })

  const isTakenByAnother = (field, value) =>
    guests.some(
      (other) =>
        other.id !== guest?.id && other[field].trim().toLowerCase() === value.trim().toLowerCase(),
    )

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? 'Edit guest' : 'Add new guest'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            id="fullName"
            label="Full name"
            placeholder="e.g. Priya Sharma"
            autoComplete="off"
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required.',
              validate: {
                length: (v) => v.trim().length >= 3 || 'Name must be at least 3 characters.',
                chars: (v) =>
                  NAME_PATTERN.test(v.trim()) ||
                  'Name can only contain letters, spaces and . \' -',
              },
            })}
          />

          <TextInput
            id="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            autoComplete="off"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
              validate: {
                format: (v) => EMAIL_PATTERN.test(v.trim()) || 'Enter a valid email address.',
                unique: (v) => !isTakenByAnother('email', v) || 'A guest with this email already exists.',
              },
            })}
          />

          <TextInput
            id="mobile"
            label="Mobile number"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="off"
            error={errors.mobile?.message}
            {...register('mobile', {
              required: 'Mobile number is required.',
              validate: {
                chars: (v) =>
                  MOBILE_PATTERN.test(v.trim()) ||
                  'Use digits only (optionally starting with +, spaces, - or brackets).',
                digits: (v) => {
                  const count = v.replace(/\D/g, '').length
                  return (count >= 10 && count <= 15) || 'Mobile number must have 10–15 digits.'
                },
              },
            })}
          />

          <div>
            <label htmlFor="nationality" className="mb-1.5 block text-sm font-medium text-ink-700">
              Nationality
            </label>
            <select
              id="nationality"
              className={`${fieldClass} ${
                errors.nationality
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-ink-200 focus:border-brand-400'
              }`}
              {...register('nationality', { required: 'Nationality is required.' })}
            >
              <option value="">Select nationality</option>
              {NATIONALITIES.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.nationality.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-ink-700">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="Street, city, state, postal code"
              className={`${fieldClass} resize-none ${
                errors.address
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-ink-200 focus:border-brand-400'
              }`}
              {...register('address', {
                required: 'Address is required.',
                validate: (v) => v.trim().length >= 5 || 'Address must be at least 5 characters.',
              })}
            />
            {errors.address && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-ink-50 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add guest'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
