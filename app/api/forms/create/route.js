import Form from "@/models/Form";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    // ✅ Reuse MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const body = await req.json();

    // ✅ Handle normal forms (no sections)
    const sections = body.sections || [];

    const formattedSections = sections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      questions: (sec.questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        rows: q.rows || [],
        columns: q.columns || [],
        required: q.required || false,
        dateFormat: q.dateFormat || ""
      }))
    }));

    const form = await Form.create({
      title: body.title,
      description: body.description,
      sections: formattedSections,
      theme: body.theme
    });

    return new Response(
      JSON.stringify({
        success: true,
        formId: form._id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Error creating form:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}