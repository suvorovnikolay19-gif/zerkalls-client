import { useState, useEffect, useMemo } from 'react';
import { fetchProducts } from './api.js';
import HeroSection from './components/HeroSection.jsx';
import FilterBar from './components/FilterBar.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import QuizModal from './components/QuizModal.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import Footer from './components/Footer.jsx';

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

function pluralProducts(n) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'товаров';
  const r = n % 10;
  if (r === 1) return 'товар';
  if (r >= 2 && r <= 4) return 'товара';
  return 'товаров';
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [chips, setChips] = useState({ stock: false, premium: false, sale: false, fast: false });
  const [selectedCats, setSelectedCats] = useState({});
  const [selectedMats, setSelectedMats] = useState({});
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    fetchProducts({ limit: 50 })
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: '#fbfaf8', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <HeroSection
        cartCount={cartCount}
        onOpenPanel={() => setPanelOpen(true)}
      />
      <FilterBar
        chips={CHIPS}
        chipStates={chips}
        onToggleChip={toggleChip}
        activeCount={activeCount}
        totalCount={products.length}
        filteredCount={filtered.length}
        onOpenPanel={() => setPanelOpen(true)}
      />
      <main style={{ padding: '54px 40px 90px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-.02em' }}>Каталог зеркал и перегородок</h2>
          <span style={{ width: 1, height: 18, background: '#dcd8d1', display: 'inline-block' }} />
          <span style={{ fontSize: 14, color: '#8b877f' }}>
            {loading ? 'Загрузка...' : `${filtered.length} ${pluralProducts(filtered.length)}`}
          </span>
        </div>
        <ProductGrid products={filtered} loading={loading} onAddToCart={() => setCartCount(c => c + 1)} />
      </main>
      <Footer />
      {panelOpen && (
        <FilterPanel
          cats={CATS}
          selectedCats={selectedCats}
          materials={MATERIALS}
          selectedMats={selectedMats}
          chips={CHIPS}
          chipStates={chips}
          priceMin={priceMin}
          priceMax={priceMax}
          filteredCount={filtered.length}
          activeCount={activeCount}
          onToggleCat={toggleCat}
          onToggleMat={toggleMat}
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
    </div>
  );
}
