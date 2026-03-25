"use client";

import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic";

const DatePicker = dynamic(
  () => import("@mui/x-date-pickers/DatePicker").then((mod) => mod.DatePicker),
  { ssr: false }
);

const TimePicker = dynamic(
  () => import("@mui/x-date-pickers/TimePicker").then((mod) => mod.TimePicker),
  { ssr: false }
);
import dayjs from "dayjs";
import { fontMap, FontKey } from "../../utils/fontMap";

interface FormRendererProps {
  form: any;
  theme: any;
  initialAnswers?: any;
  initialSection?: number;
  isPreview?: boolean;
  disableSubmit?: boolean;
}

export default function FormRenderer({
  form,
  theme,
  initialAnswers = {},
  initialSection = 0,
  isPreview = false,
}: FormRendererProps) {
  const [answers, setAnswers] = useState<any>(initialAnswers);
  const [otherInputs, setOtherInputs] = useState<any>({});
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [dynamicOptions, setDynamicOptions] = useState<any>({});
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  const sections = form.sections || [
    { id: "default", title: "Section 1", questions: form.questions || [] },
  ];

  const currentQuestions = sections[currentSection]?.questions || [];

  const handleChange = (id: string, value: any) => {
    setAnswers((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleOtherChange = (id: string, value: string) => {
    setOtherInputs((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id: string, option: string, checked: boolean) => {
    const prev = answers[id] || [];
    if (checked) {
      setAnswers({
        ...answers,
        [id]: [...prev, option],
      });
    } else {
      setAnswers({
        ...answers,
        [id]: prev.filter((v: string) => v !== option),
      });
    }
  };

  
 const fetchOptions = async (question: any, parentId?: string) => {
  const map: any = {
    vibhag: "Vibhag",
    bhag: "Bhag",
    nagar: "Taluku",
    vasathi: "Mandala",
    upavasathi: "Grama",
  };

  const sthara = question.collection || map[question.type];
  if (!sthara) return;

  
  let cleanParentId = parentId;

  if (cleanParentId && cleanParentId.includes("|")) {
    cleanParentId = cleanParentId.split("|")[1];
  }

  let url = `/api/entities?sthara=${encodeURIComponent(sthara)}`;
  if (cleanParentId) {
    url += `&parentId=${encodeURIComponent(cleanParentId)}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    
    const formatted = data.map((item: any) => ({
      label: item.name,
      value: item._id,
    }));

    setDynamicOptions((prev: any) => ({
      ...prev,
      [question.id]: formatted,
    }));
  } catch (err) {
    console.error("Error fetching options:", err);
    setDynamicOptions((prev: any) => ({
      ...prev,
      [question.id]: [],
    }));
  }
};

 
useEffect(() => {
  currentQuestions.forEach((q: any) => {

    
    if (q.type === "vibhag") {
      fetchOptions(q)
    }

    
    if (q.type === "dropdown" && !q.parentQuestionId) {
      fetchOptions(q)
    }

  })
}, [currentSection])
  
useEffect(() => {
  const parentMap: any = {
    bhag: "vibhag",
    nagar: "bhag",
    vasathi: "nagar",
    upavasathi: "vasathi",
  };

  currentQuestions.forEach((q: any) => {
    const parentType = parentMap[q.type];

    if (!parentType) return;

    const parentQuestion = currentQuestions.find(
      (pq: any) => pq.type === parentType
    );

    if (!parentQuestion) return;

    let parentValue = answers[parentQuestion.id];

    if (parentValue && typeof parentValue === "string" && parentValue.includes("|")) {
      parentValue = parentValue.split("|")[1];
    }

    if (parentValue) {
      fetchOptions(q, parentValue);
    }
  });

}, [answers]); 

  const goToNextSection = () => {
    if (!isPreview) {
      for (const q of currentQuestions) {
        const value = answers[q.id];
        if (
          q.required &&
          (value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0))
        ) {
          alert(`${q.question} is required`);
          return;
        }
      }
    }
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitResponse = async () => {
    if (!isPreview) {
      for (const q of currentQuestions) {
        const value = answers[q.id];
        if (
          q.required &&
          (value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0))
        ) {
          alert(`${q.question} is required`);
          return;
        }
      }

      const finalAnswers: any = { ...answers };
      for (const key in otherInputs) {
        if (answers[key] === "Other") {
          finalAnswers[key] = otherInputs[key];
        }
        if (Array.isArray(answers[key]) && answers[key].includes("Other")) {
          finalAnswers[key] = answers[key].map((v: string) =>
            v === "Other" ? otherInputs[key] : v
          );
        }
      }

      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form._id,
          answers: finalAnswers,
        }),
      });

      alert("Response submitted!");
    }
  };

  const textFont = theme?.textFont as keyof typeof fontMap;
  const isCurrentSectionValid = () => {
    for (const q of currentQuestions) {
      const value = answers[q.id];
      if (
        q.required &&
        (value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0))
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          background: theme?.backgroundColor || "#ede7f6",
          minHeight: "100vh",
          paddingTop: "40px",
          fontFamily: fontMap[textFont] || "sans-serif",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              marginBottom: "20px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                height: "8px",
                background: theme?.primaryColor || "#673ab7",
              }}
            />
            <div style={{ padding: "30px" }}>
              <h1
                style={{
                  fontSize: "28px",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontFamily: fontMap[theme?.headerFont as FontKey] || "sans-serif",
                }}
              >
                {form.title}
              </h1>
              <p
                style={{
                  color: "#666",
                  fontSize: "15px",
                  fontFamily: fontMap[theme?.headerFont as FontKey] || "sans-serif",
                }}
              >
                {form.description}
              </p>
            </div>
          </div>

        
          {currentQuestions.map((q: any) => {
            const format = q.dateFormat || "dd-mm-yyyy";
            return (
              <div
                key={q.id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  {q.question} {q.required && <span style={{ color: "red" }}>*</span>}
                </label>

                
                {q.type === "text" && (
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}

                
                {q.type === "radio" && (
                  <div>
                    {q.options?.map((opt: string, i: number) => (
                      <div key={i} style={{ marginBottom: "8px" }}>
                        <label>
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleChange(q.id, opt)}
                            style={{ marginRight: "8px" }}
                          />
                          {opt}
                        </label>

                        {opt === "Other" && answers[q.id] === "Other" && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={otherInputs[q.id] || ""}
                            onChange={(e) => handleOtherChange(q.id, e.target.value)}
                            style={{
                              marginTop: "6px",
                              marginLeft: "24px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              width: "60%",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                
                {q.type === "checkbox" && (
                  <div>
                    {q.options?.map((opt: string, i: number) => (
                      <div key={i} style={{ marginBottom: "8px" }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={(answers[q.id] || []).includes(opt)}
                            onChange={(e) =>
                              handleCheckboxChange(q.id, opt, e.target.checked)
                            }
                            style={{ marginRight: "8px" }}
                          />
                          {opt}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                
                {(q.type === "dropdown" ||
                  ["vibhag", "bhag", "nagar", "vasathi", "upavasathi"].includes(
                    q.type
                  )) && (
                  <>
                    <select
                      value={answers[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select</option>
                      {(dynamicOptions[q.id] || q.options || []).map((opt: any, i: number) => {
  
  const value =
    typeof opt === "string"
      ? opt.includes("|")
        ? opt.split("|")[1]
        : opt
      : opt.value || opt._id;

  const label =
    typeof opt === "string"
      ? opt.includes("|")
        ? opt.split("|")[0]
        : opt
      : opt.label || opt.name;

  return (
    <option key={i} value={value}>
      {label}
    </option>
  );
})}
                    </select>

                    {answers[q.id] === "Other" && (
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={otherInputs[q.id] || ""}
                        onChange={(e) => handleOtherChange(q.id, e.target.value)}
                        style={{
                          marginTop: "6px",
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          width: "60%",
                        }}
                      />
                    )}
                  </>
                )}

                
               {q.type === "date" && mounted && (
  <DatePicker
    key={q.id}
                    views={
                      format === "yyyy"
                        ? ["year"]
                        : format === "mm-yyyy"
                        ? ["year", "month"]
                        : ["year", "month", "day"]
                    }
                    format={
                      format === "yyyy"
                        ? "YYYY"
                        : format === "mm-yyyy"
                        ? "MM-YYYY"
                        : "DD-MM-YYYY"
                    }
                    value={answers[q.id] ? dayjs(answers[q.id]) : null}
                    onChange={(value) => {
                      if (!value) return;
                      if (format === "yyyy") handleChange(q.id, value.format("YYYY"));
                      else if (format === "mm-yyyy") handleChange(q.id, value.format("YYYY-MM"));
                      else handleChange(q.id, value.format("YYYY-MM-DD"));
                    }}
                  />
                )}

                
              {q.type === "time" && mounted && (
  <TimePicker
    key={q.id}
                    value={answers[q.id] ? dayjs(`2000-01-01T${answers[q.id]}`) : null}
                    onChange={(value) => {
                      if (!value) return;
                      handleChange(q.id, value.format("HH:mm"));
                    }}
                  />
                )}

                
                {q.type === "rating" && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleChange(q.id, star)}
                        style={{
                          fontSize: "28px",
                          cursor: "pointer",
                          color:
                            (answers[q.id] || 0) >= star
                              ? theme?.primaryColor || "#f59e0b"
                              : "#ccc",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}

                
                {q.type === "matrix" && (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th></th>
                        {(q.columns || []).map((col: string, i: number) => (
                          <th key={i} style={{ padding: "8px", textAlign: "center" }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(q.rows || []).map((row: string, rowIndex: number) => (
                        <tr key={rowIndex}>
                          <td style={{ padding: "8px" }}>{row}</td>
                          {(q.columns || []).map((col: string, colIndex: number) => (
                            <td key={colIndex} style={{ textAlign: "center" }}>
                              <input
                                type="radio"
                                name={`${q.id}-${rowIndex}`}
                                value={col}
                                checked={answers[q.id]?.[rowIndex] === col}
                                onChange={() => {
                                  const prev = answers[q.id] || [];
                                  const newAnswers = [...prev];
                                  newAnswers[rowIndex] = col;
                                  handleChange(q.id, newAnswers);
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}

          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
            {currentSection > 0 && (
              <button
                onClick={goToPrevSection}
                style={{
                  padding: "12px 22px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#ccc",
                  color: "white",
                  fontWeight: "500",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
            )}

            {currentSection < sections.length - 1 ? (
              <button
                onClick={goToNextSection}
                disabled={isPreview ? false : !isCurrentSectionValid()}
                style={{
                  padding: "12px 22px",
                  borderRadius: "6px",
                  border: "none",
                  background: isPreview
                    ? theme?.primaryColor || "#673ab7"
                    : !isCurrentSectionValid()
                    ? "#aaa"
                    : theme?.primaryColor || "#673ab7",
                  color: "white",
                  fontWeight: "500",
                  fontSize: "15px",
                  cursor: isPreview ? "pointer" : !isCurrentSectionValid() ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitResponse}
                disabled={isPreview ? true : !isCurrentSectionValid()}
                style={{
                  padding: "12px 22px",
                  borderRadius: "6px",
                  border: "none",
                  background: isPreview
                    ? "#aaa"
                    : !isCurrentSectionValid()
                    ? "#aaa"
                    : theme?.primaryColor || "#673ab7",
                  color: "white",
                  fontWeight: "500",
                  fontSize: "15px",
                  cursor: isPreview ? "not-allowed" : !isCurrentSectionValid() ? "not-allowed" : "pointer",
                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}