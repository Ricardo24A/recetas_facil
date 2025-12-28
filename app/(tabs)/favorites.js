import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Pressable, FlatList, Image } from "react-native";
import  {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import { getRecipeById } from "@/services/recipes";
import { useFavorites } from "@/hooks/useFavorites";
export default function FavoritesScreen() {
    const router = useRouter();
    const { favoriteIds, isFavoriteLoading, toggleFavorite } = useFavorites();

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const loadFavoriteRecipes = async () => {
      if (isFavoriteLoading) return;

      const ids = Array.from(favoriteIds);

      if (ids.length === 0) {
        setFavoriteRecipes([]);
        return;
      }

      try {
        const recipes = await Promise.all(ids.map((id) => getRecipeById(id)));
        setFavoriteRecipes(recipes.filter(Boolean));
      } catch (e) {
        console.log("Error cargando recetas favoritas:", e);
      }
    };

    loadFavoriteRecipes();
  }, [favoriteIds, isFavoriteLoading]);


    return (
        <View style={styles.container}>
        <View style={styles.topBlockFav}>
            <View style={styles.favTitleRow}>
            <Text style={styles.uidText}>Mis Favoritos</Text>
            <View>
                <Text style={styles.favCountText}>{favoriteRecipes.length}</Text>
            </View>
            </View>
        </View>

        <FlatList
            data={favoriteRecipes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={<Text>No tienes favoritos aún.</Text>}
            renderItem={({ item: recipe }) => (
            <Pressable onPress={() => router.push(`/recipe/${recipe.id}`)}>
                <View style={styles.cardPrincipal}>
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: recipe.imageUrl }} style={styles.cardImage} />

                    <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{recipe.category}</Text>
                    </View>

                     <Pressable
                  style={styles.favoriteBtn}
                  onPress={() => toggleFavorite(recipe.id)}
                >
                  <Ionicons name="heart" size={18} color="#ef4444" />
                </Pressable>
                </View>

                <Text style={styles.text}>{recipe.title}</Text>
                <Text>{recipe.description}</Text>

                <View style={styles.cardBotton}>
                    <View style={styles.metaLeft}>
                    <View style={styles.item}>
                        <Ionicons name="time-outline" size={16} color="gray" />
                        <Text style={styles.textbotton}>{recipe.prepTime}</Text>
                    </View>

                    <Text style={styles.separador}>•</Text>

                    <View style={styles.item}>
                        <Ionicons name="people-outline" size={16} color="gray" />
                        <Text style={styles.textbotton}>{recipe.servings} personas</Text>
                    </View>
                    </View>

                    <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                </View>
                </View>
            </Pressable>
            )}
        />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  uidText: {
    textAlign: "left",
    fontWeight: "600",
  },
  topBlockFav: {
    width: 310,
    alignSelf: "center",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  favTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  favCountPill: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  favCountText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 12,
  },
  text: {
    color: "black",
    marginTop: 8,
    paddingBottom: 8,
  },
  cardPrincipal: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: 320,
    shadowColor: "#000",
  },
  cardBotton: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyText: {
    color: "gray",
    fontWeight: "600",
  },
  textbotton: {
    color: "#111",
    marginLeft: 6,
  },
  separador: {
    marginHorizontal: 10,
    color: "gray",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
  },
  cardImage: {
    width: 290,
    height: 180,
    borderRadius: 12,
  },
  categoryPill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  favoriteBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
