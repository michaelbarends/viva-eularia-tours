'use client'

import { useEffect, useRef, useState } from 'react'
import { LoadScript, Autocomplete } from '@react-google-maps/api'

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  className?: string
}

const libraries: ("places")[] = ["places"]

export default function LocationInput({ value, onChange, label, required, className }: LocationInputProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onChange(place.formatted_address)
      }
    }
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAKXBGzZz_TXRMPda3Zf_AkfTP9JOix3zw"
      libraries={libraries}
    >
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-2">
          {label}
        </label>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            ref={inputRef}
            className={className}
          />
        </Autocomplete>
      </div>
    </LoadScript>
  )
}
