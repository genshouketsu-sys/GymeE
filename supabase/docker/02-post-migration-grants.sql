-- Function-specific grants for 'anon' (the pre-login role) -- these can
-- only run AFTER the migrations above have created the functions in
-- question, unlike 01-auth-and-roles.sql's blanket grants to
-- 'authenticated', which only cover what already existed at that point and
-- are not retroactive either. This list is the exact grant state verified
-- against the project's own local (non-Docker) dev database.
grant execute on function public.login(text, text, public.user_role) to anon;
grant execute on function public.register_member(text, text, text) to anon;
grant execute on function public.request_password_reset(text) to anon;
grant execute on function public.reset_password(text, text) to anon;
grant execute on function public.mint_jwt(uuid) to anon, authenticated;
grant execute on function public.base64url_encode(bytea) to anon, authenticated;
