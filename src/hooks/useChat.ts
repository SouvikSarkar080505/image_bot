
import { useState } from "react";
import { ChatMessageProps } from "@/components/ChatMessage";
import { analyzeImageWithGemini } from "@/services/geminiService";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant with image recognition capabilities. You can send me images to analyze them."
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = (role: "user" | "assistant", content: any) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const processUserMessage = async (text: string, image?: File) => {
    // Add user message
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      addMessage("user", [
        text || "Can you analyze this image?",
        { type: "image", url: imageUrl }
      ]);
    } else {
      addMessage("user", text);
    }
    
    // Show loading state
    setIsProcessing(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "", isLoading: true }]);
    
    try {
      let response: string;
      
      if (image) {
        // Convert image to base64
        const reader = new FileReader();
        const base64Image = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(image);
        });
        
        try {
          // Analyze image using Gemini
          response = await analyzeImageWithGemini(base64Image);
        } catch (apiError) {
          console.error("API error:", apiError);
          response = "Sorry, I couldn't analyze the image. There might be an issue with the Gemini API connection or the API key may be invalid.";
        }
      } else {
        // Simple text response for non-image messages
        response = `Thank you for your message: "${text}". How else can I assist you?`;
      }
      
      // Remove loading message
      setMessages((prev) => prev.slice(0, -1));
      // Add AI response
      addMessage("assistant", response);
    } catch (error) {
      console.error('Error processing message:', error);
      // Remove loading message
      setMessages((prev) => prev.slice(0, -1));
      addMessage("assistant", "Sorry, there was an error processing your request. Please try again with a different image or message.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    messages,
    isProcessing,
    processUserMessage
  };
}
