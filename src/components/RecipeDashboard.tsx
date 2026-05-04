import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Users, ArrowRight, Plus, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Recipe } from "../types";
import { formatMinutes } from "../lib/utils";

export default function RecipeDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = () => {
    setLoading(true);
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the recipe for "${title}"?`)) {
      try {
        const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchRecipes();
        } else {
          alert("Failed to delete recipe");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-natural-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto py-10 px-6 md:px-10"
    >
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-2 text-natural-text">The Seasonal Table</h1>
          <p className="text-natural-muted text-xs md:text-sm tracking-wide uppercase font-bold">Manage and view your collection of {recipes.length} active recipes</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/add" 
            className="px-6 py-2.5 bg-natural-accent text-white rounded-full text-sm font-medium hover:bg-natural-accent/90 transition-colors flex items-center gap-2 shadow-lg shadow-natural-accent/20"
          >
            <Plus size={16} /> New Recipe
          </Link>
        </div>
      </header>

      {recipes.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[40px] border border-natural-border shadow-sm">
          <p className="text-natural-muted font-serif italic text-xl">Your culinary binder is empty. Start by adding a signature dish.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[32px] overflow-hidden border border-natural-border shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="h-56 relative overflow-hidden bg-natural-border/20">
                {recipe.photo_url ? (
                  <img 
                    src={recipe.photo_url} 
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-natural-accent/20">
                    <UtensilsCrossed size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-sm">
                  {recipe.ingredients.length > 10 ? 'Main' : 'Entree'}
                </div>
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Link 
                    to={`/edit/${recipe.id}`}
                    className="p-3 bg-white text-natural-accent rounded-full hover:bg-natural-accent hover:text-white transition-all transform hover:scale-110 shadow-lg"
                    title="Edit Recipe"
                  >
                    <Edit2 size={20} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(recipe.id, recipe.title)}
                    className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-lg"
                    title="Delete Recipe"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif italic text-natural-text group-hover:text-natural-accent transition-colors leading-tight">
                    {recipe.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-natural-highlight bg-natural-tag-bg px-2 py-1 rounded whitespace-nowrap ml-2">
                    {formatMinutes(recipe.prep_time_minutes)}
                  </span>
                </div>
                
                <p className="text-xs text-natural-muted mb-6 line-clamp-2 italic font-serif">
                  {recipe.ingredients.map(i => i.name).join(", ")}...
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-natural-border/50">
                  <span className="text-[10px] uppercase font-bold text-natural-accent tracking-widest">
                    {recipe.ingredients.length} Ingredients
                  </span>
                  <Link to={`/edit/${recipe.id}`} className="text-natural-accent text-xs font-semibold underline underline-offset-4 hover:text-natural-highlight transition-colors">
                    View & Edit
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function UtensilsCrossed({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="m3 2 2 2m-2 2 2-2m0 0 1.1-1.1c.1-.1.3-.1.4 0l1.2 1.2c.1.1.1.3 0 .4L4.4 7.2c-.1.1-.3.1-.4 0L2.8 6c-.1-.1-.1-.3 0-.4L3.9 4.5M3 11l2-2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V2" />
      <path d="M17 15l4 7" />
    </svg>
  );
}
