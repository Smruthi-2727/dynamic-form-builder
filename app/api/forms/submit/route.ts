import mongoose from "mongoose"
import FormResponse from "@/models/FormResponse"

export async function POST(req: Request) {

  await mongoose.connect(process.env.MONGODB_URI!)

  const body = await req.json()

  const response = await FormResponse.create({
    formId: body.formId,
    answers: body.answers
  })

  return Response.json({
    success: true,
    responseId: response._id
  })
}