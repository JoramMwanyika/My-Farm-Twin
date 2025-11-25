# AgriVoice

AgriVoice is a mobile-first digital twin platform and AI advisor designed specifically for smallholder farmers. It aims to bridge the technology gap by providing accessible, high-contrast, and easy-to-use agricultural insights.

## Features

- **Smart Dashboard**: Instant access to real-time weather, soil health summaries, and daily farming tasks.
- **Farm Digital Twin**: Interactive visual map of farm plots, showing crop status, soil moisture levels, and planted varieties.
- **AI Advisor**: A chat interface with voice interaction support to answer farming questions and diagnose issues.
- **Alert System**: Critical warnings for weather events, pest outbreaks, and disease risks using clear, high-contrast visual indicators.
- **User Profile**: Management of personal details, language preferences, and offline mode settings.
- **Accessibility First**: Designed with large touch targets, high-contrast colors (earthy greens/browns with clear alerts), and iconography suitable for low-literacy users.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to run the project on your local machine.

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/your-username/agrivoice.git
    cd agrivoice
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Run the development server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

4.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Main application routes and pages (Dashboard, Advisor, Farm, Alerts, Profile).
- `/components`: Reusable UI components.
  - `/ui`: Fundamental UI building blocks (buttons, cards, inputs).
- `/lib`: Utility functions.
- `/public`: Static assets.

## Usage Guide

- **Navigation**: Use the bottom navigation bar to switch between the Dashboard, Advisor, Farm Twin, Alerts, and Profile.
- **Interactions**:
  - Tap on farm plots in the **Farm** tab to see detailed crop info.
  - Use the microphone icon in the **Advisor** tab to simulate voice input.
  - Check the **Alerts** tab for high-priority warnings.
