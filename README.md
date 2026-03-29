# Yaygara

![Static Badge](https://img.shields.io/badge/Open_Source-%E2%99%A5-turquoise) [![GitHub License](https://img.shields.io/github/license/mertskaplan/yaygara)](https://github.com/mertskaplan/yaygara/blob/main/LICENSE) [![Docker](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com/mertskaplan/yaygara/) [![GitHub release](https://img.shields.io/github/release/mertskaplan/yaygara.svg)](https://github.com/mertskaplan/yaygara/releases/) [![GitHub latest commit](https://badgen.net/github/last-commit/mertskaplan/yaygara)](https://GitHub.com/mertskaplan/yaygara/commit/) [![Website shields.io](https://img.shields.io/website-up-down-brightgreen-red/http/yaygara.mertskaplan.com.svg)](https://yaygara.mertskaplan.com/) [![Docker](https://badgen.net/badge/icon/docker?icon=docker&label)](https://hub.docker.com/r/mertskaplan/yaygara) ![Docker Image Size](https://img.shields.io/docker/image-size/mertskaplan/yaygara)

[![Maintainability](https://qlty.sh/gh/mertskaplan/projects/yaygara/maintainability.svg)](https://qlty.sh/gh/mertskaplan/projects/yaygara) [![CodeFactor](https://www.codefactor.io/repository/github/mertskaplan/yaygara/badge)](https://www.codefactor.io/repository/github/mertskaplan/yaygara) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/mertskaplan/yaygara/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/mertskaplan/yaygara/?branch=master) 

Yaygara is a vibrant, mobile-first, and offline-ready party game based on narration and guessing. It brings people together for fast-paced fun, blending the best elements of classic games like Taboo and Charades.

**Live:** [yaygara.mertskaplan.com](https://yaygara.mertskaplan.com)

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

## 📊 Telemetry

Yaygara includes an optional telemetry system to help improve game balance and deck quality.

- **Disabled by Default:** Telemetry is completely inactive unless explicitly enabled.
- **User Consent:** When enabled, game data is only submitted at the end of the game if the user explicitly chooses to share it.
- **Anonymous Data:** Only game-related data (such as played deck, game duration, and team scores) is collected.

To use telemetry, you must also set up the [Yaygara Telemetry](https://github.com/mertskaplan/yaygara-telemetry) software.

### Docker Configuration
Add these environment variables to your `docker-compose.yml` file:

```yaml
    environment:
      - TELEMETRY_ENABLED=true
      - TELEMETRY_URL=https://lab.mertskaplan.com/yaygara-telemetry/api
```

### Local Development
Run the project with the environment variables:

```bash
VITE_TELEMETRY_ENABLED=true VITE_TELEMETRY_URL=https://lab.mertskaplan.com/yaygara-telemetry/api bun run dev
```

> You can visit *[lab.mertskaplan.com/yaygara-telemetry/](https://lab.mertskaplan.com/yaygara-telemetry/)* (or *[test mode](https://lab.mertskaplan.com/yaygara-telemetry?test)*) to see the telemetry data for the main Yaygara repository. The API address will not accept data from your server. Therefore, you need to set up your own telemetry service and configure the address accordingly.

## 📂 Project Structure

- `src/components/`: Reusable UI components and modals.
- `src/pages/`: Main application screens (Home, Setup, Game, Score).
- `src/stores/`: Game state management using Zustand.
- `src/lib/`: Utilities for sound, deck fetching, and helper functions.
- `src/hooks/`: Custom React hooks for translations and logic.
- `public/decks/`: JSON files containing the word decks.
- `prompts/`: Specialized prompts for AI deck generation.

## 🌲 File Tree

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

Yaygara is free software, and its source code is licensed under the **[GNU General Public License v3.0 (GPLv3)](https://github.com/mertskaplan/yaygara/blob/main/LICENSE)**, while its game content and assets are licensed under **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)**.

Built with ❤️ by [Mert S. Kaplan](https://mertskaplan.com).

## ☕ Support

Free software projects like Yaygara have infrastructure and sustainability costs. To ensure similar projects can be developed ad-free and available to everyone, you can provide support via **[Kreosus](https://kreosus.com/mertskaplan)**.