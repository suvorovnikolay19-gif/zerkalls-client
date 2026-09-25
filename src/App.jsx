import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toSlug, nameFromSlug } from './utils/slug.js';
import { SECTIONS, SUBCATS, TREE } from './components/CategoryNav.jsx';
import { ITEMS as CAT_ITEMS, CAT_TREE } from './components/CategoryPage.jsx';
import { fetchProducts } from './api.js';
import { useCart } from './CartContext.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import HeroSection from './components/HeroSection.jsx';
import FilterBar from './components/FilterBar.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import QuizModal from './components/QuizModal.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import CompareModal from './components/CompareModal.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import CategoryPage from './components/CategoryPage.jsx';
import { MOCK_PRODUCTS } from './mock/products.js';

const CHIPS = [
  { key: 'stock', label: 'В наличии' },
  { key: 'premium', label: 'Премиум' },
  { key: 'sale', label: 'Со скидкой' },
  { key: 'fast', label: 'Доставка за 2 дня' },
];

const CATS = [
  { name: 'Лофт перегородки' }, { name: 'С декоративной плёнкой' }, { name: 'Металлические' },
  { name: 'Реечные' }, { name: 'С рифлёным стеклом' }, { name: 'С матовым стеклом' },
  { name: 'Дизайнерские', hot: true }, { name: 'Распашные', hot: true },
  { name: 'Раздвижные', hot: true }, { name: 'Стационарные', hot: true },
  { name: 'Гармошка', hot: true }, { name: 'Декоративные', hot: true },
  { name: 'С тонированным стеклом' },
];

const MATERIALS = ['Дуб', 'Латунь', 'Сталь', 'Стекло', 'Ротанг', 'Бетон'];

const ENTRY_TO_SECTION = {
  mirrors: 'Зеркала',
  partitions: 'Перегородки',
  stairs: 'Лестницы',
};

