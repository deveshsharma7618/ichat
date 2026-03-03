import { Playfair_Display } from "next/font/google";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const display = Playfair_Display({ subsets: ["latin"], weight: ["600"] });

interface Friend {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
  createdAt?: string;
  time?: string;
  last?: string;
  unread?: number;
  selected?: boolean;
}

interface Message {
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

interface ConversationPaneProps {
  activeFriend: Friend | null;
  messages: Message[];
  messageInput: string;
  currentUserEmail: string;
  onMessageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ConversationPane({
  activeFriend,
  messages,
  messageInput,
  currentUserEmail,
  onMessageInputChange,
  onSendMessage,
}: ConversationPaneProps) {
  return (
    <section className="conversation-pane">
      <header className="pane-head">
        <div className="flex gap-2 justify-center items-center">
          {activeFriend?.image ? (
            <img
              src={activeFriend.image || "/default-avatar.png"}
              alt={activeFriend.name}
              width={40}
              height={40}
              className="avatar w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold bg-blue-400 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              {activeFriend?.name ? activeFriend.name.charAt(0) : "?"}
            </span>
          )}
          <h2 className={`pane-title ${display.className}`}>
            {activeFriend?.name || "Select a friend"}
          </h2>
        </div>
        <div className="pane-actions">
          <button type="button">Call</button>
          <button type="button" className="ghost">
            Details
          </button>
        </div>
      </header>

      <div className="message-stream flex-1 overflow-y-auto p-4">
        <div className="date-chip">Today</div>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
            isOutgoing={msg.sender === currentUserEmail}
          />
        ))}
      </div>

      <MessageInput
        value={messageInput}
        onChange={onMessageInputChange}
        onSend={onSendMessage}
      />
    </section>
  );
}
