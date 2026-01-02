import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();

  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Personaliza tu experiencia en la app
      </Text>

      {/* Sección de apariencia */}
      <View style={[styles.section, { backgroundColor: isDark ? "#1e2022" : "#f8f8f8" }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>

        <View style={[styles.settingRow, { borderBottomColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? "#374151" : "#e5e7eb" }]}>
              <Ionicons 
                name={isDark ? "moon" : "sunny"} 
                size={20} 
                color={isDark ? "#fbbf24" : "#f59e0b"} 
              />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Modo oscuro</Text>
              <Text style={[styles.settingDescription, { color: colors.icon }]}>
                {isDark ? "Activado" : "Desactivado"}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#d1d5db", true: "#059669" }}
            thumbColor={isDark ? "#10b981" : "#f4f3f4"}
            ios_backgroundColor="#d1d5db"
          />
        </View>
      </View>

      {/* Sección de información */}
      <View style={[styles.section, { backgroundColor: isDark ? "#1e2022" : "#f8f8f8" }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información</Text>

        <View style={[styles.infoRow, { borderBottomColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
          <Text style={[styles.infoLabel, { color: colors.icon }]}>Versión</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
        </View>
      </View>
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
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
});