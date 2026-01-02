import { useTheme } from "@/contexts/ThemeContext";
import { logout } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function CuentaScreen() {
  const { isDark, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Cuenta</Text>
      <Text style={[styles.text, { color: colors.icon }]}>Gestiona tu cuenta y preferencias.</Text>
      
      <Pressable 
        style={[styles.logoutBtn, { backgroundColor: isDark ? "#7f1d1d" : "#fef2f2", borderColor: isDark ? "#b91c1c" : "#fecaca" }]} 
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800",
    marginBottom: 4,
  },
  text: { 
    marginTop: 8,
    marginBottom: 24,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 16,
  },
});