"use client";
import React, { useState } from "react";
import { Wand2 } from "lucide-react";
import { CAMERA_FILTERS, FILTER_CATEGORIES, FilterCategory } from "../constants/filters";

interface Props {
  activeFilterId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function FilterSelector({ activeFilterId, onSelect, disabled }: Props) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');

  const filteredFilters = activeCategory === 'All' 
    ? CAMERA_FILTERS 
    : CAMERA_FILTERS.filter(f => f.category === activeCategory);

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
        <Wand2 size={16} style={{ color: "#f59e0b" }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#8B7355",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          Camera Filters
        </span>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "2px solid #f5f0e8",
      }}>
        {FILTER_CATEGORIES.map(cat => (
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

      {/* Filter Buttons */}
      <div className="nsb" style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 6,
      }}>
        {filteredFilters.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className="fp"
            style={{
              flexShrink: 0,
              padding: "10px 16px",
              borderRadius: 20,
              border: activeFilterId === f.id ? "2px solid #f59e0b" : "2px solid #f0ece6",
              background: activeFilterId === f.id 
                ? "linear-gradient(135deg, #fff8e1, #fffbf0)" 
                : "#fafaf9",
              color: activeFilterId === f.id ? "#b45309" : "#a09080",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: activeFilterId === f.id 
                ? "0 4px 12px rgba(245,158,11,0.2)" 
                : "0 2px 4px rgba(0,0,0,0.04)",
              transform: activeFilterId === f.id ? "scale(1.02)" : "scale(1)",
            }}
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}
