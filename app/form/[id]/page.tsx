import mongoose from "mongoose"
import Form from "@/models/Form"
import FormRenderer from "@/app/components/FormRenderer"

type Props = {
  params: { id: string } | Promise<{ id: string }>
}

export default async function Page(props: Props) {
  // ✅ unwrap params if it's a Promise
  const { id } = await props.params

  // ✅ Connect to MongoDB only if not connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!)
  }

  const form = await Form.findById(id).lean()

  if (!form) {
    return <div>Form not found</div>
  }

  // Convert mongoose document to plain object
  const safeForm = JSON.parse(JSON.stringify(form))

  // ✅ SUPPORT OLD SINGLE-PAGE FORMS
  if (!safeForm.sections) {
    safeForm.sections = [
      {
        id: "default",
        title: "Section 1",
        questions: safeForm.questions || []
      }
    ]
  }

  return (
    <FormRenderer
      form={safeForm}
      theme={
        safeForm.theme || {
          primaryColor: "#673ab7",
          backgroundColor: "#ede7f6",
          headerFont: "Roboto",
          textFont: "Roboto"
        }
      }
    />
  )
}