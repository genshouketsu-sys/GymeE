const paths={...sharedIcons,trend:'<path d="m2 4 8 8 5-5 7 12M15 19h7v-7"/>',dumbbell:'<rect x="4" y="5" width="4" height="14" rx="1"/><rect x="16" y="5" width="4" height="14" rx="1"/><path d="M8 12h8M2 9v6M22 9v6"/>'};
renderIcons(document);
// Layout is responsive CSS; no viewport scaling is applied.

// Coach-specific UI strings, merged into the DICT shared.js already built
// (chat/notification-center strings) -- same Object.assign pattern member's
// app.js uses. Actual data (member/exercise/plan names, coach notes) is
// never translated here, only UI chrome.
Object.assign(DICT.ja,{greeting:'おはようございます、{name}さん',greetingSubtitle:'今日のジムの状況をチェック',trainingContentTitle:'今日のトレーニング内容',noTrainingContent:'本日のトレーニング内容は登録されていません。',assignedTasksTitle:'割り当てたタスク',startSession:'セッションを開始',assignTaskBtn:'タスクを割り当てる',noTasksYet:'まだタスクはありません。',taskStatusDone:'完了',taskStatusPending:'未完了',memberLabel:'会員',presetLabel:'プリセットから選択（任意）',freeInput:'自由入力',titleLabel:'タイトル',titlePlaceholder:'例: 有酸素運動を追加',contentLabel:'内容',contentPlaceholder:'会員に伝えたい内容を入力',sendTaskBtn:'タスクを送信',taskSentMsg:'{name}さんにタスクを送信しました',taskSendFailedMsg:'送信に失敗しました',membersTitle:'担当会員',homeMembersHint:'ホームに表示されている会員です。',sessionsTitle:'今日のセッション',sessionsCountHint:'本日{n}件のセッションです。',notifTitle:'通知',checkinsTitle:'チェックイン確認',checkinsPendingMsg:'{n}件のチェックインが確認待ち',checkinsHint:'会員のチェックイン内容はここに表示されます。',nutritionTargetsTitle:'栄養目標',pickMemberHint:'目標を設定する会員を選んでください。',caloriesUnit:'カロリー (kcal)',proteinUnit:'たんぱく質 (g)',carbsUnit:'炭水化物 (g)',fatUnit:'脂質 (g)',saveTargetsBtn:'目標を保存',targetsSavedMsg:'{name}さんの栄養目標を保存しました',targetsSaveFailedMsg:'保存に失敗しました',openTargetsBtn:'栄養目標を設定',openChatBtn:'メッセージを送る',renewalsTitle:'プラン更新',renewalsHint1:'継続プランのご案内',renewalsHint2:'パーソナルトレーニングが残り3回の会員がいます。',renewalsHint3:'更新手続きには会員データとの接続が必要です。',profileTitle:'プロフィール',trainerLabel:'Gyme トレーナー',memberCountUnit:'名',sessionInProgressTitle:'セッション中',scheduledTimeLabel:'予定時間',sessionInProgressHint:'この画面内でセッションを開始しました。',finishSessionBtn:'セッションを終了',sessionFinishedMsg:'セッションを終了しました',dataLoadFailed:'データを読み込めませんでした',messagesTitle:'メッセージ',noMembers:'担当している会員がいません。',noConversation:'会話はまだありません',minuteUnit:'分',exerciseCountUnit:'種目',repsUnit:'回',setsUnit:'セット',dayUnit:'日',otherGroup:'その他',todaysSessionsLabel:'本日の<br>セッション',checkinsPendingLabel:'チェックイン<br>確認待ち',followUpLabel:'フォローが<br>必要な会員',noSessionsToday:'本日のセッションはありません。',followUpEmpty:'フォローが必要な会員はいません。',todaysGymTitle:'今日の Gyme',motto:'もっと強く<br>もっと自分らしく<br>もっと輝く毎日へ',quickStartSession:'セッション<br>開始',quickCheckins:'チェックイン<br>確認',quickNutritionTargets:'栄養<br>目標',navMembers:'会員',navSessions:'セッション',addMemberBtn:'会員を追加',addMemberTitle:'会員を追加',emailLabel:'メールアドレス',emailPlaceholder:'member@example.com',nameLabel:'表示名',namePlaceholder:'例: 山田 太郎',addMemberSubmitBtn:'追加する',memberAddedMsg:'{name}さんを追加しました',addMemberFailedMsg:'追加に失敗しました',loginSubtitle:'トレーナー専用ログイン',passwordLabel:'パスワード',loginSubmitBtn:'ログイン',loginFailedMsg:'メールアドレスまたはパスワードが正しくありません。',logoutBtn:'ログアウト',sending:'送信中…'});
Object.assign(DICT.zh,{greeting:'早上好，{name}教练',greetingSubtitle:'查看今天的健身房状况',trainingContentTitle:'今日训练内容',noTrainingContent:'今天还没有安排训练内容。',assignedTasksTitle:'已布置的任务',startSession:'开始训练',assignTaskBtn:'布置任务',noTasksYet:'还没有任务。',taskStatusDone:'已完成',taskStatusPending:'未完成',memberLabel:'会员',presetLabel:'从预设中选择（可选）',freeInput:'自由输入',titleLabel:'标题',titlePlaceholder:'例：增加有氧运动',contentLabel:'内容',contentPlaceholder:'输入想对会员说的内容',sendTaskBtn:'发送任务',taskSentMsg:'已将任务发送给{name}',taskSendFailedMsg:'发送失败',membersTitle:'负责会员',homeMembersHint:'这是首页显示的会员。',sessionsTitle:'今日训练安排',sessionsCountHint:'今天共有{n}节训练。',notifTitle:'通知',checkinsTitle:'签到确认',checkinsPendingMsg:'{n}个签到待确认',checkinsHint:'会员的签到内容会显示在这里。',nutritionTargetsTitle:'营养目标',pickMemberHint:'请选择要设置目标的会员。',caloriesUnit:'卡路里 (kcal)',proteinUnit:'蛋白质 (g)',carbsUnit:'碳水化合物 (g)',fatUnit:'脂肪 (g)',saveTargetsBtn:'保存目标',targetsSavedMsg:'已保存{name}的营养目标',targetsSaveFailedMsg:'保存失败',openTargetsBtn:'设置营养目标',openChatBtn:'发消息',renewalsTitle:'套餐续费',renewalsHint1:'续费方案介绍',renewalsHint2:'有会员的私教课仅剩3次。',renewalsHint3:'续费流程需要连接会员数据。',profileTitle:'个人资料',trainerLabel:'Gyme 教练',memberCountUnit:'名',sessionInProgressTitle:'训练中',scheduledTimeLabel:'预计时长',sessionInProgressHint:'已在此页面内开始训练。',finishSessionBtn:'结束训练',sessionFinishedMsg:'训练已结束',dataLoadFailed:'数据加载失败',messagesTitle:'消息',noMembers:'暂无负责的会员。',noConversation:'还没有聊天记录',minuteUnit:'分钟',exerciseCountUnit:'项',repsUnit:'次',setsUnit:'组',dayUnit:'天',otherGroup:'其他',todaysSessionsLabel:'今日<br>训练',checkinsPendingLabel:'待确认<br>签到',followUpLabel:'需要<br>跟进的会员',noSessionsToday:'今天没有训练安排。',followUpEmpty:'没有需要跟进的会员。',todaysGymTitle:'今日 Gyme',motto:'更强大<br>更做自己<br>迎接更闪耀的每一天',quickStartSession:'开始<br>训练',quickCheckins:'确认<br>签到',quickNutritionTargets:'营养<br>目标',navMembers:'会员',navSessions:'训练',addMemberBtn:'添加会员',addMemberTitle:'添加会员',emailLabel:'邮箱地址',emailPlaceholder:'member@example.com',nameLabel:'姓名',namePlaceholder:'例：山田太郎',addMemberSubmitBtn:'确认添加',memberAddedMsg:'已添加{name}',addMemberFailedMsg:'添加失败',loginSubtitle:'教练专用登录',passwordLabel:'密码',loginSubmitBtn:'登录',loginFailedMsg:'邮箱或密码不正确。',logoutBtn:'退出登录',sending:'发送中…'});
Object.assign(DICT.en,{greeting:'Good morning, {name}',greetingSubtitle:"Check today's gym status",trainingContentTitle:"Today's Training",noTrainingContent:'No training content set for today.',assignedTasksTitle:'Assigned Tasks',startSession:'Start session',assignTaskBtn:'Assign a task',noTasksYet:'No tasks yet.',taskStatusDone:'Done',taskStatusPending:'Pending',memberLabel:'Member',presetLabel:'Choose a preset (optional)',freeInput:'Free text',titleLabel:'Title',titlePlaceholder:'e.g. Add cardio',contentLabel:'Details',contentPlaceholder:'What would you like to tell the member?',sendTaskBtn:'Send task',taskSentMsg:'Task sent to {name}',taskSendFailedMsg:'Failed to send',membersTitle:'My Members',homeMembersHint:'These are the members shown on your home screen.',sessionsTitle:"Today's Sessions",sessionsCountHint:'{n} session(s) today.',notifTitle:'Notifications',checkinsTitle:'Check-ins',checkinsPendingMsg:'{n} check-in(s) pending',checkinsHint:"Members' check-in details will show here.",nutritionTargetsTitle:'Nutrition Targets',pickMemberHint:'Choose a member to set targets for.',caloriesUnit:'Calories (kcal)',proteinUnit:'Protein (g)',carbsUnit:'Carbs (g)',fatUnit:'Fat (g)',saveTargetsBtn:'Save targets',targetsSavedMsg:"Saved {name}'s nutrition targets",targetsSaveFailedMsg:'Failed to save',openTargetsBtn:'Set nutrition targets',openChatBtn:'Message',renewalsTitle:'Plan Renewals',renewalsHint1:'Renewal options',renewalsHint2:'Some members have 3 personal training sessions left.',renewalsHint3:'Renewal requires connecting member data.',profileTitle:'Profile',trainerLabel:'Gyme Trainer',memberCountUnit:' members',sessionInProgressTitle:'Session in Progress',scheduledTimeLabel:'Scheduled time',sessionInProgressHint:'Session started on this screen.',finishSessionBtn:'Finish session',sessionFinishedMsg:'Session finished',dataLoadFailed:'Could not load your data',messagesTitle:'Messages',noMembers:'You have no members yet.',noConversation:'No messages yet',minuteUnit:' min',exerciseCountUnit:' exercises',repsUnit:' reps',setsUnit:' sets',dayUnit:' days',otherGroup:'Other',todaysSessionsLabel:"Today's<br>Sessions",checkinsPendingLabel:'Check-ins<br>Pending',followUpLabel:'Needs<br>Follow-up',noSessionsToday:'No sessions today.',followUpEmpty:'No members need follow-up.',todaysGymTitle:'Gyme Today',motto:'Stronger every day<br>More you than ever<br>Shine a little brighter',quickStartSession:'Start<br>Session',quickCheckins:'Confirm<br>Check-in',quickNutritionTargets:'Nutrition<br>Targets',navMembers:'Members',navSessions:'Sessions',addMemberBtn:'Add a Member',addMemberTitle:'Add a Member',emailLabel:'Email',emailPlaceholder:'member@example.com',nameLabel:'Display name',namePlaceholder:'e.g. Taro Yamada',addMemberSubmitBtn:'Add member',memberAddedMsg:'Added {name}',addMemberFailedMsg:'Failed to add member',loginSubtitle:'Trainer Login',passwordLabel:'Password',loginSubmitBtn:'Log In',loginFailedMsg:'Incorrect email or password.',logoutBtn:'Log Out',sending:'Sending…'});
applyI18n(document);

