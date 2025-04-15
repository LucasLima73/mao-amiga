'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Loader2 } from 'lucide-react'

export default function Chat() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: t('chat.welcome') }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Foca no input quando o componente montar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')

    try {
      const response = await fetch('https://mao-amiga-api.onrender.com/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }),
      })

      const data = await response.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error') }])
    } finally {
      setIsLoading(false)
      // Foca no input após enviar a mensagem
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Envia ao pressionar Enter (sem Shift para permitir quebras de linha com Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content: string) => {
    // Função simples para formatar mensagens (quebras de linha)
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="flex flex-col h-screen bg-yellow-50">
      {/* Espaço para a navbar */}
      <div className="h-16"></div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-3/4 px-5 py-3 rounded-2xl shadow ${
                  msg.role === 'user' 
                  ? 'bg-yellow-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-yellow-200'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {msg.role === 'user' ? t('chat.you', 'Você') : t('chat.assistant', 'Assistente')}
                </div>
                <div className={`text-base ${msg.role === 'user' ? 'text-blue-50' : 'text-gray-700'}`}>
                  {formatMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 px-5 py-3 rounded-2xl rounded-tl-none shadow">
                <div className="text-sm font-medium mb-1">{t('chat.assistant', 'Assistente')}</div>
                <div className="flex items-center text-gray-500">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('chat.thinking', 'Digitando...')}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Formulário de entrada */}
      <footer className="bg-white border-t border-yellow-200 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-12 py-3 rounded-full border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                placeholder={t('chat.placeholder')}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors disabled:bg-yellow-300 disabled:cursor-not-allowed"
              disabled={!input.trim()}
              aria-label={t('chat.send')}
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
