# Gyme — Supabase 后端

教练端、学员端目前读的是写死数据的静态 JS，这里是替代它们的真实数据库 schema。设计依据见「Gyme 后端蓝图」架构文档。

## 目录结构

- `migrations/` — Postgres DDL，按域拆成 6 个文件，按文件名顺序依次应用。
- `seed.sql` —— 和两端前端现在写死的数据完全对应的示例数据（教练健太、会员田中健/佐藤由紀/王明，以及首页那些具体数字）。接完真实项目后可以直接灌进去，看真实查询出来的界面和现在的静态页面是不是一致。
- `tests/` — schema、RLS（行级安全）策略、以及 seed 数据的自动化测试。不需要 Docker，也不需要真的建一个 Supabase 项目（用 `pglite`，一个跑在本地的 WASM 版 Postgres）。

## 接到真实的 Supabase 项目

1. 在 [supabase.com](https://supabase.com) 建一个项目。
2. 安装 [Supabase CLI](https://supabase.com/docs/guides/cli)，执行 `supabase link --project-ref <your-project-ref>` 关联这个仓库。
3. `supabase db push` —— 按顺序应用 `migrations/` 里的 SQL。
4. 开启 Auth 的邮箱登录，创建第一个教练账号时，在 `raw_user_meta_data` 里带上 `{"role": "coach", "display_name": "健太"}`（`0001_identity_and_tenancy.sql` 里的触发器会读这个字段来设置 `public.users.role`，不带的话默认是 `member`）。
5. 想快速看到和当前静态页面一致的数据，可以在 SQL Editor 里跑一遍 `seed.sql`（里面用的账号没有设密码，登录前需要在 Supabase 后台或用 `supabase auth` 单独设置）。

## 跑测试

```
npm install
npm test
```

`npm test` 依次跑两件事：

- `test:schema` —— 全部迁移是否能干净地跑完、每张表是否都开了 RLS、每张表是否至少有一条策略。
- `test:rls` —— 真实插入多个教练/会员的数据，验证"教练只看得到自己名下的会员""会员只看得到自己的数据""进度照片除非会员主动分享否则教练看不到"这类权限矩阵是不是真的生效，而不只是策略写了但没起作用。
- `test:seed` —— 加载 `seed.sql`，核对里面的数字和当前两端首页写死的数字（18/24回、1,420/2,200 kcal、72.4kg……）是否一致。

改了 `migrations/` 或 `seed.sql`，提交前重新跑一遍 `npm test`。
