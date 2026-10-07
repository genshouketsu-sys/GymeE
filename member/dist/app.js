const paths={...sharedIcons};
Object.assign(paths,{workoutPlay:'<path d="M7 3 22 12 7 21Z"/>',bars:'<path d="M3 21h18M4 18V12h4v6M10 18V7h4v11M16 18V2h4v16"/>',flame:'<path d="M12 2c2 7 8 9 8 14a8 8 0 0 1-16 0c0-3 2-6 4-8 0 4 2 5 3 5 2-3 2-6 1-11Z"/>',protein:'<path d="M12 2c5 0 9 8 9 13a9 9 0 0 1-18 0C3 10 7 2 12 2Z"/><path d="M4 14c4-7 7 6 15-2"/>',wheat:'<path d="M12 2v21M12 9C6 9 5 5 5 3c5 0 7 3 7 6ZM12 14C6 14 5 10 5 8c5 0 7 3 7 6ZM12 19C6 19 5 15 5 13c5 0 7 3 7 6ZM12 9c6 0 7-4 7-6-5 0-7 3-7 6ZM12 14c6 0 7-4 7-6-5 0-7 3-7 6ZM12 19c6 0 7-4 7-6-5 0-7 3-7 6Z"/>',drop:'<path d="M12 2C9 7 4 12 4 16a8 8 0 0 0 16 0c0-4-5-9-8-14Z"/><path d="M8 14q-2 4 2 5"/>',food:'<path d="M3 2v7q0 3 3 3t3-3V2M6 2v21M18 2v21M18 2q-5 2-4 11h4"/>',camera:'<path d="M3 6h4l2-3h6l2 3h4v15H3Z"/><circle cx="12" cy="13" r="5"/>',chat:'<path d="M21 11a9 9 0 0 1-9 9H7l-5 3 2-7a9 9 0 1 1 17-5Z"/>',trend:'<path d="m2 19 8-9 5 4 7-11M15 3h7v7"/>',dumbbell:'<path d="M1 8v8h3V8ZM4 5v14h4V5ZM8 12h8M16 5v14h4V5ZM20 8v8h3V8Z"/>'});
renderIcons(document);
// Include the full bottom stroke of the streak flame without changing other icons.
document.querySelector('.week-stats [data-icon="flame"] svg')?.setAttribute('viewBox', '-1 -1 26 26');
// Layout is responsive CSS; no viewport scaling is applied.

