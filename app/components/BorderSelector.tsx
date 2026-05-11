"use client";
import React, { useState } from "react";
import { Frame } from "lucide-react";
import { BORDER_STYLES, BORDER_CATEGORIES, BorderCategory } from "../constants/borders";

interface Props {
  activeBorderId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function BorderSelector({ activeBorderId, onSelect, disabled }: Props) {
  const [activeCategory, setActiveCategory] = useState<BorderCategory>('All');

  const filteredBorders = activeCategory === 'All' 
    ? BORDER_STYLES 
    : BORDER_STYLES.filter(b => b.category === activeCategory);

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
      <div className="section-label">
        <Frame size={14} />
        <span>Photo Borders</span>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: "flex",
        gap: 6,
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexWrap: "wrap",
      }}>
        {BORDER_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`tab-pill ${activeCategory === cat ? 'active' : ''}`}
            style={{ padding: "6px 12px", fontSize: "0.72rem" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Border Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(78px, 1fr))",
        gap: 8,
      }}>
        {filteredBorders.map(border => (
          <button
            key={border.id}
            onClick={() => onSelect(border.id)}
            title={border.name}
            className={`option-btn ${activeBorderId === border.id ? 'selected' : ''}`}
            style={{
              padding: "12px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Preview Box */}
            <div style={{
              width: 42,
              height: 30,
              background: border.preview,
              borderRadius: 5,
              ...border.css,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: 20,
                height: 14,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 2,
              }} />
            </div>
            
            {/* Name */}
            <span style={{
              fontSize: "0.62rem",
              fontWeight: 600,
              color: activeBorderId === border.id ? "#a78bfa" : "#55556a",
              textAlign: "center",
              lineHeight: 1.2,
            }}>
              {border.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
