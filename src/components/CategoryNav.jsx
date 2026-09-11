import { useState, useRef, useCallback } from 'react';
import catNobg1 from '../../assets/categories-nobg/1.png';

const SECTIONS = [
  { name: 'Зеркала' },
  { name: 'Лестницы' },
  { name: 'Перегородки' },
  { name: 'Ширмы' },
  { name: 'Стеклянные доски' },
  { name: 'Комплектующие' },
];

export const SUBCATS = {
  'Зеркала':           ['Круглые', 'Овальные', 'Арочные', 'Во весь рост', 'С подсветкой', 'Нестандартные'],
  'Перегородки':       ['Лофт', 'Реечные', 'Раздвижные', 'Распашные', 'Стеклянные', 'Декоративные'],
  'Лестницы':          ['Винтовые', 'Маршевые', 'Модульные', 'Из дуба', 'На металлокаркасе', 'Для мансарды'],
  'Ширмы':             ['Реечные', 'Гармошка', 'Ротанг', 'Тканевые'],
  'Стеклянные доски':  ['Магнитные', 'Для кабинета', 'Для кухни', 'С печатью'],
  'Комплектующие':     ['Профили', 'Направляющие', 'Доводчики', 'Ручки', 'Крепёж'],
};

const TREE = {
  'Зеркала': {
    'Круглые':       ['Без рамы', 'В латунной раме', 'С подсветкой'],
    'Овальные':      ['Классические', 'Вытянутые', 'С фацетом'],
    'Арочные':       ['Одинарные', 'Парные', 'С полкой'],
    'Во весь рост':  ['Напольные', 'Навесные', 'На опоре'],
    'С подсветкой':  ['Контурная', 'Фронтальная', 'С сенсором'],
    'Нестандартные': ['Гнутое стекло', 'По эскизу', 'Составные'],
  },
  'Лестницы': {
    'Винтовые':          ['С центральной стойкой', 'Со стеклом', 'Открытые'],
    'Маршевые':          ['Прямые', 'С площадкой', 'С поворотом'],
    'Модульные':         ['На тетиве', 'На косоуре', 'Консольные'],
    'Из дуба':           ['Массив', 'Шпон', 'Комбинированные'],
    'На металлокаркасе': ['Открытый каркас', 'Закрытый каркас'],
    'Для мансарды':      ['Компактные', 'Складные'],
  },
  'Перегородки': {
    'Лофт':        ['Одинарные', 'Двойные', 'В пол стены'],
    'Реечные':     ['Дубовые', 'Крашеные', 'С подсветкой'],
    'Раздвижные':  ['Одностворчатые', 'Двустворчатые', 'Каскадные'],
    'Распашные':   ['Одностворчатые', 'Двустворчатые', 'С фрамугой', 'Маятниковые'],
    'Стеклянные':  ['Рифлёное стекло', 'Матовое стекло', 'Тонированное стекло'],
    'Декоративные':['С плёнкой', 'С витражом', 'Ажурные'],
  },
  'Ширмы': {
    'Реечные':  ['Дуб', 'Орех', 'Крашеные'],
    'Гармошка': ['3 створки', '4 створки', '5 створок'],
    'Ротанг':   ['Натуральный', 'Тонированный'],
    'Тканевые': ['Однотонные', 'С рисунком'],
  },
  'Стеклянные доски': {
    'Магнитные':     ['Белые', 'Цветные', 'С печатью'],
    'Для кабинета':  ['Настенные', 'На опоре'],
    'Для кухни':     ['Скинали', 'С разметкой'],
    'С печатью':     ['Логотип', 'Календарь', 'По эскизу'],
  },
  'Комплектующие': {
    'Профили':       ['Алюминиевые', 'Стальные', 'Латунные'],
    'Направляющие':  ['Верхние', 'Нижние', 'Скрытые'],
    'Доводчики':     ['Напольные', 'Верхние'],
    'Ручки':         ['Скобы', 'Врезные', 'Латунные'],
    'Крепёж':        ['Зажимы', 'Уголки', 'Опоры'],
  },
};

function subCount(name) { return 6 + (name.length * 7) % 34; }

