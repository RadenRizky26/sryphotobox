"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Zap, ZapOff } from "lucide-react";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const playSound = (type: 'beep' | 'shutter') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'beep') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = 'square'; osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    }
  } catch { /* silent */ }
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
  photoCount, activeFilter, flashEnabled, retakeIndex,
  onToggleFlash, onPhotoTaken, onSessionStart, onSessionEnd,
}: Props) {
  const webcamRef   = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown,   setCountdown]   = useState<number | null>(null);
  const [cdKey,       setCdKey]       = useState(0);
  const [flash,       setFlash]       = useState(false);
  const [shotNum,     setShotNum]     = useState(0);

  const capture = useCallback(() => {
    const src = webcamRef.current?.getScreenshot();
    if (src) {
      playSound('shutter');
      onPhotoTaken(src);
      if (flashEnabled) { setFlash(true); setTimeout(() => setFlash(false), 200); }
    }
  }, [onPhotoTaken, flashEnabled]);

  const startSession = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    onSessionStart();

    const takeShot = async (shotIndex: number) => {
      setShotNum(shotIndex);
      for (let c = 3; c >= 1; c--) {
        playSound('beep');
        setCountdown(c);
        setCdKey(k => k + 1);
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
  }, [isCapturing, onSessionStart, retakeIndex, photoCount, capture, onSessionEnd]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.code === 'Space' && !isCapturing) { e.preventDefault(); startSession(); }
      if (e.code === 'KeyF') onToggleFlash();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCapturing, startSession, onToggleFlash]);

  const isRetake = retakeIndex !== null;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>

      {/* flash overlay */}
      {flash && (
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          background: "white", zIndex: 9999,
          animation: "cv-flash 0.2s ease-out forwards",
        }}/>
      )}

      {/* ── VIEWFINDER ── */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",      /* fixed ratio keeps it proportional */
        borderRadius: 14,
        overflow: "hidden",
        background: "#0d0d0d",
        border: "2px solid #2a2a2a",
        boxShadow: "0 16px 48px rgba(0,0,0,0.2), inset 0 0 60px rgba(0,0,0,0.45)",
      }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user", aspectRatio: 16 / 9 }}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            filter: activeFilter,
            display: "block",
          }}
        />

        {/* vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.42) 100%)",
        }}/>

        {/* flash toggle */}
        <button
          onClick={onToggleFlash}
          style={{
            position: "absolute", top: 10, left: 12,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.18)",
            padding: "5px 10px", borderRadius: 20,
            fontSize: "0.68rem", fontWeight: 700,
            cursor: "pointer", zIndex: 10,
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em",
          }}
        >
          {flashEnabled
            ? <Zap size={12} style={{ color: "#fbbf24", fill: "#fbbf24" }}/>
            : <ZapOff size={12} style={{ color: "#888" }}/>
          }
          FLASH {flashEnabled ? 'ON' : 'OFF'}
          <span style={{ opacity: 0.45, fontWeight: 400, marginLeft: 2 }}>[F]</span>
        </button>

        {/* rec indicator */}
        <div style={{
          position: "absolute", top: 12, right: 14,
          fontFamily: "'DM Mono', monospace", fontSize: "0.62rem",
          letterSpacing: "0.14em", pointerEvents: "none",
          color: isCapturing ? "rgba(245,158,11,0.95)" : "rgba(245,158,11,0.45)",
        }}>
          {isCapturing
            ? (isRetake ? `RETAKING FRAME ${shotNum}` : `${shotNum} / ${photoCount}`)
            : "● REC"
          }
        </div>

        {/* countdown */}
        {countdown !== null && countdown > 0 && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)",
          }}>
            <span key={cdKey} style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "min(20vw, 9rem)",
              color: "#fff", lineHeight: 1,
              textShadow: "0 0 60px rgba(245,158,11,0.85)",
              animation: "cv-countdown 0.92s ease-out both",
            }}>{countdown}</span>
          </div>
        )}
      </div>

      {/* ── SHOOT BUTTON ── */}
      <button
        onClick={startSession}
        disabled={isCapturing}
        style={{
          width: "100%",
          padding: "15px 20px",
          borderRadius: 12,
          border: "none",
          cursor: isCapturing ? "not-allowed" : "pointer",
          background: isCapturing
            ? "#ece7df"
            : isRetake
              ? "linear-gradient(135deg,#ef4444 0%,#b91c1c 100%)"
              : "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
          color: isCapturing ? "#c0b8a8" : "#fff",
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "1.45rem",
          letterSpacing: "0.08em",
          boxShadow: isCapturing ? "none" : isRetake
            ? "0 6px 22px rgba(239,68,68,.35)"
            : "0 6px 22px rgba(217,119,6,.32)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "transform .15s, box-shadow .15s",
        }}
        onMouseEnter={e => { if (!isCapturing) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >
        <span style={{ fontSize: "1.1rem" }}>📷</span>
        {isCapturing
          ? "SMILE! 📸"
          : isRetake
            ? `RETAKE FRAME ${retakeIndex! + 1}`
            : `START SHOOTING (${photoCount} FRAMES)`
        }
        {!isCapturing && (
          <span style={{
            marginLeft: 4, fontSize: "0.7rem",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            background: "rgba(255,255,255,0.22)", padding: "3px 8px",
            borderRadius: 6, letterSpacing: "0.06em",
          }}>SPACE</span>
        )}
      </button>

      <style>{`
        @keyframes cv-flash    { 0%{opacity:1} 100%{opacity:0} }
        @keyframes cv-countdown { 0%{transform:scale(1.6);opacity:0} 25%{transform:scale(1);opacity:1} 80%{transform:scale(1);opacity:1} 100%{transform:scale(.85);opacity:0} }
      `}</style>
    </div>
  );
}