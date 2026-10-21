/* ==========================================================================
   ENG_READING — IELTS o'qish matnlari va savollari (1-qism)
   --------------------------------------------------------------------------
   Bu matnlar Reading Explorer 3 dan KO'CHIRILMAGAN. Ular o'sha kitobning
   mavzularida, IELTS Academic Reading darajasida maxsus yozilgan.

   Nega shunday: (1) kitob matni mualliflik huquqi bilan himoyalangan;
   (2) Reading Explorer savollari IELTS formatida emas — T/F/NG, matching
   headings, summary completion kabi turlar u yerda yo'q. Ya'ni bu
   takrorlash emas, kitobga qo'shimcha.

   Ishlash tartibi: avval kitobdagi matnni o'qing (sahifa ko'rsatilgan),
   keyin shu yerdagi matnni IELTS sharoitida — vaqt bilan — ishlang.

   Matn obyekti:
     n        — kun raqami
     ref      — Reading Explorer'dagi mos matn
     title, words, level
     paras    — [{ id:'A', t:'…' }]  abzatslar (matching headings uchun id kerak)
     qs       — savollar: { type, q, opts?, a, why }
     headings — matching headings uchun variantlar ro'yxati
   ========================================================================== */
window.ENG_READING_1 = [

{
  n: 1,
  ref: { unit: 1, part: 'A', page: 8, theme: 'Sports and Fitness' },
  title: "The World's Game",
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "No other sport comes close to football in its global reach. Roughly half the world's population watched some part of the most recent World Cup, and the game is played in every country that has a national sporting body. What is remarkable is not simply that football is popular, but that it became popular almost everywhere at once, across societies with little else in common. Explaining that spread requires looking less at the game's beauty and more at its economics." },
    { id: 'B', t: "The first and most obvious factor is cost. Football requires almost nothing: a ball, a flat surface, and something to mark the goals. Compare this with ice hockey, which demands skates, protective equipment and a frozen surface, or with cricket, which needs specialised bats, pads and a carefully prepared strip of ground. A child in a low-income neighbourhood can play football competently with equipment worth less than a day's wages. This alone does not explain the game's dominance, but no sport has spread widely without being cheap." },
    { id: 'C', t: "The second factor is the simplicity of the rules. The basic laws of football can be explained in under a minute, and a newcomer can follow a match without instruction. Sports with complex regulations — American football, with its intricate system of downs, or cricket, whose scoring puzzles even some native speakers of English — face a barrier that has little to do with the quality of the sport itself. A spectator who cannot follow what is happening will not become a fan, and a game with few fans does not spread." },
    { id: 'D', t: "A third factor, less often mentioned, is the low importance of physical size. Basketball rewards height so strongly that the average professional is far taller than the general population, and this narrows the pool of people who can realistically aspire to play. Football has produced world-class players of almost every build. Lionel Messi, at 1.70 metres, is shorter than the average adult male in most European countries. When a sport does not exclude people by body type, far more of them keep playing into adulthood." },
    { id: 'E', t: "History, however, provided the mechanism. The modern rules were codified in England in 1863, at precisely the moment when British trade, shipping and industry were reaching almost every coastline on earth. Sailors, engineers and railway workers carried the game with them, and it took root in port cities from Buenos Aires to Yokohama. Football did not spread because it was English; it spread because the English happened to be everywhere when the rules were written down. Had the rules been fixed fifty years earlier or later, the map of the sport would look different." },
    { id: 'F', t: "Some researchers argue that a fourth factor matters more than any of these: the low scoring. A typical match ends 1–0 or 2–1, which means that a weaker team can beat a stronger one far more often than in basketball, where the better side almost always wins. This unpredictability keeps competitions interesting for supporters of small clubs and small nations. Whether this is genuinely a cause of football's popularity, or simply a pleasant feature of a game that was already popular, remains difficult to establish." }
  ],
  headings: [
    'i. A sport that suits every body type',
    'ii. The financial cost of major tournaments',
    'iii. An accident of historical timing',
    'iv. Rules a beginner can grasp immediately',
    'v. The cheapest sport to play',
    'vi. Why results are hard to predict',
    'vii. The scale of football\'s popularity',
    'viii. Training methods used by professionals'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', opts: null, a: 'vii', why: "A abzatsi butun dunyo bo'ylab qanchalik keng tarqalganini raqamlar bilan beradi — ya'ni MIQYOS haqida." },
    { type: 'headings', q: 'Paragraph B', a: 'v', why: 'B abzatsining butun mavzusi — arzonlik: to\'p, tekis joy va darvoza belgisi.' },
    { type: 'headings', q: 'Paragraph C', a: 'iv', why: 'C abzatsi qoidalarning soddaligi va yangi tomoshabin uchun tushunarliligi haqida.' },
    { type: 'headings', q: 'Paragraph D', a: 'i', why: "D abzatsi bo'y va tana tuzilishi to'sqinlik qilmasligini tushuntiradi." },
    { type: 'headings', q: 'Paragraph E', a: 'iii', why: '1863-yil va Britaniya savdosining bir vaqtga to\'g\'ri kelishi — tarixiy tasodif.' },
    { type: 'headings', q: 'Paragraph F', a: 'vi', why: 'F abzatsi kam gol va natijaning oldindan aytib bo\'lmasligi haqida.' },

    { type: 'tfng', q: 'Football is played in every country that has a national sporting organisation.', a: 'TRUE',
      why: "A abzatsida aynan shunday deyilgan: \"played in every country that has a national sporting body\"." },
    { type: 'tfng', q: 'Ice hockey is more expensive to play than cricket.', a: 'NOT GIVEN',
      why: "Ikkalasi ham qimmat deb aytilgan, lekin bir-biri bilan TAQQOSLANMAGAN. Matnda gapirilmagan narsa — NOT GIVEN." },
    { type: 'tfng', q: 'The writer believes low cost by itself explains why football became dominant.', a: 'FALSE',
      why: "B abzatsi buni ochiq rad etadi: \"This alone does not explain the game's dominance\"." },
    { type: 'tfng', q: 'Lionel Messi is taller than the average European man.', a: 'FALSE',
      why: 'D abzatsi teskarisini aytadi: u o\'rtachadan PAST.' },

    { type: 'mcq', q: 'According to paragraph E, football spread across the world mainly because',
      opts: ['the English deliberately promoted it abroad', 'its rules were written down at a time when Britain traded globally', 'port cities had more free time than inland cities', 'other sports had not yet been invented'],
      a: 1, why: "E abzatsi: \"it spread because the English happened to be everywhere when the rules were written down\" — ya'ni ataylab targ'ib qilingani uchun emas (a variantini matn ochiq rad etadi)." },
    { type: 'mcq', q: 'What does the writer say about the low-scoring argument in paragraph F?',
      opts: ['It is the strongest of all the explanations', 'It has been proved by research', 'It may be a result of popularity rather than a cause', 'It applies equally well to basketball'],
      a: 2, why: "Oxirgi gap: \"or simply a pleasant feature of a game that was already popular\" — ya'ni sabab emas, oqibat bo'lishi mumkin." },

    { type: 'completion', q: 'A sport with complicated rules creates a ______ for new spectators.', a: 'barrier',
      why: 'C abzatsi: "face a barrier that has little to do with the quality of the sport itself". Matndagi AYNAN so\'z.' }
  ]
},

