"use client";
import { useEffect } from "react";

export default function AutoOpenAssistant() {
  useEffect(() => {
    const t = setTimeout(() => {
      const fab =
        document.querySelector<HTMLButtonElement>('[data-ai-fab]') ||
        Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
          (b) =>
            /assistant|chat/i.test(b.getAttribute("aria-label") || "") ||
            /assistant|chat/i.test(b.textContent || "")
        );
      if (fab) fab.click();
    }, 200);
    return () => clearTimeout(t);
  }, []);
  return null;
}
