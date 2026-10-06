import { Be_Vietnam_Pro, Lora, Playfair_Display } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bevn",
  display: "swap",
});

export const fontVars = `${playfair.variable} ${lora.variable} ${beVietnam.variable}`;
