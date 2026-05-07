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
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Frame size={16} style={{ color: "#f59e0b" }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#8B7355",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          Photo Borders
        </span>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "2px solid #f5f0e8",
        flexWrap: "wrap",
      }}>
        {BORDER_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: activeCategory === cat ? "2px solid #f59e0b" : "2px solid transparent",
              background: activeCategory === cat 
                ? "linear-gradient(135deg, #fff8e1, #fffbf0)" 
                : "transparent",
              color: activeCategory === cat ? "#b45309" : "#a09080",
              fontWeight: 700,
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: activeCategory === cat 
                ? "0 2px 8px rgba(245,158,11,0.15)" 
                : "none",
              transform: activeCategory === cat ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat) {
                (e.currentTarget as HTMLButtonElement).style.background = "#f5f0e8";
                (e.currentTarget as HTMLButtonElement).style.color = "#7c5a2e";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#a09080";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Border Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
        gap: 10,
      }}>
        {filteredBorders.map(border => (
          <button
            key={border.id}
            onClick={() => onSelect(border.id)}
            title={border.name}
            style={{
              padding: "14px 10px",
              borderRadius: 12,
              border: activeBorderId === border.id ? "2px solid #f59e0b" : "2px solid #f0ece6",
              background: activeBorderId === border.id 
                ? "linear-gradient(135deg, #fff8e1, #fffbf0)" 
                : "#fafaf9",
              cursor: "pointer",
              transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              boxShadow: activeBorderId === border.id 
                ? "0 4px 12px rgba(245,158,11,0.2)" 
                : "0 2px 4px rgba(0,0,0,0.04)",
              transform: activeBorderId === border.id ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={e => {
              if (activeBorderId !== border.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "#f5f0e8";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#fbbf24";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }
            }}
            onMouseLeave={e => {
              if (activeBorderId !== border.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "#fafaf9";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#f0ece6";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
              }
            }}
          >
            {/* Preview Box */}
            <div style={{
              width: 48,
              height: 36,
              background: border.preview,
              borderRadius: 6,
              ...border.css,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}>
              <div style={{
                width: 24,
                height: 18,
                background: "#e0e0e0",
                borderRadius: 3,
              }} />
            </div>
            
            {/* Name */}
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: activeBorderId === border.id ? "#b45309" : "#a09080",
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "center",
              lineHeight: 1.3,
            }}>
              {border.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
