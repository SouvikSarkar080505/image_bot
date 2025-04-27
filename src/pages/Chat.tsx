import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { messages, isProcessing, processUserMessage } = useChat();
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!userInput.trim() && !selectedImage) || isProcessing) return;
    
    await processUserMessage(userInput, selectedImage || undefined);
    
    setUserInput("");
    setSelectedImage(null);
    setShowImageUpload(false);
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageSelect = (image: File) => {
    setSelectedImage(image);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-indigo-600">Souvchat</h1>
          <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/")}
        >
          Sign out
        </Button>
      </header>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="container max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              isLoading={message.isLoading}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="container max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {showImageUpload && (
              <Card className="p-4 bg-gray-50">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  className="mb-4"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-600"
                >
                  Cancel
                </Button>
              </Card>
            )}
            
            <div className="flex items-end gap-2">
              {!showImageUpload && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowImageUpload(true)}
                  className="rounded-full"
                >
                  <ImageIcon size={18} />
                </Button>
              )}
              
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Ask a question or describe an image..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="pr-12 min-h-[50px] max-h-32 resize-none py-3"
                  disabled={isProcessing}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={(!userInput.trim() && !selectedImage) || isProcessing}
                  className="absolute right-2 bottom-1.5"
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
