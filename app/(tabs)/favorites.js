import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="heart" size={44} color="#059669" />
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.subtitle}>Pantalla de prueba funcionando.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    marginTop: 6,
    color: "#6b7280",
  },
});