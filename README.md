# Papers arXiv Copy

一款 Chrome 浏览器扩展，为 [HuggingFace Daily Papers](https://huggingface.co/papers) 和 [alphaXiv](https://www.alphaxiv.org/) 页面添加一键复制 arXiv 链接的按钮，方便快速获取论文原始链接。

## 功能

- **HuggingFace Papers**：在每篇论文缩略图上叠加红色 arXiv 徽章按钮，点击即复制  链接到剪贴板，同时将缩略图链接替换为 arXiv 页面。
- **alphaXiv**：在论文卡片底部操作栏添加 arXiv PDF 药丸按钮，点击即复制  链接。
- 点击后按钮短暂变为绿色 Copied! 反馈，1.5 秒后自动恢复。
- 支持页面动态加载（MutationObserver），无需手动刷新。

## 效果展示

**HuggingFace Daily Papers 页面：**

![HuggingFace Demo](asset/huggingface_daily.png)

**alphaXiv 页面：**

![alphaXiv Demo](asset/alphaxiv.png)

## 安装

1. 下载或克隆本仓库
2. 打开 Chrome，进入 
3. 开启右上角**开发者模式**
4. 点击**加载已解压的扩展程序**，选择本项目文件夹

## 文件结构



## 权限说明

本扩展仅请求  权限，用于将链接写入剪贴板，不收集任何用户数据。
