import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";

export default function DrawerLayout() {
    const { isDark, colors } = useTheme();

    return( 
        <Drawer
            screenOptions={{
                headerShown: true,
                headerStyle: { 
                    backgroundColor: isDark ? "#1a2f23" : "#d9f0e2ff",
                },
                headerTintColor: isDark ? "#4ade80" : "#16a34a",
                headerShadowVisible: false,
                headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="restaurant-outline" size={22} color={isDark ? "#4ade80" : "#16a34a"} />
                    <Text style={{ color: isDark ? "#4ade80" : "#16a34a", fontWeight: "600", fontSize: 16 }}>
                    Recetas Fácil
                    </Text>
                </View>
                ),
                drawerStyle: {
                    backgroundColor: colors.background,
                },
                drawerActiveTintColor: "#16a34a",
                drawerInactiveTintColor: colors.icon,
                drawerLabelStyle: {
                    color: colors.text,
                },
            }}
        >

            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: "Inicio",
                    title: "Recetas Fácil",
                    drawerIcon: ({color, size}) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: "Configuración",
                    title: "Configuración",
                    drawerIcon: ({color, size}) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="cuenta"
                options={{
                    drawerLabel: "Cuenta",
                    title: "Cuenta",
                    drawerIcon: ({color, size}) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
    }