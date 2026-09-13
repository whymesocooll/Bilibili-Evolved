import { defineComponentMetadata } from '@/components/define'
import { addControlBarButton, type VideoControlBarItem } from '@/components/video/video-control-bar'
import { playerUrls } from '@/core/utils/urls'

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

export const component = defineComponentMetadata({
  name: 'bewlycat',
  displayName: 'BewlyCat 播放器界面',
  author: {
    name: 'whymesocooll',
    link: 'https://github.com/whymesocooll',
  },
  tags: [componentsTags.video],
  urlInclude: playerUrls,
  entry: () => {
    addControlBarButton(wideScreenButton)
  },
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
