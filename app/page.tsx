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
import {
  Camera,
  Palette,
  Sparkles,
  LayoutList,
  LayoutGrid,
  RectangleHorizontal,
  Settings2,
} from "lucide-react";

export interface PhotoWithStickers {
  id: string;
  src: string;
  stickers: Sticker[];
}

export type StickerMode = "photo" | "strip";

type SettingsTab = "setup" | "style" | "decorate";

export default function PhotoboothPro() {
  const [photos, setPhotos] = useState<PhotoWithStickers[]>([]);
  const [activeThemeId, setActiveThemeId] = useState(THEMES[0].id);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [photoCount, setPhotoCount] = useState<number>(3);
  const [customText, setCustomText] = useState<string>("");
  const [activeFilterId, setActiveFilterId] = useState("none");
  const [activeBorderId, setActiveBorderId] = useState("none");
  const [stripStickers, setStripStickers] = useState<Sticker[]>([]);
  const [stickerMode, setStickerMode] = useState<StickerMode>("photo");
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [activeLayout, setActiveLayout] = useState<LayoutType>("vertical");
  const [activeTab, setActiveTab] = useState<SettingsTab>("setup");

  const activeTheme =
    THEMES.find((t) => t.id === activeThemeId) ?? THEMES[0];
  const activeFilterCss =
    CAMERA_FILTERS.find((f) => f.id === activeFilterId)?.css ?? "none";
  const activeBorder =
    BORDER_STYLES.find((b) => b.id === activeBorderId) ?? BORDER_STYLES[0];

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.code === "KeyR" && photos.length > 0 && !isSessionActive) {
        setPhotos([]);
        setStripStickers([]);
        setRetakeIndex(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos, isSessionActive]);

  // Auto-switch to decorate tab when photos are taken
  useEffect(() => {
    if (photos.length > 0 && photos.length >= photoCount) {
      setActiveTab("decorate");
    }
  }, [photos.length, photoCount]);

  const addSticker = (emoji: string, size: StickerSize) => {
    const newSticker: Sticker = {
      id: `stk-${Date.now()}`,
      emoji,
      x: 10 + Math.random() * 40,
      y: 10 + Math.random() * 30,
      size,
      rotation: 0,
      opacity: 1,
    };

    if (stickerMode === "strip") {
      setStripStickers((prev) => [...prev, newSticker]);
    } else {
      if (photos.length > 0) {
        setPhotos((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            stickers: [...updated[lastIndex].stickers, newSticker],
          };
          return updated;
        });
      }
    }
  };

  const handlePhotoTaken = (src: string) => {
    if (retakeIndex !== null) {
      setPhotos((prev) => {
        const u = [...prev];
        u[retakeIndex] = { ...u[retakeIndex], src };
        return u;
      });
      setRetakeIndex(null);
    } else {
      setPhotos((prev) => [
        ...prev,
        {
          id: `photo-${Date.now()}`,
          src,
          stickers: [],
        },
      ]);
    }
  };

  const handleReorderPhotos = (oldIndex: number, newIndex: number) => {
    setPhotos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  const handleMovePhoto = (index: number, direction: number) =>
    setPhotos((prev) => {
      const n = [...prev],
        t = index + direction;
      [n[index], n[t]] = [n[t], n[index]];
      return n;
    });

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "setup", label: "Setup", icon: <Settings2 size={15} /> },
    { id: "style", label: "Style", icon: <Palette size={15} /> },
    { id: "decorate", label: "Decorate", icon: <Sparkles size={15} /> },
  ];

  const faded: React.CSSProperties = {
    opacity: isSessionActive ? 0.35 : 1,
    pointerEvents: isSessionActive ? "none" : "auto",
    transition: "opacity 0.4s ease",
  };

  return (
    <main
      className="bg-grid bg-radial-glow"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #07070b 0%, #0a0a14 50%, #0d0d18 100%)",
        fontFamily: "'Inter', sans-serif",
        color: "#f0f0f5",
        padding: "clamp(16px, 3vw, 32px)",
        position: "relative",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 40% at 25% 30%, rgba(139,92,246,0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(59,130,246,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ═══ HEADER ═══ */}
        <header
          className="animate-fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            padding: "0 4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Logo mark */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(139,92,246,0.25)",
              }}
            >
              <Camera size={20} color="white" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: "1.6rem",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  color: "#f0f0f5",
                  margin: 0,
                }}
              >
                PHOTOBOX{" "}
                <span style={{ color: "#a78bfa" }}>PRO</span>
              </h1>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#55556a",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Professional Photo Booth
              </p>
            </div>
          </div>

          {/* Keyboard hints */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            {[
              ["SPACE", "shoot"],
              ["F", "flash"],
              ["R", "reset"],
            ].map(([k, l]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <kbd
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    background: "rgba(255,255,255,0.03)",
                    padding: "3px 7px",
                    borderRadius: 6,
                    fontWeight: 600,
                    color: "#8b8b9e",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {k}
                </kbd>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* ═══ MAIN GRID ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ━━━━━━━ LEFT: Camera ━━━━━━━ */}
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              animationDelay: "0.1s",
              minWidth: 0,
            }}
          >
            <CameraView
              photoCount={photoCount}
              activeFilter={activeFilterCss}
              flashEnabled={flashEnabled}
              retakeIndex={retakeIndex}
              onToggleFlash={() => setFlashEnabled((f) => !f)}
              onPhotoTaken={handlePhotoTaken}
              onSessionStart={() => setIsSessionActive(true)}
              onSessionEnd={() => setIsSessionActive(false)}
            />
          </div>

          {/* ━━━━━━━ RIGHT: Sidebar ━━━━━━━ */}
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              animationDelay: "0.2s",
              position: "sticky",
              top: 16,
              minWidth: 0,
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
            }}
          >
            {/* Strip Preview */}
            <div
              className="glass-card"
              style={{ padding: 16, textAlign: "center" }}
            >
              {/* Divider label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.08))",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    color: "#666680",
                    textTransform: "uppercase",
                    flexShrink: 0,
                    fontWeight: 600,
                  }}
                >
                  Preview
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
                  }}
                />
              </div>

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
                onRequestRetake={(i) => setRetakeIndex(i)}
                onMovePhoto={handleMovePhoto}
                onReorderPhotos={handleReorderPhotos}
                onReset={() => {
                  setPhotos([]);
                  setStripStickers([]);
                  setRetakeIndex(null);
                }}
              />
            </div>

            {/* ── Tab Navigation ── */}
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: 4,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-pill ${activeTab === tab.id ? "active" : ""}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "10px 12px",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <div style={{ ...faded }}>
              {/* SETUP TAB */}
              {activeTab === "setup" && (
                <div
                  className="animate-fade-in"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Frames */}
                  <div className="glass-card" style={{ padding: 18 }}>
                    <div className="section-label">
                      <Camera size={14} />
                      <span>Frames</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[2, 3, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() => setPhotoCount(n)}
                          disabled={photos.length > 0}
                          className={`option-btn ${photoCount === n ? "selected" : ""}`}
                          style={{
                            flex: 1,
                            padding: "14px 0",
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            opacity: photos.length > 0 ? 0.4 : 1,
                            cursor:
                              photos.length > 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout */}
                  <div className="glass-card" style={{ padding: 18 }}>
                    <div className="section-label">
                      <LayoutGrid size={14} />
                      <span>Layout</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(
                        [
                          {
                            id: "vertical",
                            Icon: LayoutList,
                            t: "Classic Strip",
                          },
                          { id: "grid", Icon: LayoutGrid, t: "Grid 2×2" },
                          {
                            id: "landscape",
                            Icon: RectangleHorizontal,
                            t: "Landscape",
                          },
                        ] as const
                      ).map(({ id, Icon, t }) => (
                        <button
                          key={id}
                          onClick={() => setActiveLayout(id)}
                          title={t}
                          className={`option-btn ${activeLayout === id ? "selected" : ""}`}
                          style={{
                            flex: 1,
                            padding: "12px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <Icon size={16} />
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          >
                            {t.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Title */}
                  <div className="glass-card" style={{ padding: 18 }}>
                    <div className="section-label">
                      <Sparkles size={14} />
                      <span>Custom Title</span>
                    </div>
                    <input
                      type="text"
                      maxLength={22}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. BFF 2024 ✨"
                      className="input-dark"
                    />
                  </div>
                </div>
              )}

              {/* STYLE TAB */}
              {activeTab === "style" && (
                <div
                  className="animate-fade-in"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <ThemeSelector
                    activeThemeId={activeThemeId}
                    onSelect={setActiveThemeId}
                    disabled={isSessionActive}
                  />
                  <FilterSelector
                    activeFilterId={activeFilterId}
                    onSelect={setActiveFilterId}
                    disabled={isSessionActive}
                  />
                  <BorderSelector
                    activeBorderId={activeBorderId}
                    onSelect={setActiveBorderId}
                    disabled={isSessionActive}
                  />
                </div>
              )}

              {/* DECORATE TAB */}
              {activeTab === "decorate" && (
                <div
                  className="animate-fade-in"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {photos.length > 0 ? (
                    <>
                      <StickerPicker
                        onAddSticker={addSticker}
                        disabled={isSessionActive}
                        stickerMode={stickerMode}
                        onToggleStickerMode={() =>
                          setStickerMode((prev) =>
                            prev === "photo" ? "strip" : "photo"
                          )
                        }
                      />
                      {(stripStickers.length > 0 ||
                        photos.some((p) => p.stickers.length > 0)) && (
                        <button
                          onClick={() => {
                            setStripStickers([]);
                            setPhotos((prev) =>
                              prev.map((p) => ({ ...p, stickers: [] }))
                            );
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: "var(--radius-md)",
                            border: "1.5px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.08)",
                            color: "#f87171",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all .25s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.15)";
                            e.currentTarget.style.borderColor =
                              "rgba(239,68,68,0.5)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.08)";
                            e.currentTarget.style.borderColor =
                              "rgba(239,68,68,0.3)";
                          }}
                        >
                          🗑 Clear All Stickers
                        </button>
                      )}
                    </>
                  ) : (
                    <div
                      className="glass-card"
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                      }}
                    >
                      <Sparkles
                        size={32}
                        style={{
                          color: "var(--text-muted)",
                          margin: "0 auto 12px",
                        }}
                      />
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        Take photos first
                      </p>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.75rem",
                          opacity: 0.6,
                          marginTop: 6,
                        }}
                      >
                        Stickers will be available after shooting
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}