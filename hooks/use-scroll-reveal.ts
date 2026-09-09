"use client"

import { useEffect } from "react"

// Shared IntersectionObserver behind the .reveal-up / .reveal-fade /
// .reveal-scale classes (app/globals.css) — previously copy-pasted per page.
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    document
      .querySelectorAll(".reveal-up, .reveal-fade, .reveal-scale")
      .forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
