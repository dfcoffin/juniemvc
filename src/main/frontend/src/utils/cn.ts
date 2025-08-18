import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * Combines multiple class names using clsx and then properly merges Tailwind CSS classes with tailwind-merge
 * This prevents class conflicts in Tailwind
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