// Member-specific UI strings, merged into the DICT shared.js already built
// (chat/notification-center strings) -- same Object.assign pattern the icon
// paths above use. Actual data (member/exercise/plan names) is never
// translated here, only UI chrome.
Object.assign(DICT.ja,{greeting:'おはよう、{name}',greetingSubtitle:'今日もいい一日にしよう',planTitle:'今日のプラン',workoutStartInline:'ワークアウト<br>開始',minuteUnit:'分',exerciseCountUnit:'種目',repsUnit:'回',setsUnit:'セット',sessionUnit:'回',dayUnit:'日',exerciseEmpty:'今日の予定はありません。',nutritionTitle:'栄養管理',viewDetail:'詳細を見る',calories:'カロリー',protein:'たんぱく質',carbs:'炭水化物',fat:'脂質',coachMemoTitle:'コーチメモ',weeklyTitle:'今週',workoutStat:'ワークアウト',weightStat:'体重',streakStat:'連続記録',noRecord:'記録なし',quickActionsTitle:'クイック操作',quickStart:'開始',quickFood:'食事記録',quickPhoto:'経過写真',quickCoach:'コーチに相談',navTraining:'運動',navNutrition:'栄養',navProgress:'進捗',navCoach:'コーチ',todaysTraining:'今日のトレーニング',startWorkout:'ワークアウトを開始',workoutInProgress:'ワークアウト中',workoutHint:'最後のセットまで丁寧に。',startedAtLabel:'開始: {time}',finishWorkout:'ワークアウトを終了',workoutFinished:'ワークアウト終了',workoutFinishedMsg:'お疲れさまでした。',todaysSet:'今日のセット',setHint:'今日は最後のセットを丁寧に。',weeklyProgressTitle:'今週の進捗',chooseProgressPhoto:'経過写真を選ぶ',notifTitle:'通知',mealLogTitle:'食事記録',logMealButton:'食事を記録',todaysMeal:'今日の食事',mealPlaceholder:'食べたもの・量を入力',saveToDevice:'この端末に保存',savedTitle:'保存しました',mealSavedMsg:'食事メモをこの端末に保存しました。',saveFailedTitle:'保存できませんでした',saveFailedMsg:'ブラウザの保存設定をご確認ください。',progressPhotoTitle:'経過写真',choosePhotoLabel:'写真を選んで確認',progressPhotoAlt:'選択した経過写真',photoHint:'選んだ写真はこの画面でのみ表示されます。',taskDone:'完了しました',markDone:'完了にする',sending:'送信中…',taskCompletedNotif:'{name}さんがタスクを完了しました',coachFallback:'コーチ',chatNotStarted:'コーチとの会話はまだ始まっていません。',dataLoadFailed:'データを読み込めませんでした',logAmount:'記録する量',logThis:'記録する',nutrientLoggedMsg:'{label}を{amount}記録しました。',loginSubtitle:'会員専用ログイン',emailLabel:'メールアドレス',emailPlaceholder:'member@example.com',passwordLabel:'パスワード',loginSubmitBtn:'ログイン',loginFailedMsg:'メールアドレスまたはパスワードが正しくありません。',logoutBtn:'ログアウト',accountTitle:'アカウント',nameLabel:'表示名',namePlaceholder:'例: 山田 太郎',registerSubtitle:'新規登録',createAccountLink:'アカウントを作成',forgotPasswordLink:'パスワードをお忘れですか？',backToLoginLink:'ログインに戻る',registerSubmitBtn:'登録する',registerFailedMsg:'登録に失敗しました。',emailTakenMsg:'このメールアドレスは既に登録されています。',passwordHint:'6文字以上',forgotSubtitle:'パスワードをリセット',forgotSubmitBtn:'リセット方法を確認',emailNotFoundMsg:'このメールアドレスのアカウントが見つかりません。',resetSubtitle:'新しいパスワードを設定',devResetNote:'開発環境のため、メール送信の代わりにこの画面で直接パスワードを再設定できます。',newPasswordLabel:'新しいパスワード',resetSubmitBtn:'パスワードを更新',resetFailedMsg:'リセットに失敗しました。もう一度お試しください。'});
Object.assign(DICT.zh,{greeting:'早上好，{name}',greetingSubtitle:'祝你今天愉快',planTitle:'今日计划',workoutStartInline:'开始<br>训练',minuteUnit:'分钟',exerciseCountUnit:'项',repsUnit:'次',setsUnit:'组',sessionUnit:'次',dayUnit:'天',exerciseEmpty:'今天没有安排。',nutritionTitle:'营养管理',viewDetail:'查看详情',calories:'卡路里',protein:'蛋白质',carbs:'碳水化合物',fat:'脂肪',coachMemoTitle:'教练留言',weeklyTitle:'本周',workoutStat:'训练次数',weightStat:'体重',streakStat:'连续打卡',noRecord:'暂无记录',quickActionsTitle:'快捷操作',quickStart:'开始',quickFood:'记录饮食',quickPhoto:'体态照片',quickCoach:'联系教练',navTraining:'运动',navNutrition:'营养',navProgress:'进度',navCoach:'教练',todaysTraining:'今日训练',startWorkout:'开始训练',workoutInProgress:'训练中',workoutHint:'最后一组也要认真完成。',startedAtLabel:'开始时间：{time}',finishWorkout:'结束训练',workoutFinished:'训练结束',workoutFinishedMsg:'辛苦了！',todaysSet:'今日组数',setHint:'最后一组也要认真完成。',weeklyProgressTitle:'本周进度',chooseProgressPhoto:'选择体态照片',notifTitle:'通知',mealLogTitle:'饮食记录',logMealButton:'记录饮食',todaysMeal:'今日饮食',mealPlaceholder:'输入食物和分量',saveToDevice:'保存到本机',savedTitle:'已保存',mealSavedMsg:'饮食记录已保存到本机。',saveFailedTitle:'保存失败',saveFailedMsg:'请检查浏览器的存储设置。',progressPhotoTitle:'体态照片',choosePhotoLabel:'选择照片查看',progressPhotoAlt:'已选择的体态照片',photoHint:'所选照片仅在此页面显示。',taskDone:'已完成',markDone:'标记完成',sending:'发送中…',taskCompletedNotif:'{name}已完成任务',coachFallback:'教练',chatNotStarted:'还没有和教练开始对话。',dataLoadFailed:'数据加载失败',logAmount:'记录数量',logThis:'记录',nutrientLoggedMsg:'已记录{label} {amount}。',loginSubtitle:'会员专用登录',emailLabel:'邮箱地址',emailPlaceholder:'member@example.com',passwordLabel:'密码',loginSubmitBtn:'登录',loginFailedMsg:'邮箱或密码不正确。',logoutBtn:'退出登录',accountTitle:'账户',nameLabel:'姓名',namePlaceholder:'例：山田太郎',registerSubtitle:'注册新账号',createAccountLink:'注册新账号',forgotPasswordLink:'忘记密码？',backToLoginLink:'返回登录',registerSubmitBtn:'注册',registerFailedMsg:'注册失败。',emailTakenMsg:'该邮箱已被注册。',passwordHint:'至少6位',forgotSubtitle:'重置密码',forgotSubmitBtn:'继续',emailNotFoundMsg:'未找到该邮箱对应的账户。',resetSubtitle:'设置新密码',devResetNote:'当前为开发环境，无需邮件验证，可直接在此设置新密码。',newPasswordLabel:'新密码',resetSubmitBtn:'更新密码',resetFailedMsg:'重置失败，请重试。'});
Object.assign(DICT.en,{greeting:'Good morning, {name}',greetingSubtitle:'Have a great day today',planTitle:"Today's Plan",workoutStartInline:'Start<br>Workout',minuteUnit:' min',exerciseCountUnit:' exercises',repsUnit:' reps',setsUnit:' sets',sessionUnit:'',dayUnit:' days',exerciseEmpty:'Nothing planned for today.',nutritionTitle:'Nutrition',viewDetail:'View details',calories:'Calories',protein:'Protein',carbs:'Carbs',fat:'Fat',coachMemoTitle:"Coach's Note",weeklyTitle:'This Week',workoutStat:'Workouts',weightStat:'Weight',streakStat:'Streak',noRecord:'No record',quickActionsTitle:'Quick Actions',quickStart:'Start',quickFood:'Log meal',quickPhoto:'Progress photo',quickCoach:'Message coach',navTraining:'Train',navNutrition:'Nutrition',navProgress:'Progress',navCoach:'Coach',todaysTraining:"Today's Training",startWorkout:'Start workout',workoutInProgress:'Workout in progress',workoutHint:'Take care with the last set.',startedAtLabel:'Started: {time}',finishWorkout:'Finish workout',workoutFinished:'Workout finished',workoutFinishedMsg:'Great work today.',todaysSet:"Today's set",setHint:'Take care with the last set.',weeklyProgressTitle:"This Week's Progress",chooseProgressPhoto:'Choose a progress photo',notifTitle:'Notifications',mealLogTitle:'Log a Meal',logMealButton:'Log a meal',todaysMeal:"Today's meal",mealPlaceholder:'What did you eat, and how much?',saveToDevice:'Save on this device',savedTitle:'Saved',mealSavedMsg:'Your meal note was saved on this device.',saveFailedTitle:'Could not save',saveFailedMsg:"Check this browser's storage settings.",progressPhotoTitle:'Progress Photo',choosePhotoLabel:'Choose a photo to preview',progressPhotoAlt:'Selected progress photo',photoHint:'The chosen photo is only shown on this screen.',taskDone:'Done',markDone:'Mark as done',sending:'Sending…',taskCompletedNotif:'{name} completed a task',coachFallback:'Coach',chatNotStarted:"You haven't started a conversation with your coach yet.",dataLoadFailed:'Could not load your data',logAmount:'Amount to log',logThis:'Log it',nutrientLoggedMsg:'Logged {amount} of {label}.',loginSubtitle:'Member Login',emailLabel:'Email',emailPlaceholder:'member@example.com',passwordLabel:'Password',loginSubmitBtn:'Log In',loginFailedMsg:'Incorrect email or password.',logoutBtn:'Log Out',accountTitle:'Account',nameLabel:'Display name',namePlaceholder:'e.g. Taro Yamada',registerSubtitle:'Create an Account',createAccountLink:'Create an account',forgotPasswordLink:'Forgot password?',backToLoginLink:'Back to login',registerSubmitBtn:'Create account',registerFailedMsg:'Registration failed.',emailTakenMsg:'This email is already registered.',passwordHint:'At least 6 characters',forgotSubtitle:'Reset Password',forgotSubmitBtn:'Continue',emailNotFoundMsg:'No account found for this email.',resetSubtitle:'Set a New Password',devResetNote:'Dev environment: instead of emailing a reset link, you can set your new password right here.',newPasswordLabel:'New password',resetSubmitBtn:'Update password',resetFailedMsg:'Reset failed. Please try again.'});
applyI18n(document);

