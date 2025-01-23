import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "./clsx";

//----- cn -----//
// cn est une fonction pour fusionner les classes CSS //

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
