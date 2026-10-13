import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SLIDES, MENU, SERVICES, CARDS_V2_DATA, HOME_SUBCATS, PAGE_NAV, FIT_FILTERS, FIT_ITEMS,
  BANNERS, FAQ, FOOTER_COLS, LEVELS, LEVELS_ENTRY, PT_PRIVILEGES, PT_ROLES, FAN_IMGS,
} from './HomePage.jsx';
import { STEP_SRCS, STAGES, DIALOG } from '../components/WorkStepsSection.jsx';
import { RAW, FILTERS } from '../components/MaterialsSection.jsx';
import { TREE } from '../components/HeroTree.jsx';
import { fetchAllCategories, fetchProducts } from '../api.js';
import fitImg from '../../assets/categories-nobg/1.webp'; // та же картинка, что в примерочной на десктопе
import partTest2 from '../../assets/categories-1/partitions/test-v2.png'; // временная заглушка для карточек «Продукция», как договорились

// Мобильная главная: те же блоки и данные, что на десктопе, свёрстаны под телефон.
// Подключается в App.jsx на ширине до 767px, десктопный HomePage не трогаем.

const SLIDE_MS = 7000; // как на десктопе
const TREE_ENTRY = { mirror: 'mirrors', part: 'partitions', stairs: 'stairs', furn: 'catalog' };
const BANNER_ENTRY = ['partitions', 'stairs', 'mirrors'];
// Короткие подводки для баннеров на телефоне, полный текст показываем в раскрытом списке
const BANNER_SHORT = ['2–3 готовых решения с ценой и сроком', 'Пришлите высоту и проём — посчитаем за день', 'Любая геометрия, подсветка и рама'];
const BANNER_IMGS = ['Перегородки', 'Лестницы', 'Зеркала'].map(t => CARDS_V2_DATA.find(c => c.title === t)?.images?.[0]);
const PRODUCTION = [
  { title: 'Лазерная резка', text: 'Раскрой листа до 25 мм и профильной трубы — точность 0,1 мм, чертёж в работу за 1 день' },
  { title: 'Сварка и сборка', text: 'Лазерная сварка без поводок, аккуратный шов без зачистки, контроль технолога на каждом узле' },
  { title: 'Покраска и отделка', text: 'Порошковое покрытие 40+ цветов, масло-воск, патина — гарантия покрытия 5 лет' },
];
const MATERIALS = RAW.flatMap(g => g.items.map(([code, name, css]) => ({ code, name, css, section: g.s, group: g.g, tone: g.tone })));
const NAV_HREF = { '#collections': '#products' };

