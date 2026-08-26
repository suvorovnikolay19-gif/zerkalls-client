import { useState, useEffect, useRef } from 'react';
import heroImg from '../../assets/hero-main/hero-1.png';
import hero2Img from '../../assets/hero-main/hero-2.png';
import hero3Img from '../../assets/hero-main/hero-3.png';
import service1Img from '../../assets/services/1.png';
import service2Img from '../../assets/services/2.png';
import service3Img from '../../assets/services/3.png';
import testImg from '../../assets/test.jpg';
import test2Img from '../../assets/test-2.jpg';
import test3Img from '../../assets/test-3.jpg';
import test4Img from '../../assets/test-4.jpg';

const FAN_IMGS = [testImg, test2Img, test3Img, test4Img];

const SLIDES = [
  { title: 'Перегородки', text: 'Граница, которую почти не замечаешь.', cta: 'Перегородки', entry: 'partitions', image: hero2Img },
  { title: 'Лестницы', text: 'Лестницы, которые задают уровень интерьеру.', cta: 'Лестницы', entry: 'stairs', image: hero3Img },
  { title: 'Зеркала', text: 'У каждого интерьера — своё отражение. Найдите зеркало, которое станет частью вашей истории.', cta: 'Зеркала', entry: 'mirrors', image: heroImg },
];

const MENU = [
  { name: 'Перегородки', cta: 'Все перегородки', entry: 'partitions', groups: [
    { name: 'Тип конструкции', options: ['Раздвижные', 'Распашные', 'Стационарные', 'Гармошка'] },
    { name: 'Материал', options: ['Дерево', 'Металл', 'Стекло', 'Ротанг'] },
    { name: 'Стекло', options: ['Рифлёное', 'Матовое', 'Тонированное'] },
  ]},
  { name: 'Лестницы', cta: 'Все лестницы', entry: 'stairs', groups: [
    { name: 'Форма', options: ['Винтовая', 'Маршевая', 'Модульная'] },
    { name: 'Материал', options: ['Дуб', 'Сталь', 'Бетон'] },
    { name: 'Ограждение', options: ['Стекло', 'Тросы', 'Балясины'] },
  ]},
  { name: 'Зеркала', cta: 'Все зеркала', entry: 'mirrors', groups: [
    { name: 'Форма', options: ['Круглое', 'Овальное', 'Арочное', 'Нестандартное'] },
    { name: 'Рама', options: ['Латунь', 'Дуб', 'Без рамы'] },
    { name: 'Опции', options: ['С подсветкой', 'Сенсор', 'Антизапотевание'] },
  ]},
  { name: 'Мебель', cta: 'Вся мебель', entry: 'catalog', groups: [
    { name: 'Категория', options: ['Столы', 'Консоли', 'Стеллажи', 'Ширмы'] },
    { name: 'Материал', options: ['Дерево', 'Металл', 'Камень'] },
    { name: 'Помещение', options: ['Гостиная', 'Спальня', 'Кабинет'] },
  ]},
];

const SERVICES = [
  { name: 'Лазерная резка металла', text: 'Раскрой листа до 25 мм по вашим чертежам — точность 0,1 мм.', tags: ['Сталь', 'Нержавейка', 'Алюминий', 'Латунь'], tint: 'rgba(58,62,64,.34)', entry: 'catalog', image: service1Img },
  { name: 'Лазерный труборез', text: 'Резка круглой и профильной трубы, готовые узлы под сварку.', tags: ['Труба', 'Профиль', 'Фаска', 'Гравировка'], tint: 'rgba(74,58,44,.34)', entry: 'catalog', image: service2Img },
  { name: 'Лазерная сварка', text: 'Аккуратный шов без поводок — сборка каркасов и рам.', tags: ['Сталь', 'Нержавейка', 'Без зачистки', 'Тонкий шов'], tint: 'rgba(46,54,66,.34)', entry: 'catalog', image: service3Img },
];

const FAN_CARDS = [
  { name: 'Лестницы', text: 'Винтовые, маршевые и модульные — под высоту вашего проёма.', count: '120+ моделей', entry: 'stairs' },
  { name: 'Перегородки', text: 'Раздвижные, распашные и стационарные системы.', count: '240+ моделей', entry: 'partitions' },
  { name: 'Зеркала', text: 'Арочные, овальные и нестандартные формы.', count: '180+ моделей', entry: 'mirrors' },
  { name: 'Мебель', text: 'Столы, консоли, стеллажи и ширмы из массива.', count: '90+ моделей', entry: 'catalog' },
];

const PAGE_NAV = [
  { name: 'Главная', href: '#', active: true },
  { name: 'Каталог', href: null, entry: 'catalog' },
  { name: 'О компании', href: '#footer' },
  { name: 'Дилерам', href: '#footer' },
  { name: 'Портфолио', href: '#collections' },
  { name: 'Материалы', href: '#categories' },
  { name: 'Дизайнерам', href: '#faq' },
  { name: 'Контакты', href: '#footer' },
];

const BESTSELLERS = [
  { title: 'Перегородка Loft Black', price: 'от 78 000 ₽', meta: 'Сталь, рифлёное стекло', badge: 'Хит продаж', hot: true, rating: '4,9' },
  { title: 'Лестница Метр², дуб', price: 'от 164 000 ₽', meta: 'Винтовая, 1 м²', badge: 'Выбор дизайнеров', hot: true, rating: '5,0' },
  { title: 'Зеркало Arch, арочное', price: 'от 44 900 ₽', meta: 'Дуб, 900×1800 мм', badge: 'Топ рейтинга', rating: '4,8' },
  { title: 'Перегородка Reed, реечная', price: 'от 92 000 ₽', meta: 'Дуб, 3 секции', badge: 'Хит продаж', hot: true, rating: '4,9' },
  { title: 'Зеркало Arco, овальное', price: 'от 38 400 ₽', meta: 'Латунь, ручная сборка', badge: 'Топ рейтинга', rating: '4,7' },
  { title: 'Ширма Fold, гармошка', price: 'от 67 200 ₽', meta: 'Ротанг, 4 створки', badge: 'Часто берут', rating: '4,8' },
  { title: 'Консоль Slim, сталь', price: 'от 60 000 ₽', meta: 'Сталь, закалённое стекло', badge: 'Новинка', rating: '4,8' },
  { title: 'Стеллаж Frame, дуб', price: 'от 74 000 ₽', meta: 'Дуб, металл', badge: 'Выбор дизайнеров', hot: true, rating: '4,9' },
];

