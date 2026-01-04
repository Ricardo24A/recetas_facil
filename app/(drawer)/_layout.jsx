import { useTheme } from "@/contexts/ThemeContext";
import { checkIsAdmin } from "@/services/admin";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function DrawerLayout() {
    const { isDark, colors } = useTheme();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            const adminStatus = await checkIsAdmin();
            setIsAdmin(adminStatus);
        };
        verifyAdmin();
    }, []);

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

            <Drawer.Screen
                name="admin"
                options={{
                    drawerLabel: "Administración",
                    title: "Administración",
                    drawerIcon: ({color, size}) => (
                        <Ionicons name="shield-outline" size={size} color={color} />
                    ),
                    drawerItemStyle: isAdmin ? {} : { display: "none" },
                }}
            />
        </Drawer>
    );
    }