function pluralProducts(n) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'товаров';
  const r = n % 10;
  if (r === 1) return 'товар';
  if (r >= 2 && r <= 4) return 'товара';
  return 'товаров';
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const page = useMemo(() => {
    const p = location.pathname;
    if (p === '/') return 'home';
    if (p === '/profile') return 'profile';
    if (p === '/checkout') return 'checkout';
    if (p.startsWith('/catalog')) return 'catalog';
    return 'home';
  }, [location.pathname]);

  const [entry, setEntry] = useState('catalog');
  const [section, setSection] = useState(null);
  const [subsection, setSubsection] = useState(null);
  const [subsubsection, setSubsubsection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [compareItems, setCompareItems] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const { totalCount, setIsOpen: setCartOpen, addItem } = useCart();
  const [fromHome, setFromHome] = useState(false);
  const [fromCatalog, setFromCatalog] = useState(false);
  const catalogNavPillRef = useRef(null);
  const catalogNavItemRefs = useRef([]);
  const [chips, setChips] = useState({ stock: false, premium: false, sale: false, fast: false });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCats, setSelectedCats] = useState({});
  const [selectedMats, setSelectedMats] = useState({});
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Яндекс Метрика: фиксируем каждый переход в SPA
  useEffect(() => {
    if (typeof window.ym === 'function') {
      window.ym(113052467, 'hit', window.location.href);
    }
  }, [location.pathname]);

  // Sync URL → state (browser back/forward)
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'catalog') return;
    const secSlug = parts[1];
    if (!secSlug) { setSection(null); setSubsection(null); setSubsubsection(null); return; }
    const secName = nameFromSlug(secSlug, SECTIONS.map(s => s.name));
    if (!secName) return;
    setSection(secName);
    const e = Object.keys(ENTRY_TO_SECTION).find(k => ENTRY_TO_SECTION[k] === secName) || 'catalog';
    setEntry(e);
    const subSlug = parts[2];
    if (!subSlug) { setSubsection(null); setSubsubsection(null); return; }
    const allSubs = [...(CAT_ITEMS[secName] || []).map(i => i.name), ...(SUBCATS[secName] || [])];
    const subName = nameFromSlug(subSlug, allSubs) || subSlug;
    setSubsection(subName);
    const leafSlug = parts[3];
    if (!leafSlug) { setSubsubsection(null); return; }
    const allLeaves = [...(CAT_TREE[secName]?.[subName] || []), ...(TREE[secName]?.[subName] || [])];
    setSubsubsection(nameFromSlug(leafSlug, allLeaves) || leafSlug);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts({ limit: 50 })
      .then(data => {
        const list = data.products || [];
        setProducts(list.length > 0 ? list : MOCK_PRODUCTS);
      })
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const has = prev.some(p => p.id === product.id);
      if (has) return prev.filter(p => p.id !== product.id);
      const next = prev.length >= 2 ? [prev[1], product] : [...prev, product];
      if (next.length === 2) setCompareOpen(true);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const min = parseFloat(priceMin);
      const max = parseFloat(priceMax);
      if (!isNaN(min) && p.price < min) return false;
      if (!isNaN(max) && p.price > max) return false;

      const activeMats = Object.keys(selectedMats).filter(k => selectedMats[k]);
      if (activeMats.length > 0) {
        const charVals = (p.characteristics || []).flatMap(c => [c.name, c.value].map(s => s.toLowerCase()));
        if (!activeMats.some(m => charVals.some(v => v.includes(m.toLowerCase())))) return false;
      }

      return true;
    });
  }, [products, priceMin, priceMax, selectedMats]);

  const activeCount =
    Object.values(chips).filter(Boolean).length +
    Object.values(selectedCats).filter(Boolean).length +
    Object.values(selectedMats).filter(Boolean).length +
    (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  const toggleChip = key => setChips(c => ({ ...c, [key]: !c[key] }));
  const toggleCat = name => setSelectedCats(c => ({ ...c, [name]: !c[name] }));
  const toggleMat = name => setSelectedMats(c => ({ ...c, [name]: !c[name] }));
  const resetAll = () => {
    setChips({ stock: false, premium: false, sale: false, fast: false });
    setSelectedCats({});
    setSelectedMats({});
    setPriceMin('');
    setPriceMax('');
  };

  const navigateToCatalog = (e = 'catalog', sub = null) => {
    if (page === 'home') setFromHome(true);
    const secName = ENTRY_TO_SECTION[e] ?? null;
    setEntry(e);
    setSection(secName);
    setSubsection(sub);
    setSubsubsection(null);
    window.scrollTo(0, 0);
    if (secName) {
      navigate(`/catalog/${toSlug(secName)}${sub ? '/' + toSlug(sub) : ''}`);
    } else {
      navigate('/catalog');
    }
  };

  useEffect(() => {
    if (!fromHome) return;
    const t = setTimeout(() => setFromHome(false), 700);
    return () => clearTimeout(t);
  }, [fromHome]);

  useEffect(() => {
    if (!fromCatalog) return;
    const t = setTimeout(() => setFromCatalog(false), 700);
    return () => clearTimeout(t);
  }, [fromCatalog]);

  const goToHome = () => {
    const pill = catalogNavPillRef.current;
    const glavnayaEl = catalogNavItemRefs.current[0];
    if (pill && glavnayaEl) {
      pill.style.left = glavnayaEl.offsetLeft + 'px';
      pill.style.width = glavnayaEl.offsetWidth + 'px';
    }
    setTimeout(() => {
      setFromCatalog(true);
      navigate('/');
    }, 380);
  };

  useEffect(() => {
    if (page !== 'catalog') return;
    const pill = catalogNavPillRef.current;
    if (pill) pill.style.width = '0';
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const applied = [
    ...CHIPS.filter(c => chips[c.key]).map(c => ({ label: c.label, remove: () => toggleChip(c.key) })),
    ...Object.keys(selectedCats).filter(k => selectedCats[k]).map(k => {
      const label = k.includes('|') ? k.split('|').pop() : k;
      return { label, remove: () => toggleCat(k) };
    }),
    ...Object.keys(selectedMats).filter(k => selectedMats[k]).map(k => ({ label: 'Материал: ' + k, remove: () => toggleMat(k) })),
    ...(priceMin ? [{ label: 'от ' + priceMin + ' ₽', remove: () => setPriceMin('') }] : []),
    ...(priceMax ? [{ label: 'до ' + priceMax + ' ₽', remove: () => setPriceMax('') }] : []),
  ];

  if (page === 'profile') {
    return <ProfilePage onGoBack={() => navigate('/')} />;
  }

  if (page === 'checkout') {
    return (
      <CheckoutPage
        onGoHome={() => navigate('/')}
        onGoStore={() => navigateToCatalog('catalog')}
        cartCount={totalCount}
      />
    );
  }

  if (page === 'home') {
    return (
      <>
        <HomePage
          onNavigateToCatalog={navigateToCatalog}
          cartCount={totalCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenProfile={() => navigate('/profile')}
          onOpenCheckout={() => navigate('/checkout')}
          fromCatalog={fromCatalog}
          onOpenPanel={() => setPanelOpen(true)}
          onOpenQuiz={() => setQuizOpen(true)}
        />
        {panelOpen && (
          <FilterPanel
            selectedCats={selectedCats}
            chips={CHIPS}
            chipStates={chips}
            priceMin={priceMin}
            priceMax={priceMax}
            filteredCount={products.length}
            activeCount={activeCount}
            onToggleCat={toggleCat}
            onToggleChip={toggleChip}
            onPriceMin={setPriceMin}
            onPriceMax={setPriceMax}
            onReset={resetAll}
            onClose={() => setPanelOpen(false)}
            onOpenQuiz={() => { setPanelOpen(false); setQuizOpen(true); }}
            onNavigate={(entry) => { setPanelOpen(false); navigateToCatalog(entry); }}
          />
        )}
        {quizOpen && (
          <QuizModal products={products} onClose={() => setQuizOpen(false)} />
        )}
        <CartDrawer onCheckout={() => navigate('/checkout')} />
      </>
    );
  }

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: '#fbfaf8', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ animation: fromHome ? 'catalogContentIn .55s .12s cubic-bezier(.22,1,.36,1) both' : 'none' }}>
      <Breadcrumbs
        entry={entry}
        section={section}
        subsection={subsection}
        subsubsection={subsubsection}
        onGoHome={goToHome}
        onGoEntry={navigateToCatalog}
        onClearSubsection={() => { setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(section)}`); }}
        onClearSubsubsection={() => { setSubsubsection(null); navigate(`/catalog/${toSlug(section)}/${toSlug(subsection)}`); }}
        onPickSection={name => { const e = Object.keys(ENTRY_TO_SECTION).find(k => ENTRY_TO_SECTION[k] === name) || 'catalog'; setEntry(e); setSection(name); setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(name)}`); }}
        onPickSubsection={name => { setSubsection(name); setSubsubsection(null); navigate(`/catalog/${toSlug(section)}/${toSlug(name)}`); }}
        onPickLeaf={name => { setSubsubsection(name); navigate(`/catalog/${toSlug(section)}/${toSlug(subsection)}/${toSlug(name)}`); }}
      />
      <FilterBar
        chips={CHIPS}
        chipStates={chips}
        onToggleChip={toggleChip}
        activeCount={activeCount}
        totalCount={products.length}
        filteredCount={filtered.length}
        onOpenPanel={() => setPanelOpen(true)}
        applied={applied}
        onReset={resetAll}
        compareCount={compareItems.length}
        onOpenCompare={() => setCompareOpen(true)}
      />
      {/* CategoryNav: топ-уровень (без секции) или чипы (с подсекцией) */}
      {(!section || subsection) && (
        <CategoryNav
          section={section}
          subsection={subsection}
          subsubsection={subsubsection}
          onPickSection={name => { setSection(name); setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(name)}`); }}
          onPickSubsection={name => { setSubsection(name); setSubsubsection(null); navigate(`/catalog/${toSlug(section)}/${toSlug(name)}`); }}
          onPickLeaf={name => { setSubsubsection(name); navigate(`/catalog/${toSlug(section)}/${toSlug(subsection)}/${toSlug(name)}`); }}
          onOpenPanel={() => setPanelOpen(true)}
        />
      )}

      {/* Уровень 1 — выбрана секция, но не подсекция: показываем CategoryPage */}
      {section && !subsection ? (
        <CategoryPage
          section={section}
          onPickSubsection={name => { setSubsection(name); setSubsubsection(null); navigate(`/catalog/${toSlug(section)}/${toSlug(name)}`); }}
          onPickSection={name => { setSection(name); setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(name)}`); }}
        />
      ) : (
        <main style={{ padding: '54px 40px 90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-.02em' }}>{subsubsection || subsection || section || 'Каталог зеркал и перегородок'}</h2>
            <span style={{ width: 1, height: 18, background: '#dcd8d1', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: '#8b877f' }}>
              {loading ? 'Загрузка...' : `${filtered.length} ${pluralProducts(filtered.length)}`}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2, padding: 4, background: '#fff', border: '1px solid #ece9e4', borderRadius: 999, boxShadow: '0 1px 3px rgba(26,26,24,.06)', flexShrink: 0 }}>
              {[
                { key: 'list', label: 'Список' },
                { key: 'grid', label: 'Сетка' },
                { key: 'large', label: 'Крупно' },
              ].map(m => {
                const on = viewMode === m.key;
                const c = on ? '#1a1a18' : '#8b877f';
                let icon = null;
                if (m.key === 'list') icon = (
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                    {[15, 10, 13].map((w, i) => <span key={i} style={{ display: 'block', height: 2, width: w, background: c, borderRadius: 1 }} />)}
                  </span>
                );
                if (m.key === 'grid') icon = (
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: 12, flexShrink: 0 }}>
                    {[0,1,2,3].map(i => <span key={i} style={{ display: 'block', width: 5, height: 5, background: c, borderRadius: 1 }} />)}
                  </span>
                );
                if (m.key === 'large') icon = (
                  <span style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                    {[0,1].map(i => <span key={i} style={{ display: 'block', width: 6, height: 12, background: c, borderRadius: 2 }} />)}
                  </span>
                );
                return (
                  <button
                    key={m.key}
                    onClick={() => setViewMode(m.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '6px 13px', border: 'none', cursor: 'pointer',
                      borderRadius: 999, background: on ? '#f0ece5' : 'transparent',
                      color: on ? '#1a1a18' : '#8b877f',
                      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                      transition: 'background .15s, color .15s',
                    }}
                  >
                    {icon}
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
          <ProductGrid
            products={filtered}
            loading={loading}
            viewMode={viewMode}
            onAddToCart={(p) => { addItem(p); setCartOpen(true); }}
            compareIds={compareItems.map(p => p.id)}
            onToggleCompare={toggleCompare}
          />
        </main>
      )}
      <Footer />
      </div>
      {panelOpen && (
        <FilterPanel
          selectedCats={selectedCats}
          chips={CHIPS}
          chipStates={chips}
          priceMin={priceMin}
          priceMax={priceMax}
          filteredCount={filtered.length}
          activeCount={activeCount}
          onToggleCat={toggleCat}
          onToggleChip={toggleChip}
          onPriceMin={setPriceMin}
          onPriceMax={setPriceMax}
          onReset={resetAll}
          onClose={() => setPanelOpen(false)}
          onOpenQuiz={() => { setPanelOpen(false); setQuizOpen(true); }}
          onNavigate={(entry) => { setPanelOpen(false); navigateToCatalog(entry); }}
        />
      )}
      {quizOpen && (
        <QuizModal products={products} onClose={() => setQuizOpen(false)} />
      )}
      {compareOpen && (
        <CompareModal
          items={compareItems}
          onClose={() => setCompareOpen(false)}
          onRemove={id => setCompareItems(prev => prev.filter(p => p.id !== id))}
          onClear={() => { setCompareItems([]); setCompareOpen(false); }}
        />
      )}
      <CartDrawer onCheckout={() => navigate('/checkout')} />
    </div>
  );
}
