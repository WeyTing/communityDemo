<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">登入 / 註冊</span>
      </h2>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-all duration-200"
              placeholder="請輸入您的電子郵件"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">密碼</label>
          <div class="relative">
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-all duration-200"
              placeholder="請輸入您的密碼"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {{ isLogin ? "登入" : "註冊" }}
        </button>
      </form>

      <p class="text-sm text-center text-gray-600 mt-6">
        {{ isLogin ? "還沒有帳號？" : "已經有帳號？" }}
        <button @click="toggleMode" class="text-blue-600 hover:text-blue-800 font-medium hover:underline ml-1 transition-colors duration-200">
          {{ isLogin ? "註冊帳號" : "去登入" }}
        </button>
      </p>
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
  // 這邊之後會串接 Firebase 登入 / 註冊邏輯
  console.log("Email:", email.value);
  console.log("Password:", password.value);
  console.log(isLogin.value ? "執行登入" : "執行註冊");
  try {
    if (isLogin.value) {
      // 登入
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      console.log("登入成功:", userCredential.user);
      alert("登入成功");

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