export default function CategoryNav({ section, subsection, onPickSection, onPickSubsection }) {
  const [openSection, setOpenSection] = useState(null);
  const [openSub, setOpenSub] = useState(null);
  const secTimer = useRef(null);
  const subTimer = useRef(null);

  const enterSection = useCallback((name) => {
    clearTimeout(secTimer.current);
    setOpenSection(name);
    setOpenSub(null);
  }, []);

  const leaveSection = useCallback(() => {
    clearTimeout(secTimer.current);
    secTimer.current = setTimeout(() => {
      setOpenSection(null);
      setOpenSub(null);
    }, 130);
  }, []);

  const keepSection = useCallback(() => {
    clearTimeout(secTimer.current);
  }, []);

  const enterSub = useCallback((name) => {
    clearTimeout(subTimer.current);
    setOpenSub(name);
  }, []);

  const leaveSub = useCallback(() => {
    clearTimeout(subTimer.current);
    subTimer.current = setTimeout(() => setOpenSub(null), 100);
  }, []);

  const keepSub = useCallback(() => {
    clearTimeout(subTimer.current);
  }, []);

  const close = () => {
    clearTimeout(secTimer.current);
    clearTimeout(subTimer.current);
    setOpenSection(null);
    setOpenSub(null);
  };

  if (!section) {
    return (
      <>
        <style>{`
          @keyframes catDropFade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
          @keyframes catFlyFade  { from { opacity: 0; transform: translateX(6px) } to { opacity: 1; transform: translateX(0) } }
          .cat-sec-btn:hover { background: #f4f2ee !important; border-color: #d6d0c9 !important; }
          .cat-sec-btn.open   { background: #f4f2ee !important; border-color: #d6d0c9 !important; }
          .cat-see-all:hover  { background: #33322e !important; }
          .cat-sub-row:hover  { background: #f7f5f1 !important; }
          .cat-sub-row.open   { background: #f7f5f1 !important; }
          .cat-leaf-row:hover { background: #f7f5f1 !important; }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '22px 40px 0', flexWrap: 'wrap', position: 'relative', zIndex: 25 }}>
          {SECTIONS.map(s => {
            const isOpen = openSection === s.name;
            const subs = TREE[s.name] || {};
            const subNames = Object.keys(subs);

            return (
              <div
                key={s.name}
                onMouseEnter={() => enterSection(s.name)}
                onMouseLeave={leaveSection}
                style={{ position: 'relative', flexShrink: 0 }}
              >
                {/* ─── Section card ─── */}
                <button
                  className={`cat-sec-btn${isOpen ? ' open' : ''}`}
                  onClick={() => { onPickSection(s.name); close(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px 10px 10px', borderRadius: 12,
                    background: '#fff', border: '1px solid #ece9e4',
                    boxShadow: '0 1px 2px rgba(26,26,24,.04)',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    fontSize: 14, color: '#33322e', fontFamily: 'inherit',
                    transition: 'background .15s, border-color .15s',
                  }}
                >
                  <img src={catNobg1} alt="" style={{ width: 34, height: 44, flexShrink: 0, objectFit: 'contain' }} />
                  {s.name}
                  <span style={{
                    fontSize: 14, color: '#a8a39a', lineHeight: 1,
                    display: 'inline-block',
                    transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)',
                    transition: 'transform .18s',
                  }}>⌄</span>
                </button>

                {/* ─── Level-2 dropdown ─── */}
                {isOpen && (
                  <div
                    onMouseEnter={keepSection}
                    onMouseLeave={leaveSection}
                    style={{
                      position: 'absolute', zIndex: 30, left: 0, top: '100%',
                      paddingTop: 8, minWidth: 260,
                      animation: 'catDropFade .16s ease',
                    }}
                  >
                    <div style={{
                      padding: 8, borderRadius: 16,
                      background: '#fff', border: '1px solid #ece9e4',
                      boxShadow: '0 20px 46px rgba(26,26,24,.16)',
                    }}>
                      {/* See all */}
                      <button
                        className="cat-see-all"
                        onClick={() => { onPickSection(s.name); close(); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '15px 12px', borderRadius: 11,
                          background: '#1a1a18', color: '#fff',
                          border: 'none', cursor: 'pointer', width: '100%',
                          fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                          transition: 'background .15s',
                        }}
                      >
                        <span style={{ flex: 1, textAlign: 'left' }}>Смотреть все {s.name}</span>
                        <span style={{ color: 'rgba(255,255,255,.7)' }}>→</span>
                      </button>
                      <div style={{ height: 1, background: '#f1eee9', margin: '6px 4px' }} />

                      {/* Subcategory rows */}
                      {subNames.map(subName => {
                        const isSubOpen = openSub === subName;
                        const leaves = subs[subName] || [];

                        return (
                          <div
                            key={subName}
                            onMouseEnter={() => enterSub(subName)}
                            onMouseLeave={leaveSub}
                            style={{ position: 'relative' }}
                          >
                            <button
                              className={`cat-sub-row${isSubOpen ? ' open' : ''}`}
                              onClick={() => { onPickSection(s.name); onPickSubsection(subName); close(); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 12px', borderRadius: 11,
                                background: 'transparent', border: 'none',
                                cursor: 'pointer', width: '100%',
                                fontFamily: 'inherit',
                                transition: 'background .12s',
                              }}
                            >
                              <span style={{
                                width: 30, height: 38, flexShrink: 0, borderRadius: 5, display: 'inline-block',
                                backgroundImage: 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 5px, #e9e5de 5px, #e9e5de 10px)',
                              }} />
                              <span style={{ fontSize: 14, color: '#33322e', flex: 1, textAlign: 'left' }}>{subName}</span>
                              <span style={{ fontSize: 12, color: '#c2bdb5' }}>{subCount(subName)}</span>
                              {leaves.length > 0 && (
                                <span style={{ fontSize: 13, color: '#c2bdb5', marginLeft: 2 }}>›</span>
                              )}
                            </button>

                            {/* ─── Level-3 flyout ─── */}
                            {isSubOpen && leaves.length > 0 && (
                              <div
                                onMouseEnter={keepSub}
                                onMouseLeave={leaveSub}
                                style={{
                                  position: 'absolute', zIndex: 31,
                                  left: '100%', top: -8, paddingLeft: 8,
                                  minWidth: 250,
                                  animation: 'catFlyFade .16s ease',
                                }}
                              >
                                <div style={{
                                  padding: 8, borderRadius: 16,
                                  background: '#fff', border: '1px solid #ece9e4',
                                  boxShadow: '0 20px 46px rgba(26,26,24,.16)',
                                }}>
                                  <button
                                    className="cat-see-all"
                                    onClick={() => { onPickSection(s.name); onPickSubsection(subName); close(); }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 12,
                                      padding: '15px 12px', borderRadius: 11,
                                      background: '#1a1a18', color: '#fff',
                                      border: 'none', cursor: 'pointer', width: '100%',
                                      fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                                      transition: 'background .15s',
                                    }}
                                  >
                                    <span style={{ flex: 1, textAlign: 'left' }}>Смотреть все {subName}</span>
                                    <span style={{ color: 'rgba(255,255,255,.7)' }}>→</span>
                                  </button>
                                  <div style={{ height: 1, background: '#f1eee9', margin: '6px 4px' }} />
                                  {leaves.map(leaf => (
                                    <button
                                      key={leaf}
                                      className="cat-leaf-row"
                                      onClick={() => { onPickSection(s.name); onPickSubsection(subName); close(); }}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '9px 12px', borderRadius: 11,
                                        background: 'transparent', border: 'none',
                                        cursor: 'pointer', width: '100%',
                                        fontFamily: 'inherit',
                                        transition: 'background .12s',
                                      }}
                                    >
                                      <span style={{
                                        width: 30, height: 38, flexShrink: 0, borderRadius: 5, display: 'inline-block',
                                        backgroundImage: 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 5px, #e9e5de 5px, #e9e5de 10px)',
                                      }} />
                                      <span style={{ fontSize: 14, color: '#33322e', flex: 1, textAlign: 'left' }}>{leaf}</span>
                                      <span style={{ fontSize: 12, color: '#c2bdb5' }}>{subCount(leaf)}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ─── Subcategory chips view (when a section is already selected) ───
  const subcats = SUBCATS[section] || [];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 40px 0', overflowX: 'auto' }}>
      {subcats.map(name => {
        const on = subsection === name;
        return (
          <button
            key={name}
            onClick={() => onPickSubsection(on ? null : name)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 22px 10px 12px', borderRadius: 12,
              background: on ? '#1a1a18' : '#fff',
              border: `1px solid ${on ? '#1a1a18' : '#ece9e4'}`,
              boxShadow: '0 1px 2px rgba(26,26,24,.04)',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              fontSize: 14, color: on ? '#fff' : '#33322e', fontFamily: 'inherit',
              transition: 'border-color .15s, background .15s, color .15s',
            }}
          >
            <img src={catNobg1} alt="" style={{ width: 48, height: 56, flexShrink: 0, objectFit: 'contain' }} />
            {name}
          </button>
        );
      })}
    </div>
  );
}
