<template>
  <div
    class="min-h-screen relative bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white"
  >
    <!-- Watermark / Initials background -->
    <div
      v-if="profile.firstName || profile.lastName"
      class="absolute top-20 left-10 text-[12rem] font-bold text-slate-200 dark:text-slate-700 opacity-10 select-none pointer-events-none z-0"
    >
      {{ (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '') }}
    </div>

    <GlobalHeader />

    <main
      class="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
    >
      <!-- Header -->
      <ProfileHeader
        :profile="profile"
        :email="user?.email || ''"
        :profilePicture="profilePicture"
        :isEditing="isEditing"
        @upload-photo="handlePhotoUpload"
        @toggle-edit="toggleEdit"
        @update:profile="
          (val) => {
            profile.firstName = val.firstName
            profile.lastName = val.lastName
          }
        "
      />

      <!-- Divider -->
      <hr class="border-slate-300 dark:border-slate-700" />

      <!-- Contact + CV -->
      <div class="flex flex-col lg:flex-row gap-8">
        <div
          class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner"
        >
          <ProfileContact
            :email="user?.email || ''"
            v-model:phone="profile.phone"
            v-model:address="profile.address"
            :isEditing="isEditing"
          />
        </div>

        <div
          class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner"
        >
          <ProfileResume
            :resumeUrl="resumeUrl"
            :resumeName="resumeName"
            :isEditing="isEditing"
            @upload-resume="handleResumeUpload"
            @remove-resume="removeResume"
          />
        </div>
      </div>

      <!-- About Me + Skills -->
      <div class="flex flex-col lg:flex-row gap-8">
        <div
          class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner"
        >
          <ProfileAbout
            v-model:aboutMe="profile.aboutMe"
            :isEditing="isEditing"
          />
        </div>
        <div
          class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner"
        >
          <ProfileSkills
            :isEditing="isEditing"
            :skills="profile.skills"
            @update:skills="profile.skills = $event"
          />
        </div>
      </div>

      <!-- Education -->
      <section
        class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner"
      >
        <ProfileEducation
          :isEditing="isEditing"
          :education="profile.education"
          @update:education="profile.education = $event"
        />
      </section>

      <!-- Experience -->
      <section
        class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner"
      >
        <ProfileExperience
          :isEditing="isEditing"
          :experience="profile.experience"
          @update:experience="profile.experience = $event"
        />
      </section>

      <!-- Save Button -->
      <div v-if="isEditing" class="text-right pt-6">
        <button
          @click="submitProfile"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition duration-200"
        >
          Enregistrer les modifications
        </button>
      </div>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileContact from '@/components/profile/ProfileContact.vue'
import ProfileAbout from '@/components/profile/ProfileAbout.vue'
import ProfileResume from '@/components/profile/ProfileResume.vue'
import ProfileEducation from '@/components/profile/ProfileEducation.vue'
import ProfileExperience from '@/components/profile/ProfileExperience.vue'
import ProfileSkills from '@/components/profile/ProfileSkills.vue'
import { useRouter } from 'vue-router'

import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import type { Education, Skill, User, WorkExperience } from '@/types/user'
import type { AxiosError } from 'axios'

const toast = useToast()
const user = ref<User | null>(null)
const router = useRouter()

const profile = ref<{
  firstName: string
  lastName: string
  phone: string
  address: string
  aboutMe: string
  education: Education[]
  experience: WorkExperience[]
  skills: Skill[]
}>({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  aboutMe: '',
  education: [],
  experience: [],
  skills: [],
})

const resumeName = ref<string | null>(null)
const resumeUrl = ref<string | null>(null)
const profilePicture = ref<string | null>(null)
const isEditing = ref(false)

onMounted(async () => {
  try {
    const res = await api.get('/users/me')
    user.value = res.data

    if (res.data.profile) {
      const p = res.data.profile
      profile.value = {
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        phone: p.phone || '',
        address: p.address || '',
        aboutMe: p.aboutMe || '',
        education: res.data.educations || [],
        experience: (res.data.workExperiences || []).map(
          (exp: WorkExperience) => ({
            ...exp,
            startDate: exp.startDate?.slice(0, 7) || '',
            endDate: exp.endDate ? exp.endDate.slice(0, 7) : null,
            isOngoing: !exp.endDate, // ✅ ← this ensures it's set for reactivity
          }),
        ),
        skills: res.data.skills || [],
      }

      resumeName.value = p.resumeUrl?.split('/').pop() || null
      resumeUrl.value = p.resumeUrl
        ? `http://localhost:3000${p.resumeUrl}`
        : null
      profilePicture.value = p.photoUrl
        ? `http://localhost:3000${p.photoUrl}`
        : null
      // console.log('Loaded skills:', profile.value.skills);
    }
  } catch (err) {
    console.error('❌ Failed to fetch user profile', err)
    toast.error('Erreur de chargement du profil ❌')
  }
})

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const handleResumeUpload = async (file: File) => {
  if (!file) return

  const formData = new FormData()
  formData.append('resume', file)

  try {
    const res = await api.patch('/users/me/resume', formData)
    resumeName.value = file.name
    resumeUrl.value = `http://localhost:3000${res.data.resumeUrl}?t=${Date.now()}`
    toast.success('CV téléchargé avec succès ✅')
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string | string[] }>
    const message = err.response?.data?.message || "Échec de l'envoi du CV ❌"
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

const handlePhotoUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const res = await api.patch('/users/me/photo', formData)
    const photoUrl = res.data.photoUrl
    profilePicture.value = `http://localhost:3000${photoUrl}?t=${Date.now()}`
    toast.success('Photo de profil mise à jour ✅')
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string | string[] }>
    const message =
      err.response?.data?.message || "Échec de l'envoi de la photo ❌"
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

const removeResume = async () => {
  if (!user.value || !resumeUrl.value) return

  const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')
  if (!confirmed) return

  try {
    await api.patch('/users/me/resume/delete')
    resumeUrl.value = null
    resumeName.value = null
    toast.success('CV supprimé avec succès ✅')
  } catch (err) {
    console.error('❌ Resume delete failed:', err)
    toast.error('Erreur lors de la suppression du CV ❌')
  }
}

const submitProfile = async () => {
  if (!user.value) return

  try {
    const payload = {
      ...profile.value,
      experience: profile.value.experience.map((exp) => ({
        ...exp,
        startDate: exp.startDate ? `${exp.startDate}-01` : null,
        endDate: exp.endDate ? `${exp.endDate}-01` : null,
      })),
    }
    await api.put('/users/me', payload)
    // console.log('Saving profile:', JSON.stringify(profile.value, null, 2));
    toast.success('Profil mis à jour avec succès ✅')
    setTimeout(() => {
      router.go(0) // ✅ Refresh current route
    }, 1000)
  } catch (err) {
    console.error('❌ Update failed:', err)
    toast.error('Erreur lors de la mise à jour du profil ❌')
  }

  isEditing.value = false
}
</script>
