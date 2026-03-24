# Personal Knowledge Base Agent

A powerful RAG (Retrieval-Augmented Generation) application that allows you to upload documents and interact with them through natural language conversations. Built with Next.js, ChromaDB, and OpenRouter AI.

## 🌟 Features

- **Document Upload**: Upload PDF, Markdown, and text files to your personal knowledge base
- **Multiple Knowledge Bases**: Create and manage multiple knowledge bases for different topics
- **Conversational Interface**: Ask questions and get answers based on your uploaded documents
- **Chat History**: All conversations are automatically saved and can be revisited
- **Document References**: Responses include citations to source documents
- **Re-indexing**: Refresh your knowledge base when documents are updated
- **Streaming Responses**: See AI responses as they're being generated
- **Document Preview**: Preview source documents directly in the app

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Vector Database**: ChromaDB
- **AI Model**: OpenRouter API (supports multiple LLM providers)
- **Document Processing**: pdf-parse, LangChain text splitters
- **Storage**: LocalStorage for chat history

## 📋 Prerequisites

- Node.js 18+ and npm
- ChromaDB account (for vector storage)
- OpenRouter API key (for AI model access)

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/personal-knowledge-agent.git
cd personal-knowledge-agent

Install dependencies:

bash
npm install
Create a .env.local file in the root directory:

env
OPENROUTER_API_KEY=your_openrouter_api_key_here
MODEL_NAME=openai/gpt-3.5-turbo
CHROMA_API_KEY=your_chroma_api_key_here
CHROMA_TENANT=your_chroma_tenant_id
CHROMA_DATABASE=knowledge-agent
Run the development server:

bash
npm run dev
Open http://localhost:3000 in your browser

📖 Usage Guide
1. Create a New Chat
Click the "+ New Chat" button in the sidebar

A new chat with a default knowledge base will be created

2. Upload Documents
Select a knowledge base from the dropdown

Drag and drop files or click "Browse Files" to upload

Supported formats: PDF, Markdown (.md), Text files (.txt)

Files will be processed and stored in your knowledge base

3. Ask Questions
Type your question in the input field

Press Enter or click "Send"

The AI will search your documents and provide an answer

Responses include citations to source documents

4. Manage Chats
Switch between different chats using the sidebar

Each chat maintains its own conversation history

Delete chats using the 🗑 button

5. Re-index Knowledge Base
Click the "Re-index" button to refresh your knowledge base

Useful when documents have been updated or added

🏗️ Project Structure

personal-knowledge-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.js      # Chat API endpoint
│   │   │   ├── upload/route.js    # File upload endpoint
│   │   │   └── reindex/route.js   # Re-indexing endpoint
│   │   └── page.js                 # Main page
│   ├── components/
│   │   ├── Sidebar.jsx             # Chat sidebar
│   │   ├── ChatInterface.jsx       # Main chat interface
│   │   └── UploadDocuments.jsx     # Document upload component
│   └── styles/
│       └── upload.css              # Upload styles
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── package.json
└── README.md


🔌 API Endpoints
POST /api/upload
Upload documents to the knowledge base

Body: multipart/form-data with file, chatId, kbId

Response: { success: true, file: {...}, chunks: number }

POST /api/chat
Query the knowledge base

Body: { message, chatId, kbId, history }

Response: { success: true, answer, sources, document }

POST /api/reindex
Re-index a knowledge base

Body: { chatId, kbId }

Response: { success: true, documentsReindexed: number }

🎨 Customization
Changing Colors
Modify the color scheme in the component files. Current colors:

Primary background: #a7d2c7

Darker accent: #3e8e7e

Darkest accent: #2e6e62

Adding File Types
Update the accept attribute in UploadDocuments.jsx:

jsx
accept=".pdf,.txt,.md,.docx,application/pdf,text/plain,text/markdown"
Changing AI Model
Update the MODEL_NAME in .env.local:

env
MODEL_NAME=openai/gpt-4  # or other OpenRouter supported models
🐛 Troubleshooting
API Key Issues
Ensure .env.local file exists in the root directory

Restart the development server after adding environment variables

Check that API keys are valid and have sufficient credits

Upload Errors
Verify file formats are supported

Check ChromaDB connection and credentials

Ensure knowledge base is selected before uploading

Chat Not Responding
Make sure a knowledge base is selected

Check that documents have been uploaded and processed

Verify OpenRouter API key and model name

📝 License
MIT License - feel free to use and modify for your own projects

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📧 Support
For issues or questions, please open an issue on GitHub or contact the maintainer.

Built with ❤️ using Next.js, ChromaDB, and OpenRouter


```
