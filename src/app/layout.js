import "./globals.css"
import LayoutWrapper from "./layoutWrapper"

export const metadata = {
  title: "เว็บไซต์เเนะนำการท่องเที่ยว",
  description: "Generated by create next app"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
