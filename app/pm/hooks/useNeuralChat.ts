import { useState, useCallback, useRef, useEffect } from "react"
import { PMMessage, getAIResponse } from "@/lib/pm-data"
import { SLASH_COMMANDS } from "../lib/commands"

const STREAM_DELAY_MS = 15 // Speed of "typing" effect

export function useNeuralChat(initialMessages: PMMessage[], onPanelChange: (panel: string | null) => void) {
    const [messages, setMessages] = useState<PMMessage[]>(initialMessages)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [streamingContent, setStreamingContent] = useState<string | null>(null)
    const [activeCommand, setActiveCommand] = useState<any | null>(null)

    // Command Detection
    useEffect(() => {
        if (input.startsWith("/")) {
            const cmd = SLASH_COMMANDS.find(c => c.label.startsWith(input)) || null
            setActiveCommand(cmd)
        } else {
            setActiveCommand(null)
        }
    }, [input])

    const simulateStreaming = async (fullText: string, onComplete: () => void) => {
        setStreamingContent("")
        let currentText = ""
        const tokens = fullText.split(/(?=[ \n])/) // Split by words/spaces roughly

        // Initial "thinking" pause
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))

        setStreamingContent("") // Start showing stream

        for (const token of tokens) {
            currentText += token
            setStreamingContent(currentText)
            // Random jitter for realism
            await new Promise(r => setTimeout(r, STREAM_DELAY_MS + Math.random() * 10))
        }

        setStreamingContent(null)
        onComplete()
    }

    const sendMessage = useCallback(async (content: string = input) => {
        if (!content.trim()) return

        // 1. Handle Slash Commands
        if (content.startsWith("/")) {
            const cmd = SLASH_COMMANDS.find(c => c.label === content.split(" ")[0])
            if (cmd) {
                cmd.action({ setPanel: onPanelChange, setInput })
                setInput("")
                return
            }
        }

        // 2. Add User Message
        const userMsg: PMMessage = {
            id: Date.now().toString(),
            role: "user",
            content: content,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // 3. Get AI Response (Simulated Backend)
        // We'll use the existing getAIResponse logic but wrap it in our streamer
        const responseText = getAIResponse(content, "default") // "default" or infer context later

        // 4. Simulate Streaming
        await simulateStreaming(responseText, () => {
            const aiMsg: PMMessage = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: responseText,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        })

    }, [input, onPanelChange])

    const clearHistory = () => {
        setMessages([initialMessages[0]]) // Keep welcome message
    }

    return {
        messages,
        input,
        setInput,
        isTyping,
        streamingContent,
        sendMessage,
        clearHistory,
        activeCommand
    }
}
