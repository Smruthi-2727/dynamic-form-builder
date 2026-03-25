import mongoose, { Schema, models, model } from "mongoose"

// ✅ QUESTION SCHEMA (same as before)
const QuestionSchema = new Schema({
  id: String,
  type: String,
  question: String,
  placeholder: String,

  options: {
    type: [String],
    default: []
  },

  rows: {
    type: [String],
    default: []
  },

  columns: {
    type: [String],
    default: []
  },

  required: {
    type: Boolean,
    default: false
  },

  dateFormat: String
})

// ✅ NEW — SECTION SCHEMA
const SectionSchema = new Schema({
  id: String,
  title: String,

  questions: {
    type: [QuestionSchema],
    default: []
  }
})

// ✅ UPDATED FORM SCHEMA
const FormSchema = new Schema({
  title: String,
  description: String,

  // ❌ OLD (REMOVE THIS)
  // questions: [QuestionSchema],

  // ✅ NEW
  sections: {
    type: [SectionSchema],
    default: []
  },

  theme: {
    headerFont: String,
    questionFont: String,
    textFont: String,
    primaryColor: String,
    backgroundColor: String,
    headerImage: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Form = models.Form || model("Form", FormSchema)

export default Form