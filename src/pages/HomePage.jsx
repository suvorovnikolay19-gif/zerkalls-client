import { useState, useEffect, useRef } from 'react';
import MaterialsSection from '../components/MaterialsSection.jsx';
import heroImg from '../../assets/hero-main/hero-1.png';
import bgImg from '../../assets/background.png';
import hero2Img from '../../assets/hero-main/hero-2.png';
import hero3Img from '../../assets/hero-main/hero-3.png';
import service1Img from '../../assets/services/1.png';
import service2Img from '../../assets/services/2.png';
import service3Img from '../../assets/services/3.png';
import testImg from '../../assets/test.jpg';
import test2Img from '../../assets/test-2.jpg';
import test3Img from '../../assets/test-3.jpg';
import test4Img from '../../assets/test-4.jpg';
import bgCategoryImg from '../../assets/background-category-v2.png';
import catTestImg from '../../assets/categories/test.png';

const FAN_IMGS = [testImg, test2Img, test3Img, test4Img];

const SLIDES = [
  { title: 'Перегородки', text: 'Граница, которую почти не замечаешь.', cta: 'Перегородки', entry: 'partitions', image: hero2Img },
  { title: 'Лестницы', text: 'Лестницы, которые задают уровень интерьеру.', cta: 'Лестницы', entry: 'stairs', image: hero3Img },
  { title: 'Зеркала', text: 'У каждого интерьера — своё отражение. Найдите зеркало, которое станет частью вашей истории.', cta: 'Зеркала', entry: 'mirrors', image: heroImg },
];

const CAT_BAR = [
  { name: 'Перегородки', count: '240+ моделей', entry: 'partitions', image: hero2Img },
  { name: 'Лестницы',    count: '120+ моделей', entry: 'stairs',     image: hero3Img },
  { name: 'Зеркала',     count: '180+ моделей', entry: 'mirrors',    image: heroImg  },
  { name: 'Мебель',      count: '90+ моделей',  entry: 'catalog',    image: testImg  },
  { name: 'Услуги',      count: 'Свой цех',     entry: 'catalog',    image: service1Img },
];

