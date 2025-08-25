"use client"

import { redirect } from "next/navigation"

export default function HomeBracketPage() {
  // Redirect to main page since content is now in app/page.tsx
  redirect("/")
}
