'use client'

import { useState } from 'react'
import { hash } from 'bcryptjs'

interface User {
  id: number
  email: string
  role: string
}

interface UserFormData {
  email: string
  password: string
  role: string
}

interface UserFormProps {
  initialData?: User
}

const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base text-gray-900"

export default function UserForm({ initialData }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'user'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = initialData 
        ? `/api/users/${initialData.id}`
        : '/api/users'

      const method = initialData ? 'PUT' : 'POST'
      const body = initialData
        ? { email: formData.email, role: formData.role }
        : { ...formData, password: await hash(formData.password, 12) }
        
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) throw new Error('Failed to save user')
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        role: 'user'
      })

      // Redirect to users list
      window.location.href = '/users'
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </div>

      {!initialData && (
        <div>
          <label htmlFor="password" className="block text-base font-semibold text-gray-900 mb-2">Wachtwoord</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-base font-semibold text-gray-900 mb-2">Rol</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className={inputClasses}
        >
          <option value="user">Gebruiker</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium mt-8"
      >
        {initialData ? 'Gebruiker Bijwerken' : 'Gebruiker Aanmaken'}
      </button>
    </form>
  )
}
