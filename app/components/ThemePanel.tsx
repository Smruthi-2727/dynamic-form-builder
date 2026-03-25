"use client"

type Props = {
  theme: any
  setTheme: any
  onClose: () => void
}

export default function ThemePanel({ theme, setTheme, onClose }: Props) {
  
  const fonts = [
    "Roboto",
    "Poppins",
    "Inter",
    "Lato",
    "Montserrat",
    "Oswald",
    "Raleway",
    "Nunito",
    "Arial",
    "Verdana",
    "Tahoma",
    "Georgia",
    "Times New Roman",
    "Courier New"
  ]

  return (
    <div style={overlay}>
      <div style={panel}>
        
        
        <div style={header}>
          <h3>Theme</h3>
          <button onClick={onClose} style={closeBtn}>✖</button>
        </div>

        
        <div style={section}>
          <p>Primary Color</p>
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) =>
              setTheme({ ...theme, primaryColor: e.target.value })
            }
            style={colorInput}
          />
        </div>

        
        <div style={section}>
          <p>Background Color</p>
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) =>
              setTheme({ ...theme, backgroundColor: e.target.value })
            }
            style={colorInput}
          />
        </div>

        
        <FontSelector
          title="Header Font"
          value={theme.headerFont}
          onChange={(font: string) =>
            setTheme({ ...theme, headerFont: font })
          }
          fonts={fonts}
        />

        

        
        <FontSelector
          title="Text Font"
          value={theme.textFont}
          onChange={(font: string) =>
            setTheme({ ...theme, textFont: font })
          }
          fonts={fonts}
        />
      </div>
    </div>
  )
}


function FontSelector({ title, value, onChange, fonts }: any) {
  return (
    <div style={section}>
      <p>{title}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          fontFamily: value, 
          cursor: "pointer",
        }}
      >
        {fonts.map((font: string) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  )
}


const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 9999
}

const panel = {
  width: "340px",
  height: "100%",
  background: "white",
  padding: "20px",
  boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column" as const,
  overflowY: "auto" as const
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
}

const closeBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "600"
}

const section = {
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px"
}

const colorInput = {
  width: "100%",
  height: "40px",
  border: "none",
  cursor: "pointer"
}