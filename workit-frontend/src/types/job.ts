import { JobType, JobCategory } from './enums'

export type Job = {
  id: number
  title: string
  descriptionGeneral?: string
  missions?: string
  profile?: string
  advantages?: string
  location?: string
  category?: JobCategory
  jobType?: JobType
  createdAt?: string
  updatedAt?: string
  postedBy?: {
    id: number
    email: string
    profile?: {
      firstName?: string
      lastName?: string
    }
  }
  applications?: { id: number }[]
  isDeleted?: boolean
  deletedAt?: string | null
}
export type JobChartData = {
  title: string
  applications: number
}
