import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

const TREE = {
  start: { q: 'Что сейчас важнее', a: [
    { t: 'Зеркала',      to: 'mirror' },
    { t: 'Перегородки',  to: 'part'   },
    { t: 'Лестницы',     to: 'stairs' },
    { t: 'Мебель',       to: 'furn'   },
  ]},
  mirror: { q: 'Куда зеркало', a: [
    { t: 'В прихожую', to: 'size' },
    { t: 'В ванную',   to: 'size' },
    { t: 'В гостиную', to: 'size' },
  ]},
  part: { q: 'Что разделить', a: [
    { t: 'Кухню и зал',    to: 'mat' },
    { t: 'Рабочее место',  to: 'mat' },
    { t: 'Спальню',        to: 'mat' },
  ]},
  stairs: { q: 'Тип лестницы', a: [
    { t: 'Винтовая',  to: 'mat' },
    { t: 'Маршевая',  to: 'mat' },
    { t: 'Модульная', to: 'mat' },
  ]},
  furn: { q: 'Что ищете', a: [
    { t: 'Стеллаж', to: 'mat' },
    { t: 'Стол',    to: 'mat' },
    { t: 'Кровать', to: 'mat' },
  ]},
  size: { q: 'Какой формат', a: [
    { t: 'Во весь рост', to: 'finish' },
    { t: 'Компактное',   to: 'finish' },
  ]},
  mat: { q: 'Материал', a: [
    { t: 'Металл и стекло', to: 'finish' },
    { t: 'Металл и дерево', to: 'finish' },
  ]},
  finish: { q: 'Финиш', a: [
    { t: 'Чёрный матовый',  to: 'end' },
    { t: 'Латунь',          to: 'end' },
    { t: 'Натуральный дуб', to: 'end' },
  ]},
  end: { q: 'Подборка готова', a: [] },
};
const DEPTH = 4;

const ENTRY = { mirror: 'mirrors', part: 'partitions', stairs: 'stairs', furn: 'catalog' };

function half(text, per, pad) { return (text.length * per + pad) / 2; }

