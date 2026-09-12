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
import { VideoCard } from '@/components/feeds/video-card'
import { visible } from '@/core/observer'
import { logError } from '@/core/utils/log'
import { VButton, VIcon, VLoading } from '@/ui'
import VideoList from '../../VideoList.vue'
import { getTrendingVideos } from '../../../trending'

export default Vue.extend({
  components: {
    VButton,
    VIcon,
    VLoading,
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
      videos: [] as VideoCard[],
      loading: true,
      /** 下一页请求是否在途 */
      loadingMore: false,
      /** 已经取不到新内容 */
      noMore: false,
      /** 上一次请求失败, 等手动重试 */
      error: false,
      /** 已请求到第几页, 从 1 开始 */
      page: 0,
      /** 自增的加载轮次, 用于丢弃"刷新"之前在途请求的结果 */
      round: 0,
      observer: null as IntersectionObserver | null,
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
    async loadMore() {
      if (this.loadingMore || this.noMore || this.error) {
        return
      }
      const { round } = this
      this.loadingMore = true
      try {
        this.page += 1
        const fetched = await getTrendingVideos(this.personalized, this.page)
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
      this.page = 0
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

.fresh-home-trending {
  @include v-stretch();
  &-content {
    flex-grow: 1;
    display: flex;
    margin: -12px;
  }
}
</style>
