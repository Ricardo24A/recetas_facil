import { auth, db } from "@/constants/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

function getWeekKey(weekStart) {
  const d = new Date(weekStart);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function saveMealPlan(weekStart, planBySlot) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.log("saveMealPlan: No hay usuario autenticado");
    return;
  }

  const weekKey = getWeekKey(weekStart);
  const planRef = doc(db, `users/${uid}/mealPlans`, weekKey);

  try {
    // Si no hay recetas, eliminar el documento
    if (!planBySlot || Object.keys(planBySlot).length === 0) {
      await deleteDoc(planRef);
      console.log("saveMealPlan: Plan eliminado para semana", weekKey);
      return;
    }

    await setDoc(planRef, {
      weekStart: weekStart.toISOString(),
      planBySlot,
      updatedAt: new Date().toISOString(),
    });
    console.log("saveMealPlan: Plan guardado para semana", weekKey);
  } catch (error) {
    console.error("saveMealPlan: Error guardando plan", error);
    throw error;
  }
}


export async function loadMealPlan(weekStart) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.log("loadMealPlan: No hay usuario autenticado");
    return {};
  }

  const weekKey = getWeekKey(weekStart);
  const planRef = doc(db, `users/${uid}/mealPlans`, weekKey);

  try {
    const snap = await getDoc(planRef);
    if (snap.exists()) {
      const data = snap.data();
      console.log("loadMealPlan: Plan cargado para semana", weekKey);
      return data.planBySlot || {};
    }
    console.log("loadMealPlan: No hay plan para semana", weekKey);
    return {};
  } catch (error) {
    console.error("loadMealPlan: Error cargando plan", error);
    return {};
  }
}