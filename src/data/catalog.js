// Данные каталога, вынесенные из компонентов.
//
// Раньше App.jsx тянул SECTIONS/ITEMS/TREE прямо из CategoryNav.jsx и
// CategoryPage.jsx — из-за этого оба компонента (и все их картинки) намертво
// сидели в главном чанке и их нельзя было загрузить лениво.

import mirrorsImg     from '../../assets/mirrors.webp';
import stairsImg      from '../../assets/stairs.webp';
import partitionsImg  from '../../assets/partitions.webp';
import furnitureImg   from '../../assets/furniture.webp';
import test2Img       from '../../assets/test-2.webp';
import test3Img       from '../../assets/test-3.webp';
import test4Img       from '../../assets/test-4.webp';

import p01  from '../../assets/categories-1/partitions/01_Fixed_LOFT_Partitions.webp';
import p02  from '../../assets/categories-1/partitions/02_LOFT_Partitions_with_Hinged_Doors.webp';
import p03  from '../../assets/categories-1/partitions/03_Sliding_LOFT_Partitions.webp';
import p04  from '../../assets/categories-1/partitions/04_Folding_LOFT_Partitions.webp';
import p05  from '../../assets/categories-1/partitions/05_Pivot_Partitions.webp';
import p06  from '../../assets/categories-1/partitions/06_Rotating_Louver_Partitions.webp';
import p07  from '../../assets/categories-1/partitions/07_Swinging_LOFT_Partitions.webp';
import p08  from '../../assets/categories-1/partitions/08_Movable_Transformable_Walls.webp';
import p09  from '../../assets/categories-1/partitions/09_Vertical_Retractable_Partitions.webp';
import p10  from '../../assets/categories-1/partitions/10_Standalone_LOFT_Doors.webp';
import p11  from '../../assets/categories-1/partitions/11_LOFT_Screens.webp';
import p12  from '../../assets/categories-1/partitions/12_Metal_Slat_Partitions.webp';
import p13  from '../../assets/categories-1/partitions/13_Metal_Rod_Partitions.webp';
import p14  from '../../assets/categories-1/partitions/14_Metal_Mesh_Partitions.webp';
import p15  from '../../assets/categories-1/partitions/15_Expanded_Metal_Partitions.webp';
import p16  from '../../assets/categories-1/partitions/16_Perforated_Metal_Partitions.webp';
import p17  from '../../assets/categories-1/partitions/17_Laser_Cut_Decorative_Metal_Partitions.webp';
import p18  from '../../assets/categories-1/partitions/18_Cable_String_Partitions.webp';
import p19  from '../../assets/categories-1/partitions/19_Chain_Curtains_Metal_Curtains.webp';
import p20  from '../../assets/categories-1/partitions/20_Suspended_Decorative_Partitions.webp';
import p21  from '../../assets/categories-1/partitions/21_Shelving_Partitions.webp';
import p22  from '../../assets/categories-1/partitions/22_Library_Partitions.webp';
import p23  from '../../assets/categories-1/partitions/23_TV_Media_Partitions.webp';
import p24  from '../../assets/categories-1/partitions/24_Workspace_Partitions.webp';
import p25  from '../../assets/categories-1/partitions/25_Plant_Partitions.webp';
import p26  from '../../assets/categories-1/partitions/26_Display_Partitions.webp';
import p27  from '../../assets/categories-1/partitions/27_Wine_Bar_Partitions.webp';
import p28  from '../../assets/categories-1/partitions/28_Partitions_with_Built_In_Furniture.webp';
import p29  from '../../assets/categories-1/partitions/29_Mobile_LOFT_Partitions.webp';
import p30  from '../../assets/categories-1/partitions/30_Acoustic_Partitions.webp';
import p31  from '../../assets/categories-1/partitions/31_Functional_Interactive_Partitions.webp';
import p32  from '../../assets/categories-1/partitions/32_Partitions_with_Integrated_Utilities.webp';
import p33  from '../../assets/categories-1/partitions/33_Illuminated_LOFT_Partitions.webp';
import p34  from '../../assets/categories-1/partitions/34_Modular_Partition_Systems.webp';
import p35  from '../../assets/categories-1/partitions/35_Room_in_Room_Systems.webp';
import p36  from '../../assets/categories-1/partitions/36_LOFT_Walk_In_Wardrobes.webp';
import p37  from '../../assets/categories-1/partitions/37_LOFT_Shower_Partitions.webp';
import p38  from '../../assets/categories-1/partitions/38_Kitchen_Living_Room_Partitions.webp';
import p39  from '../../assets/categories-1/partitions/39_Bedroom_Studio_Partitions.webp';
import p40  from '../../assets/categories-1/partitions/40_Office_LOFT_Partitions.webp';
import p41  from '../../assets/categories-1/partitions/41_Restaurant_HoReCa_Partitions.webp';
import p42  from '../../assets/categories-1/partitions/42_Retail_Showroom_Partitions.webp';
import p43  from '../../assets/categories-1/partitions/43_Special_Technical_LOFT_Systems.webp';

