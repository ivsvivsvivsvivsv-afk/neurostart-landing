"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#050508", card: "#0a0a10", border: "#1a1a2e",
  cyan: "#00d4ff", cyanDk: "#0099bb", purple: "#8b5cf6",
  gold: "#fbbf24", pink: "#ff4d8d", green: "#34d399",
  text: "#e0e0e8", muted: "#6b6b80", dim: "#3a3a50",
};

const testQuestions = [
  { q: "Как часто ты используешь нейросети?", opts: ["Никогда не пробовал", "Пару раз из любопытства", "Несколько раз в неделю", "Каждый день, для работы"] },
  { q: "Что такое промпт?", opts: ["Впервые слышу", "Вроде запрос к ИИ", "Текстовая инструкция для ИИ", "Задание с ролью, контекстом и форматом"] },
  { q: "Сколько нейросетей можешь назвать?", opts: ["Ни одной или только ChatGPT", "2–3 штуки", "4–6 штук", "7+ и знаю, зачем каждая"] },
  { q: "Почему ИИ иногда «врёт»?", opts: ["Это серьёзная проблема?", "Слышал, не понимаю", "Галлюцинации — предсказывает, не знает", "Знаю и проверяю фактчекингом"] },
  { q: "Что делаешь, когда ИИ даёт плохой ответ?", opts: ["Закрываю", "Пробую спросить иначе", "Уточняю промпт: контекст + формат", "Цепочки промптов + разные модели"] },
  { q: "Используешь ИИ в работе?", opts: ["Нет, не понимаю как", "Иногда, для простого", "Регулярно: тексты, анализ, поиск", "Встроен в мои процессы"] },
  { q: "Как оцениваешь свой уровень?", opts: ["Полный ноль", "Новичок", "Уверенный пользователь", "Продвинутый — учу других"] },
];

const testLevels = [
  { min: 0, max: 5, name: "Стартер", color: "#ff4d8d", emoji: "🌱", desc: "Ты в самом начале пути. Этот урок — идеально для тебя." },
  { min: 6, max: 11, name: "Исследователь", color: "#00d4ff", emoji: "🔍", desc: "Базу знаешь, но используешь 20% возможностей ИИ." },
  { min: 12, max: 17, name: "Практик", color: "#8b5cf6", emoji: "⚡", desc: "Хороший уровень! Платформа удивит наукой и персонализацией." },
  { min: 18, max: 21, name: "Эксперт", color: "#fbbf24", emoji: "👑", desc: "Приходи посмотреть, как мы обучаем других." },
];

const getTestLevel = (score: number) => testLevels.find(l => score >= l.min && score <= l.max) || testLevels[0];

