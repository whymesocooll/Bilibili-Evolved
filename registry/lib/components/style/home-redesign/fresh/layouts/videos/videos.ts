import { FreshLayoutItem } from '../fresh-layout-item'

export const videos: FreshLayoutItem = {
  name: 'videos',
  displayName: '视频',
  grow: true,
  component: () => import('./Videos.vue').then(m => m.default),
}
