'use client'

import { useRef, useState, useEffect } from 'react'

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  className?: string
}

interface Suggestion {
  id: string
  place_name: string
  place_type?: string[]
}

export default function LocationInput({ value, onChange, label, required, className }: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

  // Update inputValue when value prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    try {
      // Debug token
      console.log('Using Mapbox token:', accessToken.substring(0, 10) + '...')
      
      // Create URL
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&autocomplete=true&language=nl&country=nl&types=place,address,poi&limit=5`
      
      console.log('Fetching from URL:', url)
      
      // Add types parameter to get better results
      const response = await fetch(url)
      
      // Log response status
      console.log('Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Log results for debugging
      console.log(`Suggestions for "${query}":`, data.features?.map((f: any) => f.place_name))
      
      setSuggestions(data.features || [])
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      setSuggestions([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Debounce the API call
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    
    const timeout = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
    
    setDebounceTimeout(timeout)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.place_name)
    onChange(suggestion.place_name)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <label className="block text-base font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow for clicks
          setTimeout(() => setShowSuggestions(false), 200)
        }}
        required={required}
        ref={inputRef}
        className={className}
        placeholder="Voer een locatie in"
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
          <ul>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium">{suggestion.place_name}</div>
                {suggestion.place_type && (
                  <div className="text-xs text-gray-500 mt-1">
                    {suggestion.place_type[0].charAt(0).toUpperCase() + suggestion.place_type[0].slice(1)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
