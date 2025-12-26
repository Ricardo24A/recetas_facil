import { auth, db } from "@/constants/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function emptyWeek() {
  const base = {};
  for (const d of DAYS) base[d] = null;

  return {
    breakfast: { ...base },
    lunch: { ...base },
    dinner: { ...base },
    updatedAt: serverTimestamp(),
  };
}

export async function initPlannerWeek(weekStart) {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/planner/${weekStart}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, emptyWeek());
  }
}

export async function getPlannerWeek(weekStart) {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/planner/${weekStart}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : emptyWeek();
}

export async function setPlannerSlot(weekStart, mealType, day, recipeId) {
  const uid = auth.currentUser.uid;
  const ref = doc(db, `users/${uid}/planner/${weekStart}`);

  await setDoc(
    ref,
    {
      [mealType]: { [day]: recipeId }, // actualiza solo ese slot
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function clearPlannerSlot(weekStart, mealType, day) {
  return setPlannerSlot(weekStart, mealType, day, null);
}