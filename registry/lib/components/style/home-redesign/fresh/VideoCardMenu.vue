<template>
  <div class="fresh-home-video-card-menu" @click.stop.prevent>
    <div
      ref="trigger"
      class="menu-trigger"
      role="button"
      tabindex="0"
      title="更多操作"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <VIcon icon="mdi-dots-horizontal" :size="16" />
    </div>
    <VPopup v-model="menuOpen" class="menu-popup" :trigger-element="$refs.trigger" :lazy="false">
      <div class="menu-item" @click="onNotInterested">
        <VIcon icon="mdi-eye-off-outline" :size="15" />
        <span>不感兴趣</span>
      </div>
      <div class="menu-item" @click="onBlockUp">
        <VIcon icon="mdi-account-cancel-outline" :size="15" />
        <span>拉黑该 UP 主</span>
      </div>
    </VPopup>
  </div>
</template>
<script lang="ts">
import { VideoCard } from '@/components/feeds/video-card'
import { Toast } from '@/core/toast'
import { logError } from '@/core/utils/log'
import { VIcon, VPopup } from '@/ui'
import { blockUp } from './video-card-actions'

export default Vue.extend({
  components: {
    VIcon,
    VPopup,
  },
  props: {
    data: {
      type: Object as () => VideoCard,
      required: true,
    },
  },
  data() {
    return {
      menuOpen: false,
    }
  },
  methods: {
    toggle() {
      this.menuOpen = !this.menuOpen
    },
    onNotInterested() {
      this.menuOpen = false
      this.$emit('not-interested', this.data)
      Toast.info('已从当前列表隐藏, 刷新后恢复', '不感兴趣', 2000)
    },
    async onBlockUp() {
      this.menuOpen = false
      const { upID, upName } = this.data
      if (!upID) {
        Toast.error('这条视频没有可用的 UP 主信息', '拉黑失败')
        return
      }
      try {
        await blockUp(upID)
        this.$emit('block-up', upID)
        Toast.success(`已拉黑 ${upName || '该 UP 主'}`, '拉黑成功')
      } catch (error) {
        logError(error)
        Toast.error(error instanceof Error ? error.message : String(error), '拉黑失败')
      }
    },
  },
})
</script>
<style lang="scss">
.fresh-home-video-card-menu {
  position: absolute;
  right: 8px;
  // 卡片外层有 --padding 的上下内边距, 抵消后才能贴到卡片自身的右下角
  bottom: calc(var(--padding, 12px) + 4px);
  z-index: 2;
  .menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: #8881;
    color: #666;
    cursor: pointer;
    opacity: 0.55;
    transition: 0.2s ease-out;
    body.dark & {
      color: #ccc;
    }
    &:hover,
    &:focus {
      opacity: 1;
      background-color: #8883;
      color: var(--theme-color);
    }
  }
  &.open .menu-trigger {
    opacity: 1;
  }
  .menu-popup {
    top: auto;
    left: auto;
    right: 0;
    bottom: calc(100% + 6px);
    z-index: 3;
    padding: 4px;
    background-color: #fff;
    border: 1px solid #8882;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
    body.dark & {
      background-color: #282828;
      border-color: #8883;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px 6px 8px;
      border-radius: 6px;
      font-size: 13px;
      white-space: nowrap;
      color: #333;
      cursor: pointer;
      transition: background-color 0.2s ease-out;
      body.dark & {
        color: #eee;
      }
      &:hover {
        background-color: #8882;
        color: var(--theme-color);
      }
    }
  }
}
</style>
