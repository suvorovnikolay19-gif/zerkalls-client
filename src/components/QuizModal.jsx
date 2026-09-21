import { useState } from 'react';
import catNobg1 from '../../assets/categories-nobg/1.png';

const PLAN_ROOMS = [
  { id: 'hall',    name: 'Прихожая', x: 24,  y: 24,  w: 146, h: 104 },
  { id: 'kitchen', name: 'Кухня',    x: 24,  y: 138, w: 146, h: 132 },
  { id: 'bath',    name: 'Санузел',  x: 24,  y: 280, w: 146, h: 116 },
  { id: 'living',  name: 'Гостиная', x: 180, y: 24,  w: 250, h: 246 },
  { id: 'bedroom', name: 'Спальня',  x: 180, y: 280, w: 250, h: 116 },
  { id: 'balcony', name: 'Лоджия',   x: 440, y: 24,  w: 136, h: 372 },
];

const MATERIALS = [
  { id: 'wood',     name: 'Дерево',   desc: 'Тёплая фактура, видимые волокна',   face: 'repeating-linear-gradient(103deg, #c99b62 0 3px, #bd8c54 3px 5px, #d0a56d 5px 9px)' },
  { id: 'alu',      name: 'Алюминий', desc: 'Гладкая поверхность, тонкие линии', face: 'repeating-linear-gradient(92deg, #cdd0d2 0 2px, #bcc0c3 2px 4px)' },
  { id: 'concrete', name: 'Бетон',    desc: 'Однородный серый, мелкие поры',     face: 'radial-gradient(circle at 30% 30%, #b9b7b1 1px, transparent 1.5px) 0 0/7px 7px, radial-gradient(circle at 70% 60%, #a9a7a2 1px, transparent 1.5px) 2px 3px/9px 9px, #c3c1bb' },
  { id: 'glass',    name: 'Стекло',   desc: 'Прозрачная поверхность и блики',   face: 'linear-gradient(135deg, rgba(214,235,240,.85), rgba(176,210,219,.6) 45%, rgba(228,244,247,.9))' },
  { id: 'plastic',  name: 'Пластик',  desc: 'Гладкий глянец, яркий блик',       face: 'linear-gradient(140deg, #f3f2ee, #dedcd6 55%, #cfcdc6)' },
  { id: 'steel',    name: 'Сталь',    desc: 'Тёмный матовый металл',            face: 'linear-gradient(135deg, #5c6065, #43474b 60%, #363a3d)' },
];

const QUIZ = [
  { type: 'default',  title: 'Какую форму вы предпочитаете?',    hint: 'Выберите вариант, который нравится больше всего', options: ['Круглое', 'Квадратное', 'Овальное', 'Арочное', 'Нестандартное', 'Прямоугольное'] },
  { type: 'default',  title: 'В каком стиле интерьер?',          hint: 'Так мы подберём отделку и материал рамы',         options: ['Минимализм', 'Лофт', 'Скандинавский', 'Классика', 'Джапанди', 'Ар-деко'] },
  { type: 'default',  title: 'Где будет стоять предмет?',        hint: 'Размер и крепление зависят от помещения',         options: ['Прихожая', 'Гостиная', 'Спальня', 'Ванная', 'Кабинет', 'Студия'] },
  { type: 'room',     title: 'Какое помещение нужно остеклить?', hint: 'Наведите на план — выберите одну или несколько зон' },
  { type: 'material', title: 'Какой материал предпочитаете?',    hint: 'Выберите вариант, который нравится больше всего' },
  { type: 'default',  title: 'Какой бюджет комфортен?',          hint: 'Покажем только то, что укладывается в сумму',      options: ['до 40 000 ₽', '40–70 000 ₽', '70–120 000 ₽', '120 000+ ₽', 'Без ограничений', 'Пока не знаю'] },
];

function pc(v, total) { return (v / total * 100).toFixed(3) + '%'; }

