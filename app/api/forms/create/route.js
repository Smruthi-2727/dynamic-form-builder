import Form from "@/models/Form"
import mongoose from "mongoose"

export async function POST(req) {

  await mongoose.connect(process.env.MONGODB_URI)

  const body = await req.json()

  const form = await Form.create(body)

  return Response.json({
    success: true,
    formId: form._id
  })
}