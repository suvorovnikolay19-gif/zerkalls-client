import ProductCard from './ProductCard.jsx';
import testImg from '../../assets/test.jpg';

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function ProductListRow({ product, onAddToCart, compareIds, onToggleCompare }) {
  const img = product.images?.[0]?.filename;
  const chars = product.characteristics || [];
  const tags = chars
    .filter(c => !['старая цена', 'old price', 'скидка', 'discount', 'badge', 'метка', 'ярлык', 'цена до'].some(k => c.name.toLowerCase().includes(k)))
    .slice(0, 2)
    .map(c => c.value)
    .filter(Boolean);
  const isInCompare = compareIds?.includes(product.id);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '72px minmax(0,1fr) auto auto',
        alignItems: 'center', gap: 18,
        padding: '10px 16px 10px 10px',
        background: '#fff', border: '1px solid #ece9e4',
        borderRadius: 14, cursor: 'pointer',
        transition: 'border-color .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#1a1a18'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#ece9e4'}
    >
      <div style={{
        width: 72, height: 72, borderRadius: 10, flexShrink: 0,
        backgroundImage: img ? `url(${img})` : `url(${testImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        {tags.length > 0 && (
          <div style={{ fontSize: 12, color: '#8b877f' }}>{tags.join(' · ')}</div>
        )}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
        {formatPrice(product.price)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); onToggleCompare && onToggleCompare(product); }}
          style={{
            padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', border: 'none',
            background: isInCompare ? '#1a1a18' : '#f0ede8',
            color: isInCompare ? '#fff' : '#33322e',
          }}
        >
          {isInCompare ? '✓ В сравнении' : '⇄ Сравнить'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
          style={{
            padding: '8px 18px', borderRadius: 999, border: '1px solid #e0dcd5',
            fontSize: 13, cursor: 'pointer', background: '#fff', color: '#33322e',
            transition: 'background .15s, color .15s, border-color .15s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1a1a18'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1a1a18'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#33322e'; e.currentTarget.style.borderColor = '#e0dcd5'; }}
        >
          Заказать
        </button>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, viewMode = 'grid', onAddToCart, compareIds, onToggleCompare }) {
  const cols = viewMode === 'large' ? 2 : 4;
  const gap = viewMode === 'large' ? '32px 28px' : '26px 24px';

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ aspectRatio: '3/4', borderRadius: 4, background: 'linear-gradient(90deg, #f0ede8 25%, #e4e0d8 50%, #f0ede8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: 14, borderRadius: 4, background: '#f0ede8', width: '55%' }} />
            <div style={{ height: 16, borderRadius: 4, background: '#f0ede8', width: '80%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '70px 0', textAlign: 'center', color: '#8b877f', fontSize: 15 }}>
        Ничего не найдено — снимите часть фильтров
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.map(p => (
          <ProductListRow
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            compareIds={compareIds}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          onAddToCart={onAddToCart}
          isInCompare={compareIds?.includes(p.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