const CSS = `
.hm { font-family: 'Golos Text', Helvetica, sans-serif; color: #1a1a18; background: #fff; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
.hm *, .hm *::before, .hm *::after { box-sizing: border-box; }
.hm button { font-family: inherit; cursor: pointer; }
.hm a { color: inherit; text-decoration: none; }
.hm h2 { margin: 0; font-size: 28px; line-height: 1.1; font-weight: 500; letter-spacing: -.03em; }
.hm .sub { margin: 0; font-size: 14px; line-height: 1.45; color: #8b877f; }
.hm .head { display: flex; flex-direction: column; gap: 8px; padding: 0 16px; text-align: center; }
.hm section { padding-top: 48px; }
.hm .strip { display: flex; gap: 10px; padding: 0 16px; scroll-padding: 0 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.hm .strip::-webkit-scrollbar { display: none; }
.hm .strip > * { scroll-snap-align: start; flex: none; }
.hm .dots { display: flex; justify-content: center; gap: 6px; }
.hm .dots i { width: 6px; height: 6px; border-radius: 999px; background: #dcd8d1; transition: width .25s, background .25s; }
.hm .dots i.on { width: 22px; background: #1a1a18; }
.hm .dots.light i { background: rgba(255,255,255,.45); } .hm .dots.light i.on { background: #fff; }
.hm .chips { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.hm .chips::-webkit-scrollbar { display: none; }
.hm .chip { flex: none; height: 40px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; border: 1px solid #e0dcd5; background: #fff; font-size: 13.5px; color: #33322e; white-space: nowrap; }
.hm .chip.on { border-color: #1a1a18; }
.hm .chip.dark { background: #1a1a18; color: #fff; border-color: #1a1a18; }
.hm .pill { display: inline-flex; align-items: center; justify-content: center; height: 48px; padding: 0 22px; border-radius: 999px; font-size: 14.5px; font-weight: 500; border: 1px solid #e0dcd5; background: #fff; color: #33322e; }
.hm .pill.primary { background: #1a1a18; color: #fff; border-color: #1a1a18; }
.hm .pill.white { background: #fff; color: #1a1a18; border-color: #fff; }
.hm .round { width: 44px; height: 44px; border-radius: 999px; border: 0; display: inline-flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 6px 20px rgba(26,26,24,.12); }
.hm .round.ghost { background: rgba(20,19,17,.5); border: 1px solid rgba(255,255,255,.25); box-shadow: none; }
.hm .round.soft { background: rgba(251,250,248,.92); box-shadow: none; width: 36px; height: 36px; }
.hm .card { position: relative; border-radius: 22px; overflow: hidden; background: #2a2926; color: #fff; }
.hm .card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hm .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,19,17,0) 35%, rgba(20,19,17,.82) 100%); }
.hm .tags { display: flex; flex-wrap: wrap; gap: 6px; }
.hm .tag { padding: 6px 11px; border-radius: 999px; background: rgba(255,255,255,.22); font-size: 12px; backdrop-filter: blur(4px); }

/* Hero: фото на весь экран, снизу белый лист с разделами; по тапу на раздел лист поднимается */
.hm-hero { position: relative; height: 100svh; min-height: 560px; max-height: 920px; background: #fff; overflow: hidden; color: #fff; }
.hm-hero .pic { position: absolute; left: 0; right: 0; top: 0; background: #23221f; overflow: hidden; }
.hm-hero .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 55% center; transition: opacity .5s ease; }
.hm-hero .veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,19,17,.5) 0%, rgba(20,19,17,.05) 30%, rgba(20,19,17,.45) 100%); }
.hm-hero .story { position: absolute; left: 16px; right: 16px; top: 14px; display: flex; gap: 5px; z-index: 2; }
.hm-hero .story i { flex: 1; height: 3px; border-radius: 999px; background: rgba(255,255,255,.35); overflow: hidden; position: relative; }
.hm-hero .story i.done { background: #fff; }
.hm-hero .story i b { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: #fff; border-radius: 999px; transform-origin: left; animation: storyFill linear forwards; }
@keyframes storyFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .hm-hero .story i b { animation: none; transform: none; } }
.hm-top { position: relative; display: flex; align-items: center; justify-content: space-between; height: 48px; margin-top: 30px; padding: 0 16px; z-index: 2; }
.hm-top .logo { font-size: 24px; font-weight: 700; letter-spacing: -.03em; }
.hm-top .acts { display: flex; gap: 8px; }
.hm-top .ico { width: 44px; height: 44px; border-radius: 999px; border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.18); display: inline-flex; align-items: center; justify-content: center; color: #fff; }
.hm-hero .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); margin: -1px; }
.hm-hero .txt { position: absolute; left: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; transition: top .45s cubic-bezier(.2,.8,.2,1); }
.hm-hero .txt small { font-size: 11px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.75); }
.hm-hero h1 { margin: 0; font-size: 52px; line-height: .95; font-weight: 500; letter-spacing: -.045em; transition: font-size .45s; }
.hm-hero .txt p { margin: 0; font-size: 15px; line-height: 1.45; color: rgba(255,255,255,.88); max-width: 280px; transition: opacity .3s; }
.hm-hero .swipe { position: absolute; right: 20px; display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,.7); font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; transition: opacity .3s; }

/* Белый лист */
.hm-sheet { position: absolute; left: 0; right: 0; bottom: 0; background: #fff; color: #1a1a18; border-radius: 32px 32px 0 0; box-shadow: 0 -16px 40px rgba(20,19,17,.25); padding: 10px 20px max(20px, env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 18px; transition: height .45s cubic-bezier(.2,.8,.2,1); overflow: visible; }
.hm-sheet .grip { align-self: center; width: 76px; height: 40px; margin-top: -30px; border-radius: 999px; background: #fff; border: 1px solid #e6e3dc; box-shadow: 0 6px 20px rgba(26,26,24,.14); flex: none; padding: 0; display: inline-flex; align-items: center; justify-content: center; position: relative; z-index: 2; }
.hm-sheet .grip svg { transition: transform .4s cubic-bezier(.2,.8,.2,1); }
.hm-sheet[data-open="true"] .grip svg { transform: rotate(180deg); }
.hm-sheet .row { display: flex; align-items: center; justify-content: space-between; }
.hm-sheet .row b { font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
.hm-sheet .row a, .hm-sheet .row button.link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: #6f6b64; background: none; border: 0; padding: 0; }
.hm-sheet .secs { display: flex; gap: 10px; margin: 0 -20px; padding: 2px 20px 6px; overflow-x: auto; scrollbar-width: none; }
.hm-sheet .secs::-webkit-scrollbar { display: none; }
.hm-sheet .sec { flex: none; width: 172px; display: flex; align-items: center; gap: 10px; padding: 12px 12px 12px 10px; border-radius: 18px; background: #fff; border: 1px solid #e6e3dc; box-shadow: 0 4px 14px rgba(26,26,24,.07); color: #1a1a18; text-align: left; font-family: inherit; }
.hm-sheet .sec .ic { flex: none; width: 42px; height: 42px; border-radius: 999px; background: #f1efea; display: inline-flex; align-items: center; justify-content: center; }
.hm-sheet .sec .t { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.hm-sheet .sec .t b { font-size: 14px; font-weight: 600; letter-spacing: -.01em; }
.hm-sheet .sec .t span { font-size: 11px; color: #8b877f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hm-sheet .big { flex: none; display: flex; align-items: center; justify-content: center; gap: 8px; height: 54px; border-radius: 999px; border: 0; background: #1a1a18; color: #fff; font-size: 15px; font-weight: 600; }
.hm-sheet .line { flex: none; display: flex; align-items: center; justify-content: center; gap: 8px; height: 54px; border-radius: 999px; border: 1.5px solid #1a1a18; background: #fff; color: #1a1a18; font-size: 15px; font-weight: 600; }
.hm-sheet .note { margin: 0; text-align: center; font-size: 13px; line-height: 1.45; color: #8b877f; }
/* Раскрытый раздел */
.hm-sheet .icons { display: flex; gap: 8px; flex: none; }
.hm-sheet .icons button { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; background: none; border: 0; padding: 0; color: #1a1a18; font-size: 11px; font-weight: 500; letter-spacing: -.01em; }
.hm-sheet .icons button i { width: 58px; height: 58px; border-radius: 20px; background: #f1efea; display: inline-flex; align-items: center; justify-content: center; transition: background .2s; }
.hm-sheet .icons button.on { font-weight: 700; } .hm-sheet .icons button.on i { background: #1a1a18; color: #fff; }
.hm-sheet .hr { height: 1px; background: #ecebe7; flex: none; }
.hm-sheet .row h3 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -.02em; }
.hm-sheet .scroll { display: flex; flex-direction: column; gap: 18px; overflow-y: auto; margin: 0 -20px; padding: 0 20px; flex: 1; min-height: 0; }
.hm-sheet .grp { display: flex; flex-direction: column; gap: 10px; }
.hm-sheet .grp small { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #8b877f; }
.hm-sheet .grp .wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.hm-sheet .grp button { display: inline-flex; align-items: center; height: 40px; padding: 0 14px 0 10px; border-radius: 999px; border: 0; background: #f1efea; color: #1a1a18; font-size: 14px; font-weight: 500; }
.hm-sheet .back { display: inline-flex; align-items: center; gap: 4px; height: 36px; padding: 0 12px 0 8px; border-radius: 999px; border: 1px solid #e6e3dc; background: #fff; color: #1a1a18; font-size: 13px; font-weight: 600; }
.hm-sheet .scrollwrap { position: relative; flex: 1; min-height: 0; display: flex; overflow: hidden; margin: 0 -20px; padding: 0 20px 0 20px; }
.hm-sheet .scrollwrap .scroll { flex: 1; margin: 0; padding: 0 0 0 6px; scrollbar-width: none; }
.hm-sheet .scrollwrap .scroll::-webkit-scrollbar { display: none; }
.hm-sheet .fade { position: absolute; left: 0; right: 0; height: 28px; pointer-events: none; transition: opacity .2s; }
.hm-sheet .fade.top { top: 0; background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0) 100%); }
.hm-sheet .fade.bot { bottom: 0; background: linear-gradient(0deg, #fff 0%, rgba(255,255,255,0) 100%); }
.hm-sheet .track { position: absolute; left: 10px; top: 4px; bottom: 4px; width: 3px; border-radius: 999px; background: #efede8; pointer-events: none; }
.hm-sheet .track b { position: absolute; left: 0; width: 3px; border-radius: 999px; background: #1a1a18; transition: top .08s linear; }
.hm-sheet .grp button img { width: 22px; height: 22px; object-fit: contain; margin-right: 8px; }
.hm-sheet .ai { flex: none; display: flex; align-items: center; justify-content: center; gap: 6px; height: 44px; background: none; border: 0; font-size: 14px; font-weight: 600; color: #6f6b64; }

/* Дерево подбора по тапу */
.hm-tree { position: fixed; inset: 0; z-index: 70; background: rgba(14,13,11,.86); backdrop-filter: blur(6px); color: #fff; display: flex; flex-direction: column; animation: dcFade .2s ease; }
.hm-tree .body { flex: 1; overflow-y: auto; padding: 24px 20px 120px; display: flex; flex-direction: column; gap: 18px; }
.hm-tree .q { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
.hm-tree .q small { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.hm-tree .q h2 { font-size: 26px; font-weight: 600; letter-spacing: -.02em; color: #fff; }
.hm-tree .path { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.hm-tree .path button { height: 34px; padding: 0 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.1); color: #fff; font-size: 12.5px; }
.hm-tree .opts { display: flex; flex-direction: column; gap: 8px; }
.hm-tree .opt { display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,.55); background: rgba(22,21,15,.3); color: #fff; font-size: 14px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; text-align: left; }
.hm-tree .opt.done { background: #fff; color: #16150f; border-color: #fff; }
.hm-tree .prog { position: absolute; left: 20px; right: 20px; bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
.hm-tree .prog div { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.7); }
.hm-tree .bar { height: 2px; background: rgba(255,255,255,.2); border-radius: 999px; } .hm-tree .bar i { display: block; height: 2px; background: #fff; border-radius: 999px; transition: width .3s; }

/* Липкое меню разделов */
.hm-nav { position: sticky; top: 0; z-index: 40; display: flex; gap: 4px; padding: 10px 16px; border-bottom: 1px solid #e8e8e8; background: rgba(255,255,255,.97); backdrop-filter: blur(12px); overflow-x: auto; scrollbar-width: none; }
.hm-nav::-webkit-scrollbar { display: none; }
.hm-nav a { flex: none; height: 40px; padding: 0 16px; display: inline-flex; align-items: center; border-radius: 999px; color: #4a4842; font-size: 14.5px; white-space: nowrap; }
.hm-nav a.on { background: #1a1a18; color: #fff; }

/* Категории */
.hm-cats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 0 16px; }
.hm-cat { aspect-ratio: 1; border-radius: 20px; }
.hm-cat .bot { position: absolute; left: 0; right: 0; bottom: 0; padding: 0 14px 14px; }
.hm-cat .name { font-size: 18px; font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }
.hm-subs { display: flex; flex-direction: column; gap: 10px; padding: 0 16px; }
.hm-subs small { font-size: 13px; color: #8b877f; }

/* Услуги: фото на всю карточку, текст поверх */
.hm-srvs { display: flex; flex-direction: column; gap: 10px; padding: 0 16px; }
.hm-srv { position: relative; display: flex; flex-direction: column; min-height: 150px; border-radius: 20px; overflow: hidden; background: #1a1a18; color: #fff; text-align: left; border: 0; padding: 14px 16px 14px; font-family: inherit; }
.hm-srv img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.hm-srv i { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(26,26,24,.86) 0%, rgba(26,26,24,.62) 50%, rgba(26,26,24,.25) 100%); }
.hm-srv .txt { position: relative; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.hm-srv h3 { margin: 0; font-size: 18px; line-height: 1.1; font-weight: 600; letter-spacing: -.02em; max-width: 78%; }
.hm-srv p { margin: 0; font-size: 12.5px; line-height: 1.4; color: rgba(255,255,255,.8); max-width: 80%; }
.hm-srv .tags { margin-top: auto; padding-top: 10px; gap: 5px; }
.hm-srv .tag { padding: 5px 9px; font-size: 11px; background: rgba(255,255,255,.2); backdrop-filter: blur(4px); }
.hm-tabs { display: flex; padding: 0 16px; overflow-x: auto; scrollbar-width: none; }
.hm-tabs::-webkit-scrollbar { display: none; }
.hm-tabs div { width: 100%; display: flex; gap: 4px; padding: 5px; border-radius: 999px; background: rgba(26,26,24,.08); }
.hm-tabs button { flex: 1 1 auto; min-width: 0; height: 36px; padding: 0 8px; border-radius: 999px; border: 0; background: transparent; color: #4a4842; font-size: 12px; font-weight: 500; white-space: nowrap; }
.hm-tabs button.on { background: #1a1a18; color: #fff; }
.hm-prod { width: 300px; height: 420px; background: #1a1a18; }
.hm-prod .bot { position: absolute; left: 0; right: 0; bottom: 0; padding: 60px 18px 18px; background: linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,.9) 45%); display: flex; flex-direction: column; gap: 6px; }
.hm-prod .cnt { font-size: 12px; font-weight: 600; letter-spacing: .02em; color: rgba(255,255,255,.5); }
.hm-prod h3 { margin: 0; font-size: 24px; line-height: 1.06; font-weight: 600; letter-spacing: -.03em; }
.hm-prod p { margin: 0 0 8px; font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,.65); }

/* Примерочная */
.hm-fit { margin: 0 16px; border-radius: 22px; overflow: hidden; background: #fff; border: 1px solid #ece9e4; }
.hm-fit .pic { position: relative; height: 360px; background: #ffffff; overflow: hidden; }
.hm-fit .pic img { position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; object-fit: contain; padding: 16px 16px 70px; pointer-events: none; transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .45s ease; }
.hm-fit .n { position: absolute; left: 16px; top: 14px; padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,.92); font-size: 12px; color: #6b6862; }
.hm-fit .arr { position: absolute; bottom: 14px; border: 1px solid #e0dcd5; z-index: 2; } .hm-fit .arr.l { left: 12px; } .hm-fit .arr.r { right: 12px; }
.hm-fit .cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 40px 72px 16px; background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.95) 60%); display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
.hm-fit .cap b { font-size: 16px; font-weight: 600; letter-spacing: -.01em; } .hm-fit .cap span { font-size: 14px; color: #6b6862; }
.hm-fit .ctl { display: flex; flex-direction: column; gap: 10px; padding: 14px 12px; border-top: 1px solid #e8e4dd; }
.hm-fit .ctl small { font-size: 13px; color: #8b877f; padding-left: 4px; }
.hm-fit .add { width: 40px; padding: 0; justify-content: center; font-size: 18px; }
.hm-fit .go { display: flex; align-items: center; justify-content: center; height: 48px; border-radius: 12px; background: #1a1a18; color: #fff; font-size: 14.5px; font-weight: 500; border: 0; }

/* Партнёры: светлый вариант без подложки и QR */
.hm-pt { padding: 0 16px; display: flex; flex-direction: column; gap: 18px; }
.hm-pt .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.hm-pt .stats div { display: flex; flex-direction: column; gap: 2px; padding: 14px 12px; border-radius: 14px; background: #f7f6f3; }
.hm-pt .stats b { font-size: 24px; font-weight: 600; letter-spacing: -.02em; } .hm-pt .stats span { font-size: 11.5px; line-height: 1.3; color: #6b6862; }
.hm-pt h3 { margin: 0; font-size: 22px; line-height: 1.1; font-weight: 600; letter-spacing: -.02em; }
.hm-pt p { margin: 0; font-size: 14.5px; line-height: 1.5; color: #6b6862; }
.hm-pt .msgs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.hm-pt .msg { display: flex; align-items: center; justify-content: center; height: 50px; border-radius: 999px; color: #fff; font-size: 14.5px; font-weight: 500; }
.hm-pt .acc { border-radius: 14px; border: 1px solid #ece9e4; background: #fff; padding: 0 16px; }
.hm-pt .acc-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 56px; padding: 0; border: 0; background: none; font-size: 15px; font-weight: 600; color: #1a1a18; text-align: left; }
.hm-pt .acc-head i { width: 28px; height: 28px; border-radius: 999px; border: 1px solid #ddd8d1; display: inline-flex; align-items: center; justify-content: center; flex: none; }
.hm-pt .privs { display: flex; flex-direction: column; border-top: 1px solid #ece9e4; padding-bottom: 4px; }
.hm-pt .priv { display: flex; gap: 12px; padding: 11px 0; border-bottom: 1px solid #ece9e4; font-size: 14px; line-height: 1.45; color: #33322e; }
.hm-pt .priv:last-child { border-bottom: 0; }
.hm-pt .priv svg { flex: none; margin-top: 1px; }
.hm-pt .form { display: flex; flex-direction: column; gap: 12px; padding: 20px 16px; border-radius: 18px; border: 1px solid #ece9e4; background: #fbfaf8; }
.hm-pt label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #8b877f; }
.hm-pt input { height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid #e6e2dc; background: #fff; color: #1a1a18; font-size: 16px; font-family: inherit; outline: none; }
.hm-pt input:focus { border-color: #1a1a18; }
.hm-pt .roles { display: flex; flex-wrap: wrap; gap: 6px; }
.hm-pt .roles button { height: 38px; padding: 0 14px; border-radius: 999px; border: 1px solid #e0dcd5; background: #fff; color: #33322e; font-size: 13px; }
.hm-pt .roles button.on { background: #1a1a18; color: #fff; border-color: #1a1a18; }
.hm-pt .send { height: 52px; border-radius: 12px; border: 0; background: #1a1a18; color: #fff; font-size: 15px; font-weight: 500; }
.hm-pt .ok { display: flex; gap: 10px; padding: 12px 14px; border-radius: 12px; background: #f1eee9; font-size: 13.5px; line-height: 1.45; color: #33322e; }
.hm-pt .fine { font-size: 11.5px; line-height: 1.5; color: #a8a39a; }

/* Путь заказа */
.hm-steps { margin-top: 48px; padding: 44px 16px; background: #05060a; color: #e7eef3; display: flex; flex-direction: column; gap: 22px; }
.hm-steps .k { font-size: 11px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.7); }
.hm-steps h2 { color: #fff; font-size: 30px; line-height: 1.05; }
.hm-steps .dlg { display: flex; flex-direction: column; gap: 6px; }
.hm-steps .dlg span { max-width: 78%; padding: 10px 14px; font-size: 14px; }
.hm-steps .dlg .us { align-self: flex-end; border-radius: 16px 16px 4px 16px; background: #2aabee; color: #fff; }
.hm-steps .dlg .them { align-self: flex-start; border-radius: 16px 16px 16px 4px; background: rgba(255,255,255,.1); }
.hm-steps ol { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; }
.hm-steps li { display: grid; grid-template-columns: 36px 64px minmax(0, 1fr); gap: 12px; padding: 14px 0; border-top: 1px solid rgba(255,255,255,.1); }
.hm-steps li .n { font-size: 12px; font-weight: 600; color: #fff; padding-top: 4px; font-family: 'JetBrains Mono', ui-monospace, monospace; }
.hm-steps li img { width: 64px; height: 64px; border-radius: 8px; object-fit: cover; }
.hm-steps li b { display: block; font-size: 15px; font-weight: 500; color: #fff; margin-bottom: 3px; }
.hm-steps li span.t { font-size: 13px; line-height: 1.45; color: rgba(231,238,243,.6); }
.hm-steps .more { display: flex; align-items: center; justify-content: center; gap: 10px; height: 50px; border-radius: 999px; border: 1px solid rgba(231,238,243,.3); background: none; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
.hm-steps .cta { display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 12px; background: #fff; color: #05060a; font-size: 14px; font-weight: 600; }

/* Материалы */
.hm-mat { padding: 0 16px; display: flex; flex-direction: column; gap: 16px; }
.hm-mat .prev { position: relative; height: 240px; border-radius: 20px; overflow: hidden; }
.hm-mat .mode { position: absolute; top: 14px; left: 14px; display: flex; flex-direction: column; gap: 6px; }
.hm-mat .mode button { width: 36px; height: 36px; border-radius: 999px; border: 0; background: rgba(255,255,255,.5); display: inline-flex; align-items: center; justify-content: center; }
.hm-mat .mode button.on { background: #fff; }
.hm-mat .cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 16px 18px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; color: #fff; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 100%); }
.hm-mat .cap b { display: block; font-size: 20px; font-weight: 600; } .hm-mat .cap small { font-size: 12px; color: rgba(255,255,255,.8); }
.hm-mat .cnt { display: flex; align-items: center; gap: 10px; font-size: 13px; font-style: italic; }
.hm-mat .cnt button { background: none; border: 0; color: #fff; padding: 4px; }
.hm-mat .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.hm-mat .sw { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 8px; border-radius: 16px; border: 1px solid #ece9e4; background: #fff; }
.hm-mat .sw.on { border: 1.5px solid #1a1a18; }
.hm-mat .sw i { width: 64px; height: 64px; border-radius: 999px; }
.hm-mat .sw span { font-size: 12.5px; font-weight: 500; text-align: center; line-height: 1.15; min-height: 28px; display: flex; align-items: center; }
.hm-mat .center { display: flex; justify-content: center; }

/* Производство, FAQ, баннер */
.hm-prodn { padding: 0 16px; display: flex; flex-direction: column; gap: 10px; }
.hm-prodn div { display: flex; flex-direction: column; gap: 8px; padding: 22px 20px; border-radius: 18px; background: #1a1a18; color: #fff; }
.hm-prodn b { font-size: 19px; font-weight: 500; letter-spacing: -.01em; } .hm-prodn p { margin: 0; font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,.62); }
.hm-faq { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
.hm-faq .item { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 14px; background: #fff; border: 1px solid #ece9e4; cursor: pointer; }
.hm-faq .item.open { border-color: #e4e0d9; }
.hm-faq .row { display: flex; align-items: center; gap: 12px; }
.hm-faq .row span { flex: 1; font-size: 15px; font-weight: 500; }
.hm-faq .row i { width: 28px; height: 28px; border-radius: 999px; border: 1px solid #ddd8d1; display: inline-flex; align-items: center; justify-content: center; }
.hm-faq p { margin: 0; font-size: 14px; line-height: 1.55; color: #8b877f; }
.hm-bans { display: flex; flex-direction: column; gap: 10px; padding: 0 16px; }
.hm-ban { position: relative; display: flex; flex-direction: column; min-height: 150px; border-radius: 20px; overflow: hidden; color: #fff; }
.hm-ban > img { position: absolute; right: 0; top: 0; width: 46%; height: 100%; object-fit: cover; }
.hm-ban .veil { position: absolute; inset: 0; }
.hm-ban .in { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 16px; width: 66%; }
.hm-ban .in.wide { width: 100%; }
.hm-ban .k { font-size: 10.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.hm-ban h3 { margin: 0; font-size: 18px; line-height: 1.08; font-weight: 600; letter-spacing: -.02em; text-wrap: balance; }
.hm-ban p { margin: 0; font-size: 12.5px; line-height: 1.4; color: rgba(255,255,255,.75); }
.hm-ban .go { margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 999px; border: 0; background: #fff; color: #1a1a18; font-size: 13px; font-weight: 500; }
.hm-ban .list { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; padding: 6px; border-radius: 14px; background: rgba(255,255,255,.1); backdrop-filter: blur(8px); animation: hFade .2s ease; }
.hm-ban .list button { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 42px; padding: 0 12px; border-radius: 10px; border: 0; background: none; color: #fff; font-size: 13.5px; text-align: left; }
.hm-ban .list button.on { background: #fff; color: #1a1a18; }
.hm-ban .list small { font-size: 11.5px; color: rgba(255,255,255,.55); white-space: nowrap; }
.hm-ban .list button.on small { color: #8b877f; }
.hm-ban .acts { display: flex; gap: 8px; margin-top: 8px; }
.hm-ban .acts .go { margin-top: 0; flex: 1; justify-content: center; }
.hm-ban .acts .cancel { height: 36px; padding: 0 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,.35); background: none; color: #fff; font-size: 13px; }

/* Футер */
.hm-foot { margin-top: 56px; background: #1a1a18; color: #fff; }
.hm-foot .sub { display: flex; flex-direction: column; gap: 14px; padding: 32px 16px; border-bottom: 1px solid rgba(255,255,255,.1); color: #fff; }
.hm-foot .sub b { font-size: 20px; font-weight: 500; letter-spacing: -.01em; line-height: 1.2; }
.hm-foot .sub p { margin: 0; font-size: 13px; line-height: 1.55; color: rgba(255,255,255,.55); }
.hm-foot input[type=email] { height: 50px; padding: 0 16px; border-radius: 6px; border: 1px solid rgba(255,255,255,.18); background: transparent; color: #fff; font-size: 16px; font-family: inherit; outline: none; width: 100%; }
.hm-foot .sub button { height: 50px; border-radius: 6px; border: 0; background: rgba(255,255,255,.16); color: #fff; font-size: 14px; font-weight: 500; }
.hm-foot .agree { display: flex; align-items: flex-start; gap: 10px; font-size: 12px; line-height: 1.5; color: rgba(255,255,255,.55); }
.hm-foot .agree input { width: 18px; height: 18px; margin: 1px 0 0; flex: none; }
.hm-foot .info { display: flex; flex-direction: column; gap: 22px; padding: 30px 16px 28px; }
.hm-foot .brand { align-self: flex-start; padding: 8px 14px; background: #fff; color: #1a1a18; font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
.hm-foot .cont { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; font-size: 13px; line-height: 1.4; }
.hm-foot .cont div { display: flex; flex-direction: column; gap: 2px; } .hm-foot .cont small { color: rgba(255,255,255,.5); font-size: 13px; }
.hm-foot .cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 16px; font-size: 13.5px; }
.hm-foot .cols div { display: flex; flex-direction: column; gap: 10px; } .hm-foot .cols b { font-size: 15px; font-weight: 500; } .hm-foot .cols a { color: rgba(255,255,255,.62); }
.hm-foot .cols .soc { flex-direction: row; display: flex; gap: 8px; } .hm-foot .soc a { width: 40px; height: 40px; border-radius: 999px; border: 1px solid rgba(255,255,255,.22); display: inline-flex; align-items: center; justify-content: center; font-size: 12px; color: rgba(255,255,255,.7); }
.hm-foot .low { display: flex; flex-direction: column; gap: 10px; padding: 20px 16px 96px; border-top: 1px solid rgba(255,255,255,.1); font-size: 12px; line-height: 1.5; color: rgba(255,255,255,.45); }
.hm-foot .low div { display: flex; gap: 16px; } .hm-foot .low a { color: rgba(255,255,255,.45); }

/* Плавающие кнопки и меню */
.hm-fab { position: fixed; bottom: 14px; z-index: 55; width: 52px; height: 52px; border-radius: 999px; border: 0; display: inline-flex; align-items: center; justify-content: center; opacity: 0; transform: translateY(16px) scale(.9); pointer-events: none; transition: opacity .25s, transform .25s; }
.hm-fab.show { opacity: 1; transform: none; pointer-events: auto; }
.hm-fab.menu { left: 14px; background: #1a1a18; box-shadow: 0 10px 28px rgba(26,26,24,.28); }
.hm-fab.tg { right: 14px; width: 56px; height: 56px; background: #2aabee; box-shadow: 0 10px 32px rgba(34,158,217,.38); }
.hm-menu { position: fixed; inset: 0; z-index: 70; background: #fbfaf8; display: flex; flex-direction: column; animation: dcFade .18s ease; }
.hm-menu .body { flex: 1; overflow-y: auto; padding: 8px 16px 0; display: flex; flex-direction: column; gap: 24px; }
.hm-menu .row { display: flex; align-items: center; gap: 14px; height: 64px; border-bottom: 1px solid #ece9e4; background: none; border-left: 0; border-right: 0; border-top: 0; padding: 0; text-align: left; width: 100%; }
.hm-menu .row img { width: 52px; height: 52px; border-radius: 12px; object-fit: cover; }
.hm-menu .row span { flex: 1; font-size: 19px; font-weight: 600; letter-spacing: -.02em; }
.hm-menu .row.sm { height: 56px; border: 0; } .hm-menu .row.sm span { font-size: 17px; font-weight: 500; color: #33322e; }
.hm-menu .links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 16px; font-size: 15px; }
.hm-menu .links a { color: #33322e; }
.hm-menu .bot { display: flex; flex-direction: column; gap: 8px; padding: 16px 16px max(24px, env(safe-area-inset-bottom)); border-top: 1px solid #ece9e4; background: #fff; }
.hm-menu .bot .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.hm-menu .bot small { font-size: 12.5px; color: #8b877f; text-align: center; }
`;

