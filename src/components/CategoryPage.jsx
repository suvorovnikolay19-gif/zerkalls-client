import { useState, useRef, useEffect } from 'react';
import { fetchAllCategories } from '../api.js';
import { ITEMS, CAT_TREE } from '../data/catalog.js';
import catNobg1       from '../../assets/categories-nobg/1.webp';
const DEFAULT_LEAVES = ['Стандартные размеры', 'По индивидуальному проекту', 'С монтажом'];

const FAQ = [
  { q: 'Какие сроки доставки в моём городе?', a: 'По Москве и области — 2–4 дня, по России — 5–12 дней транспортной компанией. Точный срок называем при оформлении.' },
  { q: 'Можно ли сделать изделие по своим размерам?', a: 'Да, это основной формат работы: присылаете размеры проёма или фото, конструктор готовит чертёж и смету за один день.' },
  { q: 'Как вернуть или обменять товар?', a: 'Серийные позиции — 14 дней без объяснения причин. Изделия по индивидуальным размерам возврату не подлежат, кроме случаев брака.' },
  { q: 'Какие способы оплаты вы принимаете?', a: 'Карта, СБП, счёт для юрлиц и рассрочка на 6–12 месяцев без процентов.' },
  { q: 'Нужна ли сборка и сколько она стоит?', a: 'Монтаж выполняет наша бригада. Для перегородок и лестниц он включён в стоимость, для зеркал — 3 500 ₽.' },
  { q: 'Как отследить статус заказа?', a: 'После оплаты приходит ссылка на личный кабинет со статусами: производство, контроль, отгрузка, доставка.' },
  { q: 'Есть ли шоурум?', a: 'Да, в Домодедово при производстве — можно потрогать материалы и увидеть готовые изделия. Запись по телефону.' },
  { q: 'Работаете ли вы с дизайнерами?', a: 'Да, есть партнёрская программа с агентским вознаграждением и техподдержкой на всех этапах проекта.' },
  { q: 'Сколько ждать изделие по индивидуальным размерам?', a: 'Производство занимает 10–18 рабочих дней в зависимости от сложности и загрузки цеха. Срок фиксируем в договоре.' },
  { q: 'Можно ли заказать только стекло или фурнитуру?', a: 'Да, комплектующие продаём отдельно: профили, направляющие, доводчики, ручки и полотна нужного размера.' },
  { q: 'Есть ли рассрочка?', a: 'Есть рассрочка на 6 и 12 месяцев без процентов и переплаты — оформляется онлайн за пару минут.' },
  { q: 'Что с безопасностью стекла?', a: 'Используем закалённое стекло 8–10 мм или триплекс. При ударе оно не даёт травмоопасных осколков.' },
];

function subCount(name) { return 6 + (name.length * 7) % 34; }