const panel=document.getElementById('panel'),title=document.getElementById('panel-title'),body=document.getElementById('panel-body');let sessionActive=false,photoURL;
// The static exercise rows below are only a placeholder for this first paint.
// Clear them immediately rather than leaving them clickable with stale
// data-exercise indexes while loadHome() is still in flight -- clicking one
// before the fetch resolves (or if the API never responds) would otherwise
// throw, since `exercises` starts empty.
document.getElementById('exercise-list').innerHTML=`<p class="detail">${t('loading')}</p>`;
// Real login: the JWT is minted by public.login() (see migration 0016 --
// there's no separate auth server in this stack, so Postgres itself signs
// it) and persisted here, not hardcoded at build time. `let`, not `const`:
// this gets reassigned the moment a login call succeeds.
const AUTH_KEY='gyme-jwt-member';
let DEV_JWT=(function(){try{return localStorage.getItem(AUTH_KEY)||sessionStorage.getItem(AUTH_KEY)||''}catch{return ''}})();
let rememberAfterLogin=true;
function persistAuthToken(token,remember=true){try{if(remember){localStorage.setItem(AUTH_KEY,token);sessionStorage.removeItem(AUTH_KEY)}else{sessionStorage.setItem(AUTH_KEY,token);localStorage.removeItem(AUTH_KEY)}}catch{}}
function show(t,html){title.textContent=t;body.innerHTML=html;if(!panel.open)panel.showModal()}
let exercises=[],memberName='',planName='',planDuration=null,nutritionTarget={calories:0,protein_g:0,carbs_g:0,fat_g:0},nutritionActual={calories:0,protein_g:0,carbs_g:0,fat_g:0},memoText='',weight=null,weeklyDone=0,weeklyTotal=0,streak=0,notifItems=[],todaysSessionId=null,startedAt=null,coachId=null;
// Mirrors coach/dist/app.js's postNotification: a member can INSERT a
// notification for their own coach (migration 0013), but only the coach can
// SELECT it back -- asking PostgREST to return the new row (the
// Prefer: return=representation pgPost sends) would 42501 even though the
// insert itself is allowed, since RETURNING re-reads under the SELECT policy.
async function postNotification(userId,type,payload){
  const r=await fetch(POSTGREST_URL+'/notifications',{method:'POST',headers:{Authorization:'Bearer '+DEV_JWT,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({user_id:userId,type,payload})});
  if(!r.ok)throw new Error('API '+r.status+': /notifications');
}
const memberAlertStyle={session_reminder:['blue','calendar']};
function details(a,b){return `<div class="detail">${esc(a)}<small>${esc(b)}</small></div>`}
function planSummary(){return (planDuration!=null?planDuration+t('minuteUnit')+' · ':'')+exercises.length+t('exerciseCountUnit')}
function training(){show(t('todaysTraining'),details(planName,planSummary())+exercises.map((e,i)=>`<button class="detail" style="width:100%;text-align:left" data-exercise="${i}">${esc(e[0])}<small>${esc(e[1])}</small></button>`).join('')+`<button class="primary" data-action="start">${t('startWorkout')}</button>`)}
const actions={home:()=>panel.close(),training,start:async()=>{if(sessionActive){show(t('workoutInProgress'),details(planName,startedAt?t('startedAtLabel',{time:formatStarted(startedAt)}):t('workoutHint'))+`<button class="primary" id="finish">${t('finishWorkout')}</button>`);document.getElementById('finish').onclick=()=>{sessionActive=false;show(t('workoutFinished'),`<p>${t('workoutFinishedMsg')}</p>`)}}else{sessionActive=true;if(todaysSessionId){try{const row=await pgPost('/rpc/start_my_session',{p_session_id:todaysSessionId});startedAt=row?.started_at||new Date().toISOString()}catch(err){console.error('record workout start failed',err);startedAt=new Date().toISOString()}}else{startedAt=new Date().toISOString()}actions.start()}},nutrition:()=>show(t('nutritionTitle'),details(t('calories'),`${fmt(nutritionActual.calories)} / ${fmt(nutritionTarget.calories)} kcal`)+details(t('protein'),`${fmt(nutritionActual.protein_g)} / ${fmt(nutritionTarget.protein_g)} g`)+details(t('carbs'),`${fmt(nutritionActual.carbs_g)} / ${fmt(nutritionTarget.carbs_g)} g`)+details(t('fat'),`${fmt(nutritionActual.fat_g)} / ${fmt(nutritionTarget.fat_g)} g`)+`<button class="primary" data-action="food">${t('logMealButton')}</button>`),progress:()=>show(t('weeklyProgressTitle'),details(t('workoutStat'),`${weeklyDone} / ${weeklyTotal}${t('sessionUnit')}`)+details(t('weightStat'),weight!=null?`${weight} kg`:t('noRecord'))+details(t('streakStat'),streak+t('dayUnit'))+`<button class="primary" data-action="photo">${t('chooseProgressPhoto')}</button>`),coach:()=>openChat(),notifications:async()=>{show(t('notifTitle'),`<p class="notif-empty">${t('loading')}</p>`);try{const rows=await pg('/notifications?select=id,type,payload,created_at,read_at,completed_at&order=created_at.desc&limit=50');notifItems=rows.map(n=>{const[color,icon]=memberAlertStyle[n.type]||['blue','alert'];return{id:n.id,type:n.type,title:n.payload.title,detail:n.payload.detail,short:n.payload.short,created_at:n.created_at,read_at:n.read_at,completed_at:n.completed_at,color,icon}});body.innerHTML=renderNotifList(notifItems);renderIcons(body)}catch(err){console.error('load notifications failed',err);body.innerHTML=`<p class="notif-empty">${t('loadFailed')}</p>`}},food:()=>{show(t('mealLogTitle'),`<label for="meal">${t('todaysMeal')}</label><textarea id="meal" placeholder="${t('mealPlaceholder')}"></textarea><button class="primary" id="save-food">${t('saveToDevice')}</button>`);try{document.getElementById('meal').value=localStorage.getItem('gyme-member-meal')||''}catch{}document.getElementById('save-food').onclick=()=>{try{localStorage.setItem('gyme-member-meal',document.getElementById('meal').value);show(t('savedTitle'),`<p>${t('mealSavedMsg')}</p>`)}catch{show(t('saveFailedTitle'),`<p>${t('saveFailedMsg')}</p>`)}}},photo:()=>{show(t('progressPhotoTitle'),`<label for="photo">${t('choosePhotoLabel')}</label><input id="photo" type="file" accept="image/*"><img id="photo-preview" alt="${t('progressPhotoAlt')}" hidden><p>${t('photoHint')}</p>`);document.getElementById('photo').onchange=e=>{const file=e.target.files[0];if(!file)return;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(file);const image=document.getElementById('photo-preview');image.src=photoURL;image.hidden=false}}};
document.getElementById('close').onclick=()=>panel.close();
document.addEventListener('click',event=>{const a=event.target.closest('[data-action]'),e=event.target.closest('[data-exercise]'),nu=event.target.closest('[data-nutrient]');if(a)actions[a.dataset.action]?.();if(nu)logNutrient(nu.dataset.nutrient);if(e){const x=exercises[Number(e.dataset.exercise)];if(!x)return;show(x[0],details(t('todaysSet'),x[1])+`<p>${t('setHint')}</p><button class="primary" data-action="start">${t('startWorkout')}</button>`)}});
body.addEventListener('click',async e=>{
  if(e.target.closest('[data-mark-all]')){
    await markAllNotificationsRead();
    const now=new Date().toISOString();
    notifItems=notifItems.map(n=>({...n,read_at:n.read_at||now}));
    body.innerHTML=renderNotifList(notifItems);renderIcons(body);
    setBadge('notifications-badge',0);
    return;
  }
  const rowBtn=e.target.closest('[data-notif-id]');
  if(rowBtn){
    const n=notifItems.find(x=>x.id===rowBtn.dataset.notifId);
    if(!n)return;
    if(!n.read_at){
      n.read_at=new Date().toISOString();
      markNotificationRead(n.id);
      setBadge('notifications-badge',notifItems.filter(x=>!x.read_at).length);
    }
    showTask(n);
  }
  const doneBtn=e.target.closest('#task-done');
  if(doneBtn){
    const n=notifItems.find(x=>x.id===doneBtn.dataset.notifId);
    if(!n)return;
    doneBtn.disabled=true;doneBtn.textContent=t('sending');
    try{
      await pgPatch(`/notifications?id=eq.${n.id}`,{completed_at:new Date().toISOString()});
      n.completed_at=new Date().toISOString();
      showTask(n);
      // Best-effort: the member's own "done" state above already succeeded,
      // so a failure telling the coach shouldn't undo that or block the UI.
      // Composed in the member's current language -- the coach reads it back
      // as plain stored text, not re-translated to their own language pref.
      if(coachId){
        postNotification(coachId,'task_completed',{title:t('taskCompletedNotif',{name:memberName}),detail:n.title}).catch(err=>console.error('notify coach of task completion failed',err));
      }
    }catch(err){
      console.error('mark task complete failed',err);
      doneBtn.disabled=false;doneBtn.textContent=t('markDone');
    }
  }
});
// coach_task notifications ("タスクを割り当てる" on the coach side) are the
// only type a member can act on, not just read -- everything else (session
// reminders, etc.) has no completion concept.
function showTask(n){
  const taskUi=n.type!=='coach_task'?'':n.completed_at?`<p class="detail">${t('taskDone')}</p>`:`<button class="primary" id="task-done" data-notif-id="${n.id}">${t('markDone')}</button>`;
  show(n.title,`<p>${esc(n.detail)}</p>`+taskUi);
}

function pct(actual,target){return target?Math.round(Math.min(actual/target,1)*100):0}
function nutrientLabel(key){return key==='calories'?t('calories'):key==='protein_g'?t('protein'):key==='carbs_g'?t('carbs'):t('fat')}
// Targets (nutrition_targets) are coach-set -- a member has read-only RLS
// access to their own, so there's nothing for a member-facing slider to
// adjust there. What a member DOES fully own is meal_logs, so tapping a
// ring quick-logs an amount for that one macro instead, the same real data
// the ring's "actual" side is already summed from.
const nutrientMeta={calories:{unit:' kcal',max:1200,step:10,accent:'#d5ff00'},protein_g:{unit:'g',max:100,step:1,accent:'#7fcaff'},carbs_g:{unit:'g',max:150,step:1,accent:'#ffd849'},fat_g:{unit:'g',max:50,step:1,accent:'#a977ff'}};
function logNutrient(key){
  const meta=nutrientMeta[key],label=nutrientLabel(key);
  const target=nutritionTarget[key];
  // The coach sets this member's target (nutrition_targets); a small
  // triangle under the track marks where it falls on this slider's own
  // 0..max range, alongside the ring's dashed target track.
  const targetMarker=target>0?`<div class="slider-target-marker" style="left:${Math.min(100,target/meta.max*100)}%">▲</div>`:'';
  show(label,details(label,`${fmt(nutritionActual[key])} / ${fmt(target)}${meta.unit}`)
    +`<label for="nutrient-slider">${t('logAmount')}</label>`
    +`<div class="slider-row"><div class="slider-track-wrap"><input type="range" id="nutrient-slider" min="0" max="${meta.max}" step="${meta.step}" value="0" style="accent-color:${meta.accent}">${targetMarker}</div><span id="nutrient-slider-value">0${meta.unit}</span></div>`
    +`<button class="primary" id="log-nutrient-btn">${t('logThis')}</button>`);
  const slider=document.getElementById('nutrient-slider'),valueEl=document.getElementById('nutrient-slider-value');
  slider.oninput=()=>{valueEl.textContent=slider.value+meta.unit};
  document.getElementById('log-nutrient-btn').onclick=async()=>{
    const amount=Number(slider.value);
    if(amount<=0)return;
    const btn=document.getElementById('log-nutrient-btn');btn.disabled=true;btn.textContent=t('sending');
    try{
      await pgPost('/meal_logs',{member_id:decodeJwtSub(DEV_JWT),[key]:amount});
      await loadHome();
      show(t('savedTitle'),`<p>${t('nutrientLoggedMsg',{amount:amount+meta.unit,label})}</p>`);
    }catch(err){
      console.error('log nutrient failed',err);
      btn.disabled=false;btn.textContent=t('logThis');
    }
  };
}
function fmt(n){return (n||0).toLocaleString('ja-JP')}
function setsReps(sets,reps){if(sets==null&&reps==null)return '';if(sets==null)return reps+t('repsUnit');if(reps==null)return sets+t('setsUnit');return `${sets} × ${reps}${t('repsUnit')}`}
// Exercises have no photo library yet -- give each one a muscle-group tile
// (icon + color) instead of a blank box, so the list stays scannable without
// real photography. Substring match handles compound values like "胸・肩".
function muscleTileClass(group){
  const map=[['胸','mg-chest'],['背中','mg-back'],['肩','mg-shoulders'],['腕','mg-arms'],['脚','mg-legs'],['お尻','mg-legs'],['コア','mg-core'],['腹筋','mg-core'],['有酸素','mg-cardio']];
  const hit=map.find(([k])=>group&&group.includes(k));
  return hit?hit[1]:'';
}
// Absolute day+time the member actually pressed "開始", in Asia/Tokyo --
// distinct from relativeTime() elsewhere, which is for messages/notifications.
function formatStarted(iso){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(iso));
  const get=t=>parts.find(p=>p.type===t)?.value;
  return lang==='en'?`${Number(get('month'))}/${Number(get('day'))} ${get('hour')}:${get('minute')}`:`${Number(get('month'))}月${Number(get('day'))}日 ${get('hour')}:${get('minute')}`;
}
function renderHome(){
  document.getElementById('greeting').textContent=t('greeting',{name:memberName});
  document.getElementById('plan-name').textContent=planName;
  document.getElementById('plan-meta').innerHTML=(planDuration!=null?`<span><i data-icon="clock"></i>${planDuration}${t('minuteUnit')}</span>`:'')+`<span><i data-icon="bars"></i>${exercises.length}${t('exerciseCountUnit')}</span>`;
  renderIcons(document.getElementById('plan-meta'));
  const list=document.getElementById('exercise-list');
  list.innerHTML=exercises.length?exercises.map((ex,i)=>`<button data-exercise="${i}"><span class="exercise-photo ${muscleTileClass(ex[2])}"><i data-icon="dumbbell"></i></span><span><strong>${esc(ex[0])}</strong><small>${esc(ex[1])}</small></span><i data-icon="chevron"></i></button>`).join(''):`<p class="detail">${t('exerciseEmpty')}</p>`;
  renderIcons(list);
  const rings=[['lime','flame','calories'],['blue','protein','protein_g'],['yellow','wheat','carbs_g'],['purple','drop','fat_g']];
  const unitless=new Set(['calories']);
  const nutrients=document.getElementById('nutrients');
  nutrients.innerHTML=rings.map(([color,icon,key])=>`<button data-nutrient="${key}"><span class="ring ${color}" style="--progress:${pct(nutritionActual[key],nutritionTarget[key])}%"><i data-icon="${icon}"></i></span><span><b>${fmt(nutritionActual[key])}</b> / ${fmt(nutritionTarget[key])}${unitless.has(key)?'':'g'}</span><small>${nutrientLabel(key)}</small></button>`).join('');
  renderIcons(nutrients);
  document.getElementById('memo-text').textContent=memoText;
  const weekStats=document.getElementById('week-stats');
  weekStats.innerHTML=`<button data-action="progress"><i data-icon="dumbbell"></i><span><b>${weeklyDone} / ${weeklyTotal}</b><small>${t('workoutStat')}</small></span></button><button data-action="progress"><i data-icon="trend"></i><span><b>${weight!=null?weight+' kg':'—'}</b><small>${t('weightStat')}</small></span></button><button data-action="progress"><i data-icon="flame"></i><span><b>${streak}${t('dayUnit')}</b><small>${t('streakStat')}</small></span></button>`;
  renderIcons(weekStats);
  document.querySelector('#week-stats [data-icon="flame"] svg')?.setAttribute('viewBox','-1 -1 26 26');
}
async function loadHome(){
  try{
    const uid=decodeJwtSub(DEV_JWT),today=tokyoDate(0),weekAgo=tokyoDate(-6),tomorrow=tokyoDate(1);
    const [me,plansRes,targetRes,mealsRes,metricRes,msgRes,weekSessionsRes,unreadMsgsRes,notifsRes]=await Promise.all([
      pg(`/users?select=display_name&id=eq.${uid}`),
      pg(`/training_plans?select=name,coach_id,workouts(id,scheduled_date,duration_min,workout_exercises(order_index,target_sets,target_reps,exercises(name,muscle_group)))&status=eq.active&workouts.scheduled_date=eq.${today}`),
      pg('/nutrition_targets?select=calories,protein_g,carbs_g,fat_g&order=effective_date.desc&limit=1'),
      pg(`/meal_logs?select=calories,protein_g,carbs_g,fat_g&logged_at=gte.${today}T00:00:00%2B09:00&logged_at=lt.${tomorrow}T00:00:00%2B09:00`),
      pg('/body_metrics?select=weight_kg&order=recorded_at.desc&limit=1'),
      pg('/messages?select=body,sent_at&order=sent_at.desc&limit=1'),
      pg(`/sessions?select=id,scheduled_at,status&and=(scheduled_at.gte.${weekAgo}T00:00:00%2B09:00,scheduled_at.lt.${tomorrow}T00:00:00%2B09:00)&order=scheduled_at`),
      pg(`/messages?select=id&read_at=is.null&sender_id=neq.${uid}`),
      pg('/notifications?select=id&read_at=is.null&limit=20'),
    ]);
    setBadge('coach-badge',unreadMsgsRes.length);
    setBadge('notifications-badge',notifsRes.length);
    memberName=me[0]?.display_name||'';
    // Pick the active plan that actually has a workout scheduled today, not
    // just the first active plan a member happens to have -- a member can
    // have more than one active training_plans row at once.
    const plan=plansRes.find(p=>p.workouts&&p.workouts.length>0)||plansRes[0];
    planName=plan?.name||'';
    coachId=plan?.coach_id||coachId;
    const todaysWorkout=plan?.workouts?.[0];
    planDuration=todaysWorkout?.duration_min??null;
    exercises=(todaysWorkout?.workout_exercises||[]).sort((a,b)=>a.order_index-b.order_index).map(we=>[we.exercises?.name||'',setsReps(we.target_sets,we.target_reps),we.exercises?.muscle_group||'']);
    nutritionTarget=targetRes[0]||nutritionTarget;
    nutritionActual={
      calories:mealsRes.reduce((s,m)=>s+(m.calories||0),0),
      protein_g:mealsRes.reduce((s,m)=>s+(m.protein_g||0),0),
      carbs_g:mealsRes.reduce((s,m)=>s+(m.carbs_g||0),0),
      fat_g:mealsRes.reduce((s,m)=>s+(m.fat_g||0),0),
    };
    weight=metricRes[0]?.weight_kg??null;
    memoText=msgRes[0]?.body||'';
    // Cancelled/no-show sessions were never actually attendable -- exclude
    // them from the ratio instead of letting them inflate the denominator.
    todaysSessionId=weekSessionsRes.find(s=>s.scheduled_at.slice(0,10)===today)?.id||null;
    const relevant=weekSessionsRes.filter(s=>s.status!=='cancelled'&&s.status!=='no_show');
    weeklyTotal=relevant.length;
    weeklyDone=relevant.filter(s=>s.status==='completed').length;
    const completedDates=new Set(weekSessionsRes.filter(s=>s.status==='completed').map(s=>s.scheduled_at.slice(0,10)));
    let streakCount=0,offset=completedDates.has(tokyoDate(0))?0:-1;
    while(completedDates.has(tokyoDate(offset))){streakCount++;offset--}
    streak=streakCount;
    renderHome();
  }catch(err){
    console.error('loadHome failed',err);
    document.getElementById('greeting').textContent=t('dataLoadFailed');
    document.getElementById('exercise-list').innerHTML=`<p class="detail">${t('loadFailed')}</p>`;
  }
}
// Same gap as the coach app: badges only reflected page-load state, so a
// coach reply sent while this page just sat here never showed up until a
// manual reload. Poll just the two counts, not the whole home screen.
async function refreshBadges(){
  // Deliberately no document.hidden skip -- see coach/dist/app.js for why:
  // a badge exists to reflect activity from while the tab was backgrounded,
  // so it has to keep polling then, not stop.
  try{
    const uid=decodeJwtSub(DEV_JWT);
    const [unreadMsgsRes,notifsRes]=await Promise.all([
      pg(`/messages?select=id&read_at=is.null&sender_id=neq.${uid}`),
      pg('/notifications?select=id&read_at=is.null&limit=20'),
    ]);
    setBadge('coach-badge',unreadMsgsRes.length);
    setBadge('notifications-badge',notifsRes.length);
  }catch(err){console.error('refreshBadges failed',err)}
}
// Nothing that touches the API (loadHome, the badge poll) runs until we
// actually have a token -- doing it unconditionally would just be a wall of
// 401s firing behind the login screen.
function initApp(){
  document.getElementById('login-screen').hidden=true;
  document.querySelector('.viewport').hidden=false;
  loadHome();
  setInterval(refreshBadges,5000);
}
// After a successful login/register/reset, the same code path always
// applies: stash the token and enter the app -- factored out so the three
// call sites (below) don't each repeat it.
function completeAuth(token){
  DEV_JWT=token;
  persistAuthToken(DEV_JWT,rememberAfterLogin);
  initApp();
}
async function authRequest(path,data){
  const r=await fetch(POSTGREST_URL+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!r.ok){
    const body=await r.json().catch(()=>({}));
    throw new Error(body.message||('API '+r.status+': '+path));
  }
  return r.json();
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
  const btn=document.getElementById('login-submit');if(btn.disabled)return;rememberAfterLogin=document.getElementById('remember-login').checked;btn.disabled=true;btn.setAttribute('aria-busy','true');btn.querySelector('.submit-label').textContent=t('sending');btn.querySelector('.submit-arrow').hidden=true;
  try{
    completeAuth(await authRequest('/rpc/login',{p_email:email,p_password:password,p_required_role:'member'}));
  }catch(err){
    console.error('login failed',err);
    errEl.textContent=t('loginFailedMsg');
    errEl.hidden=false;
    passwordEl.focus();
  }finally{
    btn.disabled=false;btn.removeAttribute('aria-busy');btn.querySelector('.submit-label').textContent=t('loginSubmitBtn');btn.querySelector('.submit-arrow').hidden=false;
  }
}
async function doRegister(){
  const nameEl=document.getElementById('reg-name'),emailEl=document.getElementById('reg-email'),passwordEl=document.getElementById('reg-password'),errEl=document.getElementById('login-error');
  const name=nameEl.value.trim(),email=emailEl.value.trim(),password=passwordEl.value;
  errEl.hidden=true;
  if(!email||!password)return;
  const btn=document.getElementById('register-submit');btn.disabled=true;btn.textContent=t('sending');
  try{
    completeAuth(await authRequest('/rpc/register_member',{p_email:email,p_password:password,p_display_name:name}));
  }catch(err){
    console.error('register failed',err);
    errEl.textContent=/already exists/.test(err.message)?t('emailTakenMsg'):t('registerFailedMsg');
    errEl.hidden=false;
    btn.disabled=false;btn.textContent=t('registerSubmitBtn');
  }
}
// There's no email service in this stack (see migration 0017's comment) --
// request_password_reset() hands back the token directly instead of
// emailing a link, so this goes straight from "request" to "set a new
// password" in the same screen rather than a real "check your email" step.
let pendingResetToken=null;
async function doRequestReset(){
  const emailEl=document.getElementById('forgot-email'),errEl=document.getElementById('login-error');
  const email=emailEl.value.trim();
  errEl.hidden=true;
  if(!email)return;
  const btn=document.getElementById('forgot-submit');btn.disabled=true;btn.textContent=t('sending');
  try{
    pendingResetToken=await authRequest('/rpc/request_password_reset',{p_email:email});
    renderAuthScreen('forgot-reset');
  }catch(err){
    console.error('request reset failed',err);
    errEl.textContent=t('emailNotFoundMsg');
    errEl.hidden=false;
    btn.disabled=false;btn.textContent=t('forgotSubmitBtn');
  }
}
async function doResetPassword(){
  const passwordEl=document.getElementById('reset-password'),errEl=document.getElementById('login-error');
  const password=passwordEl.value;
  errEl.hidden=true;
  if(!password)return;
  const btn=document.getElementById('reset-submit');btn.disabled=true;btn.textContent=t('sending');
  try{
    completeAuth(await authRequest('/rpc/reset_password',{p_token:pendingResetToken,p_new_password:password}));
  }catch(err){
    console.error('reset password failed',err);
    errEl.textContent=t('resetFailedMsg');
    errEl.hidden=false;
    btn.disabled=false;btn.textContent=t('resetSubmitBtn');
  }
}
// One shared login-card container, re-rendered per mode instead of four
// separate static screens -- mirrors how every dialog elsewhere in this app
// is a single container whose content actions.* swap out.
function renderAuthScreen(mode){
  const card=document.getElementById('login-card');
  if(mode==='register'){
    card.innerHTML=`<div class="auth-logo"><span class="brand-mark">G</span><span>YME</span></div><p class="auth-eyebrow">MEMBER ACCESS</p><h1>${t('registerSubtitle')}</h1><p class="login-subtitle">${t('loginSubtitle')}</p><div class="auth-form"><div class="field-group"><label for="reg-name">${t('nameLabel')}</label><input type="text" id="reg-name" placeholder="${t('namePlaceholder')}" autocomplete="name"></div><div class="field-group"><label for="reg-email">${t('emailLabel')}</label><input type="email" id="reg-email" placeholder="${t('emailPlaceholder')}" autocomplete="username" inputmode="email"></div><div class="field-group"><label for="reg-password">${t('passwordLabel')}</label><input type="password" id="reg-password" placeholder="${t('passwordHint')}" autocomplete="new-password"></div><p class="login-error" id="login-error" hidden></p><button class="primary login-submit" id="register-submit">${t('registerSubmitBtn')}</button></div><div class="login-links"><button class="link-btn" id="back-to-login">${t('backToLoginLink')}</button></div>`;
    document.getElementById('register-submit').onclick=doRegister;
    document.getElementById('back-to-login').onclick=()=>renderAuthScreen('login');
  }else if(mode==='forgot-request'){
    card.innerHTML=`<div class="auth-logo"><span class="brand-mark">G</span><span>YME</span></div><p class="auth-eyebrow">MEMBER ACCESS</p><h1>${t('forgotSubtitle')}</h1><p class="login-subtitle">${t('emailLabel')}</p><div class="auth-form"><div class="field-group"><label for="forgot-email">${t('emailLabel')}</label><input type="email" id="forgot-email" placeholder="${t('emailPlaceholder')}" autocomplete="username" inputmode="email"></div><p class="login-error" id="login-error" hidden></p><button class="primary login-submit" id="forgot-submit">${t('forgotSubmitBtn')}</button></div><div class="login-links"><button class="link-btn" id="back-to-login">${t('backToLoginLink')}</button></div>`;
    document.getElementById('forgot-submit').onclick=doRequestReset;
    document.getElementById('back-to-login').onclick=()=>renderAuthScreen('login');
  }else if(mode==='forgot-reset'){
    card.innerHTML=`<div class="auth-logo"><span class="brand-mark">G</span><span>YME</span></div><p class="auth-eyebrow">MEMBER ACCESS</p><h1>${t('resetSubtitle')}</h1><p class="login-subtitle login-hint">${t('devResetNote')}</p><div class="auth-form"><div class="field-group"><label for="reset-password">${t('newPasswordLabel')}</label><input type="password" id="reset-password" placeholder="${t('passwordHint')}" autocomplete="new-password"></div><p class="login-error" id="login-error" hidden></p><button class="primary login-submit" id="reset-submit">${t('resetSubmitBtn')}</button></div>`;
    document.getElementById('reset-submit').onclick=doResetPassword;
  }else{
    card.innerHTML=`<div class="auth-logo"><span class="brand-mark">G</span><span>YME</span></div><p class="auth-eyebrow">MEMBER ACCESS</p><h1>ログイン</h1><p class="login-subtitle">${t('loginSubtitle')}</p><form class="auth-form" id="login-form" novalidate><div class="field-group"><label for="login-email">${t('emailLabel')}</label><input type="email" id="login-email" name="email" placeholder="${t('emailPlaceholder')}" autocomplete="username" autocapitalize="none" spellcheck="false" inputmode="email" enterkeyhint="next" aria-describedby="email-error" required><p class="field-error" id="email-error" hidden>メールアドレスを入力してください</p></div><div class="field-group"><label for="login-password">${t('passwordLabel')}</label><div class="password-field"><input type="password" id="login-password" name="password" placeholder="パスワードを入力" autocomplete="current-password" enterkeyhint="go" aria-describedby="password-error" required><button class="password-toggle" type="button" id="toggle-password" aria-label="パスワードを表示" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button></div><p class="field-error" id="password-error" hidden>パスワードを入力してください</p></div><div class="auth-options"><label class="remember-option"><input type="checkbox" id="remember-login" checked><span class="custom-check" aria-hidden="true"></span><span>ログイン状態を保持</span></label><button class="text-link" type="button" id="show-forgot">${t('forgotPasswordLink')}</button></div><p class="login-error" id="login-error" role="alert" hidden></p><button class="primary login-submit" id="login-submit" type="submit"><span class="spinner" aria-hidden="true"></span><span class="submit-label">${t('loginSubmitBtn')}</span><span class="submit-arrow" aria-hidden="true">→</span></button></form><div class="login-links"><button class="link-btn" type="button" id="show-register">${t('createAccountLink')}</button></div>`;
    document.getElementById('login-form').addEventListener('submit',event=>{event.preventDefault();doLogin()});
    document.getElementById('toggle-password').addEventListener('click',event=>{const button=event.currentTarget,input=document.getElementById('login-password'),show=input.type==='password';input.type=show?'text':'password';button.setAttribute('aria-pressed',String(show));button.setAttribute('aria-label',show?'パスワードを隠す':'パスワードを表示');input.focus()});
    document.getElementById('show-forgot').onclick=()=>renderAuthScreen('forgot-request');
    for(const id of ['login-email','login-password'])document.getElementById(id).addEventListener('input',()=>{const input=document.getElementById(id),error=document.getElementById(id==='login-email'?'email-error':'password-error');if(input.value){error.hidden=true;input.removeAttribute('aria-invalid')}document.getElementById('login-error').hidden=true});
    document.getElementById('show-register').onclick=()=>renderAuthScreen('register');
  }
}
function logout(){
  try{localStorage.removeItem(AUTH_KEY);sessionStorage.removeItem(AUTH_KEY)}catch{}
  location.reload();
}
document.getElementById('account-btn').onclick=()=>{
  show(t('accountTitle'),`<button class="primary" id="logout-btn">${t('logoutBtn')}</button>`);
  document.getElementById('logout-btn').onclick=logout;
};
if(DEV_JWT)initApp();else renderAuthScreen('login');

