import { Playfair_Display } from "next/font/google";
import ConversationItem from "./ConversationItem";

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

interface SidebarProps {
  friends: Friend[];
  onAddFriend: () => void;
  onFriendSelect: (friend: Friend) => void;
}

export default function Sidebar({ friends, onAddFriend, onFriendSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div>
          <p className="eyebrow">Messages</p>
          <h1 className={`title ${display.className}`}>Pulse Chat</h1>
        </div>
        <button
          className="new-chat"
          type="button"
          aria-label="Add friend"
          onClick={onAddFriend}
        >
          +
        </button>
      </div>

      <div className="search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search conversations"
          aria-label="Search conversations"
        />
      </div>

      <div className="section-label">Pinned</div>
      <ul className="conversation-list">
        {friends.map((friend, index) => (
          <ConversationItem
            key={friend._id || index}
            friend={friend}
            isActive={friend.selected || false}
            onClick={() => onFriendSelect(friend)}
          />
        ))}
      </ul>
    </aside>
  );
}