export default function CategoryPage({ section, onPickSubsection }) {
  const [hover, setHover] = useState(null);
  const [flip, setFlip] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);
  const [pinged, setPinged] = useState(null);
  const [items, setItems] = useState(ITEMS[section] || []);
  const hoverTimer = useRef(null);
  const pingTimer = useRef(null);
  const stripRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    setItems(ITEMS[section] || []);
    fetchAllCategories({ limit: 500 })
      .then(all => {
        const parent = all.find(c => c.name === section && !c.parent);
        if (!parent) return;
        const children = all.filter(c => c.parent === parent.id);
        if (children.length === 0) return;
        const localItems = ITEMS[section] || [];
        setItems(children.map((c, i) => ({
          name: c.name,
          slug: c.slug,
          img: (localItems[i] ?? localItems[0] ?? { img: [] }).img,
        })));
      })
      .catch(() => {});
  }, [section]);

  const pingCard = (i) => {
    clearTimeout(pingTimer.current);
    setPinged(null);
    const strip = stripRef.current;
    const el = document.getElementById(`cp-card-${i}`);
    let delay = 60;
    if (strip && el) {
      const stripRect = strip.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetScroll = strip.scrollLeft + (elRect.left - stripRect.left) - (stripRect.width / 2 - elRect.width / 2);
      const dist = Math.abs(targetScroll - strip.scrollLeft);
      if (dist > 30) {
        delay = 440;
        strip.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
    pingTimer.current = setTimeout(() => {
      setPinged(i);
      pingTimer.current = setTimeout(() => setPinged(null), 1500);
    }, delay);
  };

  const tree = CAT_TREE[section] || {};

  const enter = (i) => {
    clearTimeout(hoverTimer.current);
    setHover(i);
    pingCard(i);
    const el = itemRefs.current[i];
    if (el) {
      const rect = el.getBoundingClientRect();
      setFlip(rect.right + 250 > window.innerWidth - 16);
    }
  };
  const leave = () => { hoverTimer.current = setTimeout(() => setHover(null), 120); };
  const keep  = () => clearTimeout(hoverTimer.current);

  const scrollStrip = (dir) => {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({ left: dir * stripRef.current.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '28px 40px 60px', fontFamily: "'Golos Text', Helvetica, sans-serif" }}>
      <style>{`
        @keyframes cpPreviewIn { from { opacity:0; transform:translateY(6px) scale(.93) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes cpCardPop  { 0%{transform:scale(1)} 30%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes cpCardPing { 0%{opacity:0} 10%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
        @keyframes hFade { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:none } }
        .cp-row { transition: background .13s, padding-left .14s, color .13s; text-decoration: none !important; }
        .cp-row:hover { background: oklch(0.955 0.01 255) !important; color: oklch(0.38 0.14 258) !important; padding-left: 10px !important; text-decoration: none !important; }
        .cp-leaf { border-radius: 7px; transition: background .13s, color .13s, padding-left .13s !important; }
        .cp-leaf:hover { background: #f0ede8 !important; color: #1a1a18 !important; padding-left: 10px !important; }
        .cp-see-all:hover { background: #2a2925 !important; color: #fff !important; }
        .cp-card:hover .cp-thumb { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(26,26,24,.18); }
        .cp-card:hover .cp-card-label { color: #1a1a18; }
        .cp-arr:hover { border-color: #c2bdb5 !important; }
      `}</style>

      {/* Заголовок */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-.02em', color: '#1a1a18' }}>{section}</h2>
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: '#8b877f',
        }}>
          {items.length} категорий
        </span>
      </div>

      {/* ─── Меню — стиль из паттерна ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: '0 22px',
        paddingBottom: 20,
        marginBottom: 28,
        borderBottom: '1px solid #ece9e4',
      }}>
        {items.map((item, i) => {
          const isHov = hover === i;
          const num = String(i + 1).padStart(2, '0');
          const leaves = (tree[item.name] && tree[item.name].length > 0) ? tree[item.name] : DEFAULT_LEAVES;

          return (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              style={{ position: 'relative' }}
              onMouseEnter={() => enter(i)}
              onMouseLeave={leave}
            >
              <a
                className="cp-row"
                onClick={() => onPickSubsection(item.name)}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '6px 8px 6px 6px',
                  borderBottom: '1px solid oklch(0.935 0.004 260)',
                  cursor: 'pointer', color: '#26251f',
                  transition: 'background .14s, color .14s, padding-left .14s',
                  textDecoration: 'none',
                }}
              >
                {/* Номер */}
                <div style={{
                  flexShrink: 0, width: 17, alignSelf: 'baseline', paddingTop: 1,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10, color: '#8b877f',
                }}>{num}</div>
                {/* Иконка — вертикально по центру строки */}
                <img src={catNobg1} alt="" style={{ width: 18, height: 22, flexShrink: 0, objectFit: 'contain', display: 'block' }} />
                {/* Название */}
                <div lang="ru" style={{
                  fontSize: 13, fontWeight: 600, letterSpacing: '-.012em',
                  lineHeight: 1.3, minWidth: 0, overflowWrap: 'break-word',
                  hyphens: 'auto', textWrap: 'pretty',
                }}>{item.name}</div>
              </a>

              {/* Попап: 2 картинки + подкатегории + "Смотреть все" */}
              {isHov && (
                <div
                  onMouseEnter={keep}
                  onMouseLeave={leave}
                  style={{
                    position: 'absolute', zIndex: 40,
                    ...(flip
                      ? { right: '100%', paddingRight: 8 }
                      : { left: '100%', paddingLeft: 8 }),
                    top: -28,
                    minWidth: 230,
                    animation: 'cpPreviewIn .2s cubic-bezier(.2,.9,.3,1) both',
                  }}
                >
                  <div style={{
                    borderRadius: 14, background: '#fff',
                    border: '1px solid #ece9e4',
                    boxShadow: '0 16px 42px rgba(26,26,24,.17)',
                    overflow: 'hidden',
                  }}>
                    {/* Иконка категории на всю ширину */}
                    <div style={{
                      width: '100%', padding: '16px 0 10px',
                      background: '#f4f2ee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={catNobg1} alt="" style={{ width: 140, height: 170, objectFit: 'contain' }} />
                    </div>

                    {/* Подкатегории (если есть) */}
                    {leaves.length > 0 && (
                      <div style={{ padding: '6px 10px 4px' }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, color: '#c2bdb5',
                          letterSpacing: '.07em', textTransform: 'uppercase',
                          padding: '0 2px 5px',
                        }}>Подкатегории</div>
                        {leaves.map(leaf => (
                          <button key={leaf} className="cp-leaf"
                            onClick={() => onPickSubsection(item.name)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              width: '100%', padding: '6px 8px',
                              background: 'none', border: 'none', cursor: 'pointer',
                              textAlign: 'left', fontFamily: 'inherit',
                              fontSize: 13, color: '#6b6760',
                            }}
                          >
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#d6d0c9', flexShrink: 0 }} />
                            {leaf}
                          </button>
                        ))}
                        <div style={{ height: 1, background: '#f1eee9', margin: '6px 0 2px' }} />
                      </div>
                    )}
                    <div style={{ padding: '0 10px 10px' }}>
                      <button className="cp-see-all"
                        onClick={() => onPickSubsection(item.name)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '8px 12px', borderRadius: 8,
                          border: '1px solid #ece9e4', background: '#f9f8f6',
                          cursor: 'pointer', fontFamily: 'inherit',
                          fontSize: 12.5, fontWeight: 500, color: '#33322e',
                          transition: 'background .15s, color .15s',
                        }}
                      >
                        <span>Смотреть все {item.name}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Скролл-стрип карточек ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18' }}>{section}</span>
        <span style={{ fontSize: 12, color: '#b0ab9f' }}>листайте →</span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          ref={stripRef}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc((100% - 64px) / 5)',
            gap: 16,
            overflowX: 'auto',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            padding: '28px 2px 8px',
            scrollbarWidth: 'none',
          }}
        >
          {items.map((item, i) => {
            const isPinged = pinged === i;
            return (
            <div key={i} id={`cp-card-${i}`} className="cp-card"
              onClick={() => onPickSubsection(item.name)}
              style={{
                scrollSnapAlign: 'start', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 7,
                position: 'relative',
                zIndex: isPinged ? 10 : 'auto',
                animation: isPinged ? 'cpCardPop 1.5s cubic-bezier(.22,1,.3,1)' : 'none',
              }}
            >
              <div className="cp-thumb" style={{
                position: 'relative', aspectRatio: '4/3', minHeight: 104,
                borderRadius: 13, overflow: 'hidden', border: '1px solid #ece9e4',
                background: '#f0ece5',
                transition: 'box-shadow .18s',
              }}>
                {/* <img loading="lazy"> вместо background-image: фоновые картинки
                    браузер качает все сразу, лениться умеют только настоящие <img> */}
                {item.img?.[0] && (
                  <img
                    src={item.img[0]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                {isPinged && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: 13,
                    pointerEvents: 'none',
                    animation: 'cpCardPing 1.5s cubic-bezier(.2,.7,.3,1) forwards',
                    border: '2.5px solid rgba(100,110,140,.75)',
                  }} />
                )}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  fontSize: 10.5, fontWeight: 500, letterSpacing: '.04em', color: '#fff',
                  background: 'rgba(20,19,17,.55)', padding: '3px 7px', borderRadius: 6,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div lang="ru" style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  padding: '26px 12px 10px',
                  background: 'linear-gradient(to top, rgba(20,19,17,.82), transparent)',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  letterSpacing: '-.012em', lineHeight: 1.2,
                }}>{item.name}</div>
              </div>
              <div className="cp-card-label" style={{ fontSize: 12.5, color: '#a8a39a', transition: 'color .15s', paddingLeft: 2 }}>
                {subCount(item.name)} позиций
              </div>
            </div>
            );
          })}
        </div>

        <button className="cp-arr" onClick={() => scrollStrip(-1)} style={{
          position: 'absolute', left: -15, top: '42%', transform: 'translateY(-50%)',
          width: 38, height: 38, borderRadius: '50%', border: '1px solid #e8e4de',
          background: '#fff', boxShadow: '0 5px 16px -7px rgba(26,26,24,.28)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, transition: 'border-color .14s',
        }}>
          <span style={{ width: 7, height: 7, borderLeft: '1.8px solid #555', borderBottom: '1.8px solid #555', transform: 'rotate(45deg)', marginLeft: 2 }} />
        </button>
        <button className="cp-arr" onClick={() => scrollStrip(1)} style={{
          position: 'absolute', right: -15, top: '42%', transform: 'translateY(-50%)',
          width: 38, height: 38, borderRadius: '50%', border: '1px solid #e8e4de',
          background: '#fff', boxShadow: '0 5px 16px -7px rgba(26,26,24,.28)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, transition: 'border-color .14s',
        }}>
          <span style={{ width: 7, height: 7, borderRight: '1.8px solid #555', borderTop: '1.8px solid #555', transform: 'rotate(45deg)', marginRight: 2 }} />
        </button>
      </div>

      {/* ── FAQ ── */}
      <div style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid #ece9e4' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px', maxWidth: 780, marginLeft: 'auto', marginRight: 'auto', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em', textWrap: 'pretty' }}>Частые вопросы — и наши ответы</h2>
          <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 22 }}>Не нашли нужное? Напишите — ответим в течение часа</div>
          <a href="#footer" style={{ display: 'inline-block', padding: '13px 28px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Задать вопрос</a>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'start', gap: 18, marginTop: 44, textAlign: 'left' }}>
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} onClick={() => setOpenFaq(open ? -1 : i)} style={{ padding: '20px 22px', borderRadius: 14, background: '#fff', border: '1px solid ' + (open ? '#e4e0d9' : '#ece9e4'), cursor: 'pointer', transition: 'background .15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, fontSize: 15, fontWeight: 500, textWrap: 'pretty' }}>{f.q}</div>
                    <div style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', border: '1px solid #ddd8d1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6b6862', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>+</div>
                  </div>
                  {open && <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.6, color: '#8b877f', animation: 'hFade .2s ease', textWrap: 'pretty' }}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