{
  n: 2,
  ref: { unit: 1, part: 'B', page: 16, theme: 'Sports and Fitness' },
  title: 'What Makes an Olympic Champion?',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "For most of the twentieth century, the dominant explanation for sporting excellence was talent. Champions were assumed to be born with unusual physical gifts, and training was seen as a way of releasing what was already there. In 1993, a study of violinists at a Berlin music academy challenged this view. Its authors found that the strongest predictor of achievement was not any measurable innate quality but the number of hours each student had spent in focused, effortful practice." },
    { id: 'B', t: "The finding was later popularised as the \"ten thousand hour rule\", a phrase the original researchers never used and have since criticised. The number was an average, not a threshold, and it varied enormously between individuals in the same study. More importantly, the researchers stressed that the type of practice mattered more than the quantity. Repeating what one can already do produces very little improvement, regardless of how many hours are involved." },
    { id: 'C', t: "What they described instead was deliberate practice: activity designed specifically to improve performance, carried out at the edge of current ability, with immediate feedback and constant correction. A pianist practising deliberately does not play a piece from beginning to end. She isolates the four bars she keeps failing, slows them down, repeats them until they are secure, and only then returns to the whole. This is uncomfortable and difficult to sustain, which is why most people avoid it without realising they are doing so." },
    { id: 'D', t: "In sport, the picture is more complicated than in music, because physical constraints are real. No amount of deliberate practice will make a person of average height a competitive high jumper, and studies of elite endurance athletes consistently find genetic differences in how efficiently their bodies use oxygen. Talent, in other words, has not disappeared from the explanation. What has changed is its role: it appears to set an upper limit rather than to determine the outcome within that limit." },
    { id: 'E', t: "There is also a factor that neither talent nor practice can account for, and which researchers now take seriously: opportunity. Access to good coaching, to facilities, and to a family able to absorb the cost of years of training is unevenly distributed. A striking pattern in several sports is that professional players are disproportionately born in the early months of the selection year, because at age eight they were bigger than their peers, received more attention from coaches, and therefore practised more. The advantage was originally biological, but it became an advantage in opportunity, and it persisted for a decade." },
    { id: 'F', t: "The practical conclusion is not that talent is irrelevant, nor that anyone can reach the top through effort alone. It is narrower and more useful: for almost everyone, the limiting factor is not the ceiling set by genetics but the quality of the practice being done far below it. Very few people who believe they have reached their natural limit have in fact been practising deliberately." }
  ],
  headings: [
    'i. Why the popular version of the rule is wrong',
    'ii. The role of birth date in selection',
    'iii. What effective practice actually looks like',
    'iv. The traditional belief about champions',
    'v. Where physical limits genuinely apply',
    'vi. A conclusion for ordinary learners',
    'vii. The cost of professional coaching'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'iv', why: 'A abzatsi eski qarash — iste\'dod bilan tug\'iladi — haqida.' },
    { type: 'headings', q: 'Paragraph B', a: 'i', why: '"Ten thousand hour rule" iborasining noto\'g\'ri talqin ekani.' },
    { type: 'headings', q: 'Paragraph C', a: 'iii', why: 'Deliberate practice nima ekani, pianino misoli bilan.' },
    { type: 'headings', q: 'Paragraph D', a: 'v', why: 'Jismoniy va genetik cheklovlar haqiqatan borligi.' },
    { type: 'headings', q: 'Paragraph E', a: 'ii', why: "Tanlov yilining birinchi oylarida tug'ilganlar afzalligi." },
    { type: 'headings', q: 'Paragraph F', a: 'vi', why: 'Oddiy o\'quvchi uchun amaliy xulosa.' },

    { type: 'ynng', q: 'The writer agrees that ten thousand hours is a fixed threshold for expertise.', a: 'NO',
      why: 'B abzatsi: "The number was an average, not a threshold". Muallif buni ochiq rad etadi.' },
    { type: 'ynng', q: 'The writer thinks genetics plays no part in elite sport.', a: 'NO',
      why: 'D abzatsi teskarisini aytadi: "Talent … has not disappeared from the explanation".' },
    { type: 'ynng', q: 'The writer believes most people have already reached their genetic ceiling.', a: 'NO',
      why: 'F abzatsining oxirgi gapi aynan buni rad etadi.' },
    { type: 'ynng', q: 'Deliberate practice is enjoyable for most learners.', a: 'NO',
      why: 'C abzatsi: "This is uncomfortable and difficult to sustain".' },

    { type: 'mcq', q: 'The 1993 Berlin study is significant because it',
      opts: ['proved that talent does not exist', 'identified practice hours as the strongest predictor of achievement', 'was the first study of musicians', 'showed that violinists practise more than athletes'],
      a: 1, why: 'A abzatsi: "the strongest predictor of achievement was not any measurable innate quality but the number of hours".' },
    { type: 'mcq', q: 'The example of the pianist is used to show that',
      opts: ['music is harder than sport', 'whole pieces should be practised repeatedly', 'effective practice targets specific weaknesses', 'feedback is unnecessary for experts'],
      a: 2, why: 'C abzatsidagi misol: butun asarni emas, muammoli 4 taktni ajratib mashq qilish.' },

    { type: 'completion', q: 'According to paragraph D, talent appears to set an upper ______ rather than determine the outcome.', a: 'limit',
      why: 'D abzatsi: "it appears to set an upper limit rather than to determine the outcome". Matndagi aynan so\'z.' },
    { type: 'completion', q: 'An advantage that began as biological later became an advantage in ______.', a: 'opportunity',
      why: 'E abzatsi: "it became an advantage in opportunity".' }
  ]
},

