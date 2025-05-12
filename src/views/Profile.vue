<template>
	<div class="min-h-screen bg-gray-100 py-10">
		<div class="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
			<div class="flex items-center gap-6">
				<img
					:src="user.photoURL || defaultAvatar"
					alt="avatar"
					class="w-24 h-24 rounded-full object-cover ring-2 ring-blue-400"
				/>
				<div>
					<h2 class="text-xl font-bold text-gray-800">
						{{ user.displayName || "訪客" }}
					</h2>
					<p class="text-sm text-gray-500">{{ user.email || "尚未登入" }}</p>
				</div>
			</div>

			<div class="mt-6 flex gap-4">
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					@click="editMode = true"
				>
					編輯資料
				</button>
				<button
					class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
					@click="logout"
				>
					登出
				</button>
			</div>

			<div v-if="editMode" class="mt-6 border-t pt-6">
				<label class="block mb-2 text-sm font-medium text-gray-900"
					>更改暱稱：</label
				>
				<input
					v-model="displayNameInput"
					class="w-full border px-3 py-2 rounded-md text-gray-900"
					type="text"
					placeholder="輸入新暱稱"
				/>

				<button
					class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
					@click="updateProfileFn"
				>
					儲存
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, updateProfile, signOut } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser || {};

const defaultAvatar = "https://i.imgur.com/placeholder.png";
const displayNameInput = ref(user.displayName || "");
const editMode = ref(false);

const updateProfileFn = async () => {
	try {
		await updateProfile(user, {
			displayName: displayNameInput.value,
		});
		alert("暱稱更新成功！請重新整理頁面查看變更");
		editMode.value = false;
	} catch (err) {
		alert("更新失敗：" + err.message);
	}
};

const logout = async () => {
	await signOut(auth);
	window.location.href = "/"; // 登出後導回首頁
};
</script>
