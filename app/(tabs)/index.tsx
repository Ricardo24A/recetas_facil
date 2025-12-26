import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { Alert, Pressable, StyleSheet } from "react-native";
import { testAddRecipe } from "../../scripts/testFirestore";
import { User } from "firebase/auth";
import { seedRecipes } from "@/scripts/seedRecipes";
import { getAllRecipes } from "@/services/recipes";

export default function HomeScreen() {
  const { user, loading } = useAnonymousAuth() as { user: User | null; loading: boolean };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  if (!user || !user.uid) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: No se pudo autenticar.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.uidText}>UID: {user.uid}</ThemedText>

      <Pressable
        style={styles.button}
        onPress={async () => {
          try {
            await testAddRecipe();
            Alert.alert("OK", "Se creó la receta de prueba en Firestore");
          } catch (e) {
            console.log("Firestore error:", e);
            Alert.alert("Error", "No se pudo escribir en Firestore. Revisa la consola.");
          }
        }}
      >
        <ThemedText type="defaultSemiBold">Probar escritura en Firestore</ThemedText>
      </Pressable>
      <Pressable onPress={async()=>{ await seedRecipes(); Alert.alert("OK","Recetas cargadas"); }}>
        <ThemedText>Cargar recetas reales</ThemedText>
      </Pressable>

      <Pressable onPress={async()=>{ const data = await getAllRecipes(); console.log(data); Alert.alert("OK", `Recetas: ${data.length}`); }}>
        <ThemedText>Leer recetas</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});