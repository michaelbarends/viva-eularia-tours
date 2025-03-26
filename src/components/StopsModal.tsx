'use client'

import { useState } from 'react'
import Modal from './Modal'

interface Stop {
  id: number
  title: string
  description: string | null
  location: string
  startTime: string
  endTime: string
  order: number
}

interface StopsModalProps {
  stops: Stop[]
}

export default function StopsModal({ stops }: StopsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Bekijk programma
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Programma"
      >
        <div className="mt-4 space-y-8">
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative">
              {index < stops.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200"></div>
              )}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{stop.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {stop.location} • {stop.startTime} tot {stop.endTime}
                  </p>
                  {stop.description && (
                    <p className="mt-2 text-gray-700">{stop.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
