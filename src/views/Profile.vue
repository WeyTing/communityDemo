<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div
      v-if="loading"
      class="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 flex justify-center items-center h-40"
    >
      <div class="text-gray-500">載入中...</div>
    </div>

    <div
      v-else-if="!user"
      class="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 flex justify-center items-center h-40"
    >
      <div class="text-center">
        <p class="text-gray-500 mb-4">您尚未登入</p>
        <button
          @click="goToLogin"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          前往登入
        </button>
      </div>
    </div>

    <div v-else class="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
      <div class="flex items-center gap-6">
        <div class="relative group">
          <img
            :src="previewPhotoURL || user.photoURL || defaultAvatar"
            alt="avatar"
            class="w-24 h-24 rounded-full object-cover ring-2 ring-blue-400"
          />
          <div
            v-if="editMode"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            @click="triggerFileInput"
          >
            <span class="text-white text-xs font-medium">更換頭像</span>
          </div>
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handlePhotoChange"
          />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            {{ user.displayName || "使用者" }}
          </h2>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>
      </div>

      <!-- 個人介紹區塊 -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-md font-medium text-gray-700 mb-2">個人介紹</h3>
        <p
          v-if="!editMode && userProfile.bio"
          class="text-gray-600 whitespace-pre-wrap"
        >
          {{ userProfile.bio }}
        </p>
        <p v-else-if="!editMode" class="text-gray-400 italic">
          尚未設定個人介紹
        </p>
      </div>

      <div class="mt-6 flex gap-4">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          @click="editMode = true"
        >
          編輯資料
        </button>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          @click="logout"
        >
          登出
        </button>
      </div>

      <div v-if="editMode" class="mt-6 border-t pt-6">
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >大頭貼：</label
          >
          <div class="flex items-center gap-4">
            <img
              :src="previewPhotoURL || user.photoURL || defaultAvatar"
              alt="preview"
              class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <button
                @click="triggerFileInput"
                class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                選擇圖片
              </button>
              <p v-if="newPhoto" class="text-xs text-gray-500 mt-1">
                已選擇: {{ newPhoto.name }}
              </p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >暱稱：</label
          >
          <input
            v-model="displayNameInput"
            class="w-full border px-3 py-2 rounded-md text-gray-900"
            type="text"
            placeholder="輸入新暱稱"
          />
        </div>

        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >個人介紹：</label
          >
          <textarea
            v-model="bioInput"
            class="w-full border px-3 py-2 rounded-md text-gray-900 resize-none"
            rows="4"
            placeholder="介紹一下自己吧..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ bioInput.length }}/200 字</p>
        </div>

        <div class="mt-6 flex gap-2">
          <button
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            @click="updateProfileFn"
            :disabled="isUpdating"
          >
            {{ isUpdating ? "更新中..." : "儲存變更" }}
          </button>
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            @click="cancelEdit"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAuth,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const router = useRouter();
const auth = getAuth();
const user = ref(null);
const loading = ref(true);
const isUpdating = ref(false);
const IMGUR_CLIENT_ID = "8d96eb468732ae9";

// 大頭貼相關
const fileInput = ref(null);
const newPhoto = ref(null);
const previewPhotoURL = ref(null);

// 個人資料相關
const userProfile = ref({ bio: "" });
const displayNameInput = ref("");
const bioInput = ref("");
const editMode = ref(false);

//預設大頭貼
const defaultAvatar = `https://ui-avatars.com/api/?name=User&background=random`;

onMounted(() => {
  // 使用 onAuthStateChanged 監聽認證狀態變化
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      displayNameInput.value = currentUser.displayName || "";

      // 從 Firestore 獲取用戶資料
      await fetchUserProfile(currentUser.uid);
    } else {
      user.value = null;
    }
    loading.value = false;
  });

  // 組件卸載時取消監聽
  return () => unsubscribe();
});

// 從 Firestore 獲取用戶資料
const fetchUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, "userProfiles", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      userProfile.value = userDoc.data();
      bioInput.value = userDoc.data().bio || "";
    } else {
      // 如果用戶資料不存在，創建一個空的資料
      userProfile.value = { bio: "" };
      bioInput.value = "";
    }
  } catch (error) {
    console.error("獲取用戶資料失敗:", error);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 檢查檔案大小 (限制為 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("圖片大小不能超過 5MB");
      return;
    }

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片檔案");
      return;
    }

    newPhoto.value = file;
    previewPhotoURL.value = URL.createObjectURL(file);
  }
};

const updateProfileFn = async () => {
  if (!user.value) return;

  // 檢查個人介紹字數
  if (bioInput.value.length > 200) {
    alert("個人介紹不能超過 200 字");
    return;
  }

  isUpdating.value = true;
  try {
    let photoURL = user.value.photoURL;

    if (newPhoto.value) {
      // 上傳到 imgur
      photoURL = await uploadToImgur(newPhoto.value);
    }

    // 更新 Firebase Auth 用戶資料
    await updateProfile(user.value, {
      displayName: displayNameInput.value,
      photoURL: photoURL,
    });

    // 更新 Firestore 中的用戶資料
    const userDocRef = doc(db, "userProfiles", user.value.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        bio: bioInput.value,
        updatedAt: new Date(),
      });
    } else {
      await setDoc(userDocRef, {
        bio: bioInput.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 更新本地狀態
    userProfile.value.bio = bioInput.value;

    alert("個人資料更新成功！");
    editMode.value = false;

    // 清除暫存的圖片資料
    if (previewPhotoURL.value) {
      URL.revokeObjectURL(previewPhotoURL.value);
    }
    newPhoto.value = null;
    previewPhotoURL.value = null;
  } catch (err) {
    alert("更新失敗：" + err.message);
    console.error("更新失敗:", err);
  } finally {
    isUpdating.value = false;
  }
};

const cancelEdit = () => {
  editMode.value = false;
  displayNameInput.value = user.value.displayName || "";
  bioInput.value = userProfile.value.bio || "";

  // 清除暫存的圖片資料
  if (previewPhotoURL.value) {
    URL.revokeObjectURL(previewPhotoURL.value);
  }
  newPhoto.value = null;
  previewPhotoURL.value = null;
};

//上傳
const uploadToImgur = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error("Imgur 上傳失敗");
  }
  return result.data.link; // 回傳圖片 URL
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push({ name: "Login" });
  } catch (error) {
    console.error("登出錯誤:", error);
  }
};

const goToLogin = () => {
  router.push({ name: "Login" });
};
</script>
