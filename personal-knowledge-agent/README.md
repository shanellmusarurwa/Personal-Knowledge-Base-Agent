# Personal Knowledge Base Agent

A powerful RAG (Retrieval-Augmented Generation) application that allows you to upload documents and interact with them through natural language conversations. Built with Next.js, ChromaDB, and OpenRouter AI.

## 🌟 Features

- **Document Upload**: Upload PDF, Markdown, and text files to your personal knowledge base
- **Multiple Knowledge Bases**: Create and manage multiple knowledge bases for different topics within each chat
- **Conversational Interface**: Ask questions and get answers based on your uploaded documents
- **Chat History**: All conversations are automatically saved and can be revisited
- **Document References**: Responses include citations to source documents
- **Re-indexing**: Refresh your knowledge base when documents are updated
- **Streaming Responses**: See AI responses as they're being generated
- **Document Preview**: Preview source documents directly in the app
- **Multiple Chats**: Create and switch between different chat sessions
- **Testing Suite**: Built-in testing functionality to validate agent performance
- **Debug Tools**: Inspect saved data and conversation history

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Vector Database**: ChromaDB
- **AI Model**: OpenRouter API (supports multiple LLM providers)
- **Document Processing**: pdf-parse, LangChain text splitters
- **Storage**: LocalStorage for chat history and conversations

## 🔧 How It Works

### Overview

The Personal Knowledge Base Agent operates on a RAG (Retrieval-Augmented Generation) architecture. Here's a step-by-step breakdown of how the system processes your documents and answers questions:

### 1. Document Upload & Processing

User Uploads Document
↓
Document Parsing (PDF/TXT/MD)
↓
Text Extraction
↓
Text Chunking (500 chars with 100 overlap)
↓
Vector Embedding Generation
↓
Storage in ChromaDB

text

**Process Details:**

- **File Support**: The system accepts PDF, Markdown, and plain text files
- **Text Extraction**: For PDFs, it uses `pdf-parse` to extract text; for text files, it reads directly
- **Chunking**: Documents are split into overlapping chunks of 500 characters with 100 character overlap to maintain context
- **Vector Storage**: Each chunk is converted into a vector embedding and stored in ChromaDB with metadata (filename, chat ID, knowledge base ID)

### 2. Knowledge Base Management

Multiple Chats
└── Each Chat has Multiple Knowledge Bases
└── Each KB has Multiple Documents
└── Each Document has Multiple Chunks

text

**Structure:**

- **Chats**: Container for conversations (saved in localStorage)
- **Knowledge Bases**: Isolated document collections within each chat
- **Documents**: Individual files uploaded to a knowledge base
- **Chunks**: Processed segments of documents stored in ChromaDB

### 3. Query Processing Flow

User Question
↓
Question Embedding
↓
Vector Similarity Search
↓
Retrieve Top 5 Relevant Chunks
↓
Context Assembly
↓
LLM Prompt Construction
↓
AI Response Generation
↓
Streaming Response to User
↓
Save Conversation to localStorage

text

### 4. Conversation Management

The application maintains a complete history of all conversations:

- **Per-Chat Storage**: Each chat has its own conversation history
- **Per-Knowledge Base**: Each knowledge base maintains separate conversation threads
- **Automatic Saving**: Every question and answer is automatically saved
- **Persistent Storage**: Conversations survive page refreshes and browser restarts
- **Easy Switching**: Switch between chats and knowledge bases to access different conversations

## 📖 Usage Guide

### 1. Create a New Chat

- Click the **"+ New Chat"** button in the sidebar
- A new chat with a default knowledge base will be created
- Chat titles automatically update based on your first question

### 2. Create Multiple Knowledge Bases

- Click the **"+ New Knowledge Base"** button in the sidebar
- Each knowledge base maintains its own:
  - Document collection
  - Conversation history
  - File uploads
- Switch between knowledge bases using the dropdown in the chat interface

### 3. Upload Documents

