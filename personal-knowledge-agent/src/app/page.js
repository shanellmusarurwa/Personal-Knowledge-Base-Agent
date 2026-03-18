import ChatInterface from "@/components/ChatInterface";
import UploadDocuments from "@/components/UploadDocuments";
import "./upload.css";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>RAG AI Assistant</h1>

      {/* Upload Section */}
      <UploadDocuments />

      {/* Chat Section */}
      <ChatInterface />
    </div>
  );
}
