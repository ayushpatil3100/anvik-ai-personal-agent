import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  Send,
  Paperclip,
  X,
  Menu,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { chatAPI, memoryAPI, authAPI } from '../services/api'
import './Chat.css'

function Chat({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState({}) // Track PDF upload status
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const activeChat = chatHistory.find((chat) => chat.id === activeChatId)

  // Load chat history from backend on mount
  useEffect(() => {
    loadChatHistory()
  }, [])

  // Update messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages || [])
    } else {
      setMessages([])
    }
  }, [activeChatId, activeChat])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history from backend
  const loadChatHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const data = await chatAPI.getChatHistory()
      const chats = data.chats || []
      
      // Transform backend chat format to frontend format
      const transformedChats = chats.map((chat) => ({
        id: chat.id || chat._id,
        title: chat.title || 'New Chat',
        messages: chat.messages || [],
        createdAt: chat.createdAt,
      }))

      setChatHistory(transformedChats)
      
      // Set active chat to first one, or create new if none exist
      if (transformedChats.length > 0) {
        setActiveChatId(transformedChats[0].id)
      } else {
        createNewChat()
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // If error, create a new chat
      createNewChat()
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    setIsAuthenticated(false)
    navigate('/login')
  }

  const createNewChat = () => {
    const newChat = {
      id: `temp-${Date.now()}`, // Temporary ID until saved to backend
      title: 'New Chat',
      messages: [],
      isNew: true, // Flag to indicate it hasn't been saved yet
    }
    setChatHistory([newChat, ...chatHistory])
    setActiveChatId(newChat.id)
    setMessages([])
  }

  const deleteChat = async (chatId, e) => {
    e.stopPropagation()
    
    // Don't delete temporary chats from backend
    if (!chatId.toString().startsWith('temp-')) {
      try {
        await chatAPI.deleteChat(chatId)
      } catch (error) {
        console.error('Failed to delete chat from backend:', error)
        // Continue with local deletion even if backend fails
      }
    }

    const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId)
    setChatHistory(updatedHistory)
    
    if (chatId === activeChatId) {
      if (updatedHistory.length > 0) {
        setActiveChatId(updatedHistory[0].id)
      } else {
        createNewChat()
      }
    }
  }

  const uploadPDFToBackend = async (file) => {
    try {
      const data = await memoryAPI.uploadDocument(file)
      return { success: true, data }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      return { success: false, error: error.message }
    }
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    
    // Separate PDFs from other files
    const pdfFiles = files.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
    const otherFiles = files.filter(file => !(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')))

    // Add non-PDF files to attached files (for chat attachments)
    if (otherFiles.length > 0) {
      setAttachedFiles([...attachedFiles, ...otherFiles])
    }

    // Upload PDFs to backend immediately
    for (const pdfFile of pdfFiles) {
      const fileId = `${pdfFile.name}-${Date.now()}`
      setUploadingFiles(prev => ({ ...prev, [fileId]: { file: pdfFile, status: 'uploading' } }))

      const result = await uploadPDFToBackend(pdfFile)
      
      if (result.success) {
        setUploadingFiles(prev => ({ 
          ...prev, 
          [fileId]: { file: pdfFile, status: 'success', data: result.data } 
        }))
        // Optionally show success message
        console.log(`PDF "${pdfFile.name}" uploaded successfully:`, result.data)
      } else {
        setUploadingFiles(prev => ({ 
          ...prev, 
          [fileId]: { file: pdfFile, status: 'error', error: result.error } 
        }))
        // Optionally show error message
        console.error(`Failed to upload PDF "${pdfFile.name}":`, result.error)
      }
    }

    // Reset file input
    e.target.value = ''
  }

  const removeFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return

    const prompt = input.trim()
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: prompt,
      files: [...attachedFiles],
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setAttachedFiles([])
    setIsLoading(true)

    // Update chat title if it's the first message
    if (newMessages.length === 1) {
      const title = prompt.slice(0, 50) || 'New Chat'
      updateChatTitle(activeChatId, title)
    }

    // Update local chat history immediately for better UX
    updateChatMessages(activeChatId, newMessages)

    let assistantReply = 'Thinking...'

    try {
      // Send message to backend
      const data = await chatAPI.sendMessage(
        prompt,
        newMessages,
        attachedFiles
      )
      assistantReply = data?.reply || data?.message || data?.response || 'No response from server.'
      
      // If this is a new chat and backend returns a chat ID, update it
      if (activeChat && activeChat.isNew && data.chatId) {
        // Replace temporary ID with backend ID
        setChatHistory(prevHistory => 
          prevHistory.map(chat => 
            chat.id === activeChatId 
              ? { ...chat, id: data.chatId, isNew: false }
              : chat
          )
        )
        setActiveChatId(data.chatId)
      }
    } catch (error) {
      console.error('AI request failed:', error)
      assistantReply = error.message || 'Something went wrong while contacting the AI service. Please retry.'
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        authAPI.logout()
        setIsAuthenticated(false)
        navigate('/login')
        return
      }
    }

    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: assistantReply,
      timestamp: new Date(),
    }

    const updatedMessages = [...newMessages, aiMessage]
    setMessages(updatedMessages)
    updateChatMessages(activeChatId, updatedMessages)
    setIsLoading(false)
  }

  const updateChatTitle = (chatId, title) => {
    setChatHistory(
      chatHistory.map((chat) => (chat.id === chatId ? { ...chat, title } : chat)),
    )
  }

  const updateChatMessages = (chatId, messages) => {
    setChatHistory(
      chatHistory.map((chat) => (chat.id === chatId ? { ...chat, messages } : chat)),
    )
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Brain size={24} />
            <span>Anvik</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        <button className="new-chat-button" onClick={createNewChat}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <div className="chat-history">
          <div className="history-header">
            <span>Recent</span>
          </div>
          {isLoadingHistory ? (
            <div className="history-loading">
              <Loader2 size={16} className="spinning" />
              <span>Loading chats...</span>
            </div>
          ) : (
            <div className="history-list">
              {chatHistory.length === 0 ? (
                <div className="history-empty">
                  <p>No chats yet</p>
                  <p className="history-empty-hint">Start a new conversation</p>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <MessageSquare size={16} />
                    <span className="history-title">{chat.title}</span>
                    <button
                      className="history-delete"
                      onClick={(e) => deleteChat(chat.id, e)}
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-button">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className="sidebar-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-header">
          <div>
            <p className="eyebrow">Live workspace</p>
            <h1>Chat with Anvik</h1>
          </div>
          <div className="chat-header__actions">
            <button className="chat-header__button" onClick={createNewChat}>
              <Plus size={16} /> New chat
            </button>
            <button
              className="chat-header__button secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={16} /> Attach files
            </button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-content">
              <Brain size={64} className="welcome-icon" />
              <h1>Your AI isn't intelligent until it remembers</h1>
              <p>Start a conversation or upload files to begin</p>
              
              <div className="welcome-suggestions">
                <button 
                  className="suggestion-card"
                  onClick={() => setInput("What can you help me with?")}
                >
                  <MessageSquare size={20} />
                  <span>What can you help me with?</span>
                </button>
                <button 
                  className="suggestion-card"
                  onClick={() => setInput("Explain how memory works")}
                >
                  <MessageSquare size={20} />
                  <span>Explain how memory works</span>
                </button>
                <button 
                  className="suggestion-card"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={20} />
                  <span>Upload a document</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.files && message.files.length > 0 && (
                    <div className="message-files">
                      {message.files.map((file, idx) => (
                        <div key={idx} className="file-badge">
                          <Paperclip size={14} />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="message-text">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-container">
          {/* PDF Upload Status */}
          {Object.keys(uploadingFiles).length > 0 && (
            <div className="uploaded-files">
              {Object.entries(uploadingFiles).map(([fileId, uploadInfo]) => (
                <div key={fileId} className={`uploaded-file ${uploadInfo.status}`}>
                  <Paperclip size={14} />
                  <span>{uploadInfo.file.name}</span>
                  {uploadInfo.status === 'uploading' && (
                    <Loader2 size={14} className="spinning" />
                  )}
                  {uploadInfo.status === 'success' && (
                    <CheckCircle size={14} className="success-icon" />
                  )}
                  {uploadInfo.status === 'error' && (
                    <XCircle size={14} className="error-icon" />
                  )}
                  <button
                    onClick={() => {
                      setUploadingFiles(prev => {
                        const updated = { ...prev }
                        delete updated[fileId]
                        return updated
                      })
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {attachedFiles.length > 0 && (
            <div className="attached-files">
              {attachedFiles.map((file, index) => (
                <div key={index} className="attached-file">
                  <Paperclip size={14} />
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(index)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="chat-input-wrapper">
            <button
              className="attach-button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
            >
              <Plus size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <textarea
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Anvik..."
              rows={1}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!input.trim() && attachedFiles.length === 0}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="input-footer">
            <p>Anvik can make mistakes. Check important info.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Chat

