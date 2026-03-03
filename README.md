# iChat : Chatting Website
iChat is a real-time chatting website built with Next.js, Socket.IO, and NextAuth for authentication. It allows users to create accounts, log in, and engage in real-time conversations with other users.

## Features
- User authentication with Google OAuth using NextAuth.
- Real-time messaging with Socket.IO.
- Responsive design for both desktop and mobile devices.
- User-friendly interface for seamless chatting experience.
## Technologies Used
- Next.js: A React framework for server-side rendering and static site generation.
- Socket.IO: A library for real-time web applications.
- NextAuth: An authentication library for Next.js applications.
- Tailwind CSS: A utility-first CSS framework for styling.
## Installation
1. Clone the repository:
```git clone https://github.com/deveshsharma7618/ichat.git 
```
2. Navigate to the project directory:
```cd ichat
```
3. Install dependencies:
```npm install
```
4. Create a `.env.local` file in the root directory and add the following environment variables:
```plaintextGOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```
5. Start the development server:
```npm run dev
```
6. Open your browser and navigate to `http://localhost:3000` to access the
application.
## Contributing
Contributions are welcome! If you have any suggestions or improvements, please feel free to create a pull request or open an issue.
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details

