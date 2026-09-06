<template>
  <div
    class="fresh-home-video-list scroll-top scroll-bottom"
    :class="{ 'not-empty': videos.length > 0, grid }"
  >
    <div ref="content" class="fresh-home-video-list-content">
      <div v-if="videos.length === 0" class="fresh-home-video-list-empty">
        <VLoading v-if="loading" />
        <VEmpty v-else />
      </div>
      <VideoCardWrapper v-for="video of videos" v-else ref="cards" :key="video.id" :data="video" />
    </div>
  </div>
</template>
<script lang="ts">
import { VEmpty, VLoading } from '@/ui'
import { enableHorizontalScroll } from '@/core/horizontal-scroll'
import { addComponentListener } from '@/core/settings'
import VideoCardWrapper from './VideoCardWrapper.vue'
import { setupScrollMask, cleanUpScrollMask } from './scroll-mask'

export default Vue.extend({
  components: {
    VEmpty,
    VLoading,
    VideoCardWrapper,
  },
  props: {
    videos: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: true,
    },
    grid: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    videos() {
      this.setupIntersection()
    },
    loaded() {
      if (this.loaded) {
        this.setupIntersection()
      }
    },
  },
  beforeDestroy() {
    cleanUpScrollMask(this.$el)
  },
  mounted() {
    if (this.grid) {
      return
    }
    const container = this.$refs.content as HTMLElement
    let cancel: () => void
    addComponentListener(
      'freshHome.horizontalWheelScroll',
      (scroll: boolean) => {
        if (scroll) {
          cancel = enableHorizontalScroll(container)
        } else {
          cancel?.()
        }
      },
      true,
    )
  },
  methods: {
    async setupIntersection() {
      if (this.grid) {
        return
      }
      await this.$nextTick()
      setupScrollMask({
        container: this.$el,
        items: this.$refs.cards.map((c: Vue) => c.$el),
      })
    },
    offsetPage(offset: number) {
      const container = this.$refs.content as HTMLElement
      const style = getComputedStyle(container)
      const containerWidth = container.clientWidth
      const wrapperWidth =
        parseFloat(style.getPropertyValue('--card-width')) +
        parseFloat(style.getPropertyValue('--card-padding'))
      const pageWidth = Math.trunc(containerWidth / wrapperWidth) * wrapperWidth
      container.scrollBy(offset * pageWidth, 0)
    },
  },
})
</script>
<style lang="scss">
@import 'common';
@import 'effects';

.fresh-home-video-list {
  --card-height: var(--home-content-height);
  --card-width: 200px;
  --card-padding: 12px;
  position: relative;
  display: flex;
  flex: 1 0 0;
  width: 0;
  @include scroll-mask-x(36px, var(--home-base-color));

  &-content {
    @include h-center();
    @include no-scrollbar();
    overscroll-behavior: initial;
    flex: 1;
    min-height: calc(var(--home-content-height) + var(--card-padding) * 2);
  }
  &-empty {
    margin: var(--card-padding);
    border: 2px dashed #8884;
    border-radius: var(--home-card-radius);
    flex-grow: 1;
    align-self: stretch;
    @include h-center();
  }
  &.not-empty &-content {
    scroll-snap-type: x mandatory;
  }

  // 两列纵向网格布局, 用于标签页内容
  &.grid {
    --card-width: 600px;
    --card-height: auto;
    width: 100%;
    flex: 1 1 auto;
    &::before,
    &::after {
      display: none;
    }
    .fresh-home-video-list-content {
      display: grid;
      grid-template-columns: repeat(2, var(--card-width));
      justify-content: space-evenly;
      row-gap: 8px;
      min-height: unset;
      scroll-snap-type: none;
    }
    .fresh-home-video-card-wrapper {
      padding: var(--card-padding) 0;
      padding-left: 0;
      padding-right: 0;
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
</style>
