export type Question = {
  id: string

  type:
    | "text"
    | "radio"
    | "checkbox"
    | "dropdown"
    | "date"
    | "time"
    | "rating"
    | "matrix"
    | "vibhag"
    | "bhag"
    | "nagar"
    | "vasathi"
    | "upavasathi"

  question: string
  placeholder?: string
  options?: string[]
  required: boolean

  dateFormat?: "dd-mm-yyyy" | "mm-yyyy" | "yyyy"

  rows?: string[]
  columns?: string[]
  answer?: string
}

export type FormButton = {
  id: string
  type: "submit" | "cancel"
}


// ✅ Section type
export type Section = {
  id: string
  title: string
  questions: Question[]
}


// ✅ Form type
export type Form = {
  title: string
  description: string
  sections: Section[]

  theme?: {
    primaryColor: string
    backgroundColor: string
    headerFont: string
    questionFont: string
    textFont: string
    
  }
}