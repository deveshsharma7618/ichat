import Avatar from "../shared/Avatar";

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

interface ConversationItemProps {
  friend: Friend;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({ friend, isActive, onClick }: ConversationItemProps) {
  return (
    <li
      className={`conversation ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="avatar">
        {friend.image ? (
          <img
            src={friend.image}
            alt={friend.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm">{friend.name.charAt(0)}</span>
        )}
      </div>
      <div className="meta">
        <div className="row">
          <span className="name">{friend.name}</span>
          <span className="time">{friend.time}</span>
        </div>
        <div className="row">
          <span className="preview">{friend.last}</span>
        </div>
      </div>
    </li>
  );
}
