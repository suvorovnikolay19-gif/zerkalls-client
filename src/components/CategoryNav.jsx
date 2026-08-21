const SECTIONS = [
  { name: 'Зеркала' },
  { name: 'Перегородки' },
  { name: 'Лестницы' },
  { name: 'Ширмы' },
  { name: 'Стеклянные доски' },
  { name: 'Комплектующие' },
];

export const SUBCATS = {
  'Зеркала':           ['Овальные', 'Арочные', 'Во весь рост', 'Круглые', 'Прямоугольные', 'Нестандартные'],
  'Перегородки':       ['Лофт', 'Реечные', 'Раздвижные', 'Распашные', 'Стеклянные', 'Декоративные'],
  'Лестницы':          ['Прямые', 'Маршевые', 'Винтовые', 'На косоурах', 'Модульные'],
  'Ширмы':             ['Тканевые', 'Деревянные', 'Плетёные', 'Гармошка', 'Раздвижные'],
  'Стеклянные доски':  ['Магнитные', 'Прозрачные', 'Белые', 'Цветные'],
  'Комплектующие':     ['Крепления', 'Освещение', 'Фурнитура', 'Профили'],
};

export default function CategoryNav({ section, subsection, onPickSection, onPickSubsection }) {
  if (!section) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 40px 0', overflowX: 'auto' }}>
        {SECTIONS.map(s => (
          <button
            key={s.name}
            onClick={() => onPickSection(s.name)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 22px 10px 12px', borderRadius: 12,
              background: '#fff', border: '1px solid #ece9e4',
              boxShadow: '0 1px 2px rgba(26,26,24,.04)',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              fontSize: 14, color: '#33322e', fontFamily: 'inherit',
            }}
          >
            <span style={{
              width: 34, height: 44, flexShrink: 0, borderRadius: 6, display: 'inline-block',
              backgroundImage: 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 6px, #e9e5de 6px, #e9e5de 12px)',
            }} />
            {s.name}
          </button>
        ))}
      </div>
    );
  }

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
            <span style={{
              width: 34, height: 44, flexShrink: 0, borderRadius: 6, display: 'inline-block',
              backgroundImage: 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 6px, #e9e5de 6px, #e9e5de 12px)',
            }} />
            {name}
          </button>
        );
      })}
    </div>
  );
}
