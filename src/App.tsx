import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Plus, Home, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import RecipeDashboard from "./components/RecipeDashboard";
import RecipeForm from "./components/RecipeForm";

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="h-16 px-6 md:px-10 border-b border-natural-border flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-natural-accent rounded-lg flex items-center justify-center text-white">
            <UtensilsCrossed size={18} />
          </div>
          <span className="font-bold tracking-tight text-xl font-serif italic text-natural-text">Chef's Binder</span>
        </Link>
      </div>
      
      <div className="flex gap-6 md:gap-8 text-[10px] md:text-sm font-medium uppercase tracking-widest">
        <Link 
          to="/" 
          className={`transition-colors py-1 ${location.pathname === "/" ? "text-natural-accent border-b-2 border-natural-accent" : "text-natural-muted hover:text-natural-accent"}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/add" 
          className={`transition-colors py-1 ${location.pathname === "/add" ? "text-natural-accent border-b-2 border-natural-accent" : "text-natural-muted hover:text-natural-accent"}`}
        >
          Add New Recipe
        </Link>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <span className="text-xs text-natural-muted italic">Chef Julian's Kitchen</span>
        <div className="w-10 h-10 rounded-full bg-natural-highlight border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold ring-1 ring-natural-border">
          JC
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-natural-bg">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<RecipeDashboard />} />
              <Route path="/add" element={<RecipeForm />} />
              <Route path="/edit/:id" element={<RecipeForm />} />
            </Routes>
          </AnimatePresence>
        </main>
        <footer className="px-6 md:px-10 py-6 md:h-12 flex flex-col md:flex-row items-center justify-between border-t border-natural-border bg-white text-[10px] gap-4">
          <div className="flex items-center gap-4 text-natural-muted uppercase tracking-widest font-bold">
            <span>Version 2.4.0</span>
            <span className="hidden md:inline">&bull;</span>
            <span>Local Media Storage Active</span>
          </div>
          <div className="italic text-natural-muted text-center">
            "Cooking is an art, but recipes are an invitation." &mdash; Culinary Archive
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