function RoomStep({ selected, onChange }) {
  const [hovered, setHovered] = useState(null);
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 22, alignItems: 'start' }}>
      {/* План квартиры */}
      <div style={{ background: '#f4f2ee', borderRadius: 16, padding: 14 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '600 / 420', background: '#efece6', border: '2px solid #dcd8d0', borderRadius: 10 }}>
          {PLAN_ROOMS.map(r => {
            const isSel = selected.includes(r.id);
            const isHov = hovered === r.id;
            return (
              <div
                key={r.id}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(r.id)}
                style={{
                  position: 'absolute', cursor: 'pointer', borderRadius: 6,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 3, textAlign: 'center',
                  padding: 6, overflow: 'hidden',
                  left: pc(r.x, 600), top: pc(r.y, 420),
                  width: pc(r.w, 600), height: pc(r.h, 420),
                  background: isSel ? '#cfd9ce' : isHov ? '#e3e7e0' : '#f8f7f4',
                  border: isSel ? '2px solid #44503f' : isHov ? '2px solid #7d8a78' : '1px solid #dcd8d0',
                  transition: 'background .18s, border-color .18s',
                }}
              >
                <div style={{ fontSize: 12, lineHeight: 1.2, color: isSel ? '#22251f' : '#4b4e46', letterSpacing: '.01em' }}>{r.name}</div>
                <div style={{
                  position: 'absolute', top: 5, right: 5,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#22251f', color: '#f6f5f2', fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isSel ? 1 : 0, transition: 'opacity .18s',
                }}>✓</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Чипы-кнопки */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PLAN_ROOMS.map(r => {
          const isSel = selected.includes(r.id);
          const isHov = hovered === r.id;
          return (
            <button
              key={r.id}
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => toggle(r.id)}
              style={{
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 14, padding: '13px 16px', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                border: `1px solid ${isSel ? '#22251f' : '#e2e0da'}`,
                background: isSel ? '#22251f' : isHov ? '#f0eee9' : '#fbfaf8',
                color: isSel ? '#f6f5f2' : '#22251f',
                transition: 'background .15s, border-color .15s',
              }}
            >
              <span>{r.name}</span>
              <span style={{ fontSize: 12, opacity: isSel ? 1 : 0, transition: 'opacity .15s' }}>✓</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MaterialStep({ selected, onChange }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
      {MATERIALS.map(m => {
        const isSel = selected === m.id;
        const isHov = hovered === m.id;
        return (
          <div
            key={m.id}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(m.id)}
            style={{
              cursor: 'pointer', borderRadius: 16, padding: '18px 16px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              border: `1px solid ${isSel ? '#44503f' : '#e2e0da'}`,
              background: isSel ? '#eef0ec' : isHov ? '#f4f2ee' : '#fbfaf8',
              transform: isHov && !isSel ? 'translateY(-2px)' : 'none',
              transition: 'background .18s, border-color .18s, transform .18s',
            }}
          >
            {/* 3D куб */}
            <div style={{ width: 96, height: 96, perspective: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 62, height: 62, transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-36deg)' }}>
                <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(31px)', background: m.face, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)' }} />
                <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(90deg) translateZ(31px)', background: m.face, filter: 'brightness(.82)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)' }} />
                <div style={{ position: 'absolute', inset: 0, transform: 'rotateX(90deg) translateZ(31px)', background: m.face, filter: 'brightness(1.12)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 15, color: '#22251f' }}>{m.name}</div>
              <div style={{ fontSize: 12, lineHeight: 1.45, color: '#676a62' }}>{m.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export default function QuizModal({ products, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const isResult = step >= QUIZ.length;
  const q = QUIZ[Math.min(step, QUIZ.length - 1)];

  const roomAnswer = answers[3] || [];
  const canNext = isResult
    ? true
    : q.type === 'room'
      ? roomAnswer.length > 0
      : !!answers[step];

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

  const isWide = q.type === 'room';
  const modalWidth = isWide ? 860 : 560;

  const selectedRoomNames = roomAnswer.map(id => PLAN_ROOMS.find(r => r.id === id)?.name).filter(Boolean);
  const selectedMat = answers[4] ? MATERIALS.find(m => m.id === answers[4])?.name : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,.44)', animation: 'dcFade .18s ease' }} />
      <div style={{
        position: 'relative', width: modalWidth, maxWidth: '100%', maxHeight: '90vh',
        overflowY: 'auto', background: '#fff', borderRadius: 26,
        padding: '26px 30px 30px', animation: 'dcPop .22s cubic-bezier(.2,.8,.2,1)',
        transition: 'width .25s cubic-bezier(.2,.8,.2,1)',
      }}>

        {/* Прогресс */}
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
            <h3 style={{ margin: '0 0 8px', fontSize: 27, lineHeight: 1.18, fontWeight: 500, letterSpacing: '-.02em' }}>{q.title}</h3>
            <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 22 }}>{q.hint}</div>

            {q.type === 'room' ? (
              <>
                <RoomStep
                  selected={roomAnswer}
                  onChange={val => setAnswers(a => ({ ...a, [step]: val }))}
                />
                <div style={{ marginTop: 16, fontSize: 14, color: '#6d6f68' }}>
                  {selectedRoomNames.length > 0
                    ? `Выбрано (${selectedRoomNames.length}): ${selectedRoomNames.join(', ')}`
                    : `Шаг ${step + 1} из ${QUIZ.length} · можно выбрать несколько зон`}
                </div>
              </>
            ) : q.type === 'material' ? (
              <>
                <MaterialStep
                  selected={answers[step] || null}
                  onChange={val => setAnswers(a => ({ ...a, [step]: val }))}
                />
                <div style={{ marginTop: 16, fontSize: 14, color: '#6d6f68' }}>
                  {selectedMat ? `Материал: ${selectedMat}` : `Шаг ${step + 1} из ${QUIZ.length}`}
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                {q.options.map(opt => {
                  const picked = answers[step];
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers(a => ({ ...a, [step]: opt }))}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 10, padding: 10,
                        borderRadius: 14, background: '#faf9f7',
                        border: `1.5px solid ${picked === opt ? '#1a1a18' : 'transparent'}`,
                        cursor: 'pointer', transition: 'border-color .15s', textAlign: 'left',
                      }}
                    >
                      <div style={{ height: 116, borderRadius: 10, background: '#f5f3f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={catNobg1} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                      </div>
                      <div style={{ fontSize: 14, textAlign: 'center', color: '#33322e' }}>{opt}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 style={{ margin: '0 0 10px', fontSize: 27, lineHeight: 1.18, fontWeight: 500, letterSpacing: '-.02em' }}>
              Подобрали {recommended.length} {recommended.length === 1 ? 'вариант' : 'варианта'}
            </h3>
            <div style={{ fontSize: 15, color: '#8b877f', marginBottom: 24 }}>
              {Object.entries(answers)
                .filter(([, v]) => v)
                .map(([, v]) => Array.isArray(v) ? v.map(id => PLAN_ROOMS.find(r => r.id === id)?.name).filter(Boolean).join(', ') : v)
                .join(' · ')}
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
          style={{
            marginTop: 28, padding: 17, borderRadius: 14, textAlign: 'center',
            fontSize: 15, fontWeight: 500, width: '100%', border: 'none',
            cursor: (isResult || canNext) ? 'pointer' : 'not-allowed',
            background: (isResult || canNext) ? '#1a1a18' : '#f1eee9',
            color: (isResult || canNext) ? '#fff' : '#b3aea5',
          }}
        >
          {isResult ? 'Смотреть каталог' : 'Далее'}
        </button>
      </div>
    </div>
  );
}
