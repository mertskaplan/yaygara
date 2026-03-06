# Yaygara

Yaygara is a vibrant, mobile-first, and offline-ready party game based on narration and guessing. It brings people together for fast-paced fun, blending the best elements of classic games like Taboo and Charades.

**Live Demo:** [https://yaygara.mertskaplan.com](https://yaygara.mertskaplan.com)

## 📱 Screenshots

<div align="center">
  <img src="https://raw.githubusercontent.com/mertskaplan/yaygara/main/public/promotional-image-1.png" width="45%" />
  <img src="https://raw.githubusercontent.com/mertskaplan/yaygara/main/public/promotional-image-2.png" width="45%" />
</div>

## ✨ Key Features

- **Unlimited Decks with Master Prompt:** Create custom word decks instantly using a specialized AI prompt.
- **Mobile-First Design:** Optimized for a seamless experience on smartphones and tablets.
- **PWA Support:** Installable as a native-like app on your home screen.
- **Audio Feedback:** Immersive sound effects for correct answers, passes, and timer alerts.
- **Customizable Game Rules:** Set the number of teams, turn duration, and word count per game.
- **Team Customization:** Choose your own team names and vibrant colors.
- **Multi-language Support:** Play in English or Turkish.
- **Offline Capable:** Works perfectly without an internet connection once loaded.
- **Ready-to-Play Decks:** Comes with numerous built-in word decks across various categories.
- **Auto-Pause:** The game automatically pauses if you switch tabs or leave the app.

## 🛠 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Zustand (with Persistence & Immer)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Runtime:** Bun

## 🚀 Getting Started

### 🐋 Run with Docker (Recomended)

You can run Yaygara directly from Docker Hub with a single command:

```bash
docker run -d -p 8727:80 mertskaplan/yaygara
```

#### Using Docker Compose

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'
services:
  yaygara:
    image: mertskaplan/yaygara:latest
    container_name: yaygara
    ports:
      - "8727:80"
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

### 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mertskaplan/yaygara.git
   cd yaygara
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Start the development server:**
   ```bash
   bun run dev
   ```

## 📂 Project Structure

- `src/components/`: Reusable UI components and modals.
- `src/pages/`: Main application screens (Home, Setup, Game, Score).
- `src/stores/`: Game state management using Zustand.
- `src/lib/`: Utilities for sound, deck fetching, and helper functions.
- `src/hooks/`: Custom React hooks for translations and logic.
- `public/decks/`: JSON files containing the word decks.
- `prompts/`: Specialized prompts for AI deck generation.

## File Tree

```bash
├── 📁 prompts
├── 📁 public
│   ├── 📁 decks
│   ├── 📁 icons
│   ├── 📁 locales
├── 📁 src
│   ├── 📁 assets
│   ├── 📁 components
│   │   ├── 📁 ui
│   ├── 📁 hooks
│   ├── 📁 lib
│   ├── 📁 pages
│   ├── 📁 stores
│   ├── 📁 types
├── 📁 worker
```

## 🃏 Adding New Decks

To add a new word deck to the game:
1. Create a JSON file in `public/decks/` following this structure:
   ```json
   {
     "id": "my-cool-deck.en",
     "name": "My Cool Deck",
     "language": "en",
     "difficulty": "medium",
     "words": [
       { "term": "Example", "hint": "A short clue", "difficulty": 1 }
     ]
   }
   ```
2. Add the filename (e.g., `"my-cool-deck.en.json"`) to the array in `public/decks-manifest.json`.

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

Built with ❤️ by [Mert S. Kaplan](https://mertskaplan.com).