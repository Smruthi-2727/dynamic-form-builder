export type Question = {
  id: string
  type: "text" | "radio" | "checkbox" | "dropdown" | "date" | "time"
  question: string
  placeholder?: string
  options?: string[]
  required: boolean

  
  dateFormat?: "dd-mm-yyyy" | "mm-yyyy" | "yyyy"
}

export type FormButton = {
  id: string
  type: "submit" | "cancel"
}