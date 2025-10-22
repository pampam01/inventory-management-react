export const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  className = '',
  min,
  step
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  )
}

export const TextArea = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  className = '',
  rows = 3
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  )
}
