import * as React from "react"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:opacity-90 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}