import { useState, useRef } from 'react';
import catNobg1       from '../../assets/categories-nobg/1.png';
import mirrorsImg     from '../../assets/mirrors.jpg';
import stairsImg      from '../../assets/stairs.jpg';
import partitionsImg  from '../../assets/partitions.jpg';
import furnitureImg   from '../../assets/furniture.jpg';
import test2Img       from '../../assets/test-2.jpg';
import test3Img       from '../../assets/test-3.jpg';
import test4Img       from '../../assets/test-4.jpg';

import p01  from '../../assets/categories-1/partitions/01_Fixed_LOFT_Partitions.jpg';
import p02  from '../../assets/categories-1/partitions/02_LOFT_Partitions_with_Hinged_Doors.jpg';
import p03  from '../../assets/categories-1/partitions/03_Sliding_LOFT_Partitions.jpg';
import p04  from '../../assets/categories-1/partitions/04_Folding_LOFT_Partitions.jpg';
import p05  from '../../assets/categories-1/partitions/05_Pivot_Partitions.jpg';
import p06  from '../../assets/categories-1/partitions/06_Rotating_Louver_Partitions.jpg';
import p07  from '../../assets/categories-1/partitions/07_Swinging_LOFT_Partitions.jpg';
import p08  from '../../assets/categories-1/partitions/08_Movable_Transformable_Walls.jpg';
import p09  from '../../assets/categories-1/partitions/09_Vertical_Retractable_Partitions.jpg';
import p10  from '../../assets/categories-1/partitions/10_Standalone_LOFT_Doors.jpg';
import p11  from '../../assets/categories-1/partitions/11_LOFT_Screens.jpg';
import p12  from '../../assets/categories-1/partitions/12_Metal_Slat_Partitions.jpg';
import p13  from '../../assets/categories-1/partitions/13_Metal_Rod_Partitions.jpg';
import p14  from '../../assets/categories-1/partitions/14_Metal_Mesh_Partitions.jpg';
import p15  from '../../assets/categories-1/partitions/15_Expanded_Metal_Partitions.jpg';
import p16  from '../../assets/categories-1/partitions/16_Perforated_Metal_Partitions.jpg';
import p17  from '../../assets/categories-1/partitions/17_Laser_Cut_Decorative_Metal_Partitions.jpg';
import p18  from '../../assets/categories-1/partitions/18_Cable_String_Partitions.jpg';
import p19  from '../../assets/categories-1/partitions/19_Chain_Curtains_Metal_Curtains.jpg';
import p20  from '../../assets/categories-1/partitions/20_Suspended_Decorative_Partitions.jpg';
import p21  from '../../assets/categories-1/partitions/21_Shelving_Partitions.jpg';
import p22  from '../../assets/categories-1/partitions/22_Library_Partitions.jpg';
import p23  from '../../assets/categories-1/partitions/23_TV_Media_Partitions.jpg';
import p24  from '../../assets/categories-1/partitions/24_Workspace_Partitions.jpg';
import p25  from '../../assets/categories-1/partitions/25_Plant_Partitions.jpg';
import p26  from '../../assets/categories-1/partitions/26_Display_Partitions.jpg';
import p27  from '../../assets/categories-1/partitions/27_Wine_Bar_Partitions.jpg';
import p28  from '../../assets/categories-1/partitions/28_Partitions_with_Built_In_Furniture.jpg';
import p29  from '../../assets/categories-1/partitions/29_Mobile_LOFT_Partitions.jpg';
import p30  from '../../assets/categories-1/partitions/30_Acoustic_Partitions.jpg';
import p31  from '../../assets/categories-1/partitions/31_Functional_Interactive_Partitions.png';
import p32  from '../../assets/categories-1/partitions/32_Partitions_with_Integrated_Utilities.png';
import p33  from '../../assets/categories-1/partitions/33_Illuminated_LOFT_Partitions.png';
import p34  from '../../assets/categories-1/partitions/34_Modular_Partition_Systems.png';
import p35  from '../../assets/categories-1/partitions/35_Room_in_Room_Systems.png';
import p36  from '../../assets/categories-1/partitions/36_LOFT_Walk_In_Wardrobes.png';
import p37  from '../../assets/categories-1/partitions/37_LOFT_Shower_Partitions.png';
import p38  from '../../assets/categories-1/partitions/38_Kitchen_Living_Room_Partitions.png';
import p39  from '../../assets/categories-1/partitions/39_Bedroom_Studio_Partitions.png';
import p40  from '../../assets/categories-1/partitions/40_Office_LOFT_Partitions.png';
import p41  from '../../assets/categories-1/partitions/41_Restaurant_HoReCa_Partitions.png';
import p42  from '../../assets/categories-1/partitions/42_Retail_Showroom_Partitions.png';
import p43  from '../../assets/categories-1/partitions/43_Special_Technical_LOFT_Systems.png';

