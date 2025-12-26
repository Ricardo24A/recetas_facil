import { auth, db } from "@/constants/firebase";
import { doc, setDoc, deleteDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";

export async function addFavorite(recipeId) {
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, `users/${uid}/favorites/${recipeId}`), {
    recipeId,
    addedAt: serverTimestamp(),
  });
}

export async function removeFavorite(recipeId) {
  const uid = auth.currentUser.uid;
  await deleteDoc(doc(db, `users/${uid}/favorites/${recipeId}`));
}

export async function getFavoriteIds() {
  const uid = auth.currentUser.uid;
  const snap = await getDocs(collection(db, `users/${uid}/favorites`));
  return snap.docs.map((d) => d.id); // d.id = recipeId
}