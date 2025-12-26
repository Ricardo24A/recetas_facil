import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/constants/firebase";

const recipes = [
  {
    id: "pasta-carbonara",
    title: "Pasta Carbonara",
    description: "Clásica pasta italiana cremosa con tocino y queso",
    imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    prepTime: "20 min",
    servings: 4,
    difficulty: "Fácil",
    category: "Pasta",
    ingredients: [
      "400g de espagueti",
      "200g de tocino",
      "4 huevos",
      "100g de queso parmesano",
      "Pimienta negra",
      "Sal al gusto",
    ],
    instructions: [
      "Cocinar la pasta en agua con sal según el paquete",
      "Freír el tocino hasta que esté crujiente",
      "Batir los huevos con el parmesano",
      "Mezclar pasta con tocino",
      "Retirar del fuego y agregar huevo revolviendo rápido",
      "Servir con pimienta",
    ],
  },
  {
    id: "ensalada-cesar",
    title: "Ensalada César",
    description: "Fresca ensalada con pollo y aderezo cremoso",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    prepTime: "15 min",
    servings: 2,
    difficulty: "Fácil",
    category: "Ensaladas",
    ingredients: [
      "1 lechuga romana",
      "2 pechugas de pollo",
      "Crutones",
      "50g de queso parmesano",
      "Aderezo César",
      "Aceite de oliva",
    ],
    instructions: [
      "Cocinar el pollo a la plancha",
      "Cortar la lechuga",
      "Cortar el pollo en tiras",
      "Mezclar lechuga con aderezo",
      "Agregar pollo, crutones y parmesano",
      "Servir",
    ],
  },
];

export async function seedRecipes() {
  for (const r of recipes) {
    await setDoc(doc(db, "recipes", r.id), {
      ...r,
      createdAt: serverTimestamp(),
    });
  }
  console.log("Recetas agregadas/actualizadas.");
}