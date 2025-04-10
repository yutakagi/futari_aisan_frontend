// import type React from "react"
// import "../globals.css"
// import type { Metadata } from "next"



// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="ja" suppressHydrationWarning>
//       <body suppressHydrationWarning>{children}</body>
//     </html>
//   )
// }

import React from "react"
import "../globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}