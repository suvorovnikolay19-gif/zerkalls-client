import { useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { createPayment } from '../api.js';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, totalPrice } = useCart();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const close = () => { setIsOpen(false); setStep('cart'); setError(''); };

  const pay = async () => {
    setLoading(true); setError('');
    try {
      const data = await createPayment({ items, customerName: form.name || null, customerPhone: form.phone || null, customerEmail: form.email || null });
      clearCart();
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err?.error || 'Ошибка при создании платежа. Попробуйте позже.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const inp = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e6e2dc', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end', fontFamily: "'Golos Text', Helvetica, sans-serif" }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,.34)', animation: 'dcFade .18s ease' }} />
      <div style={{ position: 'relative', width: 460, maxWidth: '100%', height: '100%', background: '#fbfaf8', boxShadow: '-20px 0 60px rgba(26,26,24,.14)', display: 'flex', flexDirection: 'column', animation: 'dcSlide .24s cubic-bezier(.2,.8,.2,1)' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #ece9e4', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.01em' }}>Корзина</div>
          <button onClick={close} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#6b6862', cursor: 'pointer', background: 'none' }}>✕</button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#8b877f', fontSize: 14 }}>
            <div style={{ fontSize: 40 }}>🛒</div>
            <div>Корзина пуста</div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', borderRadius: 14, border: '1px solid #ece9e4' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: '#8b877f', marginTop: 2 }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #e6e2dc', background: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ minWidth: 22, textAlign: 'center', fontSize: 14, fontWeight: 500 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #e6e2dc', background: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    <button onClick={() => removeItem(item.id)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#a8a39a', marginLeft: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid #ece9e4', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, fontSize: 15 }}>
                <span style={{ color: '#6b6862' }}>Итого</span>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em' }}>{fmt(totalPrice)}</span>
              </div>

              {step === 'cart' && (
                <button onClick={() => setStep('checkout')} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#1a1a18', color: '#fff', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                  Оформить заказ
                </button>
              )}

              {step === 'checkout' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8b877f', marginBottom: 2 }}>Контактные данные (необязательно)</div>
                  <input style={inp} placeholder="Имя" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={loading} />
                  <input style={inp} placeholder="Телефон" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={loading} />
                  <input style={inp} placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={loading} />
                  {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fff0ef', color: '#c0392b', fontSize: 13 }}>{error}</div>}
                  <button onClick={pay} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#1a1a18', color: '#fff', fontSize: 15, fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1, marginTop: 4 }}>
                    {loading ? 'Переходим к оплате…' : `Оплатить ${fmt(totalPrice)}`}
                  </button>
                  <button onClick={() => { setStep('cart'); setError(''); }} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'transparent', color: '#4a4842', fontSize: 14, border: '1px solid #e6e2dc', cursor: 'pointer' }}>
                    Назад
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
