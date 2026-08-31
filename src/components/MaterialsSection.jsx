import { useState } from 'react';

const RAW = [
  { s: 'Стекло', g: 'Прозрачное безопасное стекло', tone: 'Светлый', items: [
    ['GT05', 'Соле', 'linear-gradient(135deg,#f2f2f0,#dcdcd8 60%,#c9c9c4)'],
    ['GT01', 'Прозрачное', 'linear-gradient(135deg,#f7f8f8,#e7eae9 60%,#dfe3e2)'],
    ['GT11', 'Рифлёное', 'repeating-linear-gradient(90deg,#eef0ee 0 4px,#dadedb 4px 8px)'],
  ]},
  { s: 'Стекло', g: 'Прозрачное безопасное стекло', tone: 'Тёмный', items: [
    ['GT15', 'Соле Серое', 'linear-gradient(135deg,#8c9aa6,#5d6b78 70%,#46525d)'],
    ['GT14', 'Сетка Чёрная', 'repeating-linear-gradient(45deg,#4a4a4a 0 3px,#2e2e2e 3px 6px),#3a3a3a'],
  ]},
  { s: 'Стекло', g: 'Прозрачное безопасное стекло', tone: 'Бронза', items: [
    ['GT16', 'Соле Коричневое', 'linear-gradient(135deg,#c9a978,#a3814e 70%,#7d6035)'],
    ['GT13', 'Сетка Золотая', 'repeating-linear-gradient(45deg,#cbb489 0 3px,#b39c6f 3px 6px),#c2ab80'],
  ]},
  { s: 'Стекло', g: 'Матовое безопасное стекло', tone: 'Светлый', items: [
    ['GS14', 'Сатинато Соле', 'repeating-linear-gradient(90deg,#eceeec 0 5px,#dfe2df 5px 10px)'],
    ['GS04', 'Сатинато Белое', 'linear-gradient(160deg,#f6f6f4,#e6e6e2)'],
  ]},
  { s: 'Стекло', g: 'Матовое безопасное стекло', tone: 'Тёмный', items: [
    ['GS08', 'Сатинато Серое', 'linear-gradient(160deg,#c6c8c8,#9ea1a1)'],
  ]},
  { s: 'Стекло', g: 'Матовое безопасное стекло', tone: 'Бронза', items: [
    ['GS09', 'Сатинато Бронзовое', 'linear-gradient(160deg,#cbbda6,#a6957c)'],
  ]},
  { s: 'Стекло', g: 'Зеркало', tone: 'Светлый', items: [
    ['M01', 'Зеркало', 'linear-gradient(120deg,#f0f2f3,#cfd6d9 45%,#eef1f2 60%,#c6ced2)'],
  ]},
  { s: 'Отделки профилей', g: 'Алюминиевые поверхности', tone: 'Светлый', items: [
    ['AL09', 'Хром Матовый', 'linear-gradient(130deg,#e8e8e6,#bdbdb8 55%,#d8d8d4)'],
  ]},
  { s: 'Отделки профилей', g: 'Алюминиевые поверхности', tone: 'Тёмный', items: [
    ['AL06', 'Свинцовый', 'linear-gradient(130deg,#585a58,#3e403e)'],
    ['AL08', 'Чёрный', 'linear-gradient(130deg,#242424,#131313)'],
    ['AL07', 'Тёмно-коричневый', 'linear-gradient(130deg,#2a2018,#170f09)'],
  ]},
  { s: 'Отделки профилей', g: 'Алюминиевые поверхности', tone: 'Бронза', items: [
    ['AL05', 'Бронза', 'linear-gradient(130deg,#4a4327,#332e18)'],
    ['AL02', 'Шампань', 'linear-gradient(130deg,#6b6440,#514c2c)'],
    ['AL04', 'Нежная Бронза', 'linear-gradient(130deg,#6f6a3d,#565229)'],
  ]},
  { s: 'Отделки профилей', g: 'Отделки МДФ', tone: 'Светлый', items: [
    ['MD01', 'Белый матовый', 'linear-gradient(130deg,#f4f4f2,#e2e2de)'],
    ['MD03', 'Дуб натуральный', 'repeating-linear-gradient(100deg,#c7a473 0 6px,#bb9765 6px 12px)'],
  ]},
  { s: 'Отделки профилей', g: 'Отделки МДФ', tone: 'Тёмный', items: [
    ['MD02', 'Графит', 'linear-gradient(130deg,#4b4d4f,#333537)'],
    ['MD05', 'Венге', 'repeating-linear-gradient(100deg,#3a2b22 0 6px,#2d211a 6px 12px)'],
  ]},
  { s: 'Отделки профилей', g: 'Отделки МДФ', tone: 'Бронза', items: [
    ['MD04', 'Орех', 'repeating-linear-gradient(100deg,#7c5636 0 6px,#6c4a2e 6px 12px)'],
  ]},
];

