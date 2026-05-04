import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create uploads and data directories if they don't exist
  const uploadsDir = path.join(__dirname, "uploads");
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const recipesFilePath = path.join(dataDir, "recipes.json");
  if (!fs.existsSync(recipesFilePath)) {
    fs.writeFileSync(recipesFilePath, JSON.stringify([]));
  }

  // Middleware
  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // Configure Multer for local storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });
  const upload = multer({ storage });

  // API Routes
  app.get("/api/recipes", (req, res) => {
    const data = JSON.parse(fs.readFileSync(recipesFilePath, "utf-8"));
    res.json(data);
  });

  app.get("/api/recipes/:id", (req, res) => {
    const recipes = JSON.parse(fs.readFileSync(recipesFilePath, "utf-8"));
    const recipe = recipes.find((r: any) => r.id === req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  });

  app.post("/api/recipes", upload.single("recipe_photo"), (req, res) => {
    try {
      const { title, prep_time_minutes, ingredients } = req.body;
      const file = req.file;

      const parsedIngredients = Array.isArray(ingredients) 
        ? ingredients 
        : JSON.parse(ingredients || "[]");

      const newRecipe = {
        id: uuidv4(),
        title,
        prep_time_minutes: parseInt(prep_time_minutes),
        photo_url: file ? `/uploads/${file.filename}` : null,
        ingredients: parsedIngredients,
        createdAt: new Date().toISOString(),
      };

      const recipes = JSON.parse(fs.readFileSync(recipesFilePath, "utf-8"));
      recipes.push(newRecipe);
      fs.writeFileSync(recipesFilePath, JSON.stringify(recipes, null, 2));

      res.status(201).json(newRecipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ error: "Failed to create recipe" });
    }
  });

  app.put("/api/recipes/:id", upload.single("recipe_photo"), (req, res) => {
    try {
      const { title, prep_time_minutes, ingredients } = req.body;
      const file = req.file;
      const id = req.params.id;

      const recipes = JSON.parse(fs.readFileSync(recipesFilePath, "utf-8"));
      const index = recipes.findIndex((r: any) => r.id === id);

      if (index === -1) return res.status(404).json({ error: "Recipe not found" });

      const parsedIngredients = Array.isArray(ingredients) 
        ? ingredients 
        : JSON.parse(ingredients || "[]");

      // Keep existing photo if a new one wasn't uploaded
      const existingPhoto = recipes[index].photo_url;

      recipes[index] = {
        ...recipes[index],
        title,
        prep_time_minutes: parseInt(prep_time_minutes),
        photo_url: file ? `/uploads/${file.filename}` : existingPhoto,
        ingredients: parsedIngredients,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(recipesFilePath, JSON.stringify(recipes, null, 2));
      res.json(recipes[index]);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ error: "Failed to update recipe" });
    }
  });

  app.delete("/api/recipes/:id", (req, res) => {
    try {
      const id = req.params.id;
      const recipes = JSON.parse(fs.readFileSync(recipesFilePath, "utf-8"));
      const index = recipes.findIndex((r: any) => r.id === id);

      if (index === -1) return res.status(404).json({ error: "Recipe not found" });

      // Optionally delete the photo file from disk here
      const photoPath = recipes[index].photo_url;
      if (photoPath) {
        const fullPath = path.join(__dirname, photoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      recipes.splice(index, 1);
      fs.writeFileSync(recipesFilePath, JSON.stringify(recipes, null, 2));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
