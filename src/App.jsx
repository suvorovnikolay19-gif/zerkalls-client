import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toSlug, nameFromSlug } from './utils/slug.js';
import { SECTIONS, SUBCATS, TREE, ITEMS as CAT_ITEMS, CAT_TREE } from './data/catalog.js';
import { fetchProducts, fetchAllCategories } from './api.js';
import { useCart } from './CartContext.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import { MOCK_PRODUCTS } from './mock/products.js';

// Всё, что не нужно на первом экране, грузится отдельными чанками.
// До этого один бандл тянул главную, каталог, чекаут, профиль, квиз и
// сравнение разом — пользователь главной качал код оформления заказа.
const HomePage     = lazy(() => import('./pages/HomePage.jsx'));
const HomeMobile   = lazy(() => import('./pages/HomeMobile.jsx'));
const ProfilePage  = lazy(() => import('./pages/ProfilePage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const ProductPage  = lazy(() => import('./pages/ProductPage.jsx'));
const CategoryPage = lazy(() => import('./components/CategoryPage.jsx'));
const CategoryNav  = lazy(() => import('./components/CategoryNav.jsx'));
const Breadcrumbs  = lazy(() => import('./components/Breadcrumbs.jsx'));
const FilterBar    = lazy(() => import('./components/FilterBar.jsx'));
const ProductGrid  = lazy(() => import('./components/ProductGrid.jsx'));
const FilterPanel  = lazy(() => import('./components/FilterPanel.jsx'));
const QuizModal    = lazy(() => import('./components/QuizModal.jsx'));
const CompareModal = lazy(() => import('./components/CompareModal.jsx'));

// Пустая заглушка нужного цвета — чтобы на месте чанка не мигал белый прямоугольник
const PageFallback = () => <div style={{ minHeight: '100vh', background: '#fbfaf8' }} />;

const CHIPS = [
  { key: 'stock', label: 'В наличии' },
  { key: 'premium', label: 'Премиум' },
  { key: 'sale', label: 'Со скидкой' },
  { key: 'fast', label: 'Доставка за 2 дня' },
];

const ENTRY_TO_SECTION = {
  mirrors: 'Зеркала',
  partitions: 'Перегородки',
  stairs: 'Лестницы',
};

// Главная на телефоне — отдельный компонент; граница совпадает с mobile.css
function useIsMobile() {
  const get = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const [m, setM] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = e => setM(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

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
  const isMobile = useIsMobile();

  const page = useMemo(() => {
    const p = location.pathname;
    if (p === '/') return 'home';
    if (p === '/profile') return 'profile';
    if (p === '/checkout') return 'checkout';
    if (p.startsWith('/product/')) return 'product';
    if (p.startsWith('/catalog')) return 'catalog';
    return 'home';
  }, [location.pathname]);

  const [entry, setEntry] = useState('catalog');
  const [section, setSection] = useState(null);
  const [subsection, setSubsection] = useState(null);
  const [subsubsection, setSubsubsection] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
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

  useEffect(() => {
    fetchAllCategories({ limit: 500 }).then(setAllCategories).catch(() => {});
  }, []);

  // Узел дерева категорий из базы по имени (или slug) внутри родителя
  const findCat = (name, parentId = null) => {
    if (!name) return null;
    const slug = toSlug(name);
    return allCategories.find(c => (c.parent ?? null) === parentId && (c.name === name || c.slug === slug || toSlug(c.name) === slug)) || null;
  };
  const childrenOf = (parentId) => allCategories.filter(c => c.parent === parentId);

  // Текущий выбранный узел (самый глубокий из разобранных) и все его потомки
  const sectionCat = findCat(section);
  const subCat = sectionCat ? findCat(subsection, sectionCat.id) : null;
  const leafCat = subCat ? findCat(subsubsection, subCat.id) : null;
  const currentCat = leafCat || subCat || sectionCat;
  const currentCatIds = useMemo(() => {
    if (!currentCat) return null;
    const ids = new Set([currentCat.id]);
    let frontier = [currentCat.id];
    while (frontier.length) {
      const next = allCategories.filter(c => frontier.includes(c.parent)).map(c => c.id);
      next.forEach(id => ids.add(id));
      frontier = next;
    }
    return ids;
  }, [currentCat?.id, allCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync URL → state (browser back/forward)
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'catalog') return;
    const secSlug = parts[1];
    if (!secSlug) { setSection(null); setSubsection(null); setSubsubsection(null); return; }
    const dbRoots = allCategories.filter(c => !c.parent).map(c => c.name);
    const secName = nameFromSlug(secSlug, [...SECTIONS.map(s => s.name), ...dbRoots]);
    if (!secName) return;
    const dbSec = allCategories.find(c => !c.parent && c.name === secName);
    setSection(secName);
    const e = Object.keys(ENTRY_TO_SECTION).find(k => ENTRY_TO_SECTION[k] === secName) || 'catalog';
    setEntry(e);
    const subSlug = parts[2];
    if (!subSlug) { setSubsection(null); setSubsubsection(null); return; }
    const dbSubs = dbSec ? allCategories.filter(c => c.parent === dbSec.id) : [];
    const allSubs = [...dbSubs.map(c => c.name), ...(CAT_ITEMS[secName] || []).map(i => i.name), ...(SUBCATS[secName] || [])];
    const subName = nameFromSlug(subSlug, allSubs) || dbSubs.find(c => c.slug === subSlug)?.name || subSlug;
    setSubsection(subName);
    const leafSlug = parts[3];
    if (!leafSlug) { setSubsubsection(null); return; }
    const dbSub = dbSubs.find(c => c.name === subName);
    const dbLeaves = dbSub ? allCategories.filter(c => c.parent === dbSub.id) : [];
    const allLeaves = [...dbLeaves.map(c => c.name), ...(CAT_TREE[secName]?.[subName] || []), ...(TREE[secName]?.[subName] || [])];
    setSubsubsection(nameFromSlug(leafSlug, allLeaves) || dbLeaves.find(c => c.slug === leafSlug)?.name || leafSlug);
  }, [location.pathname, allCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts({ limit: 100 })
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
      // Выбран раздел — показываем только товары его категории и всех вложенных.
      // Раздел есть, но в базе не найден — показывать нечего.
      if (section) {
        if (!currentCatIds) return false;
        if (!p.category || !currentCatIds.has(p.category.id)) return false;
      }
      const min = parseFloat(priceMin);
      const max = parseFloat(priceMax);
      if (!isNaN(min) && p.price < min) return false;
      if (!isNaN(max) && p.price > max) return false;

      const activeMats = Object.keys(selectedMats).filter(k => selectedMats[k]);
      if (activeMats.length > 0) {
        const charVals = [
          ...(p.characteristics || []).flatMap(c => [c.name, c.value].map(s => String(s).toLowerCase())),
          ...(p.tags || []).map(t => t.name.toLowerCase()),
        ];
        if (!activeMats.some(m => charVals.some(v => v.includes(m.toLowerCase())))) return false;
      }

      return true;
    });
  }, [products, priceMin, priceMax, selectedMats, section, currentCatIds]);

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

  // На уровне 2 показываем выбор 3-го уровня, если в базе у подкатегории есть вложенные
  const showLevel3Picker = !!(section && subsection && !subsubsection && subCat && childrenOf(subCat.id).length > 0);

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
    return (
      <Suspense fallback={<PageFallback />}>
        <ProfilePage onGoBack={() => navigate('/')} />
      </Suspense>
    );
  }

  if (page === 'product') {
    const slug = decodeURIComponent(location.pathname.split('/')[2] || '');
    return (
      <>
        <Suspense fallback={<PageFallback />}>
          <ProductPage
            slug={slug}
            onAddToCart={(p) => { addItem(p); setCartOpen(true); }}
            compareIds={compareItems.map(p => p.id)}
            onToggleCompare={toggleCompare}
          />
        </Suspense>
        <Suspense fallback={null}>
          {compareOpen && (
            <CompareModal
              items={compareItems}
              onClose={() => setCompareOpen(false)}
              onRemove={id => setCompareItems(prev => prev.filter(p => p.id !== id))}
              onClear={() => { setCompareItems([]); setCompareOpen(false); }}
            />
          )}
        </Suspense>
        <CartDrawer onCheckout={() => navigate('/checkout')} />
      </>
    );
  }

  if (page === 'checkout') {
    return (
      <Suspense fallback={<PageFallback />}>
        <CheckoutPage
          onGoHome={() => navigate('/')}
          onGoStore={() => navigateToCatalog('catalog')}
          cartCount={totalCount}
        />
      </Suspense>
    );
  }

  if (page === 'home') {
    return (
      <>
        <Suspense fallback={<PageFallback />}>
        {isMobile ? (
          <HomeMobile
            onNavigateToCatalog={navigateToCatalog}
            cartCount={totalCount}
            onOpenCart={() => setCartOpen(true)}
            onOpenPanel={() => setPanelOpen(true)}
            onOpenQuiz={() => setQuizOpen(true)}
          />
        ) : (
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
        )}
        </Suspense>
        <Suspense fallback={null}>
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
        </Suspense>
        <CartDrawer onCheckout={() => navigate('/checkout')} />
      </>
    );
  }

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: '#fbfaf8', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ animation: fromHome ? 'catalogContentIn .55s .12s cubic-bezier(.22,1,.36,1) both' : 'none' }}>
      <Suspense fallback={<PageFallback />}>
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
        onPickLeaf={name => { setSubsubsection(name); navigate(name ? `/catalog/${toSlug(section)}/${toSlug(subsection)}/${toSlug(name)}` : `/catalog/${toSlug(section)}/${toSlug(subsection)}`); }}
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
      {/* CategoryNav: топ-уровень (без секции) или чипы, когда уже показываем товары */}
      {(!section || (subsection && !showLevel3Picker)) && (
        <CategoryNav
          section={section}
          subsection={subsection}
          subsubsection={subsubsection}
          onPickSection={name => { setSection(name); setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(name)}`); }}
          onPickSubsection={name => { setSubsection(name); setSubsubsection(null); navigate(`/catalog/${toSlug(section)}/${toSlug(name)}`); }}
          onPickLeaf={name => { setSubsubsection(name); navigate(name ? `/catalog/${toSlug(section)}/${toSlug(subsection)}/${toSlug(name)}` : `/catalog/${toSlug(section)}/${toSlug(subsection)}`); }}
          onOpenPanel={() => setPanelOpen(true)}
        />
      )}

      {/* Уровень 1 — выбрана секция, но не подсекция: страница выбора подкатегорий.
          Уровень 2 — у подкатегории есть вложенные: страница выбора 3-го уровня. Иначе товары. */}
      {section && !subsection ? (
        <CategoryPage
          section={section}
          products={products}
          onPickSubsection={name => { setSubsection(name); setSubsubsection(null); navigate(`/catalog/${toSlug(section)}/${toSlug(name)}`); }}
          onPickSection={name => { setSection(name); setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(name)}`); }}
        />
      ) : showLevel3Picker ? (
        <CategoryPage
          section={section}
          subsection={subsection}
          products={products}
          onPickSubsection={name => { setSubsubsection(name); navigate(`/catalog/${toSlug(section)}/${toSlug(subsection)}/${toSlug(name)}`); }}
          onPickSection={name => { setSection(name); setSubsection(null); setSubsubsection(null); navigate(`/catalog/${toSlug(name)}`); }}
        />
      ) : (
        <main className="catalog-main">
          <div className="catalog-head" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
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
                    <span className="view-lbl">{m.label}</span>
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
            onOpen={(p) => navigate('/product/' + encodeURIComponent(p.slug || p.id))}
            compareIds={compareItems.map(p => p.id)}
            onToggleCompare={toggleCompare}
          />
        </main>
      )}
      <Footer />
      </Suspense>
      </div>
      <Suspense fallback={null}>
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
      </Suspense>
      <CartDrawer onCheckout={() => navigate('/checkout')} />
    </div>
  );
}
