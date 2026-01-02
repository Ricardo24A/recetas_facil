import { useTheme } from "@/contexts/ThemeContext";
import { getAllRecipes } from "@/services/recipes";
import { addRecipeToShopping } from "@/services/shopping";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";


const MEALS = ["Desayuno", "Almuerzo", "Cena"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function formatWeekLabel(dateStart) {
  const start = new Date(dateStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const s = `${start.getDate()}–${end.getDate()} ${months[end.getMonth()]}`;
  return `Semana ${s}`;
}

function getMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function makeSlotKey(day, meal) {
  return `${day}__${meal}`;
}

export default function PlannerScreen() {
  const [activeMeal, setActiveMeal] = useState("Almuerzo");
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const { isDark, colors } = useTheme();

  const [recipes, setRecipes] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeSlotKey, setActiveSlotKey] = useState(null);

  const [planBySlot, setPlanBySlot] = useState({});

  const weekLabel = useMemo(() => formatWeekLabel(weekStart), [weekStart]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllRecipes();
      setRecipes(data || []);
    };
    load();
  }, []);

  const rows = useMemo(() => {
    return DAYS.map((day) => {
      const slotKey = makeSlotKey(day, activeMeal);
      return {
        id: slotKey,
        day,
        meal: activeMeal,
        slotKey,
        recipe: planBySlot[slotKey] || null,
      };
    });
  }, [activeMeal, planBySlot]);

  function openPickerFor(day) {
    const slotKey = makeSlotKey(day, activeMeal);
    setActiveSlotKey(slotKey);
    setIsPickerOpen(true);
  }

  function closePicker() {
    setIsPickerOpen(false);
    setActiveSlotKey(null);
  }

  function selectRecipe(recipe) {
    if (!activeSlotKey) return;

    setPlanBySlot((prev) => ({
      ...prev,
      [activeSlotKey]: {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
      },
    }));

    closePicker();
  }

  function removeRecipe(slotKey) {
    setPlanBySlot((prev) => {
      const copy = { ...prev };
      delete copy[slotKey];
      return copy;
    });
  }

  async function addRectasDeLaSemana(){
    try{
      const recetasSelect = Object.values(planBySlot)
        .filter(Boolean)
        .map((recipe) => recipe.id);
      const recipeUnica = Array.from(new Set(recetasSelect));

      if(recipeUnica.length === 0){
        Alert.alert("Lista vacía", "No hay recetas asignadas para la semana.");
        return;
      }
      
      const recipesToAdd = recipeUnica.map((id) => recipes.find((recipe) => recipe.id === id)).filter(Boolean);

      for(const recipe of recipesToAdd){
        await addRecipeToShopping(recipe);
      }
      Alert.alert("Listo", "Las recetas han sido agregadas a la lista de compras.");
    }catch(error){
      console.error("Error al agregar las compras:", error);
      Alert.alert("Error", "No se pudieron agregar las recetas a la lista de compras.");
    }
  }

  function clearWeek(){
    setPlanBySlot({});
  }


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBlock}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Planificador</Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>Organiza tus recetas de la semana</Text>
          </View>

          <Pressable style={[styles.calendarBtn, { backgroundColor: isDark ? "#064e3b" : "#ECFDF5", borderColor: isDark ? "#10b981" : "#A7F3D0" }]}>
            <Ionicons name="calendar-outline" size={18} color="#059669" />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          <Pressable
            style={[styles.weekArrow, { borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}
            onPress={() => {
              const prev = new Date(weekStart);
              prev.setDate(prev.getDate() - 7);
              setWeekStart(prev);
            }}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </Pressable>

          <View style={[styles.weekPill, { borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
            <Text style={[styles.weekText, { color: colors.text }]}>{weekLabel}</Text>
          </View>

          <Pressable
            style={[styles.weekArrow, { borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}
            onPress={() => {
              const next = new Date(weekStart);
              next.setDate(next.getDate() + 7);
              setWeekStart(next);
            }}
          >
            <Ionicons name="chevron-forward" size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.mealTabs}>
          {MEALS.map((meal) => {
            const selected = meal === activeMeal;
            return (
              <Pressable
                key={meal}
                style={[styles.mealTab, { borderColor: isDark ? "#2d3134" : "#e5e7eb" }, selected && styles.mealTabActive]}
                onPress={() => setActiveMeal(meal)}
              >
                <Text style={[styles.mealTabText, { color: colors.text }, selected && styles.mealTabTextActive]}>{meal}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.dayCard, { backgroundColor: isDark ? "#1e2022" : "#fff", borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
            <View style={[styles.dayHeader, { backgroundColor: isDark ? "#1e2022" : "#fff" }]}>
              <Text style={[styles.dayTitle, { color: colors.text }]}>{item.day}</Text>

              <Pressable style={styles.addBtn} onPress={() => openPickerFor(item.day)}>
                <Ionicons name="add" size={18} color="#059669" />
                <Text style={styles.addBtnText}>Agregar</Text>
              </Pressable>
            </View>

            <View style={styles.dayBody}>
              {item.recipe ? (
                <View style={[styles.recipeMiniCard, { backgroundColor: isDark ? "#151718" : "#f9fafb", borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
                  <Image source={{ uri: item.recipe.imageUrl }} style={styles.recipeMiniImage} />
                  <View style={styles.recipeMiniInfo}>
                    <Text style={[styles.recipeMiniTitle, { color: colors.text }]}>{item.recipe.title}</Text>
                    <Text style={[styles.recipeMiniMeta, { color: colors.icon }]}>
                      {item.recipe.prepTime} · {item.recipe.difficulty}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.removeMiniBtn}
                    onPress={() => removeRecipe(item.slotKey)}
                  >
                    <Ionicons name="close" size={18} color={colors.icon} />
                  </Pressable>
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: colors.icon }]}>Sin receta asignada</Text>
              )}
            </View>
          </View>
        )}
      />

      <View style={[styles.bottomBlock, { backgroundColor: colors.background }]}>
        <Pressable style={styles.primaryBtn} onPress={addRectasDeLaSemana}>
          <Text style={styles.primaryBtnText}>Generar compras de la semana</Text>
        </Pressable>
        <Pressable onPress={clearWeek}>
          <Text style={styles.linkText}>Limpiar semana</Text>
        </Pressable>
      </View>

      <Modal visible={isPickerOpen} transparent animationType="fade" onRequestClose={closePicker}>
        <Pressable style={styles.modalBackdrop} onPress={closePicker} />

        <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Receta</Text>
            <Pressable onPress={closePicker}>
              <Ionicons name="close" size={20} color={colors.icon} />
            </Pressable>
          </View>

          <FlatList
            data={recipes}
            keyExtractor={(recipe) => recipe.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalListContent}
            renderItem={({ item: recipe }) => (
              <Pressable style={[styles.modalRecipeRow, { backgroundColor: isDark ? "#1e2022" : "#f9fafb" }]} onPress={() => selectRecipe(recipe)}>
                <Image source={{ uri: recipe.imageUrl }} style={styles.modalRecipeImage} />
                <View style={styles.modalRecipeInfo}>
                  <Text style={[styles.modalRecipeTitle, { color: colors.text }]}>{recipe.title}</Text>
                  <Text style={[styles.modalRecipeMeta, { color: colors.icon }]}>
                    {recipe.prepTime} · {recipe.difficulty}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  topBlock: { marginBottom: 10 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#6b7280" },

  calendarBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    justifyContent: "center",
    alignItems: "center",
  },

  weekRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weekArrow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  weekPill: {
    flex: 1,
    marginHorizontal: 10,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  weekText: { fontWeight: "600", color: "#111", fontSize: 12 },

  mealTabs: { flexDirection: "row", gap: 10, marginTop: 14 },
  mealTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  mealTabActive: { backgroundColor: "#1fc893ff", borderColor: "#059669" },
  mealTabText: { fontWeight: "600", color: "#111", fontSize: 12 },
  mealTabTextActive: { color: "#fff" },

  listContent: { paddingBottom: 140 },
  dayCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  dayHeader: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  dayTitle: { fontWeight: "700", color: "#111" },

  addBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  addBtnText: { color: "#059669", fontWeight: "700", fontSize: 12 },

  dayBody: { paddingHorizontal: 12, paddingBottom: 12 },
  emptyText: { color: "#9ca3af", fontSize: 12, textAlign: "center", paddingVertical: 10 },

  recipeMiniCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 10,
  },
  recipeMiniImage: { width: 40, height: 40, borderRadius: 10, marginRight: 10 },
  recipeMiniInfo: { flex: 1 },
  recipeMiniTitle: { fontWeight: "700", color: "#111", fontSize: 12 },
  recipeMiniMeta: { marginTop: 2, color: "#6b7280", fontSize: 11 },
  removeMiniBtn: { padding: 6 },

  bottomBlock: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    backgroundColor: "#fff",
  },
  primaryBtn: {
    backgroundColor: "#1fc893ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  helperText: { marginTop: 8, textAlign: "center", fontSize: 11, color: "#6b7280" },
  linkText: { marginTop: 10, textAlign: "center", color: "#059669", fontWeight: "700" },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.35)",
  },
  modalCard: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 110,
    bottom: 90,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: { fontWeight: "700", color: "#111" },
  modalListContent: { padding: 10 },

  modalRecipeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 10,
  },
  modalRecipeImage: { width: 44, height: 44, borderRadius: 12, marginRight: 10 },
  modalRecipeInfo: { flex: 1 },
  modalRecipeTitle: { fontWeight: "700", color: "#111", fontSize: 12 },
  modalRecipeMeta: { marginTop: 2, color: "#6b7280", fontSize: 11 },
});