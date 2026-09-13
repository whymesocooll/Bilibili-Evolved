import { postTextWithCredentials } from '@/core/ajax'
import { getCsrf } from '@/core/utils'

interface BiliResponse {
  code: number
  message: string
}

/** 常见失败码的文案, 其余情况直接用服务端返回的 message */
const blockErrorMessages: Record<number, string> = {
  [-101]: '请先登录',
  22001: '不能拉黑自己',
  22120: '该 UP 主已在黑名单中',
}

/**
 * 把 UP 主加入黑名单.
 * `act=5` 即拉黑, `re_src=14` 表示来源是视频相关入口.
 */
export const blockUp = async (upID: number) => {
  const csrf = getCsrf()
  if (!csrf) {
    throw new Error('请先登录')
  }
  const responseText = await postTextWithCredentials(
    'https://api.bilibili.com/x/relation/modify',
    new URLSearchParams({
      fid: upID.toString(),
      act: '5',
      re_src: '14',
      csrf,
    }),
  )
  const response = JSON.parse(responseText) as BiliResponse
  if (response.code !== 0) {
    throw new Error(blockErrorMessages[response.code] ?? response.message)
  }
}