const Ic = ({ d, s = 16, c = 'currentColor', w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const SEC_ICON = {
  'Перегородки': 'M3 3h18v18H3zM9 3v18M15 3v18',
  'Лестницы': 'M3 21h5v-5h5v-5h5V6h3',
  'Зеркала': 'M5 9a7 7 0 0 1 14 0v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM9 7l-2 4',
  'Мебель': 'M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5H3zM5 18v2M19 18v2',
  'Услуги': 'M14.5 4.5a4 4 0 0 0-5 5L4 15v5h5l5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-2.5z',
};
const SecIcon = ({ name, s }) => <Ic d={SEC_ICON[name] || SEC_ICON['Мебель']} s={s} w={1.6} />;
const CHEV_L = 'M15 6l-6 6 6 6', CHEV_R = 'M9 6l6 6-6 6', CHEV_D = 'M6 9l6 6 6-6', CHECK = 'M5 12l5 5 9-10';

// Индекс активной карточки в ленте со scroll-snap
function useStrip(len) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => {
      const first = el.children[0];
      if (!first) return;
      const step = first.getBoundingClientRect().width + 10;
      setIdx(Math.max(0, Math.min(len - 1, Math.round(el.scrollLeft / step))));
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [len]);
  const scrollTo = (i) => { const el = ref.current; if (el && el.children[i]) el.children[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }); };
  return { ref, idx, scrollTo };
}

