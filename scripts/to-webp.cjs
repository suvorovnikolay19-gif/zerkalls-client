/**
 * Перегоняет картинки из assets/ в WebP и ужимает до разумной ширины.
 * Исходники не трогает — кладёт рядом файл с тем же именем и .webp.
 *
 * Запуск:  npm i -D sharp && node scripts/to-webp.cjs
 *
 * После прогона не забыть поправить импорты в src/ на .webp
 * (расширение в пути импорта обязано совпадать с файлом на диске).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// [директория, предельная ширина, качество]
const JOBS = [
  ['assets/categories-1/partitions', 1400, 80],
  ['assets/hero-main',               1920, 82],
  ['assets/services',                1400, 80],
  ['assets/categories',              1400, 80],
  ['assets/categories-nobg',         1240, 85],
  ['assets/steps',                    960, 80],
  ['assets',                         1400, 80],   // только файлы в корне assets/
];

const EXT = /\.(png|jpe?g|webp)$/i;

(async () => {
  let before = 0, after = 0, n = 0;

  for (const [dir, maxW, quality] of JOBS) {
    for (const name of fs.readdirSync(dir)) {
      const src = path.join(dir, name);
      if (!fs.statSync(src).isFile() || !EXT.test(name)) continue;

      const out = path.join(dir, name.replace(EXT, '.webp'));
      const tmp = out + '.tmp';
      const meta = await sharp(src).metadata();

      await sharp(src)
        .resize({ width: Math.min(maxW, meta.width), withoutEnlargement: true })
        .webp({ quality, alphaQuality: 90, effort: 5 })
        .toFile(tmp);

      const b = fs.statSync(src).size, a = fs.statSync(tmp).size;
      // перекодировать уже-webp стоит, только если стало заметно легче
      if (src === out && a >= b * 0.9) { fs.unlinkSync(tmp); continue; }
      fs.renameSync(tmp, out);

      before += b; after += a; n++;
      console.log(`${(b / 1048576).toFixed(2)}M -> ${(a / 1048576).toFixed(2)}M  ${out}`);
    }
  }

  console.log(`\n${n} файлов: ${(before / 1048576).toFixed(1)} МБ -> ${(after / 1048576).toFixed(1)} МБ`);
})();
