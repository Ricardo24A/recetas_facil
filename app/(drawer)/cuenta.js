import { useTheme } from "@/contexts/ThemeContext";
import { logout, reauthenticate, updateUserEmail, updateUserName } from "@/services/auth";
import {
  getFavoritesCount,
  getUserProfile,
  updateFavoriteCategories,
  updateUserBio,
  updateUserProfileName
} from "@/services/user";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

// Lista de categorías disponibles
const AVAILABLE_CATEGORIES = [
  "Desayunos",
  "Almuerzos", 
  "Cenas",
  "Postres",
  "Bebidas",
  "Snacks",
  "Vegetariano",
  "Vegano",
  "Sin Gluten",
  "Rápidas",
];

export default function CuentaScreen() {
  const { isDark, colors } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  // Estados para modales
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [bioModalVisible, setBioModalVisible] = useState(false);
  
  // Estados para editar
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newBio, setNewBio] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      const count = await getFavoritesCount();
      setFavoritesCount(count);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Actualizar contador de favoritos cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      const updateFavCount = async () => {
        try {
          const count = await getFavoritesCount();
          setFavoritesCount(count);
        } catch (error) {
          console.error("Error actualizando contador:", error);
        }
      };
      updateFavCount();
    }, [])
  );

  // Manejar cambio de nombre
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }
    
    setSaving(true);
    try {
      // Actualizar en Firebase Auth
      await updateUserName(newName.trim());
      await updateUserProfileName(newName.trim());
      
      setProfile(prev => ({ ...prev, displayName: newName.trim() }));
      setNameModalVisible(false);
      setNewName("");
      Alert.alert("Éxito", "Nombre actualizado correctamente");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambio de email
  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    
    setSaving(true);
    try {
      // Primero reautenticar
      await reauthenticate(password);
      await updateUserEmail(newEmail.trim());
      
      setEmailModalVisible(false);
      setNewEmail("");
      setPassword("");
      Alert.alert(
        "Éxito",
        "Correo actualizado correctamente."
      );
    } catch (error) {
      let errorMessage = "Error al actualizar el email.";
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "La contraseña es incorrecta. Por favor, verifica e intenta de nuevo.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El email ingresado no es válido.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email ya está registrado en otra cuenta.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Por seguridad, cierra sesión y vuelve a iniciar antes de cambiar el email.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBio = async () => {
    setSaving(true);
    try {
      await updateUserBio(newBio.trim());
      setProfile(prev => ({ ...prev, bio: newBio.trim() }));
      setBioModalVisible(false);
      Alert.alert("Éxito", "Biografía actualizada");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  // Manejar toggle de categorias
  const handleCategoryToggle = async (category) => {
    const currentCategories = profile?.favoriteCategories || [];
    let newCategories;
    
    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter(c => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }
    
    try {
      await updateFavoriteCategories(newCategories);
      setProfile(prev => ({ ...prev, favoriteCategories: newCategories }));
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar las categorías");
      console.error("Error actualizando categorías favoritas:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Mi Cuenta</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Gestiona tu cuenta y preferencias
      </Text>

      {/* Sección de informacion personal */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información Personal</Text>
        
        {/* Nombre */}
        <View style={styles.infoRow}>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.icon }]}>Nombre</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {profile?.displayName || "Sin nombre"}
            </Text>
          </View>
          <Pressable 
            style={[styles.editBtn, { backgroundColor: colors.tint + "20" }]}
            onPress={() => {
              setNewName(profile?.displayName || "");
              setNameModalVisible(true);
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.tint} />
          </Pressable>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.icon }]}>Email</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {profile?.email || "Sin email"}
            </Text>
          </View>
          <Pressable 
            style={[styles.editBtn, { backgroundColor: colors.tint + "20" }]}
            onPress={() => {
              setNewEmail(profile?.email || "");
              setEmailModalVisible(true);
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.tint} />
          </Pressable>
        </View>

        {/* Biografia */}
        <View style={styles.infoRow}>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.icon }]}>Biografía</Text>
            <Text style={[styles.value, { color: colors.text }]} numberOfLines={2}>
              {profile?.bio || "Sin biografía"}
            </Text>
          </View>
          <Pressable 
            style={[styles.editBtn, { backgroundColor: colors.tint + "20" }]}
            onPress={() => {
              setNewBio(profile?.bio || "");
              setBioModalVisible(true);
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.tint} />
          </Pressable>
        </View>
      </View>

      {/* Sección de estadisticas */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Estadísticas</Text>
        
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.tint + "15" }]}>
            <Ionicons name="heart" size={28} color={colors.tint} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{favoritesCount}</Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Favoritos</Text>
          </View>
        </View>
      </View>

      {/* Sección de categorias favoritas */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorías Favoritas</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.icon }]}>
          Selecciona las categorías que más te interesan
        </Text>
        
        <View style={styles.categoriesGrid}>
          {AVAILABLE_CATEGORIES.map((category) => {
            const isSelected = profile?.favoriteCategories?.includes(category);
            return (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: isSelected ? colors.tint : colors.background,
                    borderColor: isSelected ? colors.tint : colors.border,
                  }
                ]}
                onPress={() => handleCategoryToggle(category)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: isSelected ? "#fff" : colors.text }
                ]}>
                  {category}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable 
        style={[styles.logoutBtn, { 
          backgroundColor: isDark ? "#7f1d1d" : "#fef2f2", 
          borderColor: isDark ? "#b91c1c" : "#fecaca" 
        }]} 
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>

      <View style={{ height: 40 }} />

      {/* Modal para editar nombre */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Nombre</Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={newName}
              onChangeText={setNewName}
              placeholder="Tu nombre"
              placeholderTextColor={colors.icon}
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalBtn, styles.cancelBtn, { 
                  borderColor: colors.border,
                  backgroundColor: isDark ? colors.cardSecondary : "#f3f4f6"
                }]}
                onPress={() => setNameModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalBtn, styles.saveBtn, { backgroundColor: colors.tint }]}
                onPress={handleUpdateName}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Guardar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar email */}
      <Modal
        visible={emailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Email</Text>
            <Text style={[styles.modalSubtitle, { color: colors.icon }]}>
              Por seguridad, ingresa tu contraseña actual
            </Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Nuevo email"
              placeholderTextColor={colors.icon}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña actual"
              placeholderTextColor={colors.icon}
              secureTextEntry
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalBtn, styles.cancelBtn, { 
                  borderColor: colors.border,
                  backgroundColor: isDark ? colors.cardSecondary : "#f3f4f6"
                }]}
                onPress={() => {
                  setEmailModalVisible(false);
                  setPassword("");
                }}
              >
                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalBtn, styles.saveBtn, { backgroundColor: colors.tint }]}
                onPress={handleUpdateEmail}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Guardar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar biografia */}
      <Modal
        visible={bioModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBioModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Biografía</Text>
            
            <TextInput
              style={[styles.input, styles.bioInput, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={newBio}
              onChangeText={setNewBio}
              placeholder="Cuéntanos sobre ti..."
              placeholderTextColor={colors.icon}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalBtn, styles.cancelBtn, { 
                  borderColor: colors.border,
                  backgroundColor: isDark ? colors.cardSecondary : "#f3f4f6"
                }]}
                onPress={() => setBioModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalBtn, styles.saveBtn, { backgroundColor: colors.tint }]}
                onPress={handleUpdateBio}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Guardar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: { 
    fontSize: 15,
    marginBottom: 24,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  bioInput: {
    height: 100,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelBtnText: {
    fontWeight: "600",
  },
  saveBtn: {},
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});