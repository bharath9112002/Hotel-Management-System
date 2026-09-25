import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import GuestFormModal from '../components/guests/GuestFormModal'
import GuestTable from '../components/guests/GuestTable'
import DashboardShell from '../components/layout/DashboardShell'
import Pagination from '../components/Pagination'
import { GUEST_PAGE_SIZE } from '../data/guestConstants'
import { useGuests } from '../context/GuestsContext'

export default function Guests() {
  const { guests, isLoading, error, refetch, addGuest, editGuest, removeGuest } = useGuests()

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [formState, setFormState] = useState(null) // null | { guest: null | Guest }
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const filteredGuests = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return guests
    return guests.filter((guest) =>
      [guest.fullName, guest.email, guest.mobile, guest.nationality].some((field) =>
        field.toLowerCase().includes(term),
      ),
    )
  }, [guests, search])

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / GUEST_PAGE_SIZE))
  // Deleting the last guest on the final page would otherwise leave an empty page.
  const page = Math.min(currentPage, totalPages)
  const pageStart = (page - 1) * GUEST_PAGE_SIZE
  const paginatedGuests = filteredGuests.slice(pageStart, pageStart + GUEST_PAGE_SIZE)

  const closeForm = () => setFormState(null)

  const handleFormSubmit = async (values) => {
    try {
      if (formState.guest) {
        await editGuest(formState.guest.id, values)
        toast.success(`${values.fullName.trim()} updated.`)
      } else {
        await addGuest(values)
        toast.success(`${values.fullName.trim()} added.`)
      }
      closeForm()
    } catch {
      toast.error('Something went wrong saving this guest. Please try again.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await removeGuest(deleteTarget.id)
      toast.success(`${deleteTarget.fullName} deleted.`)
      setDeleteTarget(null)
    } catch {
      toast.error('Could not delete this guest. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell
      title="Guests"
      subtitle={`${filteredGuests.length} of ${guests.length} guests`}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search name, email, mobile…"
              aria-label="Search guests"
              className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
            />
          </div>

          <button
            type="button"
            onClick={() => setFormState({ guest: null })}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Guest
          </button>
        </div>

        {isLoading && (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-ink-100 bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && filteredGuests.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-700">
              {guests.length === 0 ? 'No guests yet' : 'No guests match your search'}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {guests.length === 0 ? 'Add your first guest to get started.' : 'Try a different search term.'}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredGuests.length > 0 && (
          <>
            <GuestTable
              guests={paginatedGuests}
              onEdit={(guest) => setFormState({ guest })}
              onDelete={setDeleteTarget}
            />

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-ink-400">
                Showing {pageStart + 1}–{pageStart + paginatedGuests.length} of{' '}
                {filteredGuests.length}
              </p>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

      {formState && (
        <GuestFormModal guest={formState.guest} onClose={closeForm} onSubmit={handleFormSubmit} />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete guest"
        message={`Delete ${deleteTarget?.fullName}? This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardShell>
  )
}
