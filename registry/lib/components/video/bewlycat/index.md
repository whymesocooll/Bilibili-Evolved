# BewlyCat 播放器界面

把 [BewlyCat](https://github.com/keleus/BewlyCat) 的视频播放器界面风格带到 Bilibili Evolved 的播放器上。

当前提供：

- 在播放器控制栏新增一个 **宽屏切换按钮**（悬停显示「宽屏」提示），点击切换 bilibili 的宽屏/剧场模式。
- 播放器主题适配：让播放器内的功能提示（toast）交互色跟随 Bilibili Evolved 的主题色（深色模式同样生效）。
- **评论区主题适配**：评论富文本链接、投票/跳转链接、评论提交按钮、回复框聚焦边框等使用主题色。

说明：

- Bilibili Evolved 本身已对播放器页面做了完整的主题与深色适配，因此本组件只补充 BewlyCat 特有的、与既有主题不冲突的增量样式。
- 视频页评论区是 Shadow DOM 组件，点赞/踩图标等位于组件内部，无法从外部直接染成主题色；深色模式的背景与文字由 Bilibili Evolved 自带的暗色主题负责。
