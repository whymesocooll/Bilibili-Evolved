<template>
  <TabControl class="fresh-home-videos" :tabs="tabs" :default-tab="defaultTab" />
</template>
<script lang="ts">
import { TabControl } from '@/ui'
import { TabMappings } from '@/ui/tab-mapping'
import { freshHomeOptions } from '../../options'
import { FreshVideosTab } from '../../types'

const tabNames: Record<FreshVideosTab, string> = {
  [FreshVideosTab.Feeds]: 'feeds',
  [FreshVideosTab.Trending]: 'trending',
  [FreshVideosTab.Recommend]: 'recommend',
}

export default Vue.extend({
  components: {
    TabControl,
  },
  data() {
    const tabs: TabMappings = [
      {
        name: 'feeds',
        displayName: '动态',
        component: () => import('../feeds/Feeds.vue').then(m => m.default),
      },
      {
        name: 'trending',
        displayName: '热门',
        component: () => import('../trending/Trending.vue').then(m => m.default),
      },
      {
        name: 'recommend',
        displayName: '推荐',
        component: () => import('../trending/Recommend.vue').then(m => m.default),
      },
    ]
    return {
      tabs,
      defaultTab: tabNames[freshHomeOptions.defaultVideosTab],
    }
  },
})
</script>
<style lang="scss">
.fresh-home-videos {
  flex: 1;
  width: 100%;

  &.be-tab-control {
    .default-content > * {
      flex: 1;
      min-width: 0;
      max-width: 100%;
    }

    // 只作用于本 TabControl 自己的页签栏. 全部走子选择器 `>`,
    // 以免影响到嵌套在内容里的其它 tab (例如"动态"里的 视频/番剧 子标签).
    > .default-header {
      padding-bottom: 12px;

      // iPhone 分段控件式毛玻璃: 半透明灰底 + 背景模糊 + 高光描边 + 柔和投影.
      // 灰色底(而不是白色)是为了在白色首页背景上也能看出玻璃的形状.
      > .default-tabs {
        padding: 4px;
        border-radius: 999px;
        background-color: rgba(120, 120, 128, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.55);
        box-shadow: 0 6px 22px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);

        body.dark & {
          background-color: rgba(120, 120, 128, 0.3);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        > .default-tab {
          font-size: 17px;
          padding: 8px 20px;
          border-radius: 999px;
          transition: background-color 0.25s ease-out, box-shadow 0.25s ease-out;

          &:not(:last-child) {
            margin-right: 4px;
          }
          // 毛玻璃滑块取代了下划线指示器
          &::after {
            display: none;
          }
          &:active > .default-tab-name {
            opacity: 0.75;
          }

          // 被选中的那一格: 像分段控件里抬起的玻璃滑块
          &.selected {
            background-color: rgba(255, 255, 255, 0.92);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);

            body.dark & {
              background-color: rgba(255, 255, 255, 0.18);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14);
            }
          }
        }
      }
    }
  }
}
</style>
