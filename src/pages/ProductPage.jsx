import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductBySlug, fetchProducts, fetchAllCategories } from '../api.js';
import { MOCK_PRODUCTS } from '../mock/products.js';
import { useCart } from '../CartContext.jsx';
import { toSlug } from '../utils/slug.js';
import testImg from '../../assets/test.webp';

// Служебные характеристики, которые mapProduct кладёт в начало списка — в таблицу не выводим
const SERVICE_CHARS = ['старая цена', 'old price', 'скидка', 'discount', 'badge', 'метка', 'ярлык', 'цена до'];
// Что показываем крупно под ценой: первые найденные из этого списка
const KEY_CHARS = ['Размер, мм', 'Материал рамы', 'Материал', 'Стекло', 'Срок изготовления'];

const fmt = n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';

const CSS = `
.pp { font-family: 'Golos Text', Helvetica, sans-serif; color: #1a1a18; background: #fbfaf8; min-height: 100vh; -webkit-font-smoothing: antialiased; }
.pp * { box-sizing: border-box; }
.pp button { font-family: inherit; }

.pp-top { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: rgba(251,250,248,.92); backdrop-filter: blur(12px); border-bottom: 1px solid #ece9e4; }
.pp-back { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; border: 1px solid #e0dcd5; background: #fff; color: #33322e; cursor: pointer; flex: none; }
.pp-crumbs { display: flex; align-items: center; gap: 4px; min-width: 0; font-size: 13px; color: #8b877f; overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
.pp-crumbs::-webkit-scrollbar { display: none; }
.pp-crumbs button { border: 0; background: none; padding: 6px 4px; color: #6b6862; cursor: pointer; font-size: inherit; }
.pp-crumbs button:hover { color: #1a1a18; }
.pp-crumbs span { color: #b9b5ad; }
.pp-cart { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid #e0dcd5; background: #fff; color: #33322e; font-size: 13px; font-weight: 500; cursor: pointer; flex: none; }
.pp-cart b { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; background: #1a1a18; color: #fff; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }

.pp-body { padding: 0 0 110px; }
.pp-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }

/* Галерея: на телефоне — горизонтальная лента со снапом, на десктопе — большое фото + миниатюры */
.pp-gallery { position: relative; }
.pp-strip { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 6px; padding: 0 16px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.pp-strip::-webkit-scrollbar { display: none; }
.pp-slide { flex: 0 0 calc(100% - 32px); scroll-snap-align: center; aspect-ratio: 3 / 4; border-radius: 10px; overflow: hidden; background: #ece9e4; }
.pp-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pp-dots { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
.pp-dots i { width: 6px; height: 6px; border-radius: 999px; background: #dcd8d1; transition: background .2s, width .2s; }
.pp-dots i.on { background: #1a1a18; width: 18px; }
.pp-thumbs { display: none; }
.pp-badges { position: absolute; top: 12px; left: 28px; display: flex; gap: 6px; pointer-events: none; }
.pp-badge { padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,.94); font-size: 11px; font-weight: 600; letter-spacing: .04em; }
.pp-badge.dark { background: #1a1a18; color: #fff; letter-spacing: 0; }

.pp-info { padding: 0 16px; display: flex; flex-direction: column; gap: 22px; }
.pp-cat { font-size: 13px; color: #8b877f; }
.pp-cat button { border: 0; background: none; padding: 0; color: #6b6862; cursor: pointer; font-size: inherit; text-decoration: underline; text-decoration-color: #dcd8d1; text-underline-offset: 3px; }
.pp-name { margin: 6px 0 0; font-size: clamp(26px, 6vw, 40px); line-height: 1.08; font-weight: 500; letter-spacing: -.025em; }

.pp-price { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 12px; }
.pp-price .v { font-size: 28px; font-weight: 500; letter-spacing: -.02em; font-family: 'JetBrains Mono', ui-monospace, monospace; }
.pp-price .from { font-size: 15px; color: #8b877f; }
.pp-price .old { font-size: 16px; color: #a8a39a; text-decoration: line-through; font-family: 'JetBrains Mono', ui-monospace, monospace; }
.pp-price .note { flex-basis: 100%; font-size: 13.5px; line-height: 1.5; color: #6b6862; }

.pp-actions { display: flex; flex-direction: column; gap: 10px; }
.pp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 0 24px; border-radius: 999px; font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none; transition: background .18s, color .18s, border-color .18s; }
.pp-btn.primary { background: #1a1a18; color: #fff; border: 1px solid #1a1a18; }
.pp-btn.primary:hover { background: #33322e; }
.pp-btn.primary.done { background: #2f6b3f; border-color: #2f6b3f; }
.pp-btn.ghost { background: #fff; color: #33322e; border: 1px solid #e0dcd5; }
.pp-btn.ghost:hover { border-color: #1a1a18; }
.pp-btn.ghost.on { background: #f0ece5; border-color: #1a1a18; }
.pp-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.pp-desc { font-size: 15.5px; line-height: 1.6; color: #33322e; }
.pp-desc p { margin: 0 0 10px; }
.pp-desc p:last-child { margin: 0; }

.pp-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.pp-fact { padding: 14px 16px; border-radius: 14px; background: #fff; border: 1px solid #ece9e4; }
.pp-fact .k { font-size: 12px; color: #8b877f; margin-bottom: 4px; }
.pp-fact .v { font-size: 15px; font-weight: 500; letter-spacing: -.01em; }

.pp-h { margin: 0 0 12px; font-size: 19px; font-weight: 500; letter-spacing: -.015em; }
.pp-spec { display: flex; flex-direction: column; border-top: 1px solid #ece9e4; }
.pp-spec > div { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 16px; padding: 12px 0; border-bottom: 1px solid #ece9e4; font-size: 14.5px; line-height: 1.45; }
.pp-spec .k { color: #8b877f; }
.pp-spec .v { color: #1a1a18; font-weight: 500; }

.pp-tags { display: flex; flex-direction: column; gap: 8px; }
.pp-tagrow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.pp-tagrow .k { font-size: 12.5px; color: #8b877f; margin-right: 4px; }
.pp-tag { padding: 7px 12px; border-radius: 999px; border: 1px solid #e6e2dc; background: #fff; font-size: 12.5px; color: #33322e; }

.pp-trust { display: flex; flex-direction: column; gap: 14px; padding: 18px 18px 20px; border-radius: 16px; background: #f0ece5; }
.pp-trust > div { display: flex; gap: 12px; font-size: 13.5px; line-height: 1.5; color: #33322e; }
.pp-trust svg { flex: none; margin-top: 2px; }

.pp-similar { padding: 48px 0 0; }
.pp-similar .pp-h { padding: 0 16px; }
.pp-sim-strip { display: flex; gap: 12px; overflow-x: auto; padding: 0 16px 8px; scroll-snap-type: x proximity; scrollbar-width: none; }
.pp-sim-strip::-webkit-scrollbar { display: none; }
.pp-sim { flex: 0 0 62%; scroll-snap-align: start; display: flex; flex-direction: column; gap: 8px; cursor: pointer; border: 0; background: none; padding: 0; text-align: left; color: inherit; }
.pp-sim .img { aspect-ratio: 3 / 4; border-radius: 8px; background: #ece9e4 center / cover no-repeat; }
.pp-sim .n { font-size: 14px; font-weight: 500; letter-spacing: -.01em; }
.pp-sim .p { font-size: 13px; color: #6b6862; font-family: 'JetBrains Mono', ui-monospace, monospace; }

/* Липкая панель заказа — только на телефоне, в зоне большого пальца */
.pp-bar { transform: translateY(110%); transition: transform .25s cubic-bezier(.2,.8,.2,1); position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; display: flex; align-items: center; gap: 12px; padding: 10px 16px max(10px, env(safe-area-inset-bottom)); background: rgba(251,250,248,.94); backdrop-filter: blur(12px); border-top: 1px solid #ece9e4; }
.pp-bar.show { transform: none; }
.pp-bar .sum { display: flex; flex-direction: column; min-width: 0; }
.pp-bar .sum .v { font-size: 17px; font-weight: 500; letter-spacing: -.01em; font-family: 'JetBrains Mono', ui-monospace, monospace; white-space: nowrap; }
.pp-bar .sum .n { font-size: 11.5px; color: #8b877f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pp-bar .pp-btn { margin-left: auto; min-height: 48px; padding: 0 22px; flex: none; }

.pp-empty { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 40px 16px; text-align: center; }
.pp-empty h1 { margin: 0; font-size: 24px; font-weight: 500; letter-spacing: -.02em; }
.pp-empty p { margin: 0; color: #8b877f; font-size: 15px; }
.pp-skel { background: linear-gradient(90deg, #f0ede8 25%, #e4e0d8 50%, #f0ede8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }

@media (hover: none) { .pp-btn.primary:hover { background: #1a1a18; } }
@media (prefers-reduced-motion: reduce) { .pp-dots i, .pp-btn { transition: none; } }

@media (min-width: 760px) {
  .pp-top { padding: 14px 32px; }
  .pp-body { padding-bottom: 80px; }
  .pp-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 40px; padding: 26px 32px 0; align-items: start; }
  .pp-gallery { position: sticky; top: 82px; display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 12px; }
  .pp-strip { display: block; overflow: visible; padding: 0; order: 2; }
  .pp-slide { display: none; border-radius: 14px; flex: none; }
  .pp-slide.on { display: block; }
  .pp-dots { display: none; }
  .pp-thumbs { display: flex; flex-direction: column; gap: 8px; order: 1; }
  .pp-thumb { width: 64px; aspect-ratio: 3 / 4; border-radius: 8px; overflow: hidden; border: 1.5px solid transparent; background: #ece9e4; cursor: pointer; padding: 0; opacity: .7; transition: opacity .15s, border-color .15s; }
  .pp-thumb.on { border-color: #1a1a18; opacity: 1; }
  .pp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pp-badges { left: 88px; top: 14px; }
  .pp-info { padding: 0; gap: 26px; }
  .pp-bar { display: none; }
  .pp-similar { padding: 72px 32px 0; }
  .pp-similar .pp-h { padding: 0; }
  .pp-sim-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; padding: 0; overflow: visible; }
  .pp-sim { flex: none; }
}
@media (min-width: 1100px) {
  .pp-top { padding: 14px 40px; }
  .pp-grid { gap: 64px; padding: 30px 40px 0; }
  .pp-similar { padding: 90px 40px 0; }
  .pp-sim-strip { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
`;