{
  n: 3,
  ref: { unit: 2, part: 'A', page: 24, theme: 'Skin Deep' },
  title: 'What Is Beauty?',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "The claim that beauty is entirely a matter of culture is easy to state and hard to defend. Studies conducted across widely separated societies have found substantial agreement about which faces are considered attractive, and infants only a few months old look longer at faces that adults rate as beautiful. Since these infants have had almost no exposure to cultural standards, something other than learning appears to be at work." },
    { id: 'B', t: "Three features recur in this research. The first is symmetry: faces whose left and right halves match closely are rated more attractive across cultures. The second is averageness, which is counter-intuitive. When researchers digitally combine many faces into a composite, the resulting average face is consistently judged more attractive than almost any of the individual faces used to make it. The third is what researchers call typicality of sex characteristics, though this varies far more between cultures than the first two." },
    { id: 'C', t: "The usual explanation is evolutionary. Symmetry is thought to signal that an organism developed without significant disruption from disease or malnutrition, and averageness may indicate genetic diversity. On this account, our preferences are not arbitrary but are rough indicators of health, inherited because ancestors who used them left more descendants. The argument is plausible and has been influential, but the evidence linking facial symmetry to actual health outcomes is weaker than the theory requires." },
    { id: 'D', t: "Culture then works on top of this base, and its influence is far from trivial. Standards of body weight have reversed within living memory in several societies: where food was scarce, fuller figures signalled prosperity, and where food is abundant, thinness signals discipline and leisure. Skin tone has followed the same logic in the opposite direction — pale skin was prized where most people worked outdoors, and tanned skin where most work moved indoors. What is constant is not the standard itself but the tendency to prefer whatever is difficult to achieve." },
    { id: 'E', t: "The modern complication is that images of faces are now edited before we see them. Research on adolescents suggests that comparison with digitally altered images produces measurable dissatisfaction, and that the effect is strongest when the viewer does not recognise that the image has been altered. Several countries have responded with laws requiring edited advertising images to be labelled. Whether such labels work is disputed: some studies find a small protective effect, others none at all." },
    { id: 'F', t: "Perhaps the most useful finding for ordinary readers is one that receives little attention. When people rate the attractiveness of others they know personally, agreement between raters collapses almost entirely. The consistency found in laboratory studies depends on strangers judging photographs. Once familiarity, voice, humour and behaviour enter the picture, the shared standard largely dissolves — which suggests that the science of beauty describes first impressions rather than anything that lasts." }
  ],
  headings: [
    'i. The effect of edited images',
    'ii. Evidence against a purely cultural explanation',
    'iii. How standards reverse over time',
    'iv. Why laboratory findings may mislead',
    'v. The three recurring features',
    'vi. An evolutionary account and its weakness',
    'vii. Beauty products and the cosmetics industry'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'ii', why: "Chaqaloqlar tajribasi madaniyat nazariyasiga qarshi dalil." },
    { type: 'headings', q: 'Paragraph B', a: 'v', why: 'Uchta takrorlanuvchi belgi: simmetriya, o\'rtachalik, jins belgilari.' },
    { type: 'headings', q: 'Paragraph C', a: 'vi', why: 'Evolyutsion tushuntirish va uning zaif tomoni.' },
    { type: 'headings', q: 'Paragraph D', a: 'iii', why: "Vazn va teri rangi me'yorlarining teskariga o'zgarishi." },
    { type: 'headings', q: 'Paragraph E', a: 'i', why: 'Tahrirlangan rasmlar va ularning ta\'siri.' },
    { type: 'headings', q: 'Paragraph F', a: 'iv', why: 'Laboratoriya natijalari nega chalg\'itishi mumkin.' },

    { type: 'tfng', q: 'Infants show a preference for faces that adults find attractive.', a: 'TRUE',
      why: 'A abzatsi: "infants only a few months old look longer at faces that adults rate as beautiful".' },
    { type: 'tfng', q: 'A composite face made from many faces is usually rated less attractive than the originals.', a: 'FALSE',
      why: 'B abzatsi teskarisini aytadi: composite KO\'PROQ jozibador baholanadi.' },
    { type: 'tfng', q: 'The link between facial symmetry and health has been firmly established.', a: 'FALSE',
      why: 'C abzatsi: "the evidence … is weaker than the theory requires".' },
    { type: 'tfng', q: 'Labelling laws for edited images exist in more than ten countries.', a: 'NOT GIVEN',
      why: '"Several countries" deyilgan, lekin ANIQ SON aytilmagan. Raqam berilmagan — NOT GIVEN.' },

    { type: 'mcq', q: 'According to paragraph D, what stays the same across cultures?',
      opts: ['the preferred body weight', 'the preferred skin tone', 'a preference for what is hard to obtain', 'the importance of facial symmetry'],
      a: 2, why: 'Oxirgi gap: "the tendency to prefer whatever is difficult to achieve".' },
    { type: 'mcq', q: 'The finding in paragraph F suggests that laboratory studies of beauty',
      opts: ['are entirely unreliable', 'measure first impressions rather than lasting judgements', 'should use larger samples', 'contradict evolutionary theory'],
      a: 1, why: 'Oxirgi gap: "describes first impressions rather than anything that lasts".' },

    { type: 'summary', q: 'Research finds agreement about attractive faces mainly when ______ judge photographs.', a: 'strangers',
      why: 'F abzatsi: "depends on strangers judging photographs".' }
  ]
},

