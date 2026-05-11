"use client";
import React, { useState } from "react";
import { Film } from "lucide-react";
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
        <Film size={14} />
        <span>Frame Style</span>
      </div>

      {/* Category tabs */}
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: 6,
          paddingBottom: 12,
          marginBottom: 14,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflowX: "auto",
        }}
      >
        {THEME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`tab-pill ${activeCategory === cat ? "active" : ""}`}
            style={{ padding: "6px 12px", fontSize: "0.72rem" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Theme buttons */}
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: 8,
          paddingBottom: 4,
          overflowX: "auto",
        }}
      >
        {filtered.map((theme) => {
          const isActive = theme.id === activeThemeId;

          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "10px 10px 8px",
                borderRadius: 12,
                border: isActive
                  ? "1.5px solid #8b5cf6"
                  : "1.5px solid rgba(255,255,255,0.06)",
                background: isActive
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                boxShadow: isActive ? "0 0 20px rgba(139,92,246,0.25)" : "none",
                transform: isActive ? "translateY(-2px) scale(1.04)" : "none",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "none";
                }
              }}
            >
              {/* Mini strip preview */}
              <div
                style={{
                  width: 36,
                  height: 56,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: theme.previewBg,
                  border: theme.outerBorder ?? "1px solid rgba(255,255,255,0.1)",
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
                          background: "rgba(255,255,255,0.15)",
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
                        height: 13,
                        borderRadius: Math.min(
                          (theme.photoRadius ?? 0) * 0.25,
                          3
                        ),
                        border: theme.photoBorder,
                        background: [
                          "rgba(255,255,255,0.15)",
                          "rgba(255,255,255,0.1)",
                          "rgba(255,255,255,0.12)",
                        ][i],
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 600,
                  color: isActive ? "#a78bfa" : "#55556a",
                  textAlign: "center",
                  maxWidth: 48,
                  lineHeight: 1.2,
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