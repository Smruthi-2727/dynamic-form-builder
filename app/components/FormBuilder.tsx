"use client"

import { useState } from "react"
import { v4 as uuid } from "uuid"

import FormHeader from "./FormHeader"
import QuestionCard from "./QuestionCard"
import SanghaQuestionCard from "./SanghaQuestionCard"
import ComponentPanel from "./ComponentPanel"
import SanghComponentPanel from "./SanghComponentPanel"
import ThemePanel from "./ThemePanel"

import { Question, Section } from "../types/form"
import { fontMap, FontKey } from "../../utils/fontMap"

export default function FormBuilder() {

  const [title, setTitle] = useState("Untitled Form")
  const [description, setDescription] = useState("Form description")

  const [questions, setQuestions] = useState<Question[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [isSectionMode, setIsSectionMode] = useState(false)

  const [formLink, setFormLink] = useState("")
  const [showTheme, setShowTheme] = useState(false)
  

  const [theme, setTheme] = useState<{
    headerFont: FontKey
    textFont: FontKey
    primaryColor: string
    backgroundColor: string
    headerImage: string
  }>({
    headerFont: "Roboto",
    textFont: "Roboto",
    primaryColor: "#673ab7",
    backgroundColor: "#f4f0ff",
    headerImage: ""
  })

  // -----------------------------
  // SECTION HANDLERS
  // -----------------------------

  const addSection = () => {
    setIsSectionMode(true)

    const newSection: Section = {
      id: uuid(),
      title: `Section ${sections.length + 1}`,
      questions: []
    }

    setSections(prev => [...prev, newSection])
  }

  // ---------------s--------------
  // QUESTION HANDLER
  // -----------------------------

  const addQuestion = (newQuestion: Question) => {

    if (!isSectionMode) {
      setQuestions(prev => [...prev, newQuestion])
    } else {

      setSections(prev =>
        prev.map((section, idx) =>
          idx === prev.length - 1
            ? { ...section, questions: [...section.questions, newQuestion] }
            : section
        )
      )

    }
  }

  // -----------------------------
  // NORMAL COMPONENTS
  // -----------------------------

  const addTextField = () =>
    addQuestion({
      id: uuid(),
      type: "text",
      question: "Untitled Question",
      placeholder: "Short answer text",
      required: false
    })

  const addRadioButton = () =>
    addQuestion({
      id: uuid(),
      type: "radio",
      question: "Untitled Question",
      options: ["Option 1"],
      required: false
    })

  const addCheckbox = () =>
    addQuestion({
      id: uuid(),
      type: "checkbox",
      question: "Untitled Question",
      options: ["Option 1"],
      required: false
    })

  const addDropdown = () =>
    addQuestion({
      id: uuid(),
      type: "dropdown",
      question: "Untitled Question",
      options: ["Option 1"],
      required: false
    })

  const addDate = () =>
    addQuestion({
      id: uuid(),
      type: "date",
      question: "Untitled Question",
      required: false,
      dateFormat: "dd-mm-yyyy"
    })

  const addTime = () =>
    addQuestion({
      id: uuid(),
      type: "time",
      question: "Untitled Question",
      required: false
    })

  const addRating = () =>
    addQuestion({
      id: uuid(),
      type: "rating",
      question: "Untitled Rating",
      required: false
    })

  const addMatrix = () =>
    addQuestion({
      id: uuid(),
      type: "matrix",
      question: "Untitled Matrix Question",
      required: false,
      rows: ["Row 1", "Row 2"],
      columns: ["Option 1", "Option 2", "Option 3"]
    })

  // -----------------------------
  // SANGH COMPONENTS
  // -----------------------------

  const addVibhag = () =>
    addQuestion({
      id: uuid(),
      type: "vibhag",
      question: "Select Vibhag",
      options: [],
      required: false
    })

  const addBhag = () =>
    addQuestion({
      id: uuid(),
      type: "bhag",
      question: "Select Bhag",
      options: [],
      required: false
    })

  const addNagar = () =>
    addQuestion({
      id: uuid(),
      type: "nagar",
      question: "Select Nagar",
      options: [],
      required: false
    })

  const addVasathi = () =>
    addQuestion({
      id: uuid(),
      type: "vasathi",
      question: "Select Vasathi",
      options: [],
      required: false
    })

  const addUpavasathi = () =>
    addQuestion({
      id: uuid(),
      type: "upavasathi",
      question: "Select Upavasathi",
      options: [],
      required: false
    })

  // -----------------------------
  // DELETE
  // -----------------------------

  const deleteQuestion = (id: string) => {

    if (!isSectionMode) {
      setQuestions(prev => prev.filter(q => q.id !== id))
    } else {

      setSections(prev =>
        prev.map(section => ({
          ...section,
          questions: section.questions.filter(q => q.id !== id)
        }))
      )

    }
  }

  // -----------------------------
  // DUPLICATE
  // -----------------------------

  const duplicateQuestion = (q: Question) => {
    const newQ = { ...q, id: uuid() }
    addQuestion(newQ)
  }

  // -----------------------------
  // UPDATE
  // -----------------------------

  const updateQuestion = (id: string, data: Partial<Question>) => {

    if (!isSectionMode) {

      setQuestions(prev =>
        prev.map(q =>
          q.id === id
            ? { ...q, ...data, rows: data.rows ?? q.rows, columns: data.columns ?? q.columns }
            : q
        )
      )

    } else {

      setSections(prev =>
        prev.map(section => ({
          ...section,
          questions: section.questions.map(q =>
            q.id === id
              ? { ...q, ...data, rows: data.rows ?? q.rows, columns: data.columns ?? q.columns }
              : q
          )
        }))
      )

    }
  }

  // -----------------------------
  // PREVIEW
  // -----------------------------

  const openPreview = () => {

    const query = new URLSearchParams({
      title,
      description,
      questions: JSON.stringify(questions),
      sections: JSON.stringify(sections),
      theme: JSON.stringify(theme)
    })

    window.open(`/preview?${query.toString()}`, "_blank")
  }

  // -----------------------------
  // SAVE FORM
  // -----------------------------

  const saveForm = async () => {

    const payload = {
      title,
      description,
      theme,
      sections: isSectionMode
        ? sections
        : questions.length > 0
        ? [{ id: uuid(), title: "Section 1", questions }]
        : []
    }

    try {

      const res = await fetch("/api/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.formId) {

        const link = `${window.location.origin}/form/${data.formId}`
        setFormLink(link)

      } else {

        alert("Error saving form. Try again.")

      }

    } catch (err) {

      console.error(err)
      alert("Failed to save form. Check console.")

    }
  }

  const copyLink = () => {

    if (!formLink) return alert("No link generated yet")

    navigator.clipboard.writeText(formLink)
    alert("Link copied!")

  }
  const sanghaTypes = ["vibhag", "bhag", "nagar", "vasathi", "upavasathi"]

  // -----------------------------
  // RENDER
  // -----------------------------

  return (

    <div style={{ display: "flex", minHeight: "100vh", background: theme.backgroundColor }}>

      {/* NORMAL COMPONENT PANEL */}

      <ComponentPanel
        addTextField={addTextField}
        addRadioButton={addRadioButton}
        addCheckbox={addCheckbox}
        addDropdown={addDropdown}
        addDate={addDate}
        addTime={addTime}
        addRating={addRating}
        addMatrix={addMatrix}
        addSection={addSection}
      />

      {/* SANGH COMPONENT PANEL */}

      <SanghComponentPanel
        addVibhag={addVibhag}
        addBhag={addBhag}
        addNagar={addNagar}
        addVasathi={addVasathi}
        addUpavasathi={addUpavasathi}
      />

      {/* FORM AREA */}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "40px",
          fontFamily: fontMap[theme.textFont]
        }}
      >

        <div style={{ width: "700px" }}>

          <FormHeader
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
            onPreview={openPreview}
            onThemeClick={() => setShowTheme(true)}
            style={{ color: theme.primaryColor, fontFamily: fontMap[theme.headerFont] }}
            theme={theme}
          />

          {/* NORMAL MODE */}

         

{!isSectionMode &&
  questions.map(q =>
    sanghaTypes.includes(q.type) ? (
      <SanghaQuestionCard
        key={q.id}
        question={q}
        onDelete={() => deleteQuestion(q.id)}
        onDuplicate={() => duplicateQuestion(q)}
        onUpdate={data => updateQuestion(q.id, data)}
        theme={theme}
      />
    ) : (
      <QuestionCard
        key={q.id}
        question={q}
        onDelete={() => deleteQuestion(q.id)}
        onDuplicate={() => duplicateQuestion(q)}
        onUpdate={data => updateQuestion(q.id, data)}
        theme={theme}
      />
    )
  )}

          {/* SECTION MODE */}

          {isSectionMode &&
            sections.map(section => (
              <div key={section.id} style={{ marginBottom: "30px" }}>
                <div style={{ fontWeight: 600, marginBottom: "10px", fontSize: "18px" }}>
                  {section.title}
                </div>

               {section.questions.map(q =>
  sanghaTypes.includes(q.type) ? (
    <SanghaQuestionCard
      key={q.id}
      question={q}
      onDelete={() => deleteQuestion(q.id)}
      onDuplicate={() => duplicateQuestion(q)}
      onUpdate={data => updateQuestion(q.id, data)}
      theme={theme}
    />
  ) : (
    <QuestionCard
      key={q.id}
      question={q}
      onDelete={() => deleteQuestion(q.id)}
      onDuplicate={() => duplicateQuestion(q)}
      onUpdate={data => updateQuestion(q.id, data)}
      theme={theme}
    />
  )
)}
              </div>
            ))}

          {/* EMPTY STATE */}

          {!isSectionMode && questions.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
              Click a component to add your first question
            </div>
          )}

          {/* SAVE BUTTON */}

          <div style={{ display: "flex", gap: "14px", marginTop: "20px" }}>

            <button
              onClick={saveForm}
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: theme.primaryColor,
                color: "white"
              }}
            >
              Save Form
            </button>

            {formLink && (
              <>
                <input
                  value={formLink}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc"
                  }}
                />

                <button
                  onClick={copyLink}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: "#444",
                    color: "white"
                  }}
                >
                  Copy Link
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {showTheme && (
        <ThemePanel
          theme={theme}
          setTheme={setTheme}
          onClose={() => setShowTheme(false)}
        />
      )}

    </div>
  )
}