const FIT_FILTERS = {
  'Тип': ['Раздвижная', 'Распашная', 'Стационарная', 'Гармошка'],
  'Цвет': ['Графит', 'Латунь', 'Дуб натуральный', 'Белый'],
  'Размер': ['700×2000', '900×2100', '1200×2400', 'По размеру'],
  'Материал': ['Дерево', 'Металл', 'Стекло', 'Ротанг'],
  'Стекло': ['Рифлёное', 'Матовое', 'Тонированное', 'Прозрачное'],
  'Бюджет': ['до 60 000 ₽', '60–120 000 ₽', '120 000+ ₽'],
};

const FIT_ITEMS = [
  { title: 'Перегородка Grid', price: 'от 96 000 ₽' },
  { title: 'Перегородка Loft Black', price: 'от 78 000 ₽' },
  { title: 'Ширма Reed, дуб', price: 'от 54 000 ₽' },
  { title: 'Перегородка Frame, латунь', price: 'от 128 000 ₽' },
  { title: 'Ширма Fold, гармошка', price: 'от 67 200 ₽' },
];

const BANNERS = [
  { kicker: 'Подбор по задаче', title: 'ПЕРЕГОРОДКИ, КОТОРЫЕ РЕШАЮТ ЗАДАЧУ', text: 'Скажите, для чего нужна перегородка — предложим 2–3 готовых решения с ценой и сроком.', tint: 'rgba(38,46,52,.6)', bg: 'linear-gradient(135deg, #2a3038 0%, #1a2028 100%)',
    options: [['Студии / маленькой квартиры', '2 кейса'], ['Офиса / переговорной', '2 кейса'], ['Дома / межкомнатной', '3 кейса'], ['Душа / влажной зоны', '1 кейс'], ['Не знаю размер — определить по фото', '']] },
  { kicker: 'Лестницы', title: 'ЛЕСТНИЦА В ЛЮБОЙ ПРОЁМ', text: 'Пришлите высоту и проём — конструктор посчитает вариант за один день.', tint: 'rgba(52,42,32,.6)', bg: 'linear-gradient(135deg, #302820 0%, #201810 100%)',
    options: [['Второго этажа в доме', '4 кейса'], ['Мансарды', '2 кейса'], ['Антресоли в студии', '2 кейса'], ['Улицы / террасы', '1 кейс'], ['Не знаю высоту — замерим сами', '']] },
  { kicker: 'Зеркала', title: 'ЗЕРКАЛО ПО ВАШЕЙ ФОРМЕ', text: 'Любая геометрия, подсветка и рама — от эскиза до монтажа.', tint: 'rgba(44,40,50,.6)', bg: 'linear-gradient(135deg, #2c2832 0%, #1c1822 100%)',
    options: [['Прихожей в полный рост', '3 кейса'], ['Ванной с подсветкой', '4 кейса'], ['Гостиной, нестандартной формы', '2 кейса'], ['Гардеробной', '1 кейс'], ['Не знаю форму — подскажите', '']] },
];

const NOVELTIES = [
  { title: 'Зеркало Arco, овальное', price: '38 400 ₽', badge: 'Хит продаж', hot: true, colors: ['#c9a227', '#1a1a18', '#e6e2dc', '#8a6a3b'] },
  { title: 'Перегородка Grid, 3 секции', price: '96 000 ₽', badge: 'Топ рейтинга', colors: ['#1a1a18', '#8c857b', '#dcd8d1'] },
  { title: 'Ширма Reed, дуб', price: '54 000 ₽', badge: 'Лучшая цена', colors: ['#b58150', '#e6d3ba', '#4a4842'] },
  { title: 'Зеркало Nube, гнутое', price: '61 500 ₽', badge: 'Новинка', hot: true, colors: ['#c9a227', '#f0ede8'] },
  { title: 'Перегородка Loft, чёрная', price: '78 000 ₽', badge: 'Топ рейтинга', colors: ['#1a1a18', '#6b6862', '#a8a39a'] },
  { title: 'Зеркало Arch, арочное', price: '44 900 ₽', badge: 'Хит продаж', hot: true, colors: ['#8a6a3b', '#e6e2dc', '#1a1a18', '#4f6b52'] },
  { title: 'Ширма Bamboo, натуральная', price: '49 000 ₽', badge: 'Новинка', colors: ['#b58150', '#e6d3ba'] },
  { title: 'Зеркало Oval, латунь', price: '52 000 ₽', badge: 'Лучшая цена', hot: true, colors: ['#c9a227', '#1a1a18'] },
];

const STATS = [
  { value: '12+', label: 'лет на рынке', text: 'Своё производство в Домодедово с 2014 года — без посредников и перепродаж.' },
  { value: '9 400', label: 'проектов сдано', text: 'Квартиры, дома, отели и офисы по всей России.' },
  { value: '5 лет', label: 'гарантии', text: 'На конструкцию, фурнитуру и монтаж. Сервис — свой.' },
  { value: '99%', label: 'довольны', text: 'По опросу клиентов после установки за последний год.' },
];

const STEPS = [
  { title: 'Заявка и консультация', text: 'Обсуждаем задачу, показываем похожие проекты и сразу называем вилку по цене.', caption: 'Шаг 1 — разговор о задаче' },
  { title: 'Замер и проект', text: 'Замерщик приезжает с образцами, конструктор готовит чертёж и точную смету за день.', caption: 'Шаг 2 — замер на объекте' },
  { title: 'Производство', text: 'Свой цех в Домодедово: резка, сварка, покраска и сборка под контролем технолога.', caption: 'Шаг 3 — цех' },
  { title: 'Доставка и монтаж', text: 'Привозим в удобное окно, ставим за один визит и убираем за собой.', caption: 'Шаг 4 — монтаж' },
];

const ROOMS = [
  { name: 'Гостиная «Тихий свет»', kicker: 'Проект целиком', total: 'Комплект 268 400 ₽', items: [
    { kind: 'Перегородка', title: 'Grid, 3 секции', price: '96 000 ₽' },
    { kind: 'Зеркало', title: 'Arco, овальное', price: '38 400 ₽' },
    { kind: 'Стеллаж', title: 'Frame, дуб', price: '74 000 ₽' },
    { kind: 'Консоль', title: 'Slim, сталь', price: '60 000 ₽' },
  ]},
  { name: 'Спальня «Джапанди»', kicker: 'Проект целиком', total: 'Комплект 196 900 ₽', items: [
    { kind: 'Ширма', title: 'Reed, дуб', price: '54 000 ₽' },
    { kind: 'Зеркало', title: 'Arch, арочное', price: '44 900 ₽' },
    { kind: 'Изголовье', title: 'Soft, ротанг', price: '62 000 ₽' },
    { kind: 'Столик', title: 'Nube, камень', price: '36 000 ₽' },
  ]},
  { name: 'Прихожая «Лофт»', kicker: 'Проект целиком', total: 'Комплект 154 300 ₽', items: [
    { kind: 'Перегородка', title: 'Loft Black', price: '78 000 ₽' },
    { kind: 'Зеркало', title: 'Slim, в рост', price: '32 900 ₽' },
    { kind: 'Вешалка', title: 'Rail, латунь', price: '18 400 ₽' },
    { kind: 'Полка', title: 'Edge, дуб', price: '25 000 ₽' },
  ]},
];

