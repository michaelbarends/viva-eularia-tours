import UserForm from '../components/UserForm'
import Navbar from '@/components/Navbar'

export default function CreateUserPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <UserForm />
        </div>
      </div>
    </div>
  )
}
