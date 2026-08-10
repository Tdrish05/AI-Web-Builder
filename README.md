# 🚀 AI Web Builder

A powerful, production-grade MERN stack AI Website Builder that allows users to describe website ideas in plain English and instantly watch the AI design, structure, and launch fully-interactive React/JSX web applications.

👉 **[Launch Live Web App](https://ai-web-builder-rho.vercel.app)**

---

## 🌟 Key Features

* **Instant AI Generation**: Powered by the state-of-the-art **Gemini 3.6 Flash** model, delivering full-fidelity web pages in minutes.
* **Bulletproof Build Process**: Implements strict sequential processing, hard inter-file sleep delays (8 seconds), and exponential backoff retry algorithms to guarantee successful builds without hitting API rate limits.
* **Auto-Fixing JSX Parser**: Automatically intercepts common AI syntax mistakes (such as malformed arrow function elements like `= />`) and corrects them on the fly before compiling.
* **Global Theme Switching**: Fully supports cohesive and high-contrast **Light Mode** (soft warm sand and oatmeal clay palette) and **Dark Mode** (sunset gradient with deep charcoal colors).
* **Live Sandbox & Preview**: Renders code directly inside an interactive Sandpack environment, allowing real-time edits, code exporting (ZIP), and public link publishing.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons, Sandpack React SDK.
* **Backend**: Node.js, Express, Mongoose, Google AI SDK.
* **Database**: MongoDB.
* **Deployments**: Vercel (Client) & Render (Server).

---

## ⚙️ Quick Start (Local Setup)

### Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or MongoDB Atlas URI)
* Gemini API Key

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Tdrish05/AI-Web-Builder.git
   cd AI-Web-Builder
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   # Create a .env file with PORT, MONGODB_URI, JWT_SECRET, and GEMINI_API_KEY
   npm run dev
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   # Create a .env file with VITE_BASE_URL=http://localhost:3000
   npm run dev
   ```

---

## 📡 Live Deployments

* **Frontend Client (Vercel)**: [https://ai-web-builder-rho.vercel.app](https://ai-web-builder-rho.vercel.app)
* **Backend Server (Render)**: [https://ai-web-builder-omom.onrender.com](https://ai-web-builder-omom.onrender.com)
