# Anvik: AI Personal Agent

A modern React-based chat application with authentication, inspired by ChatGPT and styled after the Buttermax aesthetic—now branded as **Anvik: AI Personal Agent**.

## Features

- 🔐 **Authentication**: Login and Signup pages with immersive glassmorphism UI
- 💬 **Chat Interface**: ChatGPT-like workspace with hero metrics and history
- 📁 **File Upload**: Attach files to your messages
- 📚 **Chat History**: Sidebar with conversation history
- 🌌 **Three.js Canvas**: Animated particle background across every page
- 🎨 **Modern Design**: Dark gradient aesthetic inspired by Buttermax
- 📱 **Responsive**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Signup page
│   │   ├── Chat.jsx           # Main chat interface
│   │   ├── Auth.css           # Authentication styles
│   │   └── Chat.css           # Chat interface styles
│   ├── App.jsx                # Main app component with routing
│   ├── App.css                # App-level styles
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies
└── vite.config.js            # Vite configuration
```

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Sign in with your credentials
3. **Start Chatting**: Begin a new conversation or continue from history
4. **Upload Files**: Click the "+" button to attach files to your messages
5. **Manage History**: View, switch between, or delete chat conversations

## Technologies Used

- React 18
- React Router DOM
- Vite
- Lucide React (Icons)
- CSS3 (Custom styling)

# Notes

- Authentication is currently simulated (uses localStorage)
- AI responses are fetched from `VITE_BACKEND_URL/api/ai/`
- File uploads are handled on the frontend only

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT
