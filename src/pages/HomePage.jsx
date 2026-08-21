import { useState, useEffect } from 'react';

const SLIDES = [
  { title: 'МЕТР²', text: 'Винтовая лестница, умещающаяся на одном квадратном метре. Компактное решение для маленьких пространств.', cta: 'Лестницы', entry: 'stairs' },
  { title: 'СВЕТ', text: 'Перегородки с рифлёным стеклом — делят пространство, но не забирают дневной свет.', cta: 'Перегородки', entry: 'partitions' },
  { title: 'ОТРАЖЕНИЕ', text: 'Зеркала нестандартной формы по вашим размерам. Гнутое стекло, латунь, ручная сборка.', cta: 'Зеркала', entry: 'mirrors' },
];

const CATEGORIES = [
  { name: 'Лестницы', text: 'Винтовые, маршевые и модульные — под высоту вашего проёма.', tags: ['Дуб', 'Сталь', 'Винтовые', 'Модульные'], bg: 'linear-gradient(160deg, #3a3e40 0%, #2a2926 100%)', entry: 'stairs' },
  { name: 'Перегородки', text: 'Раздвижные, распашные, стационарные. Рифлёное и матовое стекло.', tags: ['Лофт', 'Реечные', 'Раздвижные', 'Стекло'], bg: 'linear-gradient(160deg, #4a3a2c 0%, #2a2926 100%)', entry: 'partitions' },
  { name: 'Зеркала', text: 'Арочные, овальные и нестандартные формы по вашим размерам.', tags: ['Латунь', 'Арка', 'Овал', 'Под заказ'], bg: 'linear-gradient(160deg, #2e3642 0%, #2a2926 100%)', entry: 'mirrors' },
];

const BESTSELLERS = [
  { title: 'Перегородка Loft Black', price: 'от 78 000 ₽', meta: 'Сталь, рифлёное стекло', badge: 'Хит продаж', hot: true, rating: '4,9' },
  { title: 'Лестница Метр², дуб', price: 'от 164 000 ₽', meta: 'Винтовая, 1 м²', badge: 'Выбор дизайнеров', hot: true, rating: '5,0' },
  { title: 'Зеркало Arch, арочное', price: 'от 44 900 ₽', meta: 'Дуб, 900×1800 мм', badge: 'Топ рейтинга', rating: '4,8' },
  { title: 'Перегородка Reed, реечная', price: 'от 92 000 ₽', meta: 'Дуб, 3 секции', badge: 'Хит продаж', hot: true, rating: '4,9' },
  { title: 'Зеркало Arco, овальное', price: 'от 38 400 ₽', meta: 'Латунь, ручная сборка', badge: 'Топ рейтинга', rating: '4,7' },
  { title: 'Ширма Fold, гармошка', price: 'от 67 200 ₽', meta: 'Ротанг, 4 створки', badge: 'Часто берут', rating: '4,8' },
  { title: 'Лестница Helix, сталь', price: 'от 218 000 ₽', meta: 'Сталь + стекло, 1.2 м²', badge: 'Новинка', hot: true, rating: '5,0' },
  { title: 'Зеркало Frame, латунь', price: 'от 29 800 ₽', meta: 'Латунь, 600×900 мм', badge: 'Топ рейтинга', rating: '4,9' },
];