function Icon({ d, size = 16, stroke = '#1a1a18' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function findMock(slug) {
  return MOCK_PRODUCTS.find(p => p.id === slug || p.slug === slug) || null;
}

export default function ProductPage({ slug, onAddToCart, compareIds = [], onToggleCompare }) {
  const navigate = useNavigate();
  const { totalCount, setIsOpen: setCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const stripRef = useRef(null);
  const actionsRef = useRef(null);
  const [barShown, setBarShown] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setActive(0);
    setAdded(false);
    window.scrollTo(0, 0);
    fetchProductBySlug(slug)
      .then(p => { if (alive) setProduct(p || findMock(slug)); })
      .catch(() => { if (alive) setProduct(findMock(slug)); })
      .finally(() => { if (alive) setLoading(false); });
    fetchAllCategories({ limit: 500 }).then(all => { if (alive) setCats(all); }).catch(() => {});
    return () => { alive = false; };
  }, [slug]);

  // Цепочка категорий от корня до категории товара — для крошек и ссылок в каталог
  const chain = useMemo(() => {
    if (!product?.category || !cats.length) return [];
    const byId = Object.fromEntries(cats.map(c => [c.id, c]));
    const out = [];
    let cur = byId[product.category.id];
    while (cur) { out.unshift(cur); cur = cur.parent ? byId[cur.parent] : null; }
    return out;
  }, [product, cats]);

  const catPath = (depth) => '/catalog/' + chain.slice(0, depth + 1).map(c => toSlug(c.name)).join('/');

  // Похожие: из той же категории, если мало — из родительской
  useEffect(() => {
    if (!product?.category) { setSimilar([]); return; }
    let alive = true;
    const load = async () => {
      const own = await fetchProducts({ categoryId: product.category.id, limit: 12 }).then(r => r.products).catch(() => []);
      let list = own.filter(p => p.id !== product.id);
      if (list.length < 4 && product.category.parent) {
        const parent = cats.find(c => c.id === product.category.parent);
        if (parent) {
          const sibIds = cats.filter(c => c.parent === parent.id).map(c => c.id);
          const more = await fetchProducts({ categoryIds: sibIds, limit: 16 }).then(r => r.products).catch(() => []);
          const seen = new Set(list.map(p => p.id).concat(product.id));
          for (const p of more) if (!seen.has(p.id)) { list.push(p); seen.add(p.id); }
        }
      }
      if (alive) setSimilar(list.slice(0, 5));
    };
    load();
    return () => { alive = false; };
  }, [product, cats]);

  // Активный слайд мобильной ленты — по скроллу
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild?.getBoundingClientRect().width || 1;
      setActive(Math.round(el.scrollLeft / (w + 6)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [product]);

  // Нижняя панель заказа появляется, когда основная кнопка «Заказать» ушла вверх за экран
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setBarShown(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [product]);

  if (loading) {
    return (
      <div className="pp">
        <style>{CSS}</style>
        <TopBar onBack={() => navigate(-1)} count={totalCount} onCart={() => setCartOpen(true)} />
        <div className="pp-body"><div className="pp-grid">
          <div className="pp-skel" style={{ aspectRatio: '3/4', margin: '0 16px' }} />
          <div className="pp-info">
            <div className="pp-skel" style={{ height: 14, width: '40%' }} />
            <div className="pp-skel" style={{ height: 38, width: '85%' }} />
            <div className="pp-skel" style={{ height: 28, width: '50%' }} />
            <div className="pp-skel" style={{ height: 52 }} />
          </div>
        </div></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pp">
        <style>{CSS}</style>
        <TopBar onBack={() => navigate('/catalog')} count={totalCount} onCart={() => setCartOpen(true)} />
        <div className="pp-empty">
          <h1>Такого товара нет</h1>
          <p>Возможно, он снят с публикации или ссылка устарела.</p>
          <button className="pp-btn primary" onClick={() => navigate('/catalog')}>Открыть каталог</button>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ id: 'ph', filename: testImg, thumb: testImg }];
  const chars = (product.characteristics || []).filter(c => !SERVICE_CHARS.some(k => c.name.toLowerCase().includes(k)));
  const badge = product.badge || product.characteristics?.find(c => c.name.toLowerCase() === 'badge')?.value;
  const discount = product.characteristics?.find(c => c.name.toLowerCase() === 'скидка')?.value;
  const oldPrice = product.oldPrice || null;
  const keyFacts = KEY_CHARS.map(k => chars.find(c => c.name === k)).filter(Boolean).slice(0, 4);
  const inCompare = compareIds.includes(product.id);

  const tagGroups = (product.tags || []).reduce((acc, t) => {
    const g = t.group || 'Теги';
    (acc[g] = acc[g] || []).push(t.name);
    return acc;
  }, {});

  const priceNote = product.priceType === 'request'
    ? 'Рассчитаем по вашим размерам и пришлём смету в течение рабочего дня.'
    : product.priceType === 'from'
      ? 'Итоговая стоимость зависит от размеров проёма и комплектации.'
      : null;

  const order = () => {
    onAddToCart && onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const scrollTo = (i) => {
    setActive(i);
    const el = stripRef.current;
    if (el && el.children[i]) el.children[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const priceBlock = (
    <div className="pp-price">
      {product.priceType === 'request' ? (
        <span className="v" style={{ fontSize: 22 }}>Цена по запросу</span>
      ) : (
        <>
          {product.priceType === 'from' && <span className="from">от</span>}
          <span className="v">{fmt(product.price)}</span>
          {oldPrice && <span className="old">{fmt(oldPrice)}</span>}
        </>
      )}
      {priceNote && <span className="note">{priceNote}</span>}
    </div>
  );

  return (
    <div className="pp">
      <style>{CSS}</style>
      <TopBar
        onBack={() => navigate(chain.length ? catPath(chain.length - 1) : '/catalog')}
        count={totalCount}
        onCart={() => setCartOpen(true)}
        crumbs={[{ label: 'Каталог', to: '/catalog' }, ...chain.map((c, i) => ({ label: c.name, to: catPath(i) }))]}
        onNav={navigate}
      />

      <div className="pp-body">
        <div className="pp-grid">
          <div className="pp-gallery">
            <div className="pp-strip" ref={stripRef}>
              {images.map((im, i) => (
                <div key={im.id || i} className={'pp-slide' + (i === active ? ' on' : '')}>
                  <img src={im.filename} alt={im.title || `${product.name}, фото ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <div className="pp-dots" aria-hidden="true">
                  {images.map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}
                </div>
                <div className="pp-thumbs">
                  {images.map((im, i) => (
                    <button key={im.id || i} className={'pp-thumb' + (i === active ? ' on' : '')} onClick={() => scrollTo(i)} aria-label={`Фото ${i + 1}`}>
                      <img src={im.thumb || im.filename} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </>
            )}
            {(badge || discount) && (
              <div className="pp-badges">
                {badge && <span className="pp-badge">{badge}</span>}
                {discount && <span className="pp-badge dark">{discount}</span>}
              </div>
            )}
          </div>

          <div className="pp-info">
            <div>
              {chain.length > 0 && (
                <div className="pp-cat">
                  <button onClick={() => navigate(catPath(chain.length - 1))}>{chain[chain.length - 1].name}</button>
                </div>
              )}
              <h1 className="pp-name">{product.name}</h1>
            </div>

            {priceBlock}

            <div className="pp-actions" ref={actionsRef}>
              <button className={'pp-btn primary' + (added ? ' done' : '')} onClick={order}>
                {added ? 'Добавлено в корзину' : product.priceType === 'request' ? 'Запросить расчёт' : 'Заказать'}
              </button>
              <div className="pp-row2">
                <button className={'pp-btn ghost' + (inCompare ? ' on' : '')} onClick={() => onToggleCompare && onToggleCompare(product)}>
                  {inCompare ? 'В сравнении' : 'Сравнить'}
                </button>
                <a className="pp-btn ghost" href="https://wa.me/79854341133" target="_blank" rel="noopener noreferrer">Задать вопрос</a>
              </div>
            </div>

            {keyFacts.length > 0 && (
              <div className="pp-facts">
                {keyFacts.map(f => (
                  <div key={f.name} className="pp-fact">
                    <div className="k">{f.name}</div>
                    <div className="v">{f.value}</div>
                  </div>
                ))}
              </div>
            )}

            {product.description && (
              <div className="pp-desc" dangerouslySetInnerHTML={{ __html: product.description }} />
            )}

            {chars.length > 0 && (
              <div>
                <h2 className="pp-h">Характеристики</h2>
                <div className="pp-spec">
                  {chars.map((c, i) => (
                    <div key={i}><span className="k">{c.name}</span><span className="v">{c.value}</span></div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(tagGroups).length > 0 && (
              <div className="pp-tags">
                {Object.entries(tagGroups).map(([g, names]) => (
                  <div key={g} className="pp-tagrow">
                    <span className="k">{g}</span>
                    {names.map(n => <span key={n} className="pp-tag">{n}</span>)}
                  </div>
                ))}
              </div>
            )}

            <div className="pp-trust">
              <div><Icon d="M3 7l9-4 9 4v6c0 5-4 8-9 9-5-1-9-4-9-9z" /> <span>Собственное производство в Домодедово. Гарантия 5 лет на конструкцию и фурнитуру.</span></div>
              <div><Icon d="M4 4h12v4h4v8h-2M4 16h2m4 0h6M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 4v12" /> <span>Доставка по Москве и области 2–4 дня, по России 5–12 дней транспортной компанией.</span></div>
              <div><Icon d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6" /> <span>Изготовим по вашим размерам: пришлите замеры или фото проёма, конструктор подготовит чертёж.</span></div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="pp-similar">
            <h2 className="pp-h">Похожие изделия</h2>
            <div className="pp-sim-strip">
              {similar.map(p => (
                <button key={p.id} className="pp-sim" onClick={() => navigate('/product/' + (p.slug || p.id))}>
                  <div className="img" style={{ backgroundImage: `url(${p.images?.[0]?.thumb || p.images?.[0]?.filename || testImg})` }} />
                  <div className="n">{p.name}</div>
                  <div className="p">{p.priceType === 'request' ? 'по запросу' : (p.priceType === 'from' ? 'от ' : '') + fmt(p.price)}</div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className={'pp-bar' + (barShown ? ' show' : '')} aria-hidden={!barShown}>
        <div className="sum">
          <span className="v">{product.priceType === 'request' ? 'По запросу' : (product.priceType === 'from' ? 'от ' : '') + fmt(product.price)}</span>
          <span className="n">{product.name}</span>
        </div>
        <button className={'pp-btn primary' + (added ? ' done' : '')} onClick={order}>
          {added ? 'Добавлено' : product.priceType === 'request' ? 'Запросить' : 'Заказать'}
        </button>
      </div>
    </div>
  );
}

function TopBar({ onBack, count, onCart, crumbs = [], onNav }) {
  return (
    <div className="pp-top">
      <button className="pp-back" onClick={onBack} aria-label="Назад в раздел">
        <Icon d="M15 5l-7 7 7 7" size={18} stroke="#33322e" />
      </button>
      {crumbs.length > 0 && (
        <nav className="pp-crumbs" aria-label="Хлебные крошки">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <span aria-hidden="true">/</span>}
              <button onClick={() => onNav(c.to)}>{c.label}</button>
            </span>
          ))}
        </nav>
      )}
      <button className="pp-cart" onClick={onCart}>
        <Icon d="M6 6h15l-1.5 9h-12zM6 6L5 3H2m7 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" size={16} stroke="#33322e" />
        Корзина
        {count > 0 && <b>{count}</b>}
      </button>
    </div>
  );
}
