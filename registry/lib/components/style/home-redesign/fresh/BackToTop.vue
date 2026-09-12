<template>
  <VButton
    round
    icon
    no-effects
    class="fresh-home-back-to-top"
    :class="{ visible }"
    title="返回顶部"
    @click="backToTop"
  >
    <VIcon icon="mdi-arrow-up" :size="24" />
  </VButton>
</template>
<script lang="ts">
import { VButton, VIcon } from '@/ui'

/** 往下滚过这么多像素后才显示按钮 */
const showThreshold = 600

export default Vue.extend({
  components: {
    VButton,
    VIcon,
  },
  data() {
    return {
      visible: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateVisible, { passive: true })
    this.updateVisible()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateVisible)
  },
  methods: {
    /**
     * 无需节流: 值没变时 Vue 的响应式 setter 会直接返回, 不会触发重渲染,
     * 因此每次滚动只是一次比较.
     */
    updateVisible() {
      this.visible = window.scrollY > showThreshold
    },
    backToTop() {
      // html 上已有 scroll-behavior: smooth (见 HomeRedesignBase), 所以这里是平滑滚动
      window.scrollTo(0, 0)
    },
  },
})
</script>
<style lang="scss">
.fresh-home-back-to-top.be-button {
  position: fixed;
  right: 40px;
  bottom: 40px;
  // 高于首页内容与滚动遮罩(z-index: 100), 低于设置面板(1000)
  z-index: 900;
  // 与页签栏一致的毛玻璃质感
  padding: 12px !important;
  border-radius: 50% !important;
  background-color: rgba(120, 120, 128, 0.14) !important;
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out, background-color 0.2s ease-out,
    box-shadow 0.2s ease-out;

  body.dark & {
    background-color: rgba(120, 120, 128, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}
// 未滚动的隐藏态
.fresh-home-back-to-top.be-button:not(.visible) {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
  pointer-events: none;
}
.fresh-home-back-to-top.be-button.visible:hover {
  background-color: rgba(120, 120, 128, 0.24) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.75);
  transform: translateY(-2px);

  body.dark & {
    background-color: rgba(120, 120, 128, 0.42) !important;
  }
}
</style>
