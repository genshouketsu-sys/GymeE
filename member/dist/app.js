const paths={...sharedIcons};
Object.assign(paths,{workoutPlay:'<path d="M7 3 22 12 7 21Z"/>',bars:'<path d="M3 21h18M4 18V12h4v6M10 18V7h4v11M16 18V2h4v16"/>',flame:'<path d="M12 2c2 7 8 9 8 14a8 8 0 0 1-16 0c0-3 2-6 4-8 0 4 2 5 3 5 2-3 2-6 1-11Z"/>',protein:'<path d="M12 2c5 0 9 8 9 13a9 9 0 0 1-18 0C3 10 7 2 12 2Z"/><path d="M4 14c4-7 7 6 15-2"/>',wheat:'<path d="M12 2v21M12 9C6 9 5 5 5 3c5 0 7 3 7 6ZM12 14C6 14 5 10 5 8c5 0 7 3 7 6ZM12 19C6 19 5 15 5 13c5 0 7 3 7 6ZM12 9c6 0 7-4 7-6-5 0-7 3-7 6ZM12 14c6 0 7-4 7-6-5 0-7 3-7 6ZM12 19c6 0 7-4 7-6-5 0-7 3-7 6Z"/>',drop:'<path d="M12 2C9 7 4 12 4 16a8 8 0 0 0 16 0c0-4-5-9-8-14Z"/><path d="M8 14q-2 4 2 5"/>',food:'<path d="M3 2v7q0 3 3 3t3-3V2M6 2v21M18 2v21M18 2q-5 2-4 11h4"/>',camera:'<path d="M3 6h4l2-3h6l2 3h4v15H3Z"/><circle cx="12" cy="13" r="5"/>',chat:'<path d="M21 11a9 9 0 0 1-9 9H7l-5 3 2-7a9 9 0 1 1 17-5Z"/>',trend:'<path d="m2 19 8-9 5 4 7-11M15 3h7v7"/>',dumbbell:'<path d="M1 8v8h3V8ZM4 5v14h4V5ZM8 12h8M16 5v14h4V5ZM20 8v8h3V8Z"/>'});
renderIcons(document);
// Include the full bottom stroke of the streak flame without changing other icons.
document.querySelector('.week-stats [data-icon="flame"] svg')?.setAttribute('viewBox', '-1 -1 26 26');
// Layout is responsive CSS; no viewport scaling is applied.

