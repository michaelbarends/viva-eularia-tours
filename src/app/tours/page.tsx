import TourList from './components/TourList'
import Navbar from '@/components/Navbar'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-end mb-8">
          <a
            href="/tours/create"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base font-medium"
          >
            Nieuwe tour
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <TourList />
        </div>
      </div>
    </div>
  )
}
