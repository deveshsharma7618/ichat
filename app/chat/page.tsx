"use client";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import AddFriendModal from "@/app/components/AddFriendModal";
import { getStoredUser, useClientAuth } from "@/lib/client-auth";
import Sidebar from "@/app/components/chat/Sidebar";
import ConversationPane from "@/app/components/chat/ConversationPane";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import { SocketProvider, useSocket } from "@/lib/socket-context";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600"] });

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

function ChatPageContent() {
  const { isLoading, isAuthenticated, user: authUser, token } = useClientAuth({ requireAuth: true });
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get socket context
  const { socket, isConnected, onlineUsers, joinConversation, leaveConversation, sendMessage: socketSendMessage, emitTyping, emitStopTyping } = useSocket();

  // Fetch friends after user is authenticated
  useEffect(() => {
    if (isLoading || !isAuthenticated || !authUser?.email) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const email = authUser.email;

    setUser(authUser);
    

    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/get-friends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email, 
            accessToken: accessToken || "" 
          }),
        });

        const data = await response.json();
        
        if (response.ok && data.friends) {
          // Map friends data to include dummy data for now
          const friendsList = data.friends.map((friend: Friend) => ({
            ...friend,
            time: "12:00 PM", // Placeholder
            last: "Hey! How are you?", // Placeholder
            unread: 0, // Placeholder
            selected : false
          }));
          if (friendsList.length > 0) {
            friendsList[0].selected = true;
            setActiveFriend(friendsList[0]);
          }
          setFriends(friendsList);
          // Store friends in localStorage for later use
          localStorage.setItem("friends", JSON.stringify(friendsList));
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        // Don't redirect on API errors, just show empty friends list
        setFriends([]);
      }
    };

    fetchFriends();
  }, [isLoading, isAuthenticated, authUser, token]);

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    // Emit typing indicator only if socket is connected
    if (activeFriend && user?.email && isConnected) {
      const conversationId = [user.email, activeFriend.email].sort().join('_');
      emitTyping(conversationId, user.email);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(conversationId, user.email);
      }, 1000);
    }
  }

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentUser = getStoredUser() || authUser;
    if (!currentUser || !currentUser.email) {
      console.error("No user found in localStorage");
      return;
    }

    if (!activeFriend) {
      console.error("No active friend selected");
      return;
    }

    if (!messageInput.trim()) {
      return;
    }


    const newMessage = {
      email : currentUser.email,
      token : currentUser.accessToken || token,
      friendEmail : activeFriend.email,
      message: messageInput,
    };

    // Send via Socket.io for real-time delivery (if connected)
    if (isConnected) {
      const messageForSocket: Message = {
        sender: currentUser.email,
        recipient: activeFriend.email,
        content: messageInput,
        timestamp: new Date().toISOString(),
      };

      // Stop typing indicator
      if (user?.email) {
        const conversationId = [user.email, activeFriend.email].sort().join('_');
        emitStopTyping(conversationId, user.email);
      }

      // Send via socket immediately
      socketSendMessage(messageForSocket);
    }

    // Clear input field immediately for better UX
    setMessageInput("");

    // Also save to database via API
    const response = await fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
    const data = await response.json();
      // If socket is not connected, add message to UI manually
      if (!isConnected) {
        const messageToAdd: Message = {
          sender: currentUser.email,
          recipient: activeFriend.email,
          content: messageInput,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, messageToAdd]);
      }
    if (response.ok) {
    }else{
      console.error("Failed to send message:", data.error);
    }

  }

  const getChats = async () => {
    const currentUser = getStoredUser() || authUser;
    if (!currentUser || !currentUser.email) {
      console.error("No user found in localStorage");
      return;
    }

    const response = await fetch("/api/get-chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: currentUser.email,
        accessToken : localStorage.getItem("accessToken"),
        friendEmail: activeFriend?.email || ""
        }),
    });
    const data = await response.json();
    if (response.ok) {
      // Map API response to Message format
      const fetchedMessages: Message[] = data.chats.map((chat: any) => ({
        sender: chat.sender_email,
        recipient: chat.recipient_email,
        content: chat.message,
        timestamp: chat.sendAt,
      }));

      const sortedMessages = fetchedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(sortedMessages);
    } else {
      console.error("Failed to fetch chats:", data.error);
    }
  }

  // Socket event listeners
  useEffect(() => {
    if (!socket || !activeFriend || !user?.email) return;

    // Only set up socket listeners if connected
    if (!isConnected) {
      return;
    }

    const conversationId = [user.email, activeFriend.email].sort().join('_');

    // Join the conversation room
    joinConversation(conversationId);

    // Listen for incoming messages
    const handleReceiveMessage = (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some(
          (msg) => msg.content === message.content && 
          msg.timestamp === message.timestamp &&
          msg.sender === message.sender
        );
        if (exists) return prev;
        return [...prev, message];
      });
    };

    // Listen for typing indicator
    const handleUserTyping = ({ userId, isTyping: typing }: { userId: string; isTyping: boolean }) => {
      if (userId !== user.email) {
        setIsTyping(typing);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-typing', handleUserTyping);

    // Cleanup
    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-typing', handleUserTyping);
      leaveConversation(conversationId);
    };
  }, [socket, activeFriend, user, joinConversation, leaveConversation, isConnected]);

  useEffect(() => {
    if (activeFriend) {
      getChats();
    }
  }, [activeFriend]);

  if (isLoading) {
    return <LoadingSpinner text="Loading chat..." />;
  }

  const handleFriendSelect = (friend: Friend) => {
    setFriends((prevFriends) =>
      prevFriends.map((f) => ({
        ...f,
        selected: f.email === friend.email,
      }))
    );
    setActiveFriend(friend);
  };

  // Check if active friend is online
  const isFriendOnline = activeFriend?.email ? onlineUsers.has(activeFriend.email) : false;


  return (
    <main className={`chat-shell ${grotesk.className}`}>
      <div className="ambient a" />
      <div className="ambient b" />

      <section className={`chat-card ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div>
          <Sidebar
            friends={friends}
            onAddFriend={() => setIsAddFriendModalOpen(true)}
            onFriendSelect={(friend) => {
              handleFriendSelect(friend);
            }}
          />
        </div>

        <div className="conversation-wrapper">
          <button
            className="sidebar-toggle md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <ConversationPane
            activeFriend={activeFriend}
            messages={messages}
            messageInput={messageInput}
            currentUserEmail={user?.email || ""}
            onMessageInputChange={handleMessageInputChange}
            onSendMessage={sendMessage}
            isTyping={isTyping}
            isFriendOnline={isFriendOnline}
          />
        </div>
      </section>

      <style jsx>{`
        :global(body) {
          background:
            radial-gradient(
              circle at 12% 12%,
              rgba(255, 168, 95, 0.18),
              transparent 48%
            ),
            radial-gradient(
              circle at 88% 18%,
              rgba(97, 187, 255, 0.2),
              transparent 40%
            ),
            #0c0d12;
        }
      `}</style>

      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onFriendAdded={() => {
          // Refresh friends list from API
          const userStr = localStorage.getItem("user");
          const tokenStr = localStorage.getItem("accessToken");
          
          if (!userStr) return;
          
          let user: any = {};
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            console.error("Error parsing user:", e);
            return;
          }
          
          const email = user.email;
          const accessToken = tokenStr;
          
          fetch("/api/get-friends", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              email, 
              accessToken,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.friends) {
                const friendsList = data.friends.map((friend: Friend) => ({
                  ...friend,
                  time: "12:00 PM",
                  last: "Hey! How are you?",
                  unread: 0,
                }));
                setFriends(friendsList);
                localStorage.setItem("friends", JSON.stringify(friendsList));
              }
              setIsAddFriendModalOpen(false);
            })
            .catch((error) => console.error("Error refreshing friends:", error));
        }}
      />
    </main>
  );
}

// Wrapper component that provides Socket context
export default function ChatPage() {
  const { user } = useClientAuth({ requireAuth: true });
  
  return (
    <SocketProvider userId={user?.email || ''}>
      <ChatPageContent />
    </SocketProvider>
  );
}