const COLLECTIONS = [
  { name: 'Для гостиной', count: '48 товаров', span: { gridColumn: 'span 2', gridRow: 'span 2' }, bg: '#3a3228' },
  { name: 'Для спальни', count: '31 товар', span: { gridColumn: 'span 2' }, bg: '#2e3638' },
  { name: 'Для кухни', count: '26 товаров', span: {}, bg: '#3a2e28' },
  { name: 'Для кабинета', count: '19 товаров', span: {}, bg: '#282e3a' },
  { name: 'Для прихожей', count: '22 товара', span: { gridColumn: 'span 2' }, bg: '#2e3028' },
  { name: 'Для ванной', count: '14 товаров', span: { gridColumn: 'span 2' }, bg: '#283038' },
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
  { title: 'Информация', links: ['О компании', 'Дизайнерам', 'Дилерам', 'Презентация', 'Контакты', 'Холдинг'] },
  { title: 'Каталог', links: ['Лестницы', 'Зеркала', 'Перегородки', 'Ширмы', 'Стеклянные доски', 'Комплектующие'] },
  { title: 'Помощь', links: ['Гарантия', 'Доставка и монтаж', 'Возврат', 'Карта сайта'] },
];

const STEP_MS = 6500;
const SLIDE_MS = 7000;

function pad(n) { return (n < 10 ? '0' : '') + n; }

const ROOM_ITEM_POS = [
  { left: 0, top: '4%' },
  { right: '2%', top: '16%' },
  { left: '8%', bottom: '6%' },
  { right: '18%', bottom: '4%' },
];

