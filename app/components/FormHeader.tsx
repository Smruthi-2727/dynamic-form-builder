type Props = {
  title: string
  description: string
  setTitle: (v: string) => void
  setDescription: (v: string) => void
}

export default function FormHeader({
  title,
  description,
  setTitle,
  setDescription
}: Props) {

  return (

    <div
      style={{
        background: "white",
        borderRadius: "12px",
        marginBottom: "25px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
      }}
    >

      <div
  style={{
    height: "10px",
    background:  "linear-gradient(90deg,#000,#333)"
  }}
/>

      <div style={{ padding: "30px" }}>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Form"
          style={{
            fontSize: "34px",
            fontWeight: "700",
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent"
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
            fontSize: "17px",
            color: "#5f6368",
            background: "transparent"
          }}
        />

      </div>

    </div>

  )
}