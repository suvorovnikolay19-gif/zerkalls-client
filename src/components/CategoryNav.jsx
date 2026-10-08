import { useState, useRef, useCallback } from 'react';
import catNobg1 from '../../assets/categories-nobg/1.webp';
import { toSlug } from '../utils/slug.js';
import { SECTIONS, SUBCATS, TREE } from '../data/catalog.js';

function subCount(name) { return 6 + (name.length * 7) % 34; }

export default function CategoryNav({ section, subsection, subsubsection, onPickSection, onPickSubsection, onPickLeaf, onOpenPanel }) {
  const [openSection, setOpenSection] = useState(null);
  const [openSub, setOpenSub] = useState(null);
  const secTimer = useRef(null);
  const subTimer = useRef(null);

  const enterSection = useCallback((name) => {
    clearTimeout(secTimer.current);
    setOpenSection(name);
    setOpenSub(null);
  }, []);

  const leaveSection = useCallback(() => {
    clearTimeout(secTimer.current);
    secTimer.current = setTimeout(() => {
      setOpenSection(null);
      setOpenSub(null);
    }, 130);
  }, []);

  const keepSection = useCallback(() => {
    clearTimeout(secTimer.current);
  }, []);

  const enterSub = useCallback((name) => {
    clearTimeout(subTimer.current);
    setOpenSub(name);
  }, []);

  const leaveSub = useCallback(() => {
    clearTimeout(subTimer.current);
    subTimer.current = setTimeout(() => setOpenSub(null), 100);
  }, []);

  const keepSub = useCallback(() => {
    clearTimeout(subTimer.current);
  }, []);

  const close = () => {
    clearTimeout(secTimer.current);
    clearTimeout(subTimer.current);
    setOpenSection(null);
    setOpenSub(null);
  };

  if (!section) {
    return (
      <>
        <style>{`
          @keyframes catDropFade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
          @keyframes catFlyFade  { from { opacity: 0; transform: translateX(6px) } to { opacity: 1; transform: translateX(0) } }
          .cat-sec-btn:hover { background: #f4f2ee !important; border-color: #d6d0c9 !important; }
          .cat-sec-btn.open   { background: #f4f2ee !important; border-color: #d6d0c9 !important; }
          .cat-see-all:hover  { background: #33322e !important; }
          .cat-sub-row:hover  { background: #f7f5f1 !important; }
          .cat-sub-row.open   { background: #f7f5f1 !important; }
          .cat-leaf-row:hover { background: #f7f5f1 !important; }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '22px 40px 0', flexWrap: 'wrap', position: 'relative', zIndex: 25 }}>
          {/* ─── Каталог (акцентная белая кнопка) ─── */}
          <button
            onClick={onOpenPanel}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 18px', borderRadius: 12,
              background: '#ffffff',
              border: '1.5px solid #1a1a18',
              boxShadow: '0 2px 10px rgba(26,26,24,.12)',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              fontSize: 14, fontWeight: 600, color: '#1a1a18', fontFamily: 'inherit',
              transition: 'background .15s, box-shadow .15s',
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 15, flexShrink: 0 }}>
              <span style={{ display: 'block', height: 1.5, background: '#1a1a18', width: 15, borderRadius: 2 }} />
              <span style={{ display: 'block', height: 1.5, background: '#1a1a18', width: 10, borderRadius: 2 }} />
              <span style={{ display: 'block', height: 1.5, background: '#1a1a18', width: 13, borderRadius: 2 }} />
            </span>
            Каталог
          </button>

          {SECTIONS.map(s => {
            const isOpen = openSection === s.name;
            const subs = TREE[s.name] || {};
            const subNames = Object.keys(subs);

            return (
              <div
                key={s.name}
                onMouseEnter={() => enterSection(s.name)}
                onMouseLeave={leaveSection}
                style={{ position: 'relative', flexShrink: 0 }}
              >
                {/* ─── Section card ─── */}
                <a
                  className={`cat-sec-btn${isOpen ? ' open' : ''}`}
                  href={`/catalog/${toSlug(s.name)}`}
                  onClick={e => { e.preventDefault(); onPickSection(s.name); close(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px 10px 10px', borderRadius: 12,
                    background: '#fff', border: '1px solid #ece9e4',
                    boxShadow: '0 1px 2px rgba(26,26,24,.04)',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    fontSize: 14, color: '#33322e', fontFamily: 'inherit',
                    transition: 'background .15s, border-color .15s',
                    textDecoration: 'none',
                  }}
                >
                  <img src={catNobg1} alt="" style={{ width: 34, height: 44, flexShrink: 0, objectFit: 'contain' }} />
                  {s.name}
                  <span style={{
                    fontSize: 14, color: '#a8a39a', lineHeight: 1,
                    display: 'inline-block',
                    transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)',
                    transition: 'transform .18s',
                  }}>⌄</span>
                </a>

                {/* ─── Level-2 dropdown ─── */}
                {isOpen && (
                  <div
                    onMouseEnter={keepSection}
                    onMouseLeave={leaveSection}
                    style={{
                      position: 'absolute', zIndex: 30, left: 0, top: '100%',
                      paddingTop: 8, minWidth: 260,
                      animation: 'catDropFade .16s ease',
                    }}
                  >
                    <div style={{
                      padding: 8, borderRadius: 16,
                      background: '#fff', border: '1px solid #ece9e4',
                      boxShadow: '0 20px 46px rgba(26,26,24,.16)',
                    }}>
                      {/* See all */}
                      <a
                        className="cat-see-all"
                        href={`/catalog/${toSlug(s.name)}`}
                        onClick={e => { e.preventDefault(); onPickSection(s.name); close(); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '15px 12px', borderRadius: 11,
                          background: '#1a1a18', color: '#fff',
                          border: 'none', cursor: 'pointer', width: '100%',
                          fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                          transition: 'background .15s', textDecoration: 'none',
                        }}
                      >
                        <span style={{ flex: 1, textAlign: 'left' }}>Смотреть все {s.name}</span>
                        <span style={{ color: 'rgba(255,255,255,.7)' }}>→</span>
                      </a>
                      <div style={{ height: 1, background: '#f1eee9', margin: '6px 4px' }} />

                      {/* Subcategory rows */}
                      {subNames.map(subName => {
                        const isSubOpen = openSub === subName;
                        const leaves = subs[subName] || [];

                        return (
                          <div
                            key={subName}
                            onMouseEnter={() => enterSub(subName)}
                            onMouseLeave={leaveSub}
                            style={{ position: 'relative' }}
                          >
                            <a
                              className={`cat-sub-row${isSubOpen ? ' open' : ''}`}
                              href={`/catalog/${toSlug(s.name)}/${toSlug(subName)}`}
                              onClick={e => { e.preventDefault(); onPickSection(s.name); onPickSubsection(subName); close(); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 12px', borderRadius: 11,
                                background: 'transparent', border: 'none',
                                cursor: 'pointer', width: '100%',
                                fontFamily: 'inherit',
                                transition: 'background .12s', textDecoration: 'none',
                              }}
                            >
                              <span style={{
                                width: 30, height: 38, flexShrink: 0, borderRadius: 5, display: 'inline-block',
                                backgroundImage: 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 5px, #e9e5de 5px, #e9e5de 10px)',
                              }} />
                              <span style={{ fontSize: 14, color: '#33322e', flex: 1, textAlign: 'left' }}>{subName}</span>
                              <span style={{ fontSize: 12, color: '#c2bdb5' }}>{subCount(subName)}</span>
                              {leaves.length > 0 && (
                                <span style={{ fontSize: 13, color: '#c2bdb5', marginLeft: 2 }}>›</span>
                              )}
                            </a>

                            {/* ─── Level-3 flyout ─── */}
                            {isSubOpen && leaves.length > 0 && (
                              <div
                                onMouseEnter={keepSub}
                                onMouseLeave={leaveSub}
                                style={{
                                  position: 'absolute', zIndex: 31,
                                  left: '100%', top: -8, paddingLeft: 8,
                                  minWidth: 250,
                                  animation: 'catFlyFade .16s ease',
                                }}
                              >
                                <div style={{
                                  padding: 8, borderRadius: 16,
                                  background: '#fff', border: '1px solid #ece9e4',
                                  boxShadow: '0 20px 46px rgba(26,26,24,.16)',
                                }}>
                                  <a
                                    className="cat-see-all"
                                    href={`/catalog/${toSlug(s.name)}/${toSlug(subName)}`}
                                    onClick={e => { e.preventDefault(); onPickSection(s.name); onPickSubsection(subName); close(); }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 12,
                                      padding: '15px 12px', borderRadius: 11,
                                      background: '#1a1a18', color: '#fff',
                                      border: 'none', cursor: 'pointer', width: '100%',
                                      fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                                      transition: 'background .15s', textDecoration: 'none',
                                    }}
                                  >
                                    <span style={{ flex: 1, textAlign: 'left' }}>Смотреть все {subName}</span>
                                    <span style={{ color: 'rgba(255,255,255,.7)' }}>→</span>
                                  </a>
                                  <div style={{ height: 1, background: '#f1eee9', margin: '6px 4px' }} />
                                  {leaves.map(leaf => (
                                    <a
                                      key={leaf}
                                      className="cat-leaf-row"
                                      href={`/catalog/${toSlug(s.name)}/${toSlug(subName)}/${toSlug(leaf)}`}
                                      onClick={e => { e.preventDefault(); onPickSection(s.name); onPickSubsection(subName); close(); }}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '9px 12px', borderRadius: 11,
                                        background: 'transparent', border: 'none',
                                        cursor: 'pointer', width: '100%',
                                        fontFamily: 'inherit',
                                        transition: 'background .12s', textDecoration: 'none',
                                      }}
                                    >
                                      <span style={{
                                        width: 30, height: 38, flexShrink: 0, borderRadius: 5, display: 'inline-block',
                                        backgroundImage: 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 5px, #e9e5de 5px, #e9e5de 10px)',
                                      }} />
                                      <span style={{ fontSize: 14, color: '#33322e', flex: 1, textAlign: 'left' }}>{leaf}</span>
                                      <span style={{ fontSize: 12, color: '#c2bdb5' }}>{subCount(leaf)}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ─── Subcategory chips view (when a section is already selected) ───
  const subcats = SUBCATS[section] || [];
  const sectionTree = TREE[section] || {};
  return (
    <>
      <style>{`
        @keyframes subChipDropFade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .sub-chip-leaf:hover { background: #f7f5f1 !important; }
        .sub-chip-see-all:hover { background: #33322e !important; }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 40px 0', flexWrap: 'wrap', position: 'relative', zIndex: 20 }}>
        {subcats.map(name => {
          const on = subsection === name;
          const leaves = sectionTree[name] || [];
          const hasLeaves = leaves.length > 0;
          const isHovered = openSection === name;

          return (
            <div
              key={name}
              onMouseEnter={() => hasLeaves && enterSection(name)}
              onMouseLeave={() => hasLeaves && leaveSection()}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <a
                href={`/catalog/${toSlug(section)}/${toSlug(name)}`}
                onClick={e => { e.preventDefault(); onPickSubsection(on ? null : name); onPickLeaf && onPickLeaf(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: hasLeaves ? '10px 14px 10px 12px' : '10px 22px 10px 12px',
                  borderRadius: 12,
                  background: on ? '#1a1a18' : '#fff',
                  border: `1px solid ${on ? '#1a1a18' : (isHovered ? '#d6d0c9' : '#ece9e4')}`,
                  boxShadow: '0 1px 2px rgba(26,26,24,.04)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: 14, color: on ? '#fff' : '#33322e', fontFamily: 'inherit',
                  transition: 'border-color .15s, background .15s, color .15s',
                  textDecoration: 'none',
                }}
              >
                <img src={catNobg1} alt="" style={{ width: 48, height: 56, flexShrink: 0, objectFit: 'contain', filter: on ? 'brightness(0) invert(1)' : 'none', transition: 'filter .15s' }} />
                {name}
                {hasLeaves && (
                  <span style={{
                    fontSize: 14, lineHeight: 1,
                    color: on ? 'rgba(255,255,255,.7)' : '#a8a39a',
                    display: 'inline-block',
                    transform: isHovered ? 'scaleY(-1)' : 'scaleY(1)',
                    transition: 'transform .18s',
                    marginLeft: 2,
                  }}>⌄</span>
                )}
              </a>

              {/* ─── Level-3 dropdown ─── */}
              {isHovered && hasLeaves && (
                <div
                  onMouseEnter={keepSection}
                  onMouseLeave={leaveSection}
                  style={{
                    position: 'absolute', zIndex: 30, left: 0, top: '100%',
                    paddingTop: 8, minWidth: 240,
                    animation: 'subChipDropFade .16s ease',
                  }}
                >
                  <div style={{
                    padding: 8, borderRadius: 16,
                    background: '#fff', border: '1px solid #ece9e4',
                    boxShadow: '0 20px 46px rgba(26,26,24,.16)',
                  }}>
                    <a
                      className="sub-chip-see-all"
                      href={`/catalog/${toSlug(section)}/${toSlug(name)}`}
                      onClick={e => { e.preventDefault(); onPickSubsection(name); setOpenSection(null); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '15px 12px', borderRadius: 11,
                        background: '#1a1a18', color: '#fff',
                        border: 'none', cursor: 'pointer', width: '100%',
                        fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                        transition: 'background .15s', textDecoration: 'none',
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>Смотреть все {name}</span>
                      <span style={{ color: 'rgba(255,255,255,.7)' }}>→</span>
                    </a>
                    <div style={{ height: 1, background: '#f1eee9', margin: '6px 4px' }} />
                    {leaves.map(leaf => {
                      const leafActive = subsubsection === leaf;
                      return (
                        <a
                          key={leaf}
                          className="sub-chip-leaf"
                          href={`/catalog/${toSlug(section)}/${toSlug(name)}/${toSlug(leaf)}`}
                          onClick={e => { e.preventDefault(); onPickSubsection(name); onPickLeaf && onPickLeaf(leaf); setOpenSection(null); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 12px', borderRadius: 11,
                            background: leafActive ? '#f4f2ee' : 'transparent', border: 'none',
                            cursor: 'pointer', width: '100%',
                            fontFamily: 'inherit', transition: 'background .12s',
                            textDecoration: 'none',
                          }}
                        >
                          <span style={{
                            width: 30, height: 38, flexShrink: 0, borderRadius: 5, display: 'inline-block',
                            backgroundImage: leafActive
                              ? 'linear-gradient(135deg, #e2ddd6, #cec8bf)'
                              : 'repeating-linear-gradient(135deg, #f2efea 0, #f2efea 5px, #e9e5de 5px, #e9e5de 10px)',
                          }} />
                          <span style={{ fontSize: 14, color: '#33322e', flex: 1, textAlign: 'left', fontWeight: leafActive ? 500 : 400 }}>{leaf}</span>
                          <span style={{ fontSize: 12, color: '#c2bdb5' }}>{subCount(leaf)}</span>
                          {leafActive && <span style={{ fontSize: 11, color: '#1a1a18' }}>✓</span>}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
