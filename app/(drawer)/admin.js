import { useTheme } from "@/contexts/ThemeContext";
import { checkIsAdmin, createRecipe, deleteRecipe, updateRecipe } from "@/services/admin";
import { getAllRecipes } from "@/services/recipes";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// Plantilla vacía para nueva receta
const EMPTY_RECIPE = {
  title: "",
  description: "",
  imageUrl: "",
  prepTime: "",
  servings: "",
  difficulty: "",
  category: "",
  ingredients: [],
  steps: [],
};

export default function AdminScreen() {
  const { colors } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState(EMPTY_RECIPE);
  const [saving, setSaving] = useState(false);

  // Estados para ingredientes y pasos
  const [newIngredient, setNewIngredient] = useState("");
  const [newStep, setNewStep] = useState("");

  // Verificar si es admin al cargar
  useEffect(() => {
    const verifyAdmin = async () => {
      const adminStatus = await checkIsAdmin();
      setIsAdmin(adminStatus);
      if (adminStatus) {
        await loadRecipes();
      }
      setLoading(false);
    };
    verifyAdmin();
  }, []);

  // Recargar recetas cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (isAdmin) {
        loadRecipes();
      }
    }, [isAdmin])
  );

  const loadRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data || []);
    } catch (error) {
      console.error("Error cargando recetas:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  // Abrir modal para nueva receta
  const openNewRecipeModal = () => {
    setEditingRecipe(null);
    setFormData(EMPTY_RECIPE);
    setNewIngredient("");
    setNewStep("");
    setModalVisible(true);
  };

  // Abrir modal para editar receta
  const openEditRecipeModal = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title || "",
      description: recipe.description || "",
      imageUrl: recipe.imageUrl || "",
      prepTime: recipe.prepTime || "",
      servings: recipe.servings?.toString() || "",
      difficulty: recipe.difficulty || "",
      category: recipe.category || "",
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
    });
    setNewIngredient("");
    setNewStep("");
    setModalVisible(true);
  };

  // Guardar receta (crear o actualizar)
  const handleSaveRecipe = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const recipeData = {
        ...formData,
        imageUrl: formData.imageUrl?.trim() || "",
        servings: formData.servings ? parseInt(formData.servings) : 4,
      };
      
      console.log("Guardando receta con imageUrl:", recipeData.imageUrl);

      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, recipeData);
        Alert.alert("Éxito", "Receta actualizada correctamente");
      } else {
        await createRecipe(recipeData);
        Alert.alert("Éxito", "Receta creada correctamente");
      }

      setModalVisible(false);
      await loadRecipes();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo guardar la receta");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar receta
  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      "Eliminar Receta",
      `¿Estás seguro de eliminar "${recipe.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              Alert.alert("Éxito", "Receta eliminada");
              await loadRecipes();
            } catch (_error) {
              Alert.alert("Error", "No se pudo eliminar la receta");
            }
          },
        },
      ]
    );
  };

  // Agregar ingrediente
  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };

  // Remover ingrediente
  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Agregar paso
  const addStep = () => {
    if (newStep.trim()) {
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep.trim()],
      }));
      setNewStep("");
    }
  };

  // Remover paso
  const removeStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  // Pantalla de carga
  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  // Si no es admin, mostrar mensaje
  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed" size={64} color={colors.icon} />
        <Text style={[styles.noAccessTitle, { color: colors.text }]}>Acceso Restringido</Text>
        <Text style={[styles.noAccessText, { color: colors.icon }]}>
          No tienes permisos de administrador para acceder a esta sección.
        </Text>
      </View>
    );
  }

  // Renderizar item de receta
  const renderRecipeItem = ({ item }) => (
    <View style={[styles.recipeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
        style={styles.recipeImage}
      />
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.recipeCategory, { color: colors.icon }]}>
          {item.category} • {item.difficulty}
        </Text>
        <Text style={[styles.recipeTime, { color: colors.icon }]}>
          ⏱ {item.prepTime || "N/A"}
        </Text>
      </View>
      <View style={styles.recipeActions}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.tint + "20" }]}
          onPress={() => openEditRecipeModal(item)}
        >
          <Ionicons name="pencil" size={18} color={colors.tint} />
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#ef444420" }]}
          onPress={() => handleDeleteRecipe(item)}
        >
          <Ionicons name="trash" size={18} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Panel de Admin</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Gestiona las recetas de la aplicación
          </Text>
        </View>
        <Pressable
          style={[styles.addBtn, { backgroundColor: colors.tint }]}
          onPress={openNewRecipeModal}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Contador */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.statsNumber, { color: colors.tint }]}>{recipes.length}</Text>
        <Text style={[styles.statsLabel, { color: colors.icon }]}>Recetas totales</Text>
      </View>

      {/* Lista de recetas */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={48} color={colors.icon} />
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              No hay recetas. ¡Añade la primera!
            </Text>
          </View>
        }
      />

      {/* Modal para agregar/editar receta */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingRecipe ? "Editar Receta" : "Nueva Receta"}
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.modalContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Titulo */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Título *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={formData.title}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
              placeholder="Nombre de la receta"
              placeholderTextColor={colors.icon}
            />

            {/* Descripcion */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={formData.description}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
              placeholder="Descripción breve de la receta"
              placeholderTextColor={colors.icon}
              multiline
              numberOfLines={3}
            />

            {/* URL de imagen */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>URL de Imagen</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={formData.imageUrl}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, imageUrl: text.trim() }))}
              placeholder="https://ejemplo.com/imagen.jpg"
              placeholderTextColor={colors.icon}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {/* Preview de la imagen */}
            {formData.imageUrl?.trim() ? (
              <View style={{ marginTop: 8, marginBottom: 8 }}>
                <Image
                  source={{ uri: formData.imageUrl.trim() }}
                  style={{ width: "100%", height: 150, borderRadius: 8, backgroundColor: "#e5e7eb" }}
                  onError={(e) => console.log("Error cargando imagen:", e.nativeEvent.error)}
                />
              </View>
            ) : null}

            {/* Tiempo de preparacion */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Tiempo de Preparación</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={formData.prepTime}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, prepTime: text }))}
              placeholder="Ej: 15 min, 1 hora"
              placeholderTextColor={colors.icon}
            />

            {/* Fila: Porciones + Dificultad */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Porciones</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                  value={formData.servings}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, servings: text }))}
                  placeholder="4"
                  placeholderTextColor={colors.icon}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Dificultad</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                  value={formData.difficulty}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, difficulty: text }))}
                  placeholder="Fácil, Media, Difícil"
                  placeholderTextColor={colors.icon}
                />
              </View>
            </View>

            {/* Categoria */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Categoría</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={formData.category}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, category: text }))}
              placeholder="Ej: Desayunos, Almuerzos, Cenas, Postres"
              placeholderTextColor={colors.icon}
            />

            {/* Ingredientes */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Ingredientes</Text>
            <View style={styles.addItemRow}>
              <TextInput
                style={[styles.input, styles.addItemInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={newIngredient}
                onChangeText={setNewIngredient}
                placeholder="Ej: 2 tazas de harina"
                placeholderTextColor={colors.icon}
                onSubmitEditing={addIngredient}
                returnKeyType="done"
              />
              <Pressable style={[styles.addItemBtn, { backgroundColor: colors.tint }]} onPress={addIngredient}>
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </View>
            {formData.ingredients.map((ing, index) => (
              <View key={index} style={[styles.listItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.listItemText, { color: colors.text }]}>{ing}</Text>
                <Pressable onPress={() => removeIngredient(index)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </Pressable>
              </View>
            ))}

            {/* Pasos */}
            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>Pasos de Preparación</Text>
            <View style={styles.addItemRow}>
              <TextInput
                style={[styles.input, styles.addItemInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={newStep}
                onChangeText={setNewStep}
                placeholder="Describe el paso..."
                placeholderTextColor={colors.icon}
                multiline
              />
              <Pressable style={[styles.addItemBtn, { backgroundColor: colors.tint }]} onPress={addStep}>
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </View>
            {formData.steps.map((step, index) => (
              <View key={index} style={[styles.listItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.stepNumber, { color: colors.tint }]}>{index + 1}.</Text>
                <Text style={[styles.listItemText, styles.stepText, { color: colors.text }]}>{step}</Text>
                <Pressable onPress={() => removeStep(index)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </Pressable>
              </View>
            ))}

            {/* Boton Guardar */}
            <Pressable
              style={[styles.saveBtn, { backgroundColor: colors.tint }, saving && { opacity: 0.6 }]}
              onPress={handleSaveRecipe}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {editingRecipe ? "Guardar Cambios" : "Crear Receta"}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statsCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  recipeCategory: {
    fontSize: 13,
    marginTop: 2,
  },
  recipeTime: {
    fontSize: 12,
    marginTop: 2,
  },
  recipeActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
  noAccessTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  noAccessText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  addItemRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  addItemInput: {
    flex: 1,
  },
  addItemBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  stepText: {
    flex: 1,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
