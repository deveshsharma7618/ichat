"use client";
import { Playfair_Display, Space_Grotesk } from "next/font/google";

const display = Playfair_Display({ subsets: ["latin"], weight: ["600"] });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600"] });

const conversations = [
	{
		id: "1",
		name: "Ari Rocha",
		last: "Wireframes look clean. Shipping it?",
		time: "2m",
		unread: 2,
	},
	{
		id: "2",
		name: "Studio Team",
		last: "Standup in 10. Bring updates.",
		time: "8m",
		unread: 0,
	},
	{
		id: "3",
		name: "Mina Park",
		last: "Your voice note sounded relaxed!",
		time: "28m",
		unread: 1,
	},
	{
		id: "4",
		name: "Launch Room",
		last: "Assets are all in the drive.",
		time: "1h",
		unread: 0,
	},
];

const messages = [
	{
		id: "m1",
		from: "them",
		text: "Morning! I pulled the latest API results.",
		time: "09:12",
	},
	{
		id: "m2",
		from: "me",
		text: "Nice. Can you drop the summary in the board?",
		time: "09:13",
	},
	{
		id: "m3",
		from: "them",
		text: "Already did. Also added the charts for drop-off.",
		time: "09:16",
	},
	{
		id: "m4",
		from: "me",
		text: "Perfect. I will review after standup.",
		time: "09:18",
	},
	{
		id: "m5",
		from: "them",
		text: "Cool. Ping me if you want a quick walkthrough.",
		time: "09:20",
	},
];

