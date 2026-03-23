# 🌆 Neon Image Editor

**Neon Image Editor** is an AI-powered image processing web application, wrapped in an 80s *Retrowave / Synthwave* aesthetic with a "Pastel Milkshake" color palette.

The application allows users to transform their photos using advanced neural filters, offering a nostalgic and interactive visual experience.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="/src/assets/neon.png" />
</div>




## ✨ Key Features

* **AI-Powered Processing:** Direct integration with **Gemini 3.1 Flash Image** for high-fidelity transformations.
* **Neural Modules (Filters):**
    * 🪄 **Remove Background:** Extracts the main subject cleanly.
    * 🖼️ **Random Background:** Generates a new contextual environment for the image.
    * 👕 **Change Clothes:** Intelligently modifies the subject's outfit.
    * 🌙 **Make it Night:** Applies night-time lighting and context.
    * ☀️ **Make it Day:** Transforms dark scenes into daylight environments.
* **Retrowave Interface:**
    * Classic OS window-style image viewer.
    * "Capsule" buttons with dynamic color interactions and pastel glow effects.
    * Animated floating particles (Bits) background and 3D perspective grid.
    * Retro typography (`Press Start 2P`) combined with readable terminal fonts (`Orbitron`).
* **File Management:** Local image upload and direct one-click download of processed results.

## 🛠️ Technologies Used

* **Frontend:** React (with TypeScript) + Vite
* **Styling:** Tailwind CSS (with custom CSS variables for neon effects)
* **Animations:** Framer Motion (`motion/react`) for micro-interactions and fluid state transitions.
* **Icons:** Lucide React
* **Artificial Intelligence:** Google Gemini 3.1 Flash Image Preview API

## 🚀 Installation and Usage


1. Clone this repository:
   ```bash
   git clone https://github.com/luuzuriaga/Neon-editor.git


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in https://neon-editor-six.vercel.app/

## Run Locally

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn
* A valid Google AI Studio API Key with billing enabled (required for the Gemini Flash Image model).


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
