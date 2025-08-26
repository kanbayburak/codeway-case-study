<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#0f0f1c] text-white px-4">
    <!-- Logo -->
    <img src="/icon.png" alt="Codeway Logo" class="w-24 h-24 md:w-32 md:h-32 mb-8" />

    <!-- Başlık -->
    <h2 class="text-xl md:text-2xl font-semibold mb-6 text-gray-300">Please sign in</h2>

    <!-- Form kutusu -->
    <form
      @submit.prevent="signIn"
      class="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg space-y-4"
    >
      <input
        type="email"
        v-model="email"
        placeholder="E-mail address"
        required
        class="w-full px-4 py-2 rounded-md border border-purple-500 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
        class="w-full px-4 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        class="w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition"
      >
        Sign in
      </button>
      <p v-if="errorMessage" class="text-red-500 mt-2 text-center">{{ errorMessage }}</p>
    </form>

    <!-- Footer -->
    <footer class="mt-10 text-gray-500 text-sm">Codeway © 2025</footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'   // 🔹 services içine aldık

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const signIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('✅ Giriş başarılı:', userCredential.user)
    router.push('/')
  } catch (err) {
    console.error("❌ Login error:", err)
    errorMessage.value = 'Invalid credentials.'
  }
}
</script>
