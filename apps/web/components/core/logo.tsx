import Link from 'next/link'
import React from 'react'

export const Logo = () => {
  return (
    <Link href="/">Blue Print</Link>
  )
}

export const CompanyLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <circle cx="6" cy="12" r="3" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="18" cy="12" r="3" />
  </svg>
)