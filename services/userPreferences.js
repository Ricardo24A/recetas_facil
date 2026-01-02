import { auth, db } from "@/constants/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Guarda la preferencia del tema del usuario en Firestore
 * @param {"light" | "dark"} theme 
 */
export async function saveThemePreference(theme) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.log("saveThemePreference: No hay usuario autenticado");
    return;
  }
  
  console.log("saveThemePreference: Guardando tema", theme, "para usuario", uid);
  
  try {
    // Guardar en el documento principal del usuario
    await setDoc(
      doc(db, "users", uid),
      { theme, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    console.log("saveThemePreference: Tema guardado en documento principal");
    
    await setDoc(
      doc(db, `users/${uid}/preferences/theme`),
      { theme, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    console.log("saveThemePreference: Tema guardado en subcolección");
  } catch (error) {
    console.error("saveThemePreference: Error guardando tema", error);
    throw error;
  }
}

/**
 * Obtiene la preferencia del tema del usuario desde Firestore
 * @returns {Promise<"light" | "dark">}
 */
export async function getThemePreference() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.log("getThemePreference: No hay usuario autenticado");
    return "light";
  }
  
  console.log("getThemePreference: Obteniendo tema para usuario", uid);
  
  try {

    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists() && userSnap.data().theme) {
      console.log("getThemePreference: Tema encontrado en documento principal:", userSnap.data().theme);
      return userSnap.data().theme;
    }

    const prefSnap = await getDoc(doc(db, `users/${uid}/preferences/theme`));
    if (prefSnap.exists() && prefSnap.data().theme) {
      console.log("getThemePreference: Tema encontrado en subcolección:", prefSnap.data().theme);
      return prefSnap.data().theme;
    }
    
    console.log("getThemePreference: No se encontró tema guardado, usando light");
    return "light";
  } catch (error) {
    console.error("getThemePreference: Error obteniendo tema", error);
    return "light";
  }
}
