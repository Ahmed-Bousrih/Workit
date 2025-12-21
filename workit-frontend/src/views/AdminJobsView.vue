<template>
  <div
    class="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
  >
    <!-- Header -->
    <HeaderBar />

    <div class="flex-grow max-w-6xl mx-auto p-8">
      <h2 class="text-3xl font-extrabold text-center mb-8 animate-fade-slide">
        Gestion des Offres d'emploi
      </h2>

      <transition name="button-fade" appear>
        <div class="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
            @click="showForm = !showForm"
          >
            ➕ Nouvelle offre
          </button>

          <button
            class="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition"
            @click="loadJobs"
          >
            🔄 Recharger les offres
          </button>
        </div>
      </transition>

      <transition name="fade">
        <JobForm v-if="showForm" @jobCreated="onJobCreated" />
      </transition>

      <div class="relative max-w-md mx-auto mb-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher une offre par titre..."
          class="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-800 placeholder-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 dark:border-slate-600"
        />
        <span
          class="absolute left-3 top-2.5 text-slate-400 dark:text-slate-300 pointer-events-none"
        >
          🔍
        </span>
      </div>

      <div
        v-if="filteredJobs.length === 0"
        class="text-slate-500 dark:text-slate-400 text-center mt-8"
      >
        Aucune offre trouvée.
      </div>

      <TransitionGroup
        v-else
        name="card-fade"
        tag="div"
        class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"
      >
        <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow hover:shadow-md transition p-4 flex flex-col justify-between"
        >
          <div class="flex items-center justify-between mb-2">
            <h3
              class="text-lg font-bold text-cyan-800 dark:text-cyan-400 truncate"
            >
              {{ job.title }}
            </h3>
            <span
              v-if="job.applications"
              class="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium px-2 py-1 rounded-full"
            >
              {{ job.applications.length }} candidatures
            </span>
          </div>
          <p
            class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-3"
          >
            {{ job.descriptionGeneral }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <button
              @click="editJob(job)"
              class="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md text-slate-700 dark:text-slate-200"
            >
              ✏️ Modifier
            </button>
            <button
              @click="askDelete(job)"
              class="px-3 py-1 text-sm bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-600 rounded-md text-red-700 dark:text-red-200"
            >
              🗑️ Supprimer
            </button>
            <button
              class="text-sm bg-indigo-100 dark:bg-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded"
              @click="selectedJob = { id: job.id, title: job.title }"
            >
              👀 Voir les candidats
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Modals -->
    <DeleteConfirmModal
      :visible="showDeleteModal"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
    <EditJobModal
      :visible="showEditModal"
      :job="jobToEdit"
      @cancel="closeEditModal"
      @updated="
        () => {
          closeEditModal()
          loadJobs()
        }
      "
    />
    <ApplicantListModal
      v-if="selectedJob"
      :job-id="selectedJob.id"
      :job-title="selectedJob.title"
      :visible="!!selectedJob"
      @close="selectedJob = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '@/services/api'
import JobForm from '@/components/JobForm.vue'
import { useToast } from 'vue-toastification'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import EditJobModal from '@/components/EditJobModal.vue'
import type { Job } from '@/types/job'
import ApplicantListModal from '@/components/ApplicantListModal.vue'
import HeaderBar from '@/components/HeaderBar.vue'

const jobs = ref<Job[]>([])
const showForm = ref(false)
const toast = useToast()

const loadJobs = async () => {
  try {
    const res = await api.get('/jobs')
    jobs.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement des offres', err)
  }
}

const onJobCreated = () => {
  showForm.value = false
  loadJobs()
}

const jobToDelete = ref<Job | null>(null)
const showDeleteModal = ref(false)

const askDelete = (job: Job) => {
  jobToDelete.value = job
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!jobToDelete.value) return

  try {
    await api.delete(`/jobs/${jobToDelete.value.id}`)
    toast.success('Offre supprimée avec succès')
    loadJobs()
  } catch (err) {
    toast.error("Erreur lors de la suppression de l'offre")
    console.error(err)
  } finally {
    showDeleteModal.value = false
    jobToDelete.value = null
  }
}

const jobToEdit = ref<Job | null>(null)
const showEditModal = ref(false)

const editJob = (job: Job) => {
  jobToEdit.value = job
  showEditModal.value = true
}

const closeEditModal = () => {
  jobToEdit.value = null
  showEditModal.value = false
}

const selectedJob = ref<{ id: string; title: string } | null>(null)

const searchQuery = ref('')

const filteredJobs = computed(() => {
  if (!searchQuery.value) return jobs.value
  return jobs.value.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

onMounted(loadJobs)
</script>

<style>
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}

.fade-enter-active,
.fade-leave-active,
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to,
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

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
.button-fade-enter-active {
  transition: all 0.6s ease-out;
}
.button-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.button-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