const panel=document.getElementById('panel'),title=document.getElementById('panel-title'),body=document.getElementById('panel-body');let sessionActive=false,photoURL;
// The static exercise rows below are only a placeholder for this first paint.
// Clear them immediately rather than leaving them clickable with stale
// data-exercise indexes while loadHome() is still in flight -- clicking one
// before the fetch resolves (or if the API never responds) would otherwise
// throw, since `exercises` starts empty.
document.getElementById('exercise-list').innerHTML='<p class="detail">読み込み中…</p>';
// DEV ONLY: fixed token for member 田中健 (ケン), minted against the local dev
// Postgres under supabase/ (see supabase/README.md). Real login (Supabase
// Auth) isn't wired up yet -- swap this for the signed-in user's session token.
const DEV_JWT='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsImV4cCI6MTgyMDQ1NzY2N30.RBVc8xO4CTLVsB6M7y99N_taX3n07qJPiOSovCtd8yg';
function show(t,html){title.textContent=t;body.innerHTML=html;if(!panel.open)panel.showModal()}
let exercises=[],memberName='',planName='',planDuration=null,nutritionTarget={calories:0,protein_g:0,carbs_g:0,fat_g:0},nutritionActual={calories:0,protein_g:0,carbs_g:0,fat_g:0},memoText='',weight=null,weeklyDone=0,weeklyTotal=0,streak=0;
function details(a,b){return `<div class="detail">${esc(a)}<small>${esc(b)}</small></div>`}
function planSummary(){return (planDuration!=null?planDuration+'分 · ':'')+exercises.length+'種目'}
function training(){show('今日のトレーニング',details(planName,planSummary())+exercises.map((e,i)=>`<button class="detail" style="width:100%;text-align:left" data-exercise="${i}">${esc(e[0])}<small>${esc(e[1])}</small></button>`).join('')+'<button class="primary" data-action="start">ワークアウトを開始</button>')}
const actions={home:()=>panel.close(),training,start:()=>{if(sessionActive){show('ワークアウト中',details(planName,'最後のセットまで丁寧に。')+'<button class="primary" id="finish">ワークアウトを終了</button>');document.getElementById('finish').onclick=()=>{sessionActive=false;show('ワークアウト終了','<p>お疲れさまでした。</p>')}}else{sessionActive=true;actions.start()}},nutrition:()=>show('栄養管理',details('カロリー',`${fmt(nutritionActual.calories)} / ${fmt(nutritionTarget.calories)} kcal`)+details('たんぱく質',`${fmt(nutritionActual.protein_g)} / ${fmt(nutritionTarget.protein_g)} g`)+details('炭水化物',`${fmt(nutritionActual.carbs_g)} / ${fmt(nutritionTarget.carbs_g)} g`)+details('脂質',`${fmt(nutritionActual.fat_g)} / ${fmt(nutritionTarget.fat_g)} g`)+'<button class="primary" data-action="food">食事を記録</button>'),progress:()=>show('今週の進捗',details('ワークアウト',`${weeklyDone} / ${weeklyTotal}回`)+details('体重',weight!=null?`${weight} kg`:'記録なし')+details('連続記録',streak+'日')+'<button class="primary" data-action="photo">経過写真を選ぶ</button>'),coach:()=>show('コーチメモ',`<p>${esc(memoText).replace(/\n/g,'<br>')}</p><div class="detail"><label for="draft">相談メモ</label><textarea id="draft" placeholder="コーチに相談したいことをメモ"></textarea><button class="primary" id="save-draft">この端末に下書きを保存</button></div><p>送信にはコーチとの接続が必要です。</p>`),notifications:()=>show('通知',details('コーチメモ',memoText)),food:()=>{show('食事記録','<label for="meal">今日の食事</label><textarea id="meal" placeholder="食べたもの・量を入力"></textarea><button class="primary" id="save-food">この端末に保存</button>');try{document.getElementById('meal').value=localStorage.getItem('gyme-member-meal')||''}catch{}document.getElementById('save-food').onclick=()=>{try{localStorage.setItem('gyme-member-meal',document.getElementById('meal').value);show('保存しました','<p>食事メモをこの端末に保存しました。</p>')}catch{show('保存できませんでした','<p>ブラウザの保存設定をご確認ください。</p>')}}},photo:()=>{show('経過写真','<label for="photo">写真を選んで確認</label><input id="photo" type="file" accept="image/*"><img id="photo-preview" alt="選択した経過写真" hidden><p>選んだ写真はこの画面でのみ表示されます。</p>');document.getElementById('photo').onchange=e=>{const file=e.target.files[0];if(!file)return;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(file);const image=document.getElementById('photo-preview');image.src=photoURL;image.hidden=false}}};
document.getElementById('close').onclick=()=>panel.close();
document.addEventListener('click',event=>{const a=event.target.closest('[data-action]'),e=event.target.closest('[data-exercise]');if(a){actions[a.dataset.action]?.();if(a.dataset.action==='coach'){try{document.getElementById('draft').value=localStorage.getItem('gyme-member-draft')||''}catch{}document.getElementById('save-draft').onclick=()=>{try{localStorage.setItem('gyme-member-draft',document.getElementById('draft').value);show('下書きを保存しました','<p>相談メモをこの端末に保存しました。</p>')}catch{show('保存できませんでした','<p>ブラウザの保存設定をご確認ください。</p>')}}}}if(e){const x=exercises[Number(e.dataset.exercise)];if(!x)return;show(x[0],details('今日のセット',x[1])+'<p>今日は最後のセットを丁寧に。</p><button class="primary" data-action="start">ワークアウトを開始</button>')}});

