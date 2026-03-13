type Props = {
  addTextField: () => void
  addRadioButton: () => void
  addCheckbox: () => void
  addDropdown: () => void
  addDate: () => void
  addTime: () => void
}

export default function ComponentPanel({
  addTextField,
  addRadioButton,
  addCheckbox,
  addDropdown,
  addDate,
  addTime
}: Props) {
  return (
    <div style={panelStyle}>
      
      <h2 style={{ ...titleStyle, textAlign: "center" }}>Components</h2>

      <button style={buttonStyle} onClick={addTextField}>
        Text Field
      </button>

      <button style={buttonStyle} onClick={addRadioButton}>
        Radio Button
      </button>

      <button style={buttonStyle} onClick={addCheckbox}>
        Checkbox
      </button>

      <button style={buttonStyle} onClick={addDropdown}>
        Dropdown
      </button>

      <button style={buttonStyle} onClick={addDate}>
        Date
      </button>

      <button style={buttonStyle} onClick={addTime}>
        Time
      </button>
    </div>
  )
}

const panelStyle = {
  width: "300px",
  height: "100vh",
  background: "#f5f5f5",
  borderRight: "1px solid #ddd", 
  padding: "40px 25px",
  boxSizing: "border-box" as const
}

const titleStyle = {
  marginBottom: "30px",
  fontWeight: "600",
  fontSize: "22px"
}

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "6px",
  border: "1px solid #d0d0d0",
  background: "white",
  cursor: "pointer",
  fontSize: "16px"
}