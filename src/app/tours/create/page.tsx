import TourForm from '../components/TourForm'
import Navbar from '@/components/Navbar'

export default function CreateTourPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <TourForm />
        </div>
      </div>
    </div>
  )
}
