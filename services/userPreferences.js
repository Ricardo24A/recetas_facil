import { auth, db } from "@/constants/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Guarda la preferencia del tema del usuario en Firestore
 * @param {"light" | "dark"} theme 
 */
export async function saveThemePreference(theme) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  
  await setDoc(
    doc(db, `users/${uid}/preferences/theme`),
    { theme, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

/**
 * Obtiene la preferencia del tema del usuario desde Firestore
 * @returns {Promise<"light" | "dark">}
 */
export async function getThemePreference() {
  const uid = auth.currentUser?.uid;
  if (!uid) return "light";
  
  try {
    const snap = await getDoc(doc(db, `users/${uid}/preferences/theme`));
    if (snap.exists()) {
      return snap.data().theme || "light";
    }
    return "light";
  } catch (error) {
    console.log("Error obteniendo preferencia de tema:", error);
    return "light";
  }
}
