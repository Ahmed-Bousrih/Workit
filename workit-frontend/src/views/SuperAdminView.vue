<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
  >
    <HeaderBar />

    <main class="max-w-6xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-6">
        Gestion des Utilisateurs
      </h2>

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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import type { User } from '@/types/user'
import HeaderBar from '@/components/HeaderBar.vue'

const users = ref<User[]>([])
const loading = ref(true)
const toast = useToast()
const search = ref('')
const userToDelete = ref<User | null>(null)

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

onMounted(loadUsers)
</script>