const panel=document.getElementById('panel'),title=document.getElementById('panel-title'),body=document.getElementById('panel-body');
// The static markup below (今日のセッション / フォローが必要な会員 rows) is only a
// placeholder for this first paint. Clear it immediately rather than leaving
// it clickable with stale data-member/data-alert indexes while loadHome() is
// still in flight -- clicking it before the fetch resolves (or if the API
// never responds) would otherwise throw, since members/alertData start empty.
document.getElementById('sessions-list').innerHTML=`<p class="detail-row">${t('loading')}</p>`;
document.getElementById('alerts-list').innerHTML='';
// Real login: the JWT is minted by public.login() (see migration 0016 --
// there's no separate auth server in this stack, so Postgres itself signs
// it) and persisted here, not hardcoded at build time. `let`, not `const`:
// this gets reassigned the moment a login call succeeds.
const AUTH_KEY='gyme-jwt-coach';
let DEV_JWT=(function(){try{return localStorage.getItem(AUTH_KEY)||sessionStorage.getItem(AUTH_KEY)||''}catch{return ''}})();
function persistAuthToken(token,remember=true){try{if(remember){localStorage.setItem(AUTH_KEY,token);sessionStorage.removeItem(AUTH_KEY)}else{sessionStorage.setItem(AUTH_KEY,token);localStorage.removeItem(AUTH_KEY)}}catch{}}
let members=[],roster=[],alertData=[],checkinsPending=0,memberTotal=0,coachName='',notifItems=[],exerciseLibrary=[];
function setsReps(sets,reps){if(sets==null&&reps==null)return '';if(sets==null)return reps+t('repsUnit');if(reps==null)return sets+t('setsUnit');return `${sets} × ${reps}${t('repsUnit')}`}
// The session list's avatar used to be a static demo sprite photo (a
// per-member crop baked into assets/reference.jpeg for exactly 3 hardcoded
// names) -- the dynamic render dropped the per-member class, so every real
// member ended up showing the same generic crop. That doesn't scale to real
// members anyway, so fall back to a Slack/Notion-style initial + a color
// picked deterministically from the member's id, not a fake shared photo.
const avatarPalette=[['#d4ff00','#12160a'],['#8e9df9','#0d1030'],['#f5bd30','#241900'],['#ed6366','#2b0808']];
function avatarStyle(id){let h=0;for(let i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;const[bg,fg]=avatarPalette[h%avatarPalette.length];return `background:${bg};color:${fg}`}
// A coach's real triage question glancing at this list is "who's actually
// here" -- surface that instead of a decorative always-on green dot.
function sessionStatusClass(status){return status==='checked_in'?'status-checked-in':(status==='cancelled'||status==='no_show')?'status-alert':''}
const alertStyle={declining_trend:['red','trend'],missing_meal_logs:['amber','note'],renewal_due:['blue','users'],task_completed:['blue','check']};
function show(t,html){title.textContent=t;body.innerHTML=html;if(!panel.open)panel.showModal();}function row(a,b){return `<div class="detail-row">${esc(a)}<small>${esc(b)}</small></div>`}function notify(t){panel.close();const el=document.getElementById('toast');el.textContent=t;el.style.display='block';setTimeout(()=>el.style.display='none',2600);}document.getElementById('close').onclick=()=>panel.close();panel.addEventListener('click',e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close();}});
// Takes a member object directly (not an array index): it now serves BOTH
// today's session list (members[]) and the full roster (roster[]), which
// are different-length arrays with different indices, so an index alone is
// no longer enough to identify who was clicked.
let openMemberId=null;
async function openMemberCard(m){
  if(!m)return;
  openMemberId=m.id;
  const hasSession=m.time!=null;
  let sessionSection='';
  if(hasSession){
    const trainingMeta=(m.workoutDuration!=null?m.workoutDuration+t('minuteUnit')+' ・ ':'')+m.exercises.length+t('exerciseCountUnit');
    const exerciseRows=m.exercises.map(([name,sr])=>`<div class="detail-row exercise-row"><i data-icon="dumbbell"></i><span><strong>${esc(name)}</strong>${sr?`<small>${esc(sr)}</small>`:''}</span></div>`).join('');
    const trainingBody=m.exercises.length?`<div class="card panel-group">${row(m.focus,trainingMeta)}${exerciseRows}</div>`:`<p class="detail-row">${t('noTrainingContent')}</p>`;
    sessionSection=`<div class="member-meta"><span><i data-icon="clock"></i>${esc(m.time)} ・ ${m.duration??60}${t('minuteUnit')}</span><span><i data-icon="check"></i>${esc(m.count)}</span></div>`
      +`<div class="section-heading"><h2>${t('trainingContentTitle')}</h2></div>`+trainingBody;
  }else if(m.count){
    sessionSection=`<div class="member-meta"><span><i data-icon="check"></i>${esc(m.count)}</span></div>`;
  }
  show(m.name,
    sessionSection
    +`<div class="section-heading"><h2>${t('assignedTasksTitle')}</h2></div><div class="card panel-group" id="task-list"><p class="detail-row">${t('loading')}</p></div>`
    +(hasSession?`<button class="primary" id="begin-session-btn">${t('startSession')}</button>`:'')
    +`<button class="primary" id="assign-task-btn">${t('assignTaskBtn')}</button>`
    +`<button class="primary" id="open-targets-btn">${t('openTargetsBtn')}</button>`
    +`<button class="primary" id="open-chat-btn">${t('openChatBtn')}</button>`
  );
  renderIcons(body);
  if(hasSession){
    document.getElementById('begin-session-btn').onclick=()=>{
      show(t('sessionInProgressTitle'),row(m.name,m.focus)+row(t('scheduledTimeLabel'),(m.duration??60)+t('minuteUnit'))+`<p>${t('sessionInProgressHint')}</p><button class="primary" id="finish">${t('finishSessionBtn')}</button>`);
      document.getElementById('finish').onclick=()=>notify(t('sessionFinishedMsg'));
    };
  }
  document.getElementById('assign-task-btn').onclick=()=>assignTask(m);
  document.getElementById('open-targets-btn').onclick=()=>setNutritionTargets(m);
  document.getElementById('open-chat-btn').onclick=()=>openMemberChat(m);
  try{
    const rows=await pg(`/notifications?select=payload,completed_at,created_at&type=eq.coach_task&user_id=eq.${m.id}&order=created_at.desc&limit=10`);
    if(openMemberId!==m.id)return; // the coach already moved on to a different member's card
    const list=document.getElementById('task-list');
    if(!list)return;
    list.innerHTML=rows.length?rows.map(t2=>`<div class="detail-row task-row"><div class="task-row-head"><strong>${esc(t2.payload.title)}</strong><span class="pill ${t2.completed_at?'pill-done':'pill-pending'}">${t2.completed_at?t('taskStatusDone'):t('taskStatusPending')}</span></div><small>${relativeTime(t2.created_at)}</small></div>`).join(''):`<p class="detail-row">${t('noTasksYet')}</p>`;
  }catch(err){
    console.error('load member tasks failed',err);
    if(openMemberId!==m.id)return;
    const list=document.getElementById('task-list');
    if(list)list.innerHTML=`<p class="detail-row">${t('loadFailed')}</p>`;
  }
}
// Reuses the existing chat-list fetch rather than duplicating it just to
// jump straight to one thread -- the roster/conversation data is the same
// either way, this just auto-selects one entry instead of waiting for a tap.
async function openMemberChat(m){
  panel.close();
  await openChatList();
  const r=chatRoster.find(x=>x.memberId===m.id);
  if(r)openChatThread(r);
}
// A coach has no direct insert grant on auth.users/public.users (see
// migration 0015) -- this calls the SECURITY DEFINER RPC that does the
// actual onboarding (new auth user, member_profiles link) server-side.
function openAddMemberForm(){
  show(t('addMemberTitle'),
    `<label for="new-member-email">${t('emailLabel')}</label><input type="email" id="new-member-email" placeholder="${t('emailPlaceholder')}">`
    +`<label for="new-member-name">${t('nameLabel')}</label><input type="text" id="new-member-name" placeholder="${t('namePlaceholder')}">`
    +`<button class="primary" id="submit-add-member">${t('addMemberSubmitBtn')}</button>`
  );
  document.getElementById('submit-add-member').onclick=async()=>{
    const emailEl=document.getElementById('new-member-email'),nameEl=document.getElementById('new-member-name');
    const email=emailEl.value.trim(),name=nameEl.value.trim();
    if(!email){emailEl.focus();return}
    const btn=document.getElementById('submit-add-member');btn.disabled=true;btn.textContent=t('sending');
    try{
      const row=await pgPost('/rpc/coach_add_member',{p_email:email,p_display_name:name});
      await loadHome();
      notify(t('memberAddedMsg',{name:row.display_name||email}));
    }catch(err){
      console.error('add member failed',err);
      btn.disabled=false;btn.textContent=t('addMemberSubmitBtn');
      notify(t('addMemberFailedMsg'));
    }
  };
}
// The RETURNING PostgREST would normally ask for (Prefer: return=representation,
// what pgPost sends) can't be satisfied here: a coach may INSERT a notification
// for their own member (see migration 0011), but only the member can SELECT it
// back -- RETURNING re-reads the new row under the table's SELECT policy, so it
// would 42501 even though the insert itself is allowed. Post with
// Prefer: return=minimal instead, which needs no readback.
async function postNotification(userId,type,payload){
  const r=await fetch(POSTGREST_URL+'/notifications',{method:'POST',headers:{Authorization:'Bearer '+DEV_JWT,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({user_id:userId,type,payload})});
  if(!r.ok)throw new Error('API '+r.status+': /notifications');
}
// Presets are the existing exercise library (the same data trainingContent
// already draws from), grouped by muscle group -- picking one just fills in
// the title, so the coach can still edit it or ignore the list and type
// their own from scratch.
function presetOptions(){
  const groups={};
  exerciseLibrary.forEach(ex=>{const g=ex.muscle_group||t('otherGroup');(groups[g]=groups[g]||[]).push(ex.name)});
  return `<option value="">${t('freeInput')}</option>`+Object.entries(groups).map(([g,names])=>`<optgroup label="${esc(g)}">${names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('')}</optgroup>`).join('');
}
function assignTask(m){
  if(!m)return;
  show(t('assignTaskBtn'),row(t('memberLabel'),m.name)+`<label for="task-preset">${t('presetLabel')}</label><select id="task-preset">${presetOptions()}</select><label for="task-title">${t('titleLabel')}</label><input id="task-title" type="text" maxlength="60" placeholder="${t('titlePlaceholder')}"><label for="task-detail">${t('contentLabel')}</label><textarea id="task-detail" placeholder="${t('contentPlaceholder')}"></textarea><button class="primary" id="send-task">${t('sendTaskBtn')}</button>`);
  document.getElementById('task-preset').onchange=e=>{if(e.target.value)document.getElementById('task-title').value=e.target.value};
  document.getElementById('send-task').onclick=async()=>{
    const titleEl=document.getElementById('task-title'),detailEl=document.getElementById('task-detail'),title=titleEl.value.trim(),detail=detailEl.value.trim();
    if(!title){titleEl.focus();return}
    const btn=document.getElementById('send-task');btn.disabled=true;btn.textContent=t('sending');
    try{
      await postNotification(m.id,'coach_task',{title,detail});
      notify(t('taskSentMsg',{name:m.name}));
    }catch(err){
      console.error('assign task failed',err);
      btn.disabled=false;btn.textContent=t('sendTaskBtn');
      notify(t('taskSendFailedMsg'));
    }
  };
}
// The ring/slider the member sees is already wired to nutrition_targets --
// members only have read access to it (RLS: "coach reads/sets targets for
// their members" is coach-only), so this is the missing other half: the
// actual place a coach sets it, rather than just the read path existing
// with nothing to write it.
async function setNutritionTargets(m){
  if(!m)return;
  const today=tokyoDate(0);
  show(t('nutritionTargetsTitle'),row(t('memberLabel'),m.name)+`<p class="detail-row">${t('loading')}</p>`);
  let existing=null;
  try{
    // Most-recent-so-far, same as the member's own ring query -- not
    // exact-match-on-today. A member usually has no row dated today yet
    // (the coach doesn't re-set targets daily), so prefilling from "today
    // only" would show blank/default values instead of what's actually in
    // effect, and saving would silently reset every untouched field to that
    // default instead of carrying it forward.
    const rows=await pg(`/nutrition_targets?select=calories,protein_g,carbs_g,fat_g&member_id=eq.${m.id}&order=effective_date.desc&limit=1`);
    existing=rows[0]||null;
  }catch(err){console.error('load nutrition targets failed',err)}
  show(t('nutritionTargetsTitle'),row(t('memberLabel'),m.name)
    +`<label for="target-calories">${t('caloriesUnit')}</label><input type="number" id="target-calories" min="0" value="${existing?.calories??2000}">`
    +`<label for="target-protein">${t('proteinUnit')}</label><input type="number" id="target-protein" min="0" value="${existing?.protein_g??150}">`
    +`<label for="target-carbs">${t('carbsUnit')}</label><input type="number" id="target-carbs" min="0" value="${existing?.carbs_g??250}">`
    +`<label for="target-fat">${t('fatUnit')}</label><input type="number" id="target-fat" min="0" value="${existing?.fat_g??60}">`
    +`<button class="primary" id="save-targets">${t('saveTargetsBtn')}</button>`);
  document.getElementById('save-targets').onclick=async()=>{
    const data={
      calories:Number(document.getElementById('target-calories').value)||0,
      protein_g:Number(document.getElementById('target-protein').value)||0,
      carbs_g:Number(document.getElementById('target-carbs').value)||0,
      fat_g:Number(document.getElementById('target-fat').value)||0,
    };
    const btn=document.getElementById('save-targets');btn.disabled=true;btn.textContent=t('sending');
    try{
      // Upsert on the unique (member_id, effective_date) pair instead of a
      // separate select-then-patch-or-post: atomic, and can't race with
      // itself into a duplicate row the way the two-step version could.
      const r=await fetch(POSTGREST_URL+'/nutrition_targets?on_conflict=member_id,effective_date',{method:'POST',headers:{Authorization:'Bearer '+DEV_JWT,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({member_id:m.id,effective_date:today,...data})});
      if(!r.ok)throw new Error('API '+r.status+': /nutrition_targets');
      notify(t('targetsSavedMsg',{name:m.name}));
    }catch(err){
      console.error('save nutrition targets failed',err);
      btn.disabled=false;btn.textContent=t('saveTargetsBtn');
      notify(t('targetsSaveFailedMsg'));
    }
  };
}
const actions={home:()=>panel.close(),members:()=>{show(t('membersTitle'),`<button class="primary" id="open-add-member-btn">${t('addMemberBtn')}</button>`+roster.map((m,i)=>`<button class="detail-row" style="display:block;width:100%;text-align:left" data-roster="${i}">${esc(m.name)}<small>${m.time?esc(m.time)+' ・ ':''}${esc(m.focus||'')}${m.focus&&m.count?' · ':''}${esc(m.count||'')}</small></button>`).join('')+`<p>${t('homeMembersHint')}</p>`);document.getElementById('open-add-member-btn').onclick=()=>openAddMemberForm();},sessions:()=>show(t('sessionsTitle'),members.map((m,i)=>`<button class="detail-row" style="display:block;width:100%;text-align:left" data-member="${i}">${esc(m.time)}　${esc(m.name)}<small>${m.duration??60}${t('minuteUnit')} · ${esc(m.focus)}</small></button>`).join('')+`<p>${t('sessionsCountHint',{n:members.length})}</p>`),notifications:async()=>{show(t('notifTitle'),`<p class="notif-empty">${t('loading')}</p>`);try{const uid=decodeJwtSub(DEV_JWT);const rows=await pg(`/notifications?select=id,type,payload,created_at,read_at&user_id=eq.${uid}&order=created_at.desc&limit=50`);notifItems=rows.map(n=>{const[color,icon]=alertStyle[n.type]||['blue','alert'];return{id:n.id,title:n.payload.title,detail:n.payload.detail,short:n.payload.short,created_at:n.created_at,read_at:n.read_at,color,icon}});body.innerHTML=renderNotifList(notifItems);renderIcons(body)}catch(err){console.error('load notifications failed',err);body.innerHTML=`<p class="notif-empty">${t('loadFailed')}</p>`}},checkins:()=>show(t('checkinsTitle'),row(t('checkinsPendingMsg',{n:checkinsPending}),t('checkinsHint'))),start:()=>show(t('startSession'),members.map((m,i)=>`<button class="primary" data-begin="${i}">${esc(m.time)}　${esc(m.name)}</button>`).join('')),notes:()=>show(t('nutritionTargetsTitle'),roster.map((m,i)=>`<button class="primary" data-target-member="${i}">${esc(m.name)}</button>`).join('')+`<p>${t('pickMemberHint')}</p>`),renewals:()=>show(t('renewalsTitle'),row(t('renewalsHint1'),t('renewalsHint2'))+`<p>${t('renewalsHint3')}</p>`),messages:()=>openChatList(),profile:()=>{show(t('profileTitle'),row(coachName,t('trainerLabel'))+row(t('membersTitle'),memberTotal+t('memberCountUnit'))+`<button class="primary" id="logout-btn">${t('logoutBtn')}</button>`);document.getElementById('logout-btn').onclick=logout;}};
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]'),m=e.target.closest('[data-member]'),rst=e.target.closest('[data-roster]'),al=e.target.closest('[data-alert]'),begin=e.target.closest('[data-begin]'),targetMember=e.target.closest('[data-target-member]');if(a)actions[a.dataset.action]?.();if(m)openMemberCard(members[Number(m.dataset.member)]);if(rst)openMemberCard(roster[Number(rst.dataset.roster)]);if(targetMember)setNutritionTargets(roster[Number(targetMember.dataset.targetMember)]);if(al){const d=alertData[Number(al.dataset.alert)];if(!d)return;markNotificationRead(d.id);alertData=alertData.filter(x=>x.id!==d.id);renderHome();setBadge('notifications-badge',alertData.length);show(d.title,`<p>${esc(d.detail)}</p>`)}if(begin){const m=members[Number(begin.dataset.begin)];if(!m)return;show(t('sessionInProgressTitle'),row(m.name,m.focus)+row(t('scheduledTimeLabel'),(m.duration??60)+t('minuteUnit'))+`<p>${t('sessionInProgressHint')}</p><button class="primary" id="finish">${t('finishSessionBtn')}</button>`);document.getElementById('finish').onclick=()=>notify(t('sessionFinishedMsg'))}});
body.addEventListener('click',e=>{
  if(e.target.closest('[data-mark-all]')){
    markAllNotificationsRead(); // fire-and-forget: UI below is optimistic, not waiting on the round trip
    const now=new Date().toISOString();
    notifItems=notifItems.map(n=>({...n,read_at:n.read_at||now}));
    body.innerHTML=renderNotifList(notifItems);renderIcons(body);
    alertData=[];renderHome();
    setBadge('notifications-badge',0); // computed locally, not re-fetched: a refetch right after an un-awaited PATCH can race and read the pre-update count
    return;
  }
  const rowBtn=e.target.closest('[data-notif-id]');
  if(rowBtn){
    const n=notifItems.find(x=>x.id===rowBtn.dataset.notifId);
    if(!n)return;
    if(!n.read_at){
      n.read_at=new Date().toISOString();
      markNotificationRead(n.id);
      alertData=alertData.filter(a=>a.id!==n.id);
      renderHome();
      setBadge('notifications-badge',notifItems.filter(x=>!x.read_at).length);
    }
    show(n.title,`<p>${esc(n.detail)}</p>`);
  }
});

function renderHome(){
  document.getElementById('greeting').textContent=t('greeting',{name:coachName});
  const metrics=document.getElementById('metrics');
  metrics.innerHTML=`<button data-action="members"><span class="value">${memberTotal} <i data-icon="users"></i></span><span>${t('membersTitle')}</span></button><button data-action="sessions"><span class="value">${members.length} <i data-icon="calendar"></i></span><span>${t('todaysSessionsLabel')}</span></button><button data-action="checkins"><span class="value">${checkinsPending} <i data-icon="clock"></i></span><span>${t('checkinsPendingLabel')}</span></button><button data-action="notifications"><span class="value">${alertData.length} <i data-icon="alert"></i></span><span>${t('followUpLabel')}</span></button>`;
  renderIcons(metrics);
  const sessionsList=document.getElementById('sessions-list');
  sessionsList.innerHTML=members.length?members.map((m,i)=>`<button class="session" data-member="${i}"><span class="avatar ${sessionStatusClass(m.status)}" style="${avatarStyle(m.id)}">${esc(m.name.charAt(0))}</span><span class="time"><strong>${esc(m.time)}</strong><small>${m.duration??60}${t('minuteUnit')}</small></span><span class="session-name"><strong>${esc(m.name)}</strong><small>${esc(m.focus)}</small></span><span class="count">${esc(m.count)}</span><i data-icon="chevron"></i></button>`).join(''):`<p class="detail-row">${t('noSessionsToday')}</p>`;
  renderIcons(sessionsList);
  const alertsList=document.getElementById('alerts-list');
  alertsList.innerHTML=alertData.length?alertData.map((a,i)=>{const[color,icon]=alertStyle[a.type]||['blue','alert'];return `<button data-alert="${i}"><span class="alert-icon ${color}"><i data-icon="${icon}"></i></span><span><strong>${esc(a.title)}</strong><small>${esc(a.short||a.detail)}</small></span><i data-icon="chevron"></i></button>`}).join(''):`<p class="detail-row">${t('followUpEmpty')}</p>`;
  renderIcons(alertsList);
}
async function loadHome(){
  try{
    const uid=decodeJwtSub(DEV_JWT),today=tokyoDate(0),tomorrow=tokyoDate(1);
    const [me,sessionsRes,subsRes,notifsRes,rosterRes,unreadMsgsRes,exercisesRes]=await Promise.all([
      pg(`/users?select=display_name&id=eq.${uid}`),
      pg(`/sessions?select=id,member_id,scheduled_at,status,duration_min,member:users!sessions_member_id_fkey(display_name),workout:workouts(duration_min,training_plans(name),workout_exercises(order_index,target_sets,target_reps,exercises(name)))&and=(scheduled_at.gte.${today}T00:00:00%2B09:00,scheduled_at.lt.${tomorrow}T00:00:00%2B09:00)&order=scheduled_at`),
      pg(`/member_subscriptions?select=member_id,sessions_remaining,membership_plans(session_count)&status=eq.active&order=purchased_at.desc`),
      pg(`/notifications?select=id,type,payload&read_at=is.null&user_id=eq.${uid}&order=created_at.desc&limit=20`),
      pg(`/member_profiles?select=user_id,member:users!member_profiles_user_id_fkey(display_name)`),
      pg(`/messages?select=id&read_at=is.null&sender_id=neq.${uid}`),
      pg('/exercises?select=name,muscle_group&order=muscle_group,name'),
    ]);
    exerciseLibrary=exercisesRes;
    coachName=me[0]?.display_name||'';
    memberTotal=rosterRes.length;
    setBadge('messages-badge',unreadMsgsRes.length);
    checkinsPending=sessionsRes.filter(s=>s.status==='checked_in').length;
    const subsByMember={};
    // status=eq.active + purchased_at.desc above means the first row seen per
    // member is their current package; ignore any further (stale) rows for
    // that member instead of letting an arbitrary later row silently win.
    subsRes.forEach(s=>{if(subsByMember[s.member_id])return;const total=s.membership_plans?.session_count??0;const used=total-(s.sessions_remaining??0);subsByMember[s.member_id]=`${used} / ${total}${t('repsUnit')}`});
    members=sessionsRes.map(s=>({
      id:s.member_id,
      name:s.member?.display_name||'',
      status:s.status,
      time:new Date(s.scheduled_at).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Tokyo'}),
      duration:s.duration_min,
      focus:s.workout?.training_plans?.name||'',
      workoutDuration:s.workout?.duration_min??null,
      exercises:(s.workout?.workout_exercises||[]).slice().sort((a,b)=>a.order_index-b.order_index).map(we=>[we.exercises?.name||'',setsReps(we.target_sets,we.target_reps)]),
      count:subsByMember[s.member_id]||'',
    }));
    // The full roster, not just members[] (today's scheduled sessions) --
    // "担当会員" is supposed to be every member the coach manages, and a
    // member with no session today was previously just missing from that
    // list entirely even though the tile's own count included them.
    // Today's session fields carry over for whoever also has one.
    const membersById={};
    members.forEach(m=>{membersById[m.id]=m});
    roster=rosterRes.map(r=>membersById[r.user_id]||{
      id:r.user_id,name:r.member?.display_name||'',status:null,time:null,duration:null,
      focus:'',workoutDuration:null,exercises:[],count:subsByMember[r.user_id]||'',
    });
    alertData=notifsRes.map(n=>({id:n.id,title:n.payload.title,detail:n.payload.detail,type:n.type,short:n.payload.short}));
    setBadge('notifications-badge',alertData.length);
    renderHome();
  }catch(err){
    console.error('loadHome failed',err);
    document.getElementById('greeting').textContent=t('dataLoadFailed');
    document.getElementById('sessions-list').innerHTML=`<p class="detail-row">${t('loadFailed')}</p>`;
  }
}
// The badges only reflected whatever was true at page-load: sit on the home
// screen and a new message/notification arrives, and the icon stays wrong
// until a manual reload -- the chat thread already polls while open, the
// home screen never did. Poll just the two counts (cheap, 2 small queries)
// rather than the whole home screen, so this can't fight with in-progress
// interaction on the sessions/alerts lists.
async function refreshBadges(){
  // Deliberately no document.hidden skip: the whole point of a badge is to
  // reflect activity that happened while this tab wasn't the focused one,
  // so it has to keep polling in the background to be correct the moment
  // you switch back -- confirmed by testing with the coach tab backgrounded
  // while a message arrived, which an earlier `if(document.hidden)return`
  // here silently and incorrectly suppressed.
  try{
    const uid=decodeJwtSub(DEV_JWT);
    const [unreadMsgsRes,notifsRes]=await Promise.all([
      pg(`/messages?select=id&read_at=is.null&sender_id=neq.${uid}`),
      pg(`/notifications?select=id&read_at=is.null&user_id=eq.${uid}&limit=20`),
    ]);
    setBadge('messages-badge',unreadMsgsRes.length);
    setBadge('notifications-badge',notifsRes.length);
  }catch(err){console.error('refreshBadges failed',err)}
}
// Nothing that touches the API (loadHome, the badge poll) runs until we
// actually have a token -- doing it unconditionally would just be a wall of
// 401s firing behind the login screen.
function initApp(){
  document.getElementById('login-screen').hidden=true;
  document.querySelector('.device-wrap').hidden=false;
  loadHome();
  setInterval(refreshBadges,5000);
}
async function doLogin(){
  const emailEl=document.getElementById('login-email'),passwordEl=document.getElementById('login-password'),errEl=document.getElementById('login-error');
  const email=emailEl.value.trim(),password=passwordEl.value;
  const emailError=document.getElementById('email-error'),passwordError=document.getElementById('password-error');
  errEl.hidden=true;
  const emailMessage=!email?'メールアドレスを入力してください':emailEl.validity.typeMismatch?'有効なメールアドレスを入力してください':'';
  emailError.textContent=emailMessage;emailError.hidden=!emailMessage;emailEl.setAttribute('aria-invalid',String(Boolean(emailMessage)));
  passwordError.hidden=Boolean(password);passwordEl.setAttribute('aria-invalid',String(!password));
  if(emailMessage||!password){(emailMessage?emailEl:passwordEl).focus();return}
  const btn=document.getElementById('login-submit');if(btn.disabled)return;btn.disabled=true;btn.setAttribute('aria-busy','true');btn.querySelector('.submit-label').textContent=t('sending');btn.querySelector('.submit-arrow').hidden=true;
  try{
    const r=await fetch(POSTGREST_URL+'/rpc/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_email:email,p_password:password,p_required_role:'coach'})});
    if(!r.ok)throw new Error('API '+r.status+': /rpc/login');
    DEV_JWT=await r.json();
    persistAuthToken(DEV_JWT,document.getElementById('remember-login').checked);
    initApp();
  }catch(err){
    console.error('login failed',err);
    errEl.textContent=t('loginFailedMsg');
    errEl.hidden=false;
    passwordEl.focus();
  }finally{
    btn.disabled=false;btn.removeAttribute('aria-busy');btn.querySelector('.submit-label').textContent=t('loginSubmitBtn');btn.querySelector('.submit-arrow').hidden=false;
  }
}
const coachLoginCard=document.querySelector('.login-card');
const coachLoginMarkup=coachLoginCard.innerHTML;
let pendingCoachResetToken=null;
async function coachAuthRequest(path,data){const r=await fetch(POSTGREST_URL+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error('API '+r.status+': '+path);return r.json()}
function bindCoachLogin(){
  document.getElementById('login-form').addEventListener('submit',event=>{event.preventDefault();doLogin()});
  document.getElementById('toggle-password').addEventListener('click',event=>{const button=event.currentTarget,input=document.getElementById('login-password'),show=input.type==='password';input.type=show?'text':'password';button.setAttribute('aria-pressed',String(show));button.setAttribute('aria-label',show?'パスワードを隠す':'パスワードを表示');input.focus()});
  for(const id of ['login-email','login-password'])document.getElementById(id).addEventListener('input',()=>{const input=document.getElementById(id),error=document.getElementById(id==='login-email'?'email-error':'password-error');if(input.value){error.hidden=true;input.removeAttribute('aria-invalid')}document.getElementById('login-error').hidden=true});
  document.getElementById('show-forgot').addEventListener('click',()=>renderCoachAuth('forgot'));
}
function renderCoachAuth(mode){
  if(mode==='login'){coachLoginCard.innerHTML=coachLoginMarkup;bindCoachLogin();return}
  if(mode==='forgot'){
    coachLoginCard.innerHTML=`<div class="auth-logo"><span class="brand-mark">G</span><span>YME</span></div><p class="auth-eyebrow">TRAINER ACCESS</p><h1>パスワードを再設定</h1><p class="login-subtitle">登録したメールアドレスを入力してください。</p><form class="auth-form" id="forgot-form" novalidate><div class="field-group"><label for="forgot-email">メールアドレス</label><input type="email" id="forgot-email" autocomplete="username" inputmode="email" placeholder="example@gyme.jp" required><p class="field-error" id="email-error" hidden>メールアドレスを入力してください</p></div><p class="login-error" id="login-error" role="alert" hidden></p><button class="primary login-submit" id="forgot-submit" type="submit"><span class="spinner" aria-hidden="true"></span><span class="submit-label">再設定へ進む</span></button></form><div class="login-links"><button class="link-btn" type="button" id="back-to-login">ログインに戻る</button></div>`;
    document.getElementById('forgot-form').addEventListener('submit',requestCoachReset);
  }else{
    coachLoginCard.innerHTML=`<div class="auth-logo"><span class="brand-mark">G</span><span>YME</span></div><p class="auth-eyebrow">TRAINER ACCESS</p><h1>新しいパスワード</h1><p class="login-subtitle">新しいパスワードを設定してください。</p><form class="auth-form" id="reset-form" novalidate><div class="field-group"><label for="reset-password">新しいパスワード</label><input type="password" id="reset-password" autocomplete="new-password" placeholder="6文字以上" required><p class="field-error" id="password-error" hidden>パスワードは6文字以上で入力してください</p></div><p class="login-error" id="login-error" role="alert" hidden></p><button class="primary login-submit" id="reset-submit" type="submit"><span class="spinner" aria-hidden="true"></span><span class="submit-label">パスワードを更新</span></button></form>`;
    document.getElementById('reset-form').addEventListener('submit',submitCoachReset);
  }
  document.getElementById('back-to-login')?.addEventListener('click',()=>renderCoachAuth('login'));
}
async function requestCoachReset(event){
  event.preventDefault();const emailEl=document.getElementById('forgot-email'),emailError=document.getElementById('email-error'),errEl=document.getElementById('login-error'),email=emailEl.value.trim();
  const message=!email?'メールアドレスを入力してください':emailEl.validity.typeMismatch?'有効なメールアドレスを入力してください':'';emailError.textContent=message;emailError.hidden=!message;emailEl.setAttribute('aria-invalid',String(Boolean(message)));errEl.hidden=true;if(message){emailEl.focus();return}
  const btn=document.getElementById('forgot-submit');btn.disabled=true;btn.setAttribute('aria-busy','true');btn.querySelector('.submit-label').textContent=t('sending');
  try{pendingCoachResetToken=await coachAuthRequest('/rpc/request_password_reset',{p_email:email});renderCoachAuth('reset')}
  catch(err){console.error('request reset failed',err);errEl.textContent='このメールアドレスのアカウントを確認できませんでした。';errEl.hidden=false;emailEl.focus();btn.disabled=false;btn.removeAttribute('aria-busy');btn.querySelector('.submit-label').textContent='再設定へ進む'}
}
async function submitCoachReset(event){
  event.preventDefault();const passwordEl=document.getElementById('reset-password'),passwordError=document.getElementById('password-error'),errEl=document.getElementById('login-error'),password=passwordEl.value;passwordError.hidden=password.length>=6;passwordEl.setAttribute('aria-invalid',String(password.length<6));errEl.hidden=true;if(password.length<6){passwordEl.focus();return}
  const btn=document.getElementById('reset-submit');btn.disabled=true;btn.setAttribute('aria-busy','true');btn.querySelector('.submit-label').textContent=t('sending');
  try{DEV_JWT=await coachAuthRequest('/rpc/reset_password',{p_token:pendingCoachResetToken,p_new_password:password});persistAuthToken(DEV_JWT,true);initApp()}
  catch(err){console.error('reset password failed',err);errEl.textContent='パスワードを更新できませんでした。もう一度お試しください。';errEl.hidden=false;passwordEl.focus();btn.disabled=false;btn.removeAttribute('aria-busy');btn.querySelector('.submit-label').textContent='パスワードを更新'}
}
bindCoachLogin();
function logout(){
  try{localStorage.removeItem(AUTH_KEY);sessionStorage.removeItem(AUTH_KEY)}catch{}
  location.reload();
}
if(DEV_JWT)initApp();

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
  document.getElementById('chat-title').textContent=t('messagesTitle');
  listEl.hidden=false;
  listEl.innerHTML=`<p class="chat-list-empty">${t('loading')}</p>`;
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
    listEl.innerHTML=`<p class="chat-list-empty">${t('loadFailed')}</p>`;
  }
}
function renderChatList(){
  const listEl=document.getElementById('chat-list');
  if(!chatRoster.length){listEl.innerHTML=`<p class="chat-list-empty">${t('noMembers')}</p>`;return}
  listEl.innerHTML=chatRoster.map((r,i)=>`<button data-chat-member="${i}"><span class="avatar"></span><span class="chat-list-text"><span class="row1"><strong>${esc(r.name)}</strong>${r.lastAt?`<time>${chatTimeLabel(r.lastAt)}</time>`:''}</span><p>${r.lastBody?esc(r.lastBody):t('noConversation')}</p></span>${r.unread?`<span class="chat-unread">${r.unread>9?'9+':r.unread}</span>`:''}</button>`).join('');
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
  chatMessagesEl.innerHTML=`<p class="chat-messages-empty">${t('loading')}</p>`;
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
    chatMessagesEl.innerHTML=`<p class="chat-messages-empty">${t('loadFailed')}</p>`;
  }
}
