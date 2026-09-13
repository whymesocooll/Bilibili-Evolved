import { defineComponentMetadata } from '@/components/define'
import { addControlBarButton, type VideoControlBarItem } from '@/components/video/video-control-bar'
import {
  addComponentListener,
  getComponentSettings,
  removeComponentListener,
} from '@/core/settings'
import { playerUrls } from '@/core/utils/urls'
import { BewlycatOptions, bewlycatOptions } from './options'

const name = 'bewlycat'

const wideScreenButton: VideoControlBarItem = {
  name: 'bewlyWideScreen',
  displayName: '宽屏',
  icon: 'mdi-arrow-expand-horizontal',
  order: 0,
  action: async () => {
    const { playerAgent } = await import('@/components/video/player-agent')
    playerAgent.widescreen()
  },
}

const applyCommentFontSize = (size: number) => {
  document.documentElement.style.setProperty('--bewlycat-comment-font-size', `${size}px`)
}

const entry = () => {
  addControlBarButton(wideScreenButton)
  applyCommentFontSize(getComponentSettings<BewlycatOptions>(name).options.commentFontSize)
  addComponentListener(`${name}.commentFontSize`, applyCommentFontSize)
}
const reload = () => {
  applyCommentFontSize(getComponentSettings<BewlycatOptions>(name).options.commentFontSize)
  addComponentListener(`${name}.commentFontSize`, applyCommentFontSize)
}
const unload = () => {
  removeComponentListener(`${name}.commentFontSize`, applyCommentFontSize)
  document.documentElement.style.removeProperty('--bewlycat-comment-font-size')
}

export const component = defineComponentMetadata({
  name,
  displayName: 'BewlyCat 播放器界面',
  author: {
    name: 'whymesocooll',
    link: 'https://github.com/whymesocooll',
  },
  tags: [componentsTags.video],
  urlInclude: playerUrls,
  options: bewlycatOptions,
  entry,
  reload,
  unload,
  instantStyles: [
    {
      name: 'bewlycat-player-interface',
      style: () => import('./style.scss'),
    },
    {
      name: 'bewlycat-comment-interface',
      style: () => import('./comments.scss'),
    },
  ],
})
