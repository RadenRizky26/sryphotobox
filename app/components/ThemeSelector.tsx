"use client";
import React, { useState } from "react";
import { THEMES, THEME_CATEGORIES, ThemeCategory } from "../constants/themes";

interface Props {
  activeThemeId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export default function ThemeSelector({ activeThemeId, onSelect, disabled }: Props) {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>("All");

  const filtered =
    activeCategory === "All"
      ? THEMES
      : THEMES.filter((t) => t.category === activeCategory);

  return (
    <div
      className="w-full max-w-2xl transition-opacity duration-300"
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "20px 20px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1.5px solid #ede8e0",
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontSize: 18 }}>🎞</span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#374151",
          }}
        >
          Frame Style
        </span>
      </div>

      {/* ── Category tabs ──────────────────────────────────────────── */}
      <div
        className="flex gap-2 pb-1 mb-4"
        style={{ overflowX: "auto" }}
      >
        {THEME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              padding: "5px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background: activeCategory === cat ? "#f59e0b" : "#f5f0e8",
              color: activeCategory === cat ? "#fff" : "#8B7355",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.76rem",
              fontWeight: 700,
              transition: "all 0.15s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Theme buttons ──────────────────────────────────────────── */}
      <div
        className="flex gap-3 pb-2"
        style={{ overflowX: "auto" }}
      >
        {filtered.map((theme) => {
          const isActive = theme.id === activeThemeId;
          // preview background: strip bg (gradient or solid)
          const previewBg = theme.previewBg;

          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "10px 10px 8px",
                borderRadius: 14,
                border: isActive ? "2px solid #f59e0b" : "2px solid #f0ece6",
                background: isActive ? "#fffbf0" : "#fafaf9",
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 4px 14px rgba(245,158,11,0.22)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
                transform: isActive ? "translateY(-2px) scale(1.04)" : "none",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {/* ── Mini strip preview ──────────────────────────── */}
              <div
                style={{
                  width: 40,
                  height: 62,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: previewBg,
                  border: theme.outerBorder ?? "1.5px solid #e5e7eb",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {/* Film perforation hint */}
                {theme.filmStrip && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: "4px 0",
                    }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          height: 5,
                          borderRadius: 1,
                          background: "rgba(0,0,0,0.22)",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Mini photo slots */}
                <div
                  style={{
                    marginLeft: theme.filmStrip ? 7 : 3,
                    marginRight: 3,
                    marginTop: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 15,
                        borderRadius: Math.min((theme.photoRadius ?? 0) * 0.25, 3),
                        border: theme.photoBorder,
                        background: ["#d8d8d8", "#c8c8c8", "#d0d0d0"][i],
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.63rem",
                  fontWeight: 700,
                  color: isActive ? "#b45309" : "#9ca3af",
                  textAlign: "center",
                  maxWidth: 52,
                  lineHeight: 1.3,
                }}
              >
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}