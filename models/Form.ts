import mongoose, { Schema, models, model } from "mongoose"

const QuestionSchema = new Schema({
  id: String,
  type: String,
  question: String,
  placeholder: String,
  options: [String],
  required: Boolean,
  dateFormat: String   
})

const FormSchema = new Schema({
  title: String,
  description: String,
  questions: [QuestionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Form = models.Form || model("Form", FormSchema)

export default Form