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
      <VideoCardWrapper
        v-for="video of videos"
        v-else
        ref="cards"
        :key="video.id"
        :data="video"
        :grid="grid"
      />
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

  // 纵向网格布局, 用于标签页内容.
  // 列数按本区域的实际可用宽度决定 (容器查询), 而不是视口宽度:
  // .fresh-home 还受 maxWidth 选项 (默认 1440px) 限制, 视口再宽它也不会变宽,
  // 若按视口加列, 固定宽度的列就会顶破容器造成横向溢出.
  // 本元素即网格的父元素, 其内容宽度正好等于网格可用宽度, 因此查询最准确.
  &.grid {
    container-type: inline-size;
    --card-height: auto;
    width: 100%;
    flex: 1 1 auto;
    &::before,
    &::after {
      display: none;
    }
    .fresh-home-video-list-content {
      display: grid;
      --card-width: 600px;
      --video-grid-columns: 1;
      grid-template-columns: repeat(var(--video-grid-columns), var(--card-width));
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
    // 以下每个断点都保证 列数 × 卡片宽度 小于容器宽度, 留出的余量交给 space-evenly 分配,
    // 因此不会出现横向溢出.
    @container (min-width: 1150px) {
      .fresh-home-video-list-content {
        --video-grid-columns: 2;
        --card-width: 560px;
      }
    }
    @container (min-width: 1240px) {
      .fresh-home-video-list-content {
        --card-width: 600px;
      }
    }
    // 3 列需要 3 × 600px, 只有把 maxWidth 选项调到 1900 以上才可能触发
    @container (min-width: 1860px) {
      .fresh-home-video-list-content {
        --video-grid-columns: 3;
      }
    }
  }
}
</style>
