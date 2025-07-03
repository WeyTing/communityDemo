<template>
  <div class="space-y-4">
    <div
      v-for="post in posts"
      :key="post.id"
      @click="openModal(post)"
      class="bg-white shadow-md p-5 rounded-xl border border-gray-100 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
      <div class="flex items-start gap-3">
        <img
          :src="post.photoURL || getUserAvatar(post.email)"
          :alt="post.email"
          class="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200" />

        <div class="flex-1 min-w-0">
          <p class="text-gray-800 truncate font-medium">{{ post.content }}</p>

          <div
            class="text-sm text-gray-500 mt-2 flex justify-between items-center">
            <span class="font-medium text-blue-600 truncate">{{
              post.displayName || post.email
            }}</span>
            <span class="flex-shrink-0">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="posts.length === 0"
      class="bg-white shadow-md p-8 rounded-xl text-center">
      <p class="text-gray-500">目前還沒有貼文，成為第一個發文的人吧！</p>
    </div>

    <TransitionRoot
      appear
      :show="isOpen"
      as="template">
      <Dialog
        as="div"
        class="relative z-10"
        @close="isOpen = false">
        <div
          class="fixed inset-0 bg-opacity-75 backdrop-blur-sm transition-opacity"></div>

        <div
          class="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel
            class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all">
            <div class="flex items-center gap-3 mb-4">
              <img
                :src="
                  selectedPost?.photoURL || getUserAvatar(selectedPost?.email)
                "
                :alt="selectedPost?.email"
                class="w-12 h-12 rounded-full object-cover border border-gray-200" />
              <div>
                <h3 class="font-medium text-gray-900">
                  {{ selectedPost?.displayName || "使用者" }}
                </h3>
                <p class="text-sm text-gray-500">{{ selectedPost?.email }}</p>
              </div>
            </div>

            <DialogTitle
              class="text-xl font-bold text-gray-900 pb-2 border-b border-gray-100">
              發文內容
            </DialogTitle>

            <div
              v-if="!isEditing"
              class="mt-4 whitespace-pre-wrap text-gray-800 text-base leading-relaxed">
              {{ selectedPost?.content }}
            </div>

            <div
              v-else
              class="mt-4">
              <textarea
                v-model="editContent"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 resize-none min-h-[120px]"></textarea>
            </div>

            <div class="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatDate(selectedPost?.createdAt) }}</span>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <button
                v-if="isOwner && !isEditing"
                @click="startEdit"
                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                編輯
              </button>

              <button
                v-if="isOwner"
                @click="deletePost"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                刪除
              </button>

              <button
                v-if="isEditing"
                @click="saveEdit"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7" />
                </svg>
                儲存
              </button>

              <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200">
                關閉
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";

const posts = ref([]);
const isOpen = ref(false);
const selectedPost = ref(null);
const isEditing = ref(false);
const editContent = ref("");
const isOwner = ref(false);

const getUserAvatar = (email) => {
  const name = email ? email.split("@")[0] : "User";
  return `https://ui-avatars.com/api/?name=${name}&background=random`;
};

const openModal = (post) => {
  selectedPost.value = post;
  editContent.value = post.content;
  isEditing.value = false;

  const user = getAuth().currentUser;
  isOwner.value = user && user.uid === post.uid;

  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  isEditing.value = false;
};

const startEdit = () => {
  isEditing.value = true;
};

const saveEdit = async () => {
  try {
    const docRef = doc(db, "posts", selectedPost.value.id);
    await updateDoc(docRef, {
      content: editContent.value,
    });
    isEditing.value = false;
    selectedPost.value.content = editContent.value;
    alert("已儲存");
  } catch (err) {
    alert("儲存失敗");
    console.error(err);
  }
};

const deletePost = async () => {
  if (!confirm("你確定要刪除這篇貼文嗎？")) return;

  try {
    const docRef = doc(db, "posts", selectedPost.value.id);
    await deleteDoc(docRef);
    isOpen.value = false;
    alert("貼文已刪除");
  } catch (err) {
    alert("刪除失敗");
    console.error(err);
  }
};

onMounted(() => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    posts.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
});

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.toLocaleTimeString()}`;
}
</script>
