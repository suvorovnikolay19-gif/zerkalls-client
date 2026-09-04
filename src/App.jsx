import { useState, useEffect, useMemo, useRef } from 'react';
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
  const [page, setPage] = useState('home');
  const [entry, setEntry] = useState('catalog');
  const [section, setSection] = useState(null);
  const [subsection, setSubsection] = useState(null);
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
  const [selectedCats, setSelectedCats] = useState({});
  const [selectedMats, setSelectedMats] = useState({});
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

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

  const navigateToCatalog = (e = 'catalog') => {
    if (page === 'home') setFromHome(true);
    setEntry(e);
    setPage('catalog');
    setSection(ENTRY_TO_SECTION[e] ?? null);
    setSubsection(null);
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
      setPage('home');
    }, 380);
  };

  useEffect(() => {
    if (page !== 'catalog') return;
    const pill = catalogNavPillRef.current;
    const glavnayaEl = catalogNavItemRefs.current[0];
    const catalogEl = catalogNavItemRefs.current[1];
    if (!pill || !glavnayaEl || !catalogEl) return;
    if (fromHome) {
      pill.style.transition = 'none';
      pill.style.left = glavnayaEl.offsetLeft + 'px';
      pill.style.width = glavnayaEl.offsetWidth + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!pill) return;
        pill.style.transition = 'left .42s cubic-bezier(.22,1,.36,1), width .42s cubic-bezier(.22,1,.36,1)';
        pill.style.left = catalogEl.offsetLeft + 'px';
        pill.style.width = catalogEl.offsetWidth + 'px';
      }));
    } else {
      pill.style.transition = 'none';
      pill.style.left = catalogEl.offsetLeft + 'px';
      pill.style.width = catalogEl.offsetWidth + 'px';
      requestAnimationFrame(() => {
        if (pill) pill.style.transition = 'left .42s cubic-bezier(.22,1,.36,1), width .42s cubic-bezier(.22,1,.36,1)';
      });
    }
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
    return <ProfilePage onGoBack={() => setPage('home')} />;
  }

  if (page === 'checkout') {
    return (
      <CheckoutPage
        onGoHome={() => setPage('home')}
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
          onOpenProfile={() => setPage('profile')}
          onOpenCheckout={() => setPage('checkout')}
          fromCatalog={fromCatalog}
        />
        <CartDrawer onCheckout={() => setPage('checkout')} />
      </>
    );
  }

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: '#fbfaf8', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ animation: fromHome ? 'catalogNavIn .48s cubic-bezier(.22,1,.36,1) forwards' : 'none' }}>
          <nav style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6, padding: '18px 48px', background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e8e8' }}>
            <div ref={catalogNavPillRef} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', height: 44, background: '#1a1a18', borderRadius: 999, pointerEvents: 'none', zIndex: 0 }} />
            {[
              { name: 'Главная', action: goToHome },
              { name: 'Каталог', action: () => navigateToCatalog('catalog') },
              { name: 'О компании' },
              { name: 'Дилерам' },
              { name: 'Портфолио' },
              { name: 'Материалы' },
              { name: 'Дизайнерам' },
              { name: 'Контакты' },
            ].map((n, i) => (
              <span
                key={n.name}
                ref={el => { catalogNavItemRefs.current[i] = el; }}
                onClick={n.action}
                style={{ position: 'relative', zIndex: 1, padding: '11px 22px', borderRadius: 999, fontSize: 17, whiteSpace: 'nowrap', cursor: n.action ? 'pointer' : 'default', color: i === 1 ? '#fff' : '#4a4842', transition: 'color .28s' }}
              >
                {n.name}
              </span>
            ))}
          </nav>
        </div>
      </div>
      <div style={{ animation: fromHome ? 'catalogContentIn .55s .12s cubic-bezier(.22,1,.36,1) both' : 'none' }}>
      <Breadcrumbs
        entry={entry}
        section={section}
        subsection={subsection}
        onGoHome={() => setPage('home')}
        onGoEntry={navigateToCatalog}
        onClearSubsection={() => setSubsection(null)}
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
      <CategoryNav
        section={section}
        subsection={subsection}
        onPickSection={name => { setSection(name); setSubsection(null); }}
        onPickSubsection={name => setSubsection(name)}
      />
      <main style={{ padding: '54px 40px 90px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-.02em' }}>{subsection || section || 'Каталог зеркал и перегородок'}</h2>
          <span style={{ width: 1, height: 18, background: '#dcd8d1', display: 'inline-block' }} />
          <span style={{ fontSize: 14, color: '#8b877f' }}>
            {loading ? 'Загрузка...' : `${filtered.length} ${pluralProducts(filtered.length)}`}
          </span>
        </div>
        <ProductGrid
          products={filtered}
          loading={loading}
          onAddToCart={(p) => { addItem(p); setCartOpen(true); }}
          compareIds={compareItems.map(p => p.id)}
          onToggleCompare={toggleCompare}
        />
      </main>
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
      <CartDrawer onCheckout={() => setPage('checkout')} />
    </div>
  );
}
