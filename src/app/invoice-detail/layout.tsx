// app/invoice-detail/layout.tsx
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoice Detail | My App',
}

export default function InvoiceDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}