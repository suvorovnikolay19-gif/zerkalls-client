const CRUMB_MAP = {
  catalog:     [{ name: 'Каталог' }],
  mirrors:     [{ name: 'Каталог', href: 'catalog' }, { name: 'Зеркала' }],
  partitions:  [{ name: 'Каталог', href: 'catalog' }, { name: 'Перегородки' }],
  stairs:      [{ name: 'Каталог', href: 'catalog' }, { name: 'Лестницы' }],
  novelties:   [{ name: 'Новинки сезона' }],
  bestsellers: [{ name: 'Хиты продаж' }],
  sale:        [{ name: 'Распродажа' }],
};

export default function Breadcrumbs({ entry, onGoHome, onGoEntry }) {
  const crumbs = CRUMB_MAP[entry] ?? CRUMB_MAP.catalog;
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, padding: '18px 40px 0', fontSize: 13, color: '#8b877f' }}>
      <span onClick={onGoHome} style={{ cursor: 'pointer', color: '#8b877f', transition: 'color .15s' }}>Главная</span>
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#c9c4bb' }}>/</span>
            <span
              onClick={!isLast && c.href ? () => onGoEntry(c.href) : undefined}
              style={{ color: isLast ? '#33322e' : '#8b877f', cursor: !isLast && c.href ? 'pointer' : 'default' }}
            >
              {c.name}
            </span>
          </span>
        );
      })}
    </div>
  );
}
