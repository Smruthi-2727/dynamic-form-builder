"use client"

import { Question } from "../types/form"
import { FiCopy, FiTrash2 } from "react-icons/fi"
import { fontMap } from "../../utils/fontMap"

type Props = {
  question: Question
  onDelete: () => void
  onDuplicate: () => void
  onUpdate: (data: Partial<Question>) => void
  theme: {
    headerFont: keyof typeof fontMap
    textFont: keyof typeof fontMap
    primaryColor: string
    backgroundColor: string
    headerImage: string
  }
}

export default function QuestionCard({
  question,
  onDelete,
  onDuplicate,
  onUpdate,
  theme
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

    const newOptions = hasOther
      ? [...realOptions, newOption, "Other"]
      : [...options, newOption]

    onUpdate({ options: newOptions })
  }

  const addOther = () => {
    const options = question.options || []
    if (!options.includes("Other")) {
      onUpdate({ options: [...options, "Other"] })
    }
  }

  // ✅ FONT HELPER
  const getFont = () => fontMap[theme.textFont] || "sans-serif"

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        fontFamily: getFont()
      }}
    >

      {/* QUESTION TITLE */}
      <input
        value={question.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Untitled Question"
        style={{
          width: "100%",
          fontSize: "16px",
          fontFamily: getFont(),
          border: "none",
          borderBottom: `1px solid ${theme.primaryColor}33`,
          outline: "none",
          paddingBottom: "6px",
          color: "black"
        }}
      />

      {/* TEXT */}
      {question.type === "text" && (
        <input
          value={question.placeholder}
          disabled
          placeholder="Short answer text"
          style={{
            width: "100%",
            border: "none",
            borderBottom: `1px solid ${theme.primaryColor}22`,
            outline: "none",
            paddingBottom: "6px",
            color: "#555",
            fontFamily: getFont(),
            fontSize: "14px"
          }}
        />
      )}

      {/* DATE */}
      {question.type === "date" && (
        <div style={{ marginTop: "10px", fontFamily: getFont() }}>
          <label>
            <input
              type="radio"
              checked={!question.dateFormat || question.dateFormat === "dd-mm-yyyy"}
              onChange={() => onUpdate({ dateFormat: "dd-mm-yyyy" })}
            />
            dd-mm-yyyy
          </label>
          <br />
          <label>
            <input
              type="radio"
              checked={question.dateFormat === "mm-yyyy"}
              onChange={() => onUpdate({ dateFormat: "mm-yyyy" })}
            />
            mm-yyyy
          </label>
          <br />
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

      {/* TIME */}
      {question.type === "time" && (
        <input
          type="time"
          disabled
          style={{
            width: "200px",
            border: "none",
            borderBottom: `1px solid ${theme.primaryColor}22`,
            outline: "none",
            paddingBottom: "6px",
            color: "#555",
            fontFamily: getFont(),
            fontSize: "14px"
          }}
        />
      )}

      {/* RADIO + DROPDOWN */}
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
              {/* ✅ FIXED INPUT TYPE */}
              <input
                type={question.type === "radio" ? "radio" : "checkbox"}
                disabled
              />

              <input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                style={{
                  border: "none",
                  borderBottom: `1px solid ${theme.primaryColor}33`,
                  outline: "none",
                  fontFamily: getFont(),
                  fontSize: "14px"
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <button onClick={addOption} style={btnStyle}>Add option</button>
            <span>or</span>
            <button onClick={addOther} style={btnStyle}>add "Other"</button>
          </div>
        </div>
      )}

      {/* CHECKBOX */}
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
                  borderBottom: `1px solid ${theme.primaryColor}33`,
                  outline: "none",
                  fontFamily: getFont(),
                  fontSize: "14px"
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <button onClick={addOption} style={btnStyle}>Add option</button>
            <span>or</span>
            <button onClick={addOther} style={btnStyle}>add "Other"</button>
          </div>
        </div>
      )}

      {/* RATING */}
      {question.type === "rating" && (
        <div style={{ fontSize: "22px", color: "black", marginTop: "10px" }}>
          ⭐⭐⭐⭐⭐
        </div>
      )}

      {/* MATRIX */}
      {question.type === "matrix" && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Columns:</strong>
            {(question.columns || []).map((col, i) => (
              <div key={i}>
                <input
                  value={col}
                  onChange={(e) => {
                    const newCols = [...(question.columns || [])]
                    newCols[i] = e.target.value
                    onUpdate({ columns: newCols })
                  }}
                  style={{
                    border: "none",
                    borderBottom: `1px solid ${theme.primaryColor}33`,
                    outline: "none",
                    marginBottom: "6px",
                    fontFamily: getFont()
                  }}
                />
              </div>
            ))}
            <button onClick={() => onUpdate({ columns: [...(question.columns || []), "New Column"] })}>
              Add Column
            </button>
          </div>

          <div>
            <strong>Rows:</strong>
            {(question.rows || []).map((row, i) => (
              <div key={i}>
                <input
                  value={row}
                  onChange={(e) => {
                    const newRows = [...(question.rows || [])]
                    newRows[i] = e.target.value
                    onUpdate({ rows: newRows })
                  }}
                  style={{
                    border: "none",
                    borderBottom: `1px solid ${theme.primaryColor}33`,
                    outline: "none",
                    marginBottom: "6px",
                    fontFamily: getFont()
                  }}
                />
              </div>
            ))}
            <button onClick={() => onUpdate({ rows: [...(question.rows || []), "New Row"] })}>
              Add Row
            </button>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px"
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onDuplicate} style={iconBtn}><FiCopy /></button>
          <button onClick={onDelete} style={iconBtn}><FiTrash2 /></button>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: getFont() }}>
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

const btnStyle = {
  border: "none",
  background: "transparent",
  color: "black",
  cursor: "pointer"
}

const iconBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "18px",
  color: "black"
}