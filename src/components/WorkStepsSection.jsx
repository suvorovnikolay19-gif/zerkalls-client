import { useState, useEffect, useRef } from 'react';
import photoSrc from '../../assets/partitions.jpg';

const ACCENT = '#c9ff4b';
const FOG = 0.75;

const STAGES = [
  ["Обсуждаем ваш проект", "Знакомимся с вашей задачей, изучаем проект и пожелания. Обсуждаем внешний вид, конструкцию, особенности пространства и варианты исполнения. Вместе определяем решение, которое подходит вашему интерьеру и тому, как вы будете пользоваться изделием."],
  ["Рассчитываем полную стоимость", "Готовим коммерческое предложение с учётом всех согласованных решений и условий: изделия, доставки, подъёма и монтажа. Вы заранее знаете, что входит в заказ и сколько он стоит. Всё оговорённое уже учтено — без неожиданных доплат за согласованный объём работ."],
  ["Закрепляем договорённости", "Работаем по договору: фиксируем выбранное решение, стоимость, состав работ и условия выполнения заказа. У вас на руках документ, в котором закреплены наши обязательства."],
  ["Проводим точный замер", "Выезжаем на объект, выполняем замеры и проверяем геометрию пространства с помощью лазерного оборудования. Учитываем особенности места установки. Выявленные расхождения и нюансы обсуждаем с вами до проектирования."],
  ["Проектируем ваше изделие", "Разрабатываем индивидуальный проект с точными размерами и деталями конструкции. Отправляем его вам на согласование, чтобы будущий результат был понятен заранее. После утверждения готовим рабочие чертежи и файлы для производства."],
  ["Изготавливаем и проверяем качество", "Производим изделие по утверждённому проекту. Проверяем размеры, качество изготовления и соответствие согласованным решениям. Контроль перед отправкой — отдельный этап подготовки вашего заказа к установке."],
  ["Организуем доставку и подъём", "Согласовываем с вами дату установки. Доставляем изделие специализированным транспортом и организуем подъём к месту монтажа, включая необходимые такелажные работы. Все согласованные вопросы доставки берём на себя."],
  ["Бережно устанавливаем", "Перед началом монтажа укрываем рабочую зону, чтобы защитить отделку и имущество. Устанавливаем изделие с использованием лазерных построителей: выверяем положение, соблюдаем геометрию и уделяем внимание точности примыканий."],
  ["Проверяем и наводим порядок", "Проверяем работу изделия и его механизмов. Очищаем поверхности после монтажа, убираем рабочую зону, собираем и вывозим свой мусор. Передаём вам готовое к использованию изделие."],
  ["Вместе принимаем результат", "Вместе с вами осматриваем установленное изделие: проверяем соответствие проекту, качество и функциональность. Показываем, как всё работает, и отвечаем на вопросы. Завершаем заказ сдачей готовой работы."],
];

const DIALOG = [
  { side: "us",   text: "Здравствуйте! Хочу сделать заказ" },
  { side: "them", text: "Окей, что вас интересует?" },
  { side: "us",   text: "Нужна перегородка LOFT" },
  { side: "them", text: "Сделаем. Какие сроки?" },
  { side: "us",   text: "Хотелось бы за неделю" },
  { side: "them", text: "Успеем. Смету пришлю сегодня к вечеру" },
];

const NODE_POS = [
  { left: '88.71%', top: '11.30%' },
  { left: '89.91%', top: '19.90%' },
  { left: '90.81%', top: '28.50%' },
  { left: '91.41%', top: '37.10%' },
  { left: '91.71%', top: '45.70%' },
  { left: '91.71%', top: '54.30%' },
  { left: '91.41%', top: '62.90%' },
  { left: '90.81%', top: '71.50%' },
  { left: '89.91%', top: '80.10%' },
  { left: '88.71%', top: '88.70%' },
];

function px(u) { return 88 * (Math.pow(1 - u, 3) + Math.pow(u, 3)) + 279 * u * (1 - u); }
function py(t) { return 7 + 86 * t; }
function subPath(t) {
  const P = [[88,7],[93,35.67],[93,64.33],[88,93]];
  const L = (a,b) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
  const A=L(P[0],P[1]), B=L(P[1],P[2]), C=L(P[2],P[3]);
  const D=L(A,B), E=L(B,C), F=L(D,E);
  const f=(p)=>p[0].toFixed(2)+','+p[1].toFixed(2);
  return 'M'+f(P[0])+' C'+f(A)+' '+f(D)+' '+f(F);
}

