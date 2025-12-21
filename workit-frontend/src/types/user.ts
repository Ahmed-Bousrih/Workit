export interface User {
  id: number
  email: string
  role: 'hr' | 'candidate' | 'super_admin'
  createdAt: string
  profile?: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    aboutMe?: string
    resumeUrl?: string
    photoUrl?: string
  }
  education?: Education[]
  experience?: WorkExperience[]
  skills?: Skill[]
}

export interface Education {
  id?: string
  institution: string
  degree: string
  fieldOfStudy: string
  startYear: number
  endYear?: number
  isOngoing?: boolean
}

export interface WorkExperience {
  id?: string
  company: string
  position: string
  startDate: string // ISO string (YYYY-MM-DD)
  endDate?: string | null
  isOngoing?: boolean
  description?: string
}

export interface Skill {
  id?: string
  name: string
}