export default function ChatPage() {
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
						<button className="new-chat" type="button" aria-label="New chat">
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
						{conversations.map((item, index) => (
							<li
								key={item.id}
								className={`conversation ${index === 0 ? "active" : ""}`}
							>
								<div className="avatar">
									{item.name
										.split(" ")
										.map((part) => part[0])
										.join("")}
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
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`message ${msg.from === "me" ? "from-me" : ""}`}
							>
								<div className="bubble">
									<p>{msg.text}</p>
									<span className="timestamp">{msg.time}</span>
								</div>
							</div>
						))}
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
					background: radial-gradient(
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

				.chat-shell {
					min-height: calc(100vh - 72px);
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 48px 20px 64px;
					position: relative;
					overflow: hidden;
				}

				.ambient {
					position: absolute;
					width: 260px;
					height: 260px;
					border-radius: 50%;
					filter: blur(60px);
					opacity: 0.6;
					animation: float 9s ease-in-out infinite;
				}

				.ambient.a {
					background: #ff9d44;
					top: -40px;
					left: -30px;
				}

				.ambient.b {
					background: #4fb6ff;
					bottom: -60px;
					right: -40px;
					animation-delay: 1.4s;
				}

				.chat-card {
					width: min(1100px, 100%);
					background: rgba(15, 16, 22, 0.82);
					border-radius: 28px;
					backdrop-filter: blur(24px);
					display: grid;
					grid-template-columns: minmax(240px, 320px) 1fr;
					box-shadow: 0 30px 80px rgba(4, 5, 10, 0.55);
					overflow: hidden;
					animation: rise 0.8s ease-out;
				}

				.sidebar {
					padding: 28px 24px;
					border-right: 1px solid rgba(255, 255, 255, 0.08);
					display: flex;
					flex-direction: column;
					gap: 20px;
					background: rgba(17, 18, 24, 0.7);
				}

				.sidebar-head {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.eyebrow {
					text-transform: uppercase;
					letter-spacing: 0.24em;
					font-size: 0.65rem;
					color: #a39a8f;
					margin: 0 0 4px;
				}

				.title {
					font-size: 1.8rem;
					color: #f7f2ea;
					margin: 0;
				}

				.new-chat {
					width: 36px;
					height: 36px;
					border-radius: 12px;
					border: none;
					background: #f7d7b0;
					color: #1b1208;
					font-size: 1.2rem;
					cursor: pointer;
				}

				.search {
					display: flex;
					align-items: center;
					gap: 8px;
					background: #111318;
					border-radius: 16px;
					padding: 10px 12px;
					border: 1px solid rgba(255, 255, 255, 0.08);
				}

				.search input {
					border: none;
					outline: none;
					width: 100%;
					background: transparent;
					font-size: 0.9rem;
					color: #e6e0d9;
				}

				.section-label {
					font-size: 0.75rem;
					color: #9f8f79;
					letter-spacing: 0.14em;
					text-transform: uppercase;
				}

				.conversation-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 12px;
				}

				.conversation {
					display: flex;
					gap: 12px;
					padding: 12px;
					border-radius: 18px;
					background: transparent;
					cursor: pointer;
					transition: background 0.2s ease, transform 0.2s ease;
				}

				.conversation:hover {
					background: rgba(255, 170, 90, 0.15);
					transform: translateY(-2px);
				}

				.conversation.active {
					background: rgba(255, 170, 90, 0.2);
				}

				.avatar {
					width: 44px;
					height: 44px;
					border-radius: 16px;
					background: #f7d7b0;
					color: #1b1208;
					display: grid;
					place-items: center;
					font-weight: 600;
				}

				.meta {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 6px;
				}

				.row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 10px;
				}

				.name {
					font-weight: 600;
					color: #f7f2ea;
				}

				.preview {
					color: #b4a797;
					font-size: 0.85rem;
					flex: 1;
				}

				.time {
					font-size: 0.75rem;
					color: #8a7f71;
				}

				.badge {
					background: #f7d7b0;
					color: #1b1208;
					border-radius: 999px;
					font-size: 0.7rem;
					padding: 2px 8px;
				}

				.status-card {
					margin-top: auto;
					padding: 16px;
					border-radius: 18px;
					background: #f7d7b0;
					color: #1b1208;
					display: flex;
					flex-direction: column;
					gap: 12px;
				}

				.status-title {
					margin: 0;
					font-weight: 600;
					font-size: 1rem;
				}

				.status-copy {
					margin: 0;
					color: rgba(27, 18, 8, 0.7);
					font-size: 0.85rem;
				}

				.status-cta {
					border: none;
					background: #1b1208;
					color: #f7f2ea;
					border-radius: 12px;
					padding: 8px 12px;
					font-weight: 600;
					cursor: pointer;
				}

				.conversation-pane {
					padding: 28px 32px;
					display: flex;
					flex-direction: column;
					gap: 20px;
				}

				.pane-head {
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 16px;
				}

				.pane-title {
					margin: 0;
					font-size: 1.6rem;
					color: #f7f2ea;
				}

				.pane-actions {
					display: flex;
					gap: 8px;
				}

				.pane-actions button {
					border: none;
					background: #f7d7b0;
					color: #1b1208;
					border-radius: 12px;
					padding: 8px 14px;
					cursor: pointer;
					font-size: 0.85rem;
				}

				.pane-actions .ghost {
					background: rgba(255, 255, 255, 0.08);
					color: #f7f2ea;
				}

				.message-stream {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 16px;
					padding: 10px 0 0;
					overflow-y: auto;
				}

				.date-chip {
					align-self: center;
					font-size: 0.75rem;
					color: #b4a797;
					background: rgba(255, 255, 255, 0.08);
					padding: 6px 12px;
					border-radius: 999px;
					border: 1px solid rgba(255, 255, 255, 0.08);
				}

				.message {
					display: flex;
				}

				.message.from-me {
					justify-content: flex-end;
				}

				.bubble {
					background: #151820;
					padding: 12px 16px;
					border-radius: 18px;
					max-width: 70%;
					box-shadow: 0 12px 24px rgba(6, 7, 12, 0.45);
					position: relative;
				}

				.from-me .bubble {
					background: #f7d7b0;
					color: #1b1208;
				}

				.bubble p {
					margin: 0;
					font-size: 0.95rem;
					line-height: 1.5;
				}

				.timestamp {
					display: block;
					margin-top: 6px;
					font-size: 0.7rem;
					color: inherit;
					opacity: 0.6;
				}

				.composer {
					display: grid;
					grid-template-columns: auto 1fr auto;
					gap: 10px;
					align-items: center;
					padding: 12px 14px;
					border-radius: 18px;
					background: #101218;
					border: 1px solid rgba(255, 255, 255, 0.08);
				}

				.composer-tools {
					display: flex;
					gap: 6px;
				}

				.composer button {
					border: none;
					background: rgba(255, 255, 255, 0.08);
					color: #f7f2ea;
					border-radius: 10px;
					padding: 6px 10px;
					cursor: pointer;
				}

				.composer input {
					border: none;
					outline: none;
					font-size: 0.95rem;
					background: transparent;
					color: #e6e0d9;
				}

				.composer .send {
					background: #f7d7b0;
					color: #1b1208;
					padding: 8px 16px;
					border-radius: 12px;
				}

				@keyframes float {
					0%,
					100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(16px);
					}
				}

				@keyframes rise {
					from {
						opacity: 0;
						transform: translateY(16px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@media (max-width: 900px) {
					.chat-card {
						grid-template-columns: 1fr;
					}

					.sidebar {
						border-right: none;
						border-bottom: 1px solid rgba(255, 255, 255, 0.08);
					}
				}

				@media (max-width: 600px) {
					.chat-shell {
						padding: 24px 14px 40px;
					}

					.conversation-pane {
						padding: 20px;
					}

					.bubble {
						max-width: 85%;
					}
				}
			`}</style>
		</main>
	);
}
