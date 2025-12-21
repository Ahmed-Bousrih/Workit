<template>
  <div
    class="min-h-screen relative bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white"
  >
    <div
      v-if="profile.firstName || profile.lastName"
      class="absolute top-20 left-10 text-[12rem] font-bold text-slate-200 dark:text-slate-700 opacity-10 select-none pointer-events-none z-0"
    >
      {{ (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '') }}
    </div>

    <HeaderBar />

    <main
      class="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
    >
      <!-- Header -->
      <AdminProfileHeader
        :profile="profile"
        :email="user?.email || ''"
        :profilePicture="profilePicture"
      />

      <!-- Divider -->
      <hr class="border-slate-300 dark:border-slate-700" />

      <!-- Contact + CV -->
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner">
          <AdminProfileContact
            :email="user?.email || ''"
            :phone="profile.phone"
            :address="profile.address"
          />
        </div>

        <div class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner">
          <AdminProfileResume :resumeUrl="resumeUrl" />
        </div>
      </div>

      <!-- About Me + Skills -->
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner">
          <AdminProfileAbout :aboutMe="profile.aboutMe" />
        </div>
        <div class="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner">
          <AdminProfileSkills :skills="profile.skills" />
        </div>
      </div>

      <!-- Education -->
      <section class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner">
        <AdminProfileEducation :education="profile.education" />
      </section>

      <!-- Experience -->
      <section class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 shadow-inner">
        <AdminProfileExperience :experience="profile.experience" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminProfileHeader from '@/components/admin/AdminProfileHeader.vue'
import AdminProfileContact from '@/components/admin/AdminProfileContact.vue'
import AdminProfileAbout from '@/components/admin/AdminProfileAbout.vue'
import AdminProfileResume from '@/components/admin/AdminProfileResume.vue'
import AdminProfileEducation from '@/components/admin/AdminProfileEducation.vue'
import AdminProfileExperience from '@/components/admin/AdminProfileExperience.vue'
import AdminProfileSkills from '@/components/admin/AdminProfileSkills.vue'
import { api } from '@/services/api'
import type { Education, Skill, User, WorkExperience } from '@/types/user'
import HeaderBar from '@/components/HeaderBar.vue'

const user = ref<User | null>(null)
const profile = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  aboutMe: '',
  education: [] as Education[],
  experience: [] as WorkExperience[],
  skills: [] as Skill[],
})
const resumeUrl = ref<string | null>(null)
const profilePicture = ref<string | null>(null)

onMounted(async () => {
  const userId = location.pathname.split('/').pop()
  if (!userId) return

  try {
    const res = await api.get(`/users/${userId}`)
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
        experience: (res.data.workExperiences || []).map((exp: WorkExperience) => ({
          ...exp,
          startDate: exp.startDate?.slice(0, 7) || '',
          endDate: exp.endDate ? exp.endDate.slice(0, 7) : null,
          isOngoing: !exp.endDate,
        })),
        skills: res.data.skills || [],
      }

      resumeUrl.value = p.resumeUrl ? `http://localhost:3000${p.resumeUrl}` : null
      profilePicture.value = p.photoUrl ? `http://localhost:3000${p.photoUrl}` : null
    }
  } catch (err) {
    console.error('Erreur chargement admin profile', err)
  }
})
</script>
