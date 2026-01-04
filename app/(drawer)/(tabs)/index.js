import { useTheme } from "@/contexts/ThemeContext";
import { useFavorites } from "@/hooks/useFavorites";
import { getAllRecipes } from "@/services/recipes";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


    
export default function HomeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { isDark, colors } = useTheme();

  // Recargar recetas cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getAllRecipes();
        setRecipes(data);
      };
      fetchData();
    }, [])
  );

  const filteredRecipes = useMemo(()=>{
    const querry = search.trim().toLowerCase();
    if(!querry) return recipes;
    return recipes.filter((recipe) =>
      (recipe.title || "").toLowerCase().includes(querry)
    );
  }, [recipes, search]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBlock}>
        <Text style={[styles.uidText, { color: colors.text }]}>Todas las recetas</Text>

        <View style={[styles.input, { backgroundColor: isDark ? "#1e2022" : "#fff", borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
          <Ionicons name="search-outline" size={18} color={colors.icon}/>
          <TextInput type="text" placeholder="Buscar recetas..." 
          placeholderTextColor={colors.icon}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          selectionColor="none"
          style={[styles.inputContainer, { color: colors.text }]} />
        </View>
      </View>
      
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ color: colors.text }}>No se encontraron recetas.</Text>
        }
        renderItem={({ item: recipe }) => {
          const isFav = favoriteIds.has(recipe.id);
          return (
          <Pressable onPress={() => router.push(`/recipe/${recipe.id}`)}>
            <View style={[styles.cardPrincipal, { backgroundColor: isDark ? "#1e2022" : "#f8f8f8" }]} key={recipe.id}>
              <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: recipe.imageUrl && recipe.imageUrl.trim() ? recipe.imageUrl.trim() : "https://placehold.co/400x200/e5e7eb/9ca3af?text=Sin+imagen" }}
                    style={[styles.cardImage, { backgroundColor: "#e5e7eb" }]}
                    resizeMode="cover"
                    onError={(e) => console.log("Error imagen:", recipe.title, e.nativeEvent.error)}
                />
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{recipe.category}</Text>
                </View>
              <Pressable
                    style={[styles.favoriteBtn, { backgroundColor: isDark ? "rgba(30, 32, 34, 0.9)" : "rgba(255, 255, 255, 0.8)", borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}
                    onPress={() => toggleFavorite(recipe.id)}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={18}
                      color={isFav ? "#ef4444" : colors.icon}
                    />
                  </Pressable>
              </View>

              <Text style={[styles.textTitle, { color: colors.text }]}>{recipe.title}</Text>
              <Text style={{ color: colors.icon }}>{recipe.description}</Text>
              <View style={[styles.cardBotton, { borderTopColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
                <View style={styles.metaLeft}>
                  <View  style={styles.item}>
                    <Ionicons name="time-outline" size={16} color={colors.icon} />
                    <Text style={[styles.textbotton, { color: colors.text }]}>{recipe.prepTime}</Text>
                  </View>
                  <Text style={styles.separador}>•</Text>
                  <View style={styles.item}>
                    <Ionicons name="people-outline" size={16} color={colors.icon} />
                    <Text style={[styles.textbotton, { color: colors.text }]}>{recipe.servings} personas</Text>
                  </View>
                </View>
              <Text style={[styles.difficultyText, { color: colors.icon }]}>{recipe.difficulty}</Text>
              </View>
            </View>
          </Pressable>
        );
        }}
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
    width: "100%",
    textAlign: "left",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  text: {
    color: "black",
    marginTop: 8,
    paddingBottom: 8,
  },
  textTitle: {
    color: "black",
    fontWeight: "bold",
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
  separador:{
    marginHorizontal: 10,
    color: "gray",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  input : {
    width: 320,
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 16,
    alignSelf: "center",
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
    marginLeft: 8,
  },
  topBlock: {
  width: 310,
  alignSelf: "center",
  alignItems: "flex-start",
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
    width: 32,
    height: 32,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  }

});