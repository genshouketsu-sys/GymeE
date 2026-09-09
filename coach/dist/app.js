const paths={...sharedIcons,trend:'<path d="m2 4 8 8 5-5 7 12M15 19h7v-7"/>',dumbbell:'<rect x="4" y="5" width="4" height="14" rx="1"/><rect x="16" y="5" width="4" height="14" rx="1"/><path d="M8 12h8M2 9v6M22 9v6"/>'};
renderIcons(document);
// Layout is responsive CSS; no viewport scaling is applied.

const panel=document.getElementById('panel'),title=document.getElementById('panel-title'),body=document.getElementById('panel-body');
// The static markup below (今日のセッション / フォローが必要な会員 rows) is only a
// placeholder for this first paint. Clear it immediately rather than leaving
// it clickable with stale data-member/data-alert indexes while loadHome() is
// still in flight -- clicking it before the fetch resolves (or if the API
// never responds) would otherwise throw, since members/alertData start empty.
document.getElementById('sessions-list').innerHTML='<p class="detail-row">読み込み中…</p>';
document.getElementById('alerts-list').innerHTML='';
// DEV ONLY: fixed token for coach 健太, minted against the local dev Postgres
// under supabase/ (see supabase/README.md). Real login (Supabase Auth) isn't
// wired up yet -- swap this for the signed-in user's real session token.
const DEV_JWT='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTEwMSIsImV4cCI6MTgyMDQ1NzY2N30.Cc4g0Irrtqrh8U6mQS8piSiqx-GcWU_uNaunpv_2XpU';
let members=[],alertData=[],checkinsPending=0,memberTotal=0,coachName='';
const alertStyle={declining_trend:['red','trend'],missing_meal_logs:['amber','note'],renewal_due:['blue','users']};
function show(t,html){title.textContent=t;body.innerHTML=html;if(!panel.open)panel.showModal();}function row(a,b){return `<div class="detail-row">${esc(a)}<small>${esc(b)}</small></div>`}function notify(t){panel.close();const el=document.getElementById('toast');el.textContent=t;el.style.display='block';setTimeout(()=>el.style.display='none',2600);}document.getElementById('close').onclick=()=>panel.close();panel.addEventListener('click',e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close();}});
function member(i){const m=members[i];if(!m)return;show(m.name,row('本日のセッション',m.time+' · 60分')+row('トレーニング内容',m.focus)+row('ご利用状況',m.count)+`<button class="primary" data-begin="${i}">セッションを開始</button>`)}
const actions={home:()=>panel.close(),members:()=>show('担当会員',members.map((m,i)=>`<button class="detail-row" style="display:block;width:100%;text-align:left" data-member="${i}">${esc(m.name)}<small>${esc(m.focus)} · ${esc(m.count)}</small></button>`).join('')+'<p>ホームに表示されている会員です。</p>'),sessions:()=>show('今日のセッション',members.map((m,i)=>`<button class="detail-row" style="display:block;width:100%;text-align:left" data-member="${i}">${esc(m.time)}　${esc(m.name)}<small>60分 · ${esc(m.focus)}</small></button>`).join('')+`<p>本日${members.length}件のセッションです。</p>`),notifications:()=>show('フォローが必要な会員',alertData.map((a,i)=>`<button class="detail-row" style="display:block;width:100%;text-align:left" data-alert="${i}">${esc(a.title)}<small>詳細を確認 →</small></button>`).join('')),checkins:()=>show('チェックイン確認',row(checkinsPending+'件のチェックインが確認待ち','会員のチェックイン内容はここに表示されます。')),start:()=>show('セッションを開始',members.map((m,i)=>`<button class="primary" data-begin="${i}">${esc(m.time)}　${esc(m.name)}</button>`).join('')),notes:()=>{show('会員メモ','<label for="memo">この端末にメモを保存</label><textarea id="memo" placeholder="セッションの気づきや、次回の確認事項を入力"></textarea><button class="primary" id="save-note">メモを保存</button>');try{document.getElementById('memo').value=localStorage.getItem('gyme-note')||''}catch{}document.getElementById('save-note').onclick=()=>{try{localStorage.setItem('gyme-note',document.getElementById('memo').value);notify('メモをこの端末に保存しました')}catch{notify('保存できませんでした')}}},renewals:()=>show('プラン更新',row('継続プランのご案内','パーソナルトレーニングが残り3回の会員がいます。')+'<p>更新手続きには会員データとの接続が必要です。</p>'),messages:()=>openChatList(),profile:()=>show('プロフィール',row(coachName,'Gyme トレーナー')+row('担当会員',memberTotal+'名'))};
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]'),m=e.target.closest('[data-member]'),al=e.target.closest('[data-alert]'),begin=e.target.closest('[data-begin]');if(a)actions[a.dataset.action]?.();if(m)member(Number(m.dataset.member));if(al){const d=alertData[Number(al.dataset.alert)];if(!d)return;show(d.title,`<p>${esc(d.detail)}</p>`)}if(begin){const m=members[Number(begin.dataset.begin)];if(!m)return;show('セッション中',row(m.name,m.focus)+row('予定時間','60分')+'<p>この画面内でセッションを開始しました。</p><button class="primary" id="finish">セッションを終了</button>');document.getElementById('finish').onclick=()=>notify('セッションを終了しました')}});

