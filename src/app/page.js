// src/app/page.js
'use client'

import { useState, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function TypewriterText({ text, speed = 30 }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else {
      setIsComplete(true)
    }
  }, [text, currentIndex, speed])

  return (
    <div className="space-y-2">
      <div 
        className="whitespace-pre-line" 
        dangerouslySetInnerHTML={{ 
          __html: displayText 
        }} 
      />
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  )
}

const BackgroundShapes = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#8A6A45] opacity-5"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: Math.random() * 2 + 1,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: Math.random() * 2 + 1,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            width: `${Math.random() * Math.min(dimensions.width, 400) + 100}px`,
            height: `${Math.random() * Math.min(dimensions.height, 400) + 100}px`,
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm an AI trained on Shiven's resume. Feel free to ask me anything about his experience, skills, or projects!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message 
      }])

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble accessing my knowledge base right now. Please try again in a moment." 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 md:p-24 bg-[#F7F3EE] relative">
      <BackgroundShapes />
      
      <div className="w-full max-w-3xl mb-6 flex items-center justify-between">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-[#3D2E22] tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Chat with Shiven's Resume
        </motion.h1>
        
        <motion.a
          href="https://bento.me/shvn22k" // Add your Bento link here
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#8A6A45] text-white rounded-lg hover:bg-[#725838] transition-all duration-200 flex items-center gap-2 text-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
          </svg>
          Let's Connect
        </motion.a>
      </div>

      <motion.div 
        className="w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 flex flex-col h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-[#8A6A45]/20 scrollbar-track-transparent flex flex-col">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg backdrop-blur-sm ${
                  message.role === 'user'
                    ? 'bg-[#8A6A45]/90 text-white ml-auto hover:bg-[#725838]'
                    : 'bg-white/80 text-[#3D2E22] border border-[#E6DDD3] hover:border-[#8A6A45]'
                } max-w-[80%] transition-all duration-200 cursor-default shadow-sm tracking-tight`}
              >
                {message.role === 'assistant' && index === messages.length - 1 ? (
                  <TypewriterText text={message.content} />
                ) : (
                  <div 
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content 
                    }} 
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="flex gap-2 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about me..."
            className="flex-1 p-2 border border-[#E6DDD3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A6A45] bg-white/80 text-[#3D2E22] transition-all duration-200 hover:border-[#8A6A45]"
          />
          <motion.button 
            type="submit"
            disabled={loading}
            className="p-2 bg-[#8A6A45] text-white rounded-lg hover:bg-[#725838] disabled:opacity-50 transition-all duration-200 flex items-center justify-center w-10 h-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </main>
  )
}
