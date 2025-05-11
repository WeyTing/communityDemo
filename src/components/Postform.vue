<template>
  <div class="bg-white p-6 rounded-xl shadow-md w-full sticky top-4">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">發表貼文</h2>

    <form @submit.prevent="submitPost">
      <textarea
        v-model="content"
        placeholder="寫點什麼吧..."
        rows="6"
        class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800 transition-all duration-200"
      ></textarea>

      <button
        type="submit"
        class="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full"
      >
        發佈貼文
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db, auth } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const content = ref("");
const currentUser = ref(null);

// 取得目前登入的使用者
onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
});

const submitPost = async () => {
  if (!currentUser.value) {
    alert("請先登入才能發文");
    return;
  }

  if (!content.value.trim()) {
    alert("請輸入貼文內容");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      content: content.value,
      createdAt: serverTimestamp(),
      uid: currentUser.value.uid,
      email: currentUser.value.email,
    });

    alert("貼文已發佈");
    content.value = ""; // 清空輸入框
  } catch (error) {
    console.error("發文錯誤:", error);
    alert("發文失敗");
  }
};
</script>