"use client";

import React, { forwardRef } from "react";
import { AyahShareData, CardOptions } from "@/types/share";
import { CARD_THEMES, RATIO_DIMENSIONS } from "@/lib/card-themes";
import { AMIRI_BASE64_CSS } from "@/lib/fonts-base64";

interface AyahCardProps {
  data: AyahShareData;
  options: CardOptions;
}

export const AyahCard = forwardRef<HTMLDivElement, AyahCardProps>(
  ({ data, options }, ref) => {
    const theme = CARD_THEMES[options.theme];
    const dim = RATIO_DIMENSIONS[options.ratio];

    const cardStyle: React.CSSProperties = {
      width: dim.width,
      height: dim.height,
      background: theme.bg,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px",
      fontFamily: "'Geist', sans-serif",
      overflow: "hidden",
      flexShrink: 0,
    };

    // Outer border
    const outerBorderStyle: React.CSSProperties = {
      position: "absolute",
      inset: "12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      pointerEvents: "none",
    };

    // Inner border (double border effect)
    const innerBorderStyle: React.CSSProperties = {
      position: "absolute",
      inset: "18px",
      border: `0.5px solid ${theme.border}`,
      opacity: 0.5,
      borderRadius: "2px",
      pointerEvents: "none",
    };

    // Corner ornaments untuk theme navy & rose
    const showCorners = options.theme === "navy" || options.theme === "rose";
    const cornerSize = 40;
    const cornerOffset = 40;
    const cornerColor = theme.cornerAccent || theme.border;

    const corners = showCorners ? (
      <>
        {/* Top Left */}
        <div style={{ position: "absolute", top: cornerOffset, left: cornerOffset, width: cornerSize, height: cornerSize, borderTop: `2px solid ${cornerColor}`, borderLeft: `2px solid ${cornerColor}`, borderTopLeftRadius: 3 }} />
        {/* Top Right */}
        <div style={{ position: "absolute", top: cornerOffset, right: cornerOffset, width: cornerSize, height: cornerSize, borderTop: `2px solid ${cornerColor}`, borderRight: `2px solid ${cornerColor}`, borderTopRightRadius: 3 }} />
        {/* Bottom Left */}
        <div style={{ position: "absolute", bottom: cornerOffset, left: cornerOffset, width: cornerSize, height: cornerSize, borderBottom: `2px solid ${cornerColor}`, borderLeft: `2px solid ${cornerColor}`, borderBottomLeftRadius: 3 }} />
        {/* Bottom Right */}
        <div style={{ position: "absolute", bottom: cornerOffset, right: cornerOffset, width: cornerSize, height: cornerSize, borderBottom: `2px solid ${cornerColor}`, borderRight: `2px solid ${cornerColor}`, borderBottomRightRadius: 3 }} />
      </>
    ) : null;

    // Subtle radial glow background
    const glowStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.05) 0%, transparent 65%)`,
      pointerEvents: "none",
    };

    // Nomor ayat badge
    const numberBadgeStyle: React.CSSProperties = {
      position: "absolute",
      top: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "64px",
      height: "64px",
      background: theme.numberBg,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.numberColor,
      fontSize: "24px",
      fontWeight: 500,
      letterSpacing: "0.05em",
    };

    return (
      <div ref={ref} style={cardStyle}>
        <style dangerouslySetInnerHTML={{ __html: AMIRI_BASE64_CSS }} />
        {/* Background effects */}
        <div style={glowStyle} />
        <div style={outerBorderStyle} />
        <div style={innerBorderStyle} />
        {corners}

        {/* Nomor ayat */}
        <div style={numberBadgeStyle}>{data.ayahNumber}</div>

        {/* Content area */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center", width: "100%", maxWidth: "85%" }}>
          
          {/* Teks Arab */}
          <p style={{
            fontFamily: "'Amiri', 'Scheherazade New', serif",
            direction: "rtl",
            color: theme.arabicColor,
            fontSize: options.ratio === "16:9" ? "72px" : "64px",
            lineHeight: 1.8,
            margin: 0,
            fontWeight: 400,
          }}>
            {data.arabicText}
          </p>

          {/* Divider */}
          <div style={{ width: "120px", height: "2px", background: theme.dividerColor, margin: "16px 0" }} />

          {/* Transliterasi (opsional) */}
          {options.showTransliteration && data.transliteration && (
            <p style={{
              color: theme.surahLabelColor,
              fontSize: "28px",
              fontStyle: "italic",
              letterSpacing: "0.03em",
              margin: 0,
              marginTop: "8px",
              opacity: 0.85,
            }}>
              {data.transliteration}
            </p>
          )}

          {/* Terjemahan */}
          {options.showTranslation && (
            <p style={{
              color: theme.translationColor,
              fontSize: "32px",
              lineHeight: 1.6,
              letterSpacing: "0.01em",
              margin: 0,
            }}>
              {data.translation}
            </p>
          )}

          {/* Label surah */}
          <p style={{
            color: theme.surahLabelColor,
            fontSize: "20px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            margin: "32px 0 0",
            fontWeight: 500,
          }}>
            {data.surahName} • Ayat {data.ayahNumber}
          </p>
        </div>

        {/* Watermark */}
        <p style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          color: theme.watermarkColor,
          fontSize: "18px",
          letterSpacing: "0.06em",
          margin: 0,
          whiteSpace: "nowrap",
        }}>
          Al-Quran Digital · mysimplequran.vercel.app
        </p>
      </div>
    );
  }
);

AyahCard.displayName = "AyahCard";
