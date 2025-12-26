import { db } from "@/constants/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

export async function getAllRecipes({ max = 50 } = {}) {
  const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRecipeById(recipeId) {
  const ref = doc(db, "recipes", recipeId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getRecipesByCategory(category, { max = 50 } = {}) {
  const q = query(
    collection(db, "recipes"),
    where("category", "==", category),
    orderBy("createdAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}