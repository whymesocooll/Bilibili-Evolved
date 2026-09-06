<template>
  <Trending :personalized="true" />
</template>
<script lang="ts">
import Trending from './Trending.vue'

export default Vue.extend({
  components: {
    Trending,
  },
})
</script>
