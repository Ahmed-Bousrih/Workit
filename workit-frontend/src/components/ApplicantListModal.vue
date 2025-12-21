<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl p-6 shadow-xl text-slate-800 dark:text-slate-100"
    >
      <h2 class="text-xl font-bold text-cyan-800 dark:text-cyan-400 mb-4">
        Candidatures pour "{{ jobTitle }}"
      </h2>

      <div
        v-if="loading"
        class="text-slate-500 dark:text-slate-400 text-center py-6"
      >
        Chargement...
      </div>
      <div
        v-else-if="applicants.length === 0"
        class="text-slate-400 dark:text-slate-500 text-center py-6"
      >
        Aucun candidat pour ce poste.
      </div>

      <div v-else class="space-y-4 max-h-80 overflow-y-auto">
        <div
          v-for="app in visibleApplicants"
          :key="app.id"
          class="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex justify-between items-center bg-white dark:bg-slate-700"
        >
          <div>
            <router-link
              :to="`/admin/profile/${app.user.id}`"
              class="text-cyan-700 dark:text-cyan-300 hover:underline font-medium"
            >
              <span>
                {{ app.user.profile?.firstName }}
                {{ app.user.profile?.lastName }}
                <small class="text-slate-400 dark:text-slate-500"
                  >({{ app.user.email }})</small
                >
              </span>
            </router-link>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {{ formatDate(app.appliedAt) }} —
              <StatusBadge :status="app.status" size="sm" />
            </p>
            <div
              v-if="app.coverletter"
              class="text-sm text-cyan-600 hover:underline cursor-pointer mt-1"
              @click="toggleLetter(app.id)"
            >
              {{
                expandedLetters[app.id]
                  ? 'Masquer la lettre de motivation'
                  : '+ Lettre de motivation'
              }}
            </div>
            <div
              v-if="expandedLetters[app.id]"
              class="bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 p-3 mt-2 rounded border border-slate-200 dark:border-slate-600 whitespace-pre-line"
            >
              {{ app.coverletter }}
            </div>
          </div>

          <div class="flex gap-2">
            <template v-if="app.status === ApplicationStatus.PENDING">
              <button
                class="text-sm bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-200 px-3 py-1 rounded transition"
                @click="openEmailModal(app.id, ApplicationStatus.REVIEWED)"
              >
                👀 Étape suivante
              </button>
              <button
                class="text-sm bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-700 dark:text-green-200 px-3 py-1 rounded transition"
                @click="openEmailModal(app.id, ApplicationStatus.ACCEPTED)"
              >
                ✅ Accepter
              </button>
              <button
                class="text-sm bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-600 text-red-700 dark:text-red-200 px-3 py-1 rounded transition"
                @click="openEmailModal(app.id, ApplicationStatus.REJECTED)"
              >
                ❌ Rejeter
              </button>
            </template>

            <template v-else-if="app.status === ApplicationStatus.REVIEWED">
              <button
                class="text-sm bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-700 dark:text-green-200 px-3 py-1 rounded transition"
                @click="openEmailModal(app.id, ApplicationStatus.ACCEPTED)"
              >
                ✅ Accepter
              </button>
              <span
                class="text-sm text-blue-600 dark:text-blue-300 font-semibold"
              >
                👀 En cours d'examen
              </span>
            </template>

            <span
              v-else-if="app.status === ApplicationStatus.ACCEPTED"
              class="text-sm text-green-600 dark:text-green-300 font-semibold"
            >
              ✅ Candidature acceptée
            </span>
          </div>
        </div>
      </div>

      <div class="text-right mt-6">
        <button
          @click="$emit('close')"
          class="text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white"
        >
          Fermer
        </button>
      </div>
    </div>

    <!-- Custom Email Modal -->
    <div
      v-if="showEmailModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <div
        class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-full max-w-lg p-6 rounded-lg shadow-lg space-y-4"
      >
        <h3 class="text-lg font-bold">Message à envoyer au candidat</h3>

        <textarea
          v-model="customMessage"
          rows="8"
          class="w-full p-3 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 whitespace-pre-line"
        ></textarea>

        <div class="flex justify-end gap-2 pt-2">
          <button
            @click="showEmailModal = false"
            class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:underline"
          >
            Annuler
          </button>
          <button
            @click="confirmStatusUpdate"
            class="px-4 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded"
          >
            Envoyer et mettre à jour
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import StatusBadge from './StatusBadge.vue'
import type { Application } from '@/types/application'
import { ApplicationStatus } from '@/types/enums'

const props = defineProps<{
  jobId: number | string
  jobTitle: string
  visible: boolean
}>()

const applicants = ref<Application[]>([])
const loading = ref(false)
const toast = useToast()

const expandedLetters = ref<Record<number, boolean>>({})
const showEmailModal = ref(false)
const selectedAppId = ref<number | null>(null)
const selectedStatus = ref<ApplicationStatus | null>(null)
const customMessage = ref('')

const toggleLetter = (id: number) => {
  expandedLetters.value[id] = !expandedLetters.value[id]
}

const buildDefaultMessage = (status: ApplicationStatus, jobTitle: string) => {
  if (status === ApplicationStatus.REJECTED) {
    return `Bonjour,

Nous vous remercions pour votre candidature au poste de "${jobTitle}". Après examen, nous regrettons de vous informer qu'elle n'a pas été retenue.`
  } else if (status === ApplicationStatus.ACCEPTED) {
    return `Bonjour,

Félicitations ! Votre candidature au poste de "${jobTitle}" a été acceptée. Nous vous contacterons prochainement pour discuter des prochaines étapes.`
  } else {
    return `Bonjour,

Bonne nouvelle ! Votre candidature au poste de "${jobTitle}" a été retenue pour l'étape suivante. Nous reviendrons vers vous prochainement.`
  }
}

const openEmailModal = (id: number, status: ApplicationStatus) => {
  selectedAppId.value = id
  selectedStatus.value = status
  customMessage.value = buildDefaultMessage(status, props.jobTitle)
  showEmailModal.value = true
}
const confirmStatusUpdate = async () => {
  if (!selectedAppId.value || !selectedStatus.value) return

  try {
    await api.patch(`/applications/${selectedAppId.value}/status`, {
      status: selectedStatus.value,
      customMessage: customMessage.value.trim(),
    })

    const statusMessages: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDING]: 'Statut mis à jour',
      [ApplicationStatus.REJECTED]: 'Candidat rejeté ❌',
      [ApplicationStatus.REVIEWED]: "Le candidat passe à l'étape suivante 👀",
      [ApplicationStatus.ACCEPTED]: 'Candidature acceptée ✅',
    }
    toast.success(statusMessages[selectedStatus.value] || 'Statut mis à jour')

    await loadApplicants()
  } catch {
    toast.error('Erreur lors de la mise à jour')
  } finally {
    showEmailModal.value = false
    selectedAppId.value = null
    selectedStatus.value = null
    customMessage.value = ''
  }
}

const visibleApplicants = computed(() =>
  applicants.value.filter((app) => app.status !== ApplicationStatus.REJECTED),
)

onMounted(() => {
  if (props.visible) {
    loadApplicants()
  }
})

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      await loadApplicants()
    }
  },
)

async function loadApplicants() {
  loading.value = true
  try {
    const res = await api.get(`/applications/job/${props.jobId}`)
    applicants.value = res.data
  } catch {
    toast.error('Impossible de charger les candidatures')
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>
