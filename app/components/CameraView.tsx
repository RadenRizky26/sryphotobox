"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Zap, ZapOff } from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const playSound = (type: "beep" | "shutter") => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "beep") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    /* silent */
  }
};

interface Props {
  photoCount: number;
  activeFilter: string;
  flashEnabled: boolean;
  retakeIndex: number | null;
  onToggleFlash: () => void;
  onPhotoTaken: (src: string) => void;
  onSessionStart: () => void;
  onSessionEnd: () => void;
}

export default function CameraView({
  photoCount,
  activeFilter,
  flashEnabled,
  retakeIndex,
  onToggleFlash,
  onPhotoTaken,
  onSessionStart,
  onSessionEnd,
}: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cdKey, setCdKey] = useState(0);
  const [flash, setFlash] = useState(false);
  const [shotNum, setShotNum] = useState(0);

  const capture = useCallback(() => {
    const src = webcamRef.current?.getScreenshot();
    if (src) {
      playSound("shutter");
      onPhotoTaken(src);
      if (flashEnabled) {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
      }
    }
  }, [onPhotoTaken, flashEnabled]);

  const startSession = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    onSessionStart();

    const takeShot = async (shotIndex: number) => {
      setShotNum(shotIndex);
      for (let c = 3; c >= 1; c--) {
        playSound("beep");
        setCountdown(c);
        setCdKey((k) => k + 1);
        await sleep(950);
      }
      setCountdown(null);
      capture();
      await sleep(800);
    };

    if (retakeIndex !== null) {
      await takeShot(retakeIndex + 1);
    } else {
      for (let i = 1; i <= photoCount; i++) await takeShot(i);
    }

    setIsCapturing(false);
    setShotNum(0);
    onSessionEnd();
  }, [
    isCapturing,
    onSessionStart,
    retakeIndex,
    photoCount,
    capture,
    onSessionEnd,
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.code === "Space" && !isCapturing) {
        e.preventDefault();
        startSession();
      }
      if (e.code === "KeyF") onToggleFlash();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCapturing, startSession, onToggleFlash]);

  const isRetake = retakeIndex !== null;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Flash overlay */}
      {flash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background: "white",
            zIndex: 9999,
            animation: "cv-flash 0.2s ease-out forwards",
          }}
        />
      )}

      {/* ── VIEWFINDER ── */}
      <div
        className="viewfinder"
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          background: "#000",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.4)",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user", aspectRatio: 16 / 9 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            filter: activeFilter,
            display: "block",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Corner brackets */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {/* Top-left */}
          <line x1="24" y1="16" x2="24" y2="32" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          <line x1="24" y1="16" x2="40" y2="16" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          {/* Top-right */}
          <line x1="calc(100% - 24)" y1="16" x2="calc(100% - 24)" y2="32" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          <line x1="calc(100% - 24)" y1="16" x2="calc(100% - 40)" y2="16" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          {/* Bottom-left */}
          <line x1="24" y1="calc(100% - 16)" x2="24" y2="calc(100% - 32)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          <line x1="24" y1="calc(100% - 16)" x2="40" y2="calc(100% - 16)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          {/* Bottom-right */}
          <line x1="calc(100% - 24)" y1="calc(100% - 16)" x2="calc(100% - 24)" y2="calc(100% - 32)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
          <line x1="calc(100% - 24)" y1="calc(100% - 16)" x2="calc(100% - 40)" y2="calc(100% - 16)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
        </svg>

        {/* Flash toggle pill */}
        <button
          onClick={onToggleFlash}
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            border: `1px solid ${flashEnabled ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}`,
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: "0.68rem",
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 10,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em",
            transition: "all 0.2s ease",
          }}
        >
          {flashEnabled ? (
            <Zap size={12} style={{ color: "#a78bfa", fill: "#a78bfa" }} />
          ) : (
            <ZapOff size={12} style={{ color: "#555" }} />
          )}
          FLASH {flashEnabled ? "ON" : "OFF"}
          <span style={{ opacity: 0.4, fontWeight: 400, marginLeft: 2 }}>
            [F]
          </span>
        </button>

        {/* Recording indicator */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 18,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: isCapturing ? "#a78bfa" : "#55556a",
          }}
        >
          {isCapturing ? (
            <>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#8b5cf6",
                  animation: "pulse-soft 1s infinite",
                  boxShadow: "0 0 8px rgba(139,92,246,0.25)",
                }}
              />
              {isRetake
                ? `RETAKING FRAME ${shotNum}`
                : `${shotNum} / ${photoCount}`}
            </>
          ) : (
            <>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ef4444",
                  animation: "pulse-soft 2s infinite",
                }}
              />
              REC
            </>
          )}
        </div>

        {/* Countdown */}
        {countdown !== null && countdown > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              key={cdKey}
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "min(20vw, 10rem)",
                color: "#fff",
                lineHeight: 1,
                textShadow: "0 0 80px rgba(139,92,246,0.5)",
                animation: "cv-countdown 0.92s ease-out both",
              }}
            >
              {countdown}
            </span>
          </div>
        )}
      </div>

      {/* ── SHOOT BUTTON ── */}
      <button
        onClick={startSession}
        disabled={isCapturing}
        style={{
          width: "100%",
          padding: "16px 20px",
          fontSize: "1.1rem",
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderRadius: 14,
          border: "none",
          cursor: isCapturing ? "not-allowed" : "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          background: isCapturing
            ? "rgba(255,255,255,0.05)"
            : isRetake
              ? "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
              : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)",
          color: isCapturing ? "#55556a" : "#fff",
          boxShadow: isCapturing
            ? "none"
            : isRetake
              ? "0 6px 22px rgba(239,68,68,.35)"
              : "0 6px 24px rgba(139,92,246,0.4), 0 2px 8px rgba(139,92,246,0.2)",
        }}
        onMouseEnter={(e) => {
          if (!isCapturing)
            e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>📷</span>
        {isCapturing
          ? "SMILE! 📸"
          : isRetake
            ? `RETAKE FRAME ${retakeIndex! + 1}`
            : `START SHOOTING (${photoCount} FRAMES)`}
        {!isCapturing && (
          <span
            style={{
              marginLeft: 4,
              fontSize: "0.65rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              background: "rgba(255,255,255,0.18)",
              padding: "3px 8px",
              borderRadius: 6,
              letterSpacing: "0.04em",
            }}
          >
            SPACE
          </span>
        )}
      </button>
    </div>
  );
}