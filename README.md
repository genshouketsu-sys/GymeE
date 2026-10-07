# Gyme — 教练端与学员端

- coach/dist：教练端完整 HTML、CSS、JavaScript 和图片资源。
- member/dist：学员端完整 HTML、CSS、JavaScript 和图片资源。
- supabase/：真实的后端（Postgres schema + RLS 权限策略 + 自动化测试），见 [supabase/README.md](supabase/README.md)。两端前端已经接上它了——登录、任务、营养目标、聊天等都是真实的数据库读写，不再是写死数据。

## 用 Docker 跑起来（推荐，交付/演示用）

前提：装好 [Docker Desktop](https://www.docker.com/products/docker-desktop/)（内置 `docker compose`）。

在仓库根目录：

```
docker compose up -d
```

首次启动会自动：建库、建 `anon`/`authenticated`/`authenticator` 角色、跑完 `supabase/migrations/` 里全部 17 个迁移、灌入 `supabase/seed.sql` 的演示数据。之后打开：

- 教练端 http://localhost:8000
- 学员端 http://localhost:8001

演示账号（密码统一是 `gymedemo2024`）：

- 教练：`kenta@gyme.jp`
- 学员：`tanaka@example.com` / `sato@example.com` / `wang@example.com`

学员端首页也可以点"新規登録"自己注册一个新学员账号。

停止：`docker compose down`（加 `-v` 会连数据库数据一起删掉，重新 `up` 就是全新环境）。

数据库端口没有对外暴露（避免跟本机已有的 Postgres 撞端口），需要直连调试时用：

```
docker compose exec postgres psql -U postgres -d gyme
```

> 说明：这份 `docker-compose.yml` 是照着本项目实际跑通过的本地手搭环境（真实 Postgres 16 + PostgREST，逐条命令验证过）原样迁移过来的，每个初始化步骤都在一个全新的临时 Postgres 集群上重新跑过一遍并确认成功；但由于当前开发机没有装 Docker，`docker compose up` 这条命令本身没有被直接执行验证过，第一次使用时请留意日志。

## 本地运行（不用 Docker，纯前端演示/开发用）

如果只是想快速看看界面、不需要真实登录和数据持久化，仍然可以只起静态文件服务器（此时页面会请求 `localhost:3001`，如果没有配套的 PostgREST 在跑，登录等需要网络的功能会请求失败）：

教练端：`python -m http.server 8000 --directory coach/dist`

学员端（另一个终端）：`python -m http.server 8001 --directory member/dist`

要让登录、任务、营养追踪等功能真正跑起来，要么用上面的 Docker 方式，要么按 [supabase/README.md](supabase/README.md) 里"本地手动跑（不用 Docker）"一节自己搭 Postgres + PostgREST。

## 功能说明

真实实现的部分：登录/学员自助注册/忘记密码、训练计划与任务下发（含教练预设动作库）、任务完成状态双向同步、营养目标追踪（教练可代设目标，学员端环形进度条+滑动条）、教练端会员管理（新增会员、会员卡片、逐会员聊天）、通知中心、三语（日/中/英）切换。

已知未完成、仅为演示/占位的部分：教练端"プラン更新"和"チェックイン確認"仍是占位文字、没有可视化的训练计划编排 UI（计划数据靠迁移脚本预置）、没有逐组数（set-by-set）记录 UI、学员端首页"食事を記録"快捷入口仍只写本地 localStorage、没接真实的 `meal_logs`（营养详情页里的滑动条记录才是接了真实后端的那条路径）、忘记密码流程没有真的发邮件，是直接把重置 token 显示在页面上（开发/演示用途够了，正式上线前需要接邮件服务）。

## 上传 GitHub

解压后，将 coach、member、supabase、docker-compose.yml 和本 README.md 一起上传至仓库。
