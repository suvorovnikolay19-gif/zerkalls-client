import { useState } from 'react';

const FILTER_CATS = [
  { name: 'Перегородки', icon: '▥', groups: [
    { name: 'Тип конструкции', values: [['Раздвижные', 84], ['Распашные', 52], ['Стационарные', 61], ['Гармошка', 24], ['Реечные', 38]] },
    { name: 'Материал каркаса', values: [['Сталь', 96], ['Алюминий', 44], ['Дуб', 57], ['Латунь', 19]] },
    { name: 'Стекло', values: [['Рифлёное', 71], ['Матовое', 63], ['Тонированное', 34], ['Прозрачное', 48], ['Без стекла', 12]] },
    { name: 'Цвет профиля', values: [['Графит', 88], ['Чёрный матовый', 66], ['Латунь', 21], ['Белый', 33]] },
    { name: 'Помещение', values: [['Гостиная', 74], ['Спальня', 41], ['Кабинет', 29], ['Офис', 36], ['Влажная зона', 14]] },
    { name: 'Стиль', values: [['Лофт', 62], ['Минимализм', 58], ['Джапанди', 23], ['Ар-деко', 11]] }
  ] },
  { name: 'Зеркала', icon: '◯', groups: [
    { name: 'Форма', values: [['Круглое', 42], ['Овальное', 38], ['Арочное', 31], ['Прямоугольное', 55], ['Нестандартное', 17]] },
    { name: 'Рама', values: [['Латунь', 28], ['Дуб', 34], ['Сталь', 22], ['Без рамы', 46]] },
    { name: 'Размер', values: [['до 800 мм', 39], ['800–1200 мм', 47], ['1200–1800 мм', 33], ['В полный рост', 25]] },
    { name: 'Опции', values: [['С подсветкой', 36], ['Сенсор', 18], ['Антизапотевание', 12], ['Полка', 9]] },
    { name: 'Помещение', values: [['Прихожая', 44], ['Ванная', 38], ['Спальня', 31], ['Гардеробная', 16]] }
  ] },
  { name: 'Лестницы', icon: '⌇', groups: [
    { name: 'Форма', values: [['Винтовая', 26], ['Маршевая', 41], ['Модульная', 33], ['С площадкой', 18]] },
    { name: 'Материал', values: [['Дуб', 38], ['Сталь', 44], ['Бетон', 11], ['Комбинированная', 22]] },
    { name: 'Ограждение', values: [['Стекло', 29], ['Тросы', 17], ['Балясины', 21], ['Без ограждения', 8]] },
    { name: 'Высота проёма', values: [['до 2700 мм', 24], ['2700–3200 мм', 36], ['3200 мм и выше', 19], ['По размеру', 41]] }
  ] },
  { name: 'Ширмы', icon: '▤', groups: [
    { name: 'Створки', values: [['2 створки', 14], ['3 створки', 22], ['4 створки', 17], ['5 и более', 6]] },
    { name: 'Материал', values: [['Ротанг', 19], ['Дуб', 24], ['Ткань', 11], ['Металл', 15]] },
    { name: 'Отделка', values: [['Натуральная', 28], ['Тонированная', 17], ['Окрашенная', 13]] }
  ] },
  { name: 'Мебель', icon: '▦', groups: [
    { name: 'Категория', values: [['Столы', 34], ['Консоли', 21], ['Стеллажи', 27], ['Тумбы', 18]] },
    { name: 'Материал', values: [['Дерево', 52], ['Металл', 38], ['Камень', 14], ['Стекло', 22]] },
    { name: 'Помещение', values: [['Гостиная', 41], ['Спальня', 28], ['Кабинет', 24], ['Прихожая', 19]] }
  ] },
  { name: 'Комплектующие', icon: '⚙', groups: [
    { name: 'Тип', values: [['Профили', 46], ['Направляющие', 38], ['Доводчики', 22], ['Ручки', 51], ['Крепёж', 64]] },
    { name: 'Покрытие', values: [['Анодирование', 31], ['Порошковая краска', 44], ['Латунь', 17]] }
  ] }
];

