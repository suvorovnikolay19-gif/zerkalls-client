// Доступ к Directus. В dev `/items` проксируется Vite на http://127.0.0.1:8055 (см. vite.config.js),
// картинки Directus отдаёт по /assets/<id>, для них нужен абсолютный адрес сервера.
// В dev по умолчанию берём хост страницы, а не localhost: тогда картинки открываются и с телефона по Wi-Fi
const devHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const DIRECTUS_URL = (import.meta.env.VITE_DIRECTUS_URL || `http://${devHost}:8055`).replace(/\/$/, '');
// на проде (Vercel) задаём VITE_DIRECTUS_URL и ходим на сервер напрямую, в dev через прокси Vite
const DIRECTUS = import.meta.env.VITE_DIRECTUS_URL ? `${DIRECTUS_URL}/items` : '/items';

export function assetUrl(fileId, params = '') {
  if (!fileId) return null;
  return `${DIRECTUS_URL}/assets/${fileId}${params ? `?${params}` : ''}`;
}

export async function fetchCategories({ parentId = null, limit = 200 } = {}) {
  const params = new URLSearchParams({ limit, fields: 'id,name,slug,parent,sort' });
  if (parentId) params.set('filter[parent][_eq]', parentId);
  else params.set('filter[parent][_null]', 'true');
  const res = await fetch(`${DIRECTUS}/categories?${params}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const json = await res.json();
  return json.data;
}

// Дерево категорий одно на всё приложение и за сессию не меняется, а
// CategoryPage дёргал его заново на каждую смену раздела. Кэшируем сам промис:
// параллельные вызовы схлопываются в один запрос, повторные — в готовый ответ.
const allCategoriesCache = new Map();

export function fetchAllCategories({ limit = 500 } = {}) {
  if (allCategoriesCache.has(limit)) return allCategoriesCache.get(limit);

  const params = new URLSearchParams({ limit, fields: 'id,name,slug,parent,sort', sort: 'sort,name' });
  const promise = fetch(`${DIRECTUS}/categories?${params}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    })
    .then(json => json.data)
    .catch(err => {
      allCategoriesCache.delete(limit); // неудачу не кэшируем — дадим шанс ретраю
      throw err;
    });

  allCategoriesCache.set(limit, promise);
  return promise;
}

// ---------- товары ----------

const PRODUCT_FIELDS = [
  'id', 'name', 'slug', 'status', 'price', 'price_type', 'old_price', 'badge', 'description', 'characteristics', 'sort',
  'category.id', 'category.name', 'category.slug', 'category.parent',
  'images.id', 'images.sort', 'images.directus_files_id.id', 'images.directus_files_id.title', 'images.directus_files_id.width', 'images.directus_files_id.height',
  'tags.tags_id.id', 'tags.tags_id.name', 'tags.tags_id.slug', 'tags.tags_id.active', 'tags.tags_id.sort',
  'tags.tags_id.group.id', 'tags.tags_id.group.name', 'tags.tags_id.group.slug', 'tags.tags_id.group.active',
].join(',');

const fmtRub = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

// Приводим товар Directus к формату, который ждут ProductCard / ProductGrid / CompareModal:
// images[].filename, characteristics[{name,value}] (+ служебные «Старая цена», «Скидка», «Badge»).
export function mapProduct(p) {
  const images = (p.images || [])
    .filter(i => i.directus_files_id)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(i => ({
      id: i.directus_files_id.id,
      filename: assetUrl(i.directus_files_id.id, 'width=900&quality=80&format=webp'),
      thumb: assetUrl(i.directus_files_id.id, 'width=300&quality=70&format=webp'),
      title: i.directus_files_id.title,
    }));

  // выключенные теги и теги выключенных групп наружу не отдаём
  const tags = (p.tags || [])
    .map(t => t.tags_id)
    .filter(t => t && t.active !== false && t.group && t.group.active !== false)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(t => ({ id: t.id, name: t.name, slug: t.slug, group: t.group.name, groupSlug: t.group.slug }));

  const characteristics = [...(p.characteristics || [])];
  if (p.old_price) characteristics.unshift({ name: 'Старая цена', value: fmtRub(p.old_price) });
  if (p.old_price && p.price && p.old_price > p.price) {
    characteristics.unshift({ name: 'Скидка', value: `-${Math.round((1 - p.price / p.old_price) * 100)}%` });
  }
  if (p.badge) characteristics.unshift({ name: 'Badge', value: p.badge });

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price ?? 0,
    priceType: p.price_type || 'fixed',
    oldPrice: p.old_price ?? null,
    badge: p.badge ?? null,
    description: p.description || '',
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug, parent: p.category.parent } : null,
    images,
    tags,
    characteristics,
  };
}

export async function fetchProducts({ limit = 100, page = 1, search = '', categoryId = null, categoryIds = null } = {}) {
  const params = new URLSearchParams({
    limit, page,
    fields: PRODUCT_FIELDS,
    sort: 'sort,-date_created',
    'filter[status][_eq]': 'published', // бесплатный Directus не умеет фильтр в правах, фильтруем сами
  });
  if (search) params.set('search', search);
  if (categoryIds?.length) params.set('filter[category][_in]', categoryIds.join(','));
  else if (categoryId) params.set('filter[category][_eq]', categoryId);

  const res = await fetch(`${DIRECTUS}/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const json = await res.json();
  return { products: (json.data || []).map(mapProduct) };
}

export async function fetchProductBySlug(slug) {
  const params = new URLSearchParams({ fields: PRODUCT_FIELDS, limit: 1, 'filter[slug][_eq]': slug, 'filter[status][_eq]': 'published' });
  const res = await fetch(`${DIRECTUS}/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const json = await res.json();
  return json.data?.[0] ? mapProduct(json.data[0]) : null;
}

// ---------- теги (для панели фильтров) ----------

// Возвращает [{ id, name, slug, category, tags: [{ id, name, slug }] }] только по включённым группам и тегам.
export async function fetchTagGroups() {
  const params = new URLSearchParams({
    limit: -1, sort: 'sort,name',
    fields: 'id,name,slug,active,category.id,category.name,category.slug,tags.id,tags.name,tags.slug,tags.active,tags.sort',
    'filter[active][_eq]': 'true',
  });
  const res = await fetch(`${DIRECTUS}/tag_groups?${params}`);
  if (!res.ok) throw new Error('Failed to fetch tag groups');
  const json = await res.json();
  return (json.data || []).map(g => ({
    id: g.id, name: g.name, slug: g.slug,
    category: g.category ? { id: g.category.id, name: g.category.name, slug: g.category.slug } : null,
    tags: (g.tags || []).filter(t => t.active !== false).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)).map(t => ({ id: t.id, name: t.name, slug: t.slug })),
  }));
}

export async function createPayment(data) {
  // TODO: реализовать через Directus Flow или отдельный сервис
  throw new Error('Payment not yet implemented');
}
