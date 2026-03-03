interface Message {
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
  isOutgoing: boolean;
}

export default function MessageBubble({ message, isOutgoing }: MessageBubbleProps) {
  return (
    <div className={`message ${isOutgoing ? "outgoing" : "incoming"}`}>
      <div className="message-content">{message.content}</div>
    </div>
  );
}
