'use client'

import { useState } from 'react'
import { Tour, Stop } from '@/types/tour'
import LocationInput from '@/components/LocationInput'

interface TourFormData {
  title: string
  description: string
  price: string
  duration: string
  location: string
  maxPeople: string
  stops: Stop[]
}

interface TourFormProps {
  initialData?: Tour
}

const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base text-gray-900"

export default function TourForm({ initialData }: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    duration: initialData?.duration?.toString() || '',
    location: initialData?.location || '',
    maxPeople: initialData?.maxPeople?.toString() || '',
    stops: initialData?.stops.map(stop => ({
      title: stop.title,
      description: stop.description || '',
      location: stop.location,
      duration: stop.duration.toString()
    })) || []
  })

  const [newStop, setNewStop] = useState<Stop>({
    title: '',
    description: '',
    location: '',
    duration: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = initialData 
        ? `/api/tours/${initialData.id}`
        : '/api/tours'
        
      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error('Failed to create tour')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        maxPeople: '',
        stops: []
      })
      setNewStop({
        title: '',
        description: '',
        location: '',
        duration: ''
      })

      // Trigger refresh of tour list
      window.location.href = '/tours'
    } catch (error) {
      console.error('Error creating tour:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }))
  }

  const handleStopLocationChange = (value: string) => {
    setNewStop(prev => ({
      ...prev,
      location: value
    }))
  }

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault()
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, newStop]
    }))
    setNewStop({
      title: '',
      description: '',
      location: '',
      duration: ''
    })
  }

  const handleRemoveStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }))
  }

  const handleStopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewStop(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="title" className="block text-base font-semibold text-gray-900 mb-2">Titel</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-base font-semibold text-gray-900 mb-2">Beschrijving</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-base font-semibold text-gray-900 mb-2">Prijs</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-base font-semibold text-gray-900 mb-2">Duur (uren)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          min="1"
          className={inputClasses}
        />
      </div>

      <LocationInput
        value={formData.location}
        onChange={handleLocationChange}
        label="Locatie"
        required
        className={inputClasses}
      />

      <div>
        <label htmlFor="maxPeople" className="block text-base font-semibold text-gray-900 mb-2">Maximum aantal mensen</label>
        <input
          type="number"
          id="maxPeople"
          name="maxPeople"
          value={formData.maxPeople}
          onChange={handleChange}
          required
          min="1"
          className={inputClasses}
        />
      </div>

      <div className="border-t pt-8 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Tussenstops</h3>
        
        {formData.stops.length > 0 && (
          <div className="mb-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Huidige Tussenstops:</h4>
            {formData.stops.map((stop, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-base text-gray-600">{stop.title}</p>
                  <p className="text-base text-gray-600">{stop.location} - {stop.duration} minuten</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  className="text-red-600 hover:text-red-800 text-base font-medium"
                >
                  Verwijderen
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <label htmlFor="stopTitle" className="block text-base font-semibold text-gray-900 mb-2">Titel Tussenstop</label>
            <input
              type="text"
              id="stopTitle"
              name="title"
              value={newStop.title}
              onChange={handleStopChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="stopDescription" className="block text-base font-semibold text-gray-900 mb-2">Beschrijving Tussenstop</label>
            <input
              type="text"
              id="stopDescription"
              name="description"
              value={newStop.description || ''}
              onChange={handleStopChange}
              className={inputClasses}
            />
          </div>

          <LocationInput
            value={newStop.location}
            onChange={handleStopLocationChange}
            label="Locatie Tussenstop"
            className={inputClasses}
          />

          <div>
            <label htmlFor="stopDuration" className="block text-base font-semibold text-gray-900 mb-2">Duur (minuten)</label>
            <input
              type="number"
              id="stopDuration"
              name="duration"
              value={newStop.duration}
              onChange={handleStopChange}
              min="1"
              className={inputClasses}
            />
          </div>

          <button
            type="button"
            onClick={handleAddStop}
            className="w-full bg-white text-gray-900 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
          >
            Tussenstop Toevoegen
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium mt-8"
      >
        {initialData ? 'Tour Bijwerken' : 'Tour Aanmaken'}
      </button>
    </form>
  )
}
