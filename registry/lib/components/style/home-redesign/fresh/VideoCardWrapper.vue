<template>
  <div class="fresh-home-video-card-wrapper">
    <VideoCard
      v-bind="$attrs"
      orientation="vertical"
      :cover-size="coverSize"
      :cover-sizes="coverSizes"
    />
  </div>
</template>
<script lang="ts">
import VideoCard from '@/components/feeds/VideoCard.vue'

export default Vue.extend({
  components: {
    VideoCard,
  },
  props: {
    grid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 网格模式的卡片远宽于横向列表, 封面需按实际卡片宽度请求, 否则会被放大而模糊
    coverSize() {
      if (this.grid) {
        return { width: 600, height: 375 }
      }
      return { width: 196, height: 120 }
    },
    coverSizes() {
      if (this.grid) {
        // 与 VideoList 网格模式的卡片宽度断点保持一致
        return '(min-width: 1440px) 600px, 560px'
      }
      return null
    },
  },
})
</script>
<style lang="scss">
.fresh-home-video-card-wrapper {
  --padding: var(--card-padding, 12px);
  padding: var(--padding) 0;
  padding-left: var(--padding);
  scroll-snap-align: start;
  &:last-child {
    padding-right: var(--padding);
  }
  .video-card {
    border-radius: var(--home-card-radius) !important;
    .cover-container {
      border-radius: calc(var(--home-card-radius) - 1px) calc(var(--home-card-radius) - 1px) 0 0 !important;
    }
    &,
    & * {
      transition: 0.2s ease-out;
    }
  }
}
</style>
