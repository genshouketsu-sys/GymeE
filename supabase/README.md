# Gyme — Supabase 后端

教练端、学员端目前读的是写死数据的静态 JS，这里是替代它们的真实数据库 schema。设计依据见「Gyme 后端蓝图」架构文档。

## 目录结构

- `migrations/` — Postgres DDL，按域拆成 6 个文件，按文件名顺序依次应用。
- `tests/` — schema 和 RLS（行级安全）策略的自动化测试。不需要 Docker，也不需要真的建一个 Supabase 项目（用 `pglite`，一个跑在本地的 WASM 版 Postgres）。

## 接到真实的 Supabase 项目

1. 在 [supabase.com](https://supabase.com) 建一个项目。
2. 安装 [Supabase CLI](https://supabase.com/docs/guides/cli)，执行 `supabase link --project-ref <your-project-ref>` 关联这个仓库。
3. `supabase db push` —— 按顺序应用 `migrations/` 里的 SQL。
4. 开启 Auth 的邮箱登录，创建第一个教练账号时，在 `raw_user_meta_data` 里带上 `{"role": "coach", "display_name": "健太"}`（`0001_identity_and_tenancy.sql` 里的触发器会读这个字段来设置 `public.users.role`，不带的话默认是 `member`）。

## 跑测试

```
npm install
npm test
```

`npm test` 依次跑两件事：

- `test:schema` —— 全部迁移是否能干净地跑完、每张表是否都开了 RLS、每张表是否至少有一条策略。
- `test:rls` —— 真实插入多个教练/会员的数据，验证"教练只看得到自己名下的会员""会员只看得到自己的数据""进度照片除非会员主动分享否则教练看不到"这类权限矩阵是不是真的生效，而不只是策略写了但没起作用。

改了 `migrations/` 里的 schema，提交前重新跑一遍这两个测试。
