# Anvik: AI Personal Agent

A modern React-based chat application with authentication, inspired by ChatGPT and styled after the Buttermax aesthetic—now branded as **Anvik: AI Personal Agent**.

## Features

- 🔐 **Authentication**: Login and Signup pages with immersive glassmorphism UI
- 💬 **Chat Interface**: ChatGPT-like workspace with hero metrics and history
- 📁 **File Upload**: Attach files to your messages (PDFs uploaded to memory system)
- 📚 **Chat History**: Sidebar with conversation history
- 🌌 **Three.js Canvas**: Animated particle background across every page
- 🎨 **Modern Design**: Dark gradient aesthetic inspired by Buttermax
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔌 **Backend Integration**: Fully connected to ANVIK backend API
- 🛠️ **Tool Integration**: Calendar, Notion, and Email tools support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see [Backend Repository](https://github.com/Pruthviraj-sawant/ANVIK_M1))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```bash
VITE_BACKEND_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Login page (with API integration)
│   │   ├── Signup.jsx         # Signup page (with API integration)
│   │   ├── Chat.jsx           # Main chat interface (with API integration)
│   │   ├── Auth.css           # Authentication styles
│   │   └── Chat.css           # Chat interface styles
│   ├── services/
│   │   └── api.js             # API service layer for backend communication
│   ├── components/
│   │   ├── AuthShowcase.jsx   # Auth showcase component
│   │   ├── ThreeBackground.jsx # 3D background component
│   │   └── ThreeBackground.css
│   ├── App.jsx                # Main app component with routing
│   ├── App.css                # App-level styles
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
├── BACKEND_API_DOCUMENTATION.md # Complete API documentation
└── SETUP_GUIDE.md            # Setup and integration guide
```

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Sign in with your credentials
3. **Start Chatting**: Begin a new conversation or continue from history
4. **Upload Files**: Click the "+" button to attach PDF files (uploaded to memory system)
5. **Manage History**: View, switch between, or delete chat conversations
6. **Use Tools**: The AI can use Calendar, Notion, and Email tools based on your prompts

## Backend Integration

This frontend is fully integrated with the ANVIK backend API. The backend should implement the endpoints documented in `BACKEND_API_DOCUMENTATION.md`.

### Key API Endpoints:
- **Authentication**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- **AI Chat**: `/api/ai/chat`, `/api/ai/history`
- **Memory**: `/api/memory/newdoc`, `/api/memory/documents`
- **Tools**: 
  - Calendar: `/api/tools/calendar/*`
  - Notion: `/api/tools/notion/*`
  - Email: `/api/tools/email/*`

See `BACKEND_API_DOCUMENTATION.md` for complete API specification.

## Technologies Used

- React 18
- React Router DOM
- Vite
- Lucide React (Icons)
- Three.js (3D background)
- CSS3 (Custom styling)

## API Service Layer

The frontend uses a centralized API service layer (`src/services/api.js`) that handles:
- Authentication (signup, login, logout, get current user)
- AI Chat (send messages, get history, delete chats)
- Memory/Documents (upload, list, delete documents)
- Calendar Tool (events CRUD operations)
- Notion Tool (pages, search, connect)
- Email Tool (send, receive, connect)

## Configuration

### Environment Variables

- `VITE_BACKEND_URL`: Backend API URL (default: `http://localhost:3000`)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Documentation

- **API Documentation**: See `BACKEND_API_DOCUMENTATION.md` for complete backend API specification
- **Setup Guide**: See `SETUP_GUIDE.md` for detailed setup and integration instructions

## Backend Repository

The backend code is in a separate repository: [ANVIK_M1](https://github.com/Pruthviraj-sawant/ANVIK_M1)

## License

MIT
