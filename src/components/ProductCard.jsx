import testImg from '../../assets/test.jpg';

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function getChar(characteristics, ...keys) {
  return characteristics?.find(c => keys.some(k => c.name.toLowerCase().includes(k)))?.value;
}

function PriceDisplay({ price, priceType, oldPrice }) {
  if (priceType === 'request') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8b877f', fontStyle: 'italic' }}>Цена по запросу</span>
      </div>
    );
  }
  if (priceType === 'from') {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#8b877f' }}>от</span>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(price)}</span>
        {oldPrice && <span style={{ fontSize: 13, color: '#a8a39a', textDecoration: 'line-through' }}>{oldPrice}</span>}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(price)}</span>
      {oldPrice && <span style={{ fontSize: 13, color: '#a8a39a', textDecoration: 'line-through' }}>{oldPrice}</span>}
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, isInCompare, onToggleCompare }) {
  const img = product.images?.[0]?.filename;
  const chars = product.characteristics || [];

  const oldPrice = getChar(chars, 'старая цена', 'old price', 'цена до');
  const discount = getChar(chars, 'скидка', 'discount');
  const badge = getChar(chars, 'badge', 'метка', 'ярлык');

  const tags = chars
    .filter(c => !['старая цена', 'old price', 'скидка', 'discount', 'badge', 'метка', 'ярлык', 'цена до'].some(k => c.name.toLowerCase().includes(k)))
    .slice(0, 3)
    .map(c => c.value)
    .filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}>
      <div style={{
        position: 'relative', aspectRatio: '3/4', borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: img ? `url(${img})` : `url(${testImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <button
          onClick={e => { e.stopPropagation(); onToggleCompare && onToggleCompare(product); }}
          style={{
            position: 'absolute', top: 12, left: 12,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 11px', borderRadius: 999,
            fontSize: 11, fontWeight: 600, letterSpacing: '.02em',
            cursor: 'pointer', border: 'none',
            background: isInCompare ? '#1a1a18' : 'rgba(255,255,255,.92)',
            color: isInCompare ? '#fff' : '#33322e',
            transition: 'background .15s',
          }}
        >
          {isInCompare ? '✓' : '⇄'} {isInCompare ? 'В сравнении' : 'Сравнить'}
        </button>

        {(badge || discount) && (
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
            {badge && <span style={{ padding: '5px 9px', borderRadius: 999, background: 'rgba(255,255,255,.94)', fontSize: 10, fontWeight: 600, letterSpacing: '.06em' }}>{badge}</span>}
            {discount && <span style={{ padding: '5px 9px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 11, fontWeight: 600 }}>{discount}</span>}
          </div>
        )}
      </div>

      <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em' }}>{product.name}</div>

      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map((t, i) => (
            <span key={i} style={{ padding: '5px 10px', borderRadius: 999, border: '1px solid #e6e2dc', fontSize: 11, color: '#6b6862' }}>{t}</span>
          ))}
        </div>
      )}

      <button
        onClick={e => e.stopPropagation()}
        style={{ marginTop: 'auto', padding: '10px 16px', borderRadius: 999, border: '1px solid #e0dcd5', fontSize: 13, color: '#33322e', cursor: 'pointer', background: '#fff', transition: 'background .18s, color .18s, border-color .18s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1a1a18'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1a1a18'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#33322e'; e.currentTarget.style.borderColor = '#e0dcd5'; }}
      >
        Заказать
      </button>
    </div>
  );
}
