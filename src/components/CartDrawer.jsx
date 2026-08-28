import { useState } from 'react';
import { useCart } from '../CartContext.jsx';

const WAYS = [
  {
    key: 'form',
    icon: '▤',
    title: 'Отправить заявку по форме',
    text: 'Размеры, комплектация и адрес — ответим сметой в течение дня',
    note: 'Отлично! Заполните форму заявки — укажите размеры, комплектацию и адрес доставки. Ответим сметой в течение рабочего дня.',
  },
  {
    key: 'call',
    icon: '☏',
    title: 'Оставить контакты — свяжемся',
    text: 'Перезвоним в рабочее время и уточним все детали',
    note: 'Оставьте имя и номер телефона — менеджер перезвонит в течение часа в рабочее время.',
  },
  {
    key: 'chat',
    icon: '✆',
    title: 'Написать в мессенджер',
    text: 'Telegram или WhatsApp — переписка с менеджером',
    note: 'Продолжим в мессенджере: пришлём смету и сроки прямо в чат. Telegram или WhatsApp — на ваш выбор.',
  },
];

export default function CartDrawer({ onCheckout }) {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, totalPrice } = useCart();
  const [step, setStep] = useState('cart');
  const [way, setWay] = useState(null);

  const close = () => { setIsOpen(false); setStep('cart'); setWay(null); };

  const goCheckout = () => {
    close();
    if (onCheckout) onCheckout();
  };

  if (!isOpen) return null;

  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

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
              {step === 'cart' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, fontSize: 15 }}>
                    <span style={{ color: '#6b6862' }}>Итого</span>
                    <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em' }}>{fmt(totalPrice)}</span>
                  </div>
                  <button
                    onClick={goCheckout}
                    style={{ width: '100%', padding: 14, borderRadius: 12, background: '#1a1a18', color: '#fff', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer' }}
                  >
                    Оформить заказ
                  </button>
                </>
              )}

              {step === 'checkout' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <button
                      onClick={() => { setStep('cart'); setWay(null); }}
                      style={{ background: 'none', border: 'none', fontSize: 18, color: '#6b6862', cursor: 'pointer', padding: '0 4px 0 0', lineHeight: 1 }}
                    >
                      ‹
                    </button>
                    <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-.01em' }}>Как вам удобнее оплатить?</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#8b877f', marginBottom: 16 }}>
                    {items.length} {items.length === 1 ? 'товар' : 'товара'} · {fmt(totalPrice)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    {WAYS.map(w => {
                      const on = way === w.key;
                      return (
                        <button
                          key={w.key}
                          onClick={() => setWay(w.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                            border: `1.5px solid ${on ? '#1a1a18' : '#ece9e4'}`,
                            background: on ? '#faf9f7' : '#fff',
                            transition: 'border-color .15s',
                            fontFamily: 'inherit',
                          }}
                        >
                          <div style={{
                            width: 38, height: 38, flexShrink: 0, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16,
                            background: on ? '#1a1a18' : '#f1eee9',
                            color: on ? '#fff' : '#4a4842',
                            transition: 'background .15s',
                          }}>
                            {w.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 2 }}>{w.title}</div>
                            <div style={{ fontSize: 12, color: '#8b877f', lineHeight: 1.4 }}>{w.text}</div>
                          </div>
                          <div style={{ fontSize: 15, color: '#a8a39a', flexShrink: 0 }}>→</div>
                        </button>
                      );
                    })}
                  </div>

                  {way && (
                    <div style={{ padding: '13px 16px', borderRadius: 12, background: '#f4f2ee', fontSize: 13, color: '#33322e', lineHeight: 1.5, marginBottom: 10, animation: 'dcFade .2s ease' }}>
                      {WAYS.find(w => w.key === way)?.note}
                    </div>
                  )}

                  <button
                    disabled={!way}
                    style={{
                      width: '100%', padding: 14, borderRadius: 12,
                      background: way ? '#1a1a18' : '#f1eee9',
                      color: way ? '#fff' : '#b3aea5',
                      fontSize: 15, fontWeight: 500, border: 'none',
                      cursor: way ? 'pointer' : 'default',
                      transition: 'background .15s',
                    }}
                  >
                    {way ? 'Продолжить' : 'Выберите способ'}
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
