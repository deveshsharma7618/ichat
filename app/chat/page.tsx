"use client";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddFriendModal from "@/app/components/AddFriendModal";

const display = Playfair_Display({ subsets: ["latin"], weight: ["600"] });
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
}

export default function ChatPage() {
  const { status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // First effect: set mounted flag
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Second effect: handle authentication and fetch friends
  useEffect(() => {
    // Only run after component is mounted
    if (!isMounted) return;

    // Protect localStorage access - only on client side
    let user: any = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }

    // Redirect only if no valid user found
    if (!user || !user.email) {
      console.log("User is unauthenticated, redirecting to home...");
      router.push("/");
      return;
    }

    // Get token from localStorage or user object
    const token = localStorage.getItem("token");
    const accessToken = user.accessToken;
    const email = user.email;
    
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
          }));
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
  }, [isMounted, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className={`chat-shell ${grotesk.className}`}>
      <div className="ambient a" />
      <div className="ambient b" />

      <section className="chat-card">
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
              onClick={() => setIsAddFriendModalOpen(true)}
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
            {friends.map((item, index) => (
              <li
                key={index}
                className={`conversation ${index === 0 ? "active" : ""}`}
              >
                <div className="avatar">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm">{item.name.charAt(0)}</span>
                  )}
                </div>
                <div className="meta">
                  <div className="row">
                    <span className="name">{item.name}</span>
                    <span className="time">{item.time}</span>
                  </div>
                  <div className="row">
                    <span className="preview">{item.last}</span>
                    {item.unread > 0 && (
                      <span className="badge">{item.unread}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="status-card">
            <div>
              <p className="status-title">Daily rhythm</p>
              <p className="status-copy">
                You are replying faster than 78% of your week.
              </p>
            </div>
            <button type="button" className="status-cta">
              View insights
            </button>
          </div>
        </aside>

        <section className="conversation-pane">
          <header className="pane-head">
            <div>
              <p className="eyebrow">Active chat</p>
              <h2 className={`pane-title ${display.className}`}>Ari Rocha</h2>
            </div>
            <div className="pane-actions">
              <button type="button">Call</button>
              <button type="button" className="ghost">
                Details
              </button>
            </div>
          </header>

          <div className="message-stream">
            <div className="date-chip">Today</div>
            {/* {messages.map((msg) => (
							<div
								key={msg.id}
								className={`message ${msg.from === "me" ? "from-me" : ""}`}
							>
								<div className="bubble">
									<p>{msg.text}</p>
									<span className="timestamp">{msg.time}</span>
								</div>
							</div>
						))} */}
          </div>

          <form className="composer">
            <div className="composer-tools">
              <button type="button" aria-label="Attach">
                +
              </button>
              <button type="button" aria-label="Record voice">
                ▣
              </button>
            </div>
            <input
              type="text"
              placeholder="Write a message..."
              aria-label="Message"
            />
            <button type="submit" className="send">
              Send
            </button>
          </form>
        </section>
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
