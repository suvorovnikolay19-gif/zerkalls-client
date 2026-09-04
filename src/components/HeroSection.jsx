import heroImg from '../../assets/hero-main/hero-1.png';

export default function HeroSection({ cartCount, onOpenPanel, onGoHome, onOpenCart, onOpenProfile }) {
  return (
    <section style={{ position: 'relative', height: 620, overflow: 'hidden', background: '#8c857b' }}>
      <img src={heroImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,19,17,.42) 0%, rgba(20,19,17,.12) 38%, rgba(20,19,17,.55) 100%)' }} />

      <header style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: '26px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onGoHome} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 999, background: '#fff', color: '#1a1a18', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            ← Назад
          </button>
        </div>
      </header>
    </section>
  );
}
