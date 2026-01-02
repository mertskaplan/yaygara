# Yaygara
Yaygara is a vibrant, mobile-first, offline-ready party game for teams. Inspired by classics like Taboo and Charades, it brings people together for fast-paced word-guessing fun.
## 🚀 Features
- **Kid-Playful Design:** Bright colors, rounded shapes, and bouncy animations for a friendly atmosphere.
- **3 Unique Rounds:**
  1.  **Free Description:** Say anything except the word itself!
  2.  **One Word:** Choose your single clue wisely.
  3.  **Charades:** Silent acting only—no words allowed!
- **Offline Capable:** Full Progressive Web App (PWA) support. Play anywhere, even without an internet connection.
- **Customizable:**
  - Support for 2-4 teams.
  - Personalized team names and colors.
  - Adjustable turn durations and word counts.
- **Custom Decks:** Upload your own word lists via JSON files.
- **Bonus Time:** Clear the words early to carry over your remaining seconds to the next round.
## 🛠 Tech Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Zustand (with Immer and Persistence)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Cloudflare Workers / Docker
## 📦 Running with Docker
You can easily run Yaygara using Docker:
```bash
docker-compose up -d
```
The application will be available at `http://localhost:8622`.
## 📖 How to Play
1.  **Setup:** Choose your language, select the number of teams, and pick a word deck.
2.  **Rounds:** The game consists of three rounds using the same set of words.
3.  **Scoring:** Teams earn points based on the difficulty of the words they guess correctly.
4.  **Winning:** The team with the highest total score after three rounds is crowned the champion!
## 📄 License
Built with ❤️ for social gatherings and family fun.