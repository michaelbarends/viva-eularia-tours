import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import UserForm from '../../components/UserForm'

interface Props {
  params: { id: string }
}

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  })

  if (!user) {
    return null
  }

  return user
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params
  const user = await getUser(id)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-500 text-lg">Gebruiker niet gevonden</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <UserForm initialData={user} />
        </div>
      </div>
    </div>
  )
}
