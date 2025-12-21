<template>
  <section class="space-y-5">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
      Coordonnées
    </h3>

    <!-- Email -->
    <div class="flex items-center gap-3 text-slate-700 dark:text-slate-200">
      <EnvelopeIcon class="w-5 h-5 text-cyan-600" />
      <span class="truncate">{{ email }}</span>
    </div>

    <!-- Phone -->
    <div class="flex items-center gap-3">
      <PhoneIcon class="w-5 h-5 text-cyan-600" />
      <div class="flex-grow">
        <input
          v-if="isEditing"
          v-model="localPhone"
          placeholder="Téléphone"
          class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          @input="onPhoneInput"
        />
        <span v-else class="text-slate-700 dark:text-slate-200">{{
          phone || '—'
        }}</span>
      </div>
    </div>

    <!-- Country -->
    <div class="flex items-center gap-3">
      <GpsIcon class="w-5 h-5 text-cyan-600" />
      <div class="flex-grow">
        <select
          v-if="isEditing"
          v-model="selectedAddress"
          class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700"
        >
          <option value="" disabled>Choisissez un pays</option>
          <option v-for="(c, i) in allCountries" :key="i" :value="c">
            {{ c }}
          </option>
        </select>
        <span v-else class="text-slate-700 dark:text-slate-200">{{
          address || '—'
        }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import EnvelopeIcon from '@/assets/envelope.svg'
import PhoneIcon from '@/assets/phone.svg'
import GpsIcon from '@/assets/gps.svg'
import countries from '@/assets/countries-fr.json'

const props = defineProps<{
  phone: string
  address: string
  email: string
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:phone', value: string): void
  (e: 'update:address', value: string): void
}>()

// ✅ Local editable values
const localPhone = ref(props.phone)
const selectedAddress = ref(props.address)

// 🔄 Watch and sync
watch(
  () => props.phone,
  (newVal) => {
    localPhone.value = newVal
  },
)

watch(localPhone, (val) => emit('update:phone', val))

watch(
  () => props.address,
  (newVal) => {
    selectedAddress.value = newVal
  },
)

watch(selectedAddress, (val) => emit('update:address', val))

// Optional phone sanitization
const onPhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^\d+]/g, '')
  localPhone.value = input.value
}

const allCountries = computed(() => countries)
</script>