- Select a knowledge base from the dropdown
- Drag and drop files or click **"Browse Files"** to upload
- Supported formats: PDF, Markdown (.md), Text files (.txt)
- Files are automatically:
  - Parsed for text content
  - Split into overlapping chunks
  - Converted to vector embeddings
  - Stored in ChromaDB for retrieval

### 4. Ask Questions

- Type your question in the input field
- Press Enter or click **"Send"**
- The system will:
  1. Search your documents for relevant content
  2. Retrieve the most relevant chunks
  3. Generate an answer using AI
  4. Stream the response word-by-word
- Responses include citations to source documents
- All conversations are automatically saved

### 5. Manage Chats

- **Switch Chats**: Click on any chat in the sidebar to switch
- **View Knowledge Bases**: Expand a chat to see all its knowledge bases
- **Delete Chats**: Click the 🗑 button to delete a chat and all its data
- **Chat Information**: Each chat shows:
  - Creation date
  - Number of knowledge bases
  - Number of messages

### 6. Manage Knowledge Bases

- **Switch KB**: Use the dropdown in the chat interface
- **View Documents**: Each KB shows document count
- **KB Information**: Each KB shows number of messages and documents
- **Create Multiple**: Create separate KBs for different topics

### 7. Test Agent Performance

- Click the **"🧪 Run Tests"** button in the header
- Runs 5 pre-defined test questions
- Displays results showing:
  - Which questions passed/failed
  - Retrieved sources
  - Response quality
  - Success rate percentage

### 8. Debug and Inspect

- Click the **"🔍 Debug"** button in the header
- Opens console with detailed information:
  - All saved chats structure
  - Current chat data
  - Current knowledge base messages
  - Message count
- Helps verify that conversations are being saved correctly

### 9. Re-index Knowledge Base

- Click the **"Re-index"** button in the knowledge base selector
- Useful when documents have been updated
- Recreates embeddings for all documents in the collection

## 🎛️ UI Components

### Sidebar

- **+ New Chat**: Create a new chat session
- **+ New Knowledge Base**: Create a new knowledge base within current chat
- **Chat List**: Shows all chats with:
  - Chat title (auto-updates from first message)
  - Creation date
  - Number of knowledge bases
- **Knowledge Bases**: Expandable list showing:
  - KB name
  - Message count
  - Document count
- **Delete Button**: Remove chats and all associated data

### Header

- **RAG AI Assistant**: App title
- **🔍 Debug Button**: Inspect saved data in console
- **🧪 Run Tests Button**: Run automated test suite
  - Shows test progress
  - Displays results modal
  - Validates agent performance

### Chat Interface

- **Knowledge Base Selector**: Dropdown to switch between KBs
- **Message Area**: Scrollable conversation history
- **Input Field**: Type questions with Enter key support
- **Send Button**: Submit questions
- **Loading Indicator**: Shows when AI is thinking
- **Document Preview**: Modal for viewing source documents

### Upload Section

- **Drag & Drop Area**: Upload files by dragging
- **Browse Files Button**: Select files from file system
- **File List**: Shows uploaded files with:
  - File name
  - Upload status
  - Delete button

## 📊 Testing Features

### Automated Testing

- **Run Tests Button**: One-click testing of agent performance
- **Test Questions**: 5 pre-configured questions covering:
  - Account lockout procedures
  - Transaction viewing methods
  - Loan information
  - Card services
  - Account types
- **Results Modal**: Detailed test results showing:
  - Pass/fail status per question
  - Response preview
  - Source documents
  - Overall success rate

### Debug Tools

- **Debug Button**: Inspect localStorage data
- **Console Logging**: Detailed logs for:
  - Message loading
  - Message saving
  - API responses
  - Error handling

## 🔌 API Endpoints

### POST /api/upload

Upload documents to the knowledge base

