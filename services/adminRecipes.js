
import { db } from "@/constants/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function createRecipe(recipeId, data) {
  if (!recipeId) throw new Error("recipeId es requerido");

  const ref = doc(db, "recipes", recipeId);

  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return recipeId;
}


export async function updateRecipe(recipeId, partialData) {
  if (!recipeId) throw new Error("recipeId es requerido");

  const ref = doc(db, "recipes", recipeId);

  await updateDoc(ref, {
    ...partialData,
    updatedAt: serverTimestamp(),
  });

  return recipeId;
}


export async function deleteRecipe(recipeId) {
  if (!recipeId) throw new Error("recipeId es requerido");

  await deleteDoc(doc(db, "recipes", recipeId));
  return recipeId;
}