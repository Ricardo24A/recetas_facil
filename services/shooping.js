import { auth, db } from "@/constants/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayRemove,
} from "firebase/firestore";


export async function getActiveShopping() {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/shopping/active`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { recipeIds: [], items: [] };
  return snap.data();
}

export async function initActiveShopping() {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/shopping/active`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      recipeIds: [],
      items: [],
      updatedAt: serverTimestamp(),
    });
  }
}


export async function addRecipeToShopping(recipeId, ingredients) {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/shopping/active`);

  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() : { recipeIds: [], items: [] };

  const currentSet = new Set((current.items || []).map((i) => i.name));
  const newItems = [...(current.items || [])];

  for (const ing of ingredients) {
    if (!currentSet.has(ing)) {
      newItems.push({ name: ing, checked: false });
      currentSet.add(ing);
    }
  }

  await setDoc(
    ref,
    {
      recipeIds: Array.from(new Set([...(current.recipeIds || []), recipeId])),
      items: newItems,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function removeRecipeFromShopping(recipeId) {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/shopping/active`);

  await updateDoc(ref, {
    recipeIds: arrayRemove(recipeId),
    updatedAt: serverTimestamp(),
  });
}

export async function toggleShoppingItem(name, checked) {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/shopping/active`);

  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() : { items: [] };

  const updated = (current.items || []).map((i) =>
    i.name === name ? { ...i, checked } : i
  );

  await setDoc(
    ref,
    { items: updated, updatedAt: serverTimestamp() },
    { merge: true }
  );
}