import { useCallback, useEffect, useMemo, useState } from "react";

import { addRecipeToShopping, clearShopping, listenShoppingRecipes, removeRecipeFromShopping } from "../services/shopping";

export function useShopping() {
    const [shoppingRecipes, setShoppingRecipes] = useState([]);
    const [isShoppingLoading, setIsShoppingLoading]= useState(true);

    useEffect( () => {
        const unsubscribe = listenShoppingRecipes( (recipes) => {
            setShoppingRecipes(recipes);
            setIsShoppingLoading(false);
        });
        return unsubscribe;

    }, []);

    const shoppingCount = useMemo( () => shoppingRecipes.length, [shoppingRecipes]);

    const addToShopping = useCallback( async (recipe) => {
        await addRecipeToShopping(recipe);      
    }, []);

    const removeFromShopping = useCallback( async (recipeId) => {
        await removeRecipeFromShopping(recipeId);
    }, []);

    const clearAllShopping = useCallback( async () => {
        await clearShopping();
    }, []);

    return { 
        shoppingRecipes,
        shoppingCount,
        isShoppingLoading,
        addToShopping,
        removeFromShopping,
        clearAllShopping,
    };
}