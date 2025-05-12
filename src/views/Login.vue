<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-block p-2 bg-gray-800 rounded-xl">
          <h1 class="text-3xl font-bold">
            <span class="text-white">Mini</span>
            <span class="text-[#47cf73]">Social</span>
          </h1>
        </div>
      </div>

      <!-- Login Form -->
      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <!-- Tabs -->
        <div class="flex text-center">
          <button 
            @click="isLogin = true" 
            class="w-1/2 py-4 text-sm font-medium transition-colors duration-200"
            :class="isLogin ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'"
          >
            登入
          </button>
          <button 
            @click="isLogin = false" 
            class="w-1/2 py-4 text-sm font-medium transition-colors duration-200"
            :class="!isLogin ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'"
          >
            註冊
          </button>
        </div>

        <!-- Form -->
        <div class="p-8">
          <h2 class="text-xl font-bold text-white mb-6">
            {{ isLogin ? "歡迎回來" : "創建新帳號" }}
          </h2>

          <form @submit.prevent="onSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div class="relative">
                <input
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#47cf73] focus:border-[#47cf73] text-white transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">密碼</label>
              <div class="relative">
                <input
                  v-model="password"
                  type="password"
                  required
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#47cf73] focus:border-[#47cf73] text-white transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-[#47cf73] text-gray-900 py-3 rounded-lg hover:bg-[#3db863] transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {{ isLogin ? "登入" : "註冊" }}
            </button>
          </form>

          <!-- Social Login Options -->
          <div class="mt-8 pt-6 border-t border-gray-700">
            <p class="text-sm text-center text-gray-400 mb-4">或使用其他方式</p>
            <div class="flex justify-center space-x-4">
              <button class="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button class="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.736-.9 10.125-5.864 10.125-11.854z"/>
                </svg>
              </button>
              <button class="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-4 bg-gray-900 text-center">
          <p class="text-xs text-gray-500">
            使用本服務即表示您同意我們的
            <a href="#" class="text-[#47cf73] hover:underline">服務條款</a>
            和
            <a href="#" class="text-[#47cf73] hover:underline">隱私政策</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const email = ref("");
const password = ref("");
const isLogin = ref(true);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const onSubmit = async () => {
  try {
    if (isLogin.value) {
      // 登入
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      console.log("登入成功:", userCredential.user);
      router.push({ name: "Home" });
    } else {
      // 註冊
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      console.log("註冊成功:", userCredential.user);
      alert("註冊成功，現在可以登入了");
      isLogin.value = true; // 自動切回登入模式
    }
  } catch (err) {
    console.error("登入/註冊錯誤:", err.code);
    alert(`錯誤：${err.code.replace("auth/", "")}`);
  }
};
</script>