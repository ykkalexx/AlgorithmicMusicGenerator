## Algorithmic Music Generator API

- This website will be used to generate algorithmic music sequences based on user inputs (mood, tempo, instruments)
- Build with libraries like tone.js

## Technical Stack

### Frontend

- React.js
- Tone.js for audio synthesis
- TypeScript
- Tailwind for styling

### Backend

- Node.js
- Express.js
- TypeScript
- MySQL

## Core Features

- Mood-based music generation
- Adjustable tempo control
- Instrument selection
- Real-time music generation
- Save/Export generated sequences

## Planned API Endpoints

```json
POST /api/generate
  - mood: string
  - tempo: number
  - instruments: string[]

GET /api/sequences
POST /api/sequences/save
GET /api/instruments
```
