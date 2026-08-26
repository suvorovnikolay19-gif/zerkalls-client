export default function ProfilePage({ onGoBack }) {
  return (
    <div style={{
      fontFamily: "'Golos Text', Helvetica, sans-serif",
      color: '#1a1a18',
      background: '#fbfaf8',
      minHeight: '100vh',
      WebkitFontSmoothing: 'antialiased',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid #dcd8d1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="34" height="34" fill="none" stroke="#a8a39a" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: '-.02em' }}>Тут будет личный кабинет</h1>
      <div style={{ fontSize: 15, color: '#8b877f' }}>Раздел в разработке</div>
      <button
        onClick={onGoBack}
        style={{ marginTop: 8, padding: '13px 28px', borderRadius: 999, border: '1px solid #e0dcd5', fontSize: 14, color: '#33322e', background: 'transparent', cursor: 'pointer' }}
      >
        ← Вернуться
      </button>
    </div>
  );
}
