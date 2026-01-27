"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
    children: ReactNode
    className?: string
    variant?: "up" | "left" | "right" | "scale" | "stagger"
    delay?: number
    threshold?: number
    once?: boolean
}

export function ScrollReveal({
    children,
    className,
    variant = "up",
    delay = 0,
    threshold = 0.1,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.classList.add("revealed")
                    }, delay)
                    if (once) {
                        observer.unobserve(element)
                    }
                } else if (!once) {
                    element.classList.remove("revealed")
                }
            },
            { threshold, rootMargin: "0px 0px -50px 0px" }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [delay, threshold, once])

    const variantClass = {
        up: "reveal",
        left: "reveal-left",
        right: "reveal-right",
        scale: "reveal-scale",
        stagger: "reveal-stagger",
    }[variant]

    return (
        <div ref={ref} className={cn(variantClass, className)}>
            {children}
        </div>
    )
}