function pct(actual,target){return target?Math.round(Math.min(actual/target,1)*100):0}
function fmt(n){return (n||0).toLocaleString('ja-JP')}
function setsReps(sets,reps){if(sets==null&&reps==null)return '';if(sets==null)return reps+'回';if(reps==null)return sets+'セット';return `${sets} × ${reps}回`}
function renderHome(){
  document.getElementById('greeting').textContent=`おはよう、${memberName}`;
  document.getElementById('plan-name').textContent=planName;
  document.getElementById('plan-meta').innerHTML=(planDuration!=null?`<span><i data-icon="clock"></i>${planDuration}分</span>`:'')+`<span><i data-icon="bars"></i>${exercises.length}種目</span>`;
  renderIcons(document.getElementById('plan-meta'));
  const list=document.getElementById('exercise-list');
  list.innerHTML=exercises.length?exercises.map((ex,i)=>`<button data-exercise="${i}"><span class="exercise-photo"></span><span><strong>${esc(ex[0])}</strong><small>${esc(ex[1])}</small></span><i data-icon="chevron"></i></button>`).join(''):'<p class="detail">今日の予定はありません。</p>';
  renderIcons(list);
  const rings=[['lime','flame','calories'],['blue','protein','protein_g'],['yellow','wheat','carbs_g'],['purple','drop','fat_g']];
  const unitless=new Set(['calories']);
  const nutrients=document.getElementById('nutrients');
  nutrients.innerHTML=rings.map(([color,icon,key])=>`<button data-action="nutrition"><span class="ring ${color}" style="--progress:${pct(nutritionActual[key],nutritionTarget[key])}%"><i data-icon="${icon}"></i></span><span><b>${fmt(nutritionActual[key])}</b> / ${fmt(nutritionTarget[key])}${unitless.has(key)?'':'g'}</span><small>${key==='calories'?'カロリー':key==='protein_g'?'たんぱく質':key==='carbs_g'?'炭水化物':'脂質'}</small></button>`).join('');
  renderIcons(nutrients);
  document.getElementById('memo-text').textContent=memoText;
  const weekStats=document.getElementById('week-stats');
  weekStats.innerHTML=`<button data-action="progress"><i data-icon="dumbbell"></i><span><b>${weeklyDone} / ${weeklyTotal}</b><small>ワークアウト</small></span></button><button data-action="progress"><i data-icon="trend"></i><span><b>${weight!=null?weight+' kg':'—'}</b><small>体重</small></span></button><button data-action="progress"><i data-icon="flame"></i><span><b>${streak}日</b><small>連続記録</small></span></button>`;
  renderIcons(weekStats);
  document.querySelector('#week-stats [data-icon="flame"] svg')?.setAttribute('viewBox','-1 -1 26 26');
}
async function loadHome(){
  try{
    const uid=decodeJwtSub(DEV_JWT),today=tokyoDate(0),weekAgo=tokyoDate(-6),tomorrow=tokyoDate(1);
    const [me,plansRes,targetRes,mealsRes,metricRes,msgRes,weekSessionsRes]=await Promise.all([
      pg(`/users?select=display_name&id=eq.${uid}`),
      pg(`/training_plans?select=name,workouts(id,scheduled_date,duration_min,workout_exercises(order_index,target_sets,target_reps,exercises(name)))&status=eq.active&workouts.scheduled_date=eq.${today}`),
      pg('/nutrition_targets?select=calories,protein_g,carbs_g,fat_g&order=effective_date.desc&limit=1'),
      pg(`/meal_logs?select=calories,protein_g,carbs_g,fat_g&logged_at=gte.${today}T00:00:00%2B09:00&logged_at=lt.${tomorrow}T00:00:00%2B09:00`),
      pg('/body_metrics?select=weight_kg&order=recorded_at.desc&limit=1'),
      pg('/messages?select=body,sent_at&order=sent_at.desc&limit=1'),
      pg(`/sessions?select=scheduled_at,status&and=(scheduled_at.gte.${weekAgo}T00:00:00%2B09:00,scheduled_at.lt.${tomorrow}T00:00:00%2B09:00)&order=scheduled_at`),
    ]);
    memberName=me[0]?.display_name||'';
    // Pick the active plan that actually has a workout scheduled today, not
    // just the first active plan a member happens to have -- a member can
    // have more than one active training_plans row at once.
    const plan=plansRes.find(p=>p.workouts&&p.workouts.length>0)||plansRes[0];
    planName=plan?.name||'';
    const todaysWorkout=plan?.workouts?.[0];
    planDuration=todaysWorkout?.duration_min??null;
    exercises=(todaysWorkout?.workout_exercises||[]).sort((a,b)=>a.order_index-b.order_index).map(we=>[we.exercises?.name||'',setsReps(we.target_sets,we.target_reps)]);
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
    document.getElementById('greeting').textContent='データを読み込めませんでした';
    document.getElementById('exercise-list').innerHTML='<p class="detail">読み込みに失敗しました。</p>';
  }
}
loadHome();
