import type { Job } from "./job"
import { ApplicationStatus } from "./enums"

export interface Application {
  id: number
  appliedAt: string
  status: ApplicationStatus
  coverletter?: string | null
  isSpontaneous: boolean
  user: {
    id: number
    email: string
    profile?: {
      firstName?: string
      lastName?: string
      photoUrl?: string
    }
  }
  job?: Job | null
}

export interface DashboardApplication extends Application {
  job: Pick<Job, 'id' | 'title'> | null
}
