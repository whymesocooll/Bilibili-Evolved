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
  &.be-tab-control .default-content > * {
    flex: 1;
    min-width: 0;
    max-width: 100%;
  }
}
</style>