- **Body**: multipart/form-data with `file`, `chatId`, `kbId`
- **Process**: Parses document → Chunks → Embeds → Stores in ChromaDB
- **Response**: `{ success: true, file: {...}, chunks: number }`

### POST /api/chat

Query the knowledge base

- **Body**: `{ message, chatId, kbId, history }`
- **Process**: Vector search → Context retrieval → LLM prompt → Response streaming
- **Response**: `{ success: true, answer, sources, document }`

### POST /api/reindex

Re-index a knowledge base

- **Body**: `{ chatId, kbId }`
- **Process**: Retrieves all documents → Re-embeds → Updates ChromaDB
- **Response**: `{ success: true, documentsReindexed: number }`

### GET /api/preview

Preview document content

- **Query**: `file`, `chatId`, `kbId`
- **Response**: `{ success: true, filename, content, chunks }`

## 💾 Data Structure

### localStorage Structure

```javascript
{
  "chats": {
    "chat_1234567890": {
      "title": "My Question about Banking",
      "createdAt": 1234567890,
      "knowledgeBases": {
        "kb_1234567890": {
          "title": "My Knowledge Base",
          "messages": [
            { "role": "user", "content": "What are the fees?" },
            { "role": "ai", "content": "The fees are...", "sources": [...] }
          ],
          "documents": [
            { "name": "banking.pdf", "status": "Completed" }
          ],
          "createdAt": 1234567890
        }
      }
    }
  },
  "uploadedFiles_chat_123_kb_456": [...] // File list per KB
}
🧪 Testing
The application includes comprehensive testing capabilities:

Automated Testing: Click the "Run Tests" button to validate agent performance

Debug Mode: Use the "Debug" button to inspect saved data

Manual Testing: Ask questions and verify responses

Performance Metrics: Track success rates and response quality

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
Adjusting Chunk Size
Modify in api/upload/route.js:

javascript
chunkSize: 500,  // Characters per chunk
chunkOverlap: 100 // Overlap between chunks
🐛 Troubleshooting
API Key Issues
Ensure .env.local file exists in the root directory

Restart the development server after adding environment variables

Check that API keys are valid and have sufficient credits

Upload Errors
Verify file formats are supported (PDF, TXT, MD)

Check ChromaDB connection and credentials

Ensure knowledge base is selected before uploading

Check browser console for detailed error messages

Chat Not Responding
Make sure a knowledge base is selected

Check that documents have been uploaded and processed

Verify OpenRouter API key and model name

Check terminal for server-side errors

Chat Titles Not Updating
Titles update automatically after first message

If not updating, refresh the page

Check localStorage for chat data

Use Debug button to inspect saved data

Conversations Not Saving
Check console for saveChat logs

Use Debug button to verify message count

Ensure knowledge base is selected

Check localStorage permissions

📁 Project Structure
text
personal-knowledge-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.js      # Chat API endpoint
│   │   │   ├── upload/route.js    # File upload endpoint
│   │   │   ├── reindex/route.js   # Re-indexing endpoint
│   │   │   └── preview/route.js   # Document preview endpoint
│   │   └── page.js                 # Main page with debug and test buttons
│   ├── components/
│   │   ├── Sidebar.jsx             # Chat and KB management
│   │   ├── ChatInterface.jsx       # Main chat interface with conversation saving
│   │   └── UploadDocuments.jsx     # Document upload component
│   └── styles/
│       └── upload.css              # Upload styles
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── package.json
└── README.md
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
MIT License - feel free to use and modify for your own projects

Built with ❤️ using Next.js, ChromaDB, and OpenRouter

text

This updated README includes:
1. **All new features**: Multiple chats, knowledge bases, conversation saving
2. **Button documentation**: Debug button and Run Tests button
3. **UI Components section**: Detailed explanation of each interface element
4. **Data Structure**: Complete localStorage structure documentation
5. **Testing Features**: Automated testing and debug tools
6. **Troubleshooting**: New section for conversation saving issues
7. **Updated project structure**: Reflecting all new components
```
