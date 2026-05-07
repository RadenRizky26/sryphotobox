"use client";
import React, { useState } from "react";
import { SmilePlus, Pin, Layers } from "lucide-react";
import { STICKER_CATEGORIES, StickerSize } from "../constants/stickers";
import { StickerMode } from "../page";

interface Props {
  onAddSticker: (emoji: string, size: StickerSize) => void;
  disabled?: boolean;
  stickerMode: StickerMode;
  onToggleStickerMode: () => void;
}

export default function StickerPicker({ onAddSticker, disabled, stickerMode, onToggleStickerMode }: Props) {
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0].id);
  const [selectedSize, setSelectedSize] = useState<StickerSize>('medium');

  const activeStickers = STICKER_CATEGORIES.find(c => c.id === activeCategory)?.stickers || [];

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: 20,
      border: "1.5px solid rgba(237, 232, 224, 0.8)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      padding: "18px 20px",
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? "none" : "auto",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      filter: disabled ? "grayscale(0.3)" : "none",
    }} className="card-hover">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SmilePlus size={16} style={{ color: "#f59e0b" }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#8B7355",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}>
            Stickers
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Mode Toggle */}
          <button
            onClick={onToggleStickerMode}
            title={stickerMode === 'photo' ? 'Stick to Photo' : 'Stick to Strip'}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "2px solid #f59e0b",
              background: "linear-gradient(135deg, #fff8e1, #fffbf0)",
              color: "#b45309",
              fontWeight: 700,
              fontSize: "0.7rem",
              cursor: "pointer",
              transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(245,158,11,0.15)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(245,158,11,0.25)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(245,158,11,0.15)";
            }}
          >
            {stickerMode === 'photo' ? <Pin size={12} /> : <Layers size={12} />}
            <span style={{ fontSize: "0.65rem", textTransform: "uppercase" }}>
              {stickerMode === 'photo' ? 'Photo' : 'Strip'}
            </span>
          </button>

          {/* Size Selector */}
          <div style={{ display: "flex", gap: 6 }}>
            {(['small', 'medium', 'large'] as StickerSize[]).map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: selectedSize === size ? "2px solid #f59e0b" : "2px solid #f0ece6",
                  background: selectedSize === size 
                    ? "linear-gradient(135deg, #fff8e1, #fffbf0)" 
                    : "#fafaf9",
                  color: selectedSize === size ? "#b45309" : "#a09080",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "uppercase",
                  boxShadow: selectedSize === size 
                    ? "0 2px 8px rgba(245,158,11,0.15)" 
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  transform: selectedSize === size ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={e => {
                  if (selectedSize !== size) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#fbbf24";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = selectedSize === size ? "scale(1.05)" : "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = selectedSize === size ? "#f59e0b" : "#f0ece6";
                }}
              >
                {size[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="nsb" style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "2px solid #f5f0e8",
        overflowX: "auto",
      }}>
        {STICKER_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: 20,
              border: activeCategory === cat.id ? "2px solid #f59e0b" : "2px solid transparent",
              background: activeCategory === cat.id 
                ? "linear-gradient(135deg, #fff8e1, #fffbf0)" 
                : "transparent",
              color: activeCategory === cat.id ? "#b45309" : "#a09080",
              fontWeight: 700,
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: activeCategory === cat.id 
                ? "0 2px 8px rgba(245,158,11,0.15)" 
                : "none",
              transform: activeCategory === cat.id ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "#f5f0e8";
                (e.currentTarget as HTMLButtonElement).style.color = "#7c5a2e";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#a09080";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Sticker Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: 8,
        maxHeight: 220,
        overflowY: "auto",
        padding: "6px 4px",
      }}>
        {activeStickers.map((sticker, idx) => (
          <button
            key={`${sticker}-${idx}`}
            onClick={() => onAddSticker(sticker, selectedSize)}
            className="sk"
            style={{
              padding: "10px",
              borderRadius: 12,
              border: "2px solid #f0ece6",
              background: "#fafaf9",
              fontSize: "1.6rem",
              cursor: "pointer",
              transition: "all .25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "1",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
            title={`Add ${sticker}`}
          >
            {sticker}
          </button>
        ))}
      </div>
    </div>
  );
}
