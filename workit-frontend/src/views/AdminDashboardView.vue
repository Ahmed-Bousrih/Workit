<template>
  <div class="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <!-- 🔷 Header -->
    <HeaderBar />

    <main class="flex-grow max-w-7xl mx-auto p-6 space-y-12">
      <!-- 🔹 Dashboard Title -->
      <h2 class="text-3xl font-extrabold text-center mb-8 animate-fade-slide">
        🧭 Tableau de bord
      </h2>

      <!-- 🔹 Top Admin Actions -->
      <section class="grid gap-6 sm:grid-cols-2">
        <AdminShortcut
          icon="📋"
          label="Gérer les Offres"
          to="/admin/jobs"
          color="bg-cyan-500"
          hoverColor="hover:bg-cyan-600"
        />
        <AdminShortcut
          icon="📥"
          label="Candidatures Spontanées"
          to="/admin/spontaneous"
          color="bg-orange-500"
          hoverColor="hover:bg-orange-600"
        />
      </section>

      <!-- 🔹 KPI + Activity Section -->
      <section>
        <h3 class="text-lg font-semibold mb-4">📊 Statistiques & Activité</h3>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- 📊 KPI Cards (2/3 width) -->
          <div class="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <StatCard
              label="Offres publiées"
              :value="stats.jobs"
              icon="📢"
              color="border-cyan-400"
              textColor="text-cyan-300"
            />
            <StatCard
              label="Candidatures"
              :value="stats.applications"
              icon="📥"
              color="border-orange-400"
              textColor="text-orange-300"
            />
            <StatCard
              label="Candidats"
              :value="stats.candidates"
              icon="👤"
              color="border-green-400"
              textColor="text-green-300"
            />
            <StatCard
              label="Spontanées"
              :value="stats.spontaneous"
              icon="✨"
              color="border-pink-400"
              textColor="text-pink-300"
            />
          </div>

          <!-- 🕒 Recent Activity (1/3 width) -->
          <div class="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-md h-full overflow-y-auto">
            <RecentActivity :items="recentApps" />
          </div>
        </div>
      </section>

      <!-- 🔹 Graphs / Visuals -->
      <section>
        <h3 class="text-lg font-semibold mb-4">📈 Statistiques visuelles</h3>
        <DashboardChart :data="chartData" :key="chartData.length" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/services/api";
import StatCard from "@/components/StatCard.vue";
import AdminShortcut from "@/components/AdminShortcut.vue";
import DashboardChart from "@/components/DashboardChart.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import RecentActivity from "@/components/RecentActivity.vue";
import type { Job, JobChartData } from "@/types/job";

const stats = ref({
  jobs: 0,
  applications: 0,
  candidates: 0,
  spontaneous: 0,
});

const recentApps = ref<
  {
    id: string
    user: {
      email: string
      profile?: {
        firstName: string
        lastName: string
      }
    }
    job: { title: string } | null
  }[]
>([])

const loadStats = async () => {
  try {
    const [jobRes, appRes, spontRes, usersRes, recentRes] = await Promise.all([
      api.get("/jobs/count"),
      api.get("/applications/count"),
      api.get("/applications/count-spontaneous?spontaneous=true"),
      api.get("/users/count?role=candidate"),
      api.get("/applications/recent"),
    ]);

    stats.value.jobs = jobRes.data.total;
    stats.value.applications = appRes.data.total;
    stats.value.spontaneous = spontRes.data.total;
    stats.value.candidates = usersRes.data.total;
    recentApps.value = recentRes.data;
  } catch (err) {
    console.error("Erreur chargement stats", err);
  }
};

const chartData = ref<JobChartData[]>([]);

const loadChartData = async () => {
  try {
    const res = await api.get("/jobs/last-five");
    chartData.value = res.data.map((job: Job) => ({
      title: job.title,
      applications: job.applications?.length || 0,
    }));
  } catch (err) {
    console.error("❌ Error loading chart data", err);
  }
};
onMounted(() => {
  loadStats();
  loadChartData();
});
</script>

<style>
@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-slide {
  animation: fadeSlide 0.6s ease-out both;
}
</style>
