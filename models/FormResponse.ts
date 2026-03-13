import mongoose, { Schema, models, model } from "mongoose"

const ResponseSchema = new Schema({

  formId: {
    type: Schema.Types.ObjectId,
    ref: "Form"
  },

  answers: {
    type: Object
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

const FormResponse =
  models.FormResponse || model("FormResponse", ResponseSchema)

export default FormResponse