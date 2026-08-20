export default function FilterBar({ chips, chipStates, onToggleChip, activeCount, filteredCount, totalCount, onOpenPanel }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(251,250,248,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #ece9e4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 40px', overflowX: 'auto' }}>
        <button
          onClick={onOpenPanel}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flex: 'none', border: 'none' }}
        >
          <FilterIcon />
          Все фильтры
          {activeCount > 0 && (
            <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 999, background: '#fff', color: '#1a1a18', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeCount}
            </span>
          )}
        </button>

        {chips.map(c => {
          const on = chipStates[c.key];
          return (
            <button
              key={c.key}
              onClick={() => onToggleChip(c.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 12px', borderRadius: 999, border: `1px solid ${on ? '#1a1a18' : '#e0dcd5'}`, background: on ? '#fff' : 'transparent', fontSize: 14, color: '#33322e', cursor: 'pointer', whiteSpace: 'nowrap', flex: 'none', transition: 'border-color .15s' }}
            >
              <Toggle on={on} />
              {c.label}
            </button>
          );
        })}

        <div style={{ marginLeft: 'auto', paddingLeft: 16, fontSize: 13, color: '#8b877f', whiteSpace: 'nowrap', flex: 'none' }}>
          {filteredCount} из {totalCount} товаров
        </div>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 15 }}>
      <span style={{ display: 'block', height: 1.5, background: '#fff', width: 15 }} />
      <span style={{ display: 'block', height: 1.5, background: '#fff', width: 10 }} />
      <span style={{ display: 'block', height: 1.5, background: '#fff', width: 13 }} />
    </span>
  );
}

function Toggle({ on }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 34, height: 20, borderRadius: 999, background: on ? '#1a1a18' : '#e2ded7', transition: 'background .18s', flex: 'none' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .18s cubic-bezier(.2,.8,.2,1)', boxShadow: '0 1px 3px rgba(0,0,0,.16)' }} />
    </span>
  );
}
