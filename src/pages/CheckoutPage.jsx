import { useState } from 'react';
import { useCart } from '../CartContext.jsx';

const WAYS = [
  { key: 'messenger', icon: '✉', title: 'Написать в мессенджер', text: 'Быстрая консультация в WhatsApp / Telegram', chips: true },
  { key: 'contacts', icon: '☏', title: 'Оставить контакты для связи', text: 'Менеджер свяжется с вами для уточнения деталей' },
  { key: 'form', icon: '▤', title: 'Заполнить форму', text: 'Самостоятельно укажите данные доставки и оплаты' },
];

const PERKS = [
  { icon: '⛨', title: 'Безопасная оплата', text: 'Платежи защищены и шифруются' },
  { icon: '⇉', title: 'Быстрая доставка', text: 'По всей России от 1 до 3 дней' },
  { icon: '↺', title: 'Лёгкий возврат', text: '14 дней на возврат без лишних вопросов' },
  { icon: '⚿', title: 'Ваши данные под защитой', text: 'Мы не передаём данные третьим лицам' },
];

const SHIPPING = ['Курьером', 'Самовывоз'];

function fmt(n) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
}

export default function CheckoutPage({ onGoHome, onGoStore, cartCount }) {
  const { items } = useCart();
  const [way, setWay] = useState('messenger');
  const [shipping, setShipping] = useState('Курьером');
  const [sent, setSent] = useState(false);

  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const accent = '#1a1a18';

  return (
    <div style={{ fontFamily: "'Golos Text', Helvetica, sans-serif", color: '#1a1a18', background: '#f7f6f3', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 40px 0', fontSize: 13, color: '#a8a39a' }}>
        <button onClick={onGoHome} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', padding: 0 }}>Главная</button>
        <span>›</span>
        <button onClick={onGoStore} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', padding: 0 }}>Каталог</button>
        <span>›</span>
        <span style={{ color: '#6b6862' }}>Оформление заказа</span>
      </div>

      {/* Main grid */}
      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 430px', gap: 26, alignItems: 'start', padding: '22px 40px 60px' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <h1 style={{ margin: '0 0 8px', fontSize: 46, fontWeight: 700, letterSpacing: '-.035em' }}>Оформление заказа</h1>
            <div style={{ fontSize: 15, color: '#8b877f' }}>Выберите удобный способ оформления заказа</div>
          </div>

          {/* Way selector */}
          <div style={{ padding: '28px 30px 30px', background: '#fff', border: '1px solid #ece9e4', borderRadius: 18 }}>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-.02em', marginBottom: 22 }}>Как вы хотите оформить заказ?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
              {WAYS.map(w => {
                const on = way === w.key;
                return (
                  <button
                    key={w.key}
                    onClick={() => { setWay(w.key); setSent(false); }}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 10,
                      padding: '22px 22px 24px', borderRadius: 16, cursor: 'pointer',
                      border: `1.5px solid ${on ? accent : '#ece9e4'}`,
                      background: on ? '#faf9f7' : '#fff',
                      boxShadow: on ? '0 10px 26px rgba(26,26,24,.09)' : 'none',
                      transition: 'border-color .2s ease, background .2s ease, box-shadow .2s ease',
                      textAlign: 'left', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ width: 54, height: 54, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: on ? '#e8e4dd' : '#f1eee9', color: on ? '#1a1a18' : '#6b6862', transition: 'background .2s ease', flexShrink: 0 }}>
                        {w.icon}
                      </div>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', border: `1.5px solid ${on ? accent : '#ddd8d1'}`, background: on ? accent : 'transparent', transition: 'background .2s ease, border-color .2s ease' }}>
                        {on ? '✓' : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 16.5, fontWeight: 600, letterSpacing: '-.01em' }}>{w.title}</div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.5, color: '#8b877f' }}>{w.text}</div>
                  </button>
                );
              })}
            </div>

            {/* Messenger panel */}
            {way === 'messenger' && (
              <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 30, marginTop: 26, padding: '40px 40px 38px', borderRadius: 18, background: '#f4f2ee', animation: 'coFade .28s cubic-bezier(.2,.8,.2,1)' }}>
                <div style={{ width: 92, height: 92, flexShrink: 0, borderRadius: '50%', background: '#e8e4dd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✉</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 470 }}>
                  <h2 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-.025em' }}>Оформление через мессенджер</h2>
                  <div style={{ fontSize: 15, lineHeight: 1.55, color: '#6b6862' }}>Свяжитесь с нами в удобном мессенджере — мы быстро ответим, поможем с выбором и оформим заказ за вас.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
                    <a href="https://wa.me/79854341133" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 28px', borderRadius: 12, background: '#1a1a18', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✆</span>
                      Написать в WhatsApp
                    </a>
                    <a href="https://t.me/zerkalls" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 28px', borderRadius: 12, background: '#33322e', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✈</span>
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts panel */}
            {way === 'contacts' && (
              <div style={{ marginTop: 26, padding: '32px 34px 34px', border: '1px solid #ece9e4', borderRadius: 18, animation: 'coFade .28s cubic-bezier(.2,.8,.2,1)' }}>
                <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, letterSpacing: '-.02em' }}>Оставьте свои контакты</h2>
                <div style={{ fontSize: 14.5, color: '#8b877f', marginBottom: 22 }}>Мы свяжемся с вами, уточним детали и ответим на вопросы</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                    <span style={{ fontSize: 15, color: '#b3aea5' }}>☺</span>
                    <input placeholder="Ваше имя" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                    <span style={{ fontSize: 15, color: '#b3aea5' }}>☏</span>
                    <input placeholder="Номер телефона" type="tel" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#c2bdb5' }}>+7 (___) ___-__-__</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px', minHeight: 96, border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                    <span style={{ fontSize: 15, color: '#b3aea5' }}>✉</span>
                    <textarea placeholder="Комментарий (необязательно)" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit', resize: 'none', lineHeight: 1.5 }} rows={3} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '18px 0 20px', fontSize: 13, color: '#6b6862' }}>
                  <span style={{ fontSize: 13, color: '#1a1a18' }}>⛨</span>
                  Мы <strong style={{ fontWeight: 600 }}>не передаём</strong> ваши данные третьим лицам
                </div>
                {sent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderRadius: 14, background: '#f1eee9', fontSize: 14.5, color: '#33322e', animation: 'coFade .24s ease' }}>
                    <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: '#1a1a18', color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                    Заявка отправлена — менеджер свяжется с вами в течение часа.
                  </div>
                ) : (
                  <button onClick={() => setSent(true)} style={{ width: '100%', padding: 19, borderRadius: 12, background: '#1a1a18', color: '#fff', fontSize: 15.5, fontWeight: 500, textAlign: 'center', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>Отправить</button>
                )}
              </div>
            )}

            {/* Form panel */}
            {way === 'form' && (
              <div style={{ marginTop: 26, padding: '32px 34px 34px', border: '1px solid #ece9e4', borderRadius: 18, animation: 'coFade .28s cubic-bezier(.2,.8,.2,1)' }}>
                <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, letterSpacing: '-.02em' }}>Заполните форму заказа</h2>
                <div style={{ fontSize: 14.5, color: '#8b877f', marginBottom: 24 }}>Укажите данные для оформления и доставки заказа</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '26px 24px' }}>
                  {/* Contacts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>Контактные данные</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>☺</span>
                      <input placeholder="Ваше имя" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>☏</span>
                      <input placeholder="Номер телефона" type="tel" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#c2bdb5' }}>+7 (___) ___-__-__</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>✉</span>
                      <input placeholder="E-mail (необязательно)" type="email" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  {/* Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>Адрес доставки</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>⌖</span>
                      <input placeholder="Город" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>⌂</span>
                      <input placeholder="Улица, дом, квартира" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', minHeight: 78, border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>✎</span>
                      <textarea placeholder="Комментарий к заказу (необязательно)" rows={2} style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit', resize: 'none', lineHeight: 1.5 }} />
                    </div>
                  </div>
                  {/* Shipping method */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>Способ доставки</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[{ name: 'Курьером', icon: '⇉' }, { name: 'Самовывоз', icon: '⌂' }].map(s => {
                        const on = shipping === s.name;
                        return (
                          <button
                            key={s.name}
                            onClick={() => setShipping(s.name)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px', borderRadius: 12, cursor: 'pointer', border: `1.5px solid ${on ? accent : '#e6e2dc'}`, background: on ? '#faf9f7' : '#fff', transition: 'border-color .2s ease, background .2s ease', fontFamily: 'inherit' }}
                          >
                            <span style={{ fontSize: 16, color: '#6b6862' }}>{s.icon}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                              <div style={{ fontSize: 12.5, color: '#8b877f' }}>Бесплатно</div>
                            </div>
                            <div style={{ marginLeft: 'auto', width: 20, height: 20, flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', border: `1.5px solid ${on ? accent : '#ddd8d1'}`, background: on ? accent : 'transparent' }}>
                              {on ? '✓' : ''}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Date/time */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>Удобное время доставки</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>▤</span>
                      <input type="date" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                      <span style={{ color: '#b3aea5' }}>◷</span>
                      <select style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, color: '#1a1a18', background: 'transparent', fontFamily: 'inherit', cursor: 'pointer' }}>
                        <option value="">Выберите время</option>
                        <option>9:00 – 12:00</option>
                        <option>12:00 – 15:00</option>
                        <option>15:00 – 18:00</option>
                        <option>18:00 – 21:00</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '22px 0 20px', fontSize: 13, color: '#6b6862' }}>
                  <span style={{ fontSize: 13, color: '#1a1a18' }}>⛨</span>
                  Мы <strong style={{ fontWeight: 600 }}>не передаём</strong> ваши данные третьим лицам
                </div>
                {sent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderRadius: 14, background: '#f1eee9', fontSize: 14.5, color: '#33322e', animation: 'coFade .24s ease' }}>
                    <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: '#1a1a18', color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                    Заявка отправлена — менеджер свяжется с вами в течение часа.
                  </div>
                ) : (
                  <button onClick={() => setSent(true)} style={{ width: '100%', padding: 19, borderRadius: 12, background: '#1a1a18', color: '#fff', fontSize: 15.5, fontWeight: 500, textAlign: 'center', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>Отправить заказ</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '26px 26px 28px', background: '#fff', border: '1px solid #ece9e4', borderRadius: 18, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.015em' }}>Ваш заказ</div>

          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0', color: '#8b877f', fontSize: 14 }}>
              <div style={{ fontSize: 36 }}>🛒</div>
              <div>Корзина пуста</div>
              <button onClick={onGoStore} style={{ marginTop: 4, padding: '10px 22px', borderRadius: 10, background: '#1a1a18', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Перейти в каталог</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((it, i) => (
                  <div key={it.id} style={{ display: 'flex', gap: 18, padding: '16px 0', borderBottom: '1px solid #f1eee9' }}>
                    <div style={{ width: 60, height: 68, flexShrink: 0, borderRadius: 10, background: '#f1eee9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⊞</div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.35 }}>{it.name}</div>
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ fontSize: 13, color: '#8b877f' }}>{it.quantity} шт.</span>
                        <span style={{ fontSize: 15, fontWeight: 500 }}>{fmt(it.price * it.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14.5 }}>
                  <span style={{ color: '#6b6862' }}>Сумма товаров</span>
                  <span>{fmt(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14.5 }}>
                  <span style={{ color: '#6b6862' }}>Доставка</span>
                  <span style={{ color: '#1a1a18', fontWeight: 500 }}>Бесплатно</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '20px 22px', borderRadius: 12, background: '#f4f2ee' }}>
                <span style={{ fontSize: 16.5, fontWeight: 500 }}>Итого</span>
                <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>{fmt(totalPrice)}</span>
              </div>
            </>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 4 }}>
            {PERKS.map(p => (
              <div key={p.icon} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: '50%', border: '1px solid #e6e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#4a4842' }}>{p.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: '#a8a39a' }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap');
        @keyframes coFade { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
