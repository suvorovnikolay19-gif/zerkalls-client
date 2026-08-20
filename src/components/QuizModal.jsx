import { useState } from 'react';

const QUIZ = [
  {
    title: 'Какую форму вы предпочитаете?',
    hint: 'Выберите вариант, который нравится больше всего',
    options: ['Круглое', 'Квадратное', 'Овальное', 'Арочное', 'Нестандартное', 'Прямоугольное'],
  },
  {
    title: 'В каком стиле интерьер?',
    hint: 'Так мы подберём отделку и материал рамы',
    options: ['Минимализм', 'Лофт', 'Скандинавский', 'Классика', 'Джапанди', 'Ар-деко'],
  },
  {
    title: 'Где будет стоять предмет?',
    hint: 'Размер и крепление зависят от помещения',
    options: ['Прихожая', 'Гостиная', 'Спальня', 'Ванная', 'Кабинет', 'Студия'],
  },
  {
    title: 'Какой бюджет комфортен?',
    hint: 'Покажем только то, что укладывается в сумму',
    options: ['до 40 000 ₽', '40–70 000 ₽', '70–120 000 ₽', '120 000+ ₽', 'Без ограничений', 'Пока не знаю'],
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export default function QuizModal({ products, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const isResult = step >= QUIZ.length;
  const q = QUIZ[Math.min(step, QUIZ.length - 1)];
  const picked = answers[step];
  const canNext = !!picked;
  const recommended = products.slice(0, 3);
  const WHY = ['Совпадение 96% — форма и материал', 'Совпадение 91% — стиль и размер', 'Совпадение 87% — в рамках бюджета'];

  function next() {
    if (isResult) { onClose(); return; }
    if (canNext) setStep(s => s + 1);
  }

  function back() {
    if (step === 0) { onClose(); return; }
    setStep(s => s - 1);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,.44)', animation: 'dcFade .18s ease' }} />
      <div style={{ position: 'relative', width: 560, maxWidth: '100%', maxHeight: '100%', overflowY: 'auto', background: '#fff', borderRadius: 26, padding: '26px 30px 30px', animation: 'dcPop .22s cubic-bezier(.2,.8,.2,1)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
          <button onClick={back} style={{ fontSize: 20, color: '#1a1a18', cursor: 'pointer', width: 22, background: 'none', border: 'none', padding: 0 }}>‹</button>
          <div style={{ flex: 1, display: 'flex', gap: 6 }}>
            {QUIZ.map((_, i) => (
              <span key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: (isResult || i <= step) ? '#1a1a18' : '#e6e2dc' }} />
            ))}
          </div>
          <button onClick={onClose} style={{ fontSize: 14, color: '#8b877f', cursor: 'pointer', background: 'none', border: 'none' }}>Отмена</button>
        </div>

        {!isResult ? (
          <div>
            <h3 style={{ margin: '0 0 10px', fontSize: 27, lineHeight: 1.18, fontWeight: 500, letterSpacing: '-.02em' }}>{q.title}</h3>
            <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 26 }}>{q.hint}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              {q.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers(a => ({ ...a, [step]: opt }))}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 10, borderRadius: 14, background: '#faf9f7', border: `1.5px solid ${picked === opt ? '#1a1a18' : 'transparent'}`, cursor: 'pointer', transition: 'border-color .15s', textAlign: 'left' }}
                >
                  <div style={{ height: 116, borderRadius: 10, backgroundImage: 'repeating-linear-gradient(135deg, #f0ede8 0, #f0ede8 8px, #e8e4dd 8px, #e8e4dd 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: '#a8a39a', textAlign: 'center', padding: 6 }}>
                    {opt.toLowerCase()}
                  </div>
                  <div style={{ fontSize: 14, textAlign: 'center', color: '#33322e' }}>{opt}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ margin: '0 0 10px', fontSize: 27, lineHeight: 1.18, fontWeight: 500, letterSpacing: '-.02em' }}>
              Подобрали {recommended.length} {recommended.length === 1 ? 'вариант' : 'варианта'}
            </h3>
            <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 24 }}>
              {Object.values(answers).filter(Boolean).join(' · ')}
            </div>
            {recommended.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: '#8b877f', fontSize: 15 }}>
                Добавьте товары через админ-панель
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recommended.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 12, border: '1px solid #ece9e4', borderRadius: 16 }}>
                    <div style={{
                      width: 86, height: 86, flex: 'none', borderRadius: 11,
                      backgroundImage: p.images?.[0]?.filename
                        ? `url(${p.images[0].filename})`
                        : 'repeating-linear-gradient(135deg, #f0ede8 0, #f0ede8 8px, #e8e4dd 8px, #e8e4dd 16px)',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: '#8b877f' }}>{WHY[i]}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(p.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={next}
          style={{ marginTop: 28, padding: 17, borderRadius: 14, textAlign: 'center', fontSize: 15, fontWeight: 500, cursor: (isResult || canNext) ? 'pointer' : 'default', background: (isResult || canNext) ? '#1a1a18' : '#f1eee9', color: (isResult || canNext) ? '#fff' : '#b3aea5', width: '100%', border: 'none' }}
        >
          {isResult ? 'Смотреть каталог' : 'Далее'}
        </button>
      </div>
    </div>
  );
}
