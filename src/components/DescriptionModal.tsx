'use client'

import { useState } from 'react'
import Modal from './Modal'
import { DynamicIcon } from 'lucide-react/dynamic';

interface DescriptionModalProps {
  description: string
}

export default function DescriptionModal({ description }: DescriptionModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <span className="hidden sm:flex">Bekijk uitleg</span>
        <DynamicIcon className="block sm:hidden" name="message-circle-question" color="white" size={25} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Uitleg van de tour"
      >
        <div className="mt-4">
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
        </div>
      </Modal>
    </>
  )
}
