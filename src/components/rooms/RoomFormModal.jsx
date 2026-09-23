import { useForm } from 'react-hook-form'
import { AMENITIES_POOL, AVAILABILITY_STATUSES, ROOM_TYPES } from '../../data/roomConstants'
import Modal from '../Modal'
import TextInput from '../TextInput'

export default function RoomFormModal({ room, onClose, onSubmit }) {
  const isEditing = Boolean(room)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      roomNumber: room?.roomNumber ?? '',
      roomType: room?.roomType ?? ROOM_TYPES[0],
      pricePerNight: room?.pricePerNight ?? '',
      capacity: room?.capacity ?? 1,
      floorNumber: room?.floorNumber ?? 1,
      availability: room?.availability ?? AVAILABILITY_STATUSES[0],
      image: room?.image ?? '',
      amenities: room?.amenities ?? [],
    },
  })

  const submit = async (data) => {
    await onSubmit({ ...data, pricePerNight: Number(data.pricePerNight) })
  }

  return (
    <Modal open onClose={onClose} title={isEditing ? 'Edit room' : 'Add new room'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            id="roomNumber"
            label="Room number"
            placeholder="e.g. 204"
            error={errors.roomNumber?.message}
            {...register('roomNumber', { required: 'Room number is required.' })}
          />

          <div>
            <label htmlFor="roomType" className="mb-1.5 block text-sm font-medium text-ink-700">
              Room type
            </label>
            <select
              id="roomType"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
              {...register('roomType', { required: true })}
            >
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            id="pricePerNight"
            label="Price per night (₹)"
            type="number"
            min="0"
            step="50"
            error={errors.pricePerNight?.message}
            {...register('pricePerNight', {
              required: 'Price is required.',
              min: { value: 0, message: 'Price must be positive.' },
            })}
          />

          <TextInput
            id="capacity"
            label="Capacity (guests)"
            type="number"
            min="1"
            max="12"
            error={errors.capacity?.message}
            {...register('capacity', {
              required: 'Capacity is required.',
              min: { value: 1, message: 'At least 1 guest.' },
            })}
          />

          <TextInput
            id="floorNumber"
            label="Floor number"
            type="number"
            min="1"
            error={errors.floorNumber?.message}
            {...register('floorNumber', {
              required: 'Floor number is required.',
              min: { value: 1, message: 'Floor must be at least 1.' },
            })}
          />

          <div>
            <label htmlFor="availability" className="mb-1.5 block text-sm font-medium text-ink-700">
              Availability status
            </label>
            <select
              id="availability"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
              {...register('availability', { required: true })}
            >
              {AVAILABILITY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TextInput
          id="image"
          label="Image URL"
          placeholder="https://…"
          error={errors.image?.message}
          {...register('image', { required: 'Image URL is required.' })}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink-700">Amenities</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITIES_POOL.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 rounded-lg border border-ink-100 px-2.5 py-2 text-xs text-ink-600"
              >
                <input
                  type="checkbox"
                  value={amenity}
                  className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                  {...register('amenities')}
                />
                {amenity}
              </label>
            ))}
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
            {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add room'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
