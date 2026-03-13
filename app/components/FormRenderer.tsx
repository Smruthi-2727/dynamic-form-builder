"use client"
import { useState } from "react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import dayjs from "dayjs"

export default function FormRenderer({ form }: any) {
  const [answers, setAnswers] = useState<any>({})
  const [otherInputs, setOtherInputs] = useState<any>({})

  const handleChange = (id: string, value: any) => {
    setAnswers((prev: any) => ({
      ...prev,
      [id]: value
    }))
  }

  const handleOtherChange = (id: string, value: string) => {
    setOtherInputs((prev: any) => ({
      ...prev,
      [id]: value
    }))
  }

  const handleCheckboxChange = (id: string, option: string, checked: boolean) => {
    const prev = answers[id] || []

    if (checked) {
      setAnswers({
        ...answers,
        [id]: [...prev, option]
      })
    } else {
      setAnswers({
        ...answers,
        [id]: prev.filter((v: string) => v !== option)
      })
    }
  }

  const submitResponse = async () => {
    for (const q of form.questions) {
      const value = answers[q.id]

      if (
        q.required &&
        (value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0))
      ) {
        alert(`${q.question} is required`)
        return
      }
    }

    const finalAnswers: any = { ...answers }

    for (const key in otherInputs) {
      if (answers[key] === "Other") {
        finalAnswers[key] = otherInputs[key]
      }

      if (Array.isArray(answers[key]) && answers[key].includes("Other")) {
        finalAnswers[key] = answers[key].map((v: string) =>
          v === "Other" ? otherInputs[key] : v
        )
      }
    }

    await fetch("/api/forms/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        formId: form._id,
        answers: finalAnswers
      })
    })

    alert("Response submitted!")
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ background: "#ede7f6", minHeight: "100vh", paddingTop: "40px" }}>
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          
          <div style={{
            background: "white",
            borderRadius: "10px",
            marginBottom: "20px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <div style={{ height: "8px", background: "#673ab7" }} />
            <div style={{ padding: "30px" }}>
              <h1 style={{ fontSize: "28px", marginBottom: "10px", fontWeight: "600" }}>
                {form.title}
              </h1>
              <p style={{ color: "#666", fontSize: "15px" }}>
                {form.description}
              </p>
            </div>
          </div>

          
          {form.questions.map((q: any) => {
            const format = q.dateFormat || "dd-mm-yyyy"

            return (
              <div key={q.id} style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <label style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "500",
                  fontSize: "16px"
                }}>
                  {q.question} {q.required && <span style={{ color: "red" }}>*</span>}
                </label>

                
                {q.type === "text" && (
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #ccc"
                    }}
                  />
                )}

                
                {q.type === "radio" && (
                  <div>
                    {q.options?.map((opt: string, i: number) => (
                      <div key={i} style={{ marginBottom: "8px" }}>
                        <label>
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleChange(q.id, opt)}
                            style={{ marginRight: "8px" }}
                          />
                          {opt}
                        </label>
                        {opt === "Other" && answers[q.id] === "Other" && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={otherInputs[q.id] || ""}
                            onChange={(e) => handleOtherChange(q.id, e.target.value)}
                            style={{
                              marginTop: "6px",
                              marginLeft: "24px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              width: "60%"
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                
               {q.type === "dropdown" && (
  <>
    <select
      value={answers[q.id] || ""}
      onChange={(e) => handleChange(q.id, e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
    >
      <option value="">Select</option>
      {q.options?.map((opt: string, i: number) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>

    
    {answers[q.id] === "Other" && (
      <input
        type="text"
        placeholder="Please specify"
        value={otherInputs[q.id] || ""}
        onChange={(e) => handleOtherChange(q.id, e.target.value)}
        style={{
          marginTop: "6px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "60%"
        }}
      />
    )}
  </>
)}

                
                {q.type === "date" && (
                  <DatePicker
                    views={
                      format === "yyyy"
                        ? ["year"]
                        : format === "mm-yyyy"
                        ? ["year", "month"]
                        : ["year", "month", "day"]
                    }
                    format={
                      format === "yyyy"
                        ? "YYYY"
                        : format === "mm-yyyy"
                        ? "MM-YYYY"
                        : "DD-MM-YYYY"
                    }
                    value={answers[q.id] ? dayjs(answers[q.id]) : null}
                    onChange={(value) => {
                      if (!value) return
                      if (format === "yyyy") handleChange(q.id, value.format("YYYY"))
                      else if (format === "mm-yyyy") handleChange(q.id, value.format("YYYY-MM"))
                      else handleChange(q.id, value.format("YYYY-MM-DD"))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            height: '48px'
                          },
                          '& .MuiInputBase-input': {
                            padding: '12px'
                          }
                        }
                      }
                    }}
                  />
                )}

                
                {q.type === "time" && (
                  <TimePicker
                    value={answers[q.id] ? dayjs(`2000-01-01T${answers[q.id]}`) : null}
                    onChange={(value) => {
                      if (!value) return
                      handleChange(q.id, value.format("HH:mm")) 
                    }}
                    format="hh:mm A"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "02:00 PM",
                        sx: {
                          '& .MuiInputBase-root': {
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            height: '48px'
                          },
                          '& .MuiInputBase-input': {
                            padding: '12px'
                          }
                        }
                      }
                    }}
                  />
                )}

                
                {q.type === "checkbox" && (
                  <div>
                    {q.options?.map((opt: string, i: number) => (
                      <div key={i} style={{ marginBottom: "8px" }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={(answers[q.id] || []).includes(opt)}
                            onChange={(e) =>
                              handleCheckboxChange(q.id, opt, e.target.checked)
                            }
                            style={{ marginRight: "8px" }}
                          />
                          {opt}
                        </label>
                        {opt === "Other" && (answers[q.id] || []).includes("Other") && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={otherInputs[q.id] || ""}
                            onChange={(e) =>
                              handleOtherChange(q.id, e.target.value)
                            }
                            style={{
                              marginTop: "6px",
                              marginLeft: "24px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              width: "60%"
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          
          <button
            onClick={submitResponse}
            style={{
              padding: "12px 22px",
              borderRadius: "6px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "500",
              fontSize: "15px",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </LocalizationProvider>
  )
}