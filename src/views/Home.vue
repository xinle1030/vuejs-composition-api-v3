<script setup lang="ts">
import Timeline from '../components/Timeline.vue'
</script>

<template>
  <!-- since we are using await to fetch post in Timeline.vue, we have to wrap Timeline component with Suspense for loading -->
  <Suspense>
    <!-- default content -->
    <template #default>
      <Timeline />
    </template>

    <!-- while waiting for the post, we need to give it a component to render -->
    <template #fallback>
      <!-- loading progress bar -->
      <progress class="progress is-primary is-small" />
    </template>
  </Suspense>
</template>
