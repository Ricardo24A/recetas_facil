import { getAllRecipes } from "@/services/recipes";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllRecipes();
      setRecipes(data);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item: recipe }) => (
          <View style={styles.cardPrincipal} key={recipe.id}>
            <Image
                source={{ uri: recipe.imageUrl }}
                style={{ width: 290, height: 180, borderRadius: 12 }}
            />
            <Text style={styles.text}>{recipe.title}</Text>
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
});