"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Loader2 } from "lucide-react"
import { useChat } from "ai/react"

// Pre-defined suggested queries to help users
const SUGGESTED_QUERIES = [
  "Tell me about your courses",
  "What projects do you work on?",
  "Which companies do you partner with?",
  "How can I contact you?",
]

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Use the AI library's useChat hook with additional options
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("Chat error:", err);
      setErrorMessage("Sorry, I'm having trouble connecting. Please try again later.");
    },
    onFinish: () => {
      // Clear any error messages when we get a successful response
      setErrorMessage(null);
    }
  })

  // Helper to send a suggested query
  const sendSuggestedQuery = (query: string) => {
    // Manually create a form submission event
    const form = document.createElement("form")
    const input = document.createElement("input")
    input.name = "message"
    input.value = query
    form.appendChild(input)
    
    // Create a synthetic submit event
    const submitEvent = new SubmitEvent("submit", {
      bubbles: true,
      cancelable: true,
    })
    
    // Set the input value and trigger the submission
    handleInputChange({ target: { value: query } } as any)
    
    // Use setTimeout to allow the input value to be set before submission
    setTimeout(() => {
      handleSubmit(submitEvent as any)
    }, 0)
  }

  // Scroll to the bottom of the messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <>
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} size="icon" className="h-14 w-14 rounded-full shadow-lg bg-violet-600 hover:bg-violet-700 transition-all">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      ) : (
        <Card className="w-80 md:w-96 shadow-lg border-violet-100 dark:border-violet-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-violet-50 dark:bg-violet-950 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-violet-700 dark:text-violet-300">Proco AI Chat</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="h-80 overflow-y-auto pt-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Hi there! I'm your AI assistant. How can I help you today?
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUERIES.map((query, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="text-xs" 
                          onClick={() => sendSuggestedQuery(query)}
                        >
                          {query}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              
              {/* Show error message if there is one */}
              {errorMessage && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 max-w-[80%] bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}
              
              {/* Show loading indicator when messages are being processed */}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1 focus-visible:ring-violet-500"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

