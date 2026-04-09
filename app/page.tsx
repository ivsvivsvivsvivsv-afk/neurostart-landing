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

const Icon = ({ children, color = C.cyan, size = 40 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: 12, background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</div>
);
const BrainIcon = ({ color = C.cyan }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2a5 5 0 00-4.5 7.2A5 5 0 004 14a5 5 0 003.5 4.8A3 3 0 0012 22a3 3 0 004.5-3.2A5 5 0 0020 14a5 5 0 00-3.5-4.8A5 5 0 0012 2z"/><path d="M12 2v20" strokeDasharray="2 3" opacity="0.5"/></svg>);
const SparkIcon = ({ color = C.gold }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>);
const TargetIcon = ({ color = C.purple }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill={color}/></svg>);
const ChatIcon = ({ color = C.green }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>);
const GameIcon = ({ color = C.pink }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="3"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="4" y1="12" x2="8" y2="12"/><circle cx="16" cy="10" r="1" fill={color}/><circle cx="19" cy="12" r="1" fill={color}/></svg>);
const BookIcon = ({ color = C.cyan }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>);
const AwardIcon = ({ color = C.gold }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" strokeLinecap="round"/></svg>);
const PenIcon = ({ color = C.purple }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>);
const UserIcon = ({ color = C.cyan }: { color?: string }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

const SectionDiv = () => (<div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"44px 0",gap:12 }}><div style={{ width:50,height:1,background:`linear-gradient(90deg,transparent,${C.cyan}25)` }}/><div style={{ width:4,height:4,borderRadius:"50%",background:C.cyan,opacity:.25 }}/><div style={{ width:50,height:1,background:`linear-gradient(90deg,${C.cyan}25,transparent)` }}/></div>);
const Tag = ({ children, color = C.cyan }: { children: React.ReactNode; color?: string }) => (<div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:10,color,letterSpacing:3,textTransform:"uppercase",marginBottom:14,textAlign:"center" }}>{children}</div>);
const H2 = ({ children }: { children: React.ReactNode }) => (<h2 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(19px,4.5vw,27px)",fontWeight:800,textAlign:"center",marginBottom:14,lineHeight:1.3,color:C.text }}>{children}</h2>);
const CTABtn = ({ children, big, onClick }: { children: React.ReactNode; big?: boolean; onClick?: () => void }) => (<button onClick={onClick} style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",padding:big?"16px 40px":"14px 30px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.cyan},${C.cyanDk})`,color:"#000",fontFamily:"'Orbitron',sans-serif",fontSize:big?13:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",boxShadow:`0 0 24px ${C.cyan}20,0 4px 16px rgba(0,0,0,0.3)` }}>{children}</button>);

const Timer = () => {
  const [t, setT] = useState({ d:2,h:14,m:37,s:52 });
  useEffect(() => { const i = setInterval(() => setT(p => { let{d,h,m,s}=p;s--;if(s<0){s=59;m--}if(m<0){m=59;h--}if(h<0){h=23;d--}if(d<0)return{d:0,h:0,m:0,s:0};return{d,h,m,s} }),1000); return()=>clearInterval(i) },[]);
  const B = ({v,l}:{v:number;l:string}) => (<div style={{textAlign:"center"}}><div style={{fontFamily:"'Orbitron'",fontSize:22,fontWeight:700,color:C.cyan,background:`${C.cyan}08`,border:`1px solid ${C.cyan}15`,borderRadius:8,padding:"4px 10px",minWidth:44}}>{String(v).padStart(2,"0")}</div><div style={{fontSize:8,color:C.dim,marginTop:3,letterSpacing:1,textTransform:"uppercase"}}>{l}</div></div>);
  return (<div style={{display:"flex",gap:8,justifyContent:"center"}}><B v={t.d} l="дни"/><span style={{fontFamily:"'Orbitron'",fontSize:18,color:`${C.cyan}25`,paddingTop:4}}>:</span><B v={t.h} l="часы"/><span style={{fontFamily:"'Orbitron'",fontSize:18,color:`${C.cyan}25`,paddingTop:4}}>:</span><B v={t.m} l="мин"/><span style={{fontFamily:"'Orbitron'",fontSize:18,color:`${C.cyan}25`,paddingTop:4}}>:</span><B v={t.s} l="сек"/></div>);
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

const scienceBlocks: { color: string; digit: string; title: string; text: string; badge: string }[] = [
  { color: C.gold, digit: "2σ", title: "Задача Блума — решена", text: "В 1984 году Бенджамин Блум доказал: ученик с персональным репетитором обгоняет 98% класса. Проблема — репетитора невозможно дать каждому. Наш AI-тьютор решает эту задачу: он знает тему, знает тебя и адаптируется в реальном времени.", badge: "Bloom's 2-Sigma Problem → AI-тьютор как персональный репетитор" },
  { color: C.pink, digit: "+73%", title: "Вовлечённость через геймификацию", text: "Квесты, XP, мини-игры, босс-файты — мозг получает дофамин при каждом достижении. Исследования показывают: геймификация повышает вовлечённость на 73% и на 45% снижает количество бросивших обучение.", badge: "Дофаминовые петли → маленькие победы → желание продолжать" },
  { color: C.cyan, digit: "×2.5", title: "Обучение через действие", text: "Ты не смотришь лекции — ты играешь, пишешь промпты, решаешь задачи и получаешь обратную связь. Каждый урок — цикл: попробуй → осмысли → изучи теорию → примени снова. Запоминание в 2.5 раза выше, чем при пассивном просмотре.", badge: "Цикл Колба → опыт → рефлексия → теория → практика" },
  { color: C.purple, digit: "6", title: "Осей когнитивного профиля", text: "Платформа незаметно определяет 6 параметров: визуал/вербал, темп, глубина, риск, системность, самостоятельность. Без тестов и анкет — по реальным действиям. Из этих данных строится цифровой двойник ученика.", badge: "Стелс-профилирование → данные из поведения, не из самоотчётов" },
  { color: C.green, digit: "FLOW", title: "Состояние потока", text: "Когда задача слишком лёгкая — скучно. Слишком сложная — тревога. Платформа держит тебя в зоне потока: AI-методист после каждого урока анализирует результаты и подстраивает сложность следующего.", badge: "Теория потока Чиксентмихайи → оптимальный вызов на каждом шаге" },
  { color: C.gold, digit: "24/7", title: "AI-тьютор подстраивается под тебя", text: "После каждого урока AI-методист пересобирает промпт тьютора на основе твоего профиля. Тьютор знает твои сильные стороны, слабые темы и стиль обучения. Он становится точнее с каждым уроком.", badge: "Хьютагогика → самоопределяемое обучение с AI-поддержкой" },
];

export default function Landing() {
  const [sy,setSy]=useState(0);const [showForm,setShowForm]=useState(false);
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [testDone, setTestDone] = useState(false);

  useEffect(()=>{const f=()=>setSy(window.scrollY);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f)},[]);
  const sec:React.CSSProperties={padding:"40px 24px",maxWidth:680,margin:"0 auto"};
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
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter','Segoe UI',sans-serif",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg}}::selection{background:${C.cyan}30}input::placeholder{color:${C.dim}}
@media (min-width: 768px) {
  .nu-sec { max-width: 760px !important; }
  .nu-grid { grid-template-columns: 1fr 1fr 1fr !important; }
  .nu-grid-science { grid-template-columns: 1fr 1fr !important; }
}
@media (min-width: 1024px) {
  .nu-sec { max-width: 860px !important; }
}`}</style>
      <LeadModal
        open={showForm}
        onClose={() => setShowForm(false)}
        testResult={testDone ? { score: testScore, level: testLevelNow.name, answers: testAnswers } : undefined}
      />
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:sy>50?`${C.bg}ee`:"transparent",backdropFilter:sy>50?"blur(12px)":"none",borderBottom:sy>50?`1px solid ${C.border}`:"1px solid transparent",transition:"all .3s"}}>
        <div style={{fontFamily:"'Orbitron'",fontSize:12,fontWeight:800,color:C.cyan,letterSpacing:3}}>НЕЙРО-ЮНИТ</div>
        <div style={{fontSize:9,color:C.muted,fontFamily:"'Orbitron'",letterSpacing:1}}>БЕСПЛАТНЫЙ УРОК</div>
      </header>

      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 24px 40px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,border:`1px solid ${C.gold}20`,background:`${C.gold}06`,marginBottom:24,animation:"fadeUp .6s ease .1s both"}}><SparkIcon color={C.gold}/><span style={{fontFamily:"'Orbitron'",fontSize:9,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Попробуй новый формат обучения</span></div>
        <h1 style={{fontFamily:"'Orbitron'",fontSize:"clamp(24px, 6vw, 42px)",fontWeight:800,lineHeight:1.25,marginBottom:22,maxWidth:720,animation:"fadeUp .8s ease .2s both"}}><span style={{color:C.text}}>Учиться так, что </span><span style={{background:`linear-gradient(90deg,${C.cyan},${C.purple},${C.cyan})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite"}}>не хочется останавливаться</span></h1>
        <p style={{fontSize:"clamp(15px, 3vw, 18px)",color:C.muted,lineHeight:1.8,maxWidth:580,marginBottom:32,animation:"fadeUp .8s ease .4s both"}}>Мы построили платформу, где обучение — это не «досмотри видео до конца», а процесс, который<span style={{color:C.text,fontWeight:500}}> захватывает</span>,<span style={{color:C.text,fontWeight:500}}> удерживает внимание</span> и<span style={{color:C.text,fontWeight:500}}> даёт результат</span>.<br/><br/>Приходи на бесплатный живой урок — покажем, как это работает.</p>
        <div style={{display:"flex",gap:10,marginBottom:32,flexWrap:"wrap",justifyContent:"center",animation:"fadeUp .7s ease .5s both"}}>
          {[{icon:<BrainIcon color={C.cyan}/>,label:"Наука внутри",color:C.cyan},{icon:<GameIcon color={C.pink}/>,label:"Геймификация",color:C.pink},{icon:<UserIcon color={C.green}/>,label:"Живой педагог",color:C.green}].map((p,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,border:`1px solid ${p.color}18`,background:`${p.color}06`}}>{p.icon}<span style={{fontSize:12,color:p.color,fontWeight:600}}>{p.label}</span></div>))}
        </div>
        <div style={{animation:"fadeUp .8s ease .6s both",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><CTABtn big onClick={openForm}>Записаться бесплатно</CTABtn><span style={{fontSize:10,color:C.dim}}>60 мин • без оплаты • без предварительных знаний</span></div>
      </section>

      <section style={sec} className="nu-sec">
        <Tag color={C.gold}>Наука внутри</Tag>
        <H2>Что стоит за платформой — в цифрах</H2>
        <p style={{ textAlign: "center", fontSize: 15, color: C.muted, marginBottom: 28, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 28px" }}>Мы взяли проверенные научные теории и встроили их в каждую механику платформы.</p>
        <div className="nu-grid-science" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {scienceBlocks.map((b, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 22px" }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 34, fontWeight: 900, color: b.color, marginBottom: 8, lineHeight: 1.1 }}>{b.digit}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: b.color, marginBottom: 8 }}>{b.title}</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.65, opacity: 0.9 }}>{b.text}</div>
              <div style={{ marginTop: 12, padding: "8px 14px", borderRadius: 8, borderLeft: `3px solid ${b.color}`, background: `${b.color}06`, fontSize: 12, color: C.muted }}>{b.badge}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 16, fontWeight: 500, color: C.text, lineHeight: 1.6 }}>
          Всё это работает вместе — и на бесплатном уроке ты увидишь каждую из этих механик <span style={{ color: C.cyan }}>в действии</span>.
        </p>
      </section><SectionDiv/>

      <section className="nu-sec" style={sec}>
        <Tag color={C.cyan}>Проверь себя</Tag>
        <H2>Узнай свой уровень в ИИ</H2>
        <p style={{ textAlign: "center", fontSize: 15, color: C.muted, marginBottom: 24 }}>7 вопросов • 1 минута • без регистрации</p>

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
      </section><SectionDiv/>

      <section style={sec} className="nu-sec">
        <Tag color={C.cyan}>На уроке</Tag><H2>Что тебя ждёт</H2>
        <div className="nu-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{icon:<UserIcon color={C.green}/>,color:C.green,title:"Живой преподаватель",text:"Объясняет, отвечает на вопросы, ведёт по платформе"},{icon:<ChatIcon color={C.purple}/>,color:C.purple,title:"AI-тьютор в чате",text:"Персональный помощник, который знает тему и подстраивается"},{icon:<GameIcon color={C.pink}/>,color:C.pink,title:"Мини-игра",text:"Собирай полезные принципы, уворачивайся от ловушек"},{icon:<PenIcon color={C.gold}/>,color:C.gold,title:"Практика + AI-критик",text:"Напишешь промпт — ИИ оценит и подскажет, что улучшить"},{icon:<BrainIcon color={C.cyan}/>,color:C.cyan,title:"Адаптация под тебя",text:"Увидишь, как платформа подстраивает контент в реальном времени"},{icon:<BookIcon color={C.text}/>,color:C.text,title:"Основы ИИ с нуля",text:"Нейросети, промпты, токены — без жаргона, простым языком"}].map((c,i)=>(<div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 14px"}}><div style={{marginBottom:10}}><Icon color={c.color} size={36}>{c.icon}</Icon></div><div style={{fontSize:15,fontWeight:600,color:c.color,marginBottom:4}}>{c.title}</div><div style={{fontSize:14,color:C.muted,lineHeight:1.5}}>{c.text}</div></div>))}
        </div>
        <div style={{marginTop:16,padding:"12px 14px",background:`${C.gold}06`,borderRadius:10,border:`1px solid ${C.gold}12`,textAlign:"center"}}><span style={{fontSize:14,color:C.gold}}><span style={{fontWeight:700}}>Для кого:</span> абсолютные новички. Никаких знаний не нужно.</span></div>
      </section><SectionDiv/>

      <section style={sec} className="nu-sec">
        <Tag color={C.purple}>Кто ведёт</Tag>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"24px 20px"}}>
          <div style={{textAlign:"center",marginBottom:20}}><div style={{width:96,height:96,borderRadius:"50%",background:`linear-gradient(135deg,${C.cyan}20,${C.purple}20)`,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.cyan}20`,overflow:"hidden"}}><img src="/author.jpg" alt="Игорь Журкин" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%" }} /></div><div style={{fontFamily:"'Orbitron'",fontSize:17,fontWeight:700,marginBottom:3}}>Игорь Журкин</div><div style={{fontSize:10,color:C.cyan,fontFamily:"'Orbitron'",letterSpacing:1}}>ОСНОВАТЕЛЬ НЕЙРО-ЮНИТ</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{icon:<BookIcon color={C.cyan}/>,color:C.cyan,title:"Преподаватель Университета ИТМО",text:"Факультет среднего профессионального образования + кафедра технологий профессионального обучения (курс «Проектирование информационных систем»). 7+ лет."},{icon:<PenIcon color={C.purple}/>,color:C.purple,title:"Учёный, аспирант ИТМО",text:"Научные публикации в РИНЦ: психология цветового восприятия, структурирование учебного материала, методики запоминания."},{icon:<AwardIcon color={C.gold}/>,color:C.gold,title:"Автор проекта «Магия ума»",text:"Образовательная онлайн-игра — дипломы Всероссийского форума «Образовательная среда», Правительства СПб. Внедрена в школах 4 регионов."},{icon:<BookIcon color={C.green}/>,color:C.green,title:"Крупнейший курс по ИИ в России",text:"Автор курса по нейросетям для издательства «Просвещение» — главного образовательного издательства страны."},{icon:<SparkIcon color={C.pink}/>,color:C.pink,title:"176 000 подписчиков YouTube",text:"Практика ИИ: бизнес, маркетинг, копирайтинг, автоматизация."}].map((item,i)=>(<div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 12px",background:`${item.color}04`,borderRadius:10,border:`1px solid ${item.color}08`}}><Icon color={item.color} size={36}>{item.icon}</Icon><div><div style={{fontSize:15,fontWeight:600,color:item.color,marginBottom:2}}>{item.title}</div><div style={{fontSize:14,color:C.muted,lineHeight:1.5}}>{item.text}</div></div></div>))}
          </div>
        </div>
      </section><SectionDiv/>

      <section style={sec} className="nu-sec">
        <Tag color={C.green}>Куда это ведёт</Tag><H2>Вход в 21-дневную программу</H2>
        <div style={{position:"relative",paddingLeft:28}}>
          <div style={{position:"absolute",left:8,top:4,bottom:4,width:2,background:`linear-gradient(180deg,${C.cyan}50,${C.purple}40,${C.gold}20,${C.dim}15)`}}/>
          {[{color:C.cyan,dot:"◉",title:"Урок 0 — Нейростарт",text:"Основы ИИ + знакомство с платформой",active:true},{color:C.purple,dot:"◎",title:"Урок 1 — Базовый промптинг",text:"Формула RICEF — 5 элементов идеального промпта"},{color:C.purple,dot:"◎",title:"Урок 2 — Продвинутый промптинг",text:"Chain-of-Thought, Few-Shot, техники экспертов"}].map((s,i)=>(<div key={i} style={{marginBottom:18,position:"relative"}}><div style={{position:"absolute",left:-24,top:2,fontSize:13,color:s.color}}>{s.dot}</div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span style={{fontFamily:"'Orbitron'",fontSize:12,color:s.color,letterSpacing:.5}}>{s.title}</span>{s.active&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${C.cyan}12`,color:C.cyan,fontFamily:"'Orbitron'",fontWeight:600}}>ТЫ ЗДЕСЬ</span>}</div><div style={{fontSize:14,color:C.muted,lineHeight:1.5}}>{s.text}</div></div>))}
          {[3,4,5].map(n=>(<div key={n} style={{marginBottom:8,position:"relative",display:"flex",alignItems:"center",gap:8}}><div style={{position:"absolute",left:-24,top:3,fontSize:12,color:C.dim}}>○</div><span style={{fontFamily:"'Orbitron'",fontSize:11,color:C.dim}}>Урок {n}</span><div style={{flex:1,height:1,background:C.border}}/></div>))}
          <div style={{marginBottom:8,position:"relative"}}><div style={{position:"absolute",left:-21,top:0,fontSize:10,color:C.dim}}>⋮</div></div>
          <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,marginTop:12}}><div style={{position:"absolute",left:-24,top:3,fontSize:12,color:C.gold}}>○</div><span style={{fontFamily:"'Orbitron'",fontSize:11,color:C.gold}}>Урок 21 — Финал программы</span></div>
          <div style={{marginTop:18,padding:"10px 12px",background:`${C.green}06`,borderRadius:8,border:`1px solid ${C.green}10`,marginLeft:-4}}><span style={{fontSize:14,color:C.green,lineHeight:1.5}}><span style={{fontWeight:700}}>21 день</span> — от «что такое ИИ» до уверенного владения. С каждым уроком платформа знает тебя лучше.</span></div>
        </div>
      </section><SectionDiv/>

      <section className="nu-sec" style={{...sec,padding:"50px 24px 36px",textAlign:"center"}}>
        <Tag color={C.gold}>Старт через</Tag><Timer/>
        <h2 style={{fontFamily:"'Orbitron'",fontSize:"clamp(19px,4.5vw,28px)",fontWeight:800,marginTop:26,marginBottom:12,lineHeight:1.25}}><span style={{color:C.text}}>Приходи посмотреть, </span><span style={{color:C.cyan}}>как это устроено</span></h2>
        <p style={{fontSize:15,color:C.muted,lineHeight:1.6,marginBottom:26,maxWidth:400,margin:"0 auto 26px"}}>60 минут. Бесплатно. Живой преподаватель + AI-платформа. Никаких предварительных знаний.</p>
        <CTABtn big onClick={openForm}>Записаться на урок</CTABtn>
        <div style={{marginTop:14}}><span style={{fontSize:10,color:C.dim}}>Без оплаты • Без карты • Без спама</span></div>
      </section>

      <footer style={{padding:"28px 20px 16px",textAlign:"center",borderTop:`1px solid ${C.border}`,marginTop:36}}><div style={{fontFamily:"'Orbitron'",fontSize:10,color:C.dim,letterSpacing:2,marginBottom:4}}>НЕЙРО-ЮНИТ</div><div style={{fontSize:10,color:C.dim}}>Платформа персонализированного ИИ-образования</div></footer>
    </div>
  );
}