function renderHome(){
  document.getElementById('greeting').textContent=`おはようございます、${coachName}さん`;
  const metrics=document.getElementById('metrics');
  metrics.innerHTML=`<button data-action="members"><span class="value">${memberTotal} <i data-icon="users"></i></span><span>担当会員</span></button><button data-action="sessions"><span class="value">${members.length} <i data-icon="calendar"></i></span><span>本日の<br>セッション</span></button><button data-action="checkins"><span class="value">${checkinsPending} <i data-icon="clock"></i></span><span>チェックイン<br>確認待ち</span></button><button data-action="notifications"><span class="value">${alertData.length} <i data-icon="alert"></i></span><span>フォローが<br>必要な会員</span></button>`;
  renderIcons(metrics);
  const sessionsList=document.getElementById('sessions-list');
  sessionsList.innerHTML=members.length?members.map((m,i)=>`<button class="session" data-member="${i}"><span class="avatar"></span><span class="time"><strong>${esc(m.time)}</strong><small>60分</small></span><span class="session-name"><strong>${esc(m.name)}</strong><small>${esc(m.focus)}</small></span><span class="count">${esc(m.count)}</span><i data-icon="chevron"></i></button>`).join(''):'<p class="detail-row">本日のセッションはありません。</p>';
  renderIcons(sessionsList);
  const alertsList=document.getElementById('alerts-list');
  alertsList.innerHTML=alertData.map((a,i)=>{const[color,icon]=alertStyle[a.type]||['blue','alert'];return `<button data-alert="${i}"><span class="alert-icon ${color}"><i data-icon="${icon}"></i></span><span><strong>${esc(a.title)}</strong><small>${esc(a.short||a.detail)}</small></span><i data-icon="chevron"></i></button>`}).join('');
  renderIcons(alertsList);
}
async function loadHome(){
  try{
    const uid=decodeJwtSub(DEV_JWT),today=tokyoDate(0),tomorrow=tokyoDate(1);
    const [me,sessionsRes,subsRes,notifsRes,rosterRes,unreadMsgsRes]=await Promise.all([
      pg(`/users?select=display_name&id=eq.${uid}`),
      pg(`/sessions?select=id,member_id,scheduled_at,status,member:users!sessions_member_id_fkey(display_name),workout:workouts(training_plans(name))&and=(scheduled_at.gte.${today}T00:00:00%2B09:00,scheduled_at.lt.${tomorrow}T00:00:00%2B09:00)&order=scheduled_at`),
      pg(`/member_subscriptions?select=member_id,sessions_remaining,membership_plans(session_count)&status=eq.active&order=purchased_at.desc`),
      pg(`/notifications?select=id,type,payload&read_at=is.null&order=created_at.desc&limit=20`),
      pg(`/member_profiles?select=user_id`),
      pg(`/messages?select=id&read_at=is.null&sender_id=neq.${uid}`),
    ]);
    coachName=me[0]?.display_name||'';
    memberTotal=rosterRes.length;
    setBadge('messages-badge',unreadMsgsRes.length);
    checkinsPending=sessionsRes.filter(s=>s.status==='checked_in').length;
    const subsByMember={};
    // status=eq.active + purchased_at.desc above means the first row seen per
    // member is their current package; ignore any further (stale) rows for
    // that member instead of letting an arbitrary later row silently win.
    subsRes.forEach(s=>{if(subsByMember[s.member_id])return;const total=s.membership_plans?.session_count??0;const used=total-(s.sessions_remaining??0);subsByMember[s.member_id]=`${used} / ${total}回`});
    members=sessionsRes.map(s=>({
      name:s.member?.display_name||'',
      time:new Date(s.scheduled_at).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Tokyo'}),
      focus:s.workout?.training_plans?.name||'',
      count:subsByMember[s.member_id]||'',
    }));
    alertData=notifsRes.map(n=>({title:n.payload.title,detail:n.payload.detail,type:n.type,short:n.payload.short}));
    setBadge('notifications-badge',alertData.length);
    renderHome();
  }catch(err){
    console.error('loadHome failed',err);
    document.getElementById('greeting').textContent='データを読み込めませんでした';
    document.getElementById('sessions-list').innerHTML='<p class="detail-row">読み込みに失敗しました。</p>';
  }
}
loadHome();