export default function FilterPanel({
  chips, chipStates,
  priceMin, priceMax, filteredCount, activeCount,
  selectedCats,
  onToggleCat, onToggleChip, onPriceMin, onPriceMax,
  onReset, onClose, onOpenQuiz,
}) {
  const [filterCat, setFilterCat] = useState(FILTER_CATS[0].name);

  const activeCat = FILTER_CATS.find(c => c.name === filterCat) || FILTER_CATS[0];

  const getKey = (catName, groupName, val) => `${catName}|${groupName}|${val}`;

  const countForCat = (catName) => {
    const cat = FILTER_CATS.find(c => c.name === catName);
    if (!cat) return 0;
    return cat.groups.reduce((acc, g) =>
      acc + g.values.filter(([v]) => selectedCats[getKey(catName, g.name, v)]).length, 0
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,.34)', animation: 'dcFade .18s ease' }} />

      <div style={{ position: 'relative', margin: '0 auto', width: '100%', maxWidth: 1520, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', boxShadow: '0 30px 80px rgba(26,26,24,.2)', animation: 'dcPop .22s cubic-bezier(.2,.8,.2,1)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 34px', borderBottom: '1px solid #ece9e4' }}>
          <div style={{ fontSize: 21, fontWeight: 500, letterSpacing: '-.02em' }}>Фильтры</div>
          <div style={{ fontSize: 13, color: '#8b877f' }}>{filteredCount} товаров</div>
          <button
            onClick={onOpenQuiz}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 14, cursor: 'pointer', border: 'none' }}
          >
            <span style={{ fontSize: 13 }}>✦</span>
            Умный подбор с AI ассистентом
            <span style={{ color: 'rgba(255,255,255,.6)' }}>→</span>
          </button>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#6b6862', cursor: 'pointer', background: 'none' }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* Left sidebar */}
          <div style={{ width: 320, flexShrink: 0, overflowY: 'auto', background: '#faf9f7', borderRight: '1px solid #ece9e4', padding: '14px 0' }}>
            {FILTER_CATS.map(c => {
              const on = filterCat === c.name;
              const n = countForCat(c.name);
              return (
                <div
                  key={c.name}
                  onMouseEnter={() => setFilterCat(c.name)}
                  onClick={() => setFilterCat(c.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px',
                    fontSize: 15, cursor: 'pointer', transition: 'background .15s, color .15s',
                    background: on ? '#fff' : 'transparent',
                    color: on ? '#1a1a18' : '#4a4842',
                    fontWeight: on ? 600 : 400,
                    borderRight: `2px solid ${on ? '#1a1a18' : 'transparent'}`,
                    marginRight: -1,
                  }}
                >
                  <span style={{
                    width: 30, height: 30, flexShrink: 0, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                    background: on ? '#1a1a18' : '#efece7',
                    color: on ? '#fff' : '#6b6862',
                  }}>{c.icon}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  {n > 0 && (
                    <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {n}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right content */}
          <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '30px 40px 34px' }}>
            <div style={{ columns: 4, columnGap: 40 }}>

              {activeCat.groups.map(g => (
                <div key={g.name} style={{ breakInside: 'avoid', marginBottom: 34 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 14 }}>{g.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {g.values.map(([val, count]) => {
                      const key = getKey(activeCat.name, g.name, val);
                      const on = !!selectedCats[key];
                      return (
                        <div
                          key={val}
                          onClick={() => onToggleCat(key)}
                          style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0', fontSize: 14, cursor: 'pointer', color: on ? '#1a1a18' : '#4a4842' }}
                        >
                          <span style={{
                            width: 19, height: 19, flexShrink: 0, borderRadius: 5,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, color: '#fff',
                            border: `1.5px solid ${on ? '#1a1a18' : '#d5d0c8'}`,
                            background: on ? '#1a1a18' : '#fff',
                            transition: 'background .15s, border-color .15s',
                          }}>{on ? '✓' : ''}</span>
                          <span style={{ flex: 1 }}>{val}</span>
                          <span style={{ fontSize: 12, color: '#c2bdb5' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Price */}
              <div style={{ breakInside: 'avoid', marginBottom: 34 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 14 }}>Цена, ₽</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="number" placeholder="от" value={priceMin}
                    onChange={e => onPriceMin(e.target.value)}
                    style={{ flex: 1, padding: '11px 14px', border: '1px solid #e6e2dc', borderRadius: 8, fontSize: 13.5, color: '#6b6862', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                  />
                  <input
                    type="number" placeholder="до" value={priceMax}
                    onChange={e => onPriceMax(e.target.value)}
                    style={{ flex: 1, padding: '11px 14px', border: '1px solid #e6e2dc', borderRadius: 8, fontSize: 13.5, color: '#6b6862', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Quick filters */}
              <div style={{ breakInside: 'avoid', marginBottom: 34 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 14 }}>Быстрые фильтры</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {chips.map(c => {
                    const on = chipStates[c.key];
                    return (
                      <div
                        key={c.key}
                        onClick={() => onToggleChip(c.key)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', fontSize: 14, color: '#33322e', cursor: 'pointer' }}
                      >
                        <Toggle on={on} />
                        {c.label}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 34px', borderTop: '1px solid #ece9e4', background: '#fff' }}>
          <button onClick={onReset} style={{ padding: '14px 24px', borderRadius: 999, border: '1px solid #e0dcd5', fontSize: 14, color: '#6b6862', cursor: 'pointer', background: 'none' }}>
            Сбросить
          </button>
          <div style={{ flex: 1, fontSize: 13, color: '#8b877f' }}>Выбрано фильтров: {activeCount}</div>
          <button onClick={onClose} style={{ padding: '14px 40px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none' }}>
            Показать {filteredCount} товаров
          </button>
        </div>

      </div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 34, height: 20, borderRadius: 999, background: on ? '#1a1a18' : '#e2ded7', transition: 'background .18s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .18s cubic-bezier(.2,.8,.2,1)', boxShadow: '0 1px 3px rgba(0,0,0,.16)' }} />
    </span>
  );
}