const Dots = ({ n, i, light }) => (
  <div className={'dots' + (light ? ' light' : '')} aria-hidden="true">{Array.from({ length: n }).map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
);

export default function HomeMobile({ onNavigateToCatalog, cartCount, onOpenCart, onOpenPanel, onOpenQuiz }) {
  // ---------- hero ----------
  const [slide, setSlideRaw] = useState(0);
  const [slideRun, setSlideRun] = useState(0); // перезапускает заливку индикатора при ручном переключении
  const setSlide = (v) => { setSlideRaw(v); setSlideRun(r => r + 1); };
  const touch = useRef(null);
  useEffect(() => { const t = setTimeout(() => setSlideRaw(s => (s + 1) % SLIDES.length), SLIDE_MS); return () => clearTimeout(t); }, [slide, slideRun]);
  const onTouchStart = e => { touch.current = e.target.closest('.hm-sheet') ? null : e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 40) setSlide(s => (s + (dx < 0 ? 1 : -1) + SLIDES.length) % SLIDES.length);
  };
  const cur = SLIDES[slide];

  // ---------- лист с разделами ----------
  const [sheetSec, setSheetSec] = useState(null); // индекс в MENU, когда раздел раскрыт
  const [counts, setCounts] = useState({});       // число товаров по корневым разделам из базы
  useEffect(() => {
    let alive = true;
    Promise.all([fetchAllCategories({ limit: 500 }), fetchProducts({ limit: 500 })])
      .then(([cats, { products }]) => {
        if (!alive) return;
        const byId = Object.fromEntries(cats.map(c => [c.id, c]));
        const root = id => { let c = byId[id]; while (c && c.parent) c = byId[c.parent]; return c?.name; };
        const n = {};
        for (const p of products) { const r = root(p.category?.id); if (r) n[r] = (n[r] || 0) + 1; }
        setCounts(n);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const secCount = (m) => {
    if (m.name === 'Услуги') return 'замер и монтаж';
    const n = counts[m.name];
    if (n == null) return 'каталог';
    const r = n % 10, r100 = n % 100;
    const w = (r100 >= 11 && r100 <= 19) ? 'моделей' : r === 1 ? 'модель' : (r >= 2 && r <= 4) ? 'модели' : 'моделей';
    return `${n} ${w}`;
  };

  // положение прокрутки в раскрытом листе: тени и мини-скроллбар
  const scrollRef = useRef(null);
  const [sc, setSc] = useState({ top: false, bot: false, pos: 0, size: 100 });
  const onSheetScroll = () => {
    const el = scrollRef.current; if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 2) { setSc({ top: false, bot: false, pos: 0, size: 100 }); return; }
    const size = Math.max(14, el.clientHeight / el.scrollHeight * 100);
    setSc({ top: el.scrollTop > 4, bot: el.scrollTop < max - 4, pos: el.scrollTop / max * (100 - size), size });
  };
  // при смене раздела список начинаем с верха, затем пересчитываем ползунок после анимации листа
  useEffect(() => {
    if (sheetSec == null) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    onSheetScroll();
    const t = setTimeout(onSheetScroll, 480);
    return () => clearTimeout(t);
  }, [sheetSec]);

  // ---------- дерево подбора ----------
  const [treeOpen, setTreeOpen] = useState(false);
  const [path, setPath] = useState([]); // [{ key, pick }]
  const treeKey = path.length ? TREE[path[path.length - 1].key].a.find(a => a.t === path[path.length - 1].pick)?.to : 'start';
  const node = TREE[treeKey] || TREE.end;
  const pickTree = (a) => {
    const next = [...path, { key: treeKey, pick: a.t }];
    if (a.to === 'end' || !TREE[a.to] || TREE[a.to].a.length === 0) {
      const first = TREE.start.a.find(x => x.t === next[0].pick);
      setTreeOpen(false); setPath([]);
      onNavigateToCatalog(TREE_ENTRY[first?.to] || 'catalog');
      return;
    }
    setPath(next);
  };
  useEffect(() => { if (treeOpen) document.body.style.overflow = 'hidden'; else if (!menuOpen) document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [treeOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- категории ----------

  // ---------- услуги, продукция ----------
  const [levelTab, setLevelTab] = useState(0);
  const prod = useStrip(LEVELS[levelTab].cards.length);
  const firstTab = useRef(true);
  useEffect(() => { if (firstTab.current) { firstTab.current = false; return; } prod.ref.current?.scrollTo({ left: 0, behavior: 'smooth' }); }, [levelTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- примерочная ----------
  const [fitIdx, setFitIdx] = useState(0);
  const [fitKeys, setFitKeys] = useState(['Тип', 'Цвет', 'Размер']);
  const [fitVals, setFitVals] = useState(() => Object.fromEntries(Object.keys(FIT_FILTERS).map(k => [k, 0])));
  const cycleFit = (k) => { setFitVals(v => ({ ...v, [k]: (v[k] + 1) % FIT_FILTERS[k].length })); setFitIdx(i => (i + 1) % FIT_ITEMS.length); };
  const addable = Object.keys(FIT_FILTERS).filter(k => !fitKeys.includes(k));
  const fitItem = FIT_ITEMS[fitIdx];

  // ---------- партнёры ----------
  const [privOpen, setPrivOpen] = useState(false);
  const [role, setRole] = useState(PT_ROLES[0]);
  const [ptSent, setPtSent] = useState(false);

  // ---------- путь заказа, материалы, faq, баннер ----------
  const [stepsAll, setStepsAll] = useState(false);
  const [matIdx, setMatIdx] = useState(0);
  const [matDark, setMatDark] = useState(false);
  const [matF, setMatF] = useState({ section: 0, group: 0, tone: 0 });
  const [matAll, setMatAll] = useState(false);
  const matList = useMemo(() => MATERIALS.filter(m =>
    (matF.section === 0 || m.section === FILTERS[0].options[matF.section]) &&
    (matF.group === 0 || m.group === FILTERS[1].options[matF.group]) &&
    (matF.tone === 0 || m.tone === FILTERS[2].options[matF.tone])
  ), [matF]);
  const mat = matList[matIdx % Math.max(1, matList.length)] || MATERIALS[0];
  const [faqOpen, setFaqOpen] = useState(0);
  const [faqAll, setFaqAll] = useState(false);
  const [banOpen, setBanOpen] = useState(-1);   // индекс баннера с раскрытым списком
  const [need, setNeed] = useState({});          // выбранный вариант по индексу баннера

  // ---------- меню ----------
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);
  const catImgByTitle = Object.fromEntries(CARDS_V2_DATA.map(c => [c.title, c.images?.[0]]));
  const [navOn, setNavOn] = useState(0);
  // Плавающие кнопки показываем, когда hero ушёл за экран, иначе они перекрывают его кнопки
  const [fabs, setFabs] = useState(false);
  useEffect(() => {
    const on = () => setFabs(window.scrollY > window.innerHeight * 0.7);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const goCat = (entry, sub) => { setMenuOpen(false); onNavigateToCatalog(entry, sub); };

  return (
    <div className="hm">
      <style>{CSS}</style>

      {/* ───── HERO ───── */}
      <div className="hm-hero" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Фото только над листом плюс 32px под его скругление, а не на весь экран */}
        <div className="pic" style={{ height: 'calc(100% - 330px + 32px)' }}>
          {SLIDES.map((s, i) => <img key={i} className="bg" src={s.image} alt="" style={{ opacity: i === slide ? 1 : 0 }} fetchpriority={i === 0 ? 'high' : undefined} />)}
          <div className="veil" onClick={() => sheetSec != null && setSheetSec(null)} />
        </div>
        <div className="story" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <i key={i} className={i < slide ? 'done' : ''}>
              {i === slide && <b key={`${slide}-${slideRun}`} style={{ animationDuration: `${SLIDE_MS}ms` }} />}
            </i>
          ))}
        </div>
        <div className="hm-top">
          <span className="logo">objects</span>
          <div className="acts">
            <a className="ico" href="tel:+79854341133" aria-label="Позвонить +7 985 434-11-33"><Ic d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" s={18} w={1.8} /></a>
            <button className="ico" onClick={() => setMenuOpen(true)} aria-label="Меню"><Ic d="M4 7h16M4 12h16M4 17h16" s={18} /></button>
          </div>
        </div>

        <h1 className="sr">{cur.title}</h1>

        <div className="hm-sheet" data-open={sheetSec != null} style={{ height: sheetSec == null ? 330 : 'calc(100% - 96px)' }}>
          <button className="grip" onClick={() => setSheetSec(sheetSec == null ? 0 : null)} aria-label={sheetSec == null ? "Раскрыть разделы" : "Свернуть"} aria-expanded={sheetSec != null}>
            <Ic d="M6 15l6-6 6 6" s={18} w={2.2} c="#1a1a18" />
          </button>
          {sheetSec == null ? (
            <>
              <div className="row">
                <b>Выберите раздел</b>
                <button className="link" onClick={() => onNavigateToCatalog('catalog')}>Весь каталог <Ic d={CHEV_R} s={14} c="#6f6b64" /></button>
              </div>
              <div className="secs">
                {MENU.map((m, i) => (
                  <button className="sec" key={m.name} onClick={() => setSheetSec(i)}>
                    <span className="ic"><SecIcon name={m.name} s={20} /></span>
                    <span className="t"><b>{m.name}</b><span>{secCount(m)}</span></span>
                    <Ic d={CHEV_R} s={14} c="#a39f97" />
                  </button>
                ))}
              </div>
              <button className="big" onClick={() => { setPath([]); setTreeOpen(true); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/></svg>Что сейчас важнее</button>
              <button className="line" onClick={onOpenPanel}><Ic d="M4 7h16M4 12h11M4 17h14" s={16} w={1.8} />Каталог и фильтры</button>
            </>
          ) : (
            <>
              <div className="icons">
                {MENU.map((m, i) => (
                  <button key={m.name} className={i === sheetSec ? 'on' : ''} onClick={() => setSheetSec(i)}><i><SecIcon name={m.name} s={24} /></i>{m.name}</button>
                ))}
              </div>
              <div className="hr" />
              <div className="scrollwrap">
              <div className="scroll" ref={scrollRef} onScroll={onSheetScroll}>
                <div className="row">
                  <h3>{MENU[sheetSec].name}</h3>
                  <button className="link" onClick={() => onNavigateToCatalog(MENU[sheetSec].entry)}>Все {counts[MENU[sheetSec].name] ?? ''} <Ic d={CHEV_R} s={14} c="#6f6b64" /></button>
                </div>
                {MENU[sheetSec].groups.map(g => (
                  <div className="grp" key={g.name}>
                    <small>{g.name}</small>
                    <div className="wrap">{g.options.map(o => <button key={o} onClick={() => onNavigateToCatalog(MENU[sheetSec].entry, o)}><img src={fitImg} alt="" />{o}</button>)}</div>
                  </div>
                ))}
              </div>
              <i className="fade top" style={{ opacity: sc.top ? 1 : 0 }} /><i className="fade bot" style={{ opacity: sc.bot ? 1 : 0 }} />
              <i className="track"><b style={{ top: `${sc.pos}%`, height: `${sc.size}%` }} /></i>
              </div>
              <button className="big" onClick={() => onNavigateToCatalog(MENU[sheetSec].entry)}>{MENU[sheetSec].cta || 'Открыть каталог'}</button>
              <button className="line" onClick={onOpenPanel}><Ic d="M4 7h16M4 12h11M4 17h14" s={16} w={1.8} />Каталог и фильтры</button>
            </>
          )}
        </div>
      </div>

      {/* ───── дерево подбора ───── */}
      {treeOpen && (
        <div className="hm-tree" role="dialog" aria-label="Подбор решения">
          <div className="hm-top">
            <span className="logo">objects</span>
            <button className="ico" onClick={() => setTreeOpen(false)} aria-label="Закрыть подбор"><Ic d="M6 6l12 12M18 6L6 18" /></button>
          </div>
          <div className="body">
            <div className="q">
              <small>Шаг {path.length + 1} из 4</small>
              <h2>{node.q}</h2>
            </div>
            {path.length > 0 && (
              <div className="path">
                {path.map((p, i) => <button key={i} onClick={() => setPath(path.slice(0, i))}>{p.pick} ✕</button>)}
              </div>
            )}
            <div className="opts">
              {node.a.map(a => <button key={a.t} className="opt" onClick={() => pickTree(a)}>{a.t}<Ic d={CHEV_R} c="rgba(255,255,255,.7)" /></button>)}
            </div>
          </div>
          <div className="prog">
            <div><span>Подбор решения</span><span style={{ color: '#fff' }}>{Math.round(path.length / 4 * 100)}%</span></div>
            <div className="bar"><i style={{ width: `${path.length / 4 * 100}%` }} /></div>
          </div>
        </div>
      )}

      {/* ───── липкое меню разделов ───── */}
      <nav className="hm-nav" aria-label="Разделы страницы">
        {PAGE_NAV.map((n, i) => (
          <a key={n.name} href={NAV_HREF[n.href] || n.href} className={navOn === i ? 'on' : ''} onClick={() => setNavOn(i)}>{n.name}</a>
        ))}
      </nav>

      {/* ───── КАТЕГОРИИ ───── */}
      <section id="categories" style={{ paddingTop: 36 }}>
        <div className="head"><h2>Категории</h2><p className="sub">Перегородки, лестницы, зеркала и мебель — изготовим по вашим размерам с гарантией 5 лет</p></div>
        <div className="hm-cats" style={{ marginTop: 18 }}>
          {CARDS_V2_DATA.map((card, ci) => (
            <div className="card hm-cat" key={card.title} onClick={() => onNavigateToCatalog(card.entry)} role="link" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onNavigateToCatalog(card.entry); }}>
              <img src={card.images?.[0]} alt="" loading={ci < 2 ? 'eager' : 'lazy'} />
              <div className="shade" />
              <div className="bot"><span className="name">{card.title}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── НЕ ИЩЕМ ПОДХОДЯЩЕЕ ───── */}
      <section id="services">
        <div className="head"><h2>Не ищем подходящее — производим нужное</h2><p className="sub">Собственный цех в Домодедово — лазерная резка, сварка и монтаж без посредников</p></div>
        <div className="hm-srvs" style={{ marginTop: 18 }}>
          {SERVICES.map(c => (
            <button className="hm-srv" key={c.name} onClick={() => onNavigateToCatalog(c.entry)}>
              {c.image && <img src={c.image} alt="" loading="lazy" />}<i />
              <span className="txt">
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <span className="tags">{c.tags.map(t => <span className="tag" key={t}>{t}</span>)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ───── ПРОДУКЦИЯ ───── */}
      <section id="products">
        <div className="head"><h2>Продукция, которую мы производим</h2><p className="sub">Выберите категорию — покажем разделы каталога и поможем с выбором</p></div>
        <div className="hm-tabs" style={{ marginTop: 18 }}>
          <div>{LEVELS.map((l, i) => <button key={l.name} className={i === levelTab ? 'on' : ''} onClick={() => setLevelTab(i)}>{l.name}</button>)}</div>
        </div>
        <div className="strip" ref={prod.ref} style={{ marginTop: 18 }}>
          {LEVELS[levelTab].cards.map((c, j) => (
            <div className="card hm-prod" key={c.name} onClick={() => onNavigateToCatalog(LEVELS_ENTRY[LEVELS[levelTab].name] || 'catalog', c.name)}>
              {Math.abs(j - prod.idx) <= 2 && <img src={partTest2} alt="" loading="lazy" />}
              <div className="bot">
                <span className="cnt">{c.count}</span>
                <h3>{c.name}</h3>
                <p>Готовые решения и изделия по вашим размерам — с монтажом и гарантией 5 лет.</p>
                <span className="pill white" style={{ height: 46 }}>Перейти</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}><Dots n={Math.min(5, LEVELS[levelTab].cards.length)} i={Math.round(prod.idx / Math.max(1, LEVELS[levelTab].cards.length - 1) * (Math.min(5, LEVELS[levelTab].cards.length) - 1))} /></div>
      </section>

      {/* ───── ПРИМЕРОЧНАЯ ───── */}
      <section id="fitting">
        <div className="head"><h2>Примерочная</h2><p className="sub">Крутите каталог и меняйте параметры — подборка обновляется на ходу</p></div>
        <div className="hm-fit" style={{ marginTop: 18 }}>
          <div className="pic">
            {/* Как на десктопе: соседи стоят по бокам, при переключении въезжают с уменьшением */}
            {[-2, -1, 0, 1, 2].map(d => {
              const n = FIT_ITEMS.length;
              const idx = ((fitIdx + d) % n + n) % n;
              const hot = d === 0, side = Math.abs(d) === 1;
              return (
                <img key={idx} src={fitImg} alt={hot ? fitItem.title : ''} loading="lazy"
                  style={{ transform: `translate(calc(-50% + ${d * 100}%), -50%) scale(${hot ? 1 : side ? 0.6 : 0.45})`, opacity: hot ? 1 : side ? 0.35 : 0 }} />
              );
            })}
            <span className="n">{fitIdx + 1} / {FIT_ITEMS.length}</span>
            <button className="round arr l" onClick={() => setFitIdx(i => (i + FIT_ITEMS.length - 1) % FIT_ITEMS.length)} aria-label="Предыдущее изделие"><Ic d={CHEV_L} /></button>
            <button className="round arr r" onClick={() => setFitIdx(i => (i + 1) % FIT_ITEMS.length)} aria-label="Следующее изделие"><Ic d={CHEV_R} /></button>
            <div className="cap"><b>{fitItem.title}</b><span>{fitItem.price}</span></div>
          </div>
          <div className="ctl">
            <small>Мне нужно</small>
            <div className="chips">
              {fitKeys.map((k, i) => (
                <button key={k} className={'chip' + (i === 0 ? ' on' : '')} onClick={() => cycleFit(k)}>{FIT_FILTERS[k][fitVals[k]]}<Ic d={CHEV_D} s={10} c="#8b877f" w={2.4} /></button>
              ))}
              {addable.length > 0 && (
                <button className="chip add" onClick={() => setFitKeys(k => [...k, addable[0]])} aria-label="Добавить фильтр">+</button>
              )}
            </div>
            <button className="go" onClick={() => onNavigateToCatalog('partitions')}>Смотреть в каталоге</button>
          </div>
        </div>
      </section>

      {/* ───── ПАРТНЁРЫ ───── */}
      <section id="partners">
        <div className="head"><h2>Для партнёров</h2><p className="sub">Дизайнерам, салонам и подрядчикам — условия, привилегии и подключение за один день</p></div>
        <div className="hm-pt" style={{ marginTop: 18 }}>
          <div className="acc">
            <button className="acc-head" onClick={() => setPrivOpen(o => !o)} aria-expanded={privOpen}>
              <span>Что получают партнёры</span>
              <i><Ic d={privOpen ? 'M5 12h14' : 'M12 5v14M5 12h14'} s={12} c="#6b6862" /></i>
            </button>
            {privOpen && <div className="privs" style={{ animation: 'hFade .2s ease' }}>{PT_PRIVILEGES.map(t => <div className="priv" key={t}><Ic d={CHECK} s={18} /><span>{t}</span></div>)}</div>}
          </div>
          <div className="form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <b style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.02em' }}>Оставьте заявку</b>
              <span style={{ fontSize: 13, color: '#8b877f' }}>Пришлём условия, прайс и каталог в вашем формате</span>
            </div>
            <label>Имя и фамилия<input type="text" autoComplete="name" /></label>
            <label>Компания или студия<input type="text" autoComplete="organization" /></label>
            <label>Телефон<input type="tel" autoComplete="tel" /></label>
            <div className="roles">{PT_ROLES.map(r => <button key={r} className={r === role ? 'on' : ''} onClick={() => setRole(r)}>{r}</button>)}</div>
            <div className="msgs">
              <a className="msg" style={{ background: '#2b9fe3' }} href="https://t.me/zerkalls" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="msg" style={{ background: '#7c5cf0' }} href="https://max.ru" target="_blank" rel="noopener noreferrer">MAX</a>
            </div>
            {ptSent
              ? <div className="ok"><Ic d={CHECK} s={18} /><span>Заявка отправлена — менеджер свяжется с вами и пришлёт условия.</span></div>
              : <button className="send" onClick={() => setPtSent(true)}>Отправить заявку</button>}
            <span className="fine">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</span>
          </div>
        </div>
      </section>

      {/* ───── КАК ПРОХОДИТ ВАШ ЗАКАЗ ───── */}
      <section id="steps" className="hm-steps" style={{ paddingTop: 44 }}>
        <div className="head" style={{ padding: 0 }}><span className="k">10 этапов производства</span><h2>Как проходит ваш заказ</h2></div>
        <div className="dlg">
          {DIALOG.slice(2, 6).map((d, i) => <span key={i} className={d.side}>{d.text}</span>)}
        </div>
        {!stepsAll && <button className="more" onClick={() => setStepsAll(true)}>Развернуть этапы<Ic d={CHEV_D} s={14} c="#fff" /></button>}
        {stepsAll && <ol>
          {STAGES.map(([title, text], i) => (
            <li key={title}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <img src={STEP_SRCS[i]} alt="" loading="lazy" />
              <div><b>{title}</b><span className="t">{text}</span></div>
            </li>
          ))}
        </ol>}
        {stepsAll && <button className="more" onClick={() => setStepsAll(false)}>Свернуть этапы<Ic d="M6 15l6-6 6 6" s={14} c="#fff" /></button>}
        <a className="cta" href="https://wa.me/79854341133" target="_blank" rel="noopener noreferrer">Обсудить проект</a>
      </section>

      {/* ───── МАТЕРИАЛЫ ───── */}
      <section id="materials">
        <div className="head"><h2>Материалы и отделки</h2><p className="sub">Стекло, зеркало и отделки профилей — {MATERIALS.length} позиции</p></div>
        <div className="hm-mat" style={{ marginTop: 16 }}>
          <div className="prev" style={{ background: mat.css, filter: matDark ? 'brightness(.55)' : 'none', transition: 'filter .3s' }}>
            <div className="mode">
              <button className={!matDark ? 'on' : ''} onClick={() => setMatDark(false)} aria-label="Дневной свет"><Ic d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" s={16} c="#1a1a18" w={1.8} /></button>
              <button className={matDark ? 'on' : ''} onClick={() => setMatDark(true)} aria-label="Вечерний свет"><Ic d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" s={16} c="#1a1a18" w={1.8} /></button>
            </div>
            <div className="cap">
              <div><b>{mat.name}</b><small>{mat.code} · {mat.group}</small></div>
              <div className="cnt">
                <button onClick={() => setMatIdx(i => (i + matList.length - 1) % matList.length)} aria-label="Предыдущий материал"><Ic d="M19 12H5M11 6l-6 6 6 6" s={18} c="#fff" w={1.6} /></button>
                <span>{String((matIdx % matList.length) + 1).padStart(2, '0')} / {String(matList.length).padStart(2, '0')}</span>
                <button onClick={() => setMatIdx(i => (i + 1) % matList.length)} aria-label="Следующий материал"><Ic d="M5 12h14M13 6l6 6-6 6" s={18} c="#fff" w={1.6} /></button>
              </div>
            </div>
          </div>
          <div className="chips">
            {FILTERS.map(f => (
              <button key={f.key} className={'chip' + (matF[f.key] ? ' on' : '')} onClick={() => { setMatF(v => ({ ...v, [f.key]: (v[f.key] + 1) % f.options.length })); setMatIdx(0); }}>
                {f.options[matF[f.key]]}<Ic d={CHEV_D} s={10} c="#8b877f" w={2.4} />
              </button>
            ))}
            {(matF.section || matF.group || matF.tone) ? <button className="chip" style={{ border: 0, color: '#8b877f' }} onClick={() => { setMatF({ section: 0, group: 0, tone: 0 }); setMatIdx(0); }}>Сбросить</button> : null}
          </div>
          <div className="grid">
            {(matAll ? matList : matList.slice(0, 6)).map((m, i) => (
              <button key={m.code} className={'sw' + (m.code === mat.code ? ' on' : '')} onClick={() => setMatIdx(i)}>
                <i style={{ background: m.css }} /><span>{m.name}</span>
              </button>
            ))}
            {matList.length === 0 && <span style={{ gridColumn: '1 / -1', fontSize: 14, color: '#8b877f', textAlign: 'center', padding: '20px 0' }}>Нет материалов с такими параметрами — снимите один из фильтров</span>}
          </div>
          {!matAll && matList.length > 6 && <div className="center"><button className="pill" style={{ height: 44, fontSize: 13.5, color: '#6b6862' }} onClick={() => setMatAll(true)}>Смотреть больше</button></div>}
        </div>
      </section>

      {/* ───── ПРОИЗВОДСТВО ───── */}
      <section id="production">
        <div className="head"><h2>Производство</h2><p className="sub">Собственный цех 2 400 м² в Домодедово — от раскроя до монтажа без посредников</p></div>
        <div className="hm-prodn" style={{ marginTop: 18 }}>
          {PRODUCTION.map(p => <div key={p.title}><b>{p.title}</b><p>{p.text}</p></div>)}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq">
        <div className="head" style={{ alignItems: 'center' }}>
          <h2>Частые вопросы — и наши ответы</h2>
          <p className="sub">Не нашли нужное? Напишите — ответим в течение часа</p>
          <a className="pill primary" style={{ height: 44, fontSize: 13.5 }} href="https://wa.me/79854341133" target="_blank" rel="noopener noreferrer">Задать вопрос</a>
        </div>
        <div className="hm-faq" style={{ marginTop: 18 }}>
          {(faqAll ? FAQ : FAQ.slice(0, 3)).map((f, i) => {
            const open = faqOpen === i;
            return (
              <div key={f.q} className={'item' + (open ? ' open' : '')} onClick={() => setFaqOpen(open ? -1 : i)}>
                <div className="row"><span>{f.q}</span><i><Ic d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} s={12} c="#6b6862" /></i></div>
                {open && <p style={{ animation: 'hFade .2s ease' }}>{f.a}</p>}
              </div>
            );
          })}
          {!faqAll && FAQ.length > 3 && <button className="pill" style={{ height: 44, fontSize: 13.5, color: '#6b6862' }} onClick={() => setFaqAll(true)}>Ещё {FAQ.length - 3} вопросов</button>}
        </div>
      </section>

      {/* ───── БАННЕРЫ ПОДБОР ПО ЗАДАЧЕ ───── */}
      <section id="banner">
        <div className="hm-bans">
          {BANNERS.map((b, i) => {
            const open = banOpen === i;
            const picked = need[i] || null;
            const bg = b.bg || 'linear-gradient(135deg, #2a2d33 0%, #16181c 100%)';
            const solid = b.tint ? b.tint.replace(/,\s*[\d.]+\)$/, ',1)') : 'rgba(27,29,34,1)';
            const img = BANNER_IMGS[i];
            return (
              <div className="hm-ban" key={b.title} style={{ background: bg }}>
                {!open && img && <img src={img} alt="" loading="lazy" />}
                <div className="veil" style={{ background: open ? 'rgba(20,19,17,.25)' : `linear-gradient(90deg, ${solid} 0%, ${solid} 52%, rgba(20,19,17,.15) 100%)` }} />
                <div className={'in' + (open ? ' wide' : '')}>
                  <span className="k">{b.kicker}</span>
                  <h3>{b.title.charAt(0) + b.title.slice(1).toLowerCase()}</h3>
                  {!open && <p>{BANNER_SHORT[i] || b.text}</p>}
                  {!open && (
                    <button className="go" onClick={() => setBanOpen(i)}>
                      {picked || 'Подобрать'}<Ic d={CHEV_D} s={11} c="#8b877f" w={2.2} />
                    </button>
                  )}
                  {open && (
                    <>
                      <p>{b.text}</p>
                      <div className="list" role="listbox" aria-label="Для чего нужно">
                        {b.options.map(o => (
                          <button key={o[0]} role="option" aria-selected={picked === o[0]} className={picked === o[0] ? 'on' : ''} onClick={() => setNeed(n => ({ ...n, [i]: o[0] }))}>
                            <span>{o[0]}</span>{o[1] && <small>{o[1]}</small>}
                          </button>
                        ))}
                      </div>
                      <div className="acts">
                        <button className="cancel" onClick={() => setBanOpen(-1)}>Свернуть</button>
                        <button className="go" disabled={!picked} style={{ opacity: picked ? 1 : .5 }} onClick={() => onNavigateToCatalog(BANNER_ENTRY[i] || 'catalog')}>Подобрать</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───── ФУТЕР ───── */}
      <footer id="footer" className="hm-foot">
        <div className="sub">
          <b>Только важные новости и лучшие предложения</b>
          <p>Новинки производства, инновации в мебельной продукции и выгодные предложения — первыми, в вашей почте</p>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Электронная почта<input type="email" autoComplete="email" /></label>
          <button type="button">Подписаться на рассылку</button>
          <label className="agree"><input type="checkbox" /><span>Я принимаю политику конфиденциальности и даю согласие на отправку рекламных материалов</span></label>
        </div>
        <div className="info">
          <span className="brand">objects</span>
          <div className="cont">
            <div><small>Рабочее время</small><span>Будни 9:00–18:00</span></div>
            <div><small>Телефон</small><a href="tel:+79854341133">+7 985 434-11-33</a></div>
            <div><small>Почта</small><a href="mailto:info@objects.ru">info@objects.ru</a></div>
            <div><small>Адрес</small><span>Домодедово, территория ИНТЕГРА, стр. 3</span></div>
          </div>
          <div className="cols">
            {FOOTER_COLS.map(col => (
              <div key={col.title}><b>{col.title}</b>{col.links.map(l => <a key={l} href="#categories" onClick={e => { e.preventDefault(); onNavigateToCatalog('catalog'); }}>{l}</a>)}</div>
            ))}
            <div><b>Мы в сети</b><div className="soc"><a href="https://vk.com" aria-label="ВКонтакте">VK</a><a href="https://youtube.com" aria-label="YouTube">YT</a><a href="https://t.me/zerkalls" aria-label="Telegram">TG</a></div></div>
          </div>
        </div>
        <div className="low">
          <span>© objects 2022–2026. Все права защищены. Интернет-магазин дизайнерской мебели</span>
          <div><a href="#footer">Политика конфиденциальности</a><a href="#footer">Публичная оферта</a></div>
        </div>
      </footer>

      {/* ───── плавающие кнопки ───── */}
      <button className={'hm-fab menu' + (fabs ? ' show' : '')} onClick={() => setMenuOpen(true)} aria-label="Меню"><Ic d="M4 7h16M4 12h16M4 17h16" c="#fff" s={18} /></button>
      <a className={'hm-fab tg' + (fabs ? ' show' : '')} href="https://t.me/zerkalls" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M21.5 3.5L2.8 10.7c-1 .4-1 1 .1 1.3l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8L22 5c.3-1.3-.5-1.9-1.5-1.5z"/></svg>
      </a>

      {/* ───── меню ───── */}
      {menuOpen && (
        <div className="hm-menu" role="dialog" aria-label="Меню">
          <div className="hm-top" style={{ color: '#1a1a18' }}>
            <span className="logo">objects</span>
            <button className="ico" style={{ border: '1px solid #e0dcd5', background: '#fff', color: '#1a1a18' }} onClick={() => setMenuOpen(false)} aria-label="Закрыть меню"><Ic d="M6 6l12 12M18 6L6 18" /></button>
          </div>
          <div className="body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MENU.map(m => (
                <button key={m.name} className="row" onClick={() => goCat(m.entry)}>
                  {catImgByTitle[m.name] ? <img src={catImgByTitle[m.name]} alt="" /> : <span style={{ width: 52, height: 52, borderRadius: 12, background: '#ece9e4', flex: 'none' }} />}
                  <span>{m.name}</span><Ic d={CHEV_R} s={18} c="#8b877f" w={1.8} />
                </button>
              ))}
              <button className="row sm" onClick={() => { setMenuOpen(false); onOpenPanel(); }}><span>Все фильтры каталога</span><Ic d={CHEV_R} s={18} c="#8b877f" w={1.8} /></button>
              {cartCount > 0 && <button className="row sm" onClick={() => { setMenuOpen(false); onOpenCart(); }}><span>Корзина · {cartCount}</span><Ic d={CHEV_R} s={18} c="#8b877f" w={1.8} /></button>}
            </div>
            <div className="links">
              {PAGE_NAV.map(n => <a key={n.name} href={NAV_HREF[n.href] || n.href} onClick={() => setMenuOpen(false)}>{n.name}</a>)}
            </div>
          </div>
          <div className="bot">
            <a className="pill primary" style={{ height: 50 }} href="tel:+79854341133">Позвонить +7 985 434-11-33</a>
            <div className="two">
              <a className="pill" style={{ height: 46 }} href="https://wa.me/79854341133" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="pill" style={{ height: 46 }} href="https://t.me/zerkalls" target="_blank" rel="noopener noreferrer">Telegram</a>
            </div>
            <small>Будни 9:00–18:00 · Домодедово</small>
          </div>
        </div>
      )}
    </div>
  );
}
