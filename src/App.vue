<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
	<div class="text-center mt-10 text-3xl text-blue-600 font-bold">
		Hello, MiniSocial!
	</div>
	<Navbar />
	<Router-view />
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