/* -- Chat with the member's one coach (shared thread logic is in shared.js). -- */
chatOnRead=()=>setBadge('coach-badge',0);
async function openChat(){
  const chatDialog=document.getElementById('chat'),chatMessagesEl=document.getElementById('chat-messages'),chatFormEl=document.getElementById('chat-form');
  chatDialog.showModal();
  document.getElementById('chat-list').hidden=true;
  document.getElementById('chat-back').hidden=true;
  document.getElementById('chat-avatar').hidden=false;
  document.getElementById('chat-subtitle').hidden=true;
  document.getElementById('chat-thread').hidden=false;
  document.getElementById('chat-title').textContent=t('coachFallback');
  chatFormEl.hidden=false;
  chatMessagesEl.innerHTML=`<p class="chat-messages-empty">${t('loading')}</p>`;
  try{
    chatMeId=decodeJwtSub(DEV_JWT);
    const convRes=await pg(`/conversations?select=id,coach:users!conversations_coach_id_fkey(display_name)&member_id=eq.${chatMeId}`);
    const conv=convRes[0];
    if(!conv){
      chatFormEl.hidden=true;
      chatMessagesEl.innerHTML=`<p class="chat-messages-empty">${t('chatNotStarted')}</p>`;
      return;
    }
    chatConversationId=conv.id;
    document.getElementById('chat-title').textContent=conv.coach?.display_name||t('coachFallback');
    await loadChatMessages();
    markChatRead();
    startChatPolling();
  }catch(err){
    console.error('openChat failed',err);
    chatMessagesEl.innerHTML=`<p class="chat-messages-empty">${t('loadFailed')}</p>`;
  }
}
