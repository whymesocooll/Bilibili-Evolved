<template>
  <div class="fresh-home-feeds">
    <div class="fresh-home-header">
      <div class="fresh-home-header-title">动态</div>
      <div class="fresh-home-header-center-area">
        <div class="fresh-home-header-tabs">
          <div class="default-tabs">
            <div
              v-for="t of tabs"
              :key="t.name"
              class="default-tab"
              :class="{ selected: t === selectedTab }"
              @click="selectTab(t)"
            >
              <div class="default-tab-name">
                {{ t.displayName }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fresh-home-header-pagination">
        <a href="https://www.bilibili.com/video/online.html" target="_blank" title="在线列表">
          <VButton icon>
            <VIcon icon="mdi-account-group-outline" :size="19" />
          </VButton>
        </a>
        <VButton icon title="刷新" @click="reload">
          <VIcon icon="mdi-refresh" :size="18" />
        </VButton>
        <a
          class="fresh-home-header-icon-button rotate"
          href="https://t.bilibili.com"
          target="_blank"
        >
          <VButton round>
            <VIcon icon="feeds" :size="20" />
            全部动态
          </VButton>
        </a>
      </div>
    </div>
    <div class="fresh-home-feeds-content">
      <VideoList :videos="videos" :loading="loading" grid />
    </div>
    <div ref="sentinel" class="fresh-home-load-more">
      <template v-if="videos.length > 0">
        <VButton v-if="error" round @click="retry"> 加载失败, 点击重试 </VButton>
        <div v-else-if="noMore" class="fresh-home-load-more-end">没有更多了</div>
        <VLoading v-else />
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { getVideoFeeds } from '@/components/feeds/api'
import { VideoCard } from '@/components/feeds/video-card'
import { ArrayContent } from '@/core/common-types'
import { visible } from '@/core/observer'
import { ascendingStringSort } from '@/core/utils/sort'
import { logError } from '@/core/utils/log'
import { VButton, VIcon, VLoading } from '@/ui'
import VideoList from '../../VideoList.vue'

type FeedsApi = (afterID?: string | number) => Promise<VideoCard[]>
const tabs = [
  {
    name: 'videoFeeds',
    displayName: '视频',
    api: getVideoFeeds.bind(undefined, 'video') as FeedsApi,
    href: 'https://t.bilibili.com/?tab=8',
  },
  {
    name: 'bangumiFeeds',
    displayName: '番剧',
    api: getVideoFeeds.bind(undefined, 'bangumi') as FeedsApi,
    href: 'https://t.bilibili.com/?tab=512',
  },
]
type TabType = ArrayContent<typeof tabs>
export default Vue.extend({
  components: {
    VButton,
    VIcon,
    VLoading,
    VideoList,
  },
  data() {
    return {
      tabs,
      selectedTab: tabs[0],
      videos: [] as VideoCard[],
      loading: true,
      /** 下一页请求是否在途 */
      loadingMore: false,
      /** 已经取不到新内容 */
      noMore: false,
      /** 上一次请求失败, 等手动重试 */
      error: false,
      /** 自增的加载轮次, 用于丢弃"刷新/切标签"之前在途请求的结果 */
      round: 0,
      observer: null as IntersectionObserver | null,
    }
  },
  computed: {
    /** 最旧那条动态的 id, 作为取下一页历史的偏移量 */
    lastID(): string | undefined {
      if (!this.videos.length) {
        return undefined
      }
      const videos: VideoCard[] = [...this.videos]
      return videos.sort(ascendingStringSort(it => it.id))[0].id
    },
  },
  created() {
    this.loadMore()
  },
  mounted() {
    // 哨兵进入视口 => 已滚到底, 自动加载下一页
    const [observer] = visible(this.$refs.sentinel as HTMLElement, records => {
      if (records.some(it => it.isIntersecting)) {
        this.loadMore()
      }
    })
    this.observer = observer
  },
  beforeDestroy() {
    this.observer?.disconnect()
  },
  methods: {
    selectTab(tab: TabType) {
      if (this.selectedTab === tab) {
        window.open(tab.href, '_blank')
        return
      }
      this.selectedTab = tab
      this.reload()
    },
    async loadMore() {
      if (this.loadingMore || this.noMore || this.error) {
        return
      }
      const { round } = this
      this.loadingMore = true
      try {
        const fetched = await this.selectedTab.api(this.lastID)
        if (round !== this.round) {
          return
        }
        const merged = lodash.uniqBy([...this.videos, ...fetched], (it: VideoCard) => it.id)
        // 一条新内容都没取到, 说明已经到底了
        this.noMore = merged.length === this.videos.length
        this.videos = merged
      } catch (error) {
        if (round !== this.round) {
          return
        }
        logError(error)
        this.error = true
      } finally {
        if (round === this.round) {
          this.loading = false
          this.loadingMore = false
        }
      }
    },
    retry() {
      this.error = false
      this.loadMore()
    },
    async reload() {
      this.round += 1
      this.videos = []
      this.noMore = false
      this.error = false
      this.loading = true
      this.loadingMore = false
      await this.loadMore()
    },
  },
})
</script>
<style lang="scss">
@import 'common';

.fresh-home-feeds {
  @include v-stretch();
  &-content {
    flex-grow: 1;
    display: flex;
    margin: -12px;
  }
}
</style>