const BrainIcon = ({ color = C.cyan, size = 22 }: { color?: string; size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2a5 5 0 00-4.5 7.2A5 5 0 004 14a5 5 0 003.5 4.8A3 3 0 0012 22a3 3 0 004.5-3.2A5 5 0 0020 14a5 5 0 00-3.5-4.8A5 5 0 0012 2z"/><path d="M12 2v20" strokeDasharray="2 3" opacity="0.5"/></svg>);
const SparkIcon = ({ color = C.gold, size = 22 }: { color?: string; size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>);
const GameIcon = ({ color = C.pink, size = 22 }: { color?: string; size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="3"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="4" y1="12" x2="8" y2="12"/><circle cx="16" cy="10" r="1" fill={color}/><circle cx="19" cy="12" r="1" fill={color}/></svg>);
const UserIcon = ({ color = C.cyan, size = 22 }: { color?: string; size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

const SectionDiv = () => (<div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"44px 0",gap:12, position:"relative", zIndex:1 }}><div style={{ width:50,height:1,background:`linear-gradient(90deg,transparent,${C.cyan}25)` }}/><div style={{ width:4,height:4,borderRadius:"50%",background:C.cyan,opacity:.25 }}/><div style={{ width:50,height:1,background:`linear-gradient(90deg,${C.cyan}25,transparent)` }}/></div>);
const Tag = ({ children, color = C.cyan }: { children: React.ReactNode; color?: string }) => (<div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:10,color,letterSpacing:3,textTransform:"uppercase",marginBottom:14,textAlign:"center" }}>{children}</div>);
const H2 = ({ children }: { children: React.ReactNode }) => (<h2 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(19px,4.5vw,27px)",fontWeight:800,textAlign:"center",marginBottom:14,lineHeight:1.3,color:C.text }}>{children}</h2>);
const CTABtn = ({ children, big, onClick }: { children: React.ReactNode; big?: boolean; onClick?: () => void }) => (<button onClick={onClick} style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",padding:big?"16px 40px":"14px 30px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.cyan},${C.cyanDk})`,color:"#000",fontFamily:"'Orbitron',sans-serif",fontSize:big?13:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",boxShadow:`0 0 24px ${C.cyan}20,0 4px 16px rgba(0,0,0,0.3)` }}>{children}</button>);

const Timer = () => {
  const target = new Date("2026-04-14T19:00:00+03:00").getTime();
  const [diff, setDiff] = useState(target - Date.now());
  useEffect(() => {
    const i = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(i);
  }, [target]);

  const totalSec = Math.max(0, Math.floor(diff / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  const B = ({ v, l }: { v: number; l: string }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Orbitron'", fontSize: 22, fontWeight: 700, color: C.cyan, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15`, borderRadius: 8, padding: "4px 10px", minWidth: 44 }}>{String(v).padStart(2, "0")}</div>
      <div style={{ fontSize: 8, color: C.dim, marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <B v={d} l="дни" /><span style={{ fontFamily: "'Orbitron'", fontSize: 18, color: `${C.cyan}25`, paddingTop: 4 }}>:</span>
      <B v={h} l="часы" /><span style={{ fontFamily: "'Orbitron'", fontSize: 18, color: `${C.cyan}25`, paddingTop: 4 }}>:</span>
      <B v={m} l="мин" /><span style={{ fontFamily: "'Orbitron'", fontSize: 18, color: `${C.cyan}25`, paddingTop: 4 }}>:</span>
      <B v={s} l="сек" />
    </div>
  );
};

