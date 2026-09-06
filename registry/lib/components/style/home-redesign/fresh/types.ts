import { defineOptionsMetadata } from '@/components/define'
import { getNumberValidator } from '@/core/utils'
import type { FreshLayoutItemSettings } from './layouts/fresh-layout-item'
import { areaPrimaryTitleColorEnum } from './init-dropdown-options/area-primary-title-color'

export enum RankListMode {
  Default = 'default',
  Compact = 'compact',
}

export enum FreshVideosTab {
  Feeds = '动态',
  Trending = '热门',
  Recommend = '推荐',
}

export const freshHomeOptionsMetadata = defineOptionsMetadata({
  layoutOptions: {
    displayName: '版块设置',
    defaultValue: {
      blackboard: {
        linebreak: false,
        order: 1,
        // as boolean 一下, 不然 TS 会推断为只能 false
        hidden: false as boolean,
      },
      videos: {
        linebreak: true,
        order: 2,
        hidden: false,
      },
      areas: {
        linebreak: true,
        order: 3,
        hidden: false,
      },
      categories: {
        linebreak: false,
        order: 4,
        hidden: false,
      },
    } satisfies Record<string, FreshLayoutItemSettings>,
    hidden: true,
  },
  defaultVideosTab: {
    displayName: '默认视频标签页',
    defaultValue: FreshVideosTab.Feeds,
    dropdownEnum: FreshVideosTab,
  },
  horizontalWheelScroll: {
    displayName: '启用横向滚动',
    defaultValue: false,
  },
  areaPrimaryTitleColor: {
    displayName: '栏目主标题颜色',
    dropdownEnum: areaPrimaryTitleColorEnum,
    defaultValue: areaPrimaryTitleColorEnum.Dark,
  },
  maxWidth: {
    displayName: '最大宽度 (px)',
    defaultValue: 1440,
    validator: getNumberValidator(1000, 3000),
  },
  rankListMode: {
    displayName: '',
    defaultValue: RankListMode.Default,
    hidden: true,
  },
})
