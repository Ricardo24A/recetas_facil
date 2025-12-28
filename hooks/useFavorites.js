import { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/constants/firebase";
import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [isFavoriteLoading, setFavoriteIdsLoading] = useState(true);

  useEffect(()=> {
    const userId = auth.currentUser?.uid;
    if(!userId) return;

    const favCollectionRef = collection(db, `users/${userId}/favorites`);

    const quitarFav = onSnapshot(favCollectionRef, (favSnapshot) => {
        const favIds = favSnapshot.docs.map((docSnap) => docSnap.id);
        setFavoriteIds(new Set(favIds));
        setFavoriteIdsLoading(false);
    }, (error) => {
        console.error("Error al escuchar favoritos:", error);
        setFavoriteIdsLoading(false);
    });
    return quitarFav;
  }, []);

  const toggleFavorite = useCallback( async (recipeId) => {
    const userId = auth.currentUser?.uid;
    const favDocRef = doc( db, `users/${userId}/favorites/${recipeId}` );

    if(favoriteIds.has(recipeId)){
        await deleteDoc(favDocRef);
    } else {
        await setDoc(favDocRef, {
            recipeId,
            addedAt: serverTimestamp(),
        });
    }

  }, [favoriteIds]);
    return {
        favoriteIds,
        isFavoriteLoading,
        toggleFavorite,
    }
}