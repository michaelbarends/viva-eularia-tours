import UserList from './components/UserList'
import Navbar from '@/components/Navbar'

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">

      <div className="flex justify-end mb-8">
          <a
            href="/users/create"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base font-medium"
          >
            Nieuwe gebruiker
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <UserList />
        </div>
      </div>
    </div>
  )
}
