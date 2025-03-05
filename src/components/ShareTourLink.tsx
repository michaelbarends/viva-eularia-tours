'use client'

import { useState } from 'react'

interface ShareTourLinkProps {
  tourId: number
}

export default function ShareTourLink({ tourId }: ShareTourLinkProps) {
  const [copied, setCopied] = useState(false)
  const tourUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tour/${tourId}`
    : `/tour/${tourId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tourUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Deel deze tour met deelnemers
      </label>
      <div className="flex">
        <input
          type="text"
          readOnly
          value={tourUrl}
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {copied ? 'Gekopieerd!' : 'Kopiëren'}
        </button>
      </div>
      <div className="flex space-x-2 mt-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Bekijk deze tour: ${tourUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          WhatsApp
        </a>
        <a
          href={`mailto:?subject=Tour informatie&body=${encodeURIComponent(`Bekijk deze tour: ${tourUrl}`)}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Email
        </a>
      </div>
    </div>
  )
}
