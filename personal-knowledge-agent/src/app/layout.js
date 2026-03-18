// app/layout.js
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import "./upload.css";

export const metadata = {
  title: "Personal Knowledge Base Agent",
  description: "RAG Agent built with Next.js and OpenRouter AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar always visible */}
        <Sidebar />

        {/* Main content */}
        <main style={{ flex: 1, padding: "20px", background: "#f7f7f7" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