const CARD = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // вверх, вправо, вниз, влево
const angDiff = (a, b) => {
  const d = Math.abs(((a - b) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
  return Math.min(d, Math.PI * 2 - d);
};

function buildLevels(chain, h, w) {
  const gap = Math.max(140, Math.min(230, h / 2 - 120, w / 2 - 220));
  const levels = [];
  let x = 0, y = 0, dir = 0, key = 'start';

  for (let i = 0; i <= chain.length; i++) {
    const node = TREE[key] || TREE.end;
    const lvl = { key, node, x, y, i, answers: [] };
    const k = node.a.length;
    if (k) {
      const qHalf = half(node.q, 10.2, 70);
      const halves = node.a.map(a => half(a.t, 9.6, 58));
      const clear = Math.max(70, gap * 0.5);

      let cardAngles;
      if (i === 0) {
        cardAngles = CARD.slice(0, k);
      } else {
        const fc = CARD.reduce((b, c) => angDiff(dir, c) < angDiff(dir, b) ? c : b);
        const avail = CARD.filter(c => angDiff(c, fc) > 0.1);
        avail.sort((a, b) => angDiff(a, fc + Math.PI) - angDiff(b, fc + Math.PI));
        cardAngles = avail.slice(0, k);
      }

      for (let j = 0; j < k; j++) {
        const ang = cardAngles[j];
        const c = Math.abs(Math.cos(ang)), s = Math.abs(Math.sin(ang));
        const r = (qHalf + halves[j]) * c + 50 * s + clear;
        const dx = Math.cos(ang) * r, dy = Math.sin(ang) * r * 0.78;
        lvl.answers.push({
          ...node.a[j], j, ang,
          half: halves[j],
          lineAng: Math.atan2(dy, dx),
          dist: Math.hypot(dx, dy),
          x: x + dx, y: y + dy,
        });
      }
    }
    levels.push(lvl);
    if (i < chain.length) {
      const ch = lvl.answers[chain[i]];
      if (!ch) break;
      x = ch.x; y = ch.y; dir = ch.ang; key = ch.to;
    }
  }
  return levels;
}

const HeroTree = forwardRef(function HeroTree({ onNavigateToCatalog, onActiveChange, onChoiceMade }, ref) {
  const [chain, setChain] = useState([]);
  const [open, setOpen] = useState(false);
  const [stageH, setStageH] = useState(700);
  const [stageW, setStageW] = useState(1400);
  const [hovered, setHovered] = useState(null);
  const [originX, setOriginX] = useState(null);
  const [originY, setOriginY] = useState(null);
  const roRef = useRef(null);

  const active = chain.length > 0 || open;

  useEffect(() => { onActiveChange?.(active); }, [active, onActiveChange]);
  useEffect(() => { onChoiceMade?.(chain.length > 0); }, [chain.length]); // eslint-disable-line

  useImperativeHandle(ref, () => ({
    reset: () => { setChain([]); setOpen(false); setOriginX(null); setOriginY(null); },
    openTree: (ox, oy) => {
      if (ox != null) setOriginX(ox);
      if (oy != null) setOriginY(oy);
      setOpen(true);
    },
  }));

  const stageRefCb = useCallback((el) => {
    if (roRef.current) roRef.current.disconnect();
    if (!el || typeof ResizeObserver === 'undefined') return;
    roRef.current = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setStageH(h => Math.abs(r.height - h) > 2 ? r.height : h);
      setStageW(w => Math.abs(r.width - w) > 2 ? r.width : w);
    });
    roRef.current.observe(el);
  }, []);

  useEffect(() => () => { if (roRef.current) roRef.current.disconnect(); }, []);

  const levels = buildLevels(chain, stageH, stageW);
  const last = levels[levels.length - 1];
  const lastIdx = levels.length - 1;
  const done = last.key === 'end';
  const p = done ? 1 : Math.min(chain.length / DEPTH, 0.94);
  const trail = chain.map((idx, i) => ({
    label: levels[i]?.answers[idx]?.t || '—',
    last: i === chain.length - 1,
  }));

  const ctaEntry = chain.length > 0 ? (ENTRY[levels[0]?.answers[chain[0]]?.to] || 'catalog') : 'catalog';

  const nodes = [];
  const edges = [];

  levels.forEach((lvl, i) => {
    const isActive = i === lastIdx;
    const back = lastIdx - i;
    const fade = isActive ? 1 : Math.max(0.3, 0.62 - (back - 1) * 0.14);
    const qHalf = half(lvl.node.q, 10.2, 70);
    const offX = Math.abs(lvl.x - last.x) > stageW / 2 - 40;
    const offY = Math.abs(lvl.y - last.y) > stageH / 2 - 120;
    const visible = isActive || (!offX && !offY);

    // never show start question pill — trigger button in copy serves as entry point
    if (isActive && i > 0) {
      const id = `q-${i}`;
      nodes.push({
        id, label: lvl.node.q,
        hint: isActive && !open && lvl.node.a.length > 0,
        x: lvl.x, y: lvl.y,
        isActive, back, fade, isAnswer: false, isCta: false,
        onEnter: () => {
          if (isActive) setOpen(true);
          else { setChain(c => c.slice(0, i)); setOpen(true); }
        },
        onClick: undefined,
      });
    }

    const showFan = isActive && open;
    lvl.answers.forEach(a => {
      const chosen = i < chain.length && chain[i] === a.j;
      if (chosen) return;
      if (!showFan) return;
      if (!visible) return;

      const c = Math.abs(Math.cos(a.lineAng)), s = Math.abs(Math.sin(a.lineAng));
      const pHalf = isActive ? qHalf : half(lvl.node.q, 6.2, 42);
      const inA = pHalf * c + (isActive ? 31 : 19) * s + 12;
      const inB = a.half * c + 22 * s + 12;
      edges.push({
        id: `e-${i}-${a.j}`,
        x: lvl.x, y: lvl.y,
        len: Math.max(a.dist - inA - inB, 14),
        ang: a.lineAng, inA, chosen: false,
        opacity: 0.9,
        bg: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.5))',
      });
      const id = `a-${i}-${a.j}`;
      nodes.push({
        id, label: a.t, hint: true,
        x: a.x, y: a.y,
        isActive: false, isAnswer: true, isCta: false,
        back: 0, fade: 1,
        onEnter: () => {
          setChain(c => c.slice(0, i).concat(a.j));
          setOpen(true);
        },
        onClick: undefined,
      });
    });
  });

  if (done) {
    nodes.push({
      id: 'cta', label: 'Перейти в каталог', hint: false,
      x: last.x, y: last.y - 116,
      isActive: false, isAnswer: false, isCta: true,
      back: 0, fade: 1,
      onEnter: undefined,
      onClick: () => onNavigateToCatalog(ctaEntry),
    });
  }

  const pivotX = originX ?? stageW / 2;
  const pivotY = originY ?? stageH / 2;

  return (
    <>
      {/* Tree stage — pointerEvents off when inactive so hero arrows remain clickable */}
      <div ref={stageRefCb} style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 5, pointerEvents: active ? 'auto' : 'none' }}>
        <div style={{ position: 'absolute', left: pivotX + 'px', top: pivotY + 'px', width: 0, height: 0 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, width: 0, height: 0,
            transform: `translate(${-last.x}px,${-last.y}px)`,
            transition: 'transform 900ms cubic-bezier(0.22,0.9,0.16,1)',
          }}>
            {edges.map(e => (
              <div key={e.id} style={{
                position: 'absolute', left: e.x + 'px', top: e.y + 'px',
                width: e.len + 'px', height: '1px',
                transformOrigin: '0 50%',
                transform: `rotate(${e.ang}rad) translateX(${e.inA}px)`,
                background: e.bg, opacity: e.opacity, zIndex: 5,
                animation: 'htLineIn 600ms ease both',
                transition: 'opacity 400ms ease',
              }} />
            ))}
            {nodes.map(n => {
              const hov = hovered === n.id;
              let pad, bg, border, color, fs, fw, ls, shadow, transform;

              if (n.isCta) {
                pad = '20px 40px'; bg = hov ? '#333' : '#1a1a18';
                border = '1px solid #1a1a18'; color = '#fff';
                fs = '13px'; fw = 700; ls = '0.16em';
                shadow = undefined;
                transform = hov ? 'translateY(-2px)' : 'none';
              } else if (n.isActive) {
                pad = '21px 42px'; bg = '#fff'; border = '1px solid #fff'; color = '#16150f';
                fs = '13.5px'; fw = 600; ls = '0.16em';
                shadow = '0 26px 70px -28px rgba(0,0,0,0.9)'; transform = 'none';
              } else if (n.isAnswer) {
                pad = '17px 30px';
                bg = hov ? '#fff' : 'rgba(22,21,15,0.34)';
                border = hov ? '1px solid #fff' : '1px solid rgba(255,255,255,0.62)';
                color = hov ? '#16150f' : '#fff';
                fs = '12.5px'; fw = 600; ls = '0.14em';
                shadow = 'none';
                transform = hov ? 'translateY(-2px)' : 'none';
              } else {
                pad = '11px 20px';
                bg = hov ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)';
                border = hov ? '1px solid #fff' : '1px solid rgba(255,255,255,0.34)';
                color = 'rgba(255,255,255,0.88)';
                fs = '10.5px'; fw = 600; ls = '0.14em';
                shadow = 'none'; transform = 'none';
              }

              return (
                <div
                  key={n.id}
                  style={{
                    position: 'absolute', left: n.x + 'px', top: n.y + 'px',
                    transform: 'translate(-50%,-50%)',
                    zIndex: n.isCta ? 40 : (n.isActive ? 30 : 12),
                    animation: `htPopIn 420ms cubic-bezier(0.22,0.9,0.16,1) ${n.isCta ? '220ms' : '0ms'} both`,
                  }}
                  onMouseEnter={() => { setHovered(n.id); if (n.onEnter) n.onEnter(); }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    onClick={n.onClick}
                    className={n.isCta ? 'ht-cta-pulse' : undefined}
                    style={{
                      padding: pad, borderRadius: 999,
                      background: bg, border, color,
                      fontSize: fs, fontWeight: fw, letterSpacing: ls,
                      textTransform: 'uppercase', whiteSpace: 'nowrap',
                      cursor: (n.isActive && !n.isCta) ? 'default' : 'pointer',
                      opacity: n.fade, backdropFilter: 'blur(4px)',
                      boxShadow: n.isCta ? undefined : shadow,
                      transform,
                      transition: 'background 260ms cubic-bezier(0.22,0.9,0.16,1), color 260ms cubic-bezier(0.22,0.9,0.16,1), transform 260ms cubic-bezier(0.22,0.9,0.16,1)',
                      fontFamily: 'inherit', outline: 'none',
                    }}
                  >
                    {n.label}
                  </button>
                  {n.hint && (
                    <div style={{
                      position: 'absolute', left: '50%', top: 'calc(100% + 18px)',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap', pointerEvents: 'none',
                      fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.22em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
                      animation: 'htBlink 1.9s ease-in-out infinite',
                    }}>наведись</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 9,
        padding: '20px 96px 24px',
        background: 'linear-gradient(rgba(14,13,11,0),rgba(14,13,11,0.75))',
        opacity: active ? 1 : 0,
        transform: `translateY(${active ? '0' : '16px'})`,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 500ms ease, transform 600ms cubic-bezier(0.22,0.9,0.16,1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', gap: 16,
          fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
        }}>
          <span>Подбор решения</span>
          <span style={{ color: '#fff' }}>{done ? 'Готово' : Math.round(p * 100) + '%'}</span>
        </div>
        <div style={{ position: 'relative', height: 2, marginTop: 14, background: 'rgba(255,255,255,0.22)' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '2px',
            width: p * 100 + '%', background: '#fff',
            transition: 'width 700ms cubic-bezier(0.22,0.9,0.16,1)',
          }} />
        </div>
        {trail.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, minHeight: 26 }}>
            {trail.map((t, i) => (
              <span key={i} style={{
                fontSize: '10.5px', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '6px 12px',
                border: `1px solid rgba(255,255,255,${t.last ? '0.8' : '0.3'})`,
                color: t.last ? '#fff' : 'rgba(255,255,255,0.65)',
              }}>{t.label}</span>
            ))}
          </div>
        )}
      </div>
    </>
  );
});

export default HeroTree;
