import { Question } from "../types/form"
import { FiCopy, FiTrash2 } from "react-icons/fi"

type Props = {
  question: Question
  onDelete: () => void
  onDuplicate: () => void
  onUpdate: (data: Partial<Question>) => void
}

export default function QuestionCard({
  question,
  onDelete,
  onDuplicate,
  onUpdate
}: Props) {

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const addOption = () => {
    const options = question.options || []
    const hasOther = options.includes("Other")
    const realOptions = options.filter(o => o !== "Other")
    const newOption = "Option " + (realOptions.length + 1)
    let newOptions
    if (hasOther) {
      newOptions = [...realOptions, newOption, "Other"]
    } else {
      newOptions = [...options, newOption]
    }
    onUpdate({ options: newOptions })
  }

  const addOther = () => {
    const options = question.options || []
    if (options.includes("Other")) return
    onUpdate({
      options: [...options, "Other"]
    })
  }

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}
    >
      
      <input
        value={question.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Untitled Question"
        style={{
          width: "100%",
          fontSize: "18px",
          border: "none",
          borderBottom: "1px solid #ccc",
          outline: "none",
          paddingBottom: "6px"
        }}
      />

      
      {question.type === "text" && (
        <input
          value={question.placeholder}
          disabled
          placeholder="Short answer text"
          style={{
            width: "100%",
            border: "none",
            borderBottom: "1px solid #eee",
            outline: "none",
            paddingBottom: "6px",
            color: "#777"
          }}
        />
      )}

      
      {question.type === "date" && (
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="radio"
              checked={!question.dateFormat || question.dateFormat === "dd-mm-yyyy"}
              onChange={() => onUpdate({ dateFormat: "dd-mm-yyyy" })}
            />
            dd-mm-yyyy
          </label>
          <br/>
          <label>
            <input
              type="radio"
              checked={question.dateFormat === "mm-yyyy"}
              onChange={() => onUpdate({ dateFormat: "mm-yyyy" })}
            />
            mm-yyyy
          </label>
          <br/>
          <label>
            <input
              type="radio"
              checked={question.dateFormat === "yyyy"}
              onChange={() => onUpdate({ dateFormat: "yyyy" })}
            />
            yyyy
          </label>
        </div>
      )}

      
      {question.type === "time" && (
        <input
          type="time"
          disabled
          style={{
            width: "200px",
            border: "none",
            borderBottom: "1px solid #eee",
            outline: "none",
            paddingBottom: "6px",
            color: "#777"
          }}
        />
      )}

      
      {(question.type === "radio" || question.type === "dropdown") && (
        <div>
          {(question.options || []).map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px"
              }}
            >
              <input type={question.type} disabled />
              <input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "1px solid #ddd",
                  outline: "none"
                }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <button
              onClick={addOption}
              style={{
                border: "none",
                background: "transparent",
                color: "#555",
                cursor: "pointer"
              }}
            >
              Add option
            </button>
            <span>or</span>
            <button
              onClick={addOther}
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                cursor: "pointer"
              }}
            >
              add "Other"
            </button>
          </div>
        </div>
      )}

      
      {question.type === "checkbox" && (
        <div>
          {(question.options || []).map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px"
              }}
            >
              <input type="checkbox" disabled /> 
<input
  value={opt}
  onChange={(e) => updateOption(i, e.target.value)} 
  style={{
    border: "none",
    borderBottom: "1px solid #ddd",
    outline: "none"
  }}
/>
            </div>
          ))}
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <button
              onClick={addOption}
              style={{
                border: "none",
                background: "transparent",
                color: "#555",
                cursor: "pointer"
              }}
            >
              Add option
            </button>
            <span>or</span>
            <button
              onClick={addOther}
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                cursor: "pointer"
              }}
            >
              add "Other"
            </button>
          </div>
        </div>
      )}

      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px"
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onDuplicate}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              color: "#555"
            }}
          >
            <FiCopy />
          </button>
          <button
            onClick={onDelete}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              color: "#555"
            }}
          >
            <FiTrash2 />
          </button>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          Required
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
        </label>
      </div>
    </div>
  )
}