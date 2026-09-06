<template>
  <div class="fresh-home-trending">
    <div class="fresh-home-header">
      <div class="fresh-home-header-title">
        {{ title }}
      </div>
      <div class="fresh-home-header-pagination">
        <VButton icon title="刷新" @click="reload">
          <VIcon icon="mdi-refresh" :size="18" />
        </VButton>
      </div>
    </div>
    <div class="fresh-home-trending-content">
      <VideoList :videos="videos" :loading="loading" grid />
    </div>
  </div>
</template>
<script lang="ts">
import { VButton, VIcon } from '@/ui'
import VideoList from '../../VideoList.vue'
import { getTrendingVideos } from '../../../trending'

export default Vue.extend({
  components: {
    VButton,
    VIcon,
    VideoList,
  },
  props: {
    personalized: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      videos: [],
      loading: true,
    }
  },
  computed: {
    title() {
      if (this.personalized) {
        return '推荐'
      }
      return '热门'
    },
  },
  created() {
    this.reload()
  },
  methods: {
    async reload() {
      this.loading = true
      this.videos = []
      this.videos = await getTrendingVideos(this.personalized).finally(() => {
        this.loading = false
      })
    },
  },
})
</script>
<style lang="scss">
@import 'common';

.fresh-home-trending {
  @include v-stretch();
  &-content {
    flex-grow: 1;
    display: flex;
    margin: -12px;
  }
}
</style>
