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
        <Wand2 size={14} />
        <span>Camera Filters</span>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: "flex",
        gap: 6,
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {FILTER_CATEGORIES.map(cat => (
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

      {/* Filter Buttons */}
      <div className="hide-scrollbar" style={{
        display: "flex",
        gap: 6,
        overflowX: "auto",
        paddingBottom: 4,
      }}>
        {filteredFilters.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`option-btn ${activeFilterId === f.id ? 'selected' : ''}`}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              fontSize: "0.78rem",
            }}
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}
