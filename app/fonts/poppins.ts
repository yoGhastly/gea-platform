import { Poppins } from 'next/font/google'

export const poppins = Poppins({
  weight: ["100", "500", "800", "900"],
  style: ["italic", "normal"],
  subsets: ["latin"]
});
