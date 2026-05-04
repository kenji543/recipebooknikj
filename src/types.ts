export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  prep_time_minutes: number;
  photo_url: string | null;
  ingredients: Ingredient[];
  createdAt: string;
}
