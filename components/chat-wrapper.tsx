"use client"

import { useEffect, useState } from "react"
import ChatAssistant from "@/components/chat-assistant"

export default function ChatWrapper() {
  // Use state to control whether the component is mounted
  const [isMounted, setIsMounted] = useState(false)
  
  // Only render the chat component after the component mounts on the client
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Don't render anything during SSR
  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ChatAssistant />
    </div>
  )
} 