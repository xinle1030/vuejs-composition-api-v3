<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useModal } from '../composables/modal'
import { useUsers } from '../stores/users';
import SignupForm from './SignupForm.vue';

const modal = useModal()
const usersStore = useUsers()
const router = useRouter();

async function logout () {
  await usersStore.logout();
  router.push({ path: "/" });
}
</script>

<template>
  <div class="navbar">
    <div class="navbar-end">
      <!-- if user has log in show log out btn -->
      <div v-if="usersStore.currentUserId" class="buttons">
        <RouterLink to="/posts/new" class="button">New Post</RouterLink>
        <button class="button" @click="logout()">Log Out</button>
      </div>

      <!-- else shows sign up or sign in btn -->
      <div v-else class="buttons">
        <button class="button" @click="modal.showModal('signUp')">Sign Up</button>
        <button class="button" @click="modal.showModal('signIn')">Sign In</button>
      </div>

    </div>
  </div>

  <!-- teleport modal to the div with id = modal -->
  <Teleport to="#modal">
    <!-- passing modal.component.value from showModal() using :is to pass in component dynamically -->
    <component :is="modal.component.value" />
  </Teleport>
</template>