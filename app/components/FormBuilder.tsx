"use client"

import { useState } from "react"
import { v4 as uuid } from "uuid"

import FormHeader from "./FormHeader"
import QuestionCard from "./QuestionCard"
import ComponentPanel from "./ComponentPanel"

import { Question } from "../types/form"

export default function FormBuilder() {
  const [title, setTitle] = useState("Untitled Form")
  const [description, setDescription] = useState("Form description")
  const [questions, setQuestions] = useState<Question[]>([])
  const [formLink, setFormLink] = useState("")

  
  const addTextField = () => {
    const newQuestion: Question = {
      id: uuid(),
      type: "text",
      question: "Untitled Question",
      placeholder: "Short answer text",
      required: false
    }
    setQuestions([...questions, newQuestion])
  }

  const addRadioButton = () => {
    const newQuestion: Question = {
      id: uuid(),
      type: "radio",
      question: "Untitled Question",
      options: ["Option 1"],
      required: false
    }
    setQuestions([...questions, newQuestion])
  }

  const addCheckbox = () => {
    const newQuestion: Question = {
      id: uuid(),
      type: "checkbox",
      question: "Untitled Question",
      options: ["Option 1"],
      required: false
    }
    setQuestions([...questions, newQuestion])
  }

  const addDropdown = () => {
    const newQuestion: Question = {
      id: uuid(),
      type: "dropdown",
      question: "Untitled Question",
      options: ["Option 1"],
      required: false
    }
    setQuestions([...questions, newQuestion])
  }

  const addDate = () => {
    const newQuestion: Question = {
      id: uuid(),
      type: "date",
      question: "Untitled Question",
      required: false,
      dateFormat: "dd-mm-yyyy"
    }
    setQuestions([...questions, newQuestion])
  }

  const addTime = () => {
    const newQuestion: Question = {
      id: uuid(),
      type: "time",
      question: "Untitled Question",
      required: false
    }
    setQuestions([...questions, newQuestion])
  }

  
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const duplicateQuestion = (q: Question) => {
    const newQ = { ...q, id: uuid() }
    setQuestions([...questions, newQ])
  }

  const updateQuestion = (id: string, data: Partial<Question>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...data } : q)))
  }

  
  const submitForm = async () => {
    const answers: any = {}
    questions.forEach(q => {
      answers[q.id] = q.placeholder
    })

    const res = await fetch("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        answers
      })
    })

    const data = await res.json()
    console.log("Saved:", data)
    alert("Form submitted successfully!")
  }

  const cancelForm = () => {
    setQuestions([])
  }

  const saveForm = async () => {
    const res = await fetch("/api/forms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        questions
      })
    })

    const data = await res.json()
    console.log("Form Saved:", data)

    const link = `${window.location.origin}/form/${data.formId}`
    setFormLink(link)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(formLink)
    alert("Link copied!")
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      
      <ComponentPanel
        addTextField={addTextField}
        addRadioButton={addRadioButton}
        addCheckbox={addCheckbox}
        addDropdown={addDropdown}
        addDate={addDate}
        addTime={addTime}
      />

      
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px" }}>
        <div style={{ width: "700px" }}>
          <FormHeader
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
          />

          {questions.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
              Click a component to add your first question
            </div>
          )}

          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              onDelete={() => deleteQuestion(q.id)}
              onDuplicate={() => duplicateQuestion(q)}
              onUpdate={data => updateQuestion(q.id, data)}
            />
          ))}

          
          <div style={{ display: "flex", gap: "14px", marginTop: "20px" }}>
            <button
              onClick={saveForm}
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#2563eb",
                color: "white"
              }}
            >
              Save Form
            </button>
          </div>
        </div>
      </div>

      
      {formLink && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "420px"
            }}
          >
            <h3>Form Created</h3>
            <p>Share this link:</p>
            <input
              value={formLink}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px"
              }}
            />
            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={copyLink}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Copy Link
              </button>
              <button
                onClick={() => setFormLink("")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}