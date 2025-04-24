
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type MessageRole = "user" | "assistant";
export type MessageContent = string | { type: "image"; url: string; alt?: string };

export interface ChatMessageProps {
  role: MessageRole;
  content: MessageContent | MessageContent[];
  isLoading?: boolean;
}

const ChatMessage = ({ role, content, isLoading = false }: ChatMessageProps) => {
  const isUser = role === "user";
  const contentArray = Array.isArray(content) ? content : [content];
  
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        <Card
          className={cn(
            "px-4 py-3 rounded-2xl text-sm",
            isUser
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-gray-100 text-gray-800 border-gray-100"
          )}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            </div>
          ) : (
            contentArray.map((item, index) => {
              if (typeof item === "string") {
                return <p key={index} className="whitespace-pre-wrap">{item}</p>;
              } else if (item.type === "image") {
                return (
                  <div key={index} className="my-2">
                    <img
                      src={item.url}
                      alt={item.alt || "Uploaded image"}
                      className="max-h-64 rounded object-contain"
                    />
                  </div>
                );
              }
              return null;
            })
          )}
        </Card>
        <span className="text-xs text-gray-500">
          {isUser ? "You" : "AI Assistant"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
