'use client'

import { useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  role: string
  createdAt: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete user')
        window.location.reload()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-background text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 bg-background text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 bg-background text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Aangemaakt op
            </th>
            <th className="px-6 py-3 bg-background text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                Geen gebruikers beschikbaar
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role === 'admin' ? 'Administrator' : 'Gebruiker'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleString('nl-NL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className="flex justify-end gap-4">
                    <a
                      href={`/users/edit/${user.id}`}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Bewerken
                    </a>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Verwijderen
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