export default function WorkStepsSection({ onContact }) {
  const [idx, setIdx]           = useState(0);
  const [started, setStarted]   = useState(false);
  const [chat, setChat]         = useState(false);
  const [shown, setShown]       = useState(0);
  const [typing, setTyping]     = useState(false);
  const [chatDone, setChatDone] = useState(false);

  const journeyRef  = useRef(null);
  const canvasRef   = useRef(null);
  const dotRef      = useRef(null);
  const progressRef = useRef(null);
  const nodeRefs    = useRef([]);
  const svgRef      = useRef(null);
  const capRef      = useRef(null);
  const rafRef      = useRef(null);
  const chatTimers  = useRef([]);

  // Mutable state for animation loop (no stale-closure issues)
  const pRef         = useRef(0);
  const startedRef   = useRef(false);
  const idxRef       = useRef(0);
  const dustRef      = useRef([]);
  const shardsRef    = useRef([]);
  const photoRef     = useRef(null);

  useEffect(() => { startedRef.current = started; }, [started]);

  // ── Canvas paint ──
  function paint(now) {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#05060a'; ctx.fillRect(0,0,w,h);
    const cx=w/2, cy=h/2;
    const p = pRef.current;
    const off = p*26 + now*0.00003;
    const N=26;
    for (let i=0;i<N;i++) {
      let u=((i/N-off)%1+1)%1;
      const z=0.16+u*7, k=1/z;
      const rw=w*0.82*k, rh=h*0.6*k;
      const a=Math.min(1,u*6)*(1-u)*0.3*FOG;
      if (a<=0.002) continue;
      ctx.strokeStyle=`rgba(164,206,226,${a.toFixed(3)})`; ctx.lineWidth=1;
      ctx.beginPath(); ctx.rect(cx-rw/2,cy-rh/2,rw,rh); ctx.stroke();
    }
    ctx.strokeStyle=`rgba(164,206,226,${(0.1*FOG).toFixed(3)})`;
    ctx.beginPath();
    [[0,0],[w,0],[0,h],[w,h]].forEach(([x,y])=>{ctx.moveTo(cx,cy);ctx.lineTo(x,y);});
    ctx.stroke();
    const gp=p*10;
    for (let i=9;i>=0;i--) {
      const z=(i+0.5)-gp;
      if (z<-0.2||z>5.5) continue;
      const k=1/(0.34+z*0.92);
      const gw=w*0.52*k, gh=h*0.44*k;
      const near=Math.min(1,(z+0.2)/0.6), far=Math.min(1,(5.5-z)/2.2);
      const a=near*far;
      const hot=Math.max(0,1-Math.abs(z)/1.2);
      ctx.save();
      if (photoRef.current) {
        const ph=photoRef.current;
        const x0=cx-gw/2, y0=cy-gh/2;
        ctx.save();
        ctx.beginPath(); ctx.rect(x0,y0,gw,gh); ctx.clip();
        const ir=ph.width/ph.height, gr=gw/gh;
        const dw=ir>gr?gh*ir:gw, dh=ir>gr?gh:gw/ir;
        ctx.globalAlpha=a*(0.3+hot*0.7);
        ctx.drawImage(ph,cx-dw/2,cy-dh/2,dw,dh);
        ctx.globalAlpha=a*(0.42-hot*0.34); ctx.fillStyle='#05060a'; ctx.fillRect(x0,y0,gw,gh);
        if (hot>0.05) { ctx.globalAlpha=a*hot*0.16; ctx.fillStyle=ACCENT; ctx.fillRect(x0,y0,gw,gh); }
        ctx.restore();
      }
      ctx.lineWidth=1+hot*1.4;
      ctx.strokeStyle=hot>0.05?ACCENT:'rgba(190,208,220,1)';
      ctx.globalAlpha=a*(0.22+hot*0.5);
      ctx.strokeRect(cx-gw/2,cy-gh/2,gw,gh);
      if (photoRef.current) {
        const ph=photoRef.current;
        const minis=shardsRef.current[i]||[];
        minis.forEach(m=>{
          const zm=z-(m.dz||0); if (zm<-0.45) return;
          const km=1/(0.34+zm*0.92);
          const mw=w*0.52*km, mh=h*0.44*km;
          const ms=mw*m.s;
          const mx=cx+mw*m.x, my=cy+mh*m.y;
          ctx.save(); ctx.translate(mx,my); ctx.rotate(m.rot);
          ctx.globalAlpha=a*(0.42+hot*0.5);
          ctx.drawImage(ph,m.sx*ph.width,m.sy*ph.height,m.sw*ph.width,m.sw*ph.width,-ms/2,-ms/2,ms,ms);
          ctx.globalAlpha=a*(0.3+hot*0.45); ctx.lineWidth=1;
          ctx.strokeStyle=hot>0.15?ACCENT:'rgba(226,240,246,.6)';
          ctx.strokeRect(-ms/2,-ms/2,ms,ms);
          ctx.restore();
        });
      }
      const fs=Math.min(h*0.5,26*k*(h/900));
      if (fs>7) {
        ctx.globalAlpha=a*(0.28+hot*0.62);
        ctx.fillStyle=hot>0.05?ACCENT:'rgba(206,220,230,1)';
        ctx.font=`500 ${fs.toFixed(0)}px 'JetBrains Mono',ui-monospace,monospace`;
        ctx.textBaseline='bottom';
        ctx.fillText(String(i+1).padStart(2,'0'),cx-gw/2+fs*0.3,cy-gh/2-fs*0.22);
      }
      ctx.restore();
    }
    dustRef.current.forEach(d=>{
      let u=((d.u-off*0.6*d.s)%1+1)%1;
      const k=1/(0.2+u*7);
      const x=cx+Math.cos(d.a)*d.r*w*0.9*k, y=cy+Math.sin(d.a)*d.r*h*0.9*k;
      const a=Math.min(1,u*5)*(1-u)*0.7;
      ctx.fillStyle=`rgba(226,240,246,${a.toFixed(3)})`; ctx.fillRect(x,y,1.6,1.6);
    });
  }

  // ── Tick ──
  function tick(now) {
    const c=canvasRef.current;
    if (c) {
      const dpr=Math.min(2,window.devicePixelRatio||1);
      const cw=Math.round(c.clientWidth*dpr), ch=Math.round(c.clientHeight*dpr);
      if (cw>0&&ch>0&&(c.width!==cw||c.height!==ch)) { c.width=cw; c.height=ch; }
    }
    const j=journeyRef.current;
    const st=startedRef.current;
    if (j) {
      let r=j.getBoundingClientRect();
      if (st&&r.bottom<=-2) {
        const delta=j.offsetHeight-window.innerHeight;
        j.style.height='100vh';
        window.scrollTo(0,Math.max(0,window.scrollY-delta));
        startedRef.current=false;
        setStarted(false);
        r=j.getBoundingClientRect();
      }
      const span=r.height-window.innerHeight;
      pRef.current=Math.max(0,Math.min(1,span>0?-r.top/span:0));
    }
    const vis=startedRef.current?1:0;
    [svgRef.current,capRef.current,dotRef.current].forEach(el=>{
      if (!el) return;
      el.style.transition='opacity .5s ease';
      el.style.opacity=String(vis);
      el.style.pointerEvents=vis?'':'none';
    });
    const p=pRef.current;
    if (dotRef.current) {
      dotRef.current.style.left=px(p)+'%';
      dotRef.current.style.top=py(p)+'%';
    }
    if (progressRef.current) {
      progressRef.current.style.strokeDasharray='none';
      progressRef.current.setAttribute('d',p>0.0005?subPath(p):'M88,7');
    }
    let hit=0;
    nodeRefs.current.forEach((el,i)=>{
      if (!el) return;
      const t=0.05+0.1*i;
      const passed=p>=t, d=Math.abs(p-t), inside=d<0.009;
      if (inside) hit=Math.max(hit,1-d/0.009);
      el.style.color=inside||passed?ACCENT:(d<0.13?'rgba(236,242,248,.96)':'rgba(208,216,226,.88)');
      el.style.opacity=String(vis);
      el.style.pointerEvents=vis?'':'none';
      el.style.transition='color .45s ease, opacity .5s ease';
      const ring=el.firstElementChild;
      if (ring) {
        ring.style.transform='scale('+(inside?1.55:passed?1.12:1)+')';
        ring.style.boxShadow=inside?`0 0 22px 5px ${ACCENT}66`:'none';
        if (ring.firstElementChild)
          ring.firstElementChild.style.transform='scale('+(passed||inside?1:0)+')';
      }
    });
    if (dotRef.current&&dotRef.current.firstElementChild) {
      const core=dotRef.current.firstElementChild;
      core.style.transform=`translate(-50%,-50%) scale(${1+hit*1.1})`;
      core.style.opacity=String(1-hit*0.55);
    }
    const newIdx=Math.max(0,Math.min(9,Math.floor(p*10)));
    if (newIdx!==idxRef.current) { idxRef.current=newIdx; setIdx(newIdx); }
    paint(now);
  }

  // ── Mount / Unmount ──
  useEffect(()=>{
    dustRef.current=Array.from({length:90},()=>({
      a:Math.random()*Math.PI*2, r:0.1+Math.random()*0.9, u:Math.random(), s:0.4+Math.random()
    }));
    shardsRef.current=Array.from({length:10},(_,i)=>{
      const flip=i%2?-1:1;
      const r=(n)=>((Math.sin((i+1)*n)+1)/2);
      return [
        {x:-0.72*flip,y:-0.26+r(12.9)*0.16,s:0.2,rot:-0.05*flip,sx:0.05+r(7.3)*0.5,sy:0.05+r(3.1)*0.4,sw:0.22},
        {x:0.74*flip,y:0.24+r(5.7)*0.18,s:0.16,rot:0.06*flip,sx:0.1+r(9.4)*0.5,sy:0.12+r(4.6)*0.4,sw:0.18},
        {x:(-0.2+r(2.2)*0.36)*flip,y:0.16+r(6.1)*0.2,s:0.17,dz:0.42,rot:-0.04*flip,sx:0.2+r(11.2)*0.45,sy:0.08+r(8.8)*0.45,sw:0.2}
      ];
    });

    const img=new Image();
    img.onload=()=>{
      const cw=960, ch=Math.round(960*img.height/img.width);
      const oc=document.createElement('canvas'); oc.width=cw; oc.height=ch;
      const octx=oc.getContext('2d');
      octx.filter='saturate(1.06) contrast(1.04)';
      octx.drawImage(img,0,0,cw,ch);
      photoRef.current=oc;
    };
    img.src=photoSrc;

    const onResize=()=>{
      const c=canvasRef.current; if (!c) return;
      const dpr=Math.min(2,window.devicePixelRatio||1);
      c.width=c.clientWidth*dpr; c.height=c.clientHeight*dpr;
    };
    window.addEventListener('resize',onResize,{passive:true});
    onResize();

    const loop=(now)=>{
      try { tick(now||0); } catch(e){}
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);

    return ()=>{
      chatTimers.current.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize',onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // ── Chat ──
  const openChat=()=>{
    chatTimers.current.forEach(clearTimeout);
    chatTimers.current=[];
    setChat(true); setShown(0); setTyping(false); setChatDone(false);
    let t=400;
    DIALOG.forEach((m,i)=>{
      const think=420+m.text.length*18;
      chatTimers.current.push(setTimeout(()=>setTyping(m.side),t));
      t+=think;
      chatTimers.current.push(setTimeout(()=>{ setShown(i+1); setTyping(false); },t));
      t+=600;
    });
    chatTimers.current.push(setTimeout(()=>setChatDone(true),t+200));
  };

  const startJourney=()=>{
    const j=journeyRef.current; if (!j) return;
    chatTimers.current.forEach(clearTimeout); chatTimers.current=[];
    const top=j.getBoundingClientRect().top+window.scrollY;
    j.style.height='480vh';
    setStarted(true); setChat(false);
    requestAnimationFrame(()=>window.scrollTo({top,behavior:'smooth'}));
  };

  const exitJourney=()=>{
    const j=journeyRef.current; if (!j) return;
    const top=j.getBoundingClientRect().top+window.scrollY;
    j.style.height='100vh';
    setStarted(false);
    requestAnimationFrame(()=>window.scrollTo({top:top+window.innerHeight,behavior:'smooth'}));
  };

  const gotoStep=(i)=>{
    const j=journeyRef.current; if (!j) return;
    const top=j.getBoundingClientRect().top+window.scrollY;
    const span=j.offsetHeight-window.innerHeight;
    window.scrollTo({top:top+span*((i+0.5)/10),behavior:'smooth'});
  };

  const gate=!started&&!chat;
  const num=String(idx+1).padStart(2,'0');
  const thumbObjPos=(k)=>`${12+((idx*7+k*43)%76)}% ${28+((idx*11+k*29)%48)}%`;

  const monoFont="'JetBrains Mono',ui-monospace,monospace";
  const unboundedFont="'Unbounded',sans-serif";
  const golosFont="'Golos Text',system-ui,sans-serif";

  return (
    <div style={{width:'100%'}}>

      {/* ── Journey ── */}
      <div ref={journeyRef} style={{position:'relative',height:'100vh',background:'#05060a'}}>
        <div style={{position:'sticky',top:0,height:'100vh',overflow:'hidden',background:'#05060a'}}>

          <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}/>

          {/* Gradients */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(5,6,10,.96) 0%,rgba(5,6,10,.2) 26%,rgba(5,6,10,0) 50%,rgba(5,6,10,.35) 82%,rgba(5,6,10,.9) 100%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,rgba(5,6,10,0) 30%,rgba(5,6,10,.75) 100%)',pointerEvents:'none'}}/>

          {/* SVG path */}
          <svg ref={svgRef} viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',opacity:0,pointerEvents:'none'}}>
            <path d="M88.00,7.00 C93.00,35.67 93.00,64.33 88.00,93.00" fill="none" stroke="rgba(138,146,156,.55)" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>
            <path ref={progressRef} d="M88.00,7.00 C93.00,35.67 93.00,64.33 88.00,93.00" fill="none" stroke={ACCENT} strokeWidth="1.4" vectorEffect="non-scaling-stroke" pathLength="1" strokeLinecap="round" strokeDasharray="0 1" strokeDashoffset="0"/>
          </svg>

          {/* Step nodes */}
          {STAGES.map((s,i)=>(
            <div
              key={i}
              ref={el=>{ nodeRefs.current[i]=el; }}
              onClick={()=>gotoStep(i)}
              style={{
                position:'absolute',
                left:NODE_POS[i].left,
                top:NODE_POS[i].top,
                transform:'translate(calc(-100% + 8px),-50%)',
                display:'flex',
                flexDirection:'row-reverse',
                alignItems:'center',
                gap:14,
                cursor:'pointer',
                color:'rgba(226,236,242,.45)',
                whiteSpace:'nowrap',
                opacity:0,
                pointerEvents:'none',
              }}
            >
              <div style={{position:'relative',width:16,height:16,borderRadius:'50%',border:'1.5px solid currentColor',background:'transparent',boxSizing:'border-box',flexShrink:0,transition:'transform .35s ease, box-shadow .35s ease'}}>
                <div style={{position:'absolute',left:'50%',top:'50%',width:8,height:8,marginTop:-4,marginLeft:-4,borderRadius:'50%',background:'currentColor',transform:'scale(0)',transition:'transform .4s cubic-bezier(.2,.9,.2,1)'}}/>
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:11,fontFamily:golosFont,fontWeight:500}}>
                <span style={{fontFamily:monoFont,fontSize:10,letterSpacing:'.1em',opacity:.65}}>{String(i+1).padStart(2,'0')}</span>
                <span style={{fontSize:15,letterSpacing:'-.005em'}}>{s[0]}</span>
              </div>
            </div>
          ))}

          {/* Pulsing dot */}
          <div ref={dotRef} style={{position:'absolute',left:'50%',top:'7%',width:16,height:16,marginTop:-8,marginLeft:-8,pointerEvents:'none',opacity:0}}>
            <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:12,height:12,borderRadius:'50%',background:ACCENT,boxShadow:`0 0 26px 7px ${ACCENT}72`}}/>
            <div style={{position:'absolute',left:'50%',top:'50%',width:34,height:34,borderRadius:'50%',border:`1px solid ${ACCENT}8c`,animation:'pulseRing 2.4s ease-out infinite'}}/>
            <div style={{position:'absolute',left:'50%',top:'50%',width:34,height:34,borderRadius:'50%',border:`1px solid ${ACCENT}59`,animation:'pulseRing 2.4s ease-out infinite 1.2s'}}/>
          </div>

          {/* Caption panel */}
          <div ref={capRef} style={{position:'absolute',left:'clamp(20px,4vw,64px)',bottom:'clamp(24px,6vh,72px)',width:'min(380px,42vw)',color:'#e7eef3',opacity:0,pointerEvents:'none'}}>
            <div style={{display:'flex',gap:8,marginBottom:18}}>
              <img src={photoSrc} alt="" style={{width:'50%',height:78,objectFit:'cover',objectPosition:thumbObjPos(0),filter:'saturate(1.05)',border:'1px solid rgba(231,238,243,.14)',transition:'object-position .6s ease'}}/>
              <img src={photoSrc} alt="" style={{width:'50%',height:78,objectFit:'cover',objectPosition:thumbObjPos(1),filter:'saturate(1.05)',border:'1px solid rgba(231,238,243,.14)',transition:'object-position .6s ease'}}/>
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:12,fontFamily:monoFont,textTransform:'uppercase',letterSpacing:'.14em',fontSize:10,color:'rgba(231,238,243,.5)'}}>
              <span>Этап {num}</span><span>/ 10</span>
            </div>
            <h3 style={{fontFamily:unboundedFont,fontWeight:300,fontSize:'clamp(22px,2.4vw,34px)',lineHeight:1.06,letterSpacing:'-.04em',margin:'14px 0 0',color:'#e7eef3'}}>{STAGES[idx][0]}</h3>
            <p style={{margin:'16px 0 0',fontSize:15,lineHeight:1.7,color:'rgba(231,238,243,.72)',fontFamily:golosFont}}>{STAGES[idx][1]}</p>
          </div>

          {/* Exit button */}
          {started && (
            <div
              onClick={exitJourney}
              style={{position:'absolute',left:'50%',bottom:'clamp(18px,3vh,34px)',transform:'translateX(-50%)',display:'inline-flex',alignItems:'center',gap:12,padding:'13px 26px',border:'1px solid rgba(231,238,243,.28)',color:'rgba(231,238,243,.7)',cursor:'pointer',fontFamily:monoFont,textTransform:'uppercase',letterSpacing:'.14em',fontSize:10,transition:'color .3s ease, border-color .3s ease, background .3s ease',zIndex:10}}
              onMouseEnter={e=>{e.currentTarget.style.color='#05060a';e.currentTarget.style.background='#e7eef3';e.currentTarget.style.borderColor='#e7eef3';}}
              onMouseLeave={e=>{e.currentTarget.style.color='rgba(231,238,243,.7)';e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(231,238,243,.28)';}}
            >
              <span style={{fontSize:15,lineHeight:1}}>↑</span>
              <span>Выйти из пути</span>
            </div>
          )}

          {/* Chat overlay */}
          {chat && !started && (
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18,padding:'clamp(20px,4vh,44px) 24px',boxSizing:'border-box',background:'#f2f4f8',color:'#1a1c22',fontFamily:golosFont,zIndex:20}}>
              <div style={{width:'100%',maxWidth:470,display:'flex',flexDirection:'column',gap:12,animation:'wsFadeUp .5s ease both'}}>
                {/* Chat header */}
                <div style={{display:'flex',alignItems:'center',gap:12,padding:'0 4px 4px'}}>
                  <div style={{width:36,height:36,borderRadius:999,background:'#2563eb',color:'#ffffff',fontWeight:600,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>С</div>
                  <div style={{display:'flex',flexDirection:'column',gap:2}}>
                    <div style={{fontSize:14,fontWeight:600,color:'#1a1c22'}}>Студия</div>
                    <div style={{fontFamily:monoFont,fontSize:10,letterSpacing:'.12em',textTransform:'uppercase',color:'#2563eb'}}>в сети</div>
                  </div>
                </div>
                {/* Messages */}
                <div style={{display:'flex',flexDirection:'column',gap:9,minHeight:'min(46vh,340px)',justifyContent:'flex-end'}}>
                  {DIALOG.slice(0,shown).map((m,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:m.side==='us'?'flex-end':'flex-start'}}>
                      <div style={{
                        maxWidth:'78%',padding:'11px 15px',fontSize:15,lineHeight:1.45,
                        background:m.side==='us'?'#2563eb':'#ffffff',
                        color:m.side==='us'?'#ffffff':'#1a1c22',
                        borderRadius:m.side==='us'?'20px 20px 6px 20px':'20px 20px 20px 6px',
                        boxShadow:m.side==='us'?'none':'0 2px 8px rgba(0,0,0,0.10)',
                        animation:`${m.side==='us'?'wsInRight':'wsInLeft'} .7s cubic-bezier(.22,.68,.24,1) both`,
                      }}>{m.text}</div>
                    </div>
                  ))}
                  {typing && (
                    <div style={{display:'flex',justifyContent:typing==='us'?'flex-end':'flex-start'}}>
                      <div style={{
                        display:'flex',gap:5,alignItems:'center',padding:'13px 17px',
                        background:typing==='us'?'#2563eb':'#ffffff',
                        color:typing==='us'?'#ffffff':'#1a1c22',
                        borderRadius:20,
                        boxShadow:typing==='us'?'none':'0 2px 8px rgba(0,0,0,0.10)',
                        animation:`${typing==='us'?'wsInRight':'wsInLeft'} .3s ease both`,
                      }}>
                        {[0,1,2].map(k=>(
                          <span key={k} style={{width:7,height:7,borderRadius:999,background:'currentColor',display:'block',animation:`wsDotPulse 1.2s ease-in-out ${k*0.15}s infinite`}}/>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {chatDone && (
                <div
                  onClick={startJourney}
                  style={{display:'inline-flex',alignItems:'center',gap:16,padding:'18px 44px',background:'#2563eb',color:'#ffffff',cursor:'pointer',fontFamily:monoFont,textTransform:'uppercase',letterSpacing:'.18em',fontSize:12,animation:'wsFadeUp .5s ease both',transition:'background .3s ease'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='#1d4ed8';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#2563eb';}}
                >
                  <span>Далее</span><span style={{fontSize:15,lineHeight:1}}>↓</span>
                </div>
              )}
            </div>
          )}

          {/* Gate overlay */}
          {gate && (
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'clamp(20px,3vh,34px)',padding:24,boxSizing:'border-box',textAlign:'center',background:'radial-gradient(ellipse at 50% 50%,rgba(5,6,10,.88) 0%,rgba(5,6,10,.97) 70%)',zIndex:20}}>
              <div style={{fontFamily:monoFont,textTransform:'uppercase',letterSpacing:'.2em',fontSize:10,color:'rgba(231,238,243,.5)'}}>10 этапов производства</div>
              <h2 style={{fontFamily:unboundedFont,fontWeight:300,fontSize:'clamp(26px,4vw,56px)',lineHeight:1,letterSpacing:'-.045em',margin:0,color:'#f2f6f8'}}>Как проходит ваш заказ</h2>
              <div
                onClick={openChat}
                style={{marginTop:6,display:'inline-flex',alignItems:'center',gap:18,padding:'22px clamp(34px,5vw,64px)',border:`1px solid ${ACCENT}80`,color:ACCENT,cursor:'pointer',fontFamily:monoFont,textTransform:'uppercase',letterSpacing:'.18em',fontSize:'clamp(12px,1.1vw,14px)',transition:'background .35s ease, color .35s ease, border-color .35s ease'}}
                onMouseEnter={e=>{e.currentTarget.style.background=ACCENT;e.currentTarget.style.color='#05060a';e.currentTarget.style.borderColor=ACCENT;}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=ACCENT;e.currentTarget.style.borderColor=`${ACCENT}80`;}}
              >
                <span>Узнать</span>
                <span style={{fontSize:19,lineHeight:1}}>↓</span>
              </div>
              <div style={{fontFamily:monoFont,fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(231,238,243,.35)'}}>Или просто пролистайте дальше</div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