export const SECTIONS = [
  { name: 'Зеркала' },
  { name: 'Лестницы' },
  { name: 'Перегородки' },
  { name: 'Ширмы' },
  { name: 'Стеклянные доски' },
  { name: 'Комплектующие' },
];

export const SUBCATS = {
  'Зеркала':           ['Круглые', 'Овальные', 'Арочные', 'Во весь рост', 'С подсветкой', 'Нестандартные'],
  'Перегородки':       ['Лофт', 'Реечные', 'Раздвижные', 'Распашные', 'Стеклянные', 'Декоративные'],
  'Лестницы':          ['Винтовые', 'Маршевые', 'Модульные', 'Из дуба', 'На металлокаркасе', 'Для мансарды'],
  'Ширмы':             ['Реечные', 'Гармошка', 'Ротанг', 'Тканевые'],
  'Стеклянные доски':  ['Магнитные', 'Для кабинета', 'Для кухни', 'С печатью'],
  'Комплектующие':     ['Профили', 'Направляющие', 'Доводчики', 'Ручки', 'Крепёж'],
};

export const TREE = {
  'Зеркала': {
    'Круглые':       ['Без рамы', 'В латунной раме', 'С подсветкой'],
    'Овальные':      ['Классические', 'Вытянутые', 'С фацетом'],
    'Арочные':       ['Одинарные', 'Парные', 'С полкой'],
    'Во весь рост':  ['Напольные', 'Навесные', 'На опоре'],
    'С подсветкой':  ['Контурная', 'Фронтальная', 'С сенсором'],
    'Нестандартные': ['Гнутое стекло', 'По эскизу', 'Составные'],
  },
  'Лестницы': {
    'Винтовые':          ['С центральной стойкой', 'Со стеклом', 'Открытые'],
    'Маршевые':          ['Прямые', 'С площадкой', 'С поворотом'],
    'Модульные':         ['На тетиве', 'На косоуре', 'Консольные'],
    'Из дуба':           ['Массив', 'Шпон', 'Комбинированные'],
    'На металлокаркасе': ['Открытый каркас', 'Закрытый каркас'],
    'Для мансарды':      ['Компактные', 'Складные'],
  },
  'Перегородки': {
    'Лофт':        ['Одинарные', 'Двойные', 'В пол стены'],
    'Реечные':     ['Дубовые', 'Крашеные', 'С подсветкой'],
    'Раздвижные':  ['Одностворчатые', 'Двустворчатые', 'Каскадные'],
    'Распашные':   ['Одностворчатые', 'Двустворчатые', 'С фрамугой', 'Маятниковые'],
    'Стеклянные':  ['Рифлёное стекло', 'Матовое стекло', 'Тонированное стекло'],
    'Декоративные':['С плёнкой', 'С витражом', 'Ажурные'],
  },
  'Ширмы': {
    'Реечные':  ['Дуб', 'Орех', 'Крашеные'],
    'Гармошка': ['3 створки', '4 створки', '5 створок'],
    'Ротанг':   ['Натуральный', 'Тонированный'],
    'Тканевые': ['Однотонные', 'С рисунком'],
  },
  'Стеклянные доски': {
    'Магнитные':     ['Белые', 'Цветные', 'С печатью'],
    'Для кабинета':  ['Настенные', 'На опоре'],
    'Для кухни':     ['Скинали', 'С разметкой'],
    'С печатью':     ['Логотип', 'Календарь', 'По эскизу'],
  },
  'Комплектующие': {
    'Профили':       ['Алюминиевые', 'Стальные', 'Латунные'],
    'Направляющие':  ['Верхние', 'Нижние', 'Скрытые'],
    'Доводчики':     ['Напольные', 'Верхние'],
    'Ручки':         ['Скобы', 'Врезные', 'Латунные'],
    'Крепёж':        ['Зажимы', 'Уголки', 'Опоры'],
  },
};

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
