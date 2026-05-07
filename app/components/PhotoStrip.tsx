"use client";
import React, { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import {
  Download, RotateCcw, Film,
} from "lucide-react";
import Draggable from "react-draggable";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable";
import { Theme } from "../constants/themes";
import { StickerSize, STICKER_SIZE_MAP } from "../constants/stickers";
import { BorderStyle } from "../constants/borders";
import { PhotoWithStickers, StickerMode } from "../page";
import SortablePhotoItem from "./SortablePhotoItem";

export interface Sticker { 
  id: string; 
  emoji: string; 
  x: number; 
  y: number;
  size: StickerSize;
  rotation: number;
  opacity: number;
}
export type LayoutType = 'vertical' | 'grid' | 'landscape';

interface Props {
  photos: PhotoWithStickers[];
  activeTheme: Theme;
  photoCount: number;
  customText: string;
  stripStickers: Sticker[];
  stickerMode: StickerMode;
  activeFilter: string;
  activeBorder?: BorderStyle;
  retakeIndex: number | null;
  layout: LayoutType;
  onReset: () => void;
  onRequestRetake: (index: number) => void;
  onMovePhoto: (index: number, direction: number) => void;
  onReorderPhotos: (oldIndex: number, newIndex: number) => void;
}

export default function PhotoStrip({
  photos: allPhotos, activeTheme: theme, photoCount,
  customText, stripStickers, stickerMode, activeFilter, activeBorder, retakeIndex, layout,
  onReset, onRequestRetake, onMovePhoto, onReorderPhotos,
}: Props) {
  const stripRef   = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // ── KEY FIX: only display up to photoCount photos ──
  const photos = allPhotos.slice(0, photoCount);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex(p => p.id === active.id);
      const newIndex = photos.findIndex(p => p.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderPhotos(oldIndex, newIndex);
      }
    }
  };

  const downloadStrip = async () => {
    if (!stripRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toJpeg(stripRef.current, {
        quality: 0.95, pixelRatio: 2, cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `happibooth-${layout}-${theme.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.jpg`;
      a.click();
    } catch (err) { console.error(err); }
    setDownloading(false);
  };

  /* ── empty state ── */
  if (photos.length === 0) {
    return (
      <div style={{
        width: 260, minHeight: 380,
        border: "2px dashed #ddd4c5", borderRadius: 18,
        background: "linear-gradient(135deg,#fff,#faf7f2)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 28, textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}>
        <Film size={44} style={{ color: "#e0d0bc", marginBottom: 14 }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#c5b89a" }}>PHOTO STRIP</p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "#d4c5ae", marginTop: 8, lineHeight: 1.7 }}>
          Shoot {photoCount} photos on the left<br/>— your strip appears here ✨
        </p>
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {Array.from({ length: photoCount }).map((_, i) => (
            <div key={i} style={{ width: 34, height: 26, borderRadius: 5, background: "#f0ece4", border: "1.5px dashed #ddd4c5" }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── layout sizing ── */
  const isFilm   = !!theme.filmStrip && layout === 'vertical';
  let cw         = 240;          // container width (inner, no perf)
  let layoutCls  = "flex flex-col";
  let aspect     = "4 / 3";
  let strategy   = verticalListSortingStrategy;

  if (layout === 'grid') {
    cw        = 420;
    layoutCls = "grid grid-cols-2";
    strategy  = rectSortingStrategy;
  } else if (layout === 'landscape') {
    cw        = photos.length * 200 + 24;
    layoutCls = "flex flex-row";
    aspect    = "3 / 4";
    strategy  = horizontalListSortingStrategy;
  }

  const perfW = 16; // perforation column width
  const totalW = isFilm ? cw + perfW * 2 : cw;

  /* ── action bar ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "'DM Sans',sans-serif" }}>

      {/* action buttons */}
      <div style={{ display: "flex", gap: 10, width: totalW }}>
        <button
          onClick={onReset}
          title="Reset [R]"
          style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            border: "1.5px solid #ede8e0", background: "#faf7f2",
            color: "#8B7355", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#fff0f0"; (e.currentTarget as HTMLButtonElement).style.color="#e57373"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="#faf7f2"; (e.currentTarget as HTMLButtonElement).style.color="#8B7355"; }}
        >
          <RotateCcw size={15} />
        </button>

        <button
          onClick={downloadStrip}
          disabled={downloading || retakeIndex !== null}
          style={{
            flex: 1, height: 40, borderRadius: 40, border: "none",
            background: (downloading || retakeIndex !== null)
              ? "#ece7df"
              : "linear-gradient(135deg,#f59e0b,#d97706)",
            color: (downloading || retakeIndex !== null) ? "#c0b8a8" : "#fff",
            fontWeight: 700, fontSize: "0.85rem",
            cursor: (downloading || retakeIndex !== null) ? "not-allowed" : "pointer",
            boxShadow: (downloading || retakeIndex !== null) ? "none" : "0 4px 14px rgba(217,119,6,.28)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            transition: "all .15s",
          }}
        >
          <Download size={14} />
          {downloading ? "Saving…" : "Download Photo"}
        </button>
      </div>

      {/* ── strip ── */}
      <div
        ref={stripRef}
        style={{
          display: "flex",
          position: "relative",
          borderRadius: theme.outerRadius ?? 0,
          animation: "ps-enter .4s ease-out",
          overflow: "hidden",
        }}
      >
        {isFilm && <Perf bg={theme.stripBg} count={photos.length} />}

        {/* inner card */}
        <div style={{
          width: cw,
          background: theme.stripBg,
          padding: layout === 'landscape'
            ? "14px 14px 60px"
            : (theme.stripPadding ?? "14px 12px 52px"),
          position: "relative",
          border: theme.outerBorder ?? "none",
          borderRadius: isFilm ? 0 : (theme.outerRadius ?? 0),
          boxShadow: isFilm ? "none" : `0 10px 40px rgba(0,0,0,0.12)${theme.innerGlow ? `, ${theme.innerGlow}` : ""}`,
          transition: "all .4s",
          overflow: "hidden",
        }}>
          {/* subtle inner accent ring for ornate/neon */}
          {theme.innerGlow && !isFilm && (
            <div style={{
              position: "absolute", inset: 5, pointerEvents: "none", zIndex: 1,
              borderRadius: Math.max(0, parseInt(theme.outerRadius ?? "0") - 3),
              border: `1px solid ${theme.textColor}1a`,
            }} />
          )}

          {/* photo grid with drag-and-drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={photos.map(p => p.id)} strategy={strategy}>
              <div className={`${layoutCls} gap-[8px] relative z-10 w-full`}>
                {photos.map((photo, i) => (
                  <SortablePhotoItem
                    key={photo.id}
                    photo={photo}
                    index={i}
                    totalPhotos={photos.length}
                    activeFilter={activeFilter}
                    activeBorder={activeBorder}
                    retakeIndex={retakeIndex}
                    layout={layout}
                    aspect={aspect}
                    stickerMode={stickerMode}
                    onRequestRetake={onRequestRetake}
                    onMovePhoto={onMovePhoto}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* draggable strip stickers (strip mode only) */}
          {stickerMode === 'strip' && stripStickers.map(st => <StripStickerItem key={st.id} st={st} />)}

          {/* footer text */}
          <div style={{
            position: "absolute", bottom: layout === 'landscape' ? 12 : 10,
            left: 0, right: 0, textAlign: "center", padding: "0 8px", zIndex: 5,
          }}>
            <p style={{
              fontFamily: theme.fontFamily ?? "'DM Mono',monospace",
              fontSize: layout === 'grid' ? "0.78rem" : "0.65rem",
              color: theme.textColor,
              letterSpacing: theme.letterSpacing ?? "0.18em",
              fontWeight: 700, opacity: 0.92, margin: 0,
              textTransform: "uppercase", wordBreak: "break-word",
            }}>
              {customText.trim() === '' ? theme.name : customText}
            </p>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.55rem",
              color: theme.textColor, opacity: 0.42, marginTop: 3, letterSpacing: "0.1em",
            }}>
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </p>
          </div>
        </div>

        {isFilm && <Perf bg={theme.stripBg} count={photos.length} />}
      </div>

      <style>{`
        @keyframes ps-develop {
          from { opacity:0; filter:brightness(2.5) saturate(0); transform:scale(1.03); }
          to   { opacity:1; filter:brightness(1) saturate(1); transform:scale(1); }
        }
        @keyframes ps-enter {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Perforation column ── */
function Perf({ bg, count }: { bg?: string; count: number }) {
  const safeBg = bg || "#0d0d0d";
  const fill   = (safeBg.startsWith("linear") || safeBg.startsWith("radial")) ? "#0d0d0d" : safeBg;
  const holes  = count * 3 + 2;   // proportional hole count
  return (
    <div style={{
      width: 16, background: fill,
      display: "flex", flexDirection: "column",
      justifyContent: "space-around", alignItems: "center",
      padding: "14px 0",
    }}>
      {Array.from({ length: holes }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 11, borderRadius: 2, background: "rgba(0,0,0,0.32)" }} />
      ))}
    </div>
  );
}

/* ── Strip Sticker Item (for strip mode) ── */
function StripStickerItem({ st }: { st: Sticker }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable nodeRef={nodeRef} bounds="parent" defaultPosition={{ x: st.x, y: st.y }}>
      <div ref={nodeRef} className="absolute cursor-move hover:scale-110 transition-transform"
        style={{ 
          zIndex: 30, 
          touchAction: "none",
          fontSize: STICKER_SIZE_MAP[st.size],
          transform: `rotate(${st.rotation}deg)`,
          opacity: st.opacity,
        }}>
        {st.emoji}
      </div>
    </Draggable>
  );
}