import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from "crypto"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const genId = () => {
  return randomBytes(3).toString('hex')
}