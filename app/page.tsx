"use client";
import React, { useState, useEffect } from "react";
import CameraView from "./components/CameraView";
import ThemeSelector from "./components/ThemeSelector";
import FilterSelector from "./components/FilterSelector";
import BorderSelector from "./components/BorderSelector";
import StickerPicker from "./components/StickerPicker";
import PhotoStrip, { Sticker, LayoutType } from "./components/PhotoStrip";
import { THEMES } from "./constants/themes";
import { CAMERA_FILTERS } from "./constants/filters";
import { BORDER_STYLES } from "./constants/borders";
import { StickerSize } from "./constants/stickers";
import { LayoutList, LayoutGrid, RectangleHorizontal } from "lucide-react";

export interface PhotoWithStickers {
  id: string;
  src: string;
  stickers: Sticker[];
}

export type StickerMode = 'photo' | 'strip';

export default function PhotoboothPro() {
  const [photos,          setPhotos]          = useState<PhotoWithStickers[]>([]);
  const [activeThemeId,   setActiveThemeId]   = useState(THEMES[0].id);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [photoCount,      setPhotoCount]      = useState<number>(3);
  const [customText,      setCustomText]      = useState<string>("");
  const [activeFilterId,  setActiveFilterId]  = useState('none');
  const [activeBorderId,  setActiveBorderId]  = useState('none');
  const [stripStickers,   setStripStickers]   = useState<Sticker[]>([]);
  const [stickerMode,     setStickerMode]     = useState<StickerMode>('photo');
  const [flashEnabled,    setFlashEnabled]    = useState(true);
  const [retakeIndex,     setRetakeIndex]     = useState<number | null>(null);
  const [activeLayout,    setActiveLayout]    = useState<LayoutType>('vertical');

  const activeTheme     = THEMES.find(t => t.id === activeThemeId) ?? THEMES[0];
  const activeFilterCss = CAMERA_FILTERS.find(f => f.id === activeFilterId)?.css ?? 'none';
  const activeBorder    = BORDER_STYLES.find(b => b.id === activeBorderId) ?? BORDER_STYLES[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.code === 'KeyR' && photos.length > 0 && !isSessionActive) {
        setPhotos([]); setStripStickers([]); setRetakeIndex(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photos, isSessionActive]);

  const addSticker = (emoji: string, size: StickerSize) => {
    const newSticker: Sticker = {
      id: `stk-${Date.now()}`, 
      emoji, 
      x: 70 + Math.random() * 80, 
      y: 70 + Math.random() * 80,
      size,
      rotation: 0,
      opacity: 1,
    };

    if (stickerMode === 'strip') {
      setStripStickers(prev => [...prev, newSticker]);
    } else {
      // Add to the last photo in photo mode
      if (photos.length > 0) {
        setPhotos(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            stickers: [...updated[lastIndex].stickers, newSticker]
          };
          return updated;
        });
      }
    }
  };

  const handlePhotoTaken = (src: string) => {
    if (retakeIndex !== null) {
      setPhotos(prev => { 
        const u=[...prev]; 
        u[retakeIndex] = { ...u[retakeIndex], src };
        return u; 
      });
      setRetakeIndex(null);
    } else {
      setPhotos(prev => [...prev, { 
        id: `photo-${Date.now()}`, 
        src, 
        stickers: [] 
      }]);
    }
  };

  const handleReorderPhotos = (oldIndex: number, newIndex: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  const handleMovePhoto = (index: number, direction: number) =>
    setPhotos(prev => {
      const n=[...prev], t=index+direction;
      [n[index],n[t]]=[n[t],n[index]]; return n;
    });

  /* ── enhanced style helpers ── */
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background:"rgba(255, 255, 255, 0.95)",
    backdropFilter:"blur(10px)",
    borderRadius:20,
    border:"1.5px solid rgba(237, 232, 224, 0.8)",
    boxShadow:"0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ...extra,
  });

  const faded: React.CSSProperties = {
    opacity: isSessionActive ? 0.5 : 1,
    pointerEvents: isSessionActive ? "none" : "auto",
    transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: isSessionActive ? "grayscale(0.3)" : "none",
  };

  const lbl: React.CSSProperties = {
    display:"block", 
    fontSize:"0.7rem", 
    fontWeight:800,
    color:"#8B7355", 
    marginBottom:10,
    letterSpacing:"0.16em", 
    textTransform:"uppercase",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
        
        *, *::before, *::after { 
          box-sizing: border-box; 
          margin: 0;
          padding: 0;
        }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Input focus states */
        .hi { 
          transition: border-color .25s cubic-bezier(0.4, 0, 0.2, 1), 
                      background .25s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow .25s cubic-bezier(0.4, 0, 0.2, 1),
                      transform .25s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .hi:focus { 
          outline: none !important; 
          border-color: #f59e0b !important; 
          background: #fffbf0 !important; 
          box-shadow: 0 0 0 4px rgba(245,158,11,.15), 0 4px 12px rgba(245,158,11,.1) !important;
          transform: translateY(-1px);
        }
        
        /* Filter/button hover states */
        .fp { 
          transition: all .2s cubic-bezier(0.4, 0, 0.2, 1); 
          cursor: pointer; 
        }
        .fp:hover { 
          background: #f5f0e8 !important; 
          color: #7c5a2e !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .fp:active {
          transform: translateY(0);
        }
        
        /* Sticker hover states */
        .sk { 
          transition: all .2s cubic-bezier(0.34, 1.56, 0.64, 1); 
          cursor: pointer; 
        }
        .sk:hover { 
          background: #fff8e1 !important; 
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 4px 12px rgba(245,158,11,0.2);
        }
        .sk:active {
          transform: scale(1.05);
        }
        
        /* Layout button hover */
        .lb { 
          transition: all .2s cubic-bezier(0.4, 0, 0.2, 1); 
          cursor: pointer; 
          border: none; 
        }
        .lb:hover { 
          opacity: .85;
          transform: translateY(-1px);
        }
        .lb:active {
          transform: translateY(0);
        }
        
        /* Fade-in animation */
        @keyframes hb { 
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }
        .hb { 
          animation: hb .5s cubic-bezier(0.4, 0, 0.2, 1) both; 
        }
        
        /* Pulse animation for active elements */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Shimmer effect */
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        /* Hide scrollbar */
        .nsb::-webkit-scrollbar { display: none; }
        .nsb { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        
        /* Smooth card hover */
        .card-hover {
          transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      <main style={{
        minHeight:"100vh",
        background:"linear-gradient(135deg, #faf8f3 0%, #f7f3ee 50%, #f5f0e8 100%)",
        backgroundImage:`
          linear-gradient(135deg, #faf8f3 0%, #f7f3ee 50%, #f5f0e8 100%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.025'/%3E%3C/svg%3E")
        `,
        fontFamily:"'DM Sans',sans-serif", 
        color:"#1f1b14",
        padding:"clamp(20px, 5vw, 40px) clamp(16px, 4vw, 32px) 80px",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          {/* HEADER */}
          <header className="hb" style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:16, marginBottom:8 }}>
              <div style={{ 
                height:2, 
                width:50, 
                background:"linear-gradient(90deg,transparent,#f59e0b)",
                borderRadius:2
              }}/>
              <span style={{ 
                fontFamily:"'DM Mono',monospace", 
                fontSize:"0.7rem", 
                letterSpacing:"0.3em", 
                color:"#d97706", 
                textTransform:"uppercase",
                fontWeight:600
              }}>est. 2024</span>
              <div style={{ 
                height:2, 
                width:50, 
                background:"linear-gradient(90deg,#f59e0b,transparent)",
                borderRadius:2
              }}/>
            </div>
            <h1 style={{
              fontFamily:"'Bebas Neue',cursive",
              fontSize:"clamp(3rem,8vw,5.5rem)",
              letterSpacing:"0.1em", 
              lineHeight:0.95,
              background:"linear-gradient(135deg,#92400e 0%,#d97706 30%,#f59e0b 60%,#fbbf24 80%,#d97706 100%)",
              backgroundSize:"200% 200%",
              WebkitBackgroundClip:"text", 
              WebkitTextFillColor:"transparent",
              margin:"0 0 8px",
              textShadow:"0 2px 20px rgba(217,119,6,0.1)",
            }}>HAPPI BOOTH</h1>
            <p style={{ 
              fontFamily:"'DM Mono',monospace", 
              fontSize:"0.75rem", 
              color:"#b8956f", 
              letterSpacing:"0.28em", 
              textTransform:"uppercase",
              fontWeight:500
            }}>
              capture · create · cherish
            </p>
          </header>

          {/* GRID: equal halves */}
          <div style={{ 
            display:"grid", 
            gridTemplateColumns:"1fr 1fr", 
            gap:32, 
            alignItems:"start"
          }}>

            {/* ━━ LEFT ━━ */}
            <div className="hb" style={{ 
              display:"flex", 
              flexDirection:"column", 
              gap:18, 
              animationDelay:".1s", 
              minWidth:0 
            }}>

              {/* CAMERA */}
              <CameraView
                photoCount={photoCount}
                activeFilter={activeFilterCss}
                flashEnabled={flashEnabled}
                retakeIndex={retakeIndex}
                onToggleFlash={() => setFlashEnabled(f=>!f)}
                onPhotoTaken={handlePhotoTaken}
                onSessionStart={() => setIsSessionActive(true)}
                onSessionEnd={() => setIsSessionActive(false)}
              />

              {/* FRAMES + TITLE */}
              <div style={{ ...card({ padding:"20px 22px" }), ...faded }} className="card-hover">
                <div style={{ display:"flex", gap:16 }}>
                  <div style={{ flex:1 }}>
                    <label style={lbl}>Frames</label>
                    <div style={{ display:"flex", gap:8 }}>
                      {[2,3,4].map(n => (
                        <button key={n} onClick={() => setPhotoCount(n)} disabled={photos.length>0}
                          style={{
                            flex:1, 
                            padding:"12px 0", 
                            borderRadius:12,
                            border: photoCount===n ? "2px solid #f59e0b" : "2px solid #f0ece6",
                            background: photoCount===n 
                              ? "linear-gradient(135deg,#fffbf0,#fff8e1)" 
                              : "#fafaf9",
                            color: photoCount===n ? "#b45309" : "#a89070",
                            fontWeight:800, 
                            fontSize:"1.1rem",
                            cursor: photos.length>0 ? "not-allowed":"pointer",
                            opacity: photos.length>0 ? 0.5:1,
                            boxShadow: photoCount===n 
                              ? "0 4px 12px rgba(245,158,11,.2), inset 0 1px 0 rgba(255,255,255,0.5)" 
                              : "0 2px 4px rgba(0,0,0,0.04)",
                            transition:"all .25s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: photoCount===n ? "scale(1.02)" : "scale(1)",
                          }}
                          onMouseEnter={e => {
                            if (photos.length === 0 && photoCount !== n) {
                              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "#fbbf24";
                            }
                          }}
                          onMouseLeave={e => {
                            if (photos.length === 0) {
                              (e.currentTarget as HTMLButtonElement).style.transform = photoCount===n ? "scale(1.02)" : "scale(1)";
                              (e.currentTarget as HTMLButtonElement).style.borderColor = photoCount===n ? "#f59e0b" : "#f0ece6";
                            }
                          }}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex:1.8 }}>
                    <label style={lbl}>Custom Title</label>
                    <input
                      type="text" maxLength={22} value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      placeholder="e.g. BFF 2024 ✨"
                      className="hi"
                      style={{
                        width:"100%", 
                        padding:"12px 16px", 
                        borderRadius:12,
                        border:"2px solid #f0ece6", 
                        background:"#fafaf9",
                        color:"#374151", 
                        fontFamily:"'DM Sans',sans-serif",
                        fontWeight:600, 
                        fontSize:"0.95rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* LAYOUT */}
              <div style={{ ...faded }}>
                <div style={{ 
                  ...card({ padding:"16px 18px" }), 
                  display:"flex", 
                  alignItems:"center", 
                  gap:12 
                }} className="card-hover">
                  <span style={{ 
                    fontFamily:"'DM Mono',monospace", 
                    fontSize:"0.7rem", 
                    fontWeight:800, 
                    color:"#b45309", 
                    letterSpacing:"0.14em", 
                    textTransform:"uppercase", 
                    whiteSpace:"nowrap" 
                  }}>Layout</span>
                  <div style={{ display:"flex", gap:6, flex:1 }}>
                    {([
                      {id:'vertical',  Icon:LayoutList,          t:'Classic Strip'},
                      {id:'grid',      Icon:LayoutGrid,          t:'Grid 2x2'},
                      {id:'landscape', Icon:RectangleHorizontal, t:'Landscape'},
                    ] as const).map(({id,Icon,t}) => (
                      <button key={id} onClick={() => setActiveLayout(id)} title={t} className="lb"
                        style={{
                          flex:1,
                          padding:"10px 12px", 
                          borderRadius:10,
                          background: activeLayout===id ? "linear-gradient(135deg,#fff8e1,#fffbf0)" : "#fafaf9",
                          color: activeLayout===id ? "#d97706":"#a89070",
                          border: activeLayout===id ? "2px solid #f59e0b" : "2px solid #f0ece6",
                          boxShadow: activeLayout===id 
                            ? "0 4px 12px rgba(245,158,11,.2), inset 0 1px 0 rgba(255,255,255,0.5)" 
                            : "0 2px 4px rgba(0,0,0,0.04)",
                          transition:"all .25s cubic-bezier(0.4, 0, 0.2, 1)",
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center",
                          transform: activeLayout===id ? "scale(1.02)" : "scale(1)",
                        }}
                        onMouseEnter={e => {
                          if (activeLayout !== id) {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#fbbf24";
                          }
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = activeLayout===id ? "scale(1.02)" : "scale(1)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = activeLayout===id ? "#f59e0b" : "#f0ece6";
                        }}
                      ><Icon size={18}/></button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FILTERS */}
              <div style={faded}>
                <FilterSelector 
                  activeFilterId={activeFilterId} 
                  onSelect={setActiveFilterId}
                  disabled={isSessionActive}
                />
              </div>

              {/* BORDERS */}
              <div style={faded}>
                <BorderSelector 
                  activeBorderId={activeBorderId} 
                  onSelect={setActiveBorderId}
                  disabled={isSessionActive}
                />
              </div>

              {/* THEME */}
              <div style={faded}>
                <ThemeSelector activeThemeId={activeThemeId} onSelect={setActiveThemeId} disabled={isSessionActive}/>
              </div>
            </div>

            {/* ━━ RIGHT ━━ */}
            <div className="hb" style={{
              display:"flex", 
              flexDirection:"column", 
              alignItems:"center", 
              gap:20,
              animationDelay:".2s", 
              position:"sticky", 
              top:32, 
              minWidth:0,
            }}>
              {/* divider */}
              <div style={{ width:"100%", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ 
                  flex:1, 
                  height:2, 
                  background:"linear-gradient(90deg,rgba(237,232,224,0.6),transparent)",
                  borderRadius:2
                }}/>
                <span style={{ 
                  fontFamily:"'DM Mono',monospace", 
                  fontSize:"0.7rem", 
                  letterSpacing:"0.28em", 
                  color:"#b8956f", 
                  textTransform:"uppercase", 
                  flexShrink:0,
                  fontWeight:600
                }}>Your Strip</span>
                <div style={{ 
                  flex:1, 
                  height:2, 
                  background:"linear-gradient(90deg,transparent,rgba(237,232,224,0.6))",
                  borderRadius:2
                }}/>
              </div>

              {/* STRIP */}
              <PhotoStrip
                photos={photos}
                activeTheme={activeTheme}
                photoCount={photoCount}
                customText={customText}
                stripStickers={stripStickers}
                stickerMode={stickerMode}
                activeFilter={activeFilterCss}
                activeBorder={activeBorder}
                retakeIndex={retakeIndex}
                layout={activeLayout}
                onRequestRetake={i => setRetakeIndex(i)}
                onMovePhoto={handleMovePhoto}
                onReorderPhotos={handleReorderPhotos}
                onReset={() => { setPhotos([]); setStripStickers([]); setRetakeIndex(null); }}
              />

              {/* STICKERS */}
              {photos.length > 0 && (
                <div style={{ width:"100%", maxWidth:360 }}>
                  <StickerPicker 
                    onAddSticker={addSticker}
                    disabled={isSessionActive}
                    stickerMode={stickerMode}
                    onToggleStickerMode={() => setStickerMode(prev => prev === 'photo' ? 'strip' : 'photo')}
                  />
                  {(stripStickers.length > 0 || photos.some(p => p.stickers.length > 0)) && (
                    <button onClick={() => { setStripStickers([]); setPhotos(prev => prev.map(p => ({ ...p, stickers: [] }))); }}
                      style={{ 
                        width:"100%", 
                        marginTop:12, 
                        padding:"12px 16px", 
                        borderRadius:12, 
                        border:"2px solid #ffe0e0", 
                        background:"linear-gradient(135deg, #fff5f5, #ffebeb)", 
                        color:"#dc2626", 
                        fontSize:"0.8rem", 
                        fontWeight:700, 
                        cursor:"pointer", 
                        transition:"all .25s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow:"0 2px 8px rgba(220,38,38,0.1)",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:8
                      }}
                      onMouseEnter={e=>{
                        (e.currentTarget.style.background="linear-gradient(135deg, #ffebeb, #ffd6d6)");
                        (e.currentTarget.style.borderColor="#ffcccc");
                        (e.currentTarget.style.transform="translateY(-2px)");
                        (e.currentTarget.style.boxShadow="0 4px 12px rgba(220,38,38,0.2)");
                      }}
                      onMouseLeave={e=>{
                        (e.currentTarget.style.background="linear-gradient(135deg, #fff5f5, #ffebeb)");
                        (e.currentTarget.style.borderColor="#ffe0e0");
                        (e.currentTarget.style.transform="translateY(0)");
                        (e.currentTarget.style.boxShadow="0 2px 8px rgba(220,38,38,0.1)");
                      }}
                    >
                      <span style={{ fontSize:"1.1rem" }}>🗑</span>
                      Clear All Stickers
                    </button>
                  )}
                </div>
              )}

              {/* HINTS */}
              <div style={{ 
                display:"flex", 
                gap:16, 
                opacity:0.5,
                padding:"16px 20px",
                background:"rgba(255,255,255,0.5)",
                borderRadius:12,
                backdropFilter:"blur(10px)",
              }}>
                {[['SPACE','shoot'],['F','flash'],['R','reset']].map(([k,l]) => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ 
                      fontFamily:"'DM Mono',monospace", 
                      fontSize:"0.65rem", 
                      background:"linear-gradient(135deg, #f5f0e8, #ede8e0)", 
                      padding:"4px 8px", 
                      borderRadius:6, 
                      fontWeight:700, 
                      color:"#8B7355",
                      border:"1px solid rgba(139,115,85,0.2)",
                      boxShadow:"0 1px 3px rgba(0,0,0,0.05)"
                    }}>{k}</span>
                    <span style={{ 
                      fontFamily:"'DM Mono',monospace", 
                      fontSize:"0.65rem", 
                      color:"#a89070",
                      fontWeight:500
                    }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}