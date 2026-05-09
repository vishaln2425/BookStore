<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-3D-black?style=for-the-badge&logo=threedotjs" alt="R3F" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />

  <br />
  <br />

  <h1>📚 Swipe Books</h1>
  <p>
    <b>An Immersive 3D Interactive Bookstore & Reading Platform with an AI Literary Companion.</b>
  </p>
</div>

<br />

## 📖 Overview

**Swipe Books** reimagines the digital reading experience. Instead of scrolling through flat, lifeless PDFs, Swipe Books provides an **immersive 3D reading sanctuary** where books feel physical, tangible, and real. Combined with a beautiful glassmorphism UI and fluid animations, this platform bridges the gap between digital convenience and physical elegance.

Additionally, the project features **SwipeAI**, a state-aware AI literary companion that seamlessly integrates into your reading flow—ready to answer questions, summarize chapters, and discuss literature contextually.

> **Academic Project Note:** This project was built as a DBMS Microproject by **Vishal Rajendra Nikam** and **Prajwal Mahadev Nikas** for KJ College of Engineering Management & Research, Pune.

---

## ✨ Key Features

- **Immersive 3D Real Book Reader:** Powered by `react-three/fiber` and `pdfjs-dist`, PDFs are rendered directly onto 3D meshes with interactive page-flipping mechanics.
- **SwipeAI Literary Companion:** A built-in chat widget powered by a Spring Boot/Gemini backend. Ask questions about the book you are currently viewing and get intelligent, contextual responses.
- **Dynamic & Fluid UI:** Silky smooth transitions, elegant modals, and layout animations crafted with `framer-motion`.
- **Editorial Aesthetic:** High-fidelity, minimalist design featuring curated typography, rich glassmorphic overlays, and refined color palettes.
- **Search & Filter Ecosystem:** Effortlessly browse the library, filter by genre, and discover your next read in a responsive grid layout.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14, React 18
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, `@use-gesture/react`
- **3D Engine:** Three.js, React Three Fiber, Drei
- **PDF Rendering:** PDF.js (`pdfjs-dist`)

### Backend (API Services)
- **Framework:** Spring Boot (Java)
- **AI Integration:** Google Gemini API for the SwipeAI chatbot (`AiService.java`)
- **Controllers:** REST APIs to serve books and chat interactions.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed. For the backend, Java 17+ and Maven/Gradle are required.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/swipe-books.git
```

### 2. Run the Frontend
Navigate to the frontend directory:
```bash
cd swipe-books
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📸 Demo Video

<video src="./public/video.mov" width="100%" controls></video>

---

## 👨‍💻 Authors

Built with passion and a love for reading by:
- **Vishal Rajendra Nikam** (SEBCOMP56)

KJ College of Engineering Management & Research, Pune.

---

<div align="center">
  <i>If you like this project, please consider giving it a ⭐!</i>
</div>
