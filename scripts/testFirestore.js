import { addDoc, collection } from "firebase/firestore";
import { db } from "../constants/firebase";

export async function testAddRecipe() {
  await addDoc(collection(db, "recipes"), {
    title: "Receta de prueba",
    description: "Solo para verificar conexión",
    imageUrl: "https://example.com/img.jpg",
    prepTime: "10 min",
    servings: 1,
    difficulty: "Fácil",
    category: "Test",
    ingredients: ["Ingrediente 1", "Ingrediente 2"],
    instructions: ["Paso 1", "Paso 2"],
  });
}