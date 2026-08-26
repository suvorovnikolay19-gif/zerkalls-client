import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, loading, onAddToCart, compareIds, onToggleCompare }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '26px 24px' }}>
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '26px 24px' }}>
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
