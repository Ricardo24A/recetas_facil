import { Colors } from "@/constants/theme";
import { useAuthSession } from "@/hooks/useAuthSession";
import { getThemePreference, saveThemePreference } from "@/services/userPreferences";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  colors: Colors.light,
  toggleTheme: () => {},
  setTheme: () => {},
  isLoading: true,
});

export function ThemeProvider({ children }) {
  const { user, loadingAuth } = useAuthSession();
  const [theme, setThemeState] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia del usuario cuando inicia sesión
  const loadTheme = useCallback(async () => {
    if (loadingAuth) {
      // Aún estamos verificando el estado de autenticación
      return;
    }

    if (user && !user.isAnonymous) {
      try {
        console.log("Cargando tema para usuario:", user.uid);
        const savedTheme = await getThemePreference();
        console.log("Tema cargado:", savedTheme);
        setThemeState(savedTheme);
      } catch (error) {
        console.log("Error cargando tema:", error);
        setThemeState("light");
      }
    } else {
      // Usuario no autenticado o anónimo - usar tema por defecto
      setThemeState("light");
    }
    setIsLoading(false);
  }, [user, loadingAuth]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    
    if (user && !user.isAnonymous) {
      try {
        console.log("Guardando tema:", newTheme);
        await saveThemePreference(newTheme);
        console.log("Tema guardado correctamente");
      } catch (error) {
        console.log("Error guardando preferencia de tema:", error);
      }
    }
  };

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    
    if (user && !user.isAnonymous) {
      try {
        await saveThemePreference(newTheme);
      } catch (error) {
        console.log("Error guardando preferencia de tema:", error);
      }
    }
  };

  const isDark = theme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
