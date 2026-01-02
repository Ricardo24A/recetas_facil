import { useTheme } from "@/contexts/ThemeContext";
import { useShopping } from '@/hooks/useShopping';
import { removerIngredientFromReceta, setIngredientsChecked } from "@/services/shopping";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';


export default function ShoppingScreen() {

    const { shoppingRecipes, shoppingCount, clearAllShopping, removeFromShopping } = useShopping();
    const { isDark, colors } = useTheme();

    const [openId, setOpenId] = useState(null);

    return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.text }]}>Lista de Compras</Text>
          <View style={[styles.countPill, { backgroundColor: isDark ? "#064e3b" : "#D1FAE5" }]}>
            <Text style={styles.countText}>
              {shoppingCount} {shoppingCount === 1 ? "receta" : "recetas"}
            </Text>
          </View>
        </View>

        <Pressable style={styles.clearBtn} onPress={clearAllShopping}>
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={styles.clearText}>Limpiar</Text>
        </Pressable>
      </View>

      <View style={[styles.infoBox, { backgroundColor: isDark ? "#064e3b" : "#ECFDF5", borderColor: isDark ? "#10b981" : "#A7F3D0" }]}>
        <Text style={[styles.infoText, { color: isDark ? "#a7f3d0" : "#065F46" }]}>💡 Click en cada receta para ver los ingredientes</Text>
      </View>

      <FlatList
        data={shoppingRecipes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.text }]}>No tienes recetas en compras.</Text>}
        renderItem={({ item }) => {
          const isOpen = openId === item.id;

          return (
            <View style={[styles.recipeCard, { backgroundColor: isDark ? "#1e2022" : "#fff", borderColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
              <Pressable
                style={styles.recipeHeader}
                onPress={() => setOpenId(isOpen ? null : item.id)}
              >
                <View style={styles.recipeHeaderLeft}>
                  <Text style={[styles.recipeTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.recipeSubtitle, { color: colors.icon }]}>
                    {item.ingredients?.length || 0} ingredientes
                  </Text>
                </View>

                <View style={styles.recipeHeaderRight}>
                  <Ionicons
                    name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={18}
                    color={colors.icon}
                  />
                  <Pressable
                    style={styles.iconBtn}
                    onPress={() => removeFromShopping(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.icon} />
                  </Pressable>
                </View>
              </Pressable>

              {isOpen && (
                <View style={[styles.ingredientsBox, { backgroundColor: isDark ? "#151718" : "#f9fafb", borderTopColor: isDark ? "#2d3134" : "#e5e7eb" }]}>
                  {(item.ingredients || []).map((ingredient, index) => {

                    const checked = Boolean(item.checkMap?.[ingredient]);
                    return (

                        <View key={`${index}-${ingredient}`} style={styles.ingredientRow}>
                        <Pressable style={[styles.checkbox, checked && styles.checkBoxMarcada, { borderColor: isDark ? "#4b5563" : "#d1d5db" }]} onPress={async () => { 
                            await setIngredientsChecked(item.id, ingredient, !checked);
                         }}>
                            {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
                         </Pressable>
                        
                            <Text style={[checked ? styles.ingredientChecked : styles.ingredientText, { color: checked ? colors.icon : colors.text }]}>{ingredient}</Text>
                        <Pressable style={styles.ingredientRemoveBtn} onPress={async () => {
                            await removerIngredientFromReceta(item.id, ingredient);
                        }}>
                            <Ionicons name="close" size={18} color={colors.icon} />
                        </Pressable>
                        </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  countPill: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 12,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clearText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    color: "#065F46",
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 90,
  },
  recipeCard: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  recipeHeader: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipeHeaderLeft: {
    flex: 1,
  },
  recipeHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recipeTitle: {
    fontWeight: "700",
    color: "#111",
  },
  recipeSubtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
  },
  iconBtn: {
    padding: 6,
  },
  ingredientsBox: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  ingredientChecked: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#9ca3af",
    borderRadius: 4,
    marginRight: 10,
  },
  ingredientText: {
    flex: 1,
    color: "#111",
    fontSize: 13,
  },
  ingredientRemoveBtn: {
    padding: 6,
  },
  empty: {
    marginTop: 30,
    color: "#6b7280",
  },
  checkBoxMarcada: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
  }
});