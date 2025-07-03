<template>
  <div class="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <!-- 🔷 Header -->
    <HeaderBar />

    <main class="flex-grow max-w-6xl mx-auto p-8">
      <h2 class="text-3xl font-extrabold text-center mb-8 animate-fade-slide">
        ✨ Candidatures Spontanées
      </h2>

      <div v-if="applications.length === 0" class="text-slate-500 dark:text-slate-400 text-center mt-8">
        Aucune candidature spontanée trouvée.
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="app in applications"
          :key="app.id"
          class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm transition space-y-3"
        >
          <!-- Candidate Info -->
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium">
                👤
                <router-link
                  :to="`/admin/profile/${app.user.id}`"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline transition"
                >
                  {{ app.user.profile?.firstName }} {{ app.user.profile?.lastName }}
                </router-link>
                <span class="text-slate-500 dark:text-slate-400">({{ app.user.email }})</span>
              </p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Soumise le {{ formatDate(app.appliedAt) }}
              </p>
            </div>

            <div class="flex gap-2 mt-1 sm:mt-0">
              <button
                class="text-sm bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-700 dark:text-green-200 px-3 py-1 rounded transition"
                @click="openEmailModal(app.id, 'reviewed')"
              >
                ✅ Étape suivante
              </button>
              <button
                class="text-sm bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-600 text-red-700 dark:text-red-200 px-3 py-1 rounded transition"
                @click="openEmailModal(app.id, 'rejected')"
              >
                ❌ Rejeter
              </button>
            </div>
          </div>

          <!-- Cover Letter Toggle -->
          <div v-if="app.coverletter" class="text-sm text-cyan-600 hover:underline cursor-pointer mt-1" @click="toggleLetter(app.id)">
            {{ expandedLetters[app.id] ? 'Masquer la lettre de motivation' : '+ Lettre de motivation' }}
          </div>

          <!-- Cover Letter Body -->
          <div
            v-if="expandedLetters[app.id]"
            class="bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 p-3 mt-2 rounded border border-slate-200 dark:border-slate-600 whitespace-pre-line"
          >
            {{ app.coverletter }}
          </div>
        </li>
      </ul>
      <!-- Custom Message Modal -->
      <div
      v-if="showEmailModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      >
      <div class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-full max-w-lg p-6 rounded-lg shadow-lg space-y-4">
        <h3 class="text-lg font-bold">
          Message à envoyer au candidat
        </h3>

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
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import HeaderBar from '@/components/HeaderBar.vue';
import type { Application } from '@/types/application';
import { useToast } from 'vue-toastification';

const applications = ref<Application[]>([]);
const toast = useToast();

const loadSpontaneousApplications = async () => {
  try {
    const res = await api.get('/applications/spontaneous');
    // ✅ Only keep pending applications
    applications.value = res.data.filter((app: Application) => app.status === 'pending');
  } catch (err) {
    console.error('Erreur lors du chargement des candidatures spontanées', err);
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR');
};

const expandedLetters = ref<Record<string, boolean>>({})
const toggleLetter = (id: string) => {
  expandedLetters.value[id] = !expandedLetters.value[id]
}

//custom emails handle
const showEmailModal = ref(false)
const selectedAppId = ref<string | null>(null)
const selectedStatus = ref<'rejected' | 'reviewed' | null>(null)
const customMessage = ref('')

// Build a default message based on the action
const buildDefaultMessage = (status: 'rejected' | 'reviewed') => {
  return status === 'rejected'
    ? `Bonjour,

Nous vous remercions pour votre candidature spontanée. Après examen, nous regrettons de vous informer qu'elle n'a pas été retenue.`
    : `Bonjour,

Bonne nouvelle ! Votre candidature spontanée a été retenue pour l'étape suivante. Nous reviendrons vers vous prochainement.`
}

const openEmailModal = (id: string, status: 'rejected' | 'reviewed') => {
  selectedAppId.value = id
  selectedStatus.value = status
  customMessage.value = buildDefaultMessage(status)
  showEmailModal.value = true
}

const confirmStatusUpdate = async () => {
  if (!selectedAppId.value || !selectedStatus.value) return
  try {
    await api.patch(`/applications/${selectedAppId.value}/status`, {
      status: selectedStatus.value,
      customMessage: customMessage.value.trim()
    })

    toast.success(
      selectedStatus.value === 'rejected'
        ? 'Candidat rejeté ❌'
        : 'Le candidat passe à l\'étape suivante ✅'
    )

    applications.value = applications.value.filter(app => app.id !== selectedAppId.value)
  } catch (err) {
    toast.error('Erreur lors de la mise à jour')
    console.error(err)
  } finally {
    showEmailModal.value = false
    selectedAppId.value = null
    selectedStatus.value = null
    customMessage.value = ''
  }
}

onMounted(loadSpontaneousApplications);
</script>

<style scoped>
.animate-fade-slide {
  animation: fadeSlide 0.6s ease-out both;
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
</style>
