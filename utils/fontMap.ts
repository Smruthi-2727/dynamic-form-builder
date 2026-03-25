export const fontMap = {
  Roboto: "Roboto, sans-serif",
  Poppins: "Poppins, sans-serif",
  Inter: "Inter, sans-serif",
  Lato: "Lato, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  Oswald: "Oswald, sans-serif",
  Raleway: "Raleway, sans-serif",
  Nunito: "Nunito, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Verdana: "Verdana, Geneva, sans-serif",
  Tahoma: "Tahoma, Geneva, sans-serif",
  Georgia: "Georgia, serif",
  "Times New Roman": "'Times New Roman', Times, serif",
  "Courier New": "'Courier New', Courier, monospace"
} as const;

export type FontKey = keyof typeof fontMap;