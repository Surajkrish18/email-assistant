"use client"

import { useState, useCallback } from "react"

interface UseCopyToClipboardResult {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  reset: () => void
}

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return true
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)

        if (successful) {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          return true
        }
        return false
      }
    } catch (error) {
      console.error("Failed to copy:", error)
      setCopied(false)
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return { copy, copied, reset }
}