const LeadModal = ({ open, onClose, testResult }: { open: boolean; onClose: () => void; testResult?: { score: number; level: string; answers: number[] } }) => {
  const [name,setName]=useState("");const [email,setEmail]=useState("");const [phone,setPhone]=useState("");const [sent,setSent]=useState(false);const [loading,setLoading]=useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  useEffect(() => {
    if (open) { setName(""); setEmail(""); setPhone(""); setSent(false); setLoading(false); setErrors({}); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v: string) => !v.trim() || /^[\d+\-()\s]{7,18}$/.test(v);

  const submit = async () => {
    const errs: typeof errors = {};
    if (!validateEmail(email)) errs.email = "Введи корректный email";
    if (!validatePhone(phone)) errs.phone = "Проверь формат телефона";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, testResult }),
      });
      if (!res.ok) throw new Error("fail");
      setSent(true);
    } catch {
      setErrors({ email: "Ошибка отправки. Попробуй ещё раз." });
    }
    setLoading(false);
  };

  if(!open) return null;
  const inp:React.CSSProperties = {width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"#111118",color:C.text,fontSize:14,fontFamily:"Inter,sans-serif",outline:"none"};
  const errBox = { fontSize: 12, color: "#ff4d8d", marginTop: 4 } as const;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"32px 24px",maxWidth:400,width:"100%",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",color:C.dim,fontSize:20,cursor:"pointer"}}>✕</button>
        {!sent?(<><div style={{fontFamily:"'Orbitron'",fontSize:16,fontWeight:700,color:C.text,marginBottom:6}}>Записаться на урок</div><div style={{fontSize:12,color:C.muted,marginBottom:20}}>Бесплатно. Мы свяжемся и пришлём ссылку.</div><div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}><input style={inp} placeholder="Имя" value={name} onChange={e=>setName(e.target.value)}/><div><input style={inp} placeholder="Email" type="email" value={email} onChange={e=>{ setEmail(e.target.value); setErrors(p=>({ ...p, email: undefined })); }}/>{errors.email && <div style={errBox}>{errors.email}</div>}</div><div><input style={inp} placeholder="Телефон (необязательно)" value={phone} onChange={e=>{ setPhone(e.target.value); setErrors(p=>({ ...p, phone: undefined })); }}/>{errors.phone && <div style={errBox}>{errors.phone}</div>}</div></div><button onClick={submit} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.cyan},${C.cyanDk})`,color:"#000",fontFamily:"'Orbitron'",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:loading?"wait":"pointer",opacity:loading?0.7:1}}>{loading?"Отправка...":"Отправить заявку"}</button></>):(<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:40,marginBottom:12}}>✓</div><div style={{fontFamily:"'Orbitron'",fontSize:15,fontWeight:700,color:C.green,marginBottom:8}}>Заявка отправлена!</div><div style={{fontSize:13,color:C.muted}}>Мы свяжемся с тобой и пришлём ссылку на урок.</div></div>)}
      </div>
    </div>
  );
};

const scienceBlocks = [
  { digit: "2σ", title: "Персональный репетитор для каждого", text: "Учёный Бенджамин Блум доказал: ученик с личным репетитором обгоняет 98% обычного класса. Проблема — нанять репетитора каждому невозможно. Мы заменили репетитора AI-тьютором, который знает тему урока, помнит твои ошибки и объясняет так, как понятно именно тебе.", result: "Ты получаешь персональные объяснения — без очереди и расписания" },
  { digit: "×2.5", title: "Учишься делая, а не слушая", text: "Посмотрел лекцию — через неделю забыл 80%. Но если ты сам решал задачу, писал промпт, играл в игру — мозг запоминает в 2.5 раза больше. Каждый урок на платформе — это цикл: попробуй → осмысли → прочитай теорию → примени снова.", result: "Знания остаются надолго, потому что ты учишься через действие" },
  { digit: "+73%", title: "Не заставляешь себя — хочешь продолжать", text: "Обычные курсы бросают 87% людей. Здесь — квесты, XP за каждое действие, мини-игры и финальный босс. Мозг получает дофамин при каждой маленькой победе и сам просит продолжения. Геймификация повышает вовлечённость на 73%.", result: "Ты доходишь до конца, потому что процесс захватывает" },
  { digit: "6", title: "Психологическое профилирование", text: "Пока ты проходишь урок, платформа незаметно строит твой когнитивный профиль по 6 параметрам: визуал или текст, быстрый или вдумчивый темп, рискуешь или перестраховываешься. Никаких анкет — только наблюдение за реальными действиями.", result: "Контент и тьютор подстраиваются лично под твой стиль мышления" },
  { digit: "FLOW", title: "Всегда на грани возможностей", text: "Слишком легко — скучно. Слишком сложно — бросаешь. Состояние потока — когда задача чуть сложнее, чем ты можешь, и ты полностью вовлечён. AI-методист после каждого урока подстраивает сложность следующего.", result: "Ты не скучаешь и не перегружаешься — учишься в потоке" },
  { digit: "24/7", title: "Тьютор, который помнит всё о тебе", text: "После каждого урока AI-методист анализирует: что понял, где ошибся, какие темы повторить. Промпт тьютора пересобирается — и в следующем уроке он уже точнее. Чем больше учишься — тем умнее становится система.", result: "С каждым уроком платформа учит тебя всё эффективнее" },
];

const sectionWrap: React.CSSProperties = { padding: "40px 24px", maxWidth: 1060, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 };

const lessonCards = [
  { emoji: "👨‍🏫", color: C.green, title: "Живой преподаватель", text: "Объясняет, отвечает на вопросы, ведёт по платформе в реальном времени" },
  { emoji: "🤖", color: C.purple, title: "AI-тьютор в чате", text: "Персональный помощник — знает тему урока и подстраивается под тебя" },
  { emoji: "🎮", color: C.pink, title: "Мини-игра", text: "Собирай полезные принципы промптинга, уворачивайся от ловушек" },
  { emoji: "✍️", color: C.gold, title: "Практика + AI-критик", text: "Напишешь свой промпт — ИИ оценит и подскажет, что улучшить" },
  { emoji: "🧬", color: C.cyan, title: "Адаптация под тебя", text: "Увидишь, как платформа подстраивает контент в реальном времени" },
  { emoji: "💡", color: C.text, title: "Основы ИИ с нуля", text: "Нейросети, промпты, токены — без жаргона, простым языком" },
];

export default function Landing() {
  const [sy,setSy]=useState(0);const [showForm,setShowForm]=useState(false);
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [testDone, setTestDone] = useState(false);

  useEffect(()=>{const f=()=>setSy(window.scrollY);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f)},[]);
  const openForm=()=>setShowForm(true);

  const handleTestAnswer = (optIndex: number) => {
    const next = [...testAnswers, optIndex];
    setTestAnswers(next);
    if (testStep < testQuestions.length - 1) setTestStep(testStep + 1);
    else setTestDone(true);
  };

  const testScore = testAnswers.reduce((a, b) => a + b, 0);
  const testLevelNow = getTestLevel(testScore);

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter','Segoe UI',sans-serif",overflowX:"hidden",position:"relative"}}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, #00d4ff06 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #8b5cf606 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, #ff4d8d04 0%, transparent 50%)" }} />
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='30' y='35' text-anchor='middle' font-size='14' fill='%2300d4ff' opacity='0.04' font-family='monospace'%3E01%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }} />
      </div>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg}}::selection{background:${C.cyan}30}input::placeholder{color:${C.dim}}`}</style>
      <LeadModal
        open={showForm}
        onClose={() => setShowForm(false)}
        testResult={testDone ? { score: testScore, level: testLevelNow.name, answers: testAnswers } : undefined}
      />
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:sy>50?`${C.bg}ee`:"transparent",backdropFilter:sy>50?"blur(12px)":"none",borderBottom:sy>50?`1px solid ${C.border}`:"1px solid transparent",transition:"all .3s"}}>
        <div style={{fontFamily:"'Orbitron'",fontSize:12,fontWeight:800,color:C.cyan,letterSpacing:3}}>НЕЙРО-ЮНИТ</div>
        <div style={{fontSize:9,color:C.muted,fontFamily:"'Orbitron'",letterSpacing:1}}>БЕСПЛАТНЫЙ УРОК</div>
      </header>

      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"100px 24px 60px"}}>
        <div style={{ width: "100%", maxWidth: 900 }}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,border:`1px solid ${C.gold}30`,background:`${C.gold}12`,marginBottom:24,animation:"fadeUp .6s ease .1s both"}}><SparkIcon color={C.gold}/><span style={{fontFamily:"'Orbitron'",fontSize:9,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Попробуй новый формат обучения</span></div>
          <h1 style={{fontFamily:"'Orbitron'",fontSize:"clamp(28px, 6vw, 52px)",fontWeight:800,lineHeight:1.25,marginBottom:22,maxWidth:800,marginLeft:"auto",marginRight:"auto",animation:"fadeUp .8s ease .2s both"}}><span style={{color:C.text}}>Учиться так, что </span><span style={{background:`linear-gradient(90deg,${C.cyan},${C.purple},${C.cyan})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite"}}>не хочется останавливаться</span></h1>
          <p style={{fontSize:"clamp(16px, 3vw, 20px)",color:C.muted,lineHeight:1.8,maxWidth:640,marginLeft:"auto",marginRight:"auto",marginBottom:32,animation:"fadeUp .8s ease .4s both"}}>Мы построили платформу, где обучение — это не «досмотри видео до конца», а процесс, который<span style={{color:C.text,fontWeight:500}}> захватывает</span>,<span style={{color:C.text,fontWeight:500}}> удерживает внимание</span> и<span style={{color:C.text,fontWeight:500}}> даёт результат</span>.<br/><br/>Приходи на бесплатный живой урок — покажем, как это работает.</p>
          <div style={{display:"flex",gap:10,marginBottom:32,flexWrap:"wrap",justifyContent:"center",animation:"fadeUp .7s ease .5s both"}}>
            {[{icon:<BrainIcon color={C.cyan} size={20}/>,label:"Наука внутри",color:C.cyan},{icon:<GameIcon color={C.pink} size={20}/>,label:"Геймификация",color:C.pink},{icon:<UserIcon color={C.green} size={20}/>,label:"Живой педагог",color:C.green}].map((p,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,border:`1px solid ${p.color}18`,background:`${p.color}06`}}>{p.icon}<span style={{fontSize:14,color:p.color,fontWeight:600}}>{p.label}</span></div>))}
          </div>
          <div style={{animation:"fadeUp .8s ease .6s both",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><CTABtn big onClick={openForm}>Записаться бесплатно</CTABtn><span style={{fontSize:10,color:C.dim}}>60 мин • без оплаты • без предварительных знаний</span></div>
        </div>
      </section>

      <div style={sectionWrap}>
        <Tag color={C.gold}>Наука внутри</Tag>
        <H2>Почему здесь ты запомнишь больше</H2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#b0b0c0", lineHeight: 1.6, maxWidth: 600, margin: "0 auto 32px" }}>Каждая механика платформы основана на науке об обучении. Вот что это значит для тебя.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
          {scienceBlocks.map((b, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "30px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-1px", background: `linear-gradient(135deg, ${C.cyan}, ${C.purple}, ${C.cyan})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>{b.digit}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{b.title}</div>
              <div style={{ fontSize: 15, color: "#b0b0c0", lineHeight: 1.7 }}>{b.text}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.cyan, paddingTop: 10, borderTop: `1px solid ${C.border}`, lineHeight: 1.5 }}>→ {b.result}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 32, fontSize: 17, fontWeight: 500, color: C.text, lineHeight: 1.6 }}>
          На бесплатном уроке ты увидишь каждую из этих механик <span style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>в действии</span>.
        </p>
      </div><SectionDiv/>

      <div style={sectionWrap}>
        <Tag color={C.cyan}>Проверь себя</Tag>
        <H2>Узнай свой уровень в ИИ</H2>
        <p style={{ textAlign: "center", fontSize: 16, color: C.muted, marginBottom: 24 }}>7 вопросов • 1 минута • без регистрации</p>

        <div style={{ width: "100%", height: 4, background: C.border, borderRadius: 2, marginBottom: 24 }}>
          <div style={{ width: `${testDone ? 100 : (testStep / testQuestions.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>

        {!testDone ? (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "28px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 12, color: C.cyan }}>ВОПРОС {testStep + 1} / {testQuestions.length}</span>
              <span style={{ fontSize: 13, color: C.dim }}>{testScore} баллов</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 20, lineHeight: 1.4 }}>{testQuestions[testStep].q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {testQuestions[testStep].opts.map((opt, j) => (
                <button key={j} type="button" onClick={() => handleTestAnswer(j)} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12,
                  background: "transparent", border: `1px solid ${C.border}`, color: C.text, fontSize: 15,
                  fontFamily: "Inter, sans-serif", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.cyan}60`; e.currentTarget.style.background = `${C.cyan}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, border: `1px solid ${C.cyan}50`, background: `${C.cyan}15`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron'", fontSize: 13, fontWeight: 700, color: C.cyan }}>
                    {String.fromCharCode(65 + j)}
                  </span>
                  <span style={{ lineHeight: 1.4 }}>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(135deg, ${C.card}, ${testLevelNow.color}08)`, border: `1px solid ${testLevelNow.color}25`, borderRadius: 18, padding: "36px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{testLevelNow.emoji}</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: 13, color: testLevelNow.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Твой уровень</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>{testLevelNow.name}</div>
            <div style={{ fontSize: 16, color: C.muted, marginBottom: 24, lineHeight: 1.6, maxWidth: 420, margin: "0 auto 24px" }}>{testLevelNow.desc}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 32, fontWeight: 800, color: testLevelNow.color }}>{testScore}</div>
                <div style={{ fontSize: 12, color: C.dim }}>из 21</div>
              </div>
              <div style={{ width: 160, height: 8, background: C.border, borderRadius: 4 }}>
                <div style={{ width: `${(testScore / 21) * 100}%`, height: "100%", background: testLevelNow.color, borderRadius: 4 }} />
              </div>
            </div>
            <CTABtn big onClick={openForm}>Записаться на урок</CTABtn>
            <div style={{ marginTop: 10, fontSize: 12, color: C.dim }}>Результат теста отправим вместе с заявкой</div>
            <div style={{ marginTop: 16 }}>
              <button type="button" onClick={() => { setTestStep(0); setTestAnswers([]); setTestDone(false); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>Пройти заново</button>
            </div>
          </div>
        )}
      </div><SectionDiv/>

      <div style={sectionWrap}>
        <Tag color={C.cyan}>На уроке</Tag><H2>Что тебя ждёт</H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
          {lessonCards.map((c, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 14px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.emoji}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: c.color, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 15, color: "#b0b0c0", lineHeight: 1.5 }}>{c.text}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "12px 14px", background: `${C.gold}06`, borderRadius: 10, border: `1px solid ${C.gold}12`, textAlign: "center" }}><span style={{ fontSize: 15, color: C.gold }}><span style={{ fontWeight: 700 }}>Для кого:</span> абсолютные новички. Никаких знаний не нужно.</span></div>
      </div><SectionDiv/>

      <section style={{ padding: "40px 24px", maxWidth: 1060, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <Tag color={C.purple}>Кто ведёт</Tag>
        <H2>Игорь Журкин</H2>
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}>
          <div style={{
            flex: "0 0 280px",
            alignSelf: "stretch",
            position: "relative",
            background: `linear-gradient(135deg, ${C.cyan}10, ${C.purple}10)`,
          }}>
            <img src="/author.jpg" alt="Игорь Журкин" style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              display: "block",
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 280, paddingTop: 20, paddingLeft: 28, paddingRight: 28, paddingBottom: 28 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#00d4ff", letterSpacing: 0, marginBottom: 20, lineHeight: 1.5 }}>
              Основатель НЕЙРО-ЮНИТ • 20 лет в IT • 3 года внедряет ИИ в бизнес • учёный-практик
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { emoji: "🏛️", color: C.cyan, title: "Преподаватель Университета ИТМО", text: "Факультет СПО + кафедра технологий профессионального обучения. Курс «Проектирование информационных систем». 7+ лет." },
                { emoji: "🔬", color: C.purple, title: "Учёный, аспирант ИТМО", text: "Публикации в РИНЦ: психология восприятия, структурирование учебного материала, методики запоминания." },
                { emoji: "🏆", color: C.gold, title: "Автор проекта «Магия ума»", text: "Образовательная онлайн-игра. Дипломы Всероссийского форума «Образовательная среда» и Правительства СПб." },
                { emoji: "📕", color: C.green, title: "Крупнейший курс по ИИ в России", text: "Автор курса по нейросетям для издательства «Просвещение»." },
                { emoji: "🎬", color: C.pink, title: "176 000 подписчиков YouTube", text: "Практика ИИ: бизнес, маркетинг, копирайтинг, автоматизация." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22, flexShrink: 0, alignSelf: "flex-start", marginTop: 3 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 15, color: "#b0b0c0", lineHeight: 1.5 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section><SectionDiv/>

      <div style={{ ...sectionWrap, padding: "50px 24px 36px", textAlign: "center" }}>
        <Tag color={C.gold}>Старт через</Tag>
        <H2>Вторник, 14 апреля 2026 — 19:00 МСК</H2>
        <Timer/>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b0b0c0", marginTop: 26, marginBottom: 12, lineHeight: 1.5, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>Приходи посмотреть, как это устроено</p>
        <p style={{fontSize:16,color:C.muted,lineHeight:1.6,marginBottom:26,maxWidth:400,margin:"0 auto 26px"}}>60 минут. Бесплатно. Живой преподаватель + AI-платформа. Никаких предварительных знаний.</p>
        <CTABtn big onClick={openForm}>Записаться на урок</CTABtn>
        <div style={{marginTop:14}}><span style={{fontSize:10,color:C.dim}}>Без оплаты • Без карты • Без спама</span></div>
      </div>

      <footer style={{padding:"28px 20px 16px",textAlign:"center",borderTop:`1px solid ${C.border}`,marginTop:36}}><div style={{fontFamily:"'Orbitron'",fontSize:10,color:C.dim,letterSpacing:2,marginBottom:4}}>НЕЙРО-ЮНИТ</div><div style={{fontSize:10,color:C.dim}}>Платформа персонализированного ИИ-образования</div></footer>
    </div>
  );
}
