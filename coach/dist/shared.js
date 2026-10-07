/* Shared between coach/dist and member/dist — keep both copies byte-identical. */
const sharedIcons={message:'<path d="M5 3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H9l-7 4V6a3 3 0 0 1 3-3Z"/><path d="M7 10h.1M12 10h.1M17 10h.1"/>',bell:'<path d="M5 16c2-2 1-4 2-8a5 5 0 0 1 10 0c1 4 0 6 2 8l1 2H4l1-2ZM10 21q2 2 4 0M12 2V1"/>',users:'<circle cx="9" cy="7" r="4"/><path d="M2 22v-3a7 7 0 0 1 14 0v3ZM17 4a4 4 0 0 1 0 8M19 16q4 1 4 6h-4"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M7 1v6M17 1v6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',alert:'<path d="m12 3 10 18H2L12 3ZM12 9v5M12 17h.1"/>',chevron:'<path d="m9 5 7 7-7 7"/>',chevronLeft:'<path d="m15 5-7 7 7 7"/>',note:'<path d="M16 2H5a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-5-5ZM15 2v6h6M7 12h10M7 17h7M7 7h4"/>',renew:'<path d="M21 9a9 9 0 1 0-1 10M21 3v6h-6"/>',user:'<circle cx="12" cy="6" r="4"/><path d="M4 23v-2a8 8 0 0 1 16 0v2"/>',home:'<path d="m3 10 9-8 9 8v12h-6v-8H9v8H3Z"/>',check:'<rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor"/><path d="m6 12 4 4 8-9" stroke="#151515" stroke-width="2"/>',play:'<circle cx="12" cy="12" r="11"/><path class="play-triangle" d="m10 8 6 4-6 4Z"/>',send:'<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>'};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// Derived from wherever this page was loaded from, not hardcoded to
// 127.0.0.1 -- a phone on the same Wi-Fi loads this page via the host
// machine's LAN IP, and 127.0.0.1 in its own fetch() would resolve to the
// phone itself, not the machine serving the page.
const POSTGREST_URL='http://'+window.location.hostname+':3001';
async function pg(path){const r=await fetch(POSTGREST_URL+path,{headers:{Authorization:'Bearer '+DEV_JWT}});if(!r.ok)throw new Error('API '+r.status+': '+path);return r.json()}
function decodeJwtSub(jwt){try{return JSON.parse(atob(jwt.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub}catch{return null}}
function tokyoDate(offsetDays){const d=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const[y,m,dd]=d.split('-').map(Number);return new Date(Date.UTC(y,m-1,dd+offsetDays)).toISOString().slice(0,10)}
function renderIcons(root){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[el.dataset.icon]||''}</svg>`)}
function setBadge(id,count){const el=document.getElementById(id);if(!el)return;if(count>0){el.hidden=false;el.textContent=count>9?'9+':String(count)}else{el.hidden=true}}

/* -- i18n: three-way 日本語/中文/English switch. The app's actual data
   (member names, exercise names, coach notes) stays whatever language it was
   entered in -- only UI chrome (labels, buttons, empty states) is
   translated. DICT is built here with the strings both apps share (chat,
   notification center, common words); each app.js extends it with its own
   screen-specific strings via the same Object.assign pattern `paths` above
   already uses for icons. */
const DICT={
  ja:{close:'閉じる',back:'戻る',send:'送信',loading:'読み込み中…',loadFailed:'読み込みに失敗しました。',seeAll:'すべて見る',home:'ホーム',messageAria:'メッセージ',notifAria:'通知',langAria:'言語切替',
    chatPlaceholder:'メッセージを入力',chatEmpty:'まだメッセージがありません。<br>最初のメッセージを送ってみましょう。',chatSendFailed:'送信できませんでした · タップして再送信',chatToday:'今日',chatYesterday:'昨日',
    notifEmpty:'通知はありません。',notifMarkAll:'すべて既読にする',
    justNow:'たった今',minutesAgo:'{n}分前',hoursAgo:'{n}時間前',daysAgo:'{n}日前'},
  zh:{close:'关闭',back:'返回',send:'发送',loading:'加载中…',loadFailed:'加载失败。',seeAll:'查看全部',home:'首页',messageAria:'消息',notifAria:'通知',langAria:'切换语言',
    chatPlaceholder:'输入消息',chatEmpty:'还没有消息。<br>发送第一条消息试试吧。',chatSendFailed:'发送失败 · 点击重新发送',chatToday:'今天',chatYesterday:'昨天',
    notifEmpty:'暂无通知。',notifMarkAll:'全部标为已读',
    justNow:'刚刚',minutesAgo:'{n}分钟前',hoursAgo:'{n}小时前',daysAgo:'{n}天前'},
  en:{close:'Close',back:'Back',send:'Send',loading:'Loading…',loadFailed:'Failed to load.',seeAll:'See all',home:'Home',messageAria:'Messages',notifAria:'Notifications',langAria:'Switch language',
    chatPlaceholder:'Type a message',chatEmpty:'No messages yet.<br>Try sending the first one.',chatSendFailed:'Failed to send · Tap to retry',chatToday:'Today',chatYesterday:'Yesterday',
    notifEmpty:'No notifications.',notifMarkAll:'Mark all as read',
    justNow:'Just now',minutesAgo:'{n}m ago',hoursAgo:'{n}h ago',daysAgo:'{n}d ago'},
};
let lang=(function(){try{return localStorage.getItem('gyme-lang')||'ja'}catch{return 'ja'}})();
function t(key,vars){
  let s=DICT[lang]?.[key]??DICT.ja[key]??key;
  if(vars)for(const k in vars)s=s.split('{'+k+'}').join(vars[k]);
  return s;
}
function applyI18n(root){
  root.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=t(el.dataset.i18n)});
  root.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.dataset.i18nPh)});
  root.querySelectorAll('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.i18nAria))});
}
const LANG_ORDER=['ja','zh','en'],LANG_LABEL={ja:'日',zh:'中',en:'EN'};
function cycleLang(){
  lang=LANG_ORDER[(LANG_ORDER.indexOf(lang)+1)%LANG_ORDER.length];
  try{localStorage.setItem('gyme-lang',lang)}catch{}
  const btn=document.getElementById('lang-toggle');
  if(btn){btn.textContent=LANG_LABEL[lang];btn.setAttribute('aria-label',t('langAria'))}
  applyI18n(document);
  // Dialog content already on screen was rendered in the old language and
  // isn't worth re-deriving per dialog type -- closing is simpler and safer
  // than trying to replay whatever action opened it.
  document.getElementById('panel')?.close();
  const chatDialog=document.getElementById('chat');
  if(chatDialog?.open){chatDialog.close();stopChatPolling?.()}
  // renderHome() alone isn't enough: unit-suffixed strings like "18 / 24回"
  // or "4 × 8回" are formatted once in loadHome() (setsReps(), the package
  // usage count) and cached in state, not re-derived at render time -- only
  // a fresh loadHome() re-applies the new language's units to them.
  loadHome?.();
}
// Only wires the toggle button here -- applyI18n(document) itself runs from
// each app.js instead, right after that app extends DICT with its own
// screen-specific strings (mirrors renderIcons(document): shared.js defines
// the mechanism, app.js calls it once its own data is ready).
function initLang(){
  const btn=document.getElementById('lang-toggle');
  if(btn){btn.textContent=LANG_LABEL[lang];btn.setAttribute('aria-label',t('langAria'));btn.addEventListener('click',cycleLang)}
}
initLang();

/* -- Chat: shared between coach (conversation list -> thread) and member --
   (thread only, one coach). Real send/read over PostgREST; no push -- the
   Realtime service isn't running locally (needs Docker), so open threads
   poll every few seconds instead. See supabase/README.md. */
async function pgPost(path,data){const r=await fetch(POSTGREST_URL+path,{method:'POST',headers:{Authorization:'Bearer '+DEV_JWT,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(data)});if(!r.ok)throw new Error('API '+r.status+': '+path);return r.json()}
async function pgPatch(path,data){const r=await fetch(POSTGREST_URL+path,{method:'PATCH',headers:{Authorization:'Bearer '+DEV_JWT,'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error('API '+r.status+': '+path)}
function chatDateLabel(dateStr){const today=tokyoDate(0),yesterday=tokyoDate(-1);if(dateStr===today)return t('chatToday');if(dateStr===yesterday)return t('chatYesterday');const[y,m,d]=dateStr.split('-');return lang==='en'?`${Number(m)}/${Number(d)}`:`${Number(m)}月${Number(d)}日`}
function chatTimeLabel(ts){return new Date(ts).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Tokyo'})}
function renderChatMessages(container,messages,meId){
  const atBottom=container.scrollHeight-container.scrollTop-container.clientHeight<40;
  container.innerHTML='';
  let lastDate='';
  messages.forEach((m,i)=>{
    const date=(m.sent_at||'').slice(0,10);
    if(date!==lastDate){container.insertAdjacentHTML('beforeend',`<div class="msg-date">${chatDateLabel(date)}</div>`);lastDate=date}
    const mine=m.sender_id===meId;
    const next=messages[i+1];
    const lastOfGroup=!next||next.sender_id!==m.sender_id||(next.sent_at||'').slice(0,10)!==date;
    const pending=m.pending?' pending':'',failed=m.failed?' failed':'';
    container.insertAdjacentHTML('beforeend',`<div class="msg ${mine?'me':'them'}${pending}${failed}" data-temp-id="${m.tempId||''}"><div class="msg-bubble">${esc(m.body)}</div>${lastOfGroup?`<div class="msg-time">${m.failed?t('chatSendFailed'):chatTimeLabel(m.sent_at)}</div>`:''}</div>`);
  });
  if(atBottom||messages.some(m=>m.pending))container.scrollTop=container.scrollHeight;
}

/* Thread-level state and behavior: identical for coach and member once a
   conversation is open, so it lives here instead of in both app.js files.
   Each app sets chatMeId/chatConversationId when it opens a thread, and may
   set chatOnRead to update its own badge however makes sense for it. */
let chatMeId=null,chatConversationId=null,chatMessages=[],chatPollTimer=null,chatOnRead=null;
async function loadChatMessages(){
  const el=document.getElementById('chat-messages');
  const rows=await pg(`/messages?select=id,sender_id,body,sent_at,read_at&conversation_id=eq.${chatConversationId}&order=sent_at.asc`);
  chatMessages=rows;
  if(!rows.length){el.innerHTML=`<p class="chat-messages-empty">${t('chatEmpty')}</p>`;return}
  renderChatMessages(el,chatMessages,chatMeId);
}
async function markChatRead(){
  if(!chatConversationId)return;
  if(!chatMessages.some(m=>m.sender_id!==chatMeId&&!m.read_at))return;
  try{await pgPatch(`/messages?conversation_id=eq.${chatConversationId}&sender_id=neq.${chatMeId}&read_at=is.null`,{read_at:new Date().toISOString()});chatOnRead?.()}
  catch(err){console.error('markChatRead failed',err)}
}
function startChatPolling(){
  stopChatPolling();
  chatPollTimer=setInterval(async()=>{
    const dialog=document.getElementById('chat');
    if(!chatConversationId||!dialog.open)return;
    try{
      const rows=await pg(`/messages?select=id,sender_id,body,sent_at,read_at&conversation_id=eq.${chatConversationId}&order=sent_at.asc`);
      const localOnly=chatMessages.filter(m=>m.pending||m.failed);
      chatMessages=[...rows,...localOnly];
      renderChatMessages(document.getElementById('chat-messages'),chatMessages,chatMeId);
      markChatRead();
    }catch(err){console.error('chat poll failed',err)}
  },4000);
}
function stopChatPolling(){if(chatPollTimer){clearInterval(chatPollTimer);chatPollTimer=null}}
async function reallySendChatMessage(optimistic){
  try{
    const [row]=await pgPost('/messages',{conversation_id:chatConversationId,sender_id:chatMeId,body:optimistic.body});
    chatMessages=chatMessages.map(m=>m.tempId===optimistic.tempId?row:m);
  }catch(err){
    console.error('send failed',err);
    chatMessages=chatMessages.map(m=>m.tempId===optimistic.tempId?{...m,pending:false,failed:true}:m);
  }
  renderChatMessages(document.getElementById('chat-messages'),chatMessages,chatMeId);
}
async function sendChatMessage(){
  const textEl=document.getElementById('chat-text');
  const bodyText=textEl.value.trim();
  if(!bodyText||!chatConversationId)return;
  textEl.value='';textEl.style.height='auto';document.getElementById('chat-send').classList.remove('ready');
  const optimistic={id:null,tempId:'t'+Date.now()+Math.random(),sender_id:chatMeId,body:bodyText,sent_at:new Date().toISOString(),pending:true};
  chatMessages=[...chatMessages,optimistic];
  renderChatMessages(document.getElementById('chat-messages'),chatMessages,chatMeId);
  await reallySendChatMessage(optimistic);
}
async function retryChatMessage(m){
  m.pending=true;m.failed=false;
  renderChatMessages(document.getElementById('chat-messages'),chatMessages,chatMeId);
  await reallySendChatMessage(m);
}
function chatWireInput(){
  const chatDialog=document.getElementById('chat'),chatMessagesEl=document.getElementById('chat-messages'),chatTextEl=document.getElementById('chat-text'),chatSendEl=document.getElementById('chat-send'),chatFormEl=document.getElementById('chat-form');
  chatTextEl.addEventListener('input',()=>{chatTextEl.style.height='auto';chatTextEl.style.height=Math.min(chatTextEl.scrollHeight,110)+'px';chatSendEl.classList.toggle('ready',chatTextEl.value.trim().length>0)});
  chatTextEl.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();chatFormEl.requestSubmit()}});
  chatFormEl.addEventListener('submit',e=>{e.preventDefault();sendChatMessage()});
  document.getElementById('chat-close').onclick=()=>{chatDialog.close();stopChatPolling()};
  chatDialog.addEventListener('click',e=>{if(e.target!==chatDialog)return;const r=chatDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){chatDialog.close();stopChatPolling()}});
  chatMessagesEl.addEventListener('click',e=>{const el=e.target.closest('.msg.failed');if(!el)return;const m=chatMessages.find(x=>x.tempId===el.dataset.tempId);if(m)retryChatMessage(m)});
}
chatWireInput();

/* -- Notification center: identical rendering/mark-read logic for both
   apps; each app fetches its own list (coach's are user_id-scoped to the
   coach, member's to the member -- RLS enforces this regardless) and maps
   type -> icon/color with its own small style table. -- */
function relativeTime(iso){
  const diffMin=Math.floor((Date.now()-new Date(iso).getTime())/60000);
  if(diffMin<1)return t('justNow');
  if(diffMin<60)return t('minutesAgo',{n:diffMin});
  const hr=Math.floor(diffMin/60);
  if(hr<24)return t('hoursAgo',{n:hr});
  const day=Math.floor(hr/24);
  if(day<7)return t('daysAgo',{n:day});
  return chatDateLabel(iso.slice(0,10));
}
function renderNotifList(items){
  if(!items.length)return `<p class="notif-empty">${t('notifEmpty')}</p>`;
  const anyUnread=items.some(n=>!n.read_at);
  return (anyUnread?`<button class="notif-mark-all" data-mark-all>${t('notifMarkAll')}</button>`:'')
    +items.map(n=>`<button class="notif-row${n.read_at?' read':''}" data-notif-id="${n.id}"><span class="notif-icon ${n.color}"><i data-icon="${n.icon}"></i></span><span class="notif-text"><strong>${esc(n.title)}</strong><small>${esc(n.short||n.detail)}</small></span><span class="notif-meta">${n.read_at?'':'<span class="notif-unread-dot"></span>'}<time>${relativeTime(n.created_at)}</time></span></button>`).join('');
}
async function markNotificationRead(id){try{await pgPatch(`/notifications?id=eq.${id}`,{read_at:new Date().toISOString()})}catch(err){console.error('markNotificationRead failed',err)}}
async function markAllNotificationsRead(){try{await pgPatch('/notifications?read_at=is.null',{read_at:new Date().toISOString()})}catch(err){console.error('markAllNotificationsRead failed',err)}}