// ─── Данные каталога ─── по каждому разделу отдельный список
export const ITEMS = {
  'Перегородки': [
    { name: 'Фиксированные лофт',           img: [p01, p02] },
    { name: 'С распашными дверями',          img: [p02, p03] },
    { name: 'Раздвижные лофт',               img: [p03, p04] },
    { name: 'Складные (гармошка)',            img: [p04, p05] },
    { name: 'Поворотные (пивот)',             img: [p05, p06] },
    { name: 'С поворотными жалюзи',           img: [p06, p07] },
    { name: 'Маятниковые',                   img: [p07, p08] },
    { name: 'Трансформируемые стены',         img: [p08, p09] },
    { name: 'Вертикально-убираемые',          img: [p09, p10] },
    { name: 'Лофт-двери',                    img: [p10, p11] },
    { name: 'Лофт-ширмы',                    img: [p11, p12] },
    { name: 'Реечные металлические',          img: [p12, p13] },
    { name: 'Прутковые металлические',        img: [p13, p14] },
    { name: 'Сетчатые металлические',         img: [p14, p15] },
    { name: 'Просечно-вытяжные',              img: [p15, p16] },
    { name: 'Перфорированный металл',         img: [p16, p17] },
    { name: 'Лазерная резка декор',           img: [p17, p18] },
    { name: 'Канатные и тросовые',            img: [p18, p19] },
    { name: 'Цепочные шторы',                img: [p19, p20] },
    { name: 'Подвесные декоративные',         img: [p20, p21] },
    { name: 'Стеллажные',                    img: [p21, p22] },
    { name: 'Библиотечные',                  img: [p22, p23] },
    { name: 'Под TV и медиа',                img: [p23, p24] },
    { name: 'Рабочей зоны',                  img: [p24, p25] },
    { name: 'С растениями',                  img: [p25, p26] },
    { name: 'Витринные',                     img: [p26, p27] },
    { name: 'Барные и винные',               img: [p27, p28] },
    { name: 'Со встроенной мебелью',          img: [p28, p29] },
    { name: 'Мобильные передвижные',          img: [p29, p30] },
    { name: 'Акустические',                  img: [p30, p31] },
    { name: 'Функциональные',                img: [p31, p32] },
    { name: 'С коммуникациями',              img: [p32, p33] },
    { name: 'Световые и подсветные',          img: [p33, p34] },
    { name: 'Модульные системы',             img: [p34, p35] },
    { name: 'Room-in-Room',                  img: [p35, p36] },
    { name: 'Гардеробные лофт',              img: [p36, p37] },
    { name: 'Душевые лофт',                  img: [p37, p38] },
    { name: 'Кухня — гостиная',              img: [p38, p39] },
    { name: 'Спальня — студия',              img: [p39, p40] },
    { name: 'Офисные лофт',                 img: [p40, p41] },
    { name: 'HoReCa и рестораны',            img: [p41, p42] },
    { name: 'Ритейл и шоурум',               img: [p42, p43] },
    { name: 'Спецтехнические системы',        img: [p43, p01] },
  ],
  'Зеркала': [
    { name: 'Круглые без рамы',              img: [mirrorsImg, test3Img] },
    { name: 'Круглые в латунной раме',        img: [test3Img, mirrorsImg] },
    { name: 'Круглые с подсветкой',           img: [mirrorsImg, test2Img] },
    { name: 'Овальные классические',          img: [test2Img, mirrorsImg] },
    { name: 'Овальные вытянутые',             img: [test3Img, test2Img]  },
    { name: 'Овальные с фацетом',             img: [mirrorsImg, test4Img] },
    { name: 'Арочные одинарные',              img: [test4Img, mirrorsImg] },
    { name: 'Арочные парные',                img: [mirrorsImg, test3Img] },
    { name: 'Арочные с полкой',              img: [test3Img, test4Img]  },
    { name: 'Во весь рост напольные',         img: [test2Img, test3Img]  },
    { name: 'Во весь рост навесные',          img: [mirrorsImg, test2Img] },
    { name: 'Во весь рост на опоре',          img: [test4Img, test2Img]  },
    { name: 'LED подсветка контурная',        img: [test3Img, mirrorsImg] },
    { name: 'LED подсветка фронтальная',      img: [mirrorsImg, test4Img] },
    { name: 'С сенсорным управлением',        img: [test2Img, test4Img]  },
    { name: 'По индивидуальному размеру',     img: [test4Img, test3Img]  },
    { name: 'Гнутое стекло',                 img: [mirrorsImg, test2Img] },
    { name: 'Составные зеркала',             img: [test3Img, test2Img]  },
    { name: 'Интерьерные классика',           img: [test4Img, mirrorsImg] },
    { name: 'Интерьерные модерн',             img: [mirrorsImg, test3Img] },
    { name: 'Интерьерные лофт',              img: [test2Img, mirrorsImg] },
    { name: 'С полочкой',                    img: [test3Img, test4Img]  },
    { name: 'Лакобель',                      img: [test4Img, test2Img]  },
    { name: 'Для ванной комнаты',             img: [mirrorsImg, test4Img] },
  ],
  'Лестницы': [
    { name: 'Винтовые с центральной стойкой', img: [stairsImg, test2Img] },
    { name: 'Винтовые со стеклом',            img: [test2Img, stairsImg] },
    { name: 'Открытые винтовые',              img: [stairsImg, test3Img] },
    { name: 'Маршевые прямые',               img: [test3Img, stairsImg] },
    { name: 'Маршевые с площадкой',           img: [stairsImg, test4Img] },
    { name: 'Маршевые поворотные',            img: [test4Img, stairsImg] },
    { name: 'Модульные на тетиве',            img: [stairsImg, test2Img] },
    { name: 'Модульные на косоуре',           img: [test2Img, test3Img]  },
    { name: 'Консольные',                    img: [test3Img, test2Img]  },
    { name: 'Из дуба — массив',              img: [stairsImg, test3Img] },
    { name: 'Из дуба — шпон',               img: [test3Img, test4Img]  },
    { name: 'Из дуба с металлом',            img: [test4Img, stairsImg] },
    { name: 'Открытый металлокаркас',         img: [stairsImg, test4Img] },
    { name: 'Закрытый металлокаркас',         img: [test4Img, test2Img]  },
    { name: 'Для мансарды компактные',        img: [stairsImg, test2Img] },
    { name: 'Складные чердачные',             img: [test2Img, test4Img]  },
    { name: 'Приставные деревянные',          img: [test3Img, stairsImg] },
    { name: 'Приставные алюминиевые',         img: [stairsImg, test3Img] },
    { name: 'Эвакуационные пожарные',         img: [test4Img, test3Img]  },
    { name: 'Парадные',                      img: [stairsImg, test4Img] },
    { name: 'С подсветкой ступеней',          img: [test2Img, stairsImg] },
    { name: 'С ковровым покрытием',           img: [test3Img, test2Img]  },
    { name: 'Уличные',                       img: [test4Img, stairsImg] },
  ],
  'Ширмы': [
    { name: 'Реечные дуб',                   img: [furnitureImg, test3Img] },
    { name: 'Реечные орех',                  img: [test3Img, furnitureImg] },
    { name: 'Реечные крашеные',              img: [furnitureImg, test4Img] },
    { name: 'Гармошка 3 створки',             img: [test4Img, furnitureImg] },
    { name: 'Гармошка 4 створки',             img: [furnitureImg, test2Img] },
    { name: 'Гармошка 5 створок',             img: [test2Img, furnitureImg] },
    { name: 'Ротанг натуральный',             img: [furnitureImg, test3Img] },
    { name: 'Ротанг тонированный',            img: [test3Img, test2Img]   },
    { name: 'Тканевые однотонные',            img: [furnitureImg, test4Img] },
    { name: 'Тканевые с рисунком',            img: [test4Img, test3Img]   },
    { name: 'Металлические кованые',          img: [test2Img, test4Img]   },
    { name: 'Металлические сварные',          img: [furnitureImg, test2Img] },
    { name: 'Деревянные массив',              img: [test3Img, furnitureImg] },
    { name: 'Деревянные МДФ',                img: [test4Img, test2Img]   },
    { name: 'Складные переносные',            img: [furnitureImg, test3Img] },
    { name: 'Напольные стационарные',         img: [test2Img, furnitureImg] },
  ],
  'Стеклянные доски': [
    { name: 'Магнитные белые',               img: [test3Img, partitionsImg] },
    { name: 'Магнитные цветные',             img: [partitionsImg, test3Img] },
    { name: 'Магнитные с печатью',           img: [test4Img, partitionsImg] },
    { name: 'Для кабинета настенные',         img: [partitionsImg, test4Img] },
    { name: 'Для кабинета на опоре',          img: [test2Img, partitionsImg] },
    { name: 'Скинали для кухни',             img: [partitionsImg, test2Img] },
    { name: 'С разметкой для кухни',          img: [test3Img, test2Img]   },
    { name: 'С печатью — логотип',           img: [test2Img, test3Img]   },
    { name: 'С печатью — календарь',         img: [partitionsImg, test4Img] },
    { name: 'По эскизу',                     img: [test4Img, test3Img]   },
    { name: 'Маркерные сухостираемые',        img: [test3Img, partitionsImg] },
    { name: 'Маркерные порошковые',           img: [partitionsImg, test2Img] },
    { name: 'Проекционные белые',             img: [test2Img, test4Img]   },
    { name: 'Проекционные серые',             img: [test4Img, partitionsImg] },
    { name: 'Офисные большого формата',       img: [partitionsImg, test3Img] },
    { name: 'Школьные',                      img: [test3Img, test4Img]   },
  ],
  'Комплектующие': [
    { name: 'Профили алюминиевые',           img: [test2Img, test4Img] },
    { name: 'Профили стальные',              img: [test4Img, test2Img] },
    { name: 'Профили латунные',              img: [test3Img, test2Img] },
    { name: 'Направляющие верхние',           img: [test2Img, test3Img] },
    { name: 'Направляющие нижние',            img: [test4Img, test3Img] },
    { name: 'Направляющие скрытые',           img: [test3Img, test4Img] },
    { name: 'Доводчики напольные',            img: [test2Img, test4Img] },
    { name: 'Доводчики верхние',             img: [test4Img, test2Img] },
    { name: 'Ручки-скобы',                   img: [test3Img, test2Img] },
    { name: 'Ручки врезные',                 img: [test2Img, test3Img] },
    { name: 'Ручки латунные',                img: [test4Img, test3Img] },
    { name: 'Крепёж — зажимы',              img: [test3Img, test4Img] },
    { name: 'Крепёж — уголки',              img: [test2Img, test4Img] },
    { name: 'Крепёж — опоры',               img: [test4Img, test2Img] },
    { name: 'Шины одиночные',                img: [test3Img, test2Img] },
    { name: 'Шины двойные',                  img: [test2Img, test3Img] },
    { name: 'Петли накладные',               img: [test4Img, test3Img] },
    { name: 'Петли скрытые',                 img: [test3Img, test4Img] },
    { name: 'Петли пружинные',               img: [test2Img, test4Img] },
    { name: 'Стеклодержатели',               img: [test4Img, test2Img] },
  ],
};

