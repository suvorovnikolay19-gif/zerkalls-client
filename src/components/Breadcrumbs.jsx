const BASE_CRUMBS = {
  catalog:     [{ name: 'Каталог', href: 'catalog' }],
  mirrors:     [{ name: 'Каталог', href: 'catalog' }],
  partitions:  [{ name: 'Каталог', href: 'catalog' }],
  stairs:      [{ name: 'Каталог', href: 'catalog' }],
  novelties:   [{ name: 'Новинки сезона' }],
  bestsellers: [{ name: 'Хиты продаж' }],
  sale:        [{ name: 'Распродажа' }],
};

export default function Breadcrumbs({ entry, section, subsection, onGoHome, onGoEntry, onClearSubsection }) {
  const base = BASE_CRUMBS[entry] ?? BASE_CRUMBS.catalog;

  const crumbs = [...base];
  if (section) crumbs.push({ name: section, onClick: subsection ? onClearSubsection : undefined });
  if (subsection) crumbs.push({ name: subsection });

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, padding: '18px 40px 0', fontSize: 13, color: '#8b877f' }}>
      <span onClick={onGoHome} style={{ cursor: 'pointer', color: '#8b877f' }}>Главная</span>
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        const clickable = !isLast && (c.href || c.onClick);
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#c9c4bb' }}>/</span>
            <span
              onClick={c.href && !isLast ? () => onGoEntry(c.href) : c.onClick}
              style={{ color: isLast ? '#33322e' : '#8b877f', cursor: clickable ? 'pointer' : 'default' }}
            >
              {c.name}
            </span>
          </span>
        );
      })}
    </div>
  );
}
