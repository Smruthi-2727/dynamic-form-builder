"use client"

import { Question } from "../types/form"
import { FiCopy, FiTrash2 } from "react-icons/fi"
import { fontMap } from "../../utils/fontMap"
import { useEffect } from "react"

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

export default function SanghaQuestionCard({
  question,
  onDelete,
  onDuplicate,
  onUpdate,
  theme
}: Props) {

  const getFont = () => fontMap[theme.textFont] || "sans-serif"

  useEffect(() => {
    const sanghTypes = ["vibhag", "bhag", "nagar", "vasathi", "upavasathi"]
    if (!sanghTypes.includes(question.type)) return

    const stharaMap: Record<string, string> = {
      vibhag: "Vibhag",
      bhag: "Bhag",
      nagar: "Taluku",
      vasathi: "Mandala",
      upavasathi: "Grama",
    }

    const parentMap: Record<string, string> = {
      bhag: "vibhag",
      nagar: "bhag",
      vasathi: "nagar",
      upavasathi: "vasathi",
    }

    const sthara = stharaMap[question.type]
    const parentType = parentMap[question.type]

    const fetchOptions = () => {
      const parentQuestion = parentType
        ? document.querySelector(`[data-type='${parentType}']`) as HTMLSelectElement
        : null

      let parentId = parentQuestion?.value || ""

      // ✅ Extract MongoDB _id
      if (parentId.includes("|")) {
        parentId = parentId.split("|")[1]
      }

      // ✅ IMPORTANT FIX → don't clear options
      if (parentType && !parentId) {
        return
      }

      let url = `/api/entities?sthara=${encodeURIComponent(sthara)}`
      if (parentId) url += `&parentId=${encodeURIComponent(parentId)}`

      console.log("Fetching:", url)

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Network error: ${res.status}`)
          return res.json()
        })
        .then((data: any[]) => {
          console.log("API DATA:", data)

          if (!Array.isArray(data)) data = []

          const options = data.map(item => `${item.name}|${item._id}`)
          onUpdate({ options })
        })
        .catch(err => {
          console.error("Fetch error:", err)
        })
    }

    fetchOptions()

    // ✅ Listen for parent change
    if (parentType) {
      const parentQuestion = document.querySelector(`[data-type='${parentType}']`) as HTMLSelectElement
      if (parentQuestion) {
        parentQuestion.addEventListener("change", fetchOptions)
        return () => parentQuestion.removeEventListener("change", fetchOptions)
      }
    }

  }, [question.type])

  return (
    <div style={{
      background: "#ffffff",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      fontFamily: getFont()
    }}>

      {/* QUESTION TITLE */}
      <input
        value={question.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Untitled Question"
      />

      {/* ✅ SANGH DROPDOWN */}
      <select
        data-type={question.type}
        value={question.answer || ""}
        onChange={(e) => onUpdate({ answer: e.target.value })}
      >
        <option value="">Select option</option>

        {(question.options || []).map((opt, i) => {
          const [label] = opt.split("|")
          return (
            <option key={i} value={opt}>
              {label}
            </option>
          )
        })}
      </select>

      {/* ACTIONS */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <button onClick={onDuplicate}><FiCopy /></button>
          <button onClick={onDelete}><FiTrash2 /></button>
        </div>
      </div>

    </div>
  )
}