const ACCENT = '#d8442f';

export default function FilterPanel({
  cats, selectedCats, materials, selectedMats, chips, chipStates,
  priceMin, priceMax, filteredCount,
  onToggleCat, onToggleMat, onToggleChip, onPriceMin, onPriceMax,
  onReset, onClose, onOpenQuiz,
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,.34)', animation: 'dcFade .18s ease' }} />
      <div style={{ position: 'relative', width: 460, maxWidth: '100%', height: '100%', background: '#fbfaf8', boxShadow: '-20px 0 60px rgba(26,26,24,.14)', display: 'flex', flexDirection: 'column', animation: 'dcSlide .24s cubic-bezier(.2,.8,.2,1)' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #ece9e4' }}>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.01em' }}>Фильтры</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#6b6862', cursor: 'pointer', background: 'none' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 28px' }}>
          <button onClick={onOpenQuiz} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 16, background: '#1a1a18', color: '#fff', cursor: 'pointer', marginBottom: 30, width: '100%', border: 'none', textAlign: 'left' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flex: 'none' }}>✦</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Умный подбор с AI ассистентом</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.62)' }}>4 вопроса — и мы соберём подборку</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 16, color: 'rgba(255,255,255,.7)' }}>→</div>
          </button>

          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em', marginBottom: 16 }}>Межкомнатные перегородки</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 32 }}>
            {cats.map(c => {
              const on = !!selectedCats[c.name];
              return (
                <button key={c.name} onClick={() => onToggleCat(c.name)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px 7px 0', fontSize: 15, cursor: 'pointer', color: on ? '#1a1a18' : '#4a4842', fontWeight: on ? 600 : 400, background: 'none', border: 'none', textAlign: 'left', width: '100%' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', flex: 'none', background: c.hot ? ACCENT : 'transparent' }} />
                  {c.name}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8b877f', marginBottom: 14 }}>Цена, ₽</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
            <input type="number" placeholder="от" value={priceMin} onChange={e => onPriceMin(e.target.value)} style={{ flex: 1, padding: '13px 16px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff', fontSize: 14, color: '#6b6862', outline: 'none' }} />
            <input type="number" placeholder="до" value={priceMax} onChange={e => onPriceMax(e.target.value)} style={{ flex: 1, padding: '13px 16px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff', fontSize: 14, color: '#6b6862', outline: 'none' }} />
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8b877f', marginBottom: 14 }}>Материал</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {materials.map(m => {
              const on = !!selectedMats[m];
              return (
                <button key={m} onClick={() => onToggleMat(m)} style={{ padding: '10px 16px', borderRadius: 999, border: `1px solid ${on ? '#1a1a18' : '#e0dcd5'}`, background: on ? '#1a1a18' : '#fff', color: on ? '#fff' : '#4a4842', fontSize: 13, cursor: 'pointer' }}>
                  {m}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8b877f', marginBottom: 14 }}>Быстрые фильтры</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {chips.map(c => {
              const on = chipStates[c.key];
              return (
                <button key={c.key} onClick={() => onToggleChip(c.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 2px', fontSize: 15, color: '#33322e', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}>
                  <Toggle on={on} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '20px 28px', borderTop: '1px solid #ece9e4', background: '#fbfaf8' }}>
          <button onClick={onReset} style={{ padding: '15px 22px', borderRadius: 999, border: '1px solid #e0dcd5', fontSize: 14, color: '#6b6862', cursor: 'pointer', background: 'none' }}>Сбросить</button>
          <button onClick={onClose} style={{ flex: 1, padding: '15px 22px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 14, fontWeight: 500, textAlign: 'center', cursor: 'pointer', border: 'none' }}>
            Показать {filteredCount} товаров
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 34, height: 20, borderRadius: 999, background: on ? '#1a1a18' : '#e2ded7', transition: 'background .18s', flex: 'none' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .18s cubic-bezier(.2,.8,.2,1)', boxShadow: '0 1px 3px rgba(0,0,0,.16)' }} />
    </span>
  );
}
