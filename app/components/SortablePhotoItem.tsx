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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-full"
    >
      <div
        style={{
          border: activeBorder?.css?.border || "3px solid white",
          borderRadius: activeBorder?.css?.borderRadius || 8,
          overflow: "hidden",
          aspectRatio: aspect,
          animation: `ps-develop .8s cubic-bezier(.22,1,.36,1) both`,
          animationDelay: `${index * 0.14}s`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.16)",
          position: "relative",
          ...(activeBorder?.css || {}),
        }}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-30 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <GripVertical size={16} style={{ color: "#8B7355" }} />
        </div>

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

        {/* Photo-mode stickers */}
        {stickerMode === 'photo' && photo.stickers.map(st => (
          <StickerItem key={st.id} st={st} />
        ))}

        {/* hover controls */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20"
          style={{ background: "rgba(0,0,0,0.44)", backdropFilter: "blur(2px)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onMovePhoto(index, -1)} 
              disabled={index === 0}
              style={{ 
                padding: "6px", 
                borderRadius: "50%", 
                background: "rgba(255,255,255,0.9)", 
                border: "none", 
                cursor: index === 0 ? "not-allowed" : "pointer", 
                opacity: index === 0 ? 0.3 : 1, 
                transition: "transform .15s" 
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform="scale(1.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform="scale(1)"}
            >
              {layout === 'vertical' ? <ChevronUp size={14}/> : <ChevronLeft size={14}/>}
            </button>
            <button
              onClick={() => onMovePhoto(index, 1)} 
              disabled={index === totalPhotos - 1}
              style={{ 
                padding: "6px", 
                borderRadius: "50%", 
                background: "rgba(255,255,255,0.9)", 
                border: "none", 
                cursor: index === totalPhotos - 1 ? "not-allowed" : "pointer", 
                opacity: index === totalPhotos - 1 ? 0.3 : 1, 
                transition: "transform .15s" 
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform="scale(1.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform="scale(1)"}
            >
              {layout === 'vertical' ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
            </button>
          </div>
          <button
            onClick={() => onRequestRetake(index)}
            style={{
              background: "white", 
              color: "#374151",
              padding: "5px 12px", 
              borderRadius: 20, 
              border: "none",
              fontWeight: 700, 
              fontSize: "0.72rem", 
              cursor: "pointer",
              display: "flex", 
              alignItems: "center", 
              gap: 5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)", 
              transition: "transform .15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform="scale(1.05)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform="scale(1)"}
          >
            <RefreshCcw size={11} style={{ color: "#ef4444" }} /> Retake
          </button>
        </div>

        {retakeIndex === index && (
          <div style={{
            position: "absolute", 
            inset: 0, 
            zIndex: 10,
            background: "rgba(239,68,68,0.2)", 
            border: "3px solid #ef4444",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
          }}>
            <span style={{ 
              background: "#ef4444", 
              color: "white", 
              padding: "3px 8px", 
              fontSize: "0.65rem", 
              fontWeight: 700, 
              borderRadius: 6, 
              animation: "pulse 1s infinite" 
            }}>
              RETAKING…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
