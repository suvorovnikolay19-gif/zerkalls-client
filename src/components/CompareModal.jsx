const SPEC_ROWS = [
  'Тип', 'Форма', 'Размер, мм', 'Материал рамы',
  'Стекло', 'Подсветка', 'Монтаж', 'Срок изготовления', 'Гарантия',
];

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function getSpec(product, row) {
  const char = (product.characteristics || []).find(c => c.name === row);
  return char?.value ?? '—';
}

export default function CompareModal({ items, onClose, onRemove, onClear }) {
  const count = items.length;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 75, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,.42)', animation: 'dcFade .18s ease' }}
      />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 1080, maxHeight: '100%',
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: 22, overflow: 'hidden',
        animation: 'dcPop .22s cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 30px', borderBottom: '1px solid #ece9e4' }}>
          <div style={{ fontSize: 21, fontWeight: 500, letterSpacing: '-.02em' }}>Сравнение</div>
          <div style={{ fontSize: 13, color: '#8b877f' }}>
            {count < 2 ? 'Добавьте второй товар, чтобы увидеть отличия' : 'Отличия подсвечены'}
          </div>
          <button onClick={onClear} style={{ marginLeft: 'auto', fontSize: 13, color: '#8b877f', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            Очистить
          </button>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#6b6862', cursor: 'pointer', background: 'none', flexShrink: 0 }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '26px 30px 30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${Math.max(count, 2)}, minmax(0, 1fr))`, gap: 22, alignItems: 'start' }}>
            <div />

            {items.map(p => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden',
                  backgroundImage: 'repeating-linear-gradient(135deg, #f0ede8 0, #f0ede8 10px, #e9e5de 10px, #e9e5de 20px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#a8a39a' }}>{p.name}</span>
                  <button
                    onClick={() => onRemove(p.id)}
                    style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(251,250,248,.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#6b6862', cursor: 'pointer', border: 'none' }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em' }}>{p.name}</div>
                <div style={{ fontSize: 15 }}>{formatPrice(p.price)}</div>
              </div>
            ))}

            {count < 2 && (
              <div
                onClick={onClose}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, aspectRatio: '4/3', borderRadius: 12, border: '1.5px dashed #ddd8d1', color: '#a8a39a', fontSize: 13, textAlign: 'center', padding: 16, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 20 }}>+</span>
                Выберите второй товар в каталоге
              </div>
            )}
          </div>

          {count > 0 && (
            <div style={{ marginTop: 28 }}>
              {SPEC_ROWS.map((row, i) => {
                const vals = items.map(p => getSpec(p, row));
                const diff = vals.length === 2 && vals[0] !== vals[1];
                return (
                  <div
                    key={row}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `180px repeat(${Math.max(count, 2)}, minmax(0, 1fr))`,
                      gap: 22, alignItems: 'center',
                      padding: '13px 0', borderTop: '1px solid #f1eee9',
                      background: i % 2 ? '#fff' : '#fcfbf9',
                    }}
                  >
                    <div style={{ fontSize: 13, color: '#8b877f' }}>{row}</div>
                    {vals.map((v, j) => (
                      <div
                        key={j}
                        style={{ fontSize: 14, color: diff ? '#1a1a18' : '#6b6862', fontWeight: diff ? 600 : 400 }}
                      >
                        {v}
                      </div>
                    ))}
                    {count < 2 && <div />}
                  </div>
                );
              })}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${Math.max(count, 2)}, minmax(0, 1fr))`,
                gap: 22, alignItems: 'center',
                padding: '13px 0', borderTop: '1px solid #f1eee9',
                background: SPEC_ROWS.length % 2 ? '#fff' : '#fcfbf9',
              }}>
                <div style={{ fontSize: 13, color: '#8b877f' }}>Цена</div>
                {items.map(p => {
                  const a = p.price;
                  const b = count === 2 ? items.find(x => x.id !== p.id)?.price : null;
                  const diff2 = b !== null && a !== b;
                  return (
                    <div key={p.id} style={{ fontSize: 14, color: diff2 ? '#1a1a18' : '#6b6862', fontWeight: diff2 ? 600 : 400 }}>
                      {formatPrice(p.price)}
                    </div>
                  );
                })}
                {count < 2 && <div />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