export default function HomePage({ onNavigateToCatalog, cartCount, onOpenCart, onOpenProfile }) {
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [left, setLeft] = useState(4 * 86400 + 14 * 3600 + 48 * 60 + 18);
  const [chatOpen, setChatOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [bgColor, setBgColor] = useState(() => {
    try { return localStorage.getItem('site-bg') || '#fbfaf8'; } catch { return '#fbfaf8'; }
  });
  const colorRef = useRef(null);
  const accent = '#c9a227';

  const BG_PALETTE = [
    // Нейтральные
    { color: '#fefefe', label: 'Белый' },
    { color: '#f4f3f0', label: 'Светло-серый' },
    { color: '#e6e4df', label: 'Серый' },
    { color: '#cccac4', label: 'Тёмно-серый' },
    { color: '#1c1c1a', label: 'Чёрный' },
    // Кремовые
    { color: '#fdf8f0', label: 'Кремовый светлый' },
    { color: '#f5edd8', label: 'Кремовый' },
    { color: '#ead8b4', label: 'Кремовый средний' },
    { color: '#d4be88', label: 'Кремовый тёмный' },
    { color: '#b89e5a', label: 'Янтарный' },
    // Оранжевые
    { color: '#fef3e8', label: 'Персиковый светлый' },
    { color: '#fde0be', label: 'Персиковый' },
    { color: '#f9c680', label: 'Оранжевый светлый' },
    { color: '#f2a030', label: 'Оранжевый' },
    { color: '#d47808', label: 'Оранжевый тёмный' },
    // Красные
    { color: '#fef0ee', label: 'Розово-красный светлый' },
    { color: '#fcdad4', label: 'Коралловый светлый' },
    { color: '#f9b4a8', label: 'Коралловый' },
    { color: '#f27e6a', label: 'Красный' },
    { color: '#d4462e', label: 'Красный тёмный' },
    // Розовые
    { color: '#fef0f5', label: 'Розовый светлый' },
    { color: '#fcd8e8', label: 'Розовый' },
    { color: '#f9b2ce', label: 'Розовый средний' },
    { color: '#f27aa8', label: 'Малиновый' },
    { color: '#cc3e7a', label: 'Малиновый тёмный' },
    // Лиловые
    { color: '#f8f0fe', label: 'Лавандовый светлый' },
    { color: '#eed8fc', label: 'Лавандовый' },
    { color: '#dbbaf8', label: 'Фиолетовый светлый' },
    { color: '#c08ef0', label: 'Фиолетовый' },
    { color: '#9050d8', label: 'Фиолетовый тёмный' },
    // Синие
    { color: '#eef2fe', label: 'Голубой светлый' },
    { color: '#d4e2fc', label: 'Голубой' },
    { color: '#aacaf8', label: 'Синий светлый' },
    { color: '#6aa4f0', label: 'Синий' },
    { color: '#2666d4', label: 'Синий тёмный' },
    // Бирюзовые
    { color: '#eef8f6', label: 'Мятный светлый' },
    { color: '#c6ece4', label: 'Бирюзовый светлый' },
    { color: '#8ed6c8', label: 'Бирюзовый' },
    { color: '#42b4a2', label: 'Морской' },
    { color: '#0e8270', label: 'Морской тёмный' },
    // Зелёные
    { color: '#eefaf0', label: 'Зелёный светлый' },
    { color: '#c8edd0', label: 'Зелёный' },
    { color: '#94d8a8', label: 'Зелёный средний' },
    { color: '#50b870', label: 'Зелёный насыщенный' },
    { color: '#189040', label: 'Зелёный тёмный' },
    // Тёмные
    { color: '#232320', label: 'Тёмно-серый тёплый' },
    { color: '#1a1f2e', label: 'Тёмно-синий' },
    { color: '#1a2418', label: 'Тёмно-зелёный' },
    { color: '#1e1418', label: 'Тёмно-красный' },
    { color: '#0f1825', label: 'Ночной' },
  ];

  const [activeMenu, setActiveMenu] = useState(null);
  const [fanHover, setFanHover] = useState(null);

  const [fitIdx, setFitIdx] = useState(0);
  const [fitOpen, setFitOpen] = useState(null);
  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const [fitValues, setFitValues] = useState({ 'Тип': 'Раздвижная', 'Цвет': 'Графит', 'Размер': '900×2100' });
  const [fitExtra, setFitExtra] = useState([]);

  const [bannerIdx, setBannerIdx] = useState(0);
  const [needOpen, setNeedOpen] = useState(false);
  const [need, setNeed] = useState(null);

  const [stepIdx, setStepIdx] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const [roomIdx, setRoomIdx] = useState(0);

  const rafRef = useRef(null);
  const t0Ref = useRef(Date.now());
  const left0Ref = useRef(4 * 86400 + 14 * 3600 + 48 * 60 + 18);
  const stepBaseRef = useRef(Date.now());
  const slideBaseRef = useRef(Date.now());
  const stepIdxRef = useRef(0);
  const stepProgressRef = useRef(0);
  const slideIdxRef = useRef(0);

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const newLeft = Math.max(0, left0Ref.current - Math.floor((now - t0Ref.current) / 1000));
      setLeft(newLeft);

      const p = Math.min(100, ((now - stepBaseRef.current) / STEP_MS) * 100);
      if (p >= 100) {
        stepBaseRef.current = now;
        const next = (stepIdxRef.current + 1) % STEPS.length;
        stepIdxRef.current = next;
        stepProgressRef.current = 0;
        setStepIdx(next);
        setStepProgress(0);
      } else if (Math.abs(p - stepProgressRef.current) > 0.15) {
        stepProgressRef.current = p;
        setStepProgress(p);
      }

      if (now - slideBaseRef.current >= SLIDE_MS) {
        slideBaseRef.current = now;
        const next = (slideIdxRef.current + 1) % SLIDES.length;
        slideIdxRef.current = next;
        setSlide(next);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    if (!colorOpen) return;
    const handler = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setColorOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [colorOpen]);

  const [sliderHue, setSliderHue] = useState(200);
  const [sliderLight, setSliderLight] = useState(94);

  const hslToHex = (h, s, l) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      return Math.round((l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))) * 255);
    };
    return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('');
  };

  const applyCustomColor = (h, light) => {
    const hex = hslToHex(h, 38, light);
    setBgColor(hex);
    try { localStorage.setItem('site-bg', hex); } catch {}
  };

  const pickBgColor = (color) => {
    setBgColor(color);
    try { localStorage.setItem('site-bg', color); } catch {}
    setColorOpen(false);
  };

  const countdown = [
    { value: pad(Math.floor(left / 86400)), label: 'дней' },
    { value: pad(Math.floor(left / 3600) % 24), label: 'часов' },
    { value: pad(Math.floor(left / 60) % 60), label: 'минут' },
    { value: pad(left % 60), label: 'секунд' },
  ];

  const currentSlide = SLIDES[slide];
  const currentBanner = BANNERS[bannerIdx];
  const fitKeys = ['Тип', 'Цвет', 'Размер'].concat(fitExtra);
  const addable = Object.keys(FIT_FILTERS).filter(k => fitKeys.indexOf(k) < 0);
  const fitItem = FIT_ITEMS[fitIdx % FIT_ITEMS.length];
  const currentRoom = ROOMS[roomIdx];

  function pickStep(i) {
    stepBaseRef.current = Date.now();
    stepIdxRef.current = i;
    stepProgressRef.current = 0;
    setStepIdx(i);
    setStepProgress(0);
  }

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: bgColor, WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: 760, background: '#23221f' }}>
        {currentSlide.image
          ? <img src={currentSlide.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'opacity .6s' }} />
          : <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, #2e2c28 0, #2e2c28 20px, #252320 20px, #252320 40px)' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.55) 0%, rgba(20,19,17,.18) 40%, rgba(20,19,17,.6) 100%)', pointerEvents: 'none' }} />

        <header
          onMouseLeave={() => setActiveMenu(null)}
          style={{ position: 'relative', zIndex: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px 24px', padding: '22px clamp(16px, 3vw, 48px)', color: '#fff' }}
        >
          <div style={{ flex: 1, fontSize: 24, fontWeight: 600, letterSpacing: '-.02em' }}>objects</div>

          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 4, padding: 6, borderRadius: 999, background: 'rgba(26,26,24,.62)', backdropFilter: 'blur(10px)' }}>
              {MENU.map(m => (
                <div
                  key={m.name}
                  onMouseEnter={() => setActiveMenu(m.name)}
                  style={{ padding: '11px 22px', borderRadius: 999, fontSize: 13, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', background: activeMenu === m.name ? 'rgba(255,255,255,.16)' : 'transparent', color: '#fff', transition: 'background .18s' }}
                >
                  {m.name}
                </div>
              ))}
            </nav>

            {activeMenu && (() => {
              const m = MENU.find(x => x.name === activeMenu);
              return (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8, padding: '26px 30px 22px', width: 'max-content', maxWidth: 'min(720px, calc(100vw - 48px))', borderRadius: 20, background: 'rgba(26,26,24,.9)', backdropFilter: 'blur(14px)', animation: 'hMenu .22s cubic-bezier(.2,.8,.2,1)', zIndex: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px 42px', alignItems: 'flex-start' }}>
                    {m.groups.map(g => (
                      <div key={g.name} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 150 }}>
                        <div style={{ fontSize: 12, letterSpacing: '.06em', color: 'rgba(255,255,255,.5)', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.14)' }}>{g.name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                          {g.options.map(o => (
                            <span
                              key={o}
                              onClick={() => { onNavigateToCatalog(m.entry); setActiveMenu(null); }}
                              style={{ padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,.08)', fontSize: 14, color: '#fff', whiteSpace: 'nowrap', cursor: 'pointer' }}
                            >{o}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span onClick={() => { onNavigateToCatalog(m.entry); setActiveMenu(null); }} style={{ display: 'block', marginTop: 24, textAlign: 'center', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer' }}>{m.cta} →</span>
                </div>
              );
            })()}
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 26, whiteSpace: 'nowrap' }}>
            <a href="tel:+79854341133" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.01em', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>+7 985 434-11-33</a>
            <div style={{ display: 'flex', flex: 'none', alignItems: 'center', gap: 22 }}>
              <div onClick={onOpenProfile} style={{ cursor: 'pointer' }}>
                <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div style={{ cursor: 'pointer' }}>
                <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div onClick={onOpenCart} style={{ position: 'relative', cursor: 'pointer' }}>
                <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <div style={{ position: 'absolute', top: -8, right: -8, minWidth: 17, height: 17, borderRadius: '50%', background: '#fff', color: '#1a1a18', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 48px', textAlign: 'center', pointerEvents: 'none' }}>
          <h1 style={{ margin: 0, maxWidth: 'calc(100% - 200px)', fontSize: 'clamp(56px, 9vw, 132px)', lineHeight: .88, fontWeight: 600, letterSpacing: '-.04em', color: '#fff' }}>{currentSlide.title}</h1>
          <div style={{ maxWidth: 560, fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.86)', textWrap: 'pretty' }}>{currentSlide.text}</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, pointerEvents: 'auto' }}>
            <button onClick={() => onNavigateToCatalog('catalog')} style={{ padding: '15px 42px', background: '#fbfaf8', color: '#1a1a18', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Каталог</button>
            <button onClick={() => onNavigateToCatalog(currentSlide.entry)} style={{ padding: '15px 42px', border: '1px solid rgba(255,255,255,.7)', color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}>{currentSlide.cta}</button>
          </div>
        </div>

        <div onClick={() => { const n = (slide + SLIDES.length - 1) % SLIDES.length; slideIdxRef.current = n; slideBaseRef.current = Date.now(); setSlide(n); }} style={{ position: 'absolute', zIndex: 4, left: 24, top: '50%', width: 44, height: 44, marginTop: -22, borderRadius: '50%', background: 'rgba(26,26,24,.72)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }}>‹</div>
        <div onClick={() => { const n = (slide + 1) % SLIDES.length; slideIdxRef.current = n; slideBaseRef.current = Date.now(); setSlide(n); }} style={{ position: 'absolute', zIndex: 4, right: 24, top: '50%', width: 44, height: 44, marginTop: -22, borderRadius: '50%', background: 'rgba(26,26,24,.72)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }}>›</div>
        <div style={{ position: 'absolute', zIndex: 4, left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center', gap: 9 }}>
          {SLIDES.map((_, i) => (
            <span key={i} onClick={() => { slideIdxRef.current = i; slideBaseRef.current = Date.now(); setSlide(i); }} style={{ width: i === slide ? 26 : 9, height: 9, borderRadius: 999, background: i === slide ? '#fff' : 'rgba(255,255,255,.5)', cursor: 'pointer', transition: 'width .25s', display: 'inline-block' }} />
          ))}
        </div>
      </section>

      {/* ── Меню разделов (sticky) ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6, padding: '18px 48px', background: 'rgba(251,250,248,.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #ece9e4' }}>
        {PAGE_NAV.map((n, i) => (
          n.href
            ? <a key={i} href={n.href} style={{ padding: '11px 22px', borderRadius: 999, fontSize: 15, whiteSpace: 'nowrap', textDecoration: 'none', background: n.active ? '#1a1a18' : 'transparent', color: n.active ? '#fff' : '#4a4842', transition: 'background .15s' }}>{n.name}</a>
            : <span key={i} onClick={() => onNavigateToCatalog(n.entry)} style={{ padding: '11px 22px', borderRadius: 999, fontSize: 15, whiteSpace: 'nowrap', cursor: 'pointer', background: 'transparent', color: '#4a4842', transition: 'background .15s' }}>{n.name}</span>
        ))}
      </nav>

      {/* ── Услуги ── */}
      <section style={{ padding: '52px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Услуги</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Собственный цех в Домодедово — работаем с листом, трубой и готовыми узлами</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
          {SERVICES.map((c, i) => (
            <div key={i} onClick={() => onNavigateToCatalog(c.entry)} style={{ position: 'relative', display: 'block', height: 520, borderRadius: 22, overflow: 'hidden', background: '#2a2926', cursor: 'pointer' }}>
              {c.image && <img src={c.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />}
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${c.tint} 0%, rgba(20,19,17,.1) 45%, rgba(20,19,17,.72) 100%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', padding: '34px 30px', pointerEvents: 'none' }}>
                <h3 style={{ margin: 0, fontSize: 34, lineHeight: 1.04, fontWeight: 500, letterSpacing: '-.02em', color: '#fff', maxWidth: 260 }}>{c.name}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,.88)', maxWidth: 320, textWrap: 'pretty' }}>{c.text}</div>
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

      {/* ── Категории (fan cards) ── */}
      <section id="categories" style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Категории</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Лестницы, перегородки, зеркала и мебель — наведите, чтобы посмотреть примеры</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20, alignItems: 'start' }}>
          {FAN_CARDS.map((c, i) => {
            const hot = fanHover === i;
            const angles = [-22, -8, 8, 22];
            return (
              <div
                key={i}
                onMouseEnter={() => setFanHover(i)}
                onMouseLeave={() => setFanHover(v => v === i ? null : v)}
                onClick={() => onNavigateToCatalog(c.entry)}
                style={{ borderRadius: 22, padding: '26px 0 0', background: hot ? '#fff' : '#f4f2ee', border: '1px solid ' + (hot ? '#e4e0d9' : 'transparent'), boxShadow: hot ? '0 24px 50px rgba(26,26,24,.14)' : '0 0 0 rgba(0,0,0,0)', transform: hot ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)', transition: 'transform .38s cubic-bezier(.2,.8,.2,1), box-shadow .38s ease, background .3s ease', cursor: 'pointer', willChange: 'transform' }}
              >
                <div style={{ position: 'relative', height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {[0, 1, 2, 3].map(j => (
                    <div
                      key={j}
                      style={{ position: 'absolute', width: 132, height: 186, borderRadius: 12, overflow: 'hidden', background: `hsl(${30 + j * 8}, 12%, ${80 - j * 4}%)`, boxShadow: '0 10px 26px rgba(26,26,24,.18)', transformOrigin: '50% 118%', transform: `rotate(${hot ? angles[j] : (j - 1.5) * 3}deg) translateY(${hot ? -(6 - Math.abs(j - 1.5) * 3) : 0}px)`, transition: `transform .42s cubic-bezier(.2,.8,.2,1) ${j * 0.03}s`, zIndex: j, backgroundImage: `url(${FAN_IMGS[j]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '26px 22px 24px' }}>
                  <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-.01em' }}>{c.name}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: '#8b877f', textWrap: 'pretty' }}>{c.text}</div>
                  <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 500, transition: 'color .3s ease', color: hot ? '#1a1a18' : '#a8a39a' }}>{c.count}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Лучшие работы ── */}
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
              <img src={FAN_IMGS[i % 4]} alt="" style={{ height: 210, width: '100%', borderRadius: 12, objectFit: 'cover', display: 'block' }} />
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

        {/* Примерочная */}
        <div style={{ marginTop: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Примерочная</h2>
            <div style={{ fontSize: 15, color: '#8b877f' }}>Крутите каталог и меняйте параметры — подборка обновляется на ходу</div>
          </div>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(180deg, #f4f2ee 0%, #e9e6e0 100%)' }}>
            <div style={{ position: 'relative', height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '0 80px' }}>
              <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: 180, height: 300, opacity: .22, borderRadius: 14, backgroundImage: 'repeating-linear-gradient(135deg, #ded9d2 0, #ded9d2 8px, #d3cec7 8px, #d3cec7 16px)' }} />
              <div style={{ flex: '0 1 440px', minWidth: 0, height: 420, borderRadius: 16, background: 'linear-gradient(135deg, #e0ddd8 0%, #ccc8c2 100%)' }} />
              <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: 180, height: 300, opacity: .22, borderRadius: 14, backgroundImage: 'repeating-linear-gradient(135deg, #ded9d2 0, #ded9d2 8px, #d3cec7 8px, #d3cec7 16px)' }} />

              <div onClick={() => { setFitIdx(i => (i + FIT_ITEMS.length - 1) % FIT_ITEMS.length); setFitOpen(null); setAddFilterOpen(false); }} style={{ position: 'absolute', left: 22, top: '50%', marginTop: -24, width: 48, height: 48, borderRadius: '50%', background: '#fff', boxShadow: '0 6px 20px rgba(26,26,24,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', zIndex: 2 }}>‹</div>
              <div onClick={() => { setFitIdx(i => (i + 1) % FIT_ITEMS.length); setFitOpen(null); setAddFilterOpen(false); }} style={{ position: 'absolute', right: 22, top: '50%', marginTop: -24, width: 48, height: 48, borderRadius: '50%', background: '#fff', boxShadow: '0 6px 20px rgba(26,26,24,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', zIndex: 2 }}>›</div>
              <div style={{ position: 'absolute', left: 28, top: 26, fontSize: 13, color: '#8b877f' }}>{fitIdx % FIT_ITEMS.length + 1} / {FIT_ITEMS.length}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'stretch', gap: 1, background: '#ece9e4', borderTop: '1px solid #e4e0d9' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', padding: '20px 28px', background: '#fff', minWidth: 230 }}>
                <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-.01em' }}>{fitItem.title}</div>
                <div style={{ fontSize: 14, color: '#6b6862' }}>{fitItem.price}</div>
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '16px 24px', background: '#fff', overflow: 'visible', position: 'relative' }}>
                {fitKeys.map(k => {
                  const open = fitOpen === k;
                  return (
                    <div key={k} style={{ position: 'relative', flexShrink: 0 }}>
                      <div
                        onClick={() => { setFitOpen(open ? null : k); setAddFilterOpen(false); }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '9px 16px', borderRadius: 12, border: '1px solid ' + (open ? '#1a1a18' : '#e6e2dc'), background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        <span style={{ fontSize: 11, color: '#8b877f' }}>{k}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#33322e' }}>
                          {fitValues[k] || 'Любой'}
                          <span style={{ fontSize: 12, color: '#8b877f', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .18s', display: 'inline-block' }}>⌄</span>
                        </span>
                      </div>
                      {open && (
                        <div style={{ position: 'absolute', zIndex: 5, left: 0, bottom: 'calc(100% + 8px)', minWidth: 190, padding: 8, borderRadius: 14, background: '#fff', border: '1px solid #ece9e4', boxShadow: '0 14px 34px rgba(26,26,24,.14)', animation: 'hDrop .18s ease' }}>
                          {FIT_FILTERS[k].map(o => (
                            <div
                              key={o}
                              onClick={() => { setFitValues(v => ({ ...v, [k]: o })); setFitOpen(null); setFitIdx(i => (i + 1) % FIT_ITEMS.length); }}
                              style={{ padding: '10px 12px', borderRadius: 9, fontSize: 14, cursor: 'pointer', color: fitValues[k] === o ? '#1a1a18' : '#4a4842', fontWeight: fitValues[k] === o ? 600 : 400, background: fitValues[k] === o ? '#f4f2ee' : 'transparent' }}
                            >{o}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    onClick={() => { setAddFilterOpen(o => !o); setFitOpen(null); }}
                    style={{ width: 42, height: 42, borderRadius: 12, border: '1px dashed #d5d0c8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: '#6b6862', cursor: 'pointer' }}
                  >+</div>
                  {addFilterOpen && (
                    <div style={{ position: 'absolute', zIndex: 5, left: 0, bottom: 'calc(100% + 8px)', minWidth: 200, padding: 8, borderRadius: 14, background: '#fff', border: '1px solid #ece9e4', boxShadow: '0 14px 34px rgba(26,26,24,.14)', animation: 'hDrop .18s ease' }}>
                      {addable.length === 0
                        ? <div style={{ padding: '10px 12px', fontSize: 13, color: '#8b877f' }}>Все фильтры добавлены</div>
                        : addable.map(k => (
                          <div
                            key={k}
                            onClick={() => { setFitExtra(e => [...e, k]); setFitValues(v => ({ ...v, [k]: FIT_FILTERS[k][0] })); setAddFilterOpen(false); setFitIdx(i => (i + 1) % FIT_ITEMS.length); }}
                            style={{ padding: '10px 12px', borderRadius: 9, fontSize: 14, color: '#33322e', cursor: 'pointer' }}
                          >{k}</div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => onNavigateToCatalog('catalog')} style={{ display: 'flex', alignItems: 'center', padding: '20px 34px', background: '#1a1a18', color: '#fff', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}>Настроить и купить</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Почему нас выбирают ── */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: 30, borderRadius: 22, background: '#1a1a18', color: '#fff' }}>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' }}>Почему нас выбирают</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.66)', textWrap: 'pretty' }}>Свой цех, конструкторы и монтажники в штате. Считаем проект по фото и размерам, привозим готовое изделие и ставим за один визит.</div>
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
                <div style={{ fontSize: 13, lineHeight: 1.55, color: '#8b877f', textWrap: 'pretty' }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Как мы работаем ── */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 42 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Как мы работаем</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Четыре этапа от заявки до готового интерьера</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 60, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {STEPS.map((s, i) => {
              const active = i === stepIdx;
              const done = i < stepIdx;
              const progress = active ? stepProgress : (done ? 100 : 0);
              return (
                <div key={i} onClick={() => pickStep(i)} style={{ cursor: 'pointer', paddingBottom: active ? 4 : 0 }}>
                  <div style={{ height: 2, background: '#e6e2dc', overflow: 'hidden' }}>
                    <div style={{ height: 2, background: '#1a1a18', transformOrigin: 'left center', willChange: 'transform', transform: `scaleX(${progress / 100})`, width: '100%', transition: active ? 'none' : 'transform .5s cubic-bezier(.4,0,.2,1)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingTop: 20 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, transition: 'color .45s ease', color: active ? '#8b877f' : '#c2bdb5' }}>{'0' + (i + 1)}</span>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-.02em', transition: 'color .45s ease', color: active ? '#1a1a18' : '#c2bdb5' }}>{s.title}</h3>
                  </div>
                  {active && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '12px 0 22px', animation: 'hStep .45s cubic-bezier(.2,.8,.2,1)' }}>
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: '#6b6862', maxWidth: 400, textWrap: 'pretty' }}>{s.text}</div>
                      <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: '50%', background: '#1a1a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>→</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ position: 'relative', height: 520, borderRadius: 22, overflow: 'hidden', background: '#ece9e4' }}>
            <div key={stepIdx} style={{ position: 'absolute', inset: 0, animation: 'hSwap .55s cubic-bezier(.2,.8,.2,1)', backgroundImage: 'repeating-linear-gradient(135deg, #e2ddd7 0, #e2ddd7 10px, #d8d3cd 10px, #d8d3cd 20px)' }} />
            <div style={{ position: 'absolute', left: 20, bottom: 20, padding: '10px 18px', borderRadius: 999, background: 'rgba(251,250,248,.94)', fontSize: 13, color: '#33322e' }}>{STEPS[stepIdx].caption}</div>
          </div>
        </div>
      </section>

      {/* ── Сезонная распродажа + Комнаты + Новинки + Баннер ── */}
      <section style={{ padding: '96px 48px 0' }}>
        {/* Собрали ваш интерьер */}
        <div style={{ textAlign: 'center', margin: '96px 0 36px' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Собрали ваш интерьер</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Готовые комнаты — и все предметы, из которых они собраны</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          {ROOMS.map((r, i) => (
            <div
              key={i}
              onClick={() => setRoomIdx(i)}
              style={{ padding: '11px 22px', borderRadius: 999, fontSize: 14, cursor: 'pointer', border: '1px solid ' + (i === roomIdx ? '#1a1a18' : '#e0dcd5'), background: i === roomIdx ? '#1a1a18' : 'transparent', color: i === roomIdx ? '#fff' : '#4a4842' }}
            >{r.name}</div>
          ))}
        </div>
        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 700, background: '#2a2926' }}>
          <img src={testImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.34) 0%, rgba(20,19,17,.1) 45%, rgba(20,19,17,.5) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 700, padding: '34px 34px 30px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#fff' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>{currentRoom.kicker}</div>
                <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-.02em' }}>{currentRoom.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <div style={{ padding: '12px 20px', borderRadius: 999, background: 'rgba(251,250,248,.94)', fontSize: 14, fontWeight: 500, color: '#1a1a18' }}>{currentRoom.total}</div>
                <button onClick={() => onNavigateToCatalog('catalog')} style={{ padding: '12px 20px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>Купить комплект</button>
              </div>
            </div>
            <div style={{ position: 'absolute', inset: '96px 34px 34px', pointerEvents: 'none' }}>
              {currentRoom.items.map((it, j) => (
                <div
                  key={`${roomIdx}-${j}`}
                  onClick={() => onNavigateToCatalog('catalog')}
                  style={{ position: 'absolute', width: 210, display: 'flex', flexDirection: 'column', gap: 10, padding: 12, borderRadius: 16, background: 'rgba(251,250,248,.95)', backdropFilter: 'blur(8px)', boxShadow: '0 16px 36px rgba(20,19,17,.26)', pointerEvents: 'auto', cursor: 'pointer', animation: `hStep .4s cubic-bezier(.2,.8,.2,1) ${j * 0.06}s both`, ...ROOM_ITEM_POS[j % 4] }}
                >
                  <img src={testImg} alt="" style={{ height: 120, width: '100%', borderRadius: 10, objectFit: 'cover', display: 'block' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a8a39a' }}>{it.kind}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.01em' }}>{it.title}</div>
                    <div style={{ fontSize: 13, color: '#6b6862' }}>{it.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div onClick={() => setRoomIdx(i => (i + ROOMS.length - 1) % ROOMS.length)} style={{ position: 'absolute', left: 20, top: '50%', marginTop: -24, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, cursor: 'pointer', zIndex: 2 }}>‹</div>
          <div onClick={() => setRoomIdx(i => (i + 1) % ROOMS.length)} style={{ position: 'absolute', right: 20, top: '50%', marginTop: -24, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, cursor: 'pointer', zIndex: 2 }}>›</div>
        </div>

        {/* Новинки */}
        <div style={{ textAlign: 'center', margin: '96px 0 38px' }}>
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
              <img src={FAN_IMGS[i % 4]} alt="" style={{ height: 210, width: '100%', borderRadius: 12, objectFit: 'cover', display: 'block' }} />
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

        {/* Баннер-слайдер */}
        <div style={{ position: 'relative', marginTop: 90, borderRadius: 24, overflow: 'hidden', minHeight: 620, background: currentBanner.bg }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, ' + currentBanner.tint + ' 0%, rgba(20,19,17,.3) 62%, rgba(20,19,17,.1) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, minHeight: 620, maxWidth: 700, padding: '72px 100px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.66)' }}>{currentBanner.kicker}</div>
            <h3 style={{ margin: 0, fontSize: 48, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-.03em', color: '#fff', textWrap: 'pretty' }}>{currentBanner.title}</h3>
            <div style={{ fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.82)', maxWidth: 460, textWrap: 'pretty' }}>{currentBanner.text}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setNeedOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, minWidth: 340, padding: '15px 20px', borderRadius: 12, background: 'rgba(251,250,248,.96)', fontSize: 15, color: '#33322e', cursor: 'pointer' }}
                >
                  <span>{need || 'Мне нужна перегородка для…'}</span>
                  <span style={{ fontSize: 13, color: '#8b877f', transform: needOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .18s', display: 'inline-block' }}>⌄</span>
                </div>
                {needOpen && (
                  <div style={{ position: 'absolute', zIndex: 6, top: 'calc(100% + 8px)', left: 0, minWidth: 340, padding: 8, borderRadius: 16, background: '#fff', boxShadow: '0 18px 44px rgba(26,26,24,.24)', animation: 'hDrop .18s ease' }}>
                    {currentBanner.options.map(o => (
                      <div
                        key={o[0]}
                        onClick={() => { setNeed(o[0]); setNeedOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 14px', borderRadius: 10, fontSize: 14, cursor: 'pointer', color: need === o[0] ? '#1a1a18' : '#4a4842', background: need === o[0] ? '#f4f2ee' : 'transparent' }}
                      >
                        <span>{o[0]}</span>
                        {o[1] && <span style={{ fontSize: 12, color: '#a8a39a', whiteSpace: 'nowrap' }}>{o[1]}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => onNavigateToCatalog('catalog')}
                style={{ padding: '16px 34px', borderRadius: 12, fontSize: 15, fontWeight: 500, background: need ? '#fbfaf8' : 'rgba(255,255,255,.18)', color: need ? '#1a1a18' : 'rgba(255,255,255,.86)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer' }}
              >Подобрать</button>
            </div>
          </div>

          <div onClick={() => { setBannerIdx(i => (i + BANNERS.length - 1) % BANNERS.length); setNeedOpen(false); setNeed(null); }} style={{ position: 'absolute', left: 22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', zIndex: 2 }}>‹</div>
          <div onClick={() => { setBannerIdx(i => (i + 1) % BANNERS.length); setNeedOpen(false); setNeed(null); }} style={{ position: 'absolute', right: 22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', zIndex: 2 }}>›</div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {BANNERS.map((_, i) => (
              <span key={i} onClick={() => { setBannerIdx(i); setNeedOpen(false); setNeed(null); }} style={{ width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 999, background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,.45)', cursor: 'pointer', transition: 'width .25s', display: 'inline-block' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Готовые подборки ── */}
      <section id="collections" style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Готовые подборки</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Комплекты под конкретное помещение — быстрее, чем собирать поштучно</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: 216, gap: 18 }}>
          {COLLECTIONS.map((c, i) => (
            <div key={i} onClick={() => onNavigateToCatalog('catalog')} style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: 20, background: c.bg, cursor: 'pointer', ...c.span }}>
              <img src={testImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,0) 40%, rgba(20,19,17,.62) 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 22, right: 22, bottom: 20, display: 'flex', gap: 12, pointerEvents: 'none', ...(Object.keys(c.span).length > 0 ? { alignItems: 'flex-end', justifyContent: 'space-between' } : { flexDirection: 'column', alignItems: 'flex-start' }) }}>
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

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '100px 48px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px', maxWidth: 780, marginLeft: 'auto', marginRight: 'auto', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em', textWrap: 'pretty' }}>Частые вопросы — и наши ответы</h2>
          <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 22 }}>Не нашли нужное? Напишите — ответим в течение часа</div>
          <a href="#footer" style={{ display: 'inline-block', padding: '13px 28px', borderRadius: 999, background: '#1a1a18', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Задать вопрос</a>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'start', gap: 18, marginTop: 44, textAlign: 'left' }}>
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} onClick={() => setOpenFaq(open ? -1 : i)} style={{ padding: '20px 22px', borderRadius: 14, background: open ? '#fff' : '#f4f2ee', border: '1px solid ' + (open ? '#e4e0d9' : 'transparent'), cursor: 'pointer', transition: 'background .15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, fontSize: 15, fontWeight: 500, textWrap: 'pretty' }}>{f.q}</div>
                    <div style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', border: '1px solid #ddd8d1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6b6862', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>+</div>
                  </div>
                  {open && <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.6, color: '#8b877f', animation: 'hFade .2s ease', textWrap: 'pretty' }}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="footer" style={{ marginTop: 100, background: '#1a1a18', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, padding: '56px 48px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' }}>Только важные новости и лучшие предложения</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,.55)' }}>Новинки производства, инновации в мебельной продукции<br />и выгодные предложения — первыми, в вашей почте</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, padding: '16px 18px', border: '1px solid rgba(255,255,255,.18)', borderRadius: 4, fontSize: 14, color: 'rgba(255,255,255,.42)' }}>Введите вашу электронную почту</div>
              <div style={{ padding: '16px 26px', borderRadius: 4, background: 'rgba(255,255,255,.16)', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Подписаться на рассылку</div>
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
                <span key={l} onClick={() => onNavigateToCatalog('catalog')} style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', cursor: 'pointer' }}>{l}</span>
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

      {/* ── Выбор цвета фона ── */}
      <div ref={colorRef} style={{ position: 'fixed', left: 26, bottom: 26, zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {colorOpen && (
          <div style={{ marginBottom: 10, background: '#fff', borderRadius: 14, boxShadow: '0 12px 34px rgba(26,26,24,.16)', padding: '12px 14px', animation: 'hFade .15s ease', width: 310 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#8b877f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Цвет фона</div>

            {/* Ползунок оттенка */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#8b877f' }}>Оттенок</span>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: hslToHex(sliderHue, 38, sliderLight), border: '1.5px solid rgba(26,26,24,.15)', flexShrink: 0 }} />
              </div>
              <input
                type="range" className="bg-hue-slider"
                min={0} max={359} value={sliderHue}
                onChange={e => { const h = Number(e.target.value); setSliderHue(h); applyCustomColor(h, sliderLight); }}
              />
            </div>

            {/* Ползунок яркости */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#8b877f' }}>Яркость</span>
              </div>
              <input
                type="range" className="bg-light-slider"
                min={20} max={98} value={sliderLight}
                style={{ '--hue': sliderHue }}
                onChange={e => { const lv = Number(e.target.value); setSliderLight(lv); applyCustomColor(sliderHue, lv); }}
              />
            </div>

            <div style={{ fontSize: 10, fontWeight: 600, color: '#8b877f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Готовые</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
              {BG_PALETTE.map(({ color, label }) => (
                <button
                  key={color}
                  title={label}
                  onClick={() => pickBgColor(color)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', border: bgColor === color ? '2.5px solid #1a1a18' : '2px solid rgba(26,26,24,.12)',
                    background: color, cursor: 'pointer', padding: 0,
                    boxShadow: bgColor === color ? '0 0 0 2px rgba(26,26,24,.08)' : 'none',
                    transition: 'transform .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.18)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        )}
        <div
          onClick={() => setColorOpen(o => !o)}
          style={{ width: 56, height: 56, borderRadius: '50%', background: '#1a1a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 28px rgba(26,26,24,.28)', fontSize: 22, transition: 'transform .18s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          🎨
        </div>
      </div>

      {/* ── Чат-пузырь ── */}
      <div style={{ position: 'fixed', right: 26, bottom: 26, zIndex: 90, display: 'flex', alignItems: 'center', gap: 12 }}>
        {chatOpen && (
          <div style={{ padding: '14px 18px', borderRadius: 16, background: '#fff', boxShadow: '0 12px 34px rgba(26,26,24,.16)', fontSize: 14, color: '#33322e', maxWidth: 240, animation: 'hFade .2s ease' }}>Здравствуйте! Подскажем по размерам и срокам — напишите нам.</div>
        )}
        <div onClick={() => setChatOpen(o => !o)} style={{ width: 56, height: 56, flexShrink: 0, borderRadius: '50%', background: '#1a1a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 28px rgba(26,26,24,.28)', fontSize: 20, transition: 'transform .18s' }}>
          {chatOpen ? '✕' : '✉'}
        </div>
      </div>
    </div>
  );
}