const NOVELTIES = [
  { title: 'Зеркало Arco, овальное', price: '38 400 ₽', badge: 'Хит продаж', hot: true, colors: ['#c9a227', '#1a1a18', '#e6e2dc', '#8a6a3b'] },
  { title: 'Перегородка Grid, 3 секции', price: '96 000 ₽', badge: 'Топ рейтинга', colors: ['#1a1a18', '#8c857b', '#dcd8d1'] },
  { title: 'Ширма Reed, дуб', price: '54 000 ₽', badge: 'Лучшая цена', colors: ['#b58150', '#e6d3ba', '#4a4842'] },
  { title: 'Зеркало Nube, гнутое', price: '61 500 ₽', badge: 'Новинка', hot: true, colors: ['#c9a227', '#f0ede8'] },
  { title: 'Перегородка Loft, чёрная', price: '78 000 ₽', badge: 'Топ рейтинга', colors: ['#1a1a18', '#6b6862', '#a8a39a'] },
  { title: 'Зеркало Arch, арочное', price: '44 900 ₽', badge: 'Хит продаж', hot: true, colors: ['#8a6a3b', '#e6e2dc', '#1a1a18', '#4f6b52'] },
  { title: 'Ширма Slide, бамбук', price: '42 000 ₽', badge: 'Новинка', hot: true, colors: ['#c8b89a', '#6b5a3a', '#f0ede8'] },
  { title: 'Перегородка Mesh, сетка', price: '88 500 ₽', badge: 'Часто берут', colors: ['#4a4842', '#dcd8d1', '#1a1a18'] },
];

const STATS = [
  { value: '12+', label: 'лет на рынке', text: 'Своё производство в Домодедово с 2014 года — без посредников и перепродаж.' },
  { value: '9 400', label: 'проектов сдано', text: 'Квартиры, дома, отели и офисы по всей России.' },
  { value: '5 лет', label: 'гарантии', text: 'На конструкцию, фурнитуру и монтаж. Сервис — свой.' },
  { value: '99%', label: 'довольны', text: 'По опросу клиентов после установки за последний год.' },
];

const COLLECTIONS = [
  { name: 'Для гостиной', count: '48 товаров', span: 'grid-column: span 2; grid-row: span 2', bg: '#3a3228' },
  { name: 'Для спальни', count: '31 товар', span: 'grid-column: span 2', bg: '#2e3638' },
  { name: 'Для кухни', count: '26 товаров', span: '', bg: '#3a2e28' },
  { name: 'Для кабинета', count: '19 товаров', span: '', bg: '#282e3a' },
  { name: 'Для прихожей', count: '22 товара', span: 'grid-column: span 2', bg: '#2e3028' },
  { name: 'Для ванной', count: '14 товаров', span: 'grid-column: span 2', bg: '#283038' },
];

const FAQ = [
  { q: 'Какие сроки доставки в моём городе?', a: 'По Москве и области — 2–4 дня, по России — 5–12 дней транспортной компанией. Точный срок называем при оформлении.' },
  { q: 'Можно ли сделать изделие по своим размерам?', a: 'Да, это основной формат работы: присылаете размеры проёма или фото, конструктор готовит чертёж и смету за один день.' },
  { q: 'Как вернуть или обменять товар?', a: 'Серийные позиции — 14 дней без объяснения причин. Изделия по индивидуальным размерам возврату не подлежат, кроме случаев брака.' },
  { q: 'Какие способы оплаты вы принимаете?', a: 'Карта, СБП, счёт для юрлиц и рассрочка на 6–12 месяцев без процентов.' },
  { q: 'Нужна ли сборка и сколько она стоит?', a: 'Монтаж выполняет наша бригада. Для перегородок и лестниц он включён в стоимость, для зеркал — 3 500 ₽.' },
  { q: 'Как отследить статус заказа?', a: 'После оплаты приходит ссылка на личный кабинет со статусами: производство, контроль, отгрузка, доставка.' },
  { q: 'Есть ли шоурум?', a: 'Да, в Домодедово при производстве — можно потрогать материалы и увидеть готовые изделия. Запись по телефону.' },
  { q: 'Работаете ли вы с дизайнерами?', a: 'Да, есть партнёрская программа с агентским вознаграждением и техподдержкой на всех этапах проекта.' },
  { q: 'Сколько ждать изделие по индивидуальным размерам?', a: 'Производство занимает 10–18 рабочих дней в зависимости от сложности и загрузки цеха. Срок фиксируем в договоре.' },
  { q: 'Можно ли заказать только стекло или фурнитуру?', a: 'Да, комплектующие продаём отдельно: профили, направляющие, доводчики, ручки и полотна нужного размера.' },
  { q: 'Есть ли рассрочка?', a: 'Есть рассрочка на 6 и 12 месяцев без процентов и переплаты — оформляется онлайн за пару минут.' },
  { q: 'Что с безопасностью стекла?', a: 'Используем закалённое стекло 8–10 мм или триплекс. При ударе оно не даёт травмоопасных осколков.' },
];

