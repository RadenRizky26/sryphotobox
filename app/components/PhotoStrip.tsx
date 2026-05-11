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
      a.download = `photobox-${layout}-${theme.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.jpg`;
      a.click();
    } catch (err) { console.error(err); }
    setDownloading(false);
  };

  /* ── empty state ── */
  if (photos.length === 0) {
    return (
      <div style={{
        width: 240, minHeight: 340,
        border: "1.5px dashed rgba(255,255,255,0.1)",
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, textAlign: "center",
        margin: "0 auto",
      }}>
        <Film size={36} style={{ color: "#55556a", marginBottom: 12, opacity: 0.5 }} />
        <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#8b8b9e" }}>
          PHOTO STRIP
        </p>
        <p style={{ fontSize: "0.72rem", color: "#666680", marginTop: 8, lineHeight: 1.7 }}>
          Shoot {photoCount} photos<br/>— your strip appears here ✨
        </p>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {Array.from({ length: photoCount }).map((_, i) => (
            <div key={i} style={{ 
              width: 30, height: 22, borderRadius: 4, 
              background: "rgba(255,255,255,0.06)", 
              border: "1.5px dashed rgba(255,255,255,0.1)" 
            }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── layout sizing ── */
  const isFilm   = !!theme.filmStrip && layout === 'vertical';
  let cw         = 220;
  let layoutCls  = "flex flex-col";
  let aspect     = "4 / 3";
  let strategy   = verticalListSortingStrategy;

  if (layout === 'grid') {
    cw        = 340;
    layoutCls = "grid grid-cols-2";
    strategy  = rectSortingStrategy;
  } else if (layout === 'landscape') {
    cw        = photos.length * 180 + 24;
    layoutCls = "flex flex-row";
    aspect    = "3 / 4";
    strategy  = horizontalListSortingStrategy;
  }

  const perfW = 16;
  const totalW = isFilm ? cw + perfW * 2 : cw;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "'Inter', sans-serif" }}>

      {/* action buttons */}
      <div style={{ display: "flex", gap: 8, width: totalW }}>
        <button
          onClick={onReset}
          title="Reset [R]"
          style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.06)", 
            background: "rgba(255,255,255,0.03)",
            color: "#8b8b9e", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s",
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.background = "rgba(239,68,68,0.15)"; 
            e.currentTarget.style.color = "#f87171"; 
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.background = "rgba(255,255,255,0.03)"; 
            e.currentTarget.style.color = "#8b8b9e"; 
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={downloadStrip}
          disabled={downloading || retakeIndex !== null}
          style={{
            flex: 1, height: 36, borderRadius: 20, border: "none",
            fontWeight: 700, fontSize: "0.8rem",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            cursor: (downloading || retakeIndex !== null) ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            background: (downloading || retakeIndex !== null)
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: (downloading || retakeIndex !== null) ? "#55556a" : "#fff",
            boxShadow: (downloading || retakeIndex !== null)
              ? "none"
              : "0 4px 16px rgba(139,92,246,0.3)",
          }}
          onMouseEnter={e => { if (!(downloading || retakeIndex !== null)) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <Download size={13} />
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
            ? "12px 12px 52px"
            : (theme.stripPadding ?? "12px 10px 48px"),
          position: "relative",
          border: theme.outerBorder ?? "none",
          borderRadius: isFilm ? 0 : (theme.outerRadius ?? 0),
          boxShadow: isFilm ? "none" : `0 10px 40px rgba(0,0,0,0.3)${theme.innerGlow ? `, ${theme.innerGlow}` : ""}`,
          transition: "all .4s",
        }}>
          {/* subtle inner accent ring */}
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
              <div className={`${layoutCls} gap-[6px] relative z-10 w-full`}>
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

          {/* draggable strip stickers */}
          {stickerMode === 'strip' && stripStickers.map(st => <StripStickerItem key={st.id} st={st} />)}

          {/* footer text */}
          <div style={{
            position: "absolute", bottom: layout === 'landscape' ? 10 : 8,
            left: 0, right: 0, textAlign: "center", padding: "0 8px", zIndex: 5,
          }}>
            <p style={{
              fontFamily: theme.fontFamily ?? "'JetBrains Mono', monospace",
              fontSize: layout === 'grid' ? "0.72rem" : "0.6rem",
              color: theme.textColor,
              letterSpacing: theme.letterSpacing ?? "0.18em",
              fontWeight: 700, opacity: 0.92, margin: 0,
              textTransform: "uppercase", wordBreak: "break-word",
            }}>
              {customText.trim() === '' ? theme.name : customText}
            </p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem",
              color: theme.textColor, opacity: 0.42, marginTop: 3, letterSpacing: "0.1em",
            }}>
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </p>
          </div>
        </div>

        {isFilm && <Perf bg={theme.stripBg} count={photos.length} />}
      </div>
    </div>
  );
}

/* ── Perforation column ── */
function Perf({ bg, count }: { bg?: string; count: number }) {
  const safeBg = bg || "#0d0d0d";
  const fill   = (safeBg.startsWith("linear") || safeBg.startsWith("radial")) ? "#0d0d0d" : safeBg;
  const holes  = count * 3 + 2;
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

/* ── Strip Sticker Item ── */
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