const SLIDE_CATS = {
  partitions: [
    { name: 'Раздвижные',    count: '84 модели',  entry: 'partitions', image: testImg },
    { name: 'Распашные',     count: '52 модели',  entry: 'partitions', image: test2Img },
    { name: 'Стационарные',  count: '61 модель',  entry: 'partitions', image: test3Img },
    { name: 'Гармошка',      count: '24 модели',  entry: 'partitions', image: test4Img },
    { name: 'Реечные',       count: '38 моделей', entry: 'partitions', image: testImg },
  ],
  stairs: [
    { name: 'Винтовые',          count: '26 моделей', entry: 'stairs', image: test2Img },
    { name: 'Маршевые',          count: '41 модель',  entry: 'stairs', image: test3Img },
    { name: 'Модульные',         count: '33 модели',  entry: 'stairs', image: test4Img },
    { name: 'Из дуба',           count: '38 моделей', entry: 'stairs', image: testImg },
    { name: 'На металлокаркасе', count: '44 модели',  entry: 'stairs', image: test2Img },
  ],
  mirrors: [
    { name: 'Круглые',      count: '42 модели',  entry: 'mirrors', image: test3Img },
    { name: 'Овальные',     count: '38 моделей', entry: 'mirrors', image: test4Img },
    { name: 'Арочные',      count: '31 модель',  entry: 'mirrors', image: testImg },
    { name: 'С подсветкой', count: '36 моделей', entry: 'mirrors', image: test2Img },
    { name: 'Для ванной',   count: '38 моделей', entry: 'mirrors', image: test3Img },
  ],
};

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
  { name: 'Услуги', cta: 'Все услуги', entry: 'catalog', groups: [
    { name: 'Обработка металла', options: ['Лазерная резка металла', 'Лазерный труборез', 'Лазерная сварка'] },
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

const DESC = 'Каркас из профильной стали с порошковым покрытием, стекло 8 мм закалённое. Замер и монтаж входят в стоимость.';

const CARDS_V2_DATA = [
  { title: 'Лестницы', cta: 'Смотреть все', entry: 'stairs',
    items: [
      { name: 'Винтовые лестницы', desc: 'Элегантные конструкции для любого проёма — металл, дуб, нержавеющая сталь под заказ.' },
      { name: 'Маршевые лестницы', desc: 'Прямые и поворотные марши, облицовка дубом или бетоном по вашему проекту.' },
      { name: 'Модульные на металлокаркасе', desc: DESC },
    ],
    images: [catTestImg, catTestImg, catTestImg],
  },
  { title: 'Перегородки', cta: 'Смотреть все', entry: 'partitions',
    items: [
      { name: 'Раздвижные системы', desc: 'Плавный ход по рельсу, стекло 8–10 мм, регулируемые доводчики в комплекте.' },
      { name: 'Распашные с рифлёным стеклом', desc: DESC },
      { name: 'Стационарные лофт', desc: 'Жёсткая конструкция из стального профиля, идеальна для зонирования открытых пространств.' },
    ],
    images: [catTestImg, catTestImg, catTestImg],
  },
  { title: 'Зеркала', cta: 'Смотреть все', entry: 'mirrors',
    items: [
      { name: 'Арочные зеркала', desc: 'Классическая арка или нестандартная геометрия — вырезаем по эскизу за три дня.' },
      { name: 'Зеркала с подсветкой', desc: 'Тёплый или холодный LED-контур, сенсор и антизапотевание — под ключ.' },
      { name: 'Овальные в латунной раме', desc: 'Ручная сборка, полированная латунь или матовое золото на выбор.' },
    ],
    images: [catTestImg, catTestImg, catTestImg],
  },
  { title: 'Мебель', cta: 'Смотреть все', entry: 'catalog',
    items: [
      { name: 'Обеденные столы', desc: 'Массив дуба или слэб на металлических ногах — от 2 000 мм в ширину.' },
      { name: 'Консоли и полки', desc: 'Навесные и напольные консоли из стали и дерева, размер под ваш проём.' },
      { name: 'Стеллажи и стеновые системы', desc: DESC },
    ],
    images: [catTestImg, catTestImg, catTestImg],
  },
  { title: 'Услуги', cta: 'Смотреть все', entry: 'catalog',
    items: [
      { name: 'Лазерная резка металла', desc: 'Раскрой листа до 25 мм по вашим чертежам — точность 0,1 мм.' },
      { name: 'Лазерный труборез', desc: 'Резка круглой и профильной трубы, готовые узлы под сварку.' },
      { name: 'Лазерная сварка', desc: 'Аккуратный шов без поводок — сборка каркасов и рам.' },
    ],
    images: [catTestImg, catTestImg, catTestImg],
  },
];

const CARDS_V2_OFFSETS = ['0px', '-56px', '34px', '-24px', '18px'];

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

const LEVELS = [
  { name: 'Перегородки', cards: [
    { name: 'Раздвижные', count: '84 модели', price: 'от 62 000 ₽' },
    { name: 'Распашные', count: '52 модели', price: 'от 48 000 ₽' },
    { name: 'Стационарные', count: '61 модель', price: 'от 54 000 ₽' },
    { name: 'Гармошка', count: '24 модели', price: 'от 67 000 ₽' },
    { name: 'Реечные', count: '38 моделей', price: 'от 71 000 ₽' },
    { name: 'С рифлёным стеклом', count: '71 модель', price: 'от 78 000 ₽' },
    { name: 'Лофт', count: '62 модели', price: 'от 74 000 ₽' },
    { name: 'Для влажных зон', count: '14 моделей', price: 'от 82 000 ₽' },
  ]},
  { name: 'Зеркала', cards: [
    { name: 'Круглые', count: '42 модели', price: 'от 21 000 ₽' },
    { name: 'Овальные', count: '38 моделей', price: 'от 26 000 ₽' },
    { name: 'Арочные', count: '31 модель', price: 'от 34 000 ₽' },
    { name: 'В полный рост', count: '25 моделей', price: 'от 29 000 ₽' },
    { name: 'С подсветкой', count: '36 моделей', price: 'от 38 000 ₽' },
    { name: 'В латунной раме', count: '28 моделей', price: 'от 44 000 ₽' },
    { name: 'Нестандартной формы', count: '17 моделей', price: 'от 52 000 ₽' },
    { name: 'Для ванной', count: '38 моделей', price: 'от 24 000 ₽' },
  ]},
  { name: 'Лестницы', cards: [
    { name: 'Винтовые', count: '26 моделей', price: 'от 148 000 ₽' },
    { name: 'Маршевые', count: '41 модель', price: 'от 172 000 ₽' },
    { name: 'Модульные', count: '33 модели', price: 'от 96 000 ₽' },
    { name: 'С площадкой', count: '18 моделей', price: 'от 186 000 ₽' },
    { name: 'Из дуба', count: '38 моделей', price: 'от 164 000 ₽' },
    { name: 'На металлокаркасе', count: '44 модели', price: 'от 132 000 ₽' },
    { name: 'Со стеклом', count: '29 моделей', price: 'от 198 000 ₽' },
    { name: 'Для мансарды', count: '21 модель', price: 'от 88 000 ₽' },
  ]},
  { name: 'Мебель', cards: [
    { name: 'Столы', count: '34 модели', price: 'от 46 000 ₽' },
    { name: 'Консоли', count: '21 модель', price: 'от 32 000 ₽' },
    { name: 'Стеллажи', count: '27 моделей', price: 'от 54 000 ₽' },
    { name: 'Тумбы', count: '18 моделей', price: 'от 28 000 ₽' },
    { name: 'Ширмы', count: '19 моделей', price: 'от 41 000 ₽' },
    { name: 'Из массива', count: '52 модели', price: 'от 38 000 ₽' },
    { name: 'На металлокаркасе', count: '38 моделей', price: 'от 34 000 ₽' },
    { name: 'С камнем', count: '14 моделей', price: 'от 72 000 ₽' },
  ]},
];

const PT_BANNERS = [
  { kicker: 'Производство', title: 'Свой цех, а не перепродажа', text: 'Лазерная резка, стекло и сварка на одной площадке в Домодедово — контролируем каждый этап и держим срок.', tags: ['Цех 2 400 м²', 'Точность 0,1 мм', 'Срок от 10 дней'], stat: '12 лет', statLabel: 'на рынке', align: 'left', tint: 'rgba(20,19,17,.72)' },
  { kicker: 'Материалы', title: 'Дуб, сталь, латунь и стекло', text: 'Только сертифицированное сырьё с паспортами. Образцы покрытий отправляем партнёрам бесплатно.', tags: ['Массив дуба', 'Триплекс 8–10 мм', 'Порошковая покраска'], stat: '40+', statLabel: 'покрытий в палитре', align: 'right', tint: 'rgba(28,26,22,.7)' },
  { kicker: 'Партнёрам', title: 'Проект ведёт один человек', text: 'От эскиза и сметы до монтажа — личный менеджер, приоритет в производстве и защита проекта на 90 дней.', tags: ['Скидка до 32%', 'Отсрочка 45 дней', 'Гарантия 5 лет'], stat: '9 400', statLabel: 'сданных проектов', align: 'left', tint: 'rgba(18,20,22,.72)' },
];

const PT_PRIVILEGES = [
  'Дилерская скидка до 32% и защита проекта на 90 дней',
  'Агентское вознаграждение дизайнерам — до 15% с заказа',
  'Приоритет в производстве и отдельная линия срочных заказов',
  'Образцы материалов и покрытий бесплатно',
  'Готовые 3D-модели, чертежи и спецификации под ваши проекты',
  'Персональный менеджер и техподдержка на монтаже',
];

const PT_STATS = [
  { value: '32%', label: 'дилерская скидка' },
  { value: '10', label: 'дней производство' },
  { value: '240', label: 'активных партнёров' },
];

const PT_ROLES = ['Дизайнер', 'Стройка', 'Салон', 'Подрядчик'];

const STEP_MS = 6500;
const SLIDE_MS = 7000;

function pad(n) { return (n < 10 ? '0' : '') + n; }

const ROOM_ITEM_POS = [
  { left: 0, top: '4%' },
  { right: '2%', top: '16%' },
  { left: '8%', bottom: '6%' },
  { right: '18%', bottom: '4%' },
];

export default function HomePage({ onNavigateToCatalog, cartCount, onOpenCart, onOpenProfile, onOpenCheckout }) {
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [left, setLeft] = useState(4 * 86400 + 14 * 3600 + 48 * 60 + 18);
  const [colorOpen, setColorOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
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

  const [levelTab, setLevelTab] = useState(0);
  const [lvlPos, setLvlPos] = useState(0);
  const pageRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const [fanHover, setFanHover] = useState(null);
  const [fanBtnHover, setFanBtnHover] = useState(null);
  const [cardIdx, setCardIdx] = useState([0, 0, 0, 0]);
  const [cardDir, setCardDir] = useState([1, 1, 1, 1]);

  const [fitIdx, setFitIdx] = useState(0);
  const [fitOpen, setFitOpen] = useState(null);
  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const [fitValues, setFitValues] = useState({ 'Тип': 'Раздвижная', 'Цвет': 'Графит', 'Размер': '900×2100' });
  const [fitExtra, setFitExtra] = useState([]);

  const [bannerIdx, setBannerIdx] = useState(0);
  const [prevBannerIdx, setPrevBannerIdx] = useState(null);
  const [bannerDir, setBannerDir] = useState(1);
  const [prevSlideIdx, setPrevSlideIdx] = useState(null);
  const [heroDir, setHeroDir] = useState(1);
  const [needOpen, setNeedOpen] = useState(false);
  const [need, setNeed] = useState(null);

  const [stepIdx, setStepIdx] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const [roomIdx, setRoomIdx] = useState(0);

  const [ptBannerIdx, setPtBannerIdx] = useState(0);
  const [ptSent, setPtSent] = useState(false);
  const [ptRole, setPtRole] = useState('Дизайнер');
  const [chatOpen, setChatOpen] = useState(false);

  const rafRef = useRef(null);
  const t0Ref = useRef(Date.now());
  const left0Ref = useRef(4 * 86400 + 14 * 3600 + 48 * 60 + 18);
  const stepBaseRef = useRef(Date.now());
  const slideBaseRef = useRef(Date.now());
  const stepIdxRef = useRef(0);
  const stepProgressRef = useRef(0);
  const slideIdxRef = useRef(0);

  const levelTabRefs = useRef([]);
  const pillRef = useRef(null);
  const pillInitialized = useRef(false);

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
        const curr = slideIdxRef.current;
        const next = (curr + 1) % SLIDES.length;
        slideIdxRef.current = next;
        setPrevSlideIdx(curr);
        setHeroDir(1);
        setSlide(next);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Reveal + hover animations (from MainAndCatalog-v1 pattern)
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const seen = new WeakSet();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const d = el.dataset.rd || '0';
        el.style.transition = `opacity .6s cubic-bezier(.2,.8,.2,1) ${d}s, transform .6s cubic-bezier(.2,.8,.2,1) ${d}s`;
        el.style.opacity = '1';
        el.style.transform = 'none';
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    const observe = (el, delay) => {
      if (!el || seen.has(el)) return;
      const st = el.getAttribute('style') || '';
      if (st.includes('position: fixed') || st.includes('position: sticky')) return;
      seen.add(el);
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.willChange = 'opacity, transform';
      el.dataset.rd = delay.toFixed(2);
      io.observe(el);
    };

    // Skip hero (first section), animate direct children of all other sections
    Array.from(page.querySelectorAll('section')).slice(1).forEach(sec => {
      const ss = sec.getAttribute('style') || '';
      if (ss.includes('sticky') || ss.includes('fixed')) return;
      Array.from(sec.children).forEach((child, ci) => {
        const cs = child.getAttribute('style') || '';
        if (cs.includes('sticky') || cs.includes('fixed')) return;
        observe(child, ci * 0.06);
      });
    });

    const footer = page.querySelector('footer');
    if (footer) observe(footer, 0);

    // Hover animations — mirrors dc.html pattern: targets all interactive elements by cursor:pointer
    const hovered = new WeakSet();
    const addHover = () => {
      page.querySelectorAll('button, a, [style*="cursor: pointer"]').forEach(el => {
        if (hovered.has(el)) return;
        if (el.closest('#categories')) return; // fan cards have their own transform
        const st = el.getAttribute('style') || '';
        if (st.includes('transform:')) return; // skip elements with own transforms
        hovered.add(el);
        const isRound = st.includes('border-radius: 50%') || el.style.borderRadius === '50%';
        const cur = el.style.transition || '';
        el.style.transition = (cur ? cur + ', ' : '') + 'transform .26s cubic-bezier(.2,.8,.2,1), filter .26s ease';
        el.addEventListener('mouseenter', () => {
          el.style.transform = isRound ? 'scale(1.08)' : 'translateY(-2px)';
          el.style.filter = 'brightness(1.03)';
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; el.style.filter = ''; });
        el.addEventListener('mousedown', () => { el.style.transform = isRound ? 'scale(.96)' : 'translateY(0) scale(.985)'; });
        el.addEventListener('mouseup', () => { el.style.transform = isRound ? 'scale(1.08)' : 'translateY(-2px)'; });
      });
    };

    addHover();
    // Re-apply hover when DOM changes (e.g. menus open)
    const mo = new MutationObserver(addHover);
    mo.observe(page, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  useEffect(() => {
    if (prevBannerIdx === null) return;
    const t = setTimeout(() => setPrevBannerIdx(null), 600);
    return () => clearTimeout(t);
  }, [prevBannerIdx, bannerIdx]);

  useEffect(() => {
    if (prevSlideIdx === null) return;
    const t = setTimeout(() => setPrevSlideIdx(null), 600);
    return () => clearTimeout(t);
  }, [prevSlideIdx, slide]);

  useEffect(() => {
    if (!colorOpen) return;
    const handler = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setColorOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [colorOpen]);

  useEffect(() => {
    const tab = levelTabRefs.current[levelTab];
    const pill = pillRef.current;
    if (!tab || !pill) return;
    if (!pillInitialized.current) {
      pill.style.transition = 'none';
      pill.style.left = tab.offsetLeft + 'px';
      pill.style.width = tab.offsetWidth + 'px';
      pill.style.opacity = '1';
      pillInitialized.current = true;
      requestAnimationFrame(() => {
        if (pill) pill.style.transition = 'left .32s cubic-bezier(.2,.8,.2,1), width .32s cubic-bezier(.2,.8,.2,1)';
      });
    } else {
      pill.style.left = tab.offsetLeft + 'px';
      pill.style.width = tab.offsetWidth + 'px';
    }
  }, [levelTab]);

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
    <div ref={pageRef} style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', backgroundColor: '#ffffff', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: 760, background: '#23221f', overflow: 'hidden' }}>
        {prevSlideIdx !== null && (
          <div key={`sp-${prevSlideIdx}`} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', animation: `${heroDir > 0 ? 'slideOutLeft' : 'slideOutRight'} .55s cubic-bezier(.4,0,.2,1) forwards` }}>
            {SLIDES[prevSlideIdx].image
              ? <img src={SLIDES[prevSlideIdx].image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              : <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, #2e2c28 0, #2e2c28 20px, #252320 20px, #252320 40px)' }} />
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.55) 0%, rgba(20,19,17,.18) 40%, rgba(20,19,17,.6) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 48px 0', textAlign: 'center' }}>
              <h1 style={{ margin: 0, maxWidth: 'calc(100% - 200px)', fontSize: 'clamp(56px, 9vw, 132px)', lineHeight: .88, fontWeight: 600, letterSpacing: '-.04em', color: '#fff' }}>{SLIDES[prevSlideIdx].title}</h1>
              <div style={{ maxWidth: 560, fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.86)', textWrap: 'pretty' }}>{SLIDES[prevSlideIdx].text}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
                <button className="hero-btn-primary" style={{ padding: '15px 42px', background: '#fbfaf8', color: '#1a1a18', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Каталог</button>
                <button className="hero-btn-secondary" style={{ padding: '15px 42px', border: '1px solid rgba(255,255,255,.7)', color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}>{SLIDES[prevSlideIdx].cta}</button>
              </div>
            </div>
          </div>
        )}
        <div key={`sc-${slide}`} style={{ position: 'absolute', inset: 0, zIndex: 1, animation: prevSlideIdx !== null ? `${heroDir > 0 ? 'slideInRight' : 'slideInLeft'} .55s cubic-bezier(.4,0,.2,1) forwards` : 'none' }}>
          {currentSlide.image
            ? <img src={currentSlide.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            : <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, #2e2c28 0, #2e2c28 20px, #252320 20px, #252320 40px)' }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.55) 0%, rgba(20,19,17,.18) 40%, rgba(20,19,17,.6) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 48px 0', textAlign: 'center', pointerEvents: 'none' }}>
            <h1 style={{ margin: 0, maxWidth: 'calc(100% - 200px)', fontSize: 'clamp(56px, 9vw, 132px)', lineHeight: .88, fontWeight: 600, letterSpacing: '-.04em', color: '#fff' }}>{currentSlide.title}</h1>
            <div style={{ maxWidth: 560, fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.86)', textWrap: 'pretty' }}>{currentSlide.text}</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, pointerEvents: 'auto' }}>
              <button className="hero-btn-primary" onClick={() => onNavigateToCatalog('catalog')} style={{ padding: '15px 42px', background: '#fbfaf8', color: '#1a1a18', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Каталог</button>
              <button className="hero-btn-secondary" onClick={() => onNavigateToCatalog(currentSlide.entry)} style={{ padding: '15px 42px', border: '1px solid rgba(255,255,255,.7)', color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}>{currentSlide.cta}</button>
            </div>
          </div>
        </div>

        <header
          onMouseLeave={() => setActiveMenu(null)}
          style={{ position: 'relative', zIndex: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px 24px', padding: '22px clamp(16px, 3vw, 48px)', color: '#fff' }}
        >
          <div style={{ flex: 1, fontSize: 24, fontWeight: 600, letterSpacing: '-.02em' }}>objects</div>

          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', justifyContent: 'center', gap: 4, padding: 6, borderRadius: 999, background: 'rgba(26,26,24,.62)', backdropFilter: 'blur(10px)' }}>
              {MENU.map(m => (
                <div
                  key={m.name}
                  onMouseEnter={() => setActiveMenu(m.name)}
                  style={{ padding: '11px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', background: activeMenu === m.name ? 'rgba(255,255,255,.16)' : 'transparent', color: '#fff', transition: 'background .18s' }}
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

        <div onClick={() => { const curr = slideIdxRef.current; const n = (curr + SLIDES.length - 1) % SLIDES.length; setPrevSlideIdx(curr); setHeroDir(-1); slideIdxRef.current = n; slideBaseRef.current = Date.now(); setSlide(n); }} style={{ position: 'absolute', zIndex: 4, left: 24, top: '50%', width: 56, height: 56, marginTop: -28, borderRadius: '50%', background: 'rgba(26,26,24,.72)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer' }}>‹</div>
        <div onClick={() => { const curr = slideIdxRef.current; const n = (curr + 1) % SLIDES.length; setPrevSlideIdx(curr); setHeroDir(1); slideIdxRef.current = n; slideBaseRef.current = Date.now(); setSlide(n); }} style={{ position: 'absolute', zIndex: 4, right: 24, top: '50%', width: 56, height: 56, marginTop: -28, borderRadius: '50%', background: 'rgba(26,26,24,.72)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer' }}>›</div>
        <div style={{ position: 'absolute', zIndex: 4, left: 0, right: 0, bottom: 36, display: 'flex', justifyContent: 'center', gap: 9 }}>
          {SLIDES.map((_, i) => (
            <span key={i} onClick={() => { const curr = slideIdxRef.current; setPrevSlideIdx(curr); setHeroDir(i > curr ? 1 : -1); slideIdxRef.current = i; slideBaseRef.current = Date.now(); setSlide(i); }} style={{ width: i === slide ? 26 : 9, height: 9, borderRadius: 999, background: i === slide ? '#fff' : 'rgba(255,255,255,.5)', cursor: 'pointer', transition: 'width .25s', display: 'inline-block' }} />
          ))}
        </div>

      </section>

      {/* ── Меню разделов (sticky) ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6, padding: '18px 48px', background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e8e8' }}>
        {PAGE_NAV.map((n, i) => (
          n.href
            ? <a key={i} href={n.href} style={{ padding: '11px 22px', borderRadius: 999, fontSize: 17, whiteSpace: 'nowrap', textDecoration: 'none', background: n.active ? '#1a1a18' : 'transparent', color: n.active ? '#fff' : '#4a4842', transition: 'background .15s' }}>{n.name}</a>
            : <span key={i} onClick={() => onNavigateToCatalog(n.entry)} style={{ padding: '11px 22px', borderRadius: 999, fontSize: 17, whiteSpace: 'nowrap', cursor: 'pointer', background: 'transparent', color: '#4a4842', transition: 'background .15s' }}>{n.name}</span>
        ))}
      </nav>

      {/* ── Категории (cards-v2) ── */}
      <section id="categories" style={{ padding: '96px 48px 32px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 20, alignItems: 'start' }}>
            {CARDS_V2_DATA.map((card, ci) => {
              const active = cardIdx[ci];
              const dir = cardDir[ci];
              const n = card.items.length;

              const moveCard = (d) => {
                setCardIdx(prev => { const next = [...prev]; next[ci] = (next[ci] + d + n) % n; return next; });
                setCardDir(prev => { const next = [...prev]; next[ci] = d; return next; });
              };

              return (
                <article key={ci} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18, marginTop: CARDS_V2_OFFSETS[ci] }}>
                  <div style={{ position: 'relative', borderRadius: 30, overflow: 'hidden', background: '#2a2926', boxShadow: '0 34px 64px -32px rgba(26,26,24,0.55)' }}>
                    <div style={{ position: 'relative', height: 440, overflow: 'hidden', borderRadius: 30, background: '#e8e5e0' }}>

                      {card.items.map((item, i) => {
                        let rel = i - active;
                        if (rel > n / 2) rel -= n;
                        if (rel < -n / 2) rel += n;
                        const on = rel === 0;
                        const side = on ? dir : (rel > 0 ? 1 : -1);
                        const away = on ? 0 : (Math.abs(rel) === 1 ? side : side * 1.4);
                        return (
                          <div
                            key={i}
                            style={{
                              position: 'absolute', inset: 0,
                              transition: 'transform 680ms cubic-bezier(0.16,1,0.3,1), opacity 480ms ease, filter 680ms ease',
                              willChange: 'transform',
                              transform: on ? 'translate3d(0,0,0) rotate(0deg) scale(1)' : `translate3d(${away * 116}%, ${Math.abs(away) * 26}px, 0) rotate(${away * 9}deg) scale(0.8)`,
                              opacity: on ? 1 : 0,
                              filter: on ? 'blur(0px)' : 'blur(6px)',
                              zIndex: on ? 2 : 1,
                              backgroundImage: `url(${card.images[i]})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundColor: '#e8e5e0',
                            }}
                          />
                        );
                      })}

                      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, zIndex: 4, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(26,26,24,0.5), rgba(26,26,24,0))' }} />

                      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6, backdropFilter: 'blur(18px) saturate(1.15)', WebkitBackdropFilter: 'blur(18px) saturate(1.15)', maskImage: 'linear-gradient(to top, #000 45%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, #000 45%, transparent 100%)' }}>
                        <div style={{ position: 'relative', height: 320 }}>
                          {card.items.map((item, i) => {
                            const on = i === active;
                            return (
                              <div key={i} style={{ position: 'absolute', inset: 0, padding: '30px 24px 82px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 10, textAlign: 'left', pointerEvents: on ? 'auto' : 'none', opacity: on ? 1 : 0, transition: 'opacity 320ms ease', zIndex: on ? 2 : 1 }}>
                                <span style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#fff', transition: 'transform 620ms cubic-bezier(0.16,1,0.3,1), opacity 420ms ease', transitionDelay: on ? '140ms' : '0ms', transform: on ? 'translateY(0)' : 'translateY(24px)', opacity: on ? 1 : 0 }}>{item.name}</span>
                                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.76)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'transform 620ms cubic-bezier(0.16,1,0.3,1), opacity 420ms ease', transitionDelay: on ? '210ms' : '0ms', transform: on ? 'translateY(0)' : 'translateY(30px)', opacity: on ? 1 : 0 }}>{item.desc}</p>
                              </div>
                            );
                          })}
                          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 24px 24px', zIndex: 4 }}>
                            <button
                              onClick={() => onNavigateToCatalog(card.entry)}
                              style={{ width: '100%', height: 48, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.96)', color: '#1a1a18', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, letterSpacing: '0.01em', cursor: 'pointer', transition: 'background 200ms ease, transform 200ms ease' }}
                            >Смотреть ещё</button>
                          </div>
                        </div>
                      </div>

                      <div onClick={() => moveCard(-1)} style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '65%', zIndex: 7, cursor: 'pointer' }} />
                      <div onClick={() => moveCard(1)} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '65%', zIndex: 7, cursor: 'pointer' }} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Баннер после категорий ── */}
      <div style={{ lineHeight: 0 }}>
        <img src={bgCategoryImg} alt="" style={{ width: '100%', display: 'block', borderRadius: '0 0 24px 24px', boxShadow: '0 20px 60px rgba(26,26,24,0.12)' }} />
      </div>

      {/* ── Услуги ── */}
      <section style={{ padding: '52px 48px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 38 }}>
          <div style={{ fontSize: 20, color: '#8b877f', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>Благодаря собственному производству, наши</div>
          <h2 style={{ margin: 0, fontSize: 'clamp(56px, 8vw, 96px)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', lineHeight: 1, flexShrink: 0 }}>Услуги</h2>
          <div style={{ fontSize: 20, color: '#8b877f', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>Собственный цех в Домодедово — без посредников</div>
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

      {/* ── Продукция которую мы производим ── */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Продукция которую мы производим</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Выберите категорию — покажем разделы каталога и поможем с выбором</div>
        </div>

        <div style={{ padding: '56px 44px 60px', borderRadius: 28, background: '#f4f2ee', color: '#1a1a18', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 5, borderRadius: 999, background: 'rgba(26,26,24,.08)', alignSelf: 'flex-start' }}>
                {LEVELS.map((l, i) => (
                  <div
                    key={i}
                    onClick={() => { setLevelTab(i); setLvlPos(0); }}
                    style={{ padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: levelTab === i ? '#1a1a18' : 'transparent', color: levelTab === i ? '#fff' : 'rgba(26,26,24,.55)', transition: 'background .18s, color .18s', userSelect: 'none' }}
                  >{l.name}</div>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              <div style={{ fontSize: 14, color: '#8b877f' }}>Нужен совет по выбору?</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href="https://t.me" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRadius: 12, background: '#2b9fe3', color: '#fff', fontSize: 14.5, fontWeight: 500, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                  <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: 'rgba(255,255,255,.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✈</span>
                  Написать в Telegram
                </a>
                <a href="https://max.ru" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRadius: 12, background: '#7c5cf0', color: '#fff', fontSize: 14.5, fontWeight: 500, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                  <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: 'rgba(255,255,255,.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✉</span>
                  Написать в MAX
                </a>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div onClick={() => setLvlPos(p => (p + LEVELS[levelTab].cards.length - 1) % LEVELS[levelTab].cards.length)} style={{ position: 'absolute', zIndex: 3, left: -22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: '#fff', color: '#1a1a18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, cursor: 'pointer', boxShadow: '0 10px 26px rgba(0,0,0,.14)' }}>←</div>
            <div onClick={() => setLvlPos(p => (p + 1) % LEVELS[levelTab].cards.length)} style={{ position: 'absolute', zIndex: 3, right: -22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: '#fff', color: '#1a1a18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, cursor: 'pointer', boxShadow: '0 10px 26px rgba(0,0,0,.14)' }}>→</div>
            <div style={{ position: 'relative', height: 430 }}>
              {LEVELS[levelTab].cards.map((c, j) => {
                const n = LEVELS[levelTab].cards.length;
                let d = j - lvlPos;
                if (d > n / 2) d -= n;
                if (d < -n / 2) d += n;
                const ad = Math.abs(d);
                const hot = d === 0;
                const near = ad <= 1;
                return (
                  <div
                    key={`${levelTab}-${j}`}
                    onClick={() => near && !hot ? setLvlPos(j) : hot && onNavigateToCatalog('catalog')}
                    style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: 'min(560px, 92%)', height: hot ? 390 : 340,
                      display: 'flex', flexDirection: 'column',
                      borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
                      willChange: 'transform',
                      transform: `translate(calc(-50% + ${d * 340}px), -50%) scale(${hot ? 1 : 0.92})`,
                      opacity: near ? (hot ? 1 : 0.5) : 0,
                      pointerEvents: near ? 'auto' : 'none',
                      zIndex: 10 - ad,
                      background: hot ? 'linear-gradient(135deg, #2b2a26 0%, #191815 100%)' : '#1c1b18',
                      color: '#fff',
                      border: `1px solid ${hot ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.07)'}`,
                      boxShadow: hot ? '0 34px 70px rgba(0,0,0,.55)' : '0 16px 34px rgba(0,0,0,.3)',
                      transition: 'transform .5s cubic-bezier(.2,.8,.2,1), opacity .5s ease, height .5s cubic-bezier(.2,.8,.2,1), background .4s ease, box-shadow .4s ease',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '30px 30px 0' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: hot ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.09)' }}>◈</div>
                      <h3 style={{ margin: 0, fontSize: 32, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-.03em' }}>{c.name}</h3>
                      <div style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 400, textWrap: 'pretty', color: hot ? 'rgba(255,255,255,.78)' : 'rgba(255,255,255,.5)' }}>Готовые решения и изделия по вашим размерам — с монтажом и гарантией 5 лет.</div>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '18px 20px', background: hot ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 999, background: hot ? '#fff' : 'rgba(255,255,255,.12)', color: hot ? '#1a1a18' : '#fff' }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: hot ? '#1a1a18' : 'rgba(255,255,255,.2)', color: '#fff' }}>▤</span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{c.count}</span>
                        <span style={{ fontSize: 12, opacity: .6, whiteSpace: 'nowrap' }}>{c.price}</span>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 54, height: 44, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,.1)' }} />
                        <button onClick={e => { e.stopPropagation(); onNavigateToCatalog('catalog'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px 11px 12px', borderRadius: 999, fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', background: hot ? '#fff' : 'rgba(255,255,255,.12)', color: hot ? '#1a1a18' : '#fff', border: 'none', cursor: 'pointer' }}>
                          <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: hot ? '#1a1a18' : 'rgba(255,255,255,.2)', color: '#fff' }}>→</span>
                          Перейти
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Примерочная ── */}
      <section style={{ padding: '96px 48px 0' }}>
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
          <div style={{ padding: '22px 24px 26px', background: '#f7f5f1', borderTop: '1px solid #e8e4dd' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '14px 16px', borderRadius: 20, background: '#f1eee8' }}>
              <span style={{ paddingLeft: 8, fontSize: 16, color: '#33322e', whiteSpace: 'nowrap' }}>Мне нужно</span>
              {fitKeys.map(k => {
                const open = fitOpen === k;
                const isExtra = fitExtra.includes(k);
                return (
                  <div key={k} style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 10px 16px', borderRadius: 999, background: '#fff', border: '1px solid ' + (open ? '#1a1a18' : '#ddd8d1'), cursor: 'pointer' }}>
                      <span onClick={() => { setFitOpen(open ? null : k); setAddFilterOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, color: '#1a1a18', whiteSpace: 'nowrap' }}>{fitValues[k] || 'Любой'}</span>
                        <span style={{ fontSize: 13, color: '#8b877f', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .18s', display: 'inline-block' }}>⌄</span>
                      </span>
                      {isExtra && (
                        <span onClick={() => { setFitExtra(e => e.filter(x => x !== k)); setFitOpen(null); }} style={{ fontSize: 14, color: '#a8a39a', cursor: 'pointer' }}>✕</span>
                      )}
                    </div>
                    {open && (
                      <div style={{ position: 'absolute', zIndex: 6, left: 0, bottom: 'calc(100% + 10px)', minWidth: 210, padding: 8, borderRadius: 16, background: '#fff', boxShadow: '0 18px 40px rgba(26,26,24,.16)', animation: 'hDrop .18s ease' }}>
                        <div style={{ padding: '8px 12px 10px', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a8a39a' }}>{k}</div>
                        {FIT_FILTERS[k].map(o => (
                          <div key={o} onClick={() => { setFitValues(v => ({ ...v, [k]: o })); setFitOpen(null); setFitIdx(i => (i + 1) % FIT_ITEMS.length); }} style={{ padding: '11px 12px', borderRadius: 10, fontSize: 14.5, cursor: 'pointer', color: fitValues[k] === o ? '#1a1a18' : '#33322e', fontWeight: fitValues[k] === o ? 600 : 400, background: fitValues[k] === o ? '#f4f2ee' : 'transparent' }}>{o}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div onClick={() => { setAddFilterOpen(o => !o); setFitOpen(null); }} style={{ width: 46, height: 46, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, color: '#33322e', cursor: 'pointer' }}>+</div>
                {addFilterOpen && (
                  <div style={{ position: 'absolute', zIndex: 6, left: 0, bottom: 'calc(100% + 10px)', minWidth: 220, padding: 8, borderRadius: 16, background: '#fff', boxShadow: '0 18px 40px rgba(26,26,24,.16)', animation: 'hDrop .18s ease' }}>
                    {addable.length === 0
                      ? <div style={{ padding: '10px 12px', fontSize: 13, color: '#8b877f' }}>Все фильтры добавлены</div>
                      : addable.map(k => (
                        <div key={k} onClick={() => { setFitExtra(e => [...e, k]); setFitValues(v => ({ ...v, [k]: FIT_FILTERS[k][0] })); setAddFilterOpen(false); setFitIdx(i => (i + 1) % FIT_ITEMS.length); }} style={{ padding: '11px 12px', borderRadius: 10, fontSize: 14.5, color: '#33322e', cursor: 'pointer' }}>{k}</div>
                      ))
                    }
                  </div>
                )}
              </div>
              <button onClick={() => onNavigateToCatalog('catalog')} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 30px', borderRadius: 14, background: '#fff', fontSize: 15, fontWeight: 500, color: '#1a1a18', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}>Найти <span style={{ fontSize: 15 }}>→</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Стать партнёром ── */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Для партнёров</h2>
            <div style={{ fontSize: 15, color: '#8b877f' }}>Дизайнерам, салонам и подрядчикам — условия, привилегии и подключение за один день</div>
          </div>

          {/* Форма и привилегии */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30, padding: '34px 36px 36px', borderRadius: 24, background: '#1a1a18', color: '#fff' }}>
            {/* Колонка 1: QR + кнопки */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Партнёрам</div>
                <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-.03em' }}>Стать партнёром</h2>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,.62)' }}>Отсканируйте код или напишите — подключим за один день, без вступительных взносов.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, maxWidth: 300 }}>
                {[{ name: 'Telegram', color: '#2b9fe3' }, { name: 'MAX', color: '#7c5cf0' }].map(q => (
                  <div key={q.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '14px 10px 12px', borderRadius: 14, background: 'rgba(255,255,255,.07)' }}>
                    <div style={{ width: '100%', aspectRatio: 1, padding: 7, borderRadius: 10, background: '#fff' }}>
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a18', backgroundImage: 'repeating-conic-gradient(#1a1a18 0% 25%, #fff 0% 50%)', backgroundSize: '12px 12px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: q.color, display: 'inline-block' }} />
                      {q.name}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: 340 }}>
                {[{ label: 'Написать в Telegram', icon: '✈', href: 'https://t.me', color: '#2b9fe3' }, { label: 'Написать в MAX', icon: '✉', href: 'https://max.ru', color: '#7c5cf0' }].map(c => (
                  <a key={c.label} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: c.color, color: '#fff', fontSize: 14.5, fontWeight: 500, textDecoration: 'none' }}>
                    <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: 'rgba(255,255,255,.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{c.icon}</span>
                    {c.label}
                    <span style={{ marginLeft: 'auto', fontSize: 15, opacity: .7 }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Колонка 2: Привилегии + статистика */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.015em' }}>Особые привилегии</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {PT_PRIVILEGES.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <span style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, borderRadius: '50%', background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span>
                    <span style={{ minWidth: 0, fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,255,255,.84)' }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,.12)', margin: '6px 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                {PT_STATS.map(s => (
                  <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.56)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Колонка 3: Форма заявки */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em' }}>Оставьте заявку</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.58)' }}>Пришлём условия, прайс и каталог в вашем формате</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[{ label: 'Имя и фамилия', icon: '☺' }, { label: 'Компания или студия', icon: '▤' }, { label: 'Телефон', icon: '☏' }, { label: 'E-mail', icon: '✉' }].map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', border: '1px solid rgba(255,255,255,.16)', borderRadius: 12, background: 'rgba(255,255,255,.05)' }}>
                    <span style={{ flexShrink: 0, fontSize: 13.5, color: 'rgba(255,255,255,.4)' }}>{f.icon}</span>
                    <span style={{ minWidth: 0, fontSize: 14, color: 'rgba(255,255,255,.5)' }}>{f.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {PT_ROLES.map(r => (
                  <div key={r} onClick={() => setPtRole(r)} style={{ padding: '10px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', transition: 'background .18s, border-color .18s, color .18s', border: '1px solid ' + (ptRole === r ? '#fff' : 'rgba(255,255,255,.2)'), background: ptRole === r ? '#fff' : 'transparent', color: ptRole === r ? '#1a1a18' : 'rgba(255,255,255,.75)' }}>{r}</div>
                ))}
              </div>
              <button onClick={() => setPtSent(true)} style={{ padding: 17, borderRadius: 12, background: '#fff', color: '#1a1a18', fontSize: 15, fontWeight: 500, textAlign: 'center', cursor: 'pointer', border: 'none', width: '100%' }}>Отправить заявку</button>
              <div style={{ fontSize: 11.5, lineHeight: 1.5, color: 'rgba(255,255,255,.42)' }}>Нажимая кнопку, вы соглашаетесь с <a href="#" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'underline' }}>политикой конфиденциальности</a></div>
              {ptSent && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,.09)', fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,255,255,.9)', animation: 'pFade .24s ease' }}>
                  <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: '50%', background: '#fff', color: '#1a1a18', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                  Заявка отправлена — менеджер свяжется с вами и пришлёт условия.
                </div>
              )}
            </div>
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

      {/* ── Материалы и отделки ── */}
      <MaterialsSection />

      {/* ── Производство ── */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 500, letterSpacing: '-.03em' }}>Производство</h2>
          <div style={{ fontSize: 15, color: '#8b877f' }}>Собственный цех 2 400 м² в Домодедово — от раскроя до монтажа без посредников</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
          {[
            { title: 'Лазерная резка', text: 'Раскрой листа до 25 мм и профильной трубы — точность 0,1 мм, чертёж в работу за 1 день' },
            { title: 'Сварка и сборка', text: 'Лазерная сварка без поводок, аккуратный шов без зачистки, контроль технолога на каждом узле' },
            { title: 'Покраска и отделка', text: 'Порошковое покрытие 40+ цветов, масло-воск, патина — гарантия покрытия 5 лет' },
          ].map((p, i) => (
            <div key={i} style={{ padding: '36px 32px', borderRadius: 20, background: '#1a1a18', color: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' }}>{p.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,.62)' }}>{p.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLACEHOLDER_REMOVE_START ── */}
      <section style={{ padding: '96px 48px 0', display: 'none' }}>
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

        {/* Баннер-слайдер: overflow:clip на обёртке с neg.margin — карточки летят как объекты, видны до края страницы */}
        <div style={{ overflow: 'clip', margin: '12px -48px 0' }}>
         <div style={{ position: 'relative', height: 620, margin: '0 48px' }}>
          {prevBannerIdx !== null && (
            <div key={`bp-${prevBannerIdx}`} style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: BANNERS[prevBannerIdx].bg, pointerEvents: 'none', zIndex: 1, animation: `${bannerDir > 0 ? 'bannerOutToLeft' : 'bannerOutToRight'} .4s linear forwards` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, ' + BANNERS[prevBannerIdx].tint + ' 0%, rgba(20,19,17,.3) 62%, rgba(20,19,17,.1) 100%)' }} />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, height: '100%', maxWidth: 700, padding: '72px 100px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.66)' }}>{BANNERS[prevBannerIdx].kicker}</div>
                <h3 style={{ margin: 0, fontSize: 48, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-.03em', color: '#fff', textWrap: 'pretty' }}>{BANNERS[prevBannerIdx].title}</h3>
                <div style={{ fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.82)', maxWidth: 460, textWrap: 'pretty' }}>{BANNERS[prevBannerIdx].text}</div>
              </div>
            </div>
          )}
          <div key={`bc-${bannerIdx}`} style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: currentBanner.bg, zIndex: 0, animation: prevBannerIdx !== null ? `${bannerDir > 0 ? 'bannerInFromRight' : 'bannerInFromLeft'} .4s linear both` : 'none' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, ' + currentBanner.tint + ' 0%, rgba(20,19,17,.3) 62%, rgba(20,19,17,.1) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, height: '100%', maxWidth: 700, padding: '72px 100px' }}>
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
          </div>

          <div onClick={() => { const curr = bannerIdx; const n = (curr + BANNERS.length - 1) % BANNERS.length; setPrevBannerIdx(curr); setBannerDir(-1); setBannerIdx(n); setNeedOpen(false); setNeed(null); }} style={{ position: 'absolute', left: 22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', zIndex: 2 }}>‹</div>
          <div onClick={() => { const curr = bannerIdx; const n = (curr + 1) % BANNERS.length; setPrevBannerIdx(curr); setBannerDir(1); setBannerIdx(n); setNeedOpen(false); setNeed(null); }} style={{ position: 'absolute', right: 22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', zIndex: 2 }}>›</div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 3 }}>
            {BANNERS.map((_, i) => (
              <span key={i} onClick={() => { const curr = bannerIdx; setPrevBannerIdx(curr); setBannerDir(i > curr ? 1 : -1); setBannerIdx(i); setNeedOpen(false); setNeed(null); }} style={{ width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 999, background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,.45)', cursor: 'pointer', transition: 'width .25s', display: 'inline-block' }} />
            ))}
          </div>
         </div>
        </div>
      </section>

      {/* ── Готовые подборки (скрыто) ── */}
      <section id="collections" style={{ padding: '96px 48px 0', display: 'none' }}>
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

      {/* ── Баннеры перед футером ── */}
      <section style={{ padding: '96px 48px 0' }}>
        <div style={{ overflow: 'clip', margin: '0 -48px' }}>
         <div style={{ position: 'relative', height: 620, margin: '0 48px' }}>
          {prevBannerIdx !== null && (
            <div key={`bp-${prevBannerIdx}`} style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: BANNERS[prevBannerIdx].bg, pointerEvents: 'none', zIndex: 1, animation: `${bannerDir > 0 ? 'bannerOutToLeft' : 'bannerOutToRight'} .4s linear forwards` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, ' + BANNERS[prevBannerIdx].tint + ' 0%, rgba(20,19,17,.3) 62%, rgba(20,19,17,.1) 100%)' }} />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, height: '100%', maxWidth: 700, padding: '72px 100px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.66)' }}>{BANNERS[prevBannerIdx].kicker}</div>
                <h3 style={{ margin: 0, fontSize: 48, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-.03em', color: '#fff', textWrap: 'pretty' }}>{BANNERS[prevBannerIdx].title}</h3>
                <div style={{ fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.82)', maxWidth: 460, textWrap: 'pretty' }}>{BANNERS[prevBannerIdx].text}</div>
              </div>
            </div>
          )}
          <div key={`bc2-${bannerIdx}`} style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: currentBanner.bg, zIndex: 0, animation: prevBannerIdx !== null ? `${bannerDir > 0 ? 'bannerInFromRight' : 'bannerInFromLeft'} .4s linear both` : 'none' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, ' + currentBanner.tint + ' 0%, rgba(20,19,17,.3) 62%, rgba(20,19,17,.1) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, height: '100%', maxWidth: 700, padding: '72px 100px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.66)' }}>{currentBanner.kicker}</div>
              <h3 style={{ margin: 0, fontSize: 48, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-.03em', color: '#fff', textWrap: 'pretty' }}>{currentBanner.title}</h3>
              <div style={{ fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.82)', maxWidth: 460, textWrap: 'pretty' }}>{currentBanner.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <div onClick={() => setNeedOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, minWidth: 340, padding: '15px 20px', borderRadius: 12, background: 'rgba(251,250,248,.96)', fontSize: 15, color: '#33322e', cursor: 'pointer' }}>
                    <span>{need || 'Мне нужна перегородка для…'}</span>
                    <span style={{ fontSize: 13, color: '#8b877f', transform: needOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .18s', display: 'inline-block' }}>⌄</span>
                  </div>
                  {needOpen && (
                    <div style={{ position: 'absolute', zIndex: 6, top: 'calc(100% + 8px)', left: 0, minWidth: 340, padding: 8, borderRadius: 16, background: '#fff', boxShadow: '0 18px 44px rgba(26,26,24,.24)', animation: 'hDrop .18s ease' }}>
                      {currentBanner.options.map(o => (
                        <div key={o[0]} onClick={() => { setNeed(o[0]); setNeedOpen(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 14px', borderRadius: 10, fontSize: 14, cursor: 'pointer', color: need === o[0] ? '#1a1a18' : '#4a4842', background: need === o[0] ? '#f4f2ee' : 'transparent' }}>
                          <span>{o[0]}</span>
                          {o[1] && <span style={{ fontSize: 12, color: '#a8a39a', whiteSpace: 'nowrap' }}>{o[1]}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => onNavigateToCatalog('catalog')} style={{ padding: '16px 34px', borderRadius: 12, fontSize: 15, fontWeight: 500, background: need ? '#fbfaf8' : 'rgba(255,255,255,.18)', color: need ? '#1a1a18' : 'rgba(255,255,255,.86)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer' }}>Подобрать</button>
              </div>
            </div>
          </div>
          <div onClick={() => { const curr = bannerIdx; const n = (curr + BANNERS.length - 1) % BANNERS.length; setPrevBannerIdx(curr); setBannerDir(-1); setBannerIdx(n); setNeedOpen(false); setNeed(null); }} style={{ position: 'absolute', left: 22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', zIndex: 2 }}>‹</div>
          <div onClick={() => { const curr = bannerIdx; const n = (curr + 1) % BANNERS.length; setPrevBannerIdx(curr); setBannerDir(1); setBannerIdx(n); setNeedOpen(false); setNeed(null); }} style={{ position: 'absolute', right: 22, top: '50%', marginTop: -26, width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', zIndex: 2 }}>›</div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 3 }}>
            {BANNERS.map((_, i) => (
              <span key={i} onClick={() => { const curr = bannerIdx; setPrevBannerIdx(curr); setBannerDir(i > curr ? 1 : -1); setBannerIdx(i); setNeedOpen(false); setNeed(null); }} style={{ width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 999, background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,.45)', cursor: 'pointer', transition: 'width .25s', display: 'inline-block' }} />
            ))}
          </div>
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

      {/* ── Гамбургер-меню навигации ── */}
      <div style={{ position: 'fixed', left: 26, bottom: 26, zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {hamburgerOpen && (
          <div style={{ marginBottom: 10, background: '#1a1a18', borderRadius: 18, boxShadow: '0 12px 34px rgba(26,26,24,.3)', padding: 8, animation: 'hFade .18s ease', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {PAGE_NAV.map((n, i) => (
              n.href
                ? <a
                    key={i}
                    href={n.href}
                    onClick={() => setHamburgerOpen(false)}
                    style={{ display: 'block', padding: '12px 20px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none', background: n.active ? 'rgba(255,255,255,.18)' : 'transparent', color: '#fff', whiteSpace: 'nowrap', transition: 'background .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = n.active ? 'rgba(255,255,255,.18)' : 'transparent'; }}
                  >{n.name}</a>
                : <span
                    key={i}
                    onClick={() => { onNavigateToCatalog(n.entry); setHamburgerOpen(false); }}
                    style={{ display: 'block', padding: '12px 20px', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: '#fff', whiteSpace: 'nowrap', transition: 'background .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >{n.name}</span>
            ))}
          </div>
        )}
        <div
          onClick={() => setHamburgerOpen(o => !o)}
          style={{ width: 56, height: 56, borderRadius: '50%', background: '#1a1a18', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 28px rgba(26,26,24,.28)', gap: 5, transition: 'transform .18s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <span style={{ display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 2, transition: 'transform .22s', transform: hamburgerOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 2, transition: 'opacity .22s', opacity: hamburgerOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 2, transition: 'transform .22s', transform: hamburgerOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </div>
      </div>

      {/* ── Кнопка связи ── */}
      <div style={{ position: 'fixed', right: 26, bottom: 26, zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {chatOpen && (
          <>
            {[
              { icon: '✈', label: 'Telegram',       color: '#2b9fe3', href: 'https://t.me' },
              { icon: '✉', label: 'MAX',             color: '#7c5cf0', href: 'https://max.ru' },
              { icon: '☏', label: 'Позвонить',       color: '#3a8a4f', href: 'tel:+79854341133' },
              { icon: '◎', label: 'Заказать звонок', color: '#1a1a18', href: '#' },
            ].map((b, i) => (
              <a
                key={i}
                href={b.href}
                className="chat-pulse"
                title={b.label}
                style={{
                  width: 52, height: 52, borderRadius: '50%', background: b.color,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 19, flexShrink: 0, textDecoration: 'none',
                  animation: `chatBtnIn .28s cubic-bezier(.2,.8,.2,1) ${(3 - i) * 0.07}s both`,
                  boxShadow: '0 8px 22px rgba(26,26,24,.22)',
                }}
              >{b.icon}</a>
            ))}
          </>
        )}
        <div
          onClick={() => setChatOpen(o => !o)}
          className={chatOpen ? '' : 'chat-pulse'}
          style={{
            width: 56, height: 56, borderRadius: '50%', background: '#1a1a18',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: chatOpen ? 20 : 19, flexShrink: 0,
            transition: 'transform .22s, font-size .18s',
            boxShadow: '0 10px 28px rgba(26,26,24,.28)',
          }}
        >{chatOpen ? '✕' : '✉'}</div>
      </div>
    </div>
  );
}
