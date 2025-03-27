'use client'

import { useState } from 'react'
import Modal from './Modal'
import { DynamicIcon } from 'lucide-react/dynamic';

interface BookingModalProps {
  tourTitle: string
}

export default function BookingModal({ tourTitle }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <span className="hidden sm:flex">Contact opnemen</span>
        <DynamicIcon className="block sm:hidden" name="circle-user-round" color="white" size={25} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Boek "${tourTitle}"`}
      >
        <div className="mt-4">
          <p className="text-gray-700 mb-4">
            Neem contact op om deze tour te boeken of voor meer informatie.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contactgegevens</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@viva-eularia.nl?subject=Tour%20boeking" className="text-primary hover:text-primary/80">
                  info@viva-eularia.nl
                </a>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">+31 6 12345678</span>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href="http://vivaeularia.com/" target="_blank" className="text-primary hover:text-primary/80">
                  www.vivaeularia.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