/* -- Chat: list of the coach's members -> thread with one of them.
   Thread-level behavior (load/send/poll/mark-read) is shared.js; this is
   just the list and the list<->thread transition. -- */
let chatRoster=[];
chatOnRead=()=>{const r=chatRoster.find(x=>x.conversationId===chatConversationId);if(r)r.unread=0;refreshMessagesBadge()};
function refreshMessagesBadge(){setBadge('messages-badge',chatRoster.reduce((s,r)=>s+r.unread,0))}
document.getElementById('chat-back').onclick=()=>{stopChatPolling();openChatList()};
document.getElementById('chat-list').addEventListener('click',e=>{
  const btn=e.target.closest('[data-chat-member]');
  if(!btn)return;
  const r=chatRoster[Number(btn.dataset.chatMember)];
  if(r)openChatThread(r);
});
async function openChatList(){
  const chatDialog=document.getElementById('chat'),listEl=document.getElementById('chat-list');
  chatDialog.showModal();
  document.getElementById('chat-back').hidden=true;
  document.getElementById('chat-avatar').hidden=true;
  document.getElementById('chat-subtitle').hidden=true;
  document.getElementById('chat-thread').hidden=true;
  document.getElementById('chat-title').textContent='メッセージ';
  listEl.hidden=false;
  listEl.innerHTML='<p class="chat-list-empty">読み込み中…</p>';
  try{
    const uid=decodeJwtSub(DEV_JWT);
    const [roster,convRes]=await Promise.all([
      pg('/member_profiles?select=user_id,member:users!member_profiles_user_id_fkey(display_name)'),
      pg(`/conversations?select=id,member_id,messages(id,body,sender_id,sent_at,read_at)&coach_id=eq.${uid}`),
    ]);
    const convByMember={};
    convRes.forEach(c=>{convByMember[c.member_id]=c});
    chatRoster=roster.map(r=>{
      const conv=convByMember[r.user_id];
      const msgs=(conv?.messages||[]).slice().sort((a,b)=>a.sent_at<b.sent_at?-1:1);
      const last=msgs[msgs.length-1];
      return {
        memberId:r.user_id,
        name:r.member?.display_name||'',
        conversationId:conv?.id||null,
        lastBody:last?.body||'',
        lastAt:last?.sent_at||null,
        unread:msgs.filter(m=>m.sender_id!==uid&&!m.read_at).length,
      };
    });
    refreshMessagesBadge();
    renderChatList();
  }catch(err){
    console.error('openChatList failed',err);
    listEl.innerHTML='<p class="chat-list-empty">読み込みに失敗しました。</p>';
  }
}
function renderChatList(){
  const listEl=document.getElementById('chat-list');
  if(!chatRoster.length){listEl.innerHTML='<p class="chat-list-empty">担当している会員がいません。</p>';return}
  listEl.innerHTML=chatRoster.map((r,i)=>`<button data-chat-member="${i}"><span class="avatar"></span><span class="chat-list-text"><span class="row1"><strong>${esc(r.name)}</strong>${r.lastAt?`<time>${chatTimeLabel(r.lastAt)}</time>`:''}</span><p>${r.lastBody?esc(r.lastBody):'会話はまだありません'}</p></span>${r.unread?`<span class="chat-unread">${r.unread>9?'9+':r.unread}</span>`:''}</button>`).join('');
}
async function openChatThread(r){
  const chatDialog=document.getElementById('chat'),chatMessagesEl=document.getElementById('chat-messages'),chatFormEl=document.getElementById('chat-form');
  chatMeId=decodeJwtSub(DEV_JWT);
  document.getElementById('chat-list').hidden=true;
  document.getElementById('chat-back').hidden=false;
  document.getElementById('chat-avatar').hidden=false;
  document.getElementById('chat-title').textContent=r.name;
  document.getElementById('chat-thread').hidden=false;
  chatFormEl.hidden=false;
  chatMessagesEl.innerHTML='<p class="chat-messages-empty">読み込み中…</p>';
  try{
    let conversationId=r.conversationId;
    if(!conversationId){
      const [row]=await pgPost('/conversations',{coach_id:chatMeId,member_id:r.memberId});
      conversationId=row.id;
      r.conversationId=conversationId;
    }
    chatConversationId=conversationId;
    await loadChatMessages();
    markChatRead();
    startChatPolling();
  }catch(err){
    console.error('openChatThread failed',err);
    chatMessagesEl.innerHTML='<p class="chat-messages-empty">読み込みに失敗しました。</p>';
  }
}
