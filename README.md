# GuessPlosion: The Playful Word Party Game
GuessPlosion is a vibrant, mobile-first, offline-capable Progressive Web App (PWA) designed as a word-guessing party game. Inspired by classics like Taboo and Charades, it's built for fun, fast-paced team play. The entire application runs client-side with no server dependency, ensuring privacy and full offline functionality. The user experience is defined by a 'Kid Playful' art style, featuring bright colors, rounded shapes, and charming animations.
The game flow guides users through a simple setup process: selecting a language, choosing the number of teams (2-4), customizing team names and colors, and picking a word deck. The core gameplay consists of three distinct rounds, each with unique rules: 1) Free description, 2) One-word clues, and 3) Charades (acting only). Teams score points based on the difficulty of correctly guessed words within a 60-second timer. The game culminates in a final scoreboard celebrating the winning team.
## ✨ Key Features
-   **Mobile-First & Responsive:** Flawless experience on any device, from phones to desktops.
-   **Offline Ready (PWA):** Play anywhere, anytime, even without an internet connection.
-   **Team-Based Gameplay:** Supports 2, 3, or 4 teams for exciting party action.
-   **Three Unique Rounds:** Progress through rounds of free description, one-word clues, and charades.
-   **Multi-Language Support:** Easily switch between supported languages.
-   **Custom Decks:** Upload your own word decks from a local JSON file for endless variety.
-   **Zero Server Dependency:** Runs entirely in your browser, ensuring 100% privacy.
-   **Playful UI:** A delightful, kid-friendly design with smooth animations and micro-interactions.
## 🛠️ Technology Stack
-   **Framework:** React (with Vite)
-   **Styling:** Tailwind CSS with shadcn/ui components
-   **State Management:** Zustand
-   **Routing:** React Router
-   **Animation:** Framer Motion
-   **Icons:** Lucide React
-   **Deployment:** Cloudflare Pages & Workers / Docker
## 🚀 Getting Started
Follow these instructions to get a local copy up and running for development and testing purposes.
### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/mertskaplan/guessplosion.git
   cd guessplosion
   ```
2. **Install dependencies:**
   ```sh
   bun install
   ```
3. **Run the development server:**
   ```sh
   bun run dev
   ```
The application will be available at `http://localhost:3000` (or the next available port).
## 🐳 Running with Docker
If you have Docker and Docker Compose installed, you can easily build and run the application in a containerized environment.
1. **docker-composer.yml**
   ```
   version: '3.8'
   services:
     guessplosion:
       build:
         context: https://github.com/mertskaplan/guessplosion.git
         dockerfile: Dockerfile
       container_name: guessplosion
       ports:
         - "8622:80"
       restart: unless-stopped
   ```
The application will be available at `http://localhost:8622`.
## 📁 Project Structure
The project follows a standard Vite + React structure with some key directories:
-   `public/`: Contains all static assets.
    -   `public/decks/`: JSON files for word decks (e.g., `animals.en.json`).
    -   `public/locales/`: JSON files for UI translations (e.g., `en.json`).
-   `src/`: Main application source code.
    -   `src/components/`: Reusable React components, including `shadcn/ui`.
    -   `src/pages/`: Top-level route components (views).
    -   `src/stores/`: Zustand stores for global state management.
    -   `src/types/`: TypeScript type definitions.
-   `worker/`: Cloudflare Worker code for serving the application.
## 🔧 Development
### Available Scripts
-   `bun run dev`: Starts the local development server with hot-reloading.
-   `bun run build`: Bundles the application for production.
-   `bun run lint`: Lints the codebase using ESLint.
-   `bun run preview`: Serves the production build locally for testing.
### Adding New Content
-   **To add a new word deck:**
    1.  Create a new JSON file in `public/decks/` following the format `deck-name.lang.json`. The file must be self-contained with `id`, `name`, `language`, `count`, and a `words` array.
    2.  Add the new deck's filename to the `deckIds` array in `src/pages/SetupPage.tsx`.
-   **To add a new language:**
    1.  Create a new translation file in `public/locales/` (e.g., `es.json`).
    2.  Update the language selection UI in the `HomePage` component to include the new option.
## ☁️ Deployment
This project is configured for seamless deployment to **Cloudflare Pages**.
### One-Click Deploy
You can deploy your own version of GuessPlosion with a single click:
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mertskaplan/guessplosion)
### Manual Deployment with Wrangler
1.  **Login to Wrangler:**
    ```sh
    bunx wrangler login
    ```
2.  **Build the project:**
    ```sh
    bun run build
    ```
3.  **Deploy to Cloudflare:**
    ```sh
    bun run deploy
    ```
Wrangler will handle the process of uploading your static assets and deploying the worker function.