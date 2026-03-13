import mongoose from "mongoose"
import Form from "@/models/Form"
import FormRenderer from "@/app/components/FormRenderer"

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {

  const { id } = await params

  await mongoose.connect(process.env.MONGODB_URI!)

  const form = await Form.findById(id).lean()

  if (!form) {
    return <div>Form not found</div>
  }

  const safeForm = JSON.parse(JSON.stringify(form))

  return <FormRenderer form={safeForm} />
}