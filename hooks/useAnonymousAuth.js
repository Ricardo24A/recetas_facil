import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/constants/firebase";

export function useAnonymousAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          const res = await signInAnonymously(auth);
          setUser(res.user);
        } else {
          setUser(u);
        }
      } catch (e) {
        console.log("Anonymous auth error:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return { user, loading };
}