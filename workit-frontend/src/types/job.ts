export type Job = {
  id: string
  title: string
  descriptionGeneral: string
  missions: string
  profile: string
  advantages?: string
  location?: string
  createdAt?: string
  applications?: { id: string }[]
}
export type JobChartData = {
  title: string;
  applications: number;
};
