<template>
  <div class="min-h-screen w-screen bg-[#0f0f1c] text-white p-6">
    <!-- Üst Kısım -->
    <div class="flex justify-between items-center mb-10">
      <img src="/icon.png" alt="Logo" class="w-10 h-10" />
      <button class="text-2xl hover:text-gray-400">
        <i class="fas fa-user-circle"></i>
      </button>
    </div>

    <!-- Slot: sayfa içeriği -->
    <slot />
  </div>
</template>
