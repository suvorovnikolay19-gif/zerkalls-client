import { useState, useRef, useEffect, useCallback } from 'react';
import { SUBCATS, TREE, SECTIONS } from './CategoryNav.jsx';
import { ITEMS as SECTION_ITEMS, CAT_TREE } from './CategoryPage.jsx';

// entry-ключи для секций у которых есть прямой маршрут
const SECTION_ENTRY = {
  'Зеркала':     'mirrors',
  'Перегородки': 'partitions',
  'Лестницы':    'stairs',
};

const BASE_CRUMBS = {
  catalog:     [],
  mirrors:     [],
  partitions:  [],
  stairs:      [],
  novelties:   [{ name: 'Новинки сезона' }],
  bestsellers: [{ name: 'Хиты продаж'   }],
  sale:        [{ name: 'Распродажа'     }],
};

const norm = s => s.toLocaleLowerCase('ru').replaceAll('ё', 'е');

/* ── PickerItem ─────────────────────────────────────────────────────────── */
function PickerItem({ item, isActive, onHover, onPick }) {
  const [hov, setHov] = useState(false);
  const hi = hov || isActive;
  const bg = item.selected ? (hi ? '#f4f2ee' : '#f7f5f1') : (hi ? '#f4f2ee' : 'transparent');
  return (
    <button
      type="button"
      role="option"
      aria-selected={item.selected}
      onMouseMove={() => { setHov(true); onHover(); }}
      onMouseLeave={() => setHov(false)}
      onMouseDown={e => e.preventDefault()}
      onClick={() => onPick(item)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', border: 0, background: bg,
        color: '#2c2e30', fontFamily: 'inherit',
        fontSize: 14, lineHeight: '20px',
        textAlign: 'left', padding: '7px 9px',
        borderRadius: 6, cursor: 'pointer',
      }}
    >
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: item.selected ? 600 : 400 }}>
        {item.label}
      </span>
      {item.hasKids && (
        <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="#b5b0a7"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="m4.5 2.5 3.5 3.5-3.5 3.5" />
        </svg>
      )}
    </button>
  );
}

