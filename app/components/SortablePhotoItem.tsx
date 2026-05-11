"use client";
import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RefreshCcw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import Draggable from "react-draggable";
import { PhotoWithStickers } from "../page";
import { Sticker } from "./PhotoStrip";
import { STICKER_SIZE_MAP } from "../constants/stickers";

interface SortablePhotoItemProps {
  photo: PhotoWithStickers;
  index: number;
  totalPhotos: number;
  activeFilter: string;
  activeBorder?: { css?: React.CSSProperties };
  retakeIndex: number | null;
  layout: 'vertical' | 'grid' | 'landscape';
  aspect: string;
  stickerMode: 'photo' | 'strip';
  onRequestRetake: (index: number) => void;
  onMovePhoto: (index: number, direction: number) => void;
}

function StickerItem({ st }: { st: Sticker }) {
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
          lineHeight: 1,
          userSelect: "none",
        }}>
        {st.emoji}
      </div>
    </Draggable>
  );
}

export default function SortablePhotoItem({
  photo,
  index,
  totalPhotos,
  activeFilter,
  activeBorder,
  retakeIndex,
  layout,
  aspect,
  stickerMode,
  onRequestRetake,
  onMovePhoto,
}: SortablePhotoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const borderRadius = activeBorder?.css?.borderRadius || 6;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        aspectRatio: aspect,
        borderRadius,
      }}
      className="group w-full"
    >
      {/* Image layer - overflow hidden to crop the photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: activeBorder?.css?.border || "2px solid rgba(255,255,255,0.15)",
          borderRadius,
          overflow: "hidden",
          animation: `ps-develop .8s cubic-bezier(.22,1,.36,1) both`,
          animationDelay: `${index * 0.14}s`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          ...(activeBorder?.css || {}),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={`Shot ${index + 1}`}
          style={{
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            display: "block", 
            transform: "scaleX(-1)", 
            filter: activeFilter,
          }}
        />
      </div>

      {/* Sticker layer - NOT overflow hidden, so stickers can be dragged freely */}
      {stickerMode === 'photo' && photo.stickers.length > 0 && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          overflow: "hidden",
          zIndex: 15,
          pointerEvents: "none",
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            pointerEvents: "auto",
          }}>
            {photo.stickers.map(st => (
              <StickerItem key={st.id} st={st} />
            ))}
          </div>
        </div>
      )}

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1.5 right-1.5 z-30 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <GripVertical size={12} style={{ color: "rgba(255,255,255,0.7)" }} />
      </div>

      {/* Hover controls overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20"
        style={{ 
          background: "rgba(0,0,0,0.55)", 
          backdropFilter: "blur(3px)",
          borderRadius,
        }}>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => onMovePhoto(index, -1)} 
            disabled={index === 0}
            style={{ 
              padding: "5px", 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.15)", 
              border: "1px solid rgba(255,255,255,0.2)", 
              cursor: index === 0 ? "not-allowed" : "pointer", 
              opacity: index === 0 ? 0.3 : 1, 
              transition: "all .15s",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => { if (index !== 0) e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            {layout === 'vertical' ? <ChevronUp size={12}/> : <ChevronLeft size={12}/>}
          </button>
          <button
            onClick={() => onMovePhoto(index, 1)} 
            disabled={index === totalPhotos - 1}
            style={{ 
              padding: "5px", 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.15)", 
              border: "1px solid rgba(255,255,255,0.2)", 
              cursor: index === totalPhotos - 1 ? "not-allowed" : "pointer", 
              opacity: index === totalPhotos - 1 ? 0.3 : 1, 
              transition: "all .15s",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => { if (index !== totalPhotos - 1) e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            {layout === 'vertical' ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
          </button>
        </div>
        <button
          onClick={() => onRequestRetake(index)}
          style={{
            background: "rgba(255,255,255,0.15)", 
            color: "white",
            padding: "4px 10px", 
            borderRadius: 16, 
            border: "1px solid rgba(255,255,255,0.2)",
            fontWeight: 700, 
            fontSize: "0.65rem", 
            cursor: "pointer",
            display: "flex", 
            alignItems: "center", 
            gap: 4,
            backdropFilter: "blur(4px)",
            transition: "all .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        >
          <RefreshCcw size={10} style={{ color: "#f87171" }} /> Retake
        </button>
      </div>

      {/* Retake indicator */}
      {retakeIndex === index && (
        <div style={{
          position: "absolute", 
          inset: 0, 
          zIndex: 25,
          background: "rgba(139,92,246,0.2)", 
          border: "2px solid #8b5cf6",
          borderRadius,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
        }}>
          <span style={{ 
            background: "#8b5cf6", 
            color: "white", 
            padding: "3px 8px", 
            fontSize: "0.6rem", 
            fontWeight: 700, 
            borderRadius: 6, 
            animation: "pulse-soft 1s infinite",
            boxShadow: "0 0 12px rgba(139,92,246,0.25)",
          }}>
            RETAKING…
          </span>
        </div>
      )}
    </div>
  );
}
