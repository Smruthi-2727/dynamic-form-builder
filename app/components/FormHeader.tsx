"use client"

import { CSSProperties } from "react"

type Theme = {
  headerFont: string
  primaryColor: string
}

type Props = {
  title: string
  description: string
  setTitle: (v: string) => void
  setDescription: (v: string) => void
  onPreview: () => void
  onThemeClick: () => void
  style?: CSSProperties
  theme?: Theme
}

export default function FormHeader({
  title,
  description,
  setTitle,
  setDescription,
  onPreview,
  onThemeClick,
  style,
  theme
}: Props) {
  return (
    <div
      style={{
        background: "#fff", 
        borderRadius: "12px",
        marginBottom: "25px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        position: "relative",
        ...style
      }}
    >
      
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          display: "flex",
          gap: "10px"
        }}
      >
        <button
          onClick={onThemeClick}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            cursor: "pointer",
            background: "#fff",
            fontWeight: "500",
            fontFamily: theme?.headerFont || "Roboto",
            color: "black"
          }}
        >
          🎨 Theme
        </button>

        <button
          onClick={onPreview}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            cursor: "pointer",
            background: "#fff",
            fontWeight: "500",
            fontFamily: theme?.headerFont || "Roboto",
            color: "black"
          }}
        >
          👁️ Preview
        </button>
      </div>

      
      <div
        style={{
          height: "10px",
          background: theme?.primaryColor || "#673ab7"
        }}
      />

      
      <div style={{ padding: "30px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Form"
          style={{
            fontSize: "34px",
            fontFamily: theme?.headerFont || "Roboto",
            fontWeight: "700",
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "black"
          }}
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Form description"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            marginTop: "12px",
            fontSize: "14px",
            fontFamily: theme?.headerFont || "Roboto",
            color: "black",
            background: "transparent"
          }}
        />
      </div>
    </div>
  )
}



