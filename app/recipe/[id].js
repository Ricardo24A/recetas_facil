import { getRecipeById } from "@/services/recipes";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useShopping } from "@/hooks/useShopping";

export default function RecipeDetailScreen() {

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const  [loading, setLoading] = useState(true);
  const {addToShopping } = useShopping();

  useEffect(() => {
    const load = async () => {
        try{
            const data = await getRecipeById(id);
            setRecipe(data);
        }catch(error){
            console.error("Error al cargar recipe:", error);
        }finally{
            setLoading(false);
        }
    };
    load();
  }, [id]);

    if (loading) return <View><Text>Cargando...</Text></View>
    if (!recipe) return <View><Text>Receta no encontrada.</Text></View>

  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
        <Pressable onPress={() => router.back()} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color="black" />
            <Text> Volver</Text>
        </Pressable>
        <View style={styles.imageWrapper}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.cardImage} />
      </View>

      <Text style={styles.textTitle}>{recipe.title}</Text>
      <Text style={styles.text}>{recipe.description}</Text>

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

        <View style={styles.difficultyPill}>
          <Text style={styles.difficultyPillText}>{recipe.difficulty}</Text>
        </View>
      </View>
      <View style={styles.ingredientsHeaderRow}>
        <Text style={styles.textTitle}>Ingredientes</Text>
        <Pressable
          style={styles.addBtn}
          onPress={async () => {
            try{
              await addToShopping(recipe);
              Alert.alert("Éxito", "Ingredientes añadidos a la lista de compras.");
            }catch(error){
              Alert.alert("Error", "No se pudieron añadir los ingredientes.");
              console.log("Error al añadir a compras:", error);
            }
          }}
        >
          <Ionicons name="cart-outline" size={20} color="#565151ff" />
          <Text style={styles.addBtnText}> Añadir a compras</Text>
        </Pressable>
      </View>
      {(recipe.ingredients || []).map((ing, idx) => (
        <View key={`${ing}-${idx}`} style={styles.ingredientsRow}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.ingredientText}>{ing}</Text>
        </View>
      ))}

      <Text style={styles.textTitleStep}>Preparación</Text>

      {(recipe.instructions || []).map((step, idx) => (
        <View key={`${idx}-${step}`} style={styles.stepRow}>
            <View style={styles.stepNumero}>
                <Text style={styles.stepNumeroText}>{idx + 1}</Text>  
            </View>  
            <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  containerScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    color: "#111",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  cardImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  text: {
    color: "black",
    marginTop: 8,
    paddingBottom: 8,
  },
  textTitle: {
    color: "black",
    fontWeight: "bold",
    marginTop: 12,
    paddingBottom: 4,
  },
  textTitleStep: {
    color: "black",
    fontWeight: "bold",
    marginTop: 16,
    paddingBottom: 4,
  },
  cardBotton: {
    flexDirection: "row",
    marginTop: 10,
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
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  textbotton: {
    color: "#111",
    marginLeft: 6,
  },
  separador: {
    marginHorizontal: 10,
    color: "gray",
  },
  difficultyPill: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyPillText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 12,
  },
  ingredientsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  dot: {
    width: 6,
    color: "#059669",
    fontWeight: "700",
  },
   ingredientText: {
        flex: 1,
        color: "#111",
        marginLeft: 6,
   },
   stepRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginTop: 12,
   },
   stepNumero: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
   },
    stepNumeroText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
   },
   stepText: {
    flex: 1,
    color: "#111",
    lineHeight: 20,
   },
   addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    alignSelf: "flex-start",
   },
   addBtnText: {
    color: "#5a5050ff",
    fontWeight: "600",
   },
   ingredientsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 8,
  },
});