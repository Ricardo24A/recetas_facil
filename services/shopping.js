import { auth, db } from "@/constants/firebase";
import {
  arrayRemove,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

function getUserIdOrThrow() {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("No user authenticated");
  return userId;
}

export function listenShoppingRecipes(onChange) {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};

  const shoppingCollectionRef = collection(db, `users/${userId}/shoppingRecipes`);

  return onSnapshot(shoppingCollectionRef, (snapshot) => {
    const recipes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    onChange(recipes);
  });
}

export async function addRecipeToShopping(recipe) {
  const userId = getUserIdOrThrow();

  const shoppingDocRef = doc(db, `users/${userId}/shoppingRecipes/${recipe.id}`);

  await setDoc(shoppingDocRef, {
    recipeId: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients || [],
    createdAt: serverTimestamp(),
    checkMap: {},

  }, { merge: true });
}

export async function removeRecipeFromShopping(recipeId) {
  const userId = getUserIdOrThrow();
  await deleteDoc(doc(db, `users/${userId}/shoppingRecipes/${recipeId}`));
}

export async function clearShopping() {
  const userId = getUserIdOrThrow();
  const snap = await getDocs(collection(db, `users/${userId}/shoppingRecipes`));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

export async function setIngredientsChecked(recipeId, ingredient, checked) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Usuario no autenticado");

  const ref = doc(db, `users/${userId}/shoppingRecipes/${recipeId}`);

  await updateDoc( ref, {
    [`checkMap.${ingredient}`]: checked,
  });
}

export async function removerIngredientFromReceta(recipeId, ingredient) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Usuario no autenticado");

  const ref = doc(db, `users/${userId}/shoppingRecipes/${recipeId}`);

  await updateDoc( ref, {
    ingredients: arrayRemove(ingredient),
    [`checkMap.${ingredient}`]: deleteField(),
  });
}