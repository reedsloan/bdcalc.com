<template>
  <NuxtLink :to="link" class="col-span-6 grid grid-cols-12 text-center surface rounded-2xl px-8 py-16 hover:ring-1 ring-white">
      <div class="self-center col-span-4">
        <font-awesome-icon :icon="icon" size="2x" />
      </div>
      <div class="self-center col-span-8">
        <p class="text-3xl font-bold">{{ title }}</p>
        <p class="text-xl mt-2">{{ description }}</p>
      </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    }
  }
}
</script>
