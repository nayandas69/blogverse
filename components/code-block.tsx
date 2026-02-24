"use client"

import React, { useState } from "react"
import { Check, Copy } from "lucide-react"
import type { ComponentProps } from "react"

/**
 * Token types for syntax highlighting
 */
type TokenType = 'comment' | 'string' | 'keyword' | 'number' | 'function' | 'operator' | 'punctuation' | 'plain'

interface Token {
    type: TokenType
    value: string
}

/**
 * Simple tokenizer for code - processes code into tokens without nested replacements
 */
function tokenize(code: string): Token[] {
    const tokens: Token[] = []
    let remaining = code

    const keywords = new Set([
        'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
        'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends',
        'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch',
        'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'true', 'false',
        'null', 'undefined', 'interface', 'type', 'string', 'number', 'boolean'
    ])

    while (remaining.length > 0) {
        let matched = false

        // Single-line comment
        if (remaining.startsWith('//')) {
            const end = remaining.indexOf('\n')
            const value = end === -1 ? remaining : remaining.slice(0, end)
            tokens.push({ type: 'comment', value })
            remaining = end === -1 ? '' : remaining.slice(end)
            matched = true
        }
        // Multi-line comment
        else if (remaining.startsWith('/*')) {
            const end = remaining.indexOf('*/', 2)
            const value = end === -1 ? remaining : remaining.slice(0, end + 2)
            tokens.push({ type: 'comment', value })
            remaining = end === -1 ? '' : remaining.slice(end + 2)
            matched = true
        }
        // Double-quoted string
        else if (remaining[0] === '"') {
            let i = 1
            while (i < remaining.length && (remaining[i] !== '"' || remaining[i - 1] === '\\')) i++
            const value = remaining.slice(0, i + 1)
            tokens.push({ type: 'string', value })
            remaining = remaining.slice(i + 1)
            matched = true
        }
        // Single-quoted string
        else if (remaining[0] === "'") {
            let i = 1
            while (i < remaining.length && (remaining[i] !== "'" || remaining[i - 1] === '\\')) i++
            const value = remaining.slice(0, i + 1)
            tokens.push({ type: 'string', value })
            remaining = remaining.slice(i + 1)
            matched = true
        }
        // Template literal
        else if (remaining[0] === '`') {
            let i = 1
            while (i < remaining.length && (remaining[i] !== '`' || remaining[i - 1] === '\\')) i++
            const value = remaining.slice(0, i + 1)
            tokens.push({ type: 'string', value })
            remaining = remaining.slice(i + 1)
            matched = true
        }
        // Numbers
        else if (/^\d/.test(remaining)) {
            const match = remaining.match(/^\d+\.?\d*/)
            if (match) {
                tokens.push({ type: 'number', value: match[0] })
                remaining = remaining.slice(match[0].length)
                matched = true
            }
        }
        // Identifiers and keywords
        else if (/^[a-zA-Z_$]/.test(remaining)) {
            const match = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)
            if (match) {
                const value = match[0]
                // Check if followed by ( for function call
                const isFunction = remaining[value.length] === '('
                if (keywords.has(value)) {
                    tokens.push({ type: 'keyword', value })
                } else if (isFunction) {
                    tokens.push({ type: 'function', value })
                } else {
                    tokens.push({ type: 'plain', value })
                }
                remaining = remaining.slice(value.length)
                matched = true
            }
        }
        // Operators
        else if (/^[+\-*/%=<>!&|^~?:]+/.test(remaining)) {
            const match = remaining.match(/^[+\-*/%=<>!&|^~?:]+/)
            if (match) {
                tokens.push({ type: 'operator', value: match[0] })
                remaining = remaining.slice(match[0].length)
                matched = true
            }
        }
        // Punctuation
        else if (/^[(){}[\];,.]/.test(remaining)) {
            tokens.push({ type: 'punctuation', value: remaining[0] })
            remaining = remaining.slice(1)
            matched = true
        }

        // If nothing matched, take one character as plain
        if (!matched) {
            tokens.push({ type: 'plain', value: remaining[0] })
            remaining = remaining.slice(1)
        }
    }

    return tokens
}

/**
 * Get CSS class for token type
 */
function getTokenClass(type: TokenType): string {
    const classes: Record<TokenType, string> = {
        comment: 'text-gray-500 italic',
        string: 'text-green-400',
        keyword: 'text-purple-400',
        number: 'text-orange-400',
        function: 'text-blue-400',
        operator: 'text-cyan-400',
        punctuation: 'text-gray-400',
        plain: 'text-gray-200',
    }
    return classes[type]
}

/**
 * Render highlighted code as React elements
 */
function highlightCode(code: string): React.ReactNode {
    const tokens = tokenize(code)

    return tokens.map((token, index) => (
        <span key={index} className={getTokenClass(token.type)}>
            {token.value}
        </span>
    ))
}

/**
 * Code Block Component with Syntax Highlighting and Copy Button
 */
export function CodeBlock({ children, className, ...props }: ComponentProps<"pre"> & { children?: React.ReactNode }) {
    const [copied, setCopied] = useState(false)

    // Extract code content - MDX wraps code in <code> element
    let code = ''
    let language = ''

    // Check if children is a code element
    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
            // Get language from code element's className
            const childClassName = (child.props as { className?: string })?.className || ''
            if (childClassName.includes('language-')) {
                language = childClassName.replace('language-', '')
            }
            // Get the actual code content
            const childContent = (child.props as { children?: React.ReactNode })?.children
            if (typeof childContent === 'string') {
                code = childContent
            }
        } else if (typeof child === 'string') {
            code = child
        }
    })

    // If no code found from children, use className for language hint
    if (!language && className?.includes('language-')) {
        language = className.replace('language-', '')
    }

    const handleCopy = async () => {
        if (code) {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="code-block-wrapper my-4 rounded-lg overflow-hidden border border-gray-800">
            {/* Header with language and copy button */}
            <div className="flex items-center justify-between bg-gray-900 px-4 py-3 border-b border-gray-800">
                {language && (
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {language}
                    </span>
                )}
                {!language && <div />}
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 p-2 rounded-md bg-gray-800/60 hover:bg-gray-700/60 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    aria-label={copied ? "Copied!" : "Copy code"}
                    title={copied ? "Copied!" : "Copy code"}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <pre
                className="bg-gray-950 overflow-x-auto p-4 text-sm leading-relaxed"
                {...props}
            >
                <code className="block">
                    {code ? highlightCode(code) : children}
                </code>
            </pre>
        </div>
    )
}
