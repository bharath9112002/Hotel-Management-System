import { forwardRef } from 'react'

const TextInput = forwardRef(function TextInput(
  { label, error, id, className = '', ...rest },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition placeholder:text-ink-300 focus:ring-2 focus:ring-brand-400/60 ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-ink-200 focus:border-brand-400'
        }`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
})

export default TextInput
