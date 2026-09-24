import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import GuestAvatar from '../components/guests/GuestAvatar'
import GuestFormModal from '../components/guests/GuestFormModal'
import DashboardShell from '../components/layout/DashboardShell'
import { useGuests } from '../context/GuestsContext'

function ProfileField({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-ink-800">{children}</p>
    </div>
  )
}

export default function GuestProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { guests, isLoading, error, editGuest, removeGuest } = useGuests()

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const guest = guests.find((g) => String(g.id) === id)

  const handleEditSubmit = async (values) => {
    try {
      await editGuest(guest.id, values)
      toast.success(`${values.fullName.trim()} updated.`)
      setIsEditing(false)
    } catch {
      toast.error('Something went wrong saving this guest. Please try again.')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await removeGuest(guest.id)
      toast.success(`${guest.fullName} deleted.`)
      navigate('/guests', { replace: true })
    } catch {
      toast.error('Could not delete this guest. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell title="Guest profile" subtitle="Full details for this guest.">
      <button
        type="button"
        onClick={() => navigate('/guests')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-700"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to guests
      </button>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-ink-100 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && !guest && (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-ink-700">Guest not found</p>
          <p className="mt-1 text-xs text-ink-400">They may have been deleted.</p>
        </div>
      )}

      {guest && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <GuestAvatar name={guest.fullName} size="lg" />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-ink-900">{guest.fullName}</h1>
              <p className="text-sm text-ink-500">{guest.nationality}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 border-t border-ink-50 pt-5 sm:grid-cols-2">
            <ProfileField label="Email">{guest.email}</ProfileField>
            <ProfileField label="Mobile number">{guest.mobile}</ProfileField>
            <ProfileField label="Nationality">{guest.nationality}</ProfileField>
            <div className="sm:col-span-2">
              <ProfileField label="Address">{guest.address}</ProfileField>
            </div>
          </div>

          <div className="mt-6 flex gap-3 border-t border-ink-50 pt-5">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
            >
              Edit guest
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete guest
            </button>
          </div>
        </div>
      )}

      {isEditing && guest && (
        <GuestFormModal guest={guest} onClose={() => setIsEditing(false)} onSubmit={handleEditSubmit} />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete guest"
        message={`Delete ${guest?.fullName}? This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </DashboardShell>
  )
}