const FOOTER_COLS = [
  { title: 'Информация', links: ['О компании', 'Дизайнерам', 'Дилерам', 'Контакты'] },
  { title: 'Каталог', links: ['Лестницы', 'Зеркала', 'Перегородки', 'Ширмы', 'Комплектующие'] },
  { title: 'Помощь', links: ['Гарантия', 'Доставка и монтаж', 'Возврат', 'Карта сайта'] },
];

function pad(n) { return (n < 10 ? '0' : '') + n; }

export default function HomePage({ onNavigateToCatalog, cartCount }) {
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [left, setLeft] = useState(4 * 86400 + 14 * 3600 + 48 * 60 + 18);
  const [chatOpen, setChatOpen] = useState(false);
  const accent = '#c9a227';

  useEffect(() => {
    const timer = setInterval(() => setLeft(t => t > 0 ? t - 1 : 0), 1000);
    const auto = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 7000);
    return () => { clearInterval(timer); clearInterval(auto); };
  }, []);

  const countdown = [
    { value: pad(Math.floor(left / 86400)), label: 'дней' },
    { value: pad(Math.floor(left / 3600) % 24), label: 'часов' },
    { value: pad(Math.floor(left / 60) % 60), label: 'минут' },
    { value: pad(left % 60), label: 'секунд' },
  ];

  const currentSlide = SLIDES[slide];

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: '#fbfaf8', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: 760, background: '#23221f' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, #2e2c28 0, #2e2c28 20px, #252320 20px, #252320 40px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.55) 0%, rgba(20,19,17,.18) 40%, rgba(20,19,17,.6) 100%)', pointerEvents: 'none' }} />

        <header style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', gap: 34, padding: '24px 48px', color: '#fff' }}>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.02em' }}>objects</div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 13, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            <span style={{ color: '#e8dfae', cursor: 'default' }}>Главная</span>
            <span onClick={onNavigateToCatalog} style={{ cursor: 'pointer', opacity: .85, transition: 'opacity .15s' }}>Каталог</span>
            <a href="#collections" style={{ color: 'inherit', textDecoration: 'none', opacity: .85 }}>Подборки</a>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none', opacity: .85 }}>Доставка</a>
            <a href="#footer" style={{ color: 'inherit', textDecoration: 'none', opacity: .85 }}>Контакты</a>
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 26 }}>
            <a href="tel:+79854341133" style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em', color: '#fff', textDecoration: 'none' }}>+7 985 434-11-33</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 13, color: 'rgba(255,255,255,.9)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 16, height: 15, border: '1.4px solid currentColor', borderRadius: '50% 50% 4px 4px', display: 'inline-block' }} />
                0
              </span>
              <span onClick={onNavigateToCatalog} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                <span style={{ width: 16, height: 14, border: '1.4px solid currentColor', borderRadius: '3px 3px 5px 5px', display: 'inline-block' }} />
                {cartCount > 0 ? cartCount : 0} ₽
              </span>
            </div>
          </div>
        </header>

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 48px', textAlign: 'center', pointerEvents: 'none' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(56px, 9vw, 132px)', lineHeight: .88, fontWeight: 600, letterSpacing: '-.04em', color: '#fff' }}>{currentSlide.title}</h1>
          <div style={{ maxWidth: 560, fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.86)' }}>{currentSlide.text}</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, pointerEvents: 'auto' }}>
            <button onClick={() => onNavigateToCatalog('catalog')} style={{ padding: '15px 42px', background: '#fbfaf8', color: '#1a1a18', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Каталог</button>
            <button onClick={() => onNavigateToCatalog(currentSlide.entry)} style={{ padding: '15px 42px', border: '1px solid rgba(255,255,255,.7)', color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}>{currentSlide.cta}</button>
          </div>
        </div>

        <div onClick={() => setSlide(s => (s + SLIDES.length - 1) % SLIDES.length)} style={{ position: 'absolute', zIndex: 4, left: 24, top: '50%', width: 44, height: 44, marginTop: -22, borderRadius: '50%', background: 'rgba(26,26,24,.72)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer' }}>‹</div>
        <div onClick={() => setSlide(s => (s + 1) % SLIDES.length)} style={{ position: 'absolute', zIndex: 4, right: 24, top: '50%', width: 44, height: 44, marginTop: -22, borderRadius: '50%', background: 'rgba(26,26,24,.72)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer' }}>›</div>
        <div style={{ position: 'absolute', zIndex: 4, left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center', gap: 9 }}>
          {SLIDES.map((_, i) => (
            <span key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 26 : 9, height: 9, borderRadius: 999, background: i === slide ? '#fff' : 'rgba(255,255,255,.5)', cursor: 'pointer', transition: 'width .25s', display: 'inline-block' }} />
          ))}
        </div>
      </section>

      {/* Категории */}
      <section style={{ padding: '90px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Категории</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Лестницы, перегородки и зеркала — от готовых решений до изделий по вашим размерам</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
          {CATEGORIES.map((c, i) => (
            <div key={i} onClick={() => onNavigateToCatalog(c.entry)} style={{ position: 'relative', height: 520, borderRadius: 22, overflow: 'hidden', background: c.bg, cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.1) 0%, rgba(20,19,17,.72) 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', padding: '34px 30px' }}>
                <h3 style={{ margin: 0, fontSize: 34, lineHeight: 1.04, fontWeight: 500, letterSpacing: '-.02em', color: '#fff', maxWidth: 260 }}>{c.name}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,.88)', maxWidth: 320 }}>{c.text}</div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,.35)' }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {c.tags.map(t => (
                      <span key={t} style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(4px)', fontSize: 12, color: '#fff' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Лучшие работы */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Лучшие работы</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>4,9 из 5 — средняя оценка по 1 240 отзывам</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
          {BESTSELLERS.map((p, i) => (
            <div key={i} onClick={() => onNavigateToCatalog('bestsellers')} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 18, background: '#fff', border: '1px solid #efece7', borderRadius: 18, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '.04em', whiteSpace: 'nowrap', background: p.hot ? accent : '#f1eee9', color: p.hot ? '#1a1a18' : '#6b6862' }}>{p.badge}</span>
                <span style={{ fontSize: 12, color: '#8b877f', whiteSpace: 'nowrap' }}><span style={{ letterSpacing: 1, color: '#d8a12f' }}>★★★★★</span> {p.rating}</span>
              </div>
              <div style={{ height: 210, borderRadius: 12, background: 'linear-gradient(135deg, #eae7e2 0%, #d8d4ce 100%)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em' }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: '#8b877f' }}>{p.meta}</div>
                  <div style={{ fontSize: 15, color: '#33322e' }}>{p.price}</div>
                </div>
                <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#4a4842' }}>+</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
          <button onClick={() => onNavigateToCatalog('bestsellers')} style={{ padding: '15px 32px', borderRadius: 999, border: '1px solid #ddd8d1', fontSize: 14, color: '#33322e', background: 'transparent', cursor: 'pointer' }}>Смотреть все лучшие товары</button>
        </div>
      </section>

      {/* Почему нас выбирают */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: 30, borderRadius: 22, background: '#1a1a18', color: '#fff' }}>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' }}>Почему нас выбирают</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.66)' }}>Свой цех, конструкторы и монтажники в штате. Считаем проект по фото и размерам, привозим готовое изделие и ставим за один визит.</div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: '50%', background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 500, letterSpacing: '.02em' }}>АЛ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Анна Литвинова</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>ведущий дизайнер-технолог</div>
              </div>
            </div>
            <a href="#footer" style={{ padding: 15, borderRadius: 12, background: '#fbfaf8', color: '#1a1a18', fontSize: 14, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>Обсудить проект</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 30, borderRadius: 22, background: '#fff', border: '1px solid #efece7' }}>
                <div style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: '#8b877f' }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Сезонная распродажа */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 20 }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, background: 'linear-gradient(135deg, #e7eef0 0%, #dbe6e4 100%)', padding: '46px 44px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6d7f7c' }}>Сезонная распродажа</div>
              <h3 style={{ margin: 0, fontSize: 44, fontWeight: 500, letterSpacing: '-.03em' }}>Летние скидки</h3>
              <div style={{ fontSize: 16, color: '#4d5b58' }}>До 50% на зеркала и перегородки прошлой коллекции</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {countdown.map((u, i) => (
                <div key={i} style={{ minWidth: 78, padding: '14px 10px', borderRadius: 14, background: 'rgba(255,255,255,.72)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 28, letterSpacing: '-.02em' }}>{u.value}</div>
                  <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6d7f7c', marginTop: 4 }}>{u.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigateToCatalog('sale')} style={{ alignSelf: 'flex-start', marginTop: 'auto', padding: '15px 34px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer' }}>Купить со скидкой →</button>
          </div>
          <div style={{ borderRadius: 22, overflow: 'hidden', minHeight: 340, background: 'linear-gradient(135deg, #d8d0c8 0%, #c8c0b8 100%)' }} />
        </div>

        {/* Новинки */}
        <div style={{ textAlign: 'center', margin: '76px 0 38px' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Новинки сезона</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Собственное производство — Домодедово, партия от одной штуки</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
          {NOVELTIES.map((p, i) => (
            <div key={i} onClick={() => onNavigateToCatalog('novelties')} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 18, background: '#fff', border: '1px solid #efece7', borderRadius: 18, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '.04em', background: p.hot ? accent : '#f1eee9', color: p.hot ? '#1a1a18' : '#6b6862' }}>{p.badge}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  {p.colors.map((c, j) => (
                    <span key={j} style={{ width: 12, height: 12, borderRadius: 3, background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.09)', display: 'inline-block' }} />
                  ))}
                </div>
              </div>
              <div style={{ height: 210, borderRadius: 12, background: 'linear-gradient(135deg, #eae7e2 0%, #d8d4ce 100%)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em' }}>{p.title}</div>
                  <div style={{ fontSize: 15, color: '#6b6862' }}>{p.price}</div>
                </div>
                <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#4a4842' }}>+</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
          <button onClick={() => onNavigateToCatalog('novelties')} style={{ padding: '15px 32px', borderRadius: 999, border: '1px solid #ddd8d1', fontSize: 14, color: '#33322e', background: 'transparent', cursor: 'pointer' }}>Смотреть все новинки</button>
        </div>
      </section>

      {/* Подборки */}
      <section id="collections" style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Готовые подборки</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Комплекты под конкретное помещение — быстрее, чем собирать поштучно</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: 216, gap: 18 }}>
          {COLLECTIONS.map((c, i) => (
            <div key={i} onClick={onNavigateToCatalog} style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: 20, background: c.bg, cursor: 'pointer', ...(c.span ? Object.fromEntries(c.span.split(';').filter(Boolean).map(s => { const [k, v] = s.split(':'); return [k.trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase()), v.trim()]; })) : {}) }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,0) 40%, rgba(20,19,17,.62) 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 22, right: 22, bottom: 20, display: 'flex', gap: 12, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, color: '#fff' }}>
                  <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.01em' }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)' }}>{c.count}</div>
                </div>
                <span style={{ padding: '10px 18px', borderRadius: 999, background: 'rgba(251,250,248,.94)', color: '#1a1a18', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>Смотреть</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 48px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px', maxWidth: 780, marginLeft: 'auto', marginRight: 'auto', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Частые вопросы — и наши ответы</h2>
          <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 22 }}>Не нашли нужное? Напишите — ответим в течение часа</div>
          <a href="#footer" style={{ display: 'inline-block', padding: '13px 28px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Задать вопрос</a>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'start', gap: 18, marginTop: 44, textAlign: 'left' }}>
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} onClick={() => setOpenFaq(open ? -1 : i)} style={{ padding: '20px 22px', borderRadius: 14, background: open ? '#fff' : '#f4f2ee', border: '1px solid ' + (open ? '#e4e0d9' : 'transparent'), cursor: 'pointer', transition: 'background .15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{f.q}</div>
                    <div style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', border: '1px solid #ddd8d1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6b6862', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>+</div>
                  </div>
                  {open && <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.6, color: '#8b877f' }}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" style={{ marginTop: 100, background: '#1a1a18', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, padding: '56px 48px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' }}>Только важные новости и лучшие предложения</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,.55)' }}>Новинки производства, инновации в мебельной продукции<br />и выгодные предложения — первыми, в вашей почте</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, padding: '16px 18px', border: '1px solid rgba(255,255,255,.18)', borderRadius: 4, fontSize: 14, color: 'rgba(255,255,255,.42)' }}>Введите вашу электронную почту</div>
              <div style={{ padding: '16px 26px', borderRadius: 4, background: 'rgba(255,255,255,.16)', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Подписаться</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
              <span style={{ width: 15, height: 15, border: '1px solid rgba(255,255,255,.35)', borderRadius: 3, flexShrink: 0, display: 'inline-block' }} />
              <span>Я принимаю <span style={{ color: '#fff', fontWeight: 500, cursor: 'pointer' }}>политику конфиденциальности</span> и даю <span style={{ color: '#fff', fontWeight: 500, cursor: 'pointer' }}>согласие</span> на отправку рекламных материалов</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, minmax(0, 1fr))', gap: 40, padding: '46px 48px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start', padding: '8px 14px', background: '#fff', color: '#1a1a18', fontSize: 17, fontWeight: 700, letterSpacing: '-.01em' }}>objects</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div><span style={{ color: 'rgba(255,255,255,.5)' }}>Рабочее время:</span><br />Будни 9:00–18:00</div>
              <div><span style={{ color: 'rgba(255,255,255,.5)' }}>Почта:</span><br />info@objects.ru</div>
              <div><span style={{ color: 'rgba(255,255,255,.5)' }}>Телефон:</span><br />+7 985 434-11-33</div>
              <div><span style={{ color: 'rgba(255,255,255,.5)' }}>Адрес:</span><br />142000, Московская область, г. Домодедово, микрорайон Западный, территория ИНТЕГРА, строение 3</div>
            </div>
          </div>
          {FOOTER_COLS.map((col, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{col.title}</div>
              {col.links.map(l => (
                <span key={l} onClick={onNavigateToCatalog} style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '26px 48px 34px', borderTop: '1px solid rgba(255,255,255,.1)', fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
          <div>© objects 2022–2026. Все права защищены.<br />Интернет-магазин дизайнерской мебели</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,.45)' }}>Политика конфиденциальности</span>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,.45)' }}>Публичная оферта</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {['VK', 'YT', 'TG'].map(s => (
              <span key={s} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,.7)', cursor: 'pointer' }}>{s}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* Чат-пузырь */}
      <div style={{ position: 'fixed', right: 26, bottom: 26, zIndex: 90, display: 'flex', alignItems: 'center', gap: 12 }}>
        {chatOpen && (
          <div style={{ padding: '14px 18px', borderRadius: 16, background: '#fff', boxShadow: '0 12px 34px rgba(26,26,24,.16)', fontSize: 14, color: '#33322e', maxWidth: 240 }}>Здравствуйте! Подскажем по размерам и срокам — напишите нам.</div>
        )}
        <div onClick={() => setChatOpen(o => !o)} style={{ width: 56, height: 56, flexShrink: 0, borderRadius: '50%', background: '#1a1a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 28px rgba(26,26,24,.28)', fontSize: 20 }}>
          {chatOpen ? '✕' : '✉'}
        </div>
      </div>
    </div>
  );
}
