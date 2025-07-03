import type { Job } from "./job"

export interface Application {
  id: string
  appliedAt: string
  status: "pending" | "reviewed" | "rejected"
  coverletter?: string | null;
  isSpontaneous: boolean
  user: {
    id: string
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
  }
}

export interface DashboardApplication extends Application {
  job: Pick<Job, 'id' | 'title'> | null;
}