const FLAT = [];
RAW.forEach(g => g.items.forEach(it => FLAT.push({
  code: it[0], name: it[1], css: it[2], group: g.g, section: g.s, tone: g.tone,
})));

const FILTERS = [
  { key: 'section', label: 'Категория', options: ['Все категории', 'Стекло', 'Отделки профилей'] },
  { key: 'group',   label: 'Тип',       options: ['Любой тип', 'Прозрачное безопасное стекло', 'Матовое безопасное стекло', 'Зеркало', 'Алюминиевые поверхности', 'Отделки МДФ'] },
  { key: 'tone',    label: 'Тон',       options: ['Любой тон', 'Светлый', 'Тёмный', 'Бронза'] },
];

const PER_PAGE = 10;

function pad(n) { return String(n).padStart(2, '0'); }

export default function MaterialsSection() {
  const [filterIdx, setFilterIdx] = useState({ section: 0, group: 0, tone: 0 });
  const [openMenu, setOpenMenu] = useState(null);
  const [limit, setLimit] = useState(PER_PAGE);
  const [selectedCode, setSelectedCode] = useState(FLAT[0].code);

  const matches = FLAT.filter(f =>
    (filterIdx.section === 0 || f.section === FILTERS[0].options[filterIdx.section]) &&
    (filterIdx.group   === 0 || f.group   === FILTERS[1].options[filterIdx.group]) &&
    (filterIdx.tone    === 0 || f.tone    === FILTERS[2].options[filterIdx.tone])
  );

  const cur = FLAT.find(f => f.code === selectedCode) || FLAT[0];
  const curPos = matches.findIndex(f => f.code === cur.code);
  const pageItems = matches.slice(0, limit);
  const hasMore = matches.length > limit;

  const step = (d) => {
    if (!matches.length) return;
    const i = ((curPos < 0 ? 0 : curPos) + d + matches.length) % matches.length;
    const next = matches[i];
    setSelectedCode(next.code);
    setLimit(l => Math.max(l, Math.ceil((i + 1) / PER_PAGE) * PER_PAGE));
  };

  const toggleMenu = (key) => setOpenMenu(o => o === key ? null : key);

  const pickFilter = (key, i) => {
    setFilterIdx(f => ({ ...f, [key]: i }));
    setOpenMenu(null);
    setLimit(PER_PAGE);
    setSelectedCode(FLAT[0].code);
  };

  const resetFilters = () => {
    setFilterIdx({ section: 0, group: 0, tone: 0 });
    setOpenMenu(null);
    setLimit(PER_PAGE);
    setSelectedCode(FLAT[0].code);
  };

  return (
    <section style={{ padding: '96px 48px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Материалы и отделки</h2>
        <div style={{ fontSize: 15, color: '#8b877f' }}>
          Стекло, зеркало и отделки профилей — {FLAT.length} позиций
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px,3vw,48px)', alignItems: 'stretch' }}>

        {/* Превью текущего материала */}
        <div style={{
          flex: '0 1 28%', minWidth: 220,
          minHeight: 'min(72vh,640px)',
          position: 'relative', display: 'flex', flexDirection: 'column',
          overflow: 'clip', borderRadius: 22,
          background: cur.css, backgroundSize: 'cover', backgroundPosition: 'center',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
          transition: 'background .25s',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,17,14,.10) 0%,rgba(20,17,14,0) 40%,rgba(20,17,14,.42) 100%)' }} />
          <div style={{ position: 'absolute', top: 24, left: 24, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
            {cur.section}
          </div>
          <div style={{ position: 'relative', marginTop: 'auto', padding: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.3px', color: '#fff' }}>{cur.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', marginTop: 4 }}>{cur.code} · {cur.group}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div onClick={() => step(-1)} style={{ fontSize: 22, color: 'rgba(255,255,255,.85)', cursor: 'pointer', userSelect: 'none', letterSpacing: -1 }}>⟵</div>
              <div style={{ fontSize: 13, fontStyle: 'italic', color: '#fff', letterSpacing: .5 }}>
                {pad(curPos < 0 ? 1 : curPos + 1)} / {pad(matches.length)}
              </div>
              <div onClick={() => step(1)} style={{ fontSize: 22, color: 'rgba(255,255,255,.85)', cursor: 'pointer', userSelect: 'none', letterSpacing: -1 }}>⟶</div>
            </div>
          </div>
        </div>

        {/* Правая колонка: фильтры + сетка */}
        <div style={{ flex: '1 1 60%', minWidth: 0 }}>

          {/* Фильтры */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 26, padding: 14, background: '#f4f3f1', borderRadius: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {FILTERS.map(f => {
              const idx = filterIdx[f.key];
              const active = idx !== 0;
              const isOpen = openMenu === f.key;
              return (
                <div key={f.key} style={{ position: 'relative' }}>
                  <div
                    onClick={() => toggleMenu(f.key)}
                    style={{
                      height: 38, padding: '0 16px', borderRadius: 19, background: '#fff',
                      display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      boxShadow: `inset 0 0 0 1px ${active ? '#241f1c' : 'rgba(0,0,0,0.10)'}`,
                      color: '#211d19',
                    }}
                  >
                    <span>{f.options[idx]}</span>
                    <span style={{ color: '#9a9084', fontSize: 11 }}>⌄</span>
                  </div>
                  {isOpen && (
                    <div style={{
                      position: 'absolute', top: 44, left: 0, minWidth: 210, background: '#fff',
                      borderRadius: 8, boxShadow: '0 12px 34px rgba(30,25,20,.16)', padding: 6, zIndex: 12,
                    }}>
                      {f.options.map((o, i) => (
                        <div
                          key={o}
                          onClick={() => pickFilter(f.key, i)}
                          style={{
                            padding: '9px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
                            color: i === idx ? '#211d19' : '#5d574f',
                            background: i === idx ? '#f1efec' : 'transparent',
                          }}
                        >{o}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div
              onClick={resetFilters}
              style={{ height: 38, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 12, color: '#8a8073', cursor: 'pointer' }}
            >Сбросить</div>
          </div>

          {/* Сетка материалов */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
            {pageItems.map(f => {
              const sel = f.code === cur.code;
              return (
                <div
                  key={f.code}
                  style={{
                    position: 'relative', background: '#fff', borderRadius: 26, overflow: 'hidden',
                    boxShadow: sel
                      ? 'inset 0 0 0 1.5px #241f1c, 0 12px 26px rgba(30,25,20,.12)'
                      : 'inset 0 0 0 1px rgba(0,0,0,.08)',
                    transition: 'box-shadow .18s',
                  }}
                >
                  <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 10px 12px' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: '50%',
                      background: f.css, backgroundSize: 'cover',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
                    }} />
                    <div style={{ fontSize: 9, letterSpacing: .8, textTransform: 'uppercase', color: '#a09689', marginTop: 14 }}>{f.section}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-.2px', marginTop: 4, textAlign: 'center', lineHeight: 1.15, color: '#211d19', minHeight: 32, display: 'flex', alignItems: 'center' }}>{f.name}</div>
                    <div style={{ fontSize: 9, color: '#8a8073', marginTop: 1, textAlign: 'center', lineHeight: 1.35, marginBottom: 10 }}>{f.group}</div>
                    <div
                      onClick={() => setSelectedCode(f.code)}
                      style={{
                        marginTop: 'auto', width: '100%', height: 30, borderRadius: 15,
                        background: sel ? '#8a6b3d' : '#241f1c', color: '#fff',
                        fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background .18s',
                      }}
                    >Посмотреть</div>
                  </div>
                </div>
              );
            })}
          </div>

          {matches.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', fontSize: 14, color: '#8a8073' }}>
              По выбранным фильтрам ничего не найдено
            </div>
          )}

          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
              <div
                style={{
                  height: 44, padding: '0 30px', borderRadius: 22, background: '#fff',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.16)', color: '#211d19',
                  fontSize: 13, display: 'flex', alignItems: 'center',
                  opacity: 0.4, cursor: 'default',
                }}
              >Смотреть больше</div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
