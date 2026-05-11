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
    <div
      className="glass-card"
      style={{
        padding: "18px 18px 14px",
        opacity: disabled ? 0.35 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 0 }}>
          <SmilePlus size={14} />
          <span>Stickers</span>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Mode Toggle */}
          <button
            onClick={onToggleStickerMode}
            title={stickerMode === 'photo' ? 'Stick to Photo' : 'Stick to Strip'}
            className="option-btn selected"
            style={{
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: "0.65rem",
            }}
          >
            {stickerMode === 'photo' ? <Pin size={11} /> : <Layers size={11} />}
            <span style={{ textTransform: "uppercase" }}>
              {stickerMode === 'photo' ? 'Photo' : 'Strip'}
            </span>
          </button>

          {/* Size Selector */}
          <div style={{ display: "flex", gap: 4 }}>
            {(['small', 'medium', 'large'] as StickerSize[]).map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`option-btn ${selectedSize === size ? 'selected' : ''}`}
                style={{
                  padding: "5px 10px",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                }}
              >
                {size[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="hide-scrollbar" style={{
        display: "flex",
        gap: 6,
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflowX: "auto",
      }}>
        {STICKER_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`tab-pill ${activeCategory === cat.id ? 'active' : ''}`}
            style={{
              padding: "6px 12px",
              fontSize: "0.72rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "0.95rem" }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Sticker Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: 6,
        maxHeight: 200,
        overflowY: "auto",
        padding: "4px 2px",
      }}>
        {activeStickers.map((sticker, idx) => (
          <button
            key={`${sticker}-${idx}`}
            onClick={() => onAddSticker(sticker, selectedSize)}
            className="sticker-btn"
            style={{
              padding: "8px",
              fontSize: "1.4rem",
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
