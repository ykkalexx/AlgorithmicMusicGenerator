Live webiste :

### Overview

The Algorithmic Music Generator API allows users to create custom music sequences based on their preferences, including mood, tempo, and instrument choices. It features real-time music generation, adjustable settings, and options to save or export compositions.

### Features

- 🎵 Mood-Based Music Generation
  Generate music tailored to your desired mood.

- 🎚 Adjustable Tempo
  Customize the speed of your composition.

- 🎸 Instrument Selection
  Choose from various instruments for a personalized sound.

- 🕒 Real-Time Music Generation
  Experience instant feedback while creating your masterpiece.

- 💾 Save & Export
  Save compositions and share them easily.

### Technical Stack

#### Frontend

React.js with TypeScript for seamless UI/UX.
Tone.js for audio synthesis and sound generation.
Tailwind CSS for modern, responsive styling.

#### Backend
Node.js with Express.js for API logic.
TypeScript for type-safe backend development.
MySQL as the database to store compositions and presets.

### Environment File

```
### Backend

PORT=3000
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=music_generator

FRONTEND_URL=http://localhost:5173/

### Frontend

BACKEND_SERVER=http://localhost:3000/api
```

### How to Run

- Clone the repository:

```bash
git clone https://github.com/ykkalexx/AlgorithmicMusicGenerator.git
```

- Install dependencies for both frontend and backend:

```bash
cd frontend && npm install
cd backend && npm install
```

Start the development servers:

```bash
Frontend: npm start
Backend: npm run dev
```

Access the app at http://localhost:3000.
