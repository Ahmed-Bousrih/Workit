<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
  >
    <GlobalHeader />

    <main
      class="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10"
    >
      <!-- Return Button -->
      <div>
        <RouterLink
          to="/jobs"
          class="inline-block mb-8 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded transition"
        >
          ← Retour aux offres
        </RouterLink>
      </div>

      <div
        v-if="loading"
        class="text-center text-slate-500 dark:text-slate-400 py-10"
      >
        Chargement de l'offre...
      </div>

      <div
        v-else-if="!job"
        class="text-center text-slate-500 dark:text-slate-400 py-10"
      >
        Offre introuvable.
      </div>

      <div v-else class="space-y-10">
        <!-- Job Header -->
        <div class="text-center space-y-4">
          <h2 class="text-4xl font-bold text-cyan-700 dark:text-cyan-400">
            {{ job.title }}
          </h2>

          <div
            class="flex flex-col sm:flex-row justify-center gap-8 text-slate-600 dark:text-slate-400 text-sm"
          >
            <div>
              <span class="font-semibold">📍 Lieu :</span>
              {{ job.location || 'Non précisé' }}
            </div>
            <div>
              <span class="font-semibold">🗓️ Publié le :</span>
              {{ formatDate(job.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Job Sections -->
        <div class="space-y-8 text-lg leading-relaxed">
          <section v-if="job.descriptionGeneral">
            <h3
              class="text-2xl font-bold text-cyan-700 dark:text-cyan-400 mb-2"
            >
              Présentation
            </h3>
            <p class="text-slate-700 dark:text-slate-200">
              {{ job.descriptionGeneral }}
            </p>
          </section>

          <section v-if="job.missions">
            <h3
              class="text-2xl font-bold text-cyan-700 dark:text-cyan-400 mb-2"
            >
              Missions
            </h3>
            <p
              class="text-slate-700 dark:text-slate-200"
              v-html="formatMultiline(job.missions)"
            ></p>
          </section>

          <section v-if="job.profile">
            <h3
              class="text-2xl font-bold text-cyan-700 dark:text-cyan-400 mb-2"
            >
              Profil recherché
            </h3>
            <p
              class="text-slate-700 dark:text-slate-200"
              v-html="formatMultiline(job.profile)"
            ></p>
          </section>

          <section v-if="job.advantages">
            <h3
              class="text-2xl font-bold text-cyan-700 dark:text-cyan-400 mb-2"
            >
              Avantages
            </h3>
            <p
              class="text-slate-700 dark:text-slate-200"
              v-html="formatMultiline(job.advantages)"
            ></p>
          </section>
        </div>

        <!-- Apply Section -->
        <div class="text-center mt-12 space-y-4">
          <div v-if="isLoggedIn">
            <p
              v-if="alreadyApplied"
              class="text-green-600 dark:text-green-400 font-medium"
            >
              ✅ Vous avez déjà postulé à cette offre.
            </p>

            <template v-else>
              <button
                @click="showForm = !showForm"
                class="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg transition text-lg"
              >
                {{ showForm ? 'Annuler' : 'Postuler' }}
              </button>

              <div v-if="showForm" class="mt-6 max-w-xl mx-auto text-left">
                <label for="coverletter" class="block mb-2 font-medium"
                  >Lettre de motivation (facultatif)</label
                >
                <textarea
                  id="coverletter"
                  v-model="coverletter"
                  rows="6"
                  class="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder="Rédigez une lettre de motivation (facultatif)..."
                />
                <button
                  @click="applyToJob"
                  class="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded transition"
                >
                  Envoyer la candidature
                </button>
              </div>
            </template>
          </div>

          <RouterLink
            v-else
            to="/login"
            class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition text-lg"
          >
            Se connecter pour postuler
          </RouterLink>
        </div>
      </div>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import type { Job } from '@/types/job'

const route = useRoute()
const toast = useToast()

const job = ref<Job | null>(null)
const loading = ref(true)
const showForm = ref(false)
const coverletter = ref('')
const alreadyApplied = ref(false)

const isLoggedIn = !!localStorage.getItem('token')

const loadJob = async () => {
  try {
    const res = await api.get(`/jobs/${route.params.id}`)
    job.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement du job', err)
    job.value = null
  } finally {
    loading.value = false
  }
}

const checkAlreadyApplied = async () => {
  try {
    const res = await api.get(`/applications/check?jobId=${route.params.id}`)
    alreadyApplied.value = res.data.applied
  } catch (err) {
    console.error('Erreur lors de la vérification', err)
    alreadyApplied.value = false
  }
}

const applyToJob = async () => {
  try {
    await api.post(`/applications/jobs/${job.value?.id}/apply`, {
      coverletter: coverletter.value || null,
    })
    toast.success('Candidature envoyée avec succès 🎉')
    showForm.value = false
    coverletter.value = ''
    alreadyApplied.value = true
  } catch (err) {
    toast.error('Erreur lors de la candidature ❌')
    console.error(err)
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR')
}

const formatMultiline = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

onMounted(async () => {
  await loadJob()
  if (isLoggedIn) await checkAlreadyApplied()
})
</script>