export const CAT_TREE = {
  'Перегородки': {
    'Фиксированные лофт':       ['Одинарные', 'Двойные', 'В пол стены'],
    'Раздвижные лофт':          ['Одностворчатые', 'Двустворчатые', 'Каскадные'],
    'Маятниковые':              ['Одностворчатые', 'Двустворчатые', 'С фрамугой'],
    'Реечные металлические':    ['Дубовые', 'Крашеные', 'С подсветкой'],
    'Акустические':             ['Одинарные', 'Двойные', 'Со стеклом'],
    'Офисные лофт':             ['Прозрачные', 'С жалюзи', 'Матовые'],
  },
  'Зеркала': {
    'Круглые без рамы':         ['До 60 см', '60–90 см', 'Свыше 90 см'],
    'LED подсветка контурная':  ['Тёплый свет', 'Холодный свет', 'С регулировкой'],
    'По индивидуальному размеру':['По эскизу', 'Стандартные формы', 'Сложные формы'],
    'Арочные одинарные':        ['Высота до 1 м', '1–1.5 м', 'Свыше 1.5 м'],
  },
  'Лестницы': {
    'Винтовые с центральной стойкой': ['Диаметр 1.2 м', 'Диаметр 1.5 м', 'Диаметр 1.8 м'],
    'Маршевые прямые':          ['С подступенком', 'Без подступенка', 'С ограждением'],
    'Из дуба — массив':         ['Натуральный', 'Тонированный', 'Крашеный'],
    'Открытый металлокаркас':   ['Сварной', 'Кованый', 'Из профтрубы'],
  },
  'Ширмы': {
    'Реечные дуб':              ['Натуральный дуб', 'Беленый дуб', 'Темный дуб'],
    'Гармошка 4 створки':       ['До 120 см', '120–180 см', '180–240 см'],
  },
  'Стеклянные доски': {
    'Магнитные белые':          ['60×90 см', '90×120 см', '120×180 см'],
    'Скинали для кухни':        ['4 мм', '6 мм', '8 мм'],
  },
  'Комплектующие': {
    'Профили алюминиевые':      ['Анодированные', 'Крашеные', 'Под дерево'],
    'Доводчики напольные':      ['Одностороннее открывание', 'Двустороннее'],
  },
};

