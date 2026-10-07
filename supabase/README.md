# Gyme — 后端（Postgres + PostgREST）

真实的后端：Postgres 16 schema、RLS（行级安全）权限策略、JWT 登录/注册/找回密码全部用 SQL 实现，PostgREST 把这套 schema 直接暴露成 REST API。教练端、学员端两个前端已经接上它，不再读写死数据。

没有用真的 Supabase.com 托管项目，也没有用 Supabase 官方 CLI/Docker 镜像——本项目是照着 Supabase 的架构模式（`auth.users` + `public` 业务表 + RLS + PostgREST）手搭的一套等价的本地栈，因为最初开发环境装不了 Docker。现在仓库根目录的 `docker-compose.yml` 把这套手搭栈原样打包成了标准的 `docker compose up` 流程，见根目录 [README.md](../README.md)。

## 目录结构

- `migrations/` — Postgres DDL，共 17 个文件，按文件名顺序（`20260909000001` ... `20260909000017`）依次应用。覆盖：身份与租户、训练计划、执行记录、营养与进度、聊天通知、商业信息、会话时长、消息只读修正、教练读取会员信息、会员自助开始训练、教练布置任务、任务完成状态、会员通知教练、营养目标去重、教练添加会员、登录、注册与找回密码。
- `seed.sql` — 演示数据：教练健太 + 学员田中健/佐藤由紀/王明，34 条覆盖 8 个肌群的动作预设库，以及和两端首页数字对应的会话/任务/营养记录。演示账号密码统一是 `gymedemo2024`。
- `docker/` — Docker 初始化用的脚本：`00-init.sh`（Postgres 官方镜像会自动扫到并执行的唯一入口）、`01-auth-and-roles.sql`（建 `auth` schema、`auth.uid()`、`anon`/`authenticated`/`authenticator` 角色和基础授权）、`02-post-migration-grants.sql`（迁移跑完之后，给 `anon` 角色单独补的几个登录前置 RPC 的执行权限）。这三个文件在"本地手动跑"时也能直接复用（见下）。
- `tests/` — schema、RLS 策略、seed 数据的自动化测试。不需要 Docker，也不需要真的建一个 Postgres/Supabase 项目（用 `pglite`，一个跑在本地的 WASM 版 Postgres）。

## 用 Docker 跑（推荐）

见根目录 [README.md](../README.md)。`docker compose up -d` 会自动完成下面"本地手动跑"里的全部步骤。

## 本地手动跑（不用 Docker）

需要自己装好 Postgres 16 和 [PostgREST](https://postgrest.org/) 的可执行文件。

1. 建一个空库：`createdb gyme`。
2. 建角色和 `auth` schema：
   ```
   psql -d gyme -v authenticator_password=<给authenticator设的密码> -f docker/01-auth-and-roles.sql
   ```
3. 依次跑完全部迁移：
   ```
   for f in migrations/*.sql; do psql -d gyme -v ON_ERROR_STOP=1 -f "$f"; done
   ```
4. 补上登录前置 RPC 的 `anon` 授权：
   ```
   psql -d gyme -f docker/02-post-migration-grants.sql
   ```
5. 灌演示数据：`psql -d gyme -f seed.sql`
6. 写一份 PostgREST 配置（`db-uri` 里的密码要跟第 2 步给 `authenticator` 设的一致）：
   ```
   db-uri = "postgres://authenticator:<密码>@localhost:5432/gyme"
   db-schemas = "public"
   db-anon-role = "anon"
   jwt-secret = "fba503eeb2af307b1443f6b044c00985a2075751afef7c962fdfc5271923446d"
   server-host = "*"
   server-port = 3001
   ```
   `jwt-secret` 必须跟 `migrations/20260909000017_register_and_reset_password.sql` 里 `mint_jwt()` 函数硬编码的密钥完全一致（那个函数直接在 SQL 里手工拼 JWT 并用这个密钥签名，没有走 PostgREST 自己签发登录态那条路）。
7. 启动 `postgrest postgrest.conf`，两端前端（`coach/dist`、`member/dist`）默认会往 `http://<当前页面的 hostname>:3001` 发请求，端口号要跟第 6 步的 `server-port` 一致。

## 跑测试

```
npm install
npm test
```

`npm test` 依次跑三件事：

- `test:schema` —— 全部迁移是否能干净地跑完、每张表是否都开了 RLS、每张表是否至少有一条策略。
- `test:rls` —— 真实插入多个教练/会员的数据，验证"教练只看得到自己名下的会员""会员只看得到自己的数据""进度照片除非会员主动分享否则教练看不到""任务完成状态双向可见"这类权限矩阵是不是真的生效，而不只是策略写了但没起作用。目前 42 条断言。
- `test:seed` —— 加载 `seed.sql`，核对里面的数字和当前两端首页数字是否一致。

改了 `migrations/`、`seed.sql` 或 `docker/` 下任何文件，提交前重新跑一遍 `npm test`。

## 已知的安全加固空间（尚未处理）

PostgreSQL 对函数的 `EXECUTE` 权限默认是发给 `PUBLIC` 的，除非显式 `REVOKE`，本项目目前没有收回。也就是说，各个 RPC 真正的权限边界是函数内部自己的 `auth.uid()` / 角色判断（已验证生效），而不是 GRANT 层面的限制——`coach_add_member`、`start_my_session` 这两个函数就是完全靠着这个默认的 PUBLIC 授权在跑，并没有单独显式 grant 给 `authenticated`。能正常工作，但不是最佳实践；后续如果要收紧，需要挨个函数审计"收回 PUBLIC 权限后该显式 grant 给谁"，本次没有动它，避免在没有 Docker 环境完整验证的情况下引入没测过的破坏性改动。
