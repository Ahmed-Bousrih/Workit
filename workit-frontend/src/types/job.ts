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
  }
  applications?: { id: number }[]
}
export type JobChartData = {
  title: string;
  applications: number;
};