/* ── Picker (position: fixed — поверх всего) ────────────────────────────── */
function Picker({ anchorEl, items, onPick, onEnter, onLeave }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const listRef  = useRef(null);
  const [pos, setPos] = useState({ left: -9999, top: -9999 });

  const q        = norm(query.trim());
  const filtered = items.filter(it => norm(it.label).includes(q));

  useEffect(() => {
    if (!anchorEl) return;
    const place = () => {
      const r = anchorEl.getBoundingClientRect();
      const left = Math.max(8, Math.min(r.left - 10, window.innerWidth - 316 - 8));
      setPos({ left, top: r.bottom + 7 });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true });
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place); };
  }, [anchorEl]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (active < 0 || !listRef.current) return;
    const el = listRef.current.children[active];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const handleKey = e => {
    if (e.key === 'Escape')    { e.preventDefault(); onLeave(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); const h = filtered[active < 0 ? 0 : active]; if (h) onPick(h); }
  };

  return (
    <div
      role="dialog"
      aria-label="Выбор раздела"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onKeyDown={handleKey}
      style={{
        position: 'fixed', zIndex: 9999,
        left: pos.left, top: pos.top,
        width: 300,
        background: '#fff',
        border: '1px solid #e6e2da',
        borderRadius: 10,
        boxShadow: '0 1px 2px rgba(29,31,33,.05),0 12px 28px -12px rgba(29,31,33,.22)',
        overflow: 'hidden',
        animation: 'crumbPop .14s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderBottom: '1px solid #f0ede7' }}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#a8a29a" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="4.25" /><path d="m10.2 10.2 3 3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(-1); }}
          placeholder="Поиск на этом уровне"
          aria-label="Поиск на этом уровне"
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, minWidth: 0, border: 0, outline: 'none',
            background: 'none', fontSize: 14, lineHeight: '20px',
            color: '#1d1f21', padding: '1px 0', fontFamily: 'inherit',
          }}
        />
        <span style={{ fontSize: 11, color: '#a8a29a', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
          {filtered.length}
        </span>
      </div>

      <div
        ref={listRef}
        role="listbox"
        style={{ maxHeight: 300, overflowY: 'auto', overscrollBehavior: 'contain', padding: 5, display: 'flex', flexDirection: 'column', gap: 1, scrollbarWidth: 'thin', scrollbarColor: '#c8c3bb transparent' }}
      >
        {filtered.map((it, i) => (
          <PickerItem key={it.label} item={it} isActive={i === active}
            onHover={() => setActive(i)} onPick={onPick} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '22px 10px 24px', textAlign: 'center', fontSize: 13, color: '#8d8880' }}>
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CrumbBtn ───────────────────────────────────────────────────────────── */
function CrumbBtn({ label, isCurrent, isOpen, showCaret, onClick, onEnter, onLeave, btnRef }) {
  const [hov, setHov] = useState(false);
  const bg    = (isOpen || hov) ? '#efede8' : 'transparent';
  const color = isCurrent ? '#1d1f21' : ((isOpen || hov) ? '#1d1f21' : '#6f6a63');
  const caretOp = !showCaret ? 0 : isOpen ? 0.85 : 0.45;

  return (
    <button
      ref={btnRef}
      type="button"
      aria-current={isCurrent ? 'page' : undefined}
      aria-haspopup="listbox"
      onClick={onClick}
      onMouseEnter={() => { setHov(true); onEnter(); }}
      onMouseLeave={() => { setHov(false); onLeave(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        border: 0, background: bg, color,
        fontFamily: 'inherit', fontWeight: isCurrent ? 600 : 400,
        fontSize: 14, lineHeight: '20px', letterSpacing: '-0.1px',
        padding: '5px 8px', borderRadius: 7, cursor: 'pointer',
        whiteSpace: 'nowrap', maxWidth: 240,
        overflow: 'hidden', textOverflow: 'ellipsis',
        transition: 'background .13s, color .13s', outline: 'none',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      <svg viewBox="0 0 12 12" width="9" height="9"
        fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        style={{ opacity: caretOp, flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'opacity .13s, transform .16s' }}>
        <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
      </svg>
    </button>
  );
}

/* ── Главный компонент ──────────────────────────────────────────────────── */
export default function Breadcrumbs({
  entry, section, subsection, subsubsection,
  onGoHome, onGoEntry, onClearSubsection, onClearSubsubsection,
  onPickSection, onPickSubsection, onPickLeaf,
}) {
  const base = BASE_CRUMBS[entry] ?? BASE_CRUMBS.catalog;

  const crumbs = [
    { label: 'Главная', isRoot: true },
    ...base.map(c => ({ label: c.name })),
    ...(section    ? [{ label: section,    onClick: subsection    ? onClearSubsection    : undefined }] : []),
    ...(subsection ? [{ label: subsection, onClick: subsubsection ? onClearSubsubsection : undefined }] : []),
    ...(subsubsection ? [{ label: subsubsection }] : []),
  ];

  // Данные пикера по уровню крошки:
  // idx 0 (Главная) — пикер не нужен
  // idx 1 (секция)  — сиблинги: все разделы каталога
  // idx 2 (подсекция) — подкатегории текущей секции (SUBCATS[section])
  // idx 3 (sub-sub)   — листья дерева (TREE[section][subsection])
  const getPickerItems = useCallback(idx => {
    if (idx === 0) return null;
    if (idx === 1) {
      return SECTIONS.map(s => ({
        label:   s.name,
        entry:   SECTION_ENTRY[s.name] || null,
        hasKids: !!(SUBCATS[s.name]?.length),
        kind:    'section',
        selected: s.name === section,
      }));
    }
    if (idx === 2 && section) {
      const items = SECTION_ITEMS[section] || SUBCATS[section]?.map(n => ({ name: n })) || [];
      return items.map(item => ({
        label: item.name, kind: 'subsection',
        hasKids: !!(CAT_TREE[section]?.[item.name] || TREE[section]?.[item.name]),
        selected: item.name === subsection,
      }));
    }
    if (idx === 3 && section && subsection) {
      const leaves = CAT_TREE[section]?.[subsection] || TREE[section]?.[subsection];
      if (leaves) return leaves.map(name => ({
        label: name, kind: 'leaf',
        hasKids: false,
        selected: name === subsubsection,
      }));
    }
    return null;
  }, [section, subsection, subsubsection]);

  const [openIdx, setOpenIdx] = useState(null);
  const rootRef  = useRef(null);
  const btnRefs  = useRef([]);
  const tOpen    = useRef(null);
  const tClose   = useRef(null);

  const close = useCallback(() => {
    clearTimeout(tOpen.current);
    clearTimeout(tClose.current);
    setOpenIdx(null);
  }, []);

  const openAt = useCallback(idx => {
    clearTimeout(tOpen.current);
    clearTimeout(tClose.current);
    if (getPickerItems(idx)) setOpenIdx(idx);
  }, [getPickerItems]);

  const hoverOpen = useCallback(idx => {
    clearTimeout(tClose.current);
    clearTimeout(tOpen.current);
    tOpen.current = setTimeout(() => openAt(idx), 130);
  }, [openAt]);

  const hoverOut = useCallback(() => {
    clearTimeout(tOpen.current);
    clearTimeout(tClose.current);
    tClose.current = setTimeout(close, 220);
  }, [close]);

  useEffect(() => {
    const h = e => {
      if (openIdx !== null && rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener('pointerdown', h);
    return () => document.removeEventListener('pointerdown', h);
  }, [openIdx, close]);

  useEffect(() => () => { clearTimeout(tOpen.current); clearTimeout(tClose.current); }, []);

  const handlePick = item => {
    if (item.kind === 'section')    { if (item.entry && onGoEntry) onGoEntry(item.entry); if (!item.entry && onPickSection) onPickSection(item.label); }
    if (item.kind === 'subsection') { if (onPickSubsection) onPickSubsection(item.label); }
    if (item.kind === 'leaf')       { if (onPickLeaf) onPickLeaf(item.label); }
    close();
  };

  const pickerItems = openIdx !== null ? getPickerItems(openIdx) : null;
  const anchorEl    = openIdx !== null ? btnRefs.current[openIdx] : null;

  // «+» показываем когда есть следующий уровень — дети текущей последней крошки
  const trailingIdx   = crumbs.length;
  const trailingItems = getPickerItems(trailingIdx);
  const showTrailing  = !!(trailingItems?.length);

  return (
    <>
      <style>{`@keyframes crumbPop{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>

      <div
        ref={rootRef}
        data-bc-root=""
        style={{ position: 'relative', alignSelf: 'flex-start', maxWidth: '100%', padding: '22px 40px 0' }}
      >
        <nav
          aria-label="Хлебные крошки"
          style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, fontSize: 14, lineHeight: '20px' }}
        >
          {crumbs.map((c, i) => {
            const isCurrent = i === crumbs.length - 1;
            return (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                {i > 0 && (
                  <span aria-hidden="true" style={{ color: '#b9b5ad', padding: '0 4px', userSelect: 'none' }}>/</span>
                )}
                <CrumbBtn
                  btnRef={el => { btnRefs.current[i] = el; }}
                  label={c.label}
                  isCurrent={isCurrent}
                  isOpen={openIdx === i}
                  showCaret={i > 0}
                  onClick={() => {
                    if (c.isRoot && onGoHome)      { onGoHome();  return; }
                    if (!isCurrent && c.onClick)   { c.onClick(); return; }
                    openAt(i);
                  }}
                  onEnter={() => { if (!c.isRoot) hoverOpen(i); }}
                  onLeave={hoverOut}
                />
              </span>
            );
          })}

          {showTrailing && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span aria-hidden="true" style={{ color: '#b9b5ad', padding: '0 4px', userSelect: 'none' }}>/</span>
              <button
                ref={el => { btnRefs.current[trailingIdx] = el; }}
                type="button"
                aria-label="Открыть вложенные разделы"
                aria-haspopup="listbox"
                onClick={() => openAt(trailingIdx)}
                onMouseEnter={() => hoverOpen(trailingIdx)}
                onMouseLeave={hoverOut}
                style={{
                  display: 'flex', alignItems: 'center',
                  border: 0,
                  background: openIdx === trailingIdx ? '#efede8' : 'transparent',
                  color: '#8d8880', padding: '6px 7px', borderRadius: 7,
                  cursor: 'pointer', transition: 'background .13s, color .13s', outline: 'none',
                }}
              >
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2.5v7M2.5 6h7" />
                </svg>
              </button>
            </span>
          )}
        </nav>

        {pickerItems && anchorEl && (
          <Picker
            anchorEl={anchorEl}
            items={pickerItems}
            onPick={handlePick}
            onEnter={() => { clearTimeout(tOpen.current); clearTimeout(tClose.current); }}
            onLeave={hoverOut}
          />
        )}
      </div>
    </>
  );
}
