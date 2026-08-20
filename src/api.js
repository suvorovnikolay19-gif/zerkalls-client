const BASE = '';

export async function fetchProducts({ limit = 50, page = 1, search = '' } = {}) {
  const params = new URLSearchParams({ limit, page });
  if (search) params.set('search', search);
  const res = await fetch(`${BASE}/api/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
