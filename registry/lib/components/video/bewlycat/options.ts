import { OptionsOfMetadata, defineOptionsMetadata } from '@/components/define'
import { getNumberValidator } from '@/core/utils'

export const bewlycatCommentFontSizeMin = 10
export const bewlycatOptions = defineOptionsMetadata({
  commentFontSize: {
    displayName: '评论区字体大小 (px)',
    defaultValue: 14,
    validator: getNumberValidator(bewlycatCommentFontSizeMin),
  },
})
export type BewlycatOptions = OptionsOfMetadata<typeof bewlycatOptions>
