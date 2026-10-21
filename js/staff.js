/* ==========================================================================
   js/staff.js — XODIMLAR PANELI (controller.html): controller · teacher · english
   --------------------------------------------------------------------------
   Bitta panel, rolga qarab tablar (server ham har amalni tekshiradi — bu yerdagi
   yashirish faqat qulaylik):
     controller — MONITORING: umumiy, vaqt chizig'i, bugun/intizom, sessiya+chat,
                  faollik tahlili, shaxsiy eslatma, sozlamalar (o'z paroli)
     teacher    — O'QITISH: progress, topshiriqlar, feedback, writing/speaking
                  tekshiruvi, kurslar, xatolar, lug'at, loyihalar, chat, tahlil
     english    — teacher bilan bir xil, FAQAT ingliz tili (holat serverda
                  filtrlangan: Python/DataCamp yo'q)
   O'quvchi holati /api/ctrl/state (faqat o'qish) → Store.replace; panel
   localStorage'dagi o'quvchi holatiga YOZMAYDI (setItem himoyasi controller.html da).
   ========================================================================== */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  /* App qobig'i yo'q — data-go tugmalari panelda ishlamasin, lekin xato ham bermasin */
  window.App = { render: function(){}, refreshChrome: function(){}, go: function(){} }; window.toast = function(){};

  var T={uz:{gateMsg:'Sessiya tekshirilmoqda…',pwOwn:"Faqat o'z hisobingiz paroli. Yangi parol keyingi kirishdan amal qiladi.",lTitle:'Xodimlar paneli',lLede:"Controller · Teacher · English support — har rolning o'z logini. O'quvchi paroli bu yerda ishlamaydi.",lUser:'Login',lPass:'Parol',lGo:'Kirish',hTag:'Controller · Invigilator',learner:"O'quvchi",logout:'Chiqish',ro:"faqat o'qish",
    nOverview:'Umumiy',nToday:'Bugun va intizom',nCourses:'Kurslar',nVocab:"Lug'at daftari",nMistakes:'Xatolar va takror',nNotes:'Eslatmalar',nMovies:'Movies & Videos',nProfile:'Profil',nChat:'Chat va sessiya',nAnalytics:'Tahlil',nSettings:'Sozlamalar',
    online:'onlayn',offline:'oflayn',ctrlYou:'siz onlaynsiz',bad:"Login yoki parol noto'g'ri.",lock:"Juda ko'p urinish. {m} daqiqadan keyin.",env:'Server sozlanmagan: ',net:'Server javob bermadi.',saved:'Saqlandi',ago:'{n} s oldin',agoM:'{n} daq oldin',agoH:'{n} soat oldin',min:'daq',by:'kim',sysStart:'Sessiya boshlandi',sysPause:'Pauza',sysResume:'Davom etdi',sysFinish:'Sessiya tugadi',never:"hali yo'q",
    kName:'Ism',kPage:'Hozirgi sahifa',kSeen:'Oxirgi faollik',kSince:'Holat vaqti',kActive:'Faol daqiqa',kSaved:'Progress saqlangan',aStart:'Sessiyani boshlash',aPause:'Pauza',aResume:'Davom',aFinish:'Tugatish',sLog:'Faollik jurnali',sHist:'Sessiyalar tarixi',sChat:'Shaxsiy chat',send:'Yuborish',cHint:'Enter — yuborish, Shift+Enter — yangi qator.',sNotes:'Sessiya eslatmalari (faqat siz)',none:"Hali ma'lumot yo'q",
    stPy:'Python darslari',stEn:'Ingliz tili kunlari',stDc:'DataCamp boblari',stStreak:'Intizom zanjiri',stDebt:'Qarz kunlari',stToday:'Bugungi soatlar',stMastery:'Mahorat',stWords:"Daftardagi so'zlar",stMis:'Ochiq xatolar',stDue:'Takror kutmoqda',stQuick:'Quick Repeat',
    tdBlocks:'Bugungi jadval bloklari',tdLast:'Oxirgi 21 kun (intizom to\'liqmi)',tdDebtList:'Bajarilmagan kunlar',tdHours:'Bugun: bajarilgan / talab',eng:'Ingliz tili',code:'Coding',
    cPy:'Python — 30 dars (eng yaxshi ball)',cEn:'Ingliz tili — 140 kun (yopilgan)',cDc:'DataCamp — boblar',cQk:'Quick Repeat — kunlar',cSpk:'Speaking 30 — yozuvlar',cWr:'Writing — haftalar',cMock:'Mock natijalari',cDone:'yopilgan',cBest:'ball',cQuiz:'test',
    vWords:"So'zlar",vDay:'Kun bo\'yicha qo\'shilgan (oxirgi 15 kun)',vNone:"Daftar bo'sh",vPos:"turi",vTr:'tarjima',vSyn:'sinonim',vEx:'misol',vNote:'izoh',
    mOpen:'Ochiq xatolar',mFixed:'tuzatilgan',mRev:'Takror navbati',mDue:'muddati o\'tgan',mUp:'7 kun ichida',mTimes:'marta',
    nPy:'Python dars eslatmalari',nEn:'Ingliz tili kun eslatmalari',nCb:'Daftarlar (ingliz / coding)',nRf:'Haftalik / oylik mulohaza',
    pTitle:'Lavozim',pBio:'Bio',pSav:"Jamg'arma",pCerts:'Sertifikatlar',pProj:'Loyihalar (portfolio)',pPrice:'narx',
    anTime:'O\'quv vaqti — oxirgi 14 kun',anTotal:'Jami',anQuiz:'Test natijalari (oxirgi)',anCode:'Katta coding testlari',anBest:'eng yaxshi',
    sLang:'Til',sTheme:'Mavzu',sTargets:'Kunlik me\'yor',sWork:'Ish davri',sPrayer:'Namoz sozlamasi',sNotify:'Bildirishnoma',sGate:'Ketma-ket rejim',on:'yoqilgan',off:"o'chiq",
    pwT:'Nazoratchi parolini almashtirish',pwCur:'Hozirgi parol',pwNew:'Yangi parol (≥ 6)',pwGo:'Almashtirish',pwOk:'Parol almashtirildi',pwBad:"Hozirgi parol noto'g'ri",noState:"O'quvchi hali bulutga progress yubormagan.",refresh:'Yangilash',
    hTag_controller:'Controller · Invigilator',hTag_teacher:'Teacher panel',hTag_english:'English support panel',
    nTimeline:"Vaqt chizig'i",nAssign:'Topshiriqlar',nFeedback:'Feedback',nReviews:'Writing / Speaking',nEnglish:'Ingliz tili',nProjects:'Loyihalar',nPnotes:'Shaxsiy eslatma',
    tlT:"Faollik vaqt chizig'i",tlS:"Faqat real saqlangan hodisalar: sahifa ochish (heartbeat), dars/test/xato/takror (o'quvchi jurnali), sessiya voqealari.",tlNone:"Hodisa yo'q",tlDay:'Kun',tlAll:'Hammasi',
    evOpen:'Sahifa ochildi',ev_py_done:'Python darsi yopildi','ev_py-done':'Python darsi yopildi','ev_py-quiz':'Python testi','ev_eng-done':'Ingliz kuni yopildi',ev_quiz:'Test',ev_mistake:'Xato yozildi',ev_read:"O'qish/tinglash natijasi",ev_review:'Takror',ev_flag:'Bajarildi',ev_plan:'Reja bandi',
    asT:'Topshiriqlar',asNew:'Yangi topshiriq',asTitle:'Sarlavha',asDesc:'Tavsif',asType:'Turi',asCourse:'Kurs',asRoute:'Manzil (#/…)',asPr:'Ustuvorlik',asDue:'Muddat',asSave:'Saqlash',asCancel:'Bekor',asEdit:'Tahrir',asDel:"O'chirish",asDelQ:"Topshiriq o'chirilsinmi?",asNone:"Topshiriq yo'q",asOpen:'Ochiq',asDone:'Bajarilgan',asOverdue:"Muddati o'tgan",asRate:'Bajarilish',asPick:'Tayyor manzillar',
    st_assigned:'Berilgan',st_in_progress:'Jarayonda',st_completed:'Bajarilgan',st_overdue:"Muddati o'tgan",pr_low:'past',pr_normal:"o'rtacha",pr_high:'muhim',
    fbT:'Feedback',fbNew:'Yangi feedback',fbAct:'Faoliyat',fbKind:'Turi',fbRef:'Havola (ref)',fbTitle:'Nomi',fbText:'Matn',fbVis:"Ko'rinish",fbVisS:"O'quvchi ko'radi",fbVisP:'Shaxsiy eslatma (faqat siz)',fbStr:'Kuchli tomonlar',fbWeak:'Zaif tomonlar',fbCorr:'Tuzatishlar',fbRec:'Tavsiyalar',fbNext:'Keyingi vazifa',fbNone:"Feedback yo'q",fbPrivate:'shaxsiy',fbStudent:"o'quvchiga",
    rvT:'Writing / Speaking tekshiruvi',rvS:"Yuborildi → tekshirildi → qayta yozildi → 2-tekshiruv → tugallandi. Avtomatik baholash yo'q — siz yozasiz.",rvNone:"Yuborilgan ish yo'q",rvQueue:'Navbat',rvDone:'Tugallangan',rvText:"O'quvchi matni",rvGive:'Feedback yozish',rvBand:'Band (ixtiyoriy)',rvResult:'Natija (speaking)',rvComplete:'Tugallash',rvReopen:'Qayta ochish',rvHist:'Bosqichlar',
    stage_submitted:'yuborildi',stage_reviewed:'tekshirildi',stage_revised:'qayta yozildi',stage_reviewed2:'2-tekshiruv',stage_completed:'tugallandi',stage_reopened:'qayta ochildi',res_completed:'bajarildi',res_incomplete:"to'liq emas",
    enT:'Ingliz tili ish maydoni',enDay:'Joriy kun',enGram:'Grammatika',enVoc:"Lug'at",enRead:"O'qish",enLis:'Tinglash',enSpk:'Speaking',enWr:'Writing',enWeak:'Zaif sohalar',enRecent:"So'nggi faollik",enQuiz:'Test natijalari',enPr:'Mashq natijalari',enRv:'Takror navbati',enFb:'Sizning feedbackingiz',enAs:'Topshiriqlar',
    taT:"O'qituvchi tahlili",taRate:'Topshiriq bajarilishi',taOver:"Muddati o'tgan",taWr:'Writing yuborilgan',taSpk:'Speaking faolligi',taRv:'Takror bajarilishi',taWeak:'Yordam kerak joylar',
    caT:'Faollik tahlili',caSess:'Sessiyalar',caActive:'Faol vaqt',caInact:'Faolsizlik',caLastSeen:"Oxirgi ko'rildi",caTask:'Joriy vazifa',caComm:'Aloqa',caMsgs:'xabar',caToday:'bugun',ca7:'7 kun',ca30:'30 kun',
    convWith:"O'quvchi bilan chat",pnT:'Shaxsiy eslatmalar (faqat siz)',pnS:"O'quvchi ko'rmaydi. Feedback bo'limidagi 'shaxsiy' yozuvlar ham shu yerda.",
    pwT2:'Parolni almashtirish (o\'z rolingiz)',roleYou:'Siz',filtered:"Faqat ingliz tili ma'lumotlari (Python serverda yashirilgan)"},
  en:{gateMsg:'Checking your session…',pwOwn:'Only your own account password. It applies from the next sign-in.',lTitle:'Staff panel',lLede:'Controller · Teacher · English support — each role has its own login. The learner password does not work here.',lUser:'Username',lPass:'Password',lGo:'Sign in',hTag:'Controller · Invigilator',learner:'Learner',logout:'Sign out',ro:'read only',
    nOverview:'Overview',nToday:'Today & discipline',nCourses:'Courses',nVocab:'Vocabulary copybook',nMistakes:'Mistakes & review',nNotes:'Notes',nMovies:'Movies & Videos',nProfile:'Profile',nChat:'Chat & session',nAnalytics:'Analytics',nSettings:'Settings',
    online:'online',offline:'offline',ctrlYou:'you are online',bad:'Incorrect username or password.',lock:'Too many attempts. Try again in {m} min.',env:'Server is not configured: ',net:'Server did not respond.',saved:'Saved',ago:'{n} s ago',agoM:'{n} min ago',agoH:'{n} h ago',min:'min',by:'by',sysStart:'Session started',sysPause:'Paused',sysResume:'Resumed',sysFinish:'Session finished',never:'not yet',
    kName:'Name',kPage:'Current page',kSeen:'Last activity',kSince:'State since',kActive:'Active minutes',kSaved:'Progress saved',aStart:'Start session',aPause:'Pause',aResume:'Resume',aFinish:'Finish',sLog:'Activity log',sHist:'Session history',sChat:'Private chat',send:'Send',cHint:'Enter sends, Shift+Enter adds a line.',sNotes:'Session notes (only you)',none:'Nothing yet',
    stPy:'Python lessons',stEn:'English days',stDc:'DataCamp chapters',stStreak:'Discipline streak',stDebt:'Debt days',stToday:"Today's hours",stMastery:'Mastery',stWords:'Copybook words',stMis:'Open mistakes',stDue:'Reviews due',stQuick:'Quick Repeat',
    tdBlocks:"Today's schedule blocks",tdLast:'Last 21 days (discipline complete?)',tdDebtList:'Missed days',tdHours:'Today: done / required',eng:'English',code:'Coding',
    cPy:'Python — 30 lessons (best score)',cEn:'English — 140 days (closed)',cDc:'DataCamp — chapters',cQk:'Quick Repeat — days',cSpk:'Speaking 30 — recordings',cWr:'Writing — weeks',cMock:'Mock results',cDone:'closed',cBest:'score',cQuiz:'quiz',
    vWords:'Words',vDay:'Added per day (last 15 days)',vNone:'The copybook is empty',vPos:'pos',vTr:'translation',vSyn:'synonym',vEx:'example',vNote:'note',
    mOpen:'Open mistakes',mFixed:'fixed',mRev:'Review queue',mDue:'overdue',mUp:'within 7 days',mTimes:'times',
    nPy:'Python lesson notes',nEn:'English day notes',nCb:'Copybooks (english / coding)',nRf:'Weekly / monthly reflections',
    pTitle:'Title',pBio:'Bio',pSav:'Savings',pCerts:'Certificates',pProj:'Projects (portfolio)',pPrice:'price',
    anTime:'Study time — last 14 days',anTotal:'Total',anQuiz:'Quiz results (latest)',anCode:'Big coding tests',anBest:'best',
    sLang:'Language',sTheme:'Theme',sTargets:'Daily targets',sWork:'Work period',sPrayer:'Prayer settings',sNotify:'Notifications',sGate:'Sequential mode',on:'on',off:'off',
    pwT:'Change controller password',pwCur:'Current password',pwNew:'New password (≥ 6)',pwGo:'Change',pwOk:'Password changed',pwBad:'Current password is wrong',noState:'The learner has not synced any progress yet.',refresh:'Refresh',
    hTag_controller:'Controller · Invigilator',hTag_teacher:'Teacher panel',hTag_english:'English support panel',
    nTimeline:'Timeline',nAssign:'Assignments',nFeedback:'Feedback',nReviews:'Writing / Speaking',nEnglish:'English',nProjects:'Projects',nPnotes:'Private notes',
    tlT:'Activity timeline',tlS:'Only real stored events: page opens (heartbeat), lesson/quiz/mistake/review (student log), session events.',tlNone:'No events',tlDay:'Day',tlAll:'All',
    evOpen:'Opened',ev_py_done:'Python lesson closed','ev_py-done':'Python lesson closed','ev_py-quiz':'Python quiz','ev_eng-done':'English day closed',ev_quiz:'Quiz',ev_mistake:'Mistake recorded',ev_read:'Reading/listening result',ev_review:'Review',ev_flag:'Done',ev_plan:'Plan item',
    asT:'Assignments',asNew:'New assignment',asTitle:'Title',asDesc:'Description',asType:'Type',asCourse:'Course',asRoute:'Route (#/…)',asPr:'Priority',asDue:'Due',asSave:'Save',asCancel:'Cancel',asEdit:'Edit',asDel:'Delete',asDelQ:'Delete this assignment?',asNone:'No assignments',asOpen:'Open',asDone:'Completed',asOverdue:'Overdue',asRate:'Completion',asPick:'Quick routes',
    st_assigned:'Assigned',st_in_progress:'In progress',st_completed:'Completed',st_overdue:'Overdue',pr_low:'low',pr_normal:'normal',pr_high:'high',
    fbT:'Feedback',fbNew:'New feedback',fbAct:'Activity',fbKind:'Kind',fbRef:'Reference',fbTitle:'Title',fbText:'Text',fbVis:'Visibility',fbVisS:'Student can see',fbVisP:'Private note (only you)',fbStr:'Strengths',fbWeak:'Weaknesses',fbCorr:'Corrections',fbRec:'Recommendations',fbNext:'Next task',fbNone:'No feedback',fbPrivate:'private',fbStudent:'to student',
    rvT:'Writing / Speaking review',rvS:'Submitted → reviewed → revised → second review → completed. No automatic grading — you write it.',rvNone:'Nothing submitted',rvQueue:'Queue',rvDone:'Completed',rvText:'Student text',rvGive:'Write feedback',rvBand:'Band (optional)',rvResult:'Result (speaking)',rvComplete:'Complete',rvReopen:'Reopen',rvHist:'Stages',
    stage_submitted:'submitted',stage_reviewed:'reviewed',stage_revised:'revised',stage_reviewed2:'second review',stage_completed:'completed',stage_reopened:'reopened',res_completed:'completed',res_incomplete:'incomplete',
    enT:'English teaching workspace',enDay:'Current day',enGram:'Grammar',enVoc:'Vocabulary',enRead:'Reading',enLis:'Listening',enSpk:'Speaking',enWr:'Writing',enWeak:'Weak areas',enRecent:'Recent activity',enQuiz:'Quiz results',enPr:'Practice results',enRv:'Review queue',enFb:'Your feedback',enAs:'Assignments',
    taT:'Teacher analytics',taRate:'Assignment completion',taOver:'Overdue',taWr:'Writing submissions',taSpk:'Speaking activity',taRv:'Review completion',taWeak:'Where help is needed',
    caT:'Activity analytics',caSess:'Sessions',caActive:'Active time',caInact:'Inactivity',caLastSeen:'Last seen',caTask:'Current task',caComm:'Communication',caMsgs:'messages',caToday:'today',ca7:'7 days',ca30:'30 days',
    convWith:'Chat with the student',pnT:'Private notes (only you)',pnS:"The student never sees these. 'Private' entries from Feedback also live here.",
    pwT2:'Change password (your role)',roleYou:'You',filtered:'English data only (Python hidden on the server)'}};
  var lang=localStorage.getItem('uzla.ctrlLang')==='en'?'en':'uz';
  function t(k,v){var s=(T[lang][k]||k);if(v)Object.keys(v).forEach(function(x){s=s.replace('{'+x+'}',v[x])});return s}
  function paint(){document.documentElement.lang=lang;$$('[data-t]').forEach(function(el){el.textContent=t(el.dataset.t)});$$('[data-lang]').forEach(function(b){b.classList.toggle('on',b.dataset.lang===lang)});localStorage.setItem('uzla.ctrlLang',lang)}
  $$('[data-lang]').forEach(function(b){b.addEventListener('click',function(){lang=b.dataset.lang;paint();if(window.Store&&Store.all()){Store.all().lang=lang}render()})});
  paint();
  function ago(ts){if(!ts)return t('never');var d=Math.round((Date.now()-ts)/1000);if(d<60)return t('ago',{n:d});if(d<3600)return t('agoM',{n:Math.round(d/60)});return t('agoH',{n:Math.round(d/36)/100})}
  function hm(ts){var d=new Date(ts);return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
  function dmy(ts){var d=new Date(ts);return d.getDate()+'.'+('0'+(d.getMonth()+1)).slice(-2)+' '+hm(ts)}
  function fmtH(min){return (min/60).toFixed(min%60?1:0)+' h'}

  /* Kirish yo'q — yagona /login sahifasi. Bu yerda faqat sessiya tekshiriladi. */
  function toLogin(reason){location.replace('/login?next=%2Fcontroller'+(reason?'&'+reason+'=1':''))}
  /* Yagona chiqish: /api/logout ikkala cookie'ni tozalaydi → yagona login sahifasi */
  $('#logout').addEventListener('click',function(){fetch('/api/logout',{method:'POST',credentials:'same-origin'}).then(function(){location.replace('/login')},function(){location.replace('/login')})});

  /* ---------- holat ---------- */
  var feed=null,doc=null,tab='overview',timer=null,lastMsgId=null,hasState=false,role='controller';
  /* Rolga qarab tablar — server baribir har amalni tekshiradi */
  var TABSET={
    controller:[['overview','home'],['timeline','clock'],['today','today'],['chat','eye'],['analytics','trend'],['pnotes','pen'],['courses','book'],['mistakes','alert'],['settings','settings']],
    teacher:[['overview','home'],['assign','checklist'],['feedback','star'],['reviews','pen'],['timeline','clock'],['courses','book'],['mistakes','alert'],['vocab','notebook'],['notes','doc'],['projects','rocket'],['chat','mic'],['analytics','trend'],['pnotes','lock'],['settings','settings']],
    english:[['english','globe'],['assign','checklist'],['feedback','star'],['reviews','pen'],['timeline','clock'],['mistakes','alert'],['vocab','notebook'],['chat','mic'],['analytics','trend'],['pnotes','lock'],['settings','settings']]
  };
  function TABS(){return TABSET[role]||TABSET.controller}
  function enter(r){role=r||'controller';tab=TABS()[0][0];$('#gate').hidden=true;$('#panel').hidden=false;var tag=$('[data-t="hTag"]');if(tag)tag.textContent=t('hTag_'+role);document.title=t('hTag_'+role)+' — UzLeeder Academy';Store.init();Store.all().lang=lang;loadState();poll();timer=setInterval(function(){poll();if(tab!=='chat')loadState()},tab==='chat'?5000:30000)}
  function loadState(){return fetch('/api/ctrl/state',{credentials:'same-origin'}).then(function(r){return r.ok?r.json():null}).then(function(j){if(!j)return;doc=j;if(j.state){Store.replace(j.state,true);Store.all().lang=lang;hasState=true}renderNav();renderMain()}).catch(function(){})}
  function poll(){return fetch('/api/ctrl/io',{credentials:'same-origin'}).then(function(r){if(r.status===401){toLogin('expired');return}return r.json()}).then(function(j){if(!j)return;feed=j;$('#pPoll').classList.add('on');$('#pPollT').textContent='sync '+hm(j.now);var st=j.status||{};$('#pLearner').classList.toggle('on',!!st.online);$('#pLearnerT').textContent=st.online?t('online'):t('offline');if(tab==='chat'||tab==='overview'||tab==='timeline')renderMain();else renderNav()}).catch(function(){$('#pPoll').classList.remove('on');$('#pPollT').textContent='offline'})}
  function post(body){return fetch('/api/ctrl/io',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()})}

  function renderNav(){
    var open=hasState?Store.openMistakes().length:0,unread=myConv().unread||0,rvq=feed?(feed.reviews||[]).filter(function(r){return r.stage==='submitted'||r.stage==='revised'}).length:0,asOver=feed?(feed.assignments||[]).filter(function(a){return a.status!=='completed'&&a.due&&a.due<todayKey()}).length:0;
    $('#ctNav').innerHTML='<div class="lbl">'+esc(t('roleYou'))+': '+esc(t('hTag_'+role))+'</div>'+TABS().map(function(x){var badge=x[0]==='mistakes'&&open?'<span class="badge">'+open+'</span>':x[0]==='chat'&&unread?'<span class="badge hot">'+unread+'</span>':x[0]==='reviews'&&rvq?'<span class="badge hot">'+rvq+'</span>':x[0]==='assign'&&asOver?'<span class="badge hot">'+asOver+'</span>':'';return '<button data-tab="'+x[0]+'" class="'+(tab===x[0]?'on':'')+'">'+(IC[x[1]]||'')+'<span>'+esc(t('n'+x[0].charAt(0).toUpperCase()+x[0].slice(1)))+'</span>'+badge+'</button>'}).join('');
    $$('[data-tab]').forEach(function(b){b.addEventListener('click',function(){tab=b.dataset.tab;renderNav();renderMain();window.scrollTo(0,0)})});
  }
  function render(){renderNav();renderMain()}
  function myConv(){return feed&&feed.convs&&feed.convs[role]?feed.convs[role]:{msgs:[],unread:0,read:{}}}
  function todayKey(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function stOf(a){return a.status==='completed'?'completed':(a.due&&a.due<todayKey()?'overdue':a.status||'assigned')}
  function ymd(ts){var d=new Date(ts);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function fbStruct(fb){if(!fb)return '';var ks=[['strengths','fbStr'],['weaknesses','fbWeak'],['corrections','fbCorr'],['recommendations','fbRec'],['next','fbNext']];return '<div class="fb-struct">'+ks.filter(function(k){return fb[k[0]]}).map(function(k){return '<div class="fb-k"><span>'+esc(t(k[1]))+'</span><p>'+esc(fb[k[0]])+'</p></div>'}).join('')+'</div>'}
  function isEnglishEv(e){return !/^(py|dc|code)/.test(e.type||'')&&!/^(py|dc|code|lesson)/.test(e.ref||'')}
  function card(title,body,extra){return '<section class="card"'+(extra||'')+'><h3 class="card-title">'+esc(title)+'</h3>'+body+'</section>'}
  function tile(l,v,note,cls){return '<div class="stat-tile '+(cls||'')+'"><div class="st-l">'+esc(l)+'</div><div class="st-v">'+v+'</div>'+(note?'<div class="st-note">'+esc(note)+'</div>':'')+'</div>'}
  function bar(v,cls){return '<div class="bar '+(cls||'')+'"><i style="width:'+Math.max(0,Math.min(100,v))+'%"></i></div>'}

  function renderMain(){
    var m=$('#ctMain');if(!m)return;
    var noStateOk={chat:1,overview:1,assign:1,feedback:1,reviews:1,pnotes:1,timeline:1,settings:1};
    if(!hasState&&!noStateOk[tab]){m.innerHTML='<h1>'+esc(t('n'+tab.charAt(0).toUpperCase()+tab.slice(1)))+'</h1><div class="callout tip"><span class="co-ic">'+IC.cloud+'</span><div>'+esc(t('noState'))+'</div></div>';return}
    var R={overview:vOverview,today:vToday,courses:vCourses,vocab:vVocab,mistakes:vMistakes,notes:vNotes,movies:vMovies,profile:vProfile,analytics:vAnalytics,settings:vSettings,chat:vChat,
      timeline:vTimeline,assign:vAssign,feedback:vFeedback,reviews:vReviews,english:vEnglish,projects:vProjects,pnotes:vPnotes};
    if(role==='english'&&tab==='analytics')R.analytics=vEnglishAn; if(role==='teacher'&&tab==='analytics')R.analytics=vTeacherAn; if(role==='controller'&&tab==='analytics')R.analytics=vCtrlAn;
    try{m.innerHTML=R[tab]()}catch(e){m.innerHTML='<div class="callout pitfall"><span class="co-ic">'+IC.alert+'</span><div>'+esc(e.message)+'</div></div>'}
    if(tab==='chat')mountChat();
    if(tab==='settings')mountPw();
    if(tab==='assign')mountAssign();
    if(tab==='feedback')mountFeedback();
    if(tab==='reviews')mountReviews();
    if(tab==='pnotes')mountPnotes();
  }

  /* ---------- 1. Umumiy ---------- */
  function vOverview(){
    var st=(feed&&feed.status)||{},state=st.state||'idle',cur=feed?(feed.sessions||[]).filter(function(s){return !s.endedAt})[0]:null;
    var h='<h1>'+esc(t('nOverview'))+'</h1><p class="lede">'+esc(Store.get('name')||'—')+' · '+esc(t('kSaved'))+': '+(doc&&doc.savedAt?esc(dmy(doc.savedAt))+' ('+esc(ago(doc.savedAt))+')':'—')+' <button class="btn btn-quiet btn-sm" id="ctRefresh">'+IC.refresh+esc(t('refresh'))+'</button></p>';
    if(hasState){
      var debt=Goal.debt().days,req=Goal.required(),dm=Goal.doneMinutes(),pm=Mastery.python(),em=Mastery.english();
      h+='<div class="stat-grid" style="margin-bottom:18px">'+
        tile(t('stPy'),Store.doneCount()+'<small> / '+COURSE.length+'</small>',null,'accent')+
        tile(t('stEn'),Store.engDoneCount()+'<small> / '+ENGLISH.meta.days+'</small>')+
        tile(t('stDc'),(window.DataCamp?DataCamp.doneCount()+'<small> / '+DataCamp.total()+'</small>':'—'),window.DataCamp&&DataCamp.overdue().length?DataCamp.overdue().length+' overdue':'')+
        tile(t('stStreak'),HabitPlan.streak()+'<small> d</small>',null,HabitPlan.streak()?'gold':'')+
        tile(t('stDebt'),debt,null,debt?'red':'')+
        tile(t('stToday'),(dm.eng/60).toFixed(1)+'<small>/'+(req.eng/60)+' EN</small> '+(dm.code/60).toFixed(1)+'<small>/'+(req.code/60)+' code</small>')+
        tile(t('stMastery'),Math.round((pm.overall+em.overall)/2)+'<small>%</small>','Python '+pm.overall+'% · EN '+em.overall+'%')+
        tile(t('stWords'),Store.copyList('vocab').length)+
        tile(t('stMis'),Store.openMistakes().length,null,Store.openMistakes().length?'red':'')+
        tile(t('stDue'),window.Review?Review.dueCount():0)+
        '</div>';
    }
    h+='<div class="two">'+card(t('learner'),'<div class="kv"><span>'+esc(t('kName'))+'</span><b>'+esc(st.name||Store.get('name')||'—')+'</b><span>'+esc(t('kPage'))+'</span><b>'+(st.title?esc(st.title)+' <code style="color:var(--muted);font-size:12px">#/'+esc(st.route||'')+'</code>':'—')+'</b><span>'+esc(t('kSeen'))+'</span><b>'+esc(ago(feed&&feed.seen&&feed.seen.learner))+'</b><span>'+esc(t('kSince'))+'</span><b>'+(st.since?esc(dmy(st.since))+' · '+esc(ago(st.since)):'—')+'</b><span>'+esc(t('kActive'))+'</span><b>'+(cur?cur.activeMin+' '+esc(t('min')):'—')+'</b><span>Status</span><b><span class="state '+state+'">'+state.toUpperCase()+'</span></b></div>'+
      (role==='controller'?'<div class="acts"><button class="btn btn-primary btn-sm" data-act="start"'+(cur?' disabled':'')+'>'+esc(t('aStart'))+'</button><button class="btn btn-ghost btn-sm" data-act="pause"'+(state!=='active'?' disabled':'')+'>'+esc(t('aPause'))+'</button><button class="btn btn-ghost btn-sm" data-act="resume"'+(state!=='paused'?' disabled':'')+'>'+esc(t('aResume'))+'</button><button class="btn btn-quiet btn-sm danger" data-act="finish"'+(!cur?' disabled':'')+'>'+esc(t('aFinish'))+'</button></div>':''))+
      card(t('sLog'),'<div class="log">'+(feed&&(feed.status||{}).recent&&feed.status.recent.length?feed.status.recent.slice().reverse().map(function(r){return '<div><time>'+hm(r.at)+'</time><span>'+esc(r.title||r.route)+'</span><code>#/'+esc(r.route)+'</code></div>'}).join(''):'<div class="empty">'+esc(t('none'))+'</div>')+'</div>')+'</div>';
    if(hasState){
      var key=Store.dateKey(),plan=HabitPlan.inRange(key)?HabitPlan.forDate(key):null;
      if(plan){var dn=HabitPlan.doneCount(plan);h+='<section class="card" style="margin-top:16px"><h3 class="card-title">'+esc(t('tdBlocks'))+' · '+dn+'/'+plan.coreCount+'</h3>'+bar(plan.coreCount?dn/plan.coreCount*100:0)+'<div class="strip" style="margin-top:10px">'+plan.blocks.filter(function(b){return b.core}).map(function(b){return '<i class="'+(Store.habitBlock(key,b.id)?'ok':'')+'" title="'+esc(b.fromStr+' '+L(b.t))+'">'+esc(b.fromStr.slice(0,2))+'</i>'}).join('')+'</div></section>'}
    }
    setTimeout(function(){var r=$('#ctRefresh');if(r)r.addEventListener('click',function(){loadState();poll()});$$('[data-act]').forEach(function(b){b.addEventListener('click',function(){if(b.dataset.act==='finish'&&!confirm('Finish?'))return;post({op:'session',action:b.dataset.act}).then(poll)})})},0);
    return h;
  }

  /* ---------- 2. Bugun va intizom ---------- */
  function vToday(){
    var key=Store.dateKey(),h='<h1>'+esc(t('nToday'))+'</h1><p class="lede">'+esc(fmtDateKey(key))+'</p>';
    var req=Goal.required(),dm=Goal.doneMinutes(),debt=Goal.debt();
    h+='<div class="stat-grid" style="margin-bottom:16px">'+tile(t('tdHours')+' · '+t('eng'),fmtH(dm.eng)+'<small> / '+fmtH(req.eng)+'</small>',null,dm.eng>=req.eng?'gold':'')+tile(t('tdHours')+' · '+t('code'),fmtH(dm.code)+'<small> / '+fmtH(req.code)+'</small>',null,dm.code>=req.code?'gold':'')+tile(t('stStreak'),HabitPlan.streak())+tile(t('stDebt'),debt.days,null,debt.days?'red':'')+'</div>';
    /* 21 kun */
    var s='';for(var i=20;i>=0;i--){var k=Store.shiftDays(key,-i);if(!HabitPlan.inRange(k)){s+='<i title="'+k+'">·</i>';continue}var p=HabitPlan.forDate(k),ok=HabitPlan.isDayDone(p);s+='<i class="'+(ok?'ok':k<key?'miss':'')+(k===key?' today':'')+'" title="'+k+' · '+HabitPlan.doneCount(p)+'/'+p.coreCount+'">'+k.slice(8)+'</i>'}
    h+=card(t('tdLast'),'<div class="strip">'+s+'</div>');
    if(HabitPlan.inRange(key)){var plan=HabitPlan.forDate(key);h+='<section class="card"><h3 class="card-title">'+esc(t('tdBlocks'))+' · '+esc(L(plan.tpl.name))+' · '+HabitPlan.doneCount(plan)+'/'+plan.coreCount+'</h3><div class="hb-list">'+plan.blocks.map(function(b){var on=Store.habitBlock(key,b.id),kind=HABIT.kinds[b.kind]||{icon:'spark'};return '<div class="hb-row'+(on?' done':'')+' k-'+b.kind+'"><span class="hb-check">'+(on?IC.check:'')+'</span><div class="hb-time"><b>'+esc(b.fromStr)+'</b><span>'+esc(b.toStr)+'</span></div><div class="hb-body"><div class="hb-t"><span class="hb-ic">'+(IC[kind.icon]||IC.spark)+'</span>'+esc(L(b.t))+(b.core?'':' <span class="hb-opt">extra</span>')+'</div>'+(b.book?'<div class="hb-book">'+IC.book+esc(b.book)+'</div>':'')+'</div><div class="hb-right"><span class="hb-min">'+b.min+' min</span></div></div>'}).join('')+'</div></section>'}
    if(debt.list.length)h+=card(t('tdDebtList')+' · '+debt.days,'<div class="pr-tags">'+debt.list.slice(-30).map(function(k){return '<span class="chip hot">'+esc(fmtDateKey(k))+'</span>'}).join('')+'</div>');
    return h;
  }

  /* ---------- 3. Kurslar ---------- */
  function vCourses(){
    var h='<h1>'+esc(t('nCourses'))+'</h1><p class="lede">Python '+Store.doneCount()+'/'+COURSE.length+' · EN '+Store.engDoneCount()+'/'+ENGLISH.meta.days+(window.DataCamp?' · DataCamp '+DataCamp.doneCount()+'/'+DataCamp.total():'')+(window.Quick?' · Quick '+Quick.doneCount()+'/'+Quick.total():'')+'</p>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('cPy'))+'</h3>'+bar(Store.doneCount()/COURSE.length*100)+'<div class="strip" style="margin-top:10px">'+COURSE.map(function(d){var b=Store.bestScore(d.day);return '<i class="'+(Store.isDone(d.day)?'ok':b!==undefined?'miss':'')+'" title="'+esc(d.day+' · '+L(d.title)+(b!==undefined?' · '+b+'/10':''))+'">'+d.day+'</i>'}).join('')+'</div></section>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('cEn'))+'</h3>'+bar(Store.engDoneCount()/ENGLISH.meta.days*100)+'<div class="strip" style="margin-top:10px">'+(window.ENG_INTRO||[]).map(function(d){return '<i class="'+(Store.engDayDone(d.d)?'ok':'')+'" title="'+esc(L(d.title))+'">i'+d.i+'</i>'}).join('')+ENG_DAYS.map(function(d){var k=EngCal.dayKey(d.d),tk=Store.dateKey();return '<i class="'+(Store.engDayDone(d.d)?'ok':k<tk?'miss':'')+(k===tk?' today':'')+'" title="'+esc(d.d+' · '+k+' · '+L(d.title))+'">'+d.d+'</i>'}).join('')+'</div></section>';
    if(window.DataCamp){h+='<section class="card"><h3 class="card-title">'+esc(t('cDc'))+'</h3><table class="tbl"><tr><th>#</th><th>'+esc(t('cDc'))+'</th><th>Date</th><th>'+esc(t('cQuiz'))+'</th><th></th></tr>'+DataCamp.items().map(function(it){var q=Store.quizGet('dc:'+it.id),dn=DataCamp.isDone(it);return '<tr class="'+(dn?'done':'')+'"><td class="mono">'+(dn?'✓':it.n)+'</td><td>'+esc(it.title)+'<br><small style="color:var(--muted)">'+esc(it.course?it.course.title:'Project')+'</small></td><td class="mono">'+esc(it.date)+'</td><td class="mono">'+(q?q.best+'/'+q.bestTotal:'—')+'</td><td>'+(it.date<Store.dateKey()&&!dn?'<span class="chip hot">late</span>':'')+'</td></tr>'}).join('')+'</table></section>'}
    if(window.Quick){h+='<section class="card"><h3 class="card-title">'+esc(t('cQk'))+' · '+Quick.doneCount()+'/'+Quick.total()+'</h3><div class="strip">'+QUICK10.days.map(function(d){return '<i class="'+(Store.flag('q10:'+d.n+':done')?'ok':'')+'" title="'+esc(L(d.title))+'">'+d.n+'</i>'}).join('')+'</div>'+(Store.quizGet('q10:final')?'<p class="hint">'+esc(t('anQuiz'))+': '+Store.quizGet('q10:final').best+'/'+Store.quizGet('q10:final').bestTotal+'</p>':'')+'</section>'}
    h+='<div class="two">';
    h+='<section class="card"><h3 class="card-title">'+esc(t('cSpk'))+' · '+Store.speakDoneCount()+'/30</h3><div class="strip">'+SPEAK30.days.map(function(d){return '<i class="'+(Store.speakNote(d.n)?'ok':'')+'">'+d.n+'</i>'}).join('')+'</div></section>';
    var wr=Object.keys(Store.all().plan).filter(function(k){return /^wr\d+$/.test(k)&&Store.all().plan[k]}).length;
    h+='<section class="card"><h3 class="card-title">'+esc(t('cWr'))+' · '+wr+'/'+WRITING.weeks.length+'</h3><div class="strip">'+WRITING.weeks.map(function(w){return '<i class="'+(Store.planDone('wr'+w.n)?'ok':'')+'" title="'+esc(L(w.title))+'">'+w.n+'</i>'}).join('')+'</div></section>';
    h+='</div>';
    var sc=Store.engScoreList();
    h+='<section class="card"><h3 class="card-title">'+esc(t('cMock'))+'</h3>'+(sc.length?'<table class="tbl"><tr><th>Day</th><th>L</th><th>R</th><th>W</th><th>S</th><th>Overall</th></tr>'+sc.map(function(r){var ov=Store.engOverall(r);return '<tr><td class="mono">'+esc(String(r.day))+'</td><td>'+r.l+'</td><td>'+r.r+'</td><td>'+r.w+'</td><td>'+r.s+'</td><td><b>'+(ov!==null?ov.toFixed(1):'—')+'</b></td></tr>'}).join('')+'</table>':'<div class="empty">'+esc(t('none'))+'</div>')+'</section>';
    return h;
  }

  /* ---------- 4. Lug'at daftari ---------- */
  function vVocab(){
    var list=Store.copyList('vocab'),key=Store.dateKey();
    var h='<h1>'+esc(t('nVocab'))+'</h1><p class="lede">'+list.length+' '+esc(t('vWords').toLowerCase())+(window.Books?' · '+esc(Books.vocabTodayLabel(Books.today())):'')+'</p>';
    var s='';for(var i=14;i>=0;i--){var k=Store.shiftDays(key,-i),n=window.Books?Books.wordsAddedOn(k):0;s+='<i class="'+(n>=40?'ok':n>0?'':'')+(k===key?' today':'')+'" title="'+k+' · '+n+'" style="width:34px">'+n+'</i>'}
    h+=card(t('vDay'),'<div class="strip">'+s+'</div>');
    if(!list.length)return h+'<div class="empty">'+esc(t('vNone'))+'</div>';
    h+='<section class="card"><table class="tbl"><tr><th>#</th><th>word</th><th>'+esc(t('vPos'))+'</th><th>'+esc(t('vTr'))+'</th><th>'+esc(t('vSyn'))+'</th><th>'+esc(t('vEx'))+'</th><th>SRS</th><th>Date</th></tr>'+list.slice(0,400).map(function(e,i){var rv=window.Review?Review.status(Store.reviewAll()['vocab:'+e.id]):'';return '<tr><td class="mono">'+(i+1)+'</td><td><b>'+esc(e.word||'')+'</b>'+(e.ipa?'<br><small class="mono" style="color:var(--muted)">'+esc(e.ipa)+'</small>':'')+'</td><td class="mono">'+esc(e.pos||'')+'</td><td>'+esc(e.tr||'')+'</td><td>'+esc(e.syn||'')+'</td><td style="color:var(--muted)">'+esc(e.ex||'')+'</td><td class="mono">'+esc(rv)+'</td><td class="mono">'+esc(fmtDate(e.created||e.at))+'</td></tr>'}).join('')+'</table></section>';
    return h;
  }

  /* ---------- 5. Xatolar ---------- */
  function vMistakes(){
    var open=Store.openMistakes(),all=Store.mistakes(),rv=window.Review?Review.list():[],due=window.Review?Review.due():[];
    var h='<h1>'+esc(t('nMistakes'))+'</h1><p class="lede">'+open.length+' '+esc(t('mOpen').toLowerCase())+' · '+(all.length-open.length)+' '+esc(t('mFixed'))+' · '+esc(t('mRev'))+' '+rv.length+' ('+due.length+' '+esc(t('mDue'))+')</p>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('mOpen'))+'</h3>'+(open.length?'<table class="tbl"><tr><th>cat</th><th>question</th><th>chosen → correct</th><th>'+esc(t('mTimes'))+'</th><th>date</th></tr>'+open.slice(0,200).map(function(m){return '<tr><td class="mono">'+esc(m.cat||'python')+'</td><td>'+esc(m.q)+'<br><small style="color:var(--muted)">'+esc(m.topic||'')+'</small></td><td><span style="color:var(--red)">'+esc(m.chosen)+'</span> → <span style="color:var(--green)">'+esc(m.correct)+'</span></td><td class="mono">'+(m.times||1)+'</td><td class="mono">'+esc(fmtDate(m.at))+'</td></tr>'}).join('')+'</table>':'<div class="empty">'+esc(t('none'))+'</div>')+'</section>';
    var kinds={};rv.forEach(function(it){kinds[it.kind]=(kinds[it.kind]||0)+1});
    h+=card(t('mRev'),'<div class="pr-tags">'+Object.keys(kinds).map(function(k){return '<span class="chip">'+esc(k)+' '+kinds[k]+'</span>'}).join('')+'<span class="chip hot">'+esc(t('mDue'))+' '+due.length+'</span><span class="chip">'+esc(t('mUp'))+' '+(window.Review?Review.upcoming(7):0)+'</span></div>');
    return h;
  }

  /* ---------- 6. Eslatmalar ---------- */
  function vNotes(){
    var h='<h1>'+esc(t('nNotes'))+'</h1>';
    var py=Store.notesList(),en=Store.engNotesList();
    h+='<div class="two">'+card(t('nPy')+' · '+py.length,py.length?py.map(function(n){var d=dayOf(n.day);return '<div class="hb-note" style="margin:0 0 10px"><b>'+esc('Day '+n.day+(d?' · '+L(d.title):''))+'</b><br>'+esc(n.text)+'<br><small class="mono" style="color:var(--muted)">'+esc(fmtDate(n.at))+'</small></div>'}).join(''):'<div class="empty">'+esc(t('none'))+'</div>')+
      card(t('nEn')+' · '+en.length,en.length?en.map(function(n){var d=Eng.dayOf(n.day);return '<div class="hb-note" style="margin:0 0 10px"><b>'+esc('Day '+n.day+(d?' · '+L(d.title):''))+'</b><br>'+esc(n.text)+'<br><small class="mono" style="color:var(--muted)">'+esc(fmtDate(n.at))+'</small></div>'}).join(''):'<div class="empty">'+esc(t('none'))+'</div>')+'</div>';
    var ce=Store.copyList('english'),cc=Store.copyList('coding');
    h+='<section class="card" style="margin-top:16px"><h3 class="card-title">'+esc(t('nCb'))+' · '+(ce.length+cc.length)+'</h3>'+(ce.length+cc.length?'<table class="tbl"><tr><th>kind</th><th>title</th><th>text</th><th>date</th></tr>'+ce.map(function(e){return '<tr><td class="mono">en · '+esc(e.type||'')+'</td><td><b>'+esc(e.title||'')+'</b></td><td>'+esc((e.text||'').slice(0,300))+'</td><td class="mono">'+esc(fmtDate(e.at))+'</td></tr>'}).join('')+cc.map(function(e){return '<tr><td class="mono">code · '+esc(e.lang||'')+'</td><td><b>'+esc(e.title||'')+'</b></td><td><pre style="white-space:pre-wrap;font:12px var(--font-mono);margin:0">'+esc((e.code||'').slice(0,400))+'</pre>'+esc((e.text||'').slice(0,200))+'</td><td class="mono">'+esc(fmtDate(e.at))+'</td></tr>'}).join('')+'</table>':'<div class="empty">'+esc(t('none'))+'</div>')+'</section>';
    var rd=Store.readList(),rf=Object.keys(rd).filter(function(k){return k.indexOf('rf-')===0}).sort().reverse();
    if(rf.length)h+='<section class="card" style="margin-top:16px"><h3 class="card-title">'+esc(t('nRf'))+'</h3>'+rf.map(function(k){var r=rd[k];return '<div class="hb-note" style="margin:0 0 10px"><b>'+esc(k.slice(3))+'</b><br>'+['worked','blocked','focus'].map(function(q){return r[q]?'<div><i style="color:var(--muted)">'+q+':</i> '+esc(r[q])+'</div>':''}).join('')+'</div>'}).join('')+'</section>';
    return h;
  }

  /* ---------- 7. Kinolar ---------- */
  function vMovies(){
    var list=Store.movieList();
    var h='<h1>'+esc(t('nMovies'))+'</h1><p class="lede">'+list.length+' · watched '+list.filter(function(m){return m.done}).length+'</p>';
    if(!list.length)return h+'<div class="empty">'+esc(t('none'))+'</div>';
    h+='<div class="mgrid">'+list.map(function(m){var yt=String(m.url||'').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);var img=m.thumbUrl||(m.src==='yt'&&yt?'https://i.ytimg.com/vi/'+yt[1]+'/hqdefault.jpg':'');return '<div class="mcard"><div class="th">'+(img?'<img src="'+esc(img)+'" alt="">':IC.film)+'</div><div class="b"><b>'+esc(m.title||'')+'</b><span style="color:var(--muted)">'+esc([m.type||(m.src==='yt'?'video':'movie'),m.year,m.country].filter(Boolean).join(' · '))+' · '+(m.rate||'—')+'/10'+(m.done?' · ✓':'')+(m.cloud?' · cloud':'')+'</span></div></div>'}).join('')+'</div>';
    return h;
  }

  /* ---------- 8. Profil ---------- */
  function vProfile(){
    var p=Store.profile(),certs=Store.certList(),pj=Store.pprojList();
    var h='<h1>'+esc(t('nProfile'))+'</h1>';
    h+='<section class="card"><div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap"><div class="prof-avatar" style="cursor:default">'+(p.photo?'<img src="'+esc(p.photo)+'" alt="">':esc((Store.get('name')||'?').charAt(0).toUpperCase()))+'</div><div class="kv" style="flex:1;min-width:260px"><span>'+esc(t('kName'))+'</span><b>'+esc(Store.get('name')||'—')+'</b><span>'+esc(t('pTitle'))+'</span><b>'+esc(p.title||'—')+'</b><span>'+esc(t('pBio'))+'</span><b>'+esc(p.bio||'—')+'</b><span>'+esc(t('pSav'))+'</span><b>$'+esc(String(p.savings||0))+'</b></div></div></section>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('pCerts'))+' · '+certs.length+'</h3>'+(certs.length?'<div class="cert-grid ext">'+certs.map(function(c){return '<div class="cert-card ext ok"><span class="cc-img">'+(c.img?'<img src="'+esc(c.img)+'" alt="">':IC.doc)+'</span><span class="cc-t">'+esc(c.name)+'</span><span class="cc-s">'+esc([c.issuer,c.date].filter(Boolean).join(' · '))+'</span></div>'}).join('')+'</div>':'<div class="empty">'+esc(t('none'))+'</div>')+'</section>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('pProj'))+' · '+pj.length+'</h3>'+(pj.length?'<div class="pp-grid">'+pj.map(function(x){var yt=String(x.video||'').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);var cover=x.imgUrl||x.img||(yt?'https://i.ytimg.com/vi/'+yt[1]+'/hqdefault.jpg':'');return '<div class="pp-card"><div class="pp-cover'+(cover?'':' empty')+'">'+(cover?'<img src="'+esc(cover)+'" alt="">':IC.rocket)+(x.video?'<a class="pp-play" href="'+esc(x.video)+'" target="_blank" rel="noopener">'+IC.play+'</a>':'')+'</div><div class="pp-body"><div class="pp-top"><b>'+esc(x.name)+'</b>'+(x.price?'<span class="pp-tag">$'+esc(String(x.price))+'</span>':'')+'</div>'+(x.desc?'<p>'+esc(x.desc)+'</p>':'')+'</div></div>'}).join('')+'</div>':'<div class="empty">'+esc(t('none'))+'</div>')+'</section>';
    return h;
  }

  /* ---------- 9. Tahlil ---------- */
  function vAnalytics(){
    var key=Store.dateKey(),days=[],max=1,tot=0;for(var i=13;i>=0;i--){var k=Store.shiftDays(key,-i),m=StudyTime.minutesOn(k);days.push({key:k,min:m});max=Math.max(max,m);tot+=m}
    var pm=Mastery.python(),em=Mastery.english();
    var h='<h1>'+esc(t('nAnalytics'))+'</h1><p class="lede">'+esc(t('anTotal'))+': '+esc(fmtH(StudyTime.total()))+'</p>';
    h+=card(t('anTime')+' · '+fmtH(tot),'<div class="an-bars">'+days.map(function(d){return '<div class="an-bar" title="'+d.key+' · '+d.min+' min"><i style="height:'+Math.round(d.min/max*100)+'%"></i><span>'+d.key.slice(8)+'</span></div>'}).join('')+'</div>');
    var row=function(l,v){return '<div class="ms-row"><span>'+esc(l)+'</span>'+bar(v)+'<b>'+v+'%</b></div>'};
    h+='<div class="two">'+card('Python · '+pm.overall+'%',row('knowledge',pm.knowledge)+row('practice',pm.practice)+row('retention',pm.retention)+row('application',pm.application))+card('English · '+em.overall+'%',row('vocab',em.vocab)+row('grammar',em.grammar)+row('reading',em.reading)+row('listening',em.listening)+row('speaking',em.speaking)+row('writing',em.writing))+'</div>';
    var qz=Store.all().quiz,keys=Object.keys(qz).sort(function(a,b){return (qz[b].at||0)-(qz[a].at||0)}).slice(0,40);
    h+='<section class="card" style="margin-top:16px"><h3 class="card-title">'+esc(t('anQuiz'))+'</h3>'+(keys.length?'<table class="tbl"><tr><th>key</th><th>last</th><th>'+esc(t('anBest'))+'</th><th>n</th><th>date</th></tr>'+keys.map(function(k){var q=qz[k];return '<tr><td class="mono">'+esc(k)+'</td><td class="mono">'+q.score+'/'+q.total+'</td><td class="mono">'+q.best+'/'+(q.bestTotal||q.total)+'</td><td class="mono">'+(q.n||1)+'</td><td class="mono">'+esc(q.at?fmtDate(q.at):'')+'</td></tr>'}).join('')+'</table>':'<div class="empty">'+esc(t('none'))+'</div>')+'</section>';
    var rd=Store.readList(),ct=Object.keys(rd).filter(function(k){return k.indexOf('codetest-')===0}).sort().reverse();
    if(ct.length)h+=card(t('anCode'),'<div class="pr-tags">'+ct.map(function(k){var r=rd[k];return '<span class="chip '+(r.score/r.total>=.7?'ok':'hot')+'">'+esc(k.slice(9))+' · '+r.score+'/'+r.total+'</span>'}).join('')+'</div>');
    return h;
  }

  /* ---------- 10. Sozlamalar (o'quvchiniki — o'qish; nazoratchi paroli) ---------- */
  function vSettings(){
    var s=Store.all().settings||{},w=HabitPlan.workCfg(),pc=s.prayer||{};
    var h='<h1>'+esc(t('nSettings'))+'</h1>';
    h+=card(t('learner'),'<div class="kv"><span>'+esc(t('sLang'))+'</span><b>'+esc(Store.get('lang'))+'</b><span>'+esc(t('sTheme'))+'</span><b>'+esc(Store.get('theme'))+'</b><span>'+esc(t('sTargets'))+'</span><b>EN '+(s.targetEng||240)+' · code '+(s.targetCodeHeavy||240)+' / '+(s.targetCodeClass||120)+' min</b><span>'+esc(t('sWork'))+'</span><b>'+(w.on?esc(t('on'))+' · '+esc(w.from)+' → '+esc(w.to)+' · '+w.min+' min':esc(t('off')))+'</b><span>'+esc(t('sPrayer'))+'</span><b>'+esc(pc.city||'tashkent')+' · asr '+(pc.asr||2)+' · '+(pc.fajr||18)+'°</b><span>'+esc(t('sNotify'))+'</span><b>'+esc(s.notify?t('on'):t('off'))+'</b><span>'+esc(t('sGate'))+'</span><b>'+esc(s.gate?t('on'):t('off'))+'</b></div>');
    h+='<section class="card"><h3 class="card-title">'+esc(t('pwT2'))+'</h3><p class="lede" style="margin-bottom:10px">'+esc(t('roleYou'))+': <b>'+esc(t('hTag_'+role))+'</b> · '+esc(t('pwOwn'))+'</p><form id="pf" style="max-width:380px"><div class="field"><label>'+esc(t('pwCur'))+'</label><input class="input" id="pc" type="password" autocomplete="current-password" required></div><div class="field"><label>'+esc(t('pwNew'))+'</label><input class="input" id="pn" type="password" autocomplete="new-password" required minlength="6"></div><button class="btn btn-primary btn-sm" type="submit">'+esc(t('pwGo'))+'</button><div class="err" id="pe"></div></form></section>';
    return h;
  }
  function mountPw(){var f=$('#pf');if(!f)return;f.addEventListener('submit',function(ev){ev.preventDefault();var pe=$('#pe');pe.classList.remove('show');fetch('/api/password',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({current:$('#pc').value,next:$('#pn').value})}).then(function(r){pe.textContent=r.status===200?t('pwOk'):t('pwBad');pe.style.color=r.status===200?'var(--green)':'';pe.classList.add('show');if(r.status===200){$('#pc').value='';$('#pn').value=''}})})}

  /* ---------- 11. Chat va sessiya ---------- */
  function vChat(){
    var st=(feed&&feed.status)||{},state=st.state||'idle';
    var h='<h1>'+esc(t('nChat'))+'</h1>';
    h+='<div class="two"><section class="card chat"><h3 class="card-title" style="display:flex;align-items:center;gap:8px"><span>'+esc(t('sChat'))+'</span><span class="sp"></span><span class="state '+state+'">'+state.toUpperCase()+'</span></h3><div class="msgs" id="msgs"></div><div class="send"><textarea id="txt" rows="2" placeholder="…"></textarea><button class="btn btn-primary" id="send">'+esc(t('send'))+'</button></div><div class="hint">'+esc(t('cHint'))+'</div></section>';
    h+='<div style="display:grid;gap:16px;align-content:start"><section class="card"><h3 class="card-title">'+esc(t('sNotes'))+'</h3><textarea class="notes" id="notes"></textarea><div class="hint" id="notesSt"></div></section>';
    var hs=feed?(feed.sessions||[]).slice().reverse():[];
    h+='<section class="card"><h3 class="card-title">'+esc(t('sHist'))+'</h3><div class="hist">'+(hs.length?hs.map(function(s){var n=(s.events||[]).filter(function(e){return e.type==='pause'}).length;return '<div><span>'+dmy(s.startedAt)+(s.endedAt?' → '+hm(s.endedAt):' · <b style="color:var(--green)">'+(state==='paused'?'PAUSED':'ACTIVE')+'</b>')+'</span><small>'+s.activeMin+' '+esc(t('min'))+' · ⏸ '+n+'</small><small>'+esc(t('by'))+': '+esc(s.by)+'</small></div>'}).join(''):'<div class="empty">'+esc(t('none'))+'</div>')+'</div></section></div></div>';
    return h;
  }
  function mountChat(){
    if(!feed)return;
    var cv=myConv();
    var items=(cv.msgs||[]).map(function(m){return{at:m.at,html:'<div class="m '+(m.from===role?'me':'them')+'">'+esc(m.text)+'<time>'+dmy(m.at)+'</time></div>'}});
    if(role==='controller')(feed.sessions||[]).forEach(function(s){(s.events||[]).forEach(function(e){items.push({at:e.at,html:'<div class="m sys">'+hm(e.at)+' · '+esc(t({start:'sysStart',pause:'sysPause',resume:'sysResume',finish:'sysFinish'}[e.type]))+' ('+esc(e.by)+')</div>'})})});
    items.sort(function(a,b){return a.at-b.at});var box=$('#msgs');if(!box)return;box.innerHTML=items.slice(-260).map(function(i){return i.html}).join('');box.scrollTop=box.scrollHeight;
    if(cv.unread)post({op:'read'}).then(poll);
    var na=$('#notes');if(na&&typeof feed.notes==='string'&&document.activeElement!==na)na.value=feed.notes;
    function send(){var ta=$('#txt'),v=ta.value.trim();if(!v)return;ta.value='';post({op:'message',text:v}).then(poll)}
    $('#send').addEventListener('click',send);$('#txt').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
    var nt=null;if(na)na.addEventListener('input',function(){clearTimeout(nt);var v=na.value;nt=setTimeout(function(){post({op:'notes',text:v}).then(function(){$('#notesSt').textContent=t('saved')+' · '+hm(Date.now())})},700)});
  }

  /* ---------- 12. Vaqt chizig'i (real hodisalar) ---------- */
  function vTimeline(){
    var st=(feed&&feed.status)||{},ev=[];
    (st.recent||[]).forEach(function(r){ev.push({at:r.at,k:'open',title:r.title||r.route,ref:'#/'+r.route})});
    (hasState?Store.events(400):[]).filter(function(e){return role!=='english'||isEnglishEv(e)}).forEach(function(e){ev.push({at:e.at,k:e.type,title:e.title,ref:e.ref})});
    if(role==='controller')(feed?feed.sessions||[]:[]).forEach(function(sx){(sx.events||[]).forEach(function(e){ev.push({at:e.at,k:'session',title:t({start:'sysStart',pause:'sysPause',resume:'sysResume',finish:'sysFinish'}[e.type])+' ('+e.by+')',ref:''})})});
    ev.sort(function(a,b){return b.at-a.at});
    var days={};ev.forEach(function(e){var k=ymd(e.at);(days[k]=days[k]||[]).push(e)});
    var keys=Object.keys(days).sort().reverse().slice(0,14);
    var h='<h1>'+esc(t('tlT'))+'</h1><p class="lede">'+esc(t('tlS'))+'</p>';
    if(!keys.length)return h+'<div class="empty">'+esc(t('tlNone'))+'</div>';
    keys.forEach(function(k){
      var list=days[k];
      h+='<section class="card"><h3 class="card-title">'+esc(k)+' · '+list.length+'</h3><div class="tl">'+list.map(function(e){var lbl=e.k==='open'?t('evOpen'):e.k==='session'?'':(t('ev_'+e.k)==='ev_'+e.k?e.k:t('ev_'+e.k));return '<div class="tl-row k-'+esc(e.k)+'"><time>'+hm(e.at)+'</time><span class="tl-k">'+esc(lbl)+'</span><b>'+esc(e.title||'')+'</b>'+(e.ref?'<code>'+esc(e.ref)+'</code>':'')+'</div>'}).join('')+'</div></section>';
    });
    return h;
  }

  /* ---------- 13. Topshiriqlar (teacher / english) ---------- */
  var A_TYPES=['lesson','practice','quiz','review','reading','listening','speaking','writing','project','vocab','grammar'];
  var A_COURSES=role==='english'?['english']:['python','english','datacamp','general'];
  var editA=null;
  function quickRoutes(){
    var out=[];
    if(role!=='english'&&window.COURSE){COURSE.forEach(function(d){out.push({r:'lesson/'+d.day,t:'Python '+d.day+' · '+L(d.title),c:'python',ty:'lesson'})})}
    if(window.ENG_DAYS){ENG_DAYS.slice(0,140).forEach(function(d){out.push({r:'english/'+d.d,t:'English '+d.d+' · '+L(d.title),c:'english',ty:'lesson'})})}
    if(window.WRITING){WRITING.weeks.forEach(function(w){out.push({r:'writing/'+w.n,t:'Writing '+w.n+' · '+L(w.title),c:'english',ty:'writing'})})}
    out.push({r:'speaking',t:'Speaking 30',c:'english',ty:'speaking'},{r:'books/listen',t:'Listening (Target)',c:'english',ty:'listening'},{r:'books/ebook',t:'Reading (e-book)',c:'english',ty:'reading'},{r:'books/vocab',t:'Vocabulary (Destination B2)',c:'english',ty:'vocab'},{r:'cheatsheet/grammar',t:'Grammar sheet',c:'english',ty:'grammar'},{r:'review',t:'Review (SRS)',c:'general',ty:'review'},{r:'practice',t:'Practice center',c:'general',ty:'practice'});
    if(role!=='english')out.push({r:'projects',t:'Projects',c:'python',ty:'project'},{r:'practice/coding',t:'Coding test',c:'python',ty:'quiz'});
    return out;
  }
  function aForm(a){
    a=a||{type:'lesson',course:A_COURSES[0],priority:'normal',due:'',title:'',desc:'',route:''};
    var sel=function(name,opts,cur,lbl){return '<label class="field"><span>'+esc(lbl)+'</span><select class="input" name="'+name+'">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===cur?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select></label>'};
    return '<form id="af" class="af"><input type="hidden" name="id" value="'+esc(a.id||'')+'">'+
      '<label class="field"><span>'+esc(t('asTitle'))+'</span><input class="input" name="title" required maxlength="120" value="'+esc(a.title)+'"></label>'+
      '<label class="field"><span>'+esc(t('asDesc'))+'</span><textarea class="input" name="desc" rows="3" maxlength="2000">'+esc(a.desc||'')+'</textarea></label>'+
      '<div class="af-row">'+sel('type',A_TYPES.map(function(x){return [x,x]}),a.type,t('asType'))+sel('course',A_COURSES.map(function(x){return [x,x]}),a.course,t('asCourse'))+sel('priority',[['low',t('pr_low')],['normal',t('pr_normal')],['high',t('pr_high')]],a.priority,t('asPr'))+'<label class="field"><span>'+esc(t('asDue'))+'</span><input class="input" type="date" name="due" value="'+esc(a.due||'')+'"></label></div>'+
      '<label class="field"><span>'+esc(t('asRoute'))+'</span><input class="input" name="route" list="qr" maxlength="120" value="'+esc(a.route||'')+'" placeholder="lesson/12"><datalist id="qr">'+quickRoutes().map(function(q){return '<option value="'+esc(q.r)+'">'+esc(q.t)+'</option>'}).join('')+'</datalist></label>'+
      '<div class="acts"><button class="btn btn-primary btn-sm" type="submit">'+esc(t('asSave'))+'</button>'+(a.id?'<button class="btn btn-ghost btn-sm" type="button" id="afCancel">'+esc(t('asCancel'))+'</button>':'')+'</div><div class="err" id="afErr"></div></form>';
  }
  function vAssign(){
    var list=(feed?feed.assignments||[]:[]).slice().sort(function(a,b){return b.createdAt-a.createdAt});
    var open=list.filter(function(a){return a.status!=='completed'}),done=list.filter(function(a){return a.status==='completed'});
    var over=open.filter(function(a){return stOf(a)==='overdue'}).length;
    var h='<h1>'+esc(t('asT'))+'</h1><p class="lede">'+esc(t('asOpen'))+' '+open.length+' · '+esc(t('asOverdue'))+' '+over+' · '+esc(t('asDone'))+' '+done.length+(list.length?' · '+esc(t('asRate'))+' '+Math.round(done.length/list.length*100)+'%':'')+'</p>';
    h+='<div class="two"><section class="card"><h3 class="card-title">'+esc(editA?t('asEdit'):t('asNew'))+'</h3>'+aForm(editA)+'</section>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('asT'))+'</h3>'+(list.length?'<div class="as-list">'+list.map(function(a){var st=stOf(a);return '<div class="as-row pr-'+esc(a.priority)+' st-'+st+'"><div class="as-main"><span class="as-type">'+esc(a.type)+' · '+esc(a.course)+(a.by!==role?' · '+esc(a.by):'')+'</span><b>'+esc(a.title)+'</b>'+(a.desc?'<p>'+esc(a.desc)+'</p>':'')+'<span class="as-meta">'+esc(ymd(a.createdAt))+(a.due?' · '+esc(t('asDue'))+' '+esc(a.due):'')+(a.route?' · #/'+esc(a.route):'')+(a.completedAt?' · ✓ '+esc(dmy(a.completedAt)):'')+'</span></div><div class="as-side"><span class="as-st st-'+st+'">'+esc(t('st_'+st))+'</span>'+(a.by===role?'<button class="btn btn-quiet btn-sm" data-aedit="'+esc(a.id)+'">'+esc(t('asEdit'))+'</button><button class="btn btn-quiet btn-sm" data-adel="'+esc(a.id)+'">'+esc(t('asDel'))+'</button>':'')+(st!=='completed'?'<button class="btn btn-ghost btn-sm" data-ast="'+esc(a.id)+'" data-v="completed">✓</button>':'<button class="btn btn-ghost btn-sm" data-ast="'+esc(a.id)+'" data-v="assigned">↺</button>')+'</div></div>'}).join('')+'</div>':'<div class="empty">'+esc(t('asNone'))+'</div>')+'</section></div>';
    return h;
  }
  function mountAssign(){
    var f=$('#af');if(f)f.addEventListener('submit',function(ev){ev.preventDefault();var fd=new FormData(f),a={};['id','title','desc','type','course','priority','due','route'].forEach(function(k){a[k]=fd.get(k)||''});
      post({op:'assignment',action:a.id?'update':'create',a:a}).then(function(j){if(j.ok){editA=null;poll().then(render)}else{var e=$('#afErr');e.textContent=j.error||'error';e.classList.add('show')}})});
    var c=$('#afCancel');if(c)c.addEventListener('click',function(){editA=null;render()});
    $$('[data-aedit]').forEach(function(b){b.addEventListener('click',function(){editA=(feed.assignments||[]).filter(function(x){return x.id===b.dataset.aedit})[0];render();window.scrollTo(0,0)})});
    $$('[data-adel]').forEach(function(b){b.addEventListener('click',function(){if(!confirm(t('asDelQ')))return;post({op:'assignment',action:'delete',a:{id:b.dataset.adel}}).then(function(){poll().then(render)})})});
    $$('[data-ast]').forEach(function(b){b.addEventListener('click',function(){post({op:'astatus',id:b.dataset.ast,status:b.dataset.v}).then(function(){poll().then(render)})})});
  }

  /* ---------- 14. Feedback (teacher / english; controller — faqat shaxsiy) ---------- */
  var FB_KINDS=role==='english'?['writing','speaking','reading','listening','grammar','vocab','english','quiz','practice','assignment','general']:['lesson','practice','quiz','writing','speaking','reading','listening','project','assignment','python','english','grammar','vocab','general'];
  var editF=null;
  function fForm(f){
    f=f||{activity:{kind:FB_KINDS[0],ref:'',route:'',title:''},text:'',visibility:role==='controller'?'private':'student',fb:{}};
    var fb=f.fb||{},act=f.activity||{};
    var ta=function(name,lbl,val,rows){return '<label class="field"><span>'+esc(lbl)+'</span><textarea class="input" name="'+name+'" rows="'+(rows||2)+'">'+esc(val||'')+'</textarea></label>'};
    return '<form id="ff" class="af"><input type="hidden" name="id" value="'+esc(f.id||'')+'">'+
      '<div class="af-row"><label class="field"><span>'+esc(t('fbKind'))+'</span><select class="input" name="kind">'+FB_KINDS.map(function(k){return '<option'+(k===act.kind?' selected':'')+'>'+k+'</option>'}).join('')+'</select></label>'+
      '<label class="field"><span>'+esc(t('fbRef'))+'</span><input class="input" name="ref" maxlength="60" value="'+esc(act.ref||'')+'" placeholder="wr3 · spk12 · p2"></label>'+
      '<label class="field"><span>'+esc(t('asRoute'))+'</span><input class="input" name="route" maxlength="120" value="'+esc(act.route||'')+'" placeholder="writing/3"></label></div>'+
      '<label class="field"><span>'+esc(t('fbTitle'))+'</span><input class="input" name="title" maxlength="120" value="'+esc(act.title||'')+'"></label>'+
      ta('text',t('fbText'),f.text,3)+
      (role!=='controller'?'<div class="af-row">'+ta('strengths',t('fbStr'),fb.strengths)+ta('weaknesses',t('fbWeak'),fb.weaknesses)+'</div>'+ta('corrections',t('fbCorr'),fb.corrections,3)+'<div class="af-row">'+ta('recommendations',t('fbRec'),fb.recommendations)+ta('next',t('fbNext'),fb.next)+'</div>':'')+
      '<label class="field"><span>'+esc(t('fbVis'))+'</span><select class="input" name="visibility">'+(role!=='controller'?'<option value="student"'+(f.visibility==='student'?' selected':'')+'>'+esc(t('fbVisS'))+'</option>':'')+'<option value="private"'+(f.visibility==='private'?' selected':'')+'>'+esc(t('fbVisP'))+'</option></select></label>'+
      '<div class="acts"><button class="btn btn-primary btn-sm" type="submit">'+esc(t('asSave'))+'</button>'+(f.id?'<button class="btn btn-ghost btn-sm" type="button" id="ffCancel">'+esc(t('asCancel'))+'</button>':'')+'</div><div class="err" id="ffErr"></div></form>';
  }
  function fbRowStaff(f){var a=f.activity||{};return '<article class="fb-row"><div class="fb-head"><span class="chip">'+esc(a.kind||'')+(a.ref?' · '+esc(a.ref):'')+'</span>'+(a.title?'<b>'+esc(a.title)+'</b>':'')+'<span class="as-st '+(f.visibility==='private'?'st-assigned':'st-completed')+'">'+esc(f.visibility==='private'?t('fbPrivate'):t('fbStudent'))+'</span><span class="fb-by">'+esc(f.role)+' · '+esc(dmy(f.at))+'</span>'+(f.by===role?'<button class="btn btn-quiet btn-sm" data-fedit="'+esc(f.id)+'">'+esc(t('asEdit'))+'</button><button class="btn btn-quiet btn-sm" data-fdel="'+esc(f.id)+'">'+esc(t('asDel'))+'</button>':'')+'</div>'+(f.text?'<p class="fb-text">'+esc(f.text)+'</p>':'')+fbStruct(f.fb)+'</article>'}
  function vFeedback(){
    var list=(feed?feed.feedback||[]:[]).slice().sort(function(a,b){return b.at-a.at});
    var h='<h1>'+esc(t('fbT'))+'</h1><p class="lede">'+list.length+'</p>';
    h+='<div class="two"><section class="card"><h3 class="card-title">'+esc(editF?t('asEdit'):t('fbNew'))+'</h3>'+fForm(editF)+'</section>';
    h+='<section class="card"><h3 class="card-title">'+esc(t('fbT'))+'</h3>'+(list.length?list.map(fbRowStaff).join(''):'<div class="empty">'+esc(t('fbNone'))+'</div>')+'</section></div>';
    return h;
  }
  function mountFeedback(){
    var f=$('#ff');if(f)f.addEventListener('submit',function(ev){ev.preventDefault();var fd=new FormData(f);var o={id:fd.get('id')||'',activity:{kind:fd.get('kind'),ref:fd.get('ref'),route:fd.get('route'),title:fd.get('title')},text:fd.get('text'),visibility:fd.get('visibility'),fb:{strengths:fd.get('strengths')||'',weaknesses:fd.get('weaknesses')||'',corrections:fd.get('corrections')||'',recommendations:fd.get('recommendations')||'',next:fd.get('next')||''}};
      if(!Object.keys(o.fb).some(function(k){return o.fb[k]}))o.fb=null;
      post({op:'feedback',action:o.id?'update':'create',f:o}).then(function(j){if(j.ok){editF=null;poll().then(render)}else{var e=$('#ffErr');e.textContent=j.error||'error';e.classList.add('show')}})});
    var c=$('#ffCancel');if(c)c.addEventListener('click',function(){editF=null;render()});
    $$('[data-fedit]').forEach(function(b){b.addEventListener('click',function(){editF=(feed.feedback||[]).filter(function(x){return x.id===b.dataset.fedit})[0];render();window.scrollTo(0,0)})});
    $$('[data-fdel]').forEach(function(b){b.addEventListener('click',function(){if(!confirm(t('asDelQ')))return;post({op:'feedback',action:'delete',f:{id:b.dataset.fdel}}).then(function(){poll().then(render)})})});
  }

  /* ---------- 15. Writing / Speaking tekshiruvi ---------- */
  function vReviews(){
    var list=(feed?feed.reviews||[]:[]).slice().sort(function(a,b){return b.updatedAt-a.updatedAt});
    var q=list.filter(function(r){return r.stage!=='completed'}),d=list.filter(function(r){return r.stage==='completed'});
    var h='<h1>'+esc(t('rvT'))+'</h1><p class="lede">'+esc(t('rvS'))+'</p>';
    var row=function(r){
      var open=r.stage==='submitted'||r.stage==='revised';
      var h2='<details class="card rv-card" '+(open?'open':'')+'><summary><span class="chip">'+esc(r.kind)+'</span><b>'+esc(r.title)+'</b><span class="as-st st-'+esc(r.stage)+'">'+esc(t('stage_'+r.stage))+'</span><small>'+esc(dmy(r.updatedAt))+(r.route?' · #/'+esc(r.route):'')+'</small></summary>';
      h2+='<div class="gc-l">'+esc(t('rvText'))+'</div><pre class="rv-text">'+esc(r.text)+'</pre>';
      h2+='<div class="gc-l">'+esc(t('rvHist'))+'</div><div class="tl">'+r.history.map(function(x){return '<div class="tl-row"><time>'+dmy(x.at)+'</time><span class="tl-k">'+esc(t('stage_'+x.stage))+'</span><b>'+esc(x.by)+(x.band!=null?' · band '+x.band:'')+(x.result?' · '+esc(t('res_'+x.result)):'')+'</b></div>'+(x.fb?fbStruct(x.fb):'')}).join('')+'</div>';
      if(open)h2+='<form class="af rvf" data-rid="'+esc(r.id)+'"><div class="af-row"><label class="field"><span>'+esc(t('fbStr'))+'</span><textarea class="input" name="strengths" rows="2"></textarea></label><label class="field"><span>'+esc(t('fbWeak'))+'</span><textarea class="input" name="weaknesses" rows="2"></textarea></label></div><label class="field"><span>'+esc(t('fbCorr'))+'</span><textarea class="input" name="corrections" rows="4"></textarea></label><div class="af-row"><label class="field"><span>'+esc(t('fbRec'))+'</span><textarea class="input" name="recommendations" rows="2"></textarea></label><label class="field"><span>'+esc(t('fbNext'))+'</span><textarea class="input" name="next" rows="2"></textarea></label></div><div class="af-row">'+(r.kind==='writing'?'<label class="field"><span>'+esc(t('rvBand'))+'</span><input class="input" name="band" type="number" step="0.5" min="4" max="9"></label>':'<label class="field"><span>'+esc(t('rvResult'))+'</span><select class="input" name="result"><option value="">—</option><option value="completed">'+esc(t('res_completed'))+'</option><option value="incomplete">'+esc(t('res_incomplete'))+'</option></select></label>')+'</div><div class="acts"><button class="btn btn-primary btn-sm" type="submit">'+esc(t('rvGive'))+'</button></div></form>';
      else if(r.stage==='completed')h2+='<div class="acts"><button class="btn btn-ghost btn-sm" data-rvre="'+esc(r.id)+'">'+esc(t('rvReopen'))+'</button></div>';
      else h2+='<div class="acts"><button class="btn btn-ghost btn-sm" data-rvdone="'+esc(r.id)+'">'+esc(t('rvComplete'))+'</button></div>';
      return h2+'</details>';
    };
    h+='<h2 class="h2s">'+esc(t('rvQueue'))+' · '+q.length+'</h2>'+(q.length?q.map(row).join(''):'<div class="empty">'+esc(t('rvNone'))+'</div>');
    if(d.length)h+='<h2 class="h2s">'+esc(t('rvDone'))+' · '+d.length+'</h2>'+d.slice(0,20).map(row).join('');
    return h;
  }
  function mountReviews(){
    $$('.rvf').forEach(function(f){f.addEventListener('submit',function(ev){ev.preventDefault();var fd=new FormData(f);var r={id:f.dataset.rid,fb:{strengths:fd.get('strengths'),weaknesses:fd.get('weaknesses'),corrections:fd.get('corrections'),recommendations:fd.get('recommendations'),next:fd.get('next')}};if(fd.get('band'))r.band=Number(fd.get('band'));if(fd.get('result'))r.result=fd.get('result');post({op:'review',action:'feedback',r:r}).then(function(){poll().then(render)})})});
    $$('[data-rvdone]').forEach(function(b){b.addEventListener('click',function(){post({op:'review',action:'complete',r:{id:b.dataset.rvdone}}).then(function(){poll().then(render)})})});
    $$('[data-rvre]').forEach(function(b){b.addEventListener('click',function(){post({op:'review',action:'reopen',r:{id:b.dataset.rvre}}).then(function(){poll().then(render)})})});
  }

  /* ---------- 16. Ingliz tili ish maydoni (english / teacher) ---------- */
  function vEnglish(){
    var em=Mastery.english(),cur=EngCal.currentDay(),row=function(l,v){return '<div class="ms-row"><span>'+esc(l)+'</span>'+bar(v)+'<b>'+v+'% · '+esc(Mastery.levelLabel(v))+'</b></div>'};
    var h='<h1>'+esc(t('enT'))+'</h1><p class="lede">'+esc(t('enDay'))+': '+cur+' / '+ENGLISH.meta.days+' · '+Store.engDoneCount()+' '+esc(t('cDone'))+(doc&&doc.state&&doc.state._filtered?' · <span class="ro">'+esc(t('filtered'))+'</span>':'')+'</p>';
    h+='<div class="stat-grid" style="margin-bottom:16px">'+tile(t('stEn'),Store.engDoneCount()+'<small> / '+ENGLISH.meta.days+'</small>','accent')+tile(t('stMastery'),em.overall+'<small>%</small>',Mastery.levelLabel(em.overall))+tile(t('stWords'),Store.copyList('vocab').length)+tile(t('stMis'),Store.openMistakes().filter(function(m){return m.cat!=='python'}).length,null,'red')+tile(t('stDue'),window.Review?Review.dueCount():0)+'</div>';
    h+='<div class="two">'+card(t('stMastery'),row(t('enGram'),em.grammar)+row(t('enVoc'),em.vocab)+row(t('enRead'),em.reading)+row(t('enLis'),em.listening)+row(t('enSpk'),em.speaking)+row(t('enWr'),em.writing));
    var weak=[['grammar',em.grammar],['vocab',em.vocab],['reading',em.reading],['listening',em.listening],['speaking',em.speaking],['writing',em.writing]].filter(function(x){return x[1]<60}).sort(function(a,b){return a[1]-b[1]});
    h+=card(t('enWeak'),weak.length?'<div class="pr-tags">'+weak.map(function(x){return '<span class="chip hot">'+esc(x[0])+' '+x[1]+'%</span>'}).join('')+'</div>':'<div class="empty">—</div>')+'</div>';
    var qz=Store.all().quiz,keys=Object.keys(qz).filter(function(k){return /^(eng|pr:|ls:|db2|q10)/.test(k)}).sort(function(a,b){return (qz[b].at||0)-(qz[a].at||0)}).slice(0,25);
    h+='<div class="two">'+card(t('enQuiz'),keys.length?'<table class="tbl"><tr><th>key</th><th>last</th><th>'+esc(t('anBest'))+'</th><th>date</th></tr>'+keys.map(function(k){var q=qz[k];return '<tr><td class="mono">'+esc(k)+'</td><td>'+q.score+'/'+q.total+'</td><td>'+(q.best||0)+'/'+(q.bestTotal||q.total)+'</td><td>'+esc(dmy(q.at))+'</td></tr>'}).join('')+'</table>':'<div class="empty">'+esc(t('none'))+'</div>');
    var wr=WRITING.weeks.filter(function(w){return Store.planDone('wr'+w.n)}).length,sp=Store.speakDoneCount();
    var rvs=(feed?feed.reviews||[]:[]);
    h+=card(t('enSpk')+' / '+t('enWr'),'<div class="kv"><span>'+esc(t('cSpk'))+'</span><b>'+sp+' / 30</b><span>'+esc(t('cWr'))+'</span><b>'+wr+' / '+WRITING.weeks.length+'</b><span>'+esc(t('rvQueue'))+'</span><b>'+rvs.filter(function(r){return r.stage!=='completed'}).length+'</b><span>'+esc(t('rvDone'))+'</span><b>'+rvs.filter(function(r){return r.stage==='completed'}).length+'</b></div>')+'</div>';
    var ev=Store.events(200).filter(isEnglishEv).slice(-12).reverse();
    h+=card(t('enRecent'),ev.length?'<div class="tl">'+ev.map(function(e){return '<div class="tl-row"><time>'+dmy(e.at)+'</time><span class="tl-k">'+esc(t('ev_'+e.type)==='ev_'+e.type?e.type:t('ev_'+e.type))+'</span><b>'+esc(e.title)+'</b></div>'}).join('')+'</div>':'<div class="empty">'+esc(t('none'))+'</div>');
    var mine=(feed?feed.feedback||[]:[]).filter(function(f){return f.by===role}).slice(-5).reverse(),asg=(feed?feed.assignments||[]:[]).filter(function(a){return a.status!=='completed'});
    h+='<div class="two">'+card(t('enFb')+' · '+mine.length,mine.length?mine.map(fbRowStaff).join(''):'<div class="empty">'+esc(t('fbNone'))+'</div>')+card(t('enAs')+' · '+asg.length,asg.length?'<div class="as-list">'+asg.map(function(a){var st=stOf(a);return '<div class="as-row st-'+st+' pr-'+esc(a.priority)+'"><div class="as-main"><b>'+esc(a.title)+'</b><span class="as-meta">'+(a.due||'')+'</span></div><span class="as-st st-'+st+'">'+esc(t('st_'+st))+'</span></div>'}).join('')+'</div>':'<div class="empty">'+esc(t('asNone'))+'</div>')+'</div>';
    return h;
  }

  /* ---------- 17. Loyihalar (teacher) ---------- */
  function vProjects(){
    var h='<h1>'+esc(t('nProjects'))+'</h1>';
    if(!window.PROJECTS)return h+'<div class="empty">—</div>';
    var fbs=(feed?feed.feedback||[]:[]).filter(function(f){return (f.activity||{}).kind==='project'});
    h+='<section class="card"><table class="tbl"><tr><th>#</th><th>project</th><th>after</th><th>steps</th><th>status</th><th>deadline</th><th>feedback</th></tr>'+PROJECTS.list.map(function(p){var n=p.steps.filter(function(_,i){return Store.flag('proj:'+p.id+':'+i)}).length,done=Store.flag('proj:'+p.id+':done'),open=Store.doneCount()>=p.after,r=Store.readGet('proj-'+p.id)||{};return '<tr class="'+(done?'done':'')+'"><td>'+esc(p.id)+'</td><td>'+esc(L(p.title))+'</td><td>'+p.after+'</td><td>'+n+'/'+p.steps.length+'</td><td>'+(done?'done':open?(n?'progress':'open'):'locked')+'</td><td>'+esc(r.deadline||'')+'</td><td>'+fbs.filter(function(f){return f.activity.ref===p.id}).length+'</td></tr>'}).join('')+'</table></section>';
    h+=card(t('fbT'),fbs.length?fbs.map(fbRowStaff).join(''):'<div class="empty">'+esc(t('fbNone'))+'</div>');
    return h;
  }

  /* ---------- 18. Shaxsiy eslatmalar (o'z roli) ---------- */
  function vPnotes(){
    var priv=(feed?feed.feedback||[]:[]).filter(function(f){return f.visibility==='private'&&f.by===role});
    return '<h1>'+esc(t('pnT'))+'</h1><p class="lede">'+esc(t('pnS'))+'</p><section class="card"><textarea class="notes" id="notes"></textarea><div class="hint" id="notesSt"></div></section>'+(priv.length?card(t('fbPrivate')+' · '+priv.length,priv.map(fbRowStaff).join('')):'');
  }
  function mountPnotes(){var na=$('#notes');if(!na)return;if(feed&&typeof feed.notes==='string')na.value=feed.notes;var nt=null;na.addEventListener('input',function(){clearTimeout(nt);var v=na.value;nt=setTimeout(function(){post({op:'notes',text:v}).then(function(){$('#notesSt').textContent=t('saved')+' · '+hm(Date.now())})},700)});$$('[data-fdel]').forEach(function(b){b.addEventListener('click',function(){if(!confirm(t('asDelQ')))return;post({op:'feedback',action:'delete',f:{id:b.dataset.fdel}}).then(function(){poll().then(render)})})})}

  /* ---------- 19. Tahlil: o'qituvchi / english / controller ---------- */
  function vTeacherAn(){
    var list=feed?feed.assignments||[]:[],done=list.filter(function(a){return a.status==='completed'}).length,over=list.filter(function(a){return stOf(a)==='overdue'}).length;
    var rvs=feed?feed.reviews||[]:[],rv=window.Review?Review.list():[],due=window.Review?Review.dueCount():0,mastered=rv.filter(function(it){return Review.status(it)==='mastered'}).length;
    var pm=Mastery.python(),em=Mastery.english();
    var h='<h1>'+esc(t('taT'))+'</h1>';
    h+='<div class="stat-grid" style="margin-bottom:16px">'+tile(t('taRate'),(list.length?Math.round(done/list.length*100):0)+'<small>% · '+done+'/'+list.length+'</small>',null,'accent')+tile(t('taOver'),over,null,over?'red':'')+tile(t('taWr'),rvs.filter(function(r){return r.kind==='writing'}).length,rvs.filter(function(r){return r.kind==='writing'&&r.stage!=='completed'}).length+' open')+tile(t('taSpk'),Store.speakDoneCount()+'<small> / 30</small>',rvs.filter(function(r){return r.kind==='speaking'}).length+' reviews')+tile(t('taRv'),(rv.length?Math.round(mastered/rv.length*100):0)+'<small>%</small>',due+' due')+tile(t('stMis'),Store.openMistakes().length,null,'red')+'</div>';
    var weak=[];[['Python',pm.overall],['grammar',em.grammar],['vocab',em.vocab],['reading',em.reading],['listening',em.listening],['speaking',em.speaking],['writing',em.writing]].forEach(function(x){if(x[1]<60)weak.push(x)});weak.sort(function(a,b){return a[1]-b[1]});
    var bycat={};Store.openMistakes().forEach(function(m){bycat[m.cat||'python']=(bycat[m.cat||'python']||0)+1});
    h+='<div class="two">'+card(t('taWeak'),'<div class="pr-tags">'+weak.map(function(x){return '<span class="chip hot">'+esc(x[0])+' '+x[1]+'% · '+esc(Mastery.levelLabel(x[1]))+'</span>'}).join('')+Object.keys(bycat).map(function(k){return '<span class="chip">'+esc(k)+' '+bycat[k]+' '+esc(t('mOpen').toLowerCase())+'</span>'}).join('')+'</div>')+card('Python · '+Mastery.levelLabel(pm.overall)+' / English · '+Mastery.levelLabel(em.overall),'<div class="ms-row"><span>Python</span>'+bar(pm.overall)+'<b>'+pm.overall+'%</b></div><div class="ms-row"><span>English</span>'+bar(em.overall)+'<b>'+em.overall+'%</b></div>')+'</div>';
    return h+vAnalytics().replace(/^<h1>[\s\S]*?<\/p>/,'');
  }
  function vEnglishAn(){return vEnglish()}
  function vCtrlAn(){
    var ss=feed?feed.sessions||[]:[],now=Date.now(),d7=now-7*86400000,d30=now-30*86400000;
    var sum=function(from){return ss.filter(function(x){return x.startedAt>=from}).reduce(function(a,x){return a+(x.activeMin||0)},0)};
    var seen=feed?feed.seen||{}:{},st=feed?feed.status||{}:{};
    var cv=myConv(),msgs=cv.msgs||[];
    var h='<h1>'+esc(t('caT'))+'</h1>';
    h+='<div class="stat-grid" style="margin-bottom:16px">'+tile(t('caSess')+' · '+t('ca7'),ss.filter(function(x){return x.startedAt>=d7}).length,ss.length+' total','accent')+tile(t('caActive')+' · '+t('ca7'),fmtH(sum(d7)),t('ca30')+': '+fmtH(sum(d30)))+tile(t('caLastSeen'),seen.learner?ago(seen.learner):t('never'),st.online?t('online'):t('offline'),st.online?'gold':'')+tile(t('caTask'),st.title?esc(st.title):'—',st.route?'#/'+st.route:'')+tile(t('caComm'),msgs.length+'<small> '+esc(t('caMsgs'))+'</small>',msgs.filter(function(m){return m.at>=d7}).length+' · '+t('ca7'))+'</div>';
    /* Faolsizlik: oxirgi 14 kunda heartbeat/hodisa bo'lmagan kunlar */
    var days={};(st.recent||[]).forEach(function(r){days[ymd(r.at)]=1});(hasState?Store.events(400):[]).forEach(function(e){days[ymd(e.at)]=1});
    var s='';for(var i=13;i>=0;i--){var k=ymd(now-i*86400000);s+='<i class="'+(days[k]?'ok':'miss')+(i===0?' today':'')+'" title="'+k+'">'+k.slice(8)+'</i>'}
    h+=card(t('caInact')+' · 14',"<div class='strip'>"+s+'</div>');
    h+=card(t('sHist'),'<div class="hist">'+(ss.length?ss.slice().reverse().slice(0,30).map(function(x){return '<div><span>'+dmy(x.startedAt)+(x.endedAt?' → '+hm(x.endedAt):'')+'</span><small>'+(x.activeMin||0)+' '+esc(t('min'))+'</small><small>'+esc(x.by||'')+'</small></div>'}).join(''):'<div class="empty">'+esc(t('none'))+'</div>')+'</div>');
    if(hasState){var key=Store.dateKey(),plan=HabitPlan.inRange(key)?HabitPlan.forDate(key):null;if(plan)h+=card(t('tdBlocks')+' · '+HabitPlan.doneCount(plan)+'/'+plan.coreCount,bar(plan.coreCount?HabitPlan.doneCount(plan)/plan.coreCount*100:0))}
    return h;
  }

  /* Faqat mahalliy ishlab chiqish: API yo'q muhitda panelni soxta feed bilan ko'rish
     (xavfsizlikka aloqasi yo'q — server har amalni o'zi tekshiradi).             */
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname))window.__staffDev={enter:enter,feed:function(f){feed=f;render()},state:function(st){doc={rev:1,savedAt:Date.now(),state:st};Store.replace(st,true);Store.all().lang=lang;hasState=true;render()},tab:function(x){tab=x;render()}};

  /* Kirish — umumiy /login sahifasida; sessiya bo'lmasa o'sha yerga */
  fetch('/api/ctrl/io',{credentials:'same-origin'}).then(function(r){if(r.status===401){toLogin('');return null}return r.json()}).then(function(j){if(j&&(j.role==='controller'||j.role==='teacher'||j.role==='english'))enter(j.role);else if(j)toLogin('denied')}).catch(function(){var g=$('#gateMsg');if(g)g.textContent=t('net')});
})();
