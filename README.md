# Phase 10 Score Tracker

A simple, modern, and intuitive score tracking application for the classic card game **Phase 10**.

Keep track of everyone's score and current phase without the hassle of pen and paper. The app calculates phases and points automatically and seamlessly handles game sessions.

## Features

- **Player Management**: Easily add and remove players before starting the game.
- **Phase Tracking**: Automatically keeps track of the current phase each player is on. The app knows when a player completes their phase and moves them to the next one automatically.
- **Score Calculation**: Automatically tallies up scores round by round.
- **History & Editing**: View a complete history of all rounds. Did someone make a mistake entering the score? No problem! You can edit past rounds, and the app will automatically recalculate everyone's current phase and total score from that point forward.
- **Winner Detection**: Automatically detects when a player finishes Phase 10 and ends the game.
- **Persistent Storage**: Game state is saved locally in your browser, so you won't lose your progress if you refresh or close the tab.

## User Guide

### Starting a New Game
1. Open the app and you will be greeted with the setup screen.
2. Click **Add Player** to enter a player's name.
3. Once you have at least 2 players added, click the **Start New Game** button.

### Tracking a Round
1. During the game, when a round ends, click the **Complete Round** floating action button at the bottom of the screen.
2. For each player:
   - Enter the points they received that round.
   - Toggle the **Phase Done?** button if they successfully completed their current phase.
3. Click **Confirm Round Scores**. The app will update their scores and advance their phase if they completed it.

### Editing a Past Round
1. Scroll down to the **Game History** section.
2. Find the round you want to correct and click the **Edit** button in its header.
3. Make the necessary adjustments to the points or phase completion status.
4. Click **Save Changes**. The app will automatically recalculate the scores and phases for all subsequent rounds based on your correction!

---

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (if required for AI features).
3. Run the app:
   ```bash
   npm run dev
   ```
