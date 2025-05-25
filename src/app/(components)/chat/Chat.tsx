'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Loader2 } from 'lucide-react'

export default function Chat() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([{ role: 'assistant', content: t('chat.welcome') }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // foco no input ao montar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }])
    const prompt = input
    setInput('')
    setIsLoading(true)
    try {
      const res = await fetch(
        'https://mao-amiga-api.onrender.com/api/assistant',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        }
      )
      const data = await res.json()
      if (data.response)
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response },
        ])
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: t('chat.error') },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content: string) => {
    // Remove marcações do tipo 【4:1†source】
    let cleanContent = content.replace(/【\d+:\d+†source】/g, '');
    
    // Transforma texto com **Marcação de consulta** em elementos em negrito
    const processedContent = cleanContent.split('\n').map(line => {
      // Procura por padrões de **texto** e substitui por elementos em negrito
      if (line.includes('**')) {
        // Divide a linha em partes, alternando entre texto normal e marcado
        const parts = line.split(/\*\*([^*]+)\*\*/);
        return parts.map((part, index) => {
          // Se o índice for ímpar, é um texto marcado que deve ficar em negrito
          return index % 2 === 1 ? <strong key={index}>{part}</strong> : part;
        });
      }
      return line;
    });
    
    return processedContent.map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  }

  return (
    <div className="flex flex-col h-screen bg-yellow-50 pb-14 md:pb-0">
      {/* espaço para header ou safe-area */}
      <div className="h-16 sm:h-20" />

      {/* mensagens */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6">
        <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`
                  max-w-full sm:max-w-3/4
                  px-4 py-3 rounded-2xl shadow
                  ${
                    msg.role === 'user'
                      ? 'bg-yellow-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border border-yellow-200'
                  }
                `}
              >
                <div className="text-xs sm:text-sm font-medium mb-1">
                  {msg.role === 'user'
                    ? t('chat.you', 'Você')
                    : t('chat.assistant', 'Assistente')}
                </div>
                <div
                  className={`text-sm sm:text-base ${
                    msg.role === 'user' ? 'text-blue-50' : 'text-gray-700'
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-tl-none shadow">
                <div className="text-xs sm:text-sm font-medium mb-1">
                  {t('chat.assistant', 'Assistente')}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('chat.thinking', 'Digitando...')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* input footer */}
      <footer
        className={`
          bg-white border-t border-yellow-200
          p-2 sm:p-4 md:p-6
          z-20

          fixed left-0 right-0 bottom-14     /* mobile/tablet */
          md:static md:bottom-auto           /* desktop volta ao fluxo normal */
        `}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              disabled={isLoading}
              className="
                flex-1
                pl-4 pr-10 sm:pr-12
                py-2 sm:py-3
                text-sm sm:text-base
                rounded-full
                border border-yellow-300
                focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                text-gray-800
              "
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label={t('chat.send')}
              className="
                flex items-center justify-center
                w-10 h-10 sm:w-12 sm:h-12
                rounded-full
                bg-yellow-600 text-white
                hover:bg-yellow-700 transition-colors
                disabled:bg-yellow-300 disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </footer>
    </div>
  )
}
