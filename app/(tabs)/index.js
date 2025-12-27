import { getAllRecipes } from "@/services/recipes";
import { addFavorite, removeFavorite } from "@/services/favorites";
import { useEffect, useState, useMemo } from "react";
import { Image, StyleSheet, Text, View, FlatList, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


    
export default function HomeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState(new Set());


  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllRecipes();
      setRecipes(data);
    };
    fetchData();
  }, []);

  const filteredRecipes = useMemo(()=>{
    const querry = search.trim().toLowerCase();
    if(!querry) return recipes;
    return recipes.filter((recipe) =>
      (recipe.title || "").toLowerCase().includes(querry)
    );
  }, [recipes, search]);

  const toggleFavorite = async (recipeId) => {
    const isFav = favoriteIds.has(recipeId);

    const next = new Set(favoriteIds);
    if(isFav) next.delete(recipeId);
    else next.add(recipeId);
    setFavoriteIds(next);

    try{
      if(isFav) await removeFavorite(recipeId);
      else await addFavorite(recipeId);
    } catch(e){
      console.error("Error actulizando favoritos:", e);
      setFavoriteIds(favoriteIds);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBlock}>
        <Text style={styles.uidText}>Todas las recetas</Text>

        <View style={styles.input}>
          <Ionicons name="search-outline" size={18} color="#9ca3af"/>
          <TextInput type="text" placeholder="Buscar recetas..." 
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          selectionColor="none"
          style={ styles.inputContainer} />
        </View>
      </View>
      
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text>No se encontraron recetas.</Text>
        }
        renderItem={({ item: recipe }) => (
          <Pressable onPress={() => router.push(`/recipe/${recipe.id}`)}>
            <View style={styles.cardPrincipal} key={recipe.id}>
              <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: recipe.imageUrl }}
                    style={styles.cardImage}
                />
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{recipe.category}</Text>
                </View>
              </View>

              <Text style={styles.textTitle}>{recipe.title}</Text>
              <Text>{recipe.description}</Text>
              <View style={styles.cardBotton}>
                <View style={styles.metaLeft}>
                  <View  style={styles.item}>
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
});