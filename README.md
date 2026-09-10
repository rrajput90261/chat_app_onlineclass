# Real-Time Chat Application (Online Class) 🚀

A complete, modern full-stack real-time chat application built with **Node.js, Express, Socket.io, MongoDB, Multer**, and a sleek responsive web client.

---

## ✨ Features

- ⚡ **Real-Time Instant Messaging**: Powered by Socket.io for sub-millisecond communication.
- 🟢 **Live Online/Offline Status**: Instant updates when contacts connect or disconnect.
- 💬 **1-on-1 & Group Chats**: Start private conversations or create study groups with multiple members.
- ✍️ **Typing Indicators**: Animated live 3-dot indicators when someone is typing.
- 📎 **File & Image Attachments**: Upload and share images, PDFs, and documents up to 25MB via Multer.
- 🔐 **JWT Authentication & Security**: Secure bcrypt password hashing, JWT bearer tokens, and route protection.
- 📱 **Responsive Dark-Theme UI**: Modern UI that looks great on mobile, tablet, and desktop browsers.
- 🧪 **1-Click Demo Accounts**: Test immediately with pre-filled test users (`student1`, `student2`).

---

## 📁 Project Structure

```
chat_app_onlineclass/
│
├── client/                     # Frontend Single Page Web App
│   ├── css/
│   │   └── style.css           # Modern dark UI, responsive styles, animations
│   ├── js/
│   │   ├── api.js              # Fetch client for REST API endpoints
│   │   ├── socket.js           # Socket.io connection & event handlers
│   │   └── app.js              # State management & UI interaction logic
│   └── index.html              # Main HTML entrypoint (served at http://localhost:5000)
│
├── server/                     # Backend Node.js & Express API
│   ├── src/
│   │   ├── config/env.js       # Environment configuration
│   │   ├── controllers/        # authController, chatController, messageController, userController
│   │   ├── middleware/         # auth.js, error.js, upload.js
│   │   ├── models/             # User.js, Chat.js, Message.js (MongoDB Schemas)
│   │   ├── routes/             # authRoutes, userRoutres, chatRoutes, messageRoutes, index.js
│   │   ├── services/           # chatService.js
│   │   └── socket/             # socketHandler.js (WebSockets real-time logic)
│   ├── uploads/                # Directory for uploaded media & attachments
│   ├── .env                    # MongoDB URI, Port, JWT Secret
│   ├── app.js                  # Express setup, static frontend serving, middlewares
│   ├── package.json            # Server dependencies
│   └── server.js               # HTTP & Socket.io server entry point
│
├── .vscode/
│   └── launch.json             # 1-click VS Code Run / Debug configuration
├── .env                        # Root environment variables
├── package.json                # Root package for running anywhere
└── README.md
```

---

## 💻 How to Run in VS Code (Step-by-Step)

### Method 1: Using VS Code Integrated Terminal (Recommended)

1. Open the project folder in VS Code (`File` > `Open Folder...` > select `chat_app_onlineclass`).
2. Open the built-in terminal in VS Code:
   - Shortcut: Press <kbd>Ctrl</kbd> + <kbd>`</kbd> (backtick), OR from top menu click **Terminal** > **New Terminal**.
3. Type the following command and press Enter:
   ```bash
   npm run dev
   ```
   *(or if you prefer without nodemon: `npm start`)*
4. You will see:
   ```
   MongoDB Connected Successfully
   ===========================================
   🚀 Chat App Server running on port 5000
   🌐 Local URL: http://localhost:5000
   ===========================================
   ```
5. Open your browser and go to:
   👉 **`http://localhost:5000`**

---

### Method 2: 1-Click Run with F5 in VS Code

1. Press <kbd>F5</kbd> on your keyboard (or click **Run & Debug** on the left sidebar and click the green Play button: `Start Chat App (Full Stack)`).
2. It will automatically start the server in your terminal.
3. Open `http://localhost:5000` in your web browser!

---

### 🧪 How to Test Real-Time Chatting

1. Open **`http://localhost:5000`** in your normal browser window.
2. Click the **"Demo User 1"** button and click **Sign In** (or register a new user).
3. Open a second browser window (e.g. Incognito / Private window or another browser).
4. Go to **`http://localhost:5000`**, click **"Demo User 2"** and click **Sign In**.
5. You can now chat between User 1 and User 2 in real-time, see green online dots, live typing indicators, and send attachments!
