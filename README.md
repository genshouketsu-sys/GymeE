# Gyme — 教练端与学员端

- coach/dist：教练端完整 HTML、CSS、JavaScript 和图片资源。
- member/dist：学员端完整 HTML、CSS、JavaScript 和图片资源。

## 本地运行

在解压后的目录打开终端：

教练端：`python -m http.server 8000 --directory coach/dist`

学员端（另一个终端）：`python -m http.server 8001 --directory member/dist`

分别打开 http://localhost:8000 和 http://localhost:8001 。无需安装依赖或构建。

## 功能说明

此导出保留当前网站源码和设计。部分交互为前端演示；备注与草稿保存在当前浏览器，照片为本地预览。教练与学员之间的实时消息、共享数据及后端尚未接入。

## 上传 GitHub

解压后，将 coach、member 文件夹和本 README.md 一起上传至仓库。
