import { auth, db } from "@/constants/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";

export async function checkIsAdmin() {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error("Error verificando admin:", error);
    return false;
  }
}


export async function createRecipe(recipeData) {
  const user = auth.currentUser;
  if (!user) throw new Error("No autenticado");

  try {
    const recipeToSave = {
      ...recipeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
    };

    const docRef = await addDoc(collection(db, "recipes"), recipeToSave);
    console.log("Receta creada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creando receta:", error);
    throw error;
  }
}


export async function updateRecipe(recipeId, recipeData) {
  const user = auth.currentUser;
  if (!user) throw new Error("No autenticado");

  try {
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, {
      ...recipeData,
      updatedAt: serverTimestamp(),
    });
    console.log("Receta actualizada:", recipeId);
  } catch (error) {
    console.error("Error actualizando receta:", error);
    throw error;
  }
}

export async function deleteRecipe(recipeId) {
  const user = auth.currentUser;
  if (!user) throw new Error("No autenticado");

  try {
    await deleteDoc(doc(db, "recipes", recipeId));
    console.log("Receta eliminada:", recipeId);
  } catch (error) {
    console.error("Error eliminando receta:", error);
    throw error;
  }
}
