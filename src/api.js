const DIRECTUS = '/items';

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

export async function fetchProducts({ limit = 50, page = 1, search = '' } = {}) {
  // Таблица products ещё не создана — возвращаем пустой список, клиент упадёт на mock
  return { products: [] };
}

export async function createPayment(data) {
  // TODO: реализовать через Directus Flow или отдельный сервис
  throw new Error('Payment not yet implemented');
}
