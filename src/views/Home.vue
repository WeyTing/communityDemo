<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-blue-600">MiniSocial</h1>

      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center">
        <span>登出</span>
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <div class="md:w-1/3">
        <Postform />
      </div>

      <div class="md:w-2/3">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">最新貼文</h2>
        <Postlist />
      </div>
    </div>
  </div>
</template>

<script setup>
import Postform from "../components/Postform.vue";
import Postlist from "../components/Postlist.vue";

import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    router.push({ name: "Login" });
  }
});

const logout = () => {
  auth.signOut();
  router.push({ name: "Login" });
};
</script>
