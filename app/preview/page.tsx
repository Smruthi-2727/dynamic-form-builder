"use client";

import { useSearchParams } from "next/navigation";
import FormRenderer from "../components/FormRenderer";
import { fontMap } from "../../utils/fontMap";

export default function PreviewPage() {
  const params = useSearchParams();

  // --- Form basic info ---
  const formTitle = params.get("title") || "Untitled Form";
  const formDescription = params.get("description") || "";

  // --- Parse questions safely ---
  let questions: any[] = [];
  try {
    const q = params.get("questions");
    if (q) questions = JSON.parse(decodeURIComponent(q));
  } catch (err) {
    console.error("Invalid questions JSON", err);
  }

  // --- Parse sections safely ---
  let sections: any[] | undefined = undefined;
  try {
    const s = params.get("sections");
    if (s) sections = JSON.parse(decodeURIComponent(s));
  } catch (err) {
    console.error("Invalid sections JSON", err);
  }

  // --- Parse theme safely ---
  let theme: any = {
    headerFont: "Roboto",
    textFont: "Roboto",
    primaryColor: "#673ab7",
    backgroundColor: "#ede7f6",
    headerImage: "",
  };
  try {
    const t = params.get("theme");
    if (t) theme = JSON.parse(decodeURIComponent(t));
  } catch (err) {
    console.error("Invalid theme JSON", err);
  }

  // --- Determine sections for FormRenderer ---
  const finalSections =
    sections && sections.length > 0
      ? sections
      : questions.length > 0
      ? [
          {
            id: "default",
            title: "Default Section",
            questions,
          },
        ]
      : [];

  // --- Font key for TS-safe indexing ---
  const textFontKey = theme.textFont as keyof typeof fontMap;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.backgroundColor,
        padding: "40px",
        fontFamily: fontMap[textFontKey] || "sans-serif",
      }}
    >
      <FormRenderer
        form={{
          title: formTitle,
          description: formDescription,
          sections: finalSections,
        }}
        theme={theme}
        initialSection={0}
        initialAnswers={{}}
        isPreview={true}      // enables preview mode
        disableSubmit={true}  // disables submit button in both single/multi-step
      />
    </div>
  );
}