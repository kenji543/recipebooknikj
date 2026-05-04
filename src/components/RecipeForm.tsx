import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Upload, Utensils, Clock, Save, ArrowLeft } from "lucide-react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Ingredient, Recipe } from "../types";

export default function RecipeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/recipes/${id}`)
        .then((res) => res.json())
        .then((data: Recipe) => {
          setTitle(data.title);
          setPrepTime(data.prep_time_minutes.toString());
          setIngredients(data.ingredients.length > 0 ? data.ingredients : [
            { name: "", amount: "" },
            { name: "", amount: "" },
            { name: "", amount: "" },
          ]);
          if (data.photo_url) {
            setPhotoPreview(data.photo_url);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch recipe:", err);
          setIsLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const nextIngredients = [...ingredients];
    nextIngredients[index][field] = value;
    setIngredients(nextIngredients);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("prep_time_minutes", prepTime);
    if (photo) {
      formData.append("recipe_photo", photo);
    }
    
    const validIngredients = ingredients.filter(ing => ing.name.trim() || ing.amount.trim());
    formData.append("ingredients", JSON.stringify(validIngredients));

    try {
      const url = isEditing ? `/api/recipes/${id}` : "/api/recipes";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to save recipe");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-natural-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-natural-accent font-medium mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-[40px] p-8 lg:p-16 shadow-sm border border-natural-border">
        <header className="mb-12 text-left lg:text-center">
          <div className="w-16 h-16 bg-natural-accent/5 rounded-full flex items-center justify-center lg:mx-auto mb-6">
            <Utensils className="text-natural-accent" size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif italic text-natural-text leading-tight">
            {isEditing ? "Modify Signature Dish" : "Create Signature Dish"}
          </h2>
          <p className="text-natural-muted font-serif italic mt-2">Record your culinary secrets for the next generation.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Media & Primary Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-natural-accent font-bold px-1">Dish Presentation</label>
                <div className="relative group">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    <div className="w-full h-80 lg:h-[420px] bg-natural-bg border-2 border-dashed border-natural-border rounded-[32px] flex flex-col items-center justify-center text-natural-muted hover:bg-natural-accent/5 hover:border-natural-accent/40 transition-all overflow-hidden relative">
                      {photoPreview ? (
                        <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <Upload size={32} className="mb-2 opacity-40" />
                          <span className="font-serif italic">Upload a photo of the finished dish</span>
                        </>
                      )}
                      {photoPreview && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="bg-white text-natural-accent px-6 py-2 rounded-full font-bold text-sm shadow-lg">Change Selection</div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-natural-accent font-bold flex items-center gap-2 px-1">
                  <Clock size={12} /> Prep Time (Minutes)
                </label>
                <input 
                  required
                  type="number"
                  placeholder="90"
                  className="w-full bg-white border border-natural-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-natural-accent/10 focus:border-natural-accent/50 transition-all font-serif text-xl placeholder:text-natural-muted/40"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Title & Ingredients */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-natural-accent font-bold px-1">Recipe Title</label>
                <input 
                  required
                  type="text"
                  placeholder="Ex. Classic Beef Bourguignon"
                  className="w-full bg-white border border-natural-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-natural-accent/10 focus:border-natural-accent/50 transition-all font-serif text-2xl placeholder:text-natural-muted/40"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-natural-border pb-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-natural-accent font-bold">Ingredients List</label>
                  <span className="text-[10px] text-natural-muted font-bold uppercase tracking-[0.2em]">{ingredients.length} items</span>
                </div>
                
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {ingredients.map((ing, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Ingredient"
                            className="bg-white border border-natural-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-natural-accent/5 focus:border-natural-accent/30 transition-all font-serif placeholder:text-natural-muted/40"
                            value={ing.name}
                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                          />
                          <input 
                            type="text" 
                            placeholder="Amount"
                            className="bg-white border border-natural-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-natural-accent/5 focus:border-natural-accent/30 transition-all font-serif placeholder:text-natural-muted/40"
                            value={ing.amount}
                            onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                          />
                        </div>
                        {ingredients.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl flex-shrink-0"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddIngredient}
                  className="w-full py-4 border border-dashed border-natural-border rounded-2xl text-natural-muted font-serif italic hover:bg-natural-accent/5 hover:border-natural-accent/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Ingredient Line
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 md:pt-12 border-t border-natural-border">
            <button 
              disabled={isSubmitting}
              className="w-full lg:w-max lg:min-w-[300px] mx-auto bg-natural-accent hover:bg-natural-accent/90 text-white py-6 px-12 rounded-full font-bold shadow-lg shadow-natural-accent/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-widest"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  <span>{isEditing ? "Update Secret Recipe" : "Finalize & Store Recipe"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
