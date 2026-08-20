export default function HeroSection({ cartCount, onOpenPanel }) {
  return (
    <section style={{ position: 'relative', height: 620, overflow: 'hidden', background: '#8c857b' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, #9b948a 0, #9b948a 14px, #918a80 14px, #918a80 28px)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.42) 0%, rgba(20,19,17,.12) 38%, rgba(20,19,17,.55) 100%)' }} />

      <header style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: '26px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-.02em', color: '#fff' }}>objects</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onOpenPanel}>
              <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <div style={{ position: 'absolute', top: -8, right: -8, minWidth: 17, height: 17, borderRadius: '50%', background: '#fff', color: '#1a1a18', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </div>
              )}
            </div>
          </div>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.18)', fontSize: 14, color: 'rgba(255,255,255,.92)' }}>
          <span style={{ fontSize: 15 }}>⌂</span>
          <span style={{ cursor: 'pointer' }}>Каталог</span>
          <span style={{ cursor: 'pointer' }}>Хиты продаж</span>
          <span style={{ cursor: 'pointer' }}>Собрать комплект</span>
          <span style={{ cursor: 'pointer' }}>Лукбук</span>
        </nav>
      </header>

      <div style={{ position: 'absolute', left: 40, bottom: 56, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)' }}>by Studio Lumen</div>
        <h1 style={{ margin: 0, fontSize: 66, lineHeight: .96, fontWeight: 400, letterSpacing: '-.03em', color: '#fff' }}>
          Зеркала<br />и перегородки
        </h1>
        <button
          onClick={onOpenPanel}
          style={{ marginTop: 8, padding: '14px 30px', borderRadius: 999, background: '#fbfaf8', color: '#1a1a18', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none' }}
        >
          Подобрать
        </button>
      </div>
    </section>
  );
}
