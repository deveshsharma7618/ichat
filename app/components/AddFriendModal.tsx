"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUserPlus } from "@fortawesome/free-solid-svg-icons";

interface User {
	_id: string;
	name: string;
	email: string;
	image?: string;
}

interface SearchResponse {
	users?: User[];
	alreadyAddedFriends?: {
		friends: Array<{ email: string }>;
	};
}

interface AddFriendModalProps {
	isOpen: boolean;
	onClose: () => void;
	onFriendAdded?: () => void;
}

export default function AddFriendModal({
	isOpen,
	onClose,
	onFriendAdded,
}: AddFriendModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [addingFriendEmail, setAddingFriendEmail] = useState<string | null>(null);
	const [alreadyAddedFriends, setAlreadyAddedFriends] = useState<string[]>([]);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setSuggestions([]);
			return;
		}

		const searchFriends = async () => {
			setLoading(true);
			setError("");
			try {
				const currentUserEmail = JSON.parse(localStorage.getItem("user") || "{}").email || "";
				const response = await fetch(
					"/api/user/search?email=" + encodeURIComponent(searchQuery) + "&currentUserEmail=" + encodeURIComponent(currentUserEmail),
					{
					method: "GET",
					headers: {
						"Content-Type": "application/json",

					},
                    				
				});

				if (!response.ok) {
					throw new Error("Failed to search users");
				}

				const data = (await response.json()) as SearchResponse | User[];
				const users = Array.isArray(data) ? data : data.users;
				const safeUsers = Array.isArray(users)
					? users.filter((user) => user.email?.toLowerCase() !== currentUserEmail.toLowerCase())
					: [];
				setSuggestions(safeUsers);
				setAlreadyAddedFriends(!Array.isArray(data) && data.alreadyAddedFriends ? data.alreadyAddedFriends.friends.map((friend) => friend.email) : []);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setSuggestions([]);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimer = setTimeout(searchFriends, 300);
		return () => clearTimeout(debounceTimer);
	}, [searchQuery]);

	const handleAddFriend = async (friendEmail: string) => {
		setAddingFriendEmail(friendEmail);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const email = user.email;
        const name = user.name;

		try {
			const response = await fetch("/api/add-friends", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
                    accessToken : localStorage.getItem("accessToken") || "",
					friendEmail: friendEmail,
					name: name,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to add friend");
				setAddingFriendEmail(null);
				return;
			}


			// Remove the added friend from suggestions
			setSuggestions((prev) => prev.filter((user) => user.email !== friendEmail));

			// Add to already added friends list
			setAlreadyAddedFriends((prev) => [...prev, friendEmail]);

			// Notify parent component
			onFriendAdded?.();

			// Clear error
			setError("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to add friend");
			setAddingFriendEmail(null);
		}
	};

	// Filter out already added friends from suggestions
	const filteredSuggestions = suggestions.filter(
		(user) => !alreadyAddedFriends.includes(user.email)
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white">
						Add Friends
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
						aria-label="Close modal"
					>
						<FontAwesomeIcon icon={faTimes} className="text-lg" />
					</button>
				</div>

				{/* Search Input */}
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<div className="relative">
						<FontAwesomeIcon
							icon={faSearch}
							className="absolute left-3 top-3 text-gray-400 text-sm"
						/>
						<input
							type="text"
							placeholder="Search by name or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							autoFocus
						/>
					</div>
				</div>

{/* Already added friends section */}
			{alreadyAddedFriends.length > 0 && (
				<div className="p-4 border-b border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
					<p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
						✓ Already Added Friends:
					</p>
					<div className="flex flex-wrap gap-2">
						{alreadyAddedFriends.map((email) => (
							<span
								key={email}
								className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full"
							>
								{email}
							</span>
						))}
					</div>
					</div>
				)}
				{/* Suggestions List */}

				<div className="flex-1 overflow-y-auto">
					{error && (
						<div className="m-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
							{error}
						</div>
					)}

					{loading && (
						<div className="flex items-center justify-center p-8">
							<div className="animate-spin">
								<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
							</div>
						</div>
					)}

					{!loading && !error && filteredSuggestions.length === 0 && searchQuery && (
						<div className="flex flex-col items-center justify-center p-8 text-center">
							<p className="text-gray-500 dark:text-gray-400">
								No users found matching "{searchQuery}"
							</p>
						</div>
					)}

					{!loading && !error && filteredSuggestions.length === 0 && !searchQuery && (
						<div className="flex flex-col items-center justify-center p-8 text-center">
							<p className="text-gray-500 dark:text-gray-400">
								Search for friends by name or email
							</p>
						</div>
					)}

					<ul className="space-y-2 p-4">
						{filteredSuggestions.map((user) => (
							<li
								key={user._id}
								className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							>
								<div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{user.image ? (
											<img src={user.image} alt="User" className="w-full h-full rounded-full object-cover" />
										) : (
											user.name.charAt(0).toUpperCase()
										)}
									</span>
								</div>
								<div className="flex-1 ml-3 min-w-0">
									<p className="font-medium text-gray-900 dark:text-white truncate">
										{user.name}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
										{user.email}
									</p>
								</div>
								<button
									onClick={() => handleAddFriend(user.email)}
									disabled={addingFriendEmail === user.email}
									className="ml-3 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-1 text-sm font-medium shrink-0"
								>
									{addingFriendEmail === user.email ? (
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									) : (
										<>
											<FontAwesomeIcon
												icon={faUserPlus}
												className="text-xs"
											/>
											Add
										</>
									)}
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
