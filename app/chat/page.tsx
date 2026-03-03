"use client";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
import AddFriendModal from "@/app/components/AddFriendModal";
import { getStoredUser, useClientAuth } from "@/lib/client-auth";
import Sidebar from "@/app/components/chat/Sidebar";
import ConversationPane from "@/app/components/chat/ConversationPane";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

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

export default function ChatPage() {
  const { isLoading, isAuthenticated, user: authUser, token } = useClientAuth({ requireAuth: true });
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [user, setUser] = useState<any>(null);

  // Fetch friends after user is authenticated
  useEffect(() => {
    if (isLoading || !isAuthenticated || !authUser?.email) {
      return;
    }

    const accessToken = authUser.accessToken;
    const email = authUser.email;

    setUser(authUser);
    
    console.log("User authenticated:", { email, hasToken: !!token, hasAccessToken: !!accessToken });

    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/get-friends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email, 
            token: token || "",
            accessToken: accessToken || "" 
          }),
        });

        const data = await response.json();
        console.log("Fetched friends from API:", data);
        
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
          console.log("Failed to fetch friends:", data.error);
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
  }

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Send message clicked");
    const currentUser = getStoredUser() || authUser;
    if (!currentUser || !currentUser.email) {
      console.error("No user found in localStorage");
      return;
    }

    if (!activeFriend) {
      console.error("No active friend selected");
      return;
    }
    console.log(token, currentUser.accessToken);

    const newMessage = {
      email : currentUser.email,
      token : currentUser.accessToken || token,
      friendEmail : activeFriend.email,
      message: messageInput,
    };
    console.log("Sending message:", newMessage);

    const response = await fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
    const data = await response.json();
    if (response.ok) {
      console.log("Message sent successfully:", data);
      // Clear input field
      setMessageInput("");
      const messageToAdd: Message = {
        sender: currentUser.email,
        recipient: activeFriend.email,
        content: messageInput,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, messageToAdd]);
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
        token: currentUser.accessToken || token,
        friendEmail: activeFriend?.email || ""
        }),
    });
    const data = await response.json();
    console.log("Fetched chats:", data);
    if (response.ok) {
      console.log("Fetched chats successfully:", data);
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


  return (
    <main className={`chat-shell ${grotesk.className}`}>
      <div className="ambient a" />
      <div className="ambient b" />

      <section className="chat-card">
        <Sidebar
          friends={friends}
          onAddFriend={() => setIsAddFriendModalOpen(true)}
          onFriendSelect={handleFriendSelect}
        />

        <ConversationPane
          activeFriend={activeFriend}
          messages={messages}
          messageInput={messageInput}
          currentUserEmail={user?.email || ""}
          onMessageInputChange={handleMessageInputChange}
          onSendMessage={sendMessage}
        />
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
          const tokenStr = localStorage.getItem("token");
          
          if (!userStr) return;
          
          let user: any = {};
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            console.error("Error parsing user:", e);
            return;
          }
          
          const email = user.email;
          const accessToken = user.accessToken;
          
          fetch("/api/get-friends", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              email, 
              accessToken,
              token: tokenStr || ""
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