const DEFAULT_LEAVES = ['Стандартные размеры', 'По индивидуальному проекту', 'С монтажом'];

function subCount(name) { return 6 + (name.length * 7) % 34; }

export default function CategoryPage({ section, onPickSubsection }) {
  const [hover, setHover] = useState(null);
  const [flip, setFlip] = useState(false);
  const [pinged, setPinged] = useState(null);
  const hoverTimer = useRef(null);
  const pingTimer = useRef(null);
  const stripRef = useRef(null);
  const itemRefs = useRef([]);

  const pingCard = (i) => {
    clearTimeout(pingTimer.current);
    setPinged(null);
    const strip = stripRef.current;
    const el = document.getElementById(`cp-card-${i}`);
    let delay = 60;
    if (strip && el) {
      const stripRect = strip.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetScroll = strip.scrollLeft + (elRect.left - stripRect.left) - (stripRect.width / 2 - elRect.width / 2);
      const dist = Math.abs(targetScroll - strip.scrollLeft);
      if (dist > 30) {
        delay = 440;
        strip.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
    pingTimer.current = setTimeout(() => {
      setPinged(i);
      pingTimer.current = setTimeout(() => setPinged(null), 1500);
    }, delay);
  };

  const items = ITEMS[section] || [];
  const tree = CAT_TREE[section] || {};

  const enter = (i) => {
    clearTimeout(hoverTimer.current);
    setHover(i);
    pingCard(i);
    const el = itemRefs.current[i];
    if (el) {
      const rect = el.getBoundingClientRect();
      setFlip(rect.right + 250 > window.innerWidth - 16);
    }
  };
  const leave = () => { hoverTimer.current = setTimeout(() => setHover(null), 120); };
  const keep  = () => clearTimeout(hoverTimer.current);

  const scrollStrip = (dir) => {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({ left: dir * stripRef.current.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '28px 40px 60px', fontFamily: "'Golos Text', Helvetica, sans-serif" }}>
      <style>{`
        @keyframes cpPreviewIn { from { opacity:0; transform:translateY(6px) scale(.93) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes cpCardPop  { 0%{transform:scale(1)} 30%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes cpCardPing { 0%{opacity:0} 10%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
        .cp-row { transition: background .13s, padding-left .14s, color .13s; text-decoration: none !important; }
        .cp-row:hover { background: oklch(0.955 0.01 255) !important; color: oklch(0.38 0.14 258) !important; padding-left: 10px !important; text-decoration: none !important; }
        .cp-leaf { border-radius: 7px; transition: background .13s, color .13s, padding-left .13s !important; }
        .cp-leaf:hover { background: #f0ede8 !important; color: #1a1a18 !important; padding-left: 10px !important; }
        .cp-see-all:hover { background: #2a2925 !important; color: #fff !important; }
        .cp-card:hover .cp-thumb { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(26,26,24,.18); }
        .cp-card:hover .cp-card-label { color: #1a1a18; }
        .cp-arr:hover { border-color: #c2bdb5 !important; }
      `}</style>

      {/* Заголовок */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-.02em', color: '#1a1a18' }}>{section}</h2>
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: '#8b877f',
        }}>
          {items.length} категорий
        </span>
      </div>

      {/* ─── Меню — стиль из паттерна ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: '0 22px',
        paddingBottom: 20,
        marginBottom: 28,
        borderBottom: '1px solid #ece9e4',
      }}>
        {items.map((item, i) => {
          const isHov = hover === i;
          const num = String(i + 1).padStart(2, '0');
          const leaves = (tree[item.name] && tree[item.name].length > 0) ? tree[item.name] : DEFAULT_LEAVES;

          return (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              style={{ position: 'relative' }}
              onMouseEnter={() => enter(i)}
              onMouseLeave={leave}
            >
              <a
                className="cp-row"
                onClick={() => onPickSubsection(item.name)}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '6px 8px 6px 6px',
                  borderBottom: '1px solid oklch(0.935 0.004 260)',
                  cursor: 'pointer', color: '#26251f',
                  transition: 'background .14s, color .14s, padding-left .14s',
                  textDecoration: 'none',
                }}
              >
                {/* Номер */}
                <div style={{
                  flexShrink: 0, width: 17, alignSelf: 'baseline', paddingTop: 1,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10, color: '#8b877f',
                }}>{num}</div>
                {/* Иконка — вертикально по центру строки */}
                <img src={catNobg1} alt="" style={{ width: 18, height: 22, flexShrink: 0, objectFit: 'contain', display: 'block' }} />
                {/* Название */}
                <div lang="ru" style={{
                  fontSize: 13, fontWeight: 600, letterSpacing: '-.012em',
                  lineHeight: 1.3, minWidth: 0, overflowWrap: 'break-word',
                  hyphens: 'auto', textWrap: 'pretty',
                }}>{item.name}</div>
              </a>

              {/* Попап: 2 картинки + подкатегории + "Смотреть все" */}
              {isHov && (
                <div
                  onMouseEnter={keep}
                  onMouseLeave={leave}
                  style={{
                    position: 'absolute', zIndex: 40,
                    ...(flip
                      ? { right: '100%', paddingRight: 8 }
                      : { left: '100%', paddingLeft: 8 }),
                    top: -28,
                    minWidth: 230,
                    animation: 'cpPreviewIn .2s cubic-bezier(.2,.9,.3,1) both',
                  }}
                >
                  <div style={{
                    borderRadius: 14, background: '#fff',
                    border: '1px solid #ece9e4',
                    boxShadow: '0 16px 42px rgba(26,26,24,.17)',
                    overflow: 'hidden',
                  }}>
                    {/* Иконка категории на всю ширину */}
                    <div style={{
                      width: '100%', padding: '16px 0 10px',
                      background: '#f4f2ee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={catNobg1} alt="" style={{ width: 140, height: 170, objectFit: 'contain' }} />
                    </div>

                    {/* Подкатегории (если есть) */}
                    {leaves.length > 0 && (
                      <div style={{ padding: '6px 10px 4px' }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, color: '#c2bdb5',
                          letterSpacing: '.07em', textTransform: 'uppercase',
                          padding: '0 2px 5px',
                        }}>Подкатегории</div>
                        {leaves.map(leaf => (
                          <button key={leaf} className="cp-leaf"
                            onClick={() => onPickSubsection(item.name)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              width: '100%', padding: '6px 8px',
                              background: 'none', border: 'none', cursor: 'pointer',
                              textAlign: 'left', fontFamily: 'inherit',
                              fontSize: 13, color: '#6b6760',
                            }}
                          >
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#d6d0c9', flexShrink: 0 }} />
                            {leaf}
                          </button>
                        ))}
                        <div style={{ height: 1, background: '#f1eee9', margin: '6px 0 2px' }} />
                      </div>
                    )}
                    <div style={{ padding: '0 10px 10px' }}>
                      <button className="cp-see-all"
                        onClick={() => onPickSubsection(item.name)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '8px 12px', borderRadius: 8,
                          border: '1px solid #ece9e4', background: '#f9f8f6',
                          cursor: 'pointer', fontFamily: 'inherit',
                          fontSize: 12.5, fontWeight: 500, color: '#33322e',
                          transition: 'background .15s, color .15s',
                        }}
                      >
                        <span>Смотреть все {item.name}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Скролл-стрип карточек ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18' }}>{section}</span>
        <span style={{ fontSize: 12, color: '#b0ab9f' }}>листайте →</span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          ref={stripRef}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc((100% - 64px) / 5)',
            gap: 16,
            overflowX: 'auto',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            padding: '28px 2px 8px',
            scrollbarWidth: 'none',
          }}
        >
          {items.map((item, i) => {
            const isPinged = pinged === i;
            return (
            <div key={i} id={`cp-card-${i}`} className="cp-card"
              onClick={() => onPickSubsection(item.name)}
              style={{
                scrollSnapAlign: 'start', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 7,
                position: 'relative',
                zIndex: isPinged ? 10 : 'auto',
                animation: isPinged ? 'cpCardPop 1.5s cubic-bezier(.22,1,.3,1)' : 'none',
              }}
            >
              <div className="cp-thumb" style={{
                position: 'relative', aspectRatio: '4/3', minHeight: 104,
                borderRadius: 13, overflow: 'hidden', border: '1px solid #ece9e4',
                backgroundImage: `url(${item.img[0]})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'box-shadow .18s',
              }}>
                {isPinged && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: 13,
                    pointerEvents: 'none',
                    animation: 'cpCardPing 1.5s cubic-bezier(.2,.7,.3,1) forwards',
                    border: '2.5px solid rgba(100,110,140,.75)',
                  }} />
                )}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  fontSize: 10.5, fontWeight: 500, letterSpacing: '.04em', color: '#fff',
                  background: 'rgba(20,19,17,.55)', padding: '3px 7px', borderRadius: 6,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div lang="ru" style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  padding: '26px 12px 10px',
                  background: 'linear-gradient(to top, rgba(20,19,17,.82), transparent)',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  letterSpacing: '-.012em', lineHeight: 1.2,
                }}>{item.name}</div>
              </div>
              <div className="cp-card-label" style={{ fontSize: 12.5, color: '#a8a39a', transition: 'color .15s', paddingLeft: 2 }}>
                {subCount(item.name)} позиций
              </div>
            </div>
            );
          })}
        </div>

        <button className="cp-arr" onClick={() => scrollStrip(-1)} style={{
          position: 'absolute', left: -15, top: '42%', transform: 'translateY(-50%)',
          width: 38, height: 38, borderRadius: '50%', border: '1px solid #e8e4de',
          background: '#fff', boxShadow: '0 5px 16px -7px rgba(26,26,24,.28)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, transition: 'border-color .14s',
        }}>
          <span style={{ width: 7, height: 7, borderLeft: '1.8px solid #555', borderBottom: '1.8px solid #555', transform: 'rotate(45deg)', marginLeft: 2 }} />
        </button>
        <button className="cp-arr" onClick={() => scrollStrip(1)} style={{
          position: 'absolute', right: -15, top: '42%', transform: 'translateY(-50%)',
          width: 38, height: 38, borderRadius: '50%', border: '1px solid #e8e4de',
          background: '#fff', boxShadow: '0 5px 16px -7px rgba(26,26,24,.28)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, transition: 'border-color .14s',
        }}>
          <span style={{ width: 7, height: 7, borderRight: '1.8px solid #555', borderTop: '1.8px solid #555', transform: 'rotate(45deg)', marginRight: 2 }} />
        </button>
      </div>
    </div>
  );
}
