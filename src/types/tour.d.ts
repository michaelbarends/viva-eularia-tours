export interface Stop {
  id?: number
  title: string
  description: string | null
  location: string
  duration: string
  order?: number
  tourId?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Tour {
  id: number
  title: string
  description: string
  price: number
  duration: number
  location: string
  maxPeople: number
  stops: Stop[]
  createdAt?: Date
  updatedAt?: Date
}