{
  n: 4,
  ref: { unit: 2, part: 'B', page: 32, theme: 'Skin Deep' },
  title: "Skin: The Body's Canvas",
  level: 'IELTS 7.0–8.0',
  paras: [
    { id: 'A', t: "The oldest preserved tattoos belong to a man who died in the Alps around five thousand years ago. His body carries more than sixty marks, almost all of them simple lines and crosses placed over joints. Their position is the interesting part: modern examination has found signs of joint degeneration at precisely those points, which has led several researchers to suggest that the marks were therapeutic rather than decorative. If that reading is correct, the first tattoos we know of were closer to medicine than to art." },
    { id: 'B', t: "That ambiguity has persisted. Across recorded history, permanent marking of the skin has served at least four distinct purposes, and often several at once: to signal membership of a group, to record an individual achievement, to mark ownership or punishment, and to decorate. The same technique has been used to honour and to degrade. Roman soldiers were marked to prevent desertion; in the same period, marks were forcibly applied to enslaved people and to convicted criminals. A visitor from outside could not have told the categories apart by looking." },
    { id: 'C', t: "European attitudes shifted sharply in the eighteenth century, when returning sailors brought both the practice and the Polynesian word tatau back from the Pacific. What had been associated with punishment became associated with travel, and then with the exotic. By the late nineteenth century the practice had reached the European aristocracy, and several monarchs were tattooed. The association with criminality did not disappear, however; it simply coexisted with the new fashion, and reasserted itself in the twentieth century." },
    { id: 'D', t: "The technology has changed less than one might expect. Pigment is introduced below the outer layer of skin, where it is engulfed by immune cells that cannot break it down and cannot leave. The mark persists not because the ink is permanent but because the body's attempt to remove it fails. Fading occurs as those cells are gradually replaced and some pigment escapes, which is why old tattoos blur rather than disappear. Removal, when attempted, works by breaking pigment into fragments small enough for the same immune system to carry away — a process that typically requires many sessions and does not always succeed." },
    { id: 'E', t: "Surveys in several countries now put the proportion of adults with at least one tattoo between a quarter and a third, with much higher rates among younger age groups. What is notable is how quickly the social meaning has shifted. A mark that in 1980 would have narrowed a person's employment prospects in most professions is now, in many of those same professions, unremarkable. Employers who maintain visible-tattoo restrictions increasingly report difficulty recruiting." },
    { id: 'F', t: "The rate of regret, however, has not fallen in proportion. Studies consistently find that between one in six and one in four people with tattoos express some regret, and the strongest predictor is not the design itself but the age at which it was applied. Marks made before the age of twenty are regretted far more often than those made later. This is a familiar pattern: the difficulty is not that the meaning of the mark changes, but that the person carrying it does." }
  ],
  headings: [
    'i. How the body responds to pigment',
    'ii. The earliest known examples',
    'iii. Changing employment attitudes',
    'iv. Four purposes served by one practice',
    'v. Who regrets the decision, and why',
    'vi. How Europe\'s view was transformed',
    'vii. The cost of professional removal'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'ii', why: 'Alp tog\'laridagi eng qadimgi tatuirovka.' },
    { type: 'headings', q: 'Paragraph B', a: 'iv', why: 'To\'rt xil maqsad sanab o\'tilgan.' },
    { type: 'headings', q: 'Paragraph C', a: 'vi', why: 'Yevropa qarashining XVIII asrda o\'zgarishi.' },
    { type: 'headings', q: 'Paragraph D', a: 'i', why: 'Pigment va immun hujayralar — biologik mexanizm.' },
    { type: 'headings', q: 'Paragraph E', a: 'iii', why: 'Ish beruvchilar munosabatining o\'zgarishi.' },
    { type: 'headings', q: 'Paragraph F', a: 'v', why: 'Kim va nega afsuslanadi.' },

    { type: 'tfng', q: 'The Alpine man\'s tattoos were found at points where his joints had deteriorated.', a: 'TRUE',
      why: 'A abzatsi: "signs of joint degeneration at precisely those points".' },
    { type: 'tfng', q: 'Roman soldiers and enslaved people were marked using different techniques.', a: 'NOT GIVEN',
      why: "Ikkalasi ham belgilangani aytilgan, lekin TEXNIKA farqi haqida hech narsa yo'q." },
    { type: 'tfng', q: 'Tattoos fade because the ink itself breaks down over time.', a: 'FALSE',
      why: 'D abzatsi: "not because the ink is permanent but because the body\'s attempt to remove it fails" — o\'chish hujayralar almashishidan.' },
    { type: 'tfng', q: 'Regret is most strongly linked to the design that was chosen.', a: 'FALSE',
      why: 'F abzatsi: "the strongest predictor is not the design itself but the age at which it was applied".' },

    { type: 'mcq', q: 'What does the writer suggest about the earliest tattoos?',
      opts: ['They were purely decorative', 'They may have had a medical purpose', 'They marked social rank', 'They were applied after death'],
      a: 1, why: 'A abzatsi: "the marks were therapeutic rather than decorative".' },
    { type: 'mcq', q: 'Tattoo removal works by',
      opts: ['dissolving the pigment chemically', 'replacing the affected skin', 'breaking pigment into pieces the body can remove', 'preventing new immune cells from forming'],
      a: 2, why: 'D abzatsi: "breaking pigment into fragments small enough for the same immune system to carry away".' },

    { type: 'completion', q: 'The word tattoo entered European languages from the Polynesian word ______.', a: 'tatau',
      why: 'C abzatsi: "the Polynesian word tatau". Matndagi aynan so\'z, imlosi bilan.' },
    { type: 'completion', q: 'The writer concludes that what changes is not the mark but the ______ carrying it.', a: 'person',
      why: 'F abzatsining oxirgi gapi: "but that the person carrying it does".' }
  ]
}

];
