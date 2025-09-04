import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validates that a mutating request originates from the same origin as the app.
// Strategy: Prefer the Origin header; if absent (e.g., older browsers or some navigations),
// fall back to Referer. If neither header is present, fail closed.
export function isSameOriginRequest(request: Request): boolean {
  try {
    const requestUrl = new URL(request.url)
    const originHeader = request.headers.get('origin')
    if (originHeader) {
      try {
        const originUrl = new URL(originHeader)
        return originUrl.origin === requestUrl.origin
      } catch {
        return false
      }
    }

    const refererHeader = request.headers.get('referer')
    if (refererHeader) {
      try {
        const refererUrl = new URL(refererHeader)
        return refererUrl.origin === requestUrl.origin
      } catch {
        return false
      }
    }

    // No Origin or Referer → treat as cross-origin
    return false
  } catch {
    return false
  }
}
