import { auth, db } from "@/constants/firebase";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";

export async function createUserProfile({ name, email }) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    displayName: user.displayName || "",
    email: user.email,
    bio: "",
    favoriteCategories: [],
    favoritesCount: 0,
    theme: "light", 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Si no existe el perfil, crearlo automáticamente
    await setDoc(ref, {
      displayName: user.displayName || "",
      email: user.email || "",
      bio: "",
      favoriteCategories: [],
      theme: "light",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      bio: "",
      favoriteCategories: [],
      theme: "light",
    };
  }

  return {
    uid: user.uid,
    ...snap.data(),
  };
}

export async function updateUserProfileName(newName) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    displayName: newName,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateUserProfileEmail(newEmail) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    email: newEmail,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateUserBio(bio) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    bio: bio,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateFavoriteCategories(categories) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    favoriteCategories: categories,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateUserTheme(theme) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    theme: theme,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}


export async function getFavoritesCount() {
  const user = auth.currentUser;
  if (!user) return 0;

  const favoritesRef = collection(db, `users/${user.uid}/favorites`);
  const snapshot = await getDocs(favoritesRef);
  return snapshot.size;
}