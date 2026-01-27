"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    once?: boolean
}

export function useScrollReveal<T extends HTMLElement>({
    threshold = 0.1,
    rootMargin = "0px",
    once = true,
}: UseScrollRevealOptions = {}) {
    const ref = useRef<T>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true)
                    if (once) {
                        observer.unobserve(element)
                    }
                } else if (!once) {
                    setIsRevealed(false)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [threshold, rootMargin, once])

    return { ref, isRevealed }
}

/**
 * Hook to reveal multiple elements with stagger effect
 */
export function useScrollRevealAll(selector: string, options: UseScrollRevealOptions = {}) {
    const { threshold = 0.1, rootMargin = "0px", once = true } = options

    useEffect(() => {
        const elements = document.querySelectorAll(selector)

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed")
                        if (once) {
                            observer.unobserve(entry.target)
                        }
                    } else if (!once) {
                        entry.target.classList.remove("revealed")
                    }
                })
            },
            { threshold, rootMargin }
        )

        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [selector, threshold, rootMargin, once])
}
