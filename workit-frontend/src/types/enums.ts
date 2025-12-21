// Backend enums mirrored in frontend for type safety

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum JobCategory {
  IT = 'it',
  MARKETING = 'marketing',
  SALES = 'sales',
  HR = 'hr',
  FINANCE = 'finance',
  DESIGN = 'design',
  ENGINEERING = 'engineering',
  OTHER = 'other',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HR = 'hr',
  CANDIDATE = 'candidate',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Helper functions for display
export const JobTypeLabels: Record<JobType, string> = {
  [JobType.FULL_TIME]: 'Temps plein',
  [JobType.PART_TIME]: 'Temps partiel',
  [JobType.CONTRACT]: 'Contrat',
  [JobType.INTERNSHIP]: 'Stage',
  [JobType.FREELANCE]: 'Freelance',
}

export const JobCategoryLabels: Record<JobCategory, string> = {
  [JobCategory.IT]: 'Informatique',
  [JobCategory.MARKETING]: 'Marketing',
  [JobCategory.SALES]: 'Ventes',
  [JobCategory.HR]: 'Ressources Humaines',
  [JobCategory.FINANCE]: 'Finance',
  [JobCategory.DESIGN]: 'Design',
  [JobCategory.ENGINEERING]: 'Ingénierie',
  [JobCategory.OTHER]: 'Autre',
}

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'En attente',
  [ApplicationStatus.REVIEWED]: "En cours d'examen",
  [ApplicationStatus.ACCEPTED]: 'Acceptée',
  [ApplicationStatus.REJECTED]: 'Rejetée',
}

export const ApplicationStatusColors: Record<ApplicationStatus, { bg: string; text: string }> = {
  [ApplicationStatus.PENDING]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  [ApplicationStatus.REVIEWED]: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  [ApplicationStatus.ACCEPTED]: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
  },
  [ApplicationStatus.REJECTED]: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
  },
}
