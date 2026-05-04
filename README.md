# 📖 Digital Cookbook

A polished, full-stack web application designed for chefs to transition from handwritten notes to a digital archive. This application manages recipes, ingredients, and photos with a focus on ease of use and a beautiful "Natural Tones" aesthetic.

## ✨ Features

- **Digital Recipe Binder**: A responsive dashboard displaying all your signature dishes in an elegant grid.
- **Dynamic Ingredient Forms**: Add or remove ingredients on the fly when creating or editing recipes using a dynamic formset.
- **Local Photo Storage**: Securely upload and store photos of your finished dishes locally on the server.
- **Smart Time Formatting**: Automatic conversion of raw minutes into readable formats (e.g., "90" becomes "1 hr 30 mins").
- **Full CRUD Support**: Create, Read, Update, and Delete your recipes with intuitive controls.
- **Natural Tones Design**: A handcrafted UI featuring high-quality typography (Cormorant Garamond & Inter) and a warm, organic color palette.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion (Animations), Lucide React (Icons).
- **Backend**: Node.js, Express, Multer (File Uploads), UUID.
- **Storage**: Local filesystem for JSON data and uploaded images.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### Installation

1. Clone or download the source code.
2. Install the core dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the development server (runs both the Express backend and Vite frontend):

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

- `/src/components`: React components for core views (Dashboard, Recipe Form).
- `/src/lib`: Utility functions for time formatting and class merging.
- `/server.ts`: Express server handling API routes and file uploads.
- `/uploads`: Directory where recipe photos are saved.
- `/data`: Directory where the `recipes.json` database resides.

## 📜 License

This project is built for the "Digital Cookbook" assignment. See `package.json` for dependency licenses.

