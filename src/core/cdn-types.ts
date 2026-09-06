import { meta } from './meta'

/** 热更新使用的更新源 */
export enum CdnTypes {
  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jsDelivr = 'jsDelivr',
  AltCdn = 'AltCdn',
  GitHub = 'GitHub',
}
// 与构建侧 (webpack/cdn/*) 一致指向自建 fork, 保证切换更新源后仍从 fork 拉取
export const defaultOwner = 'whymesocooll'
/** 根据分支名和仓库 owner 检索 CDN 链接 */
export const cdnRoots: Record<CdnTypes, (branch: string, owner?: string) => string> = {
  jsDelivr: (branch, owner) => meta.compilationInfo.allCdns.jsDelivr.root(branch, owner),
  AltCdn: (branch, owner) => meta.compilationInfo.altCdn.root(branch, owner),
  GitHub: (branch, owner) =>
    `https://raw.githubusercontent.com/${owner || defaultOwner}/Bilibili-Evolved/${branch}/`,
}
