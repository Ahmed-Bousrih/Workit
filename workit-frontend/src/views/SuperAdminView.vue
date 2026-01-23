<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
  >
    <HeaderBar />

    <main class="max-w-6xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-6">
        Panneau Super Administrateur
      </h2>

      <!-- Tabs -->
      <div
        class="flex gap-4 mb-6 justify-center border-b border-slate-300 dark:border-slate-700"
      >
        <button
          @click="activeTab = 'users'"
          :class="[
            'px-6 py-2 font-semibold transition',
            activeTab === 'users'
              ? 'border-b-2 border-cyan-600 text-cyan-600'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
          ]"
        >
          👥 Utilisateurs
        </button>
        <button
          @click="activeTab = 'jobs'"
          :class="[
            'px-6 py-2 font-semibold transition',
            activeTab === 'jobs'
              ? 'border-b-2 border-cyan-600 text-cyan-600'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
          ]"
        >
          📋 Toutes les Offres
        </button>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'">
        <!-- Search Bar -->
        <div class="mb-6 max-w-md mx-auto">
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher par nom ou email..."
            class="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div
          v-if="loading"
          class="text-center text-slate-500 dark:text-slate-400 py-10"
        >
          Chargement des utilisateurs...
        </div>

        <table v-else class="w-full table-auto border-collapse">
          <thead>
            <tr
              class="bg-slate-100 dark:bg-slate-800 text-left text-sm uppercase text-slate-600 dark:text-slate-400"
            >
              <th class="p-3">Nom</th>
              <th class="p-3">Email</th>
              <th class="p-3">Rôle</th>
              <th class="p-3">Créé le</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-slate-200 dark:border-slate-700"
            >
              <td class="p-3">
                {{ user.profile?.firstName }} {{ user.profile?.lastName }}
              </td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3 capitalize">{{ user.role.replace('_', ' ') }}</td>
              <td class="p-3">{{ formatDate(user.createdAt) }}</td>
              <td class="p-3 text-right space-x-2">
                <button
                  v-if="user.role !== 'super_admin'"
                  @click="changeRole(user)"
                  class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {{ user.role === 'hr' ? 'Révoquer' : 'Promouvoir' }} HR
                </button>
                <button
                  v-if="user.role !== 'super_admin'"
                  @click="confirmDelete(user)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Delete Confirmation Modal -->
        <div
          v-if="userToDelete"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl max-w-md w-full"
          >
            <h3 class="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p class="mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur
              <strong>{{ userToDelete.email }}</strong> ? Cette action est
              irréversible.
            </p>
            <div class="flex justify-end gap-3">
              <button
                @click="userToDelete = null"
                class="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded"
              >
                Annuler
              </button>
              <button
                @click="deleteUserConfirmed"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Jobs Tab -->
      <div v-if="activeTab === 'jobs'">
        <div class="mb-6 flex gap-4 items-center justify-center flex-wrap">
          <div class="max-w-md flex-1">
            <input
              v-model="jobSearch"
              type="text"
              placeholder="Rechercher une offre par titre..."
              class="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="showDeletedJobs"
              @change="loadJobs"
              class="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
            />
            <span class="text-sm text-slate-600 dark:text-slate-400">
              Afficher les offres supprimées
            </span>
          </label>
        </div>

        <div
          v-if="jobsLoading"
          class="text-center text-slate-500 dark:text-slate-400 py-10"
        >
          Chargement des offres...
        </div>

        <div
          v-else-if="filteredJobs.length === 0"
          class="text-center text-slate-500 dark:text-slate-400 py-10"
        >
          Aucune offre trouvée.
        </div>

        <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="job in filteredJobs"
            :key="job.id"
            :class="[
              'border rounded-2xl shadow hover:shadow-md transition p-4 flex flex-col justify-between',
              job.isDeleted
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-75'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
            ]"
          >
            <div class="mb-2">
              <h3
                class="text-lg font-bold text-cyan-800 dark:text-cyan-400 truncate mb-2"
              >
                {{ job.title }}
              </h3>
              <p
                class="text-xs text-slate-500 dark:text-slate-400 mb-2"
                v-if="job.postedBy"
              >
                📌 Posté par:
                {{
                  job.postedBy.profile?.firstName &&
                  job.postedBy.profile?.lastName
                    ? `${job.postedBy.profile.firstName} ${job.postedBy.profile.lastName}`
                    : job.postedBy.email
                }}
              </p>
              <span
                v-if="job.isDeleted"
                class="inline-block bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 text-xs font-medium px-2 py-1 rounded-full mb-2"
              >
                🗑️ Supprimée
              </span>
              <p
                class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-3"
              >
                {{ job.descriptionGeneral }}
              </p>
            </div>

            <div class="mt-4 flex justify-end gap-2 flex-wrap">
              <button
                v-if="!job.isDeleted"
                @click="editJob(job)"
                class="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md text-slate-700 dark:text-slate-200"
              >
                ✏️ Modifier
              </button>
              <button
                v-if="job.isDeleted"
                @click="restoreJob(job)"
                class="px-3 py-1 text-sm bg-emerald-100 dark:bg-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-600 rounded-md text-emerald-700 dark:text-emerald-200"
              >
                ♻️ Restaurer
              </button>
              <button
                v-if="!job.isDeleted"
                @click="askDeleteJob(job, 'soft')"
                class="px-3 py-1 text-sm bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-600 rounded-md text-red-700 dark:text-red-200"
              >
                🗑️ Supprimer
              </button>
              <button
                @click="askDeleteJob(job, 'hard')"
                class="px-3 py-1 text-sm bg-red-600 dark:bg-red-800 hover:bg-red-700 dark:hover:bg-red-900 text-white rounded-md"
              >
                ⚠️ Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Job Delete Confirmation Modal -->
    <div
      v-if="jobToDelete"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl max-w-md w-full"
      >
        <h3 class="text-lg font-semibold mb-4">
          {{
            deleteType === 'hard'
              ? '⚠️ Suppression définitive'
              : 'Confirmer la suppression'
          }}
        </h3>
        <p class="mb-6">
          <template v-if="deleteType === 'hard'">
            ⚠️ <strong>ATTENTION:</strong> Vous êtes sur le point de supprimer
            définitivement l'offre <strong>{{ jobToDelete.title }}</strong
            >. Cette action est <strong>irréversible</strong> et supprimera
            également toutes les candidatures associées.
          </template>
          <template v-else>
            Êtes-vous sûr de vouloir supprimer l'offre
            <strong>{{ jobToDelete.title }}</strong> ? Cette suppression peut
            être annulée plus tard.
          </template>
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="
              jobToDelete = null
              deleteType = 'soft'
            "
            class="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded"
          >
            Annuler
          </button>
          <button
            @click="deleteJobConfirmed"
            :class="[
              'px-4 py-2 text-white rounded',
              deleteType === 'hard'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-600 hover:bg-orange-700',
            ]"
          >
            {{
              deleteType === 'hard' ? 'Supprimer définitivement' : 'Supprimer'
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import type { User } from '@/types/user'
import type { Job } from '@/types/job'
import HeaderBar from '@/components/HeaderBar.vue'

const users = ref<User[]>([])
const loading = ref(true)
const toast = useToast()
const search = ref('')
const userToDelete = ref<User | null>(null)

const activeTab = ref<'users' | 'jobs'>('users')
const jobs = ref<Job[]>([])
const jobsLoading = ref(false)
const jobSearch = ref('')
const jobToDelete = ref<Job | null>(null)
const deleteType = ref<'soft' | 'hard'>('soft')
const showDeletedJobs = ref(false)

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch (err) {
    console.log(err)
    toast.error('Erreur lors du chargement des utilisateurs ❌')
  } finally {
    loading.value = false
  }
}

const changeRole = async (user: User) => {
  const newRole = user.role === 'hr' ? 'candidate' : 'hr'
  try {
    await api.patch(`/users/${user.id}/role`, { role: newRole })
    toast.success(`Rôle mis à jour: ${newRole}`)
    await loadUsers()
  } catch {
    toast.error('Erreur lors de la mise à jour du rôle ❌')
  }
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
}

const deleteUserConfirmed = async () => {
  if (!userToDelete.value) return
  try {
    await api.delete(`/users/${userToDelete.value.id}`)
    toast.success('Utilisateur supprimé ✅')
    userToDelete.value = null
    await loadUsers()
  } catch {
    toast.error('Erreur lors de la suppression ❌')
  }
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('fr-FR')
}

const filteredUsers = computed(() => {
  if (!search.value.trim()) return users.value
  const term = search.value.toLowerCase()
  return users.value.filter(
    (u) =>
      u.email.toLowerCase().includes(term) ||
      `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`
        .toLowerCase()
        .includes(term),
  )
})

const filteredJobs = computed(() => {
  if (!jobSearch.value.trim()) return jobs.value
  const term = jobSearch.value.toLowerCase()
  return jobs.value.filter((job) => job.title.toLowerCase().includes(term))
})

const loadJobs = async () => {
  jobsLoading.value = true
  try {
    const url = showDeletedJobs.value
      ? '/jobs/all?includeDeleted=true'
      : '/jobs/all'
    const res = await api.get(url)
    jobs.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement des offres', err)
    toast.error('Erreur lors du chargement des offres ❌')
  } finally {
    jobsLoading.value = false
  }
}

const askDeleteJob = (job: Job, type: 'soft' | 'hard' = 'soft') => {
  jobToDelete.value = job
  deleteType.value = type
}

const deleteJobConfirmed = async () => {
  if (!jobToDelete.value) return
  try {
    if (deleteType.value === 'hard') {
      await api.delete(`/jobs/${jobToDelete.value.id}/hard`)
      toast.success('Offre supprimée définitivement ✅')
    } else {
      await api.delete(`/jobs/${jobToDelete.value.id}`)
      toast.success('Offre supprimée (peut être restaurée) ✅')
    }
    jobToDelete.value = null
    deleteType.value = 'soft'
    await loadJobs()
  } catch {
    toast.error('Erreur lors de la suppression ❌')
  }
}

const restoreJob = async (job: Job) => {
  try {
    await api.patch(`/jobs/${job.id}/restore`)
    toast.success('Offre restaurée ✅')
    await loadJobs()
  } catch {
    toast.error('Erreur lors de la restauration ❌')
  }
}

const editJob = (job: Job) => {
  // Navigate to edit job page or open modal
  toast.info('Fonctionnalité de modification à venir')
}

// Watch for tab changes to load jobs
watch(
  () => activeTab.value,
  (newTab) => {
    if (newTab === 'jobs' && jobs.value.length === 0) {
      loadJobs()
    }
  },
)

onMounted(() => {
  loadUsers()
})
</script>
