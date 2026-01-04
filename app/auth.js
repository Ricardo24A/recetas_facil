import { loginEmail, registerEmail } from "@/services/auth";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function AuthScreen() {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ocupado, setOcupado] = useState(false);

    async function onSubmit(){
        const emailLimpio = email.trim().toLowerCase();
        if(!emailLimpio || !password){
            Alert.alert("Error", "Escribe el correo y la contraseña");
            return;
        }
        if(mode === "register" && name.trim().length < 2){
            Alert.alert("Error", "Escribe un nombre válido");
            return;
        }

        try{
            setOcupado (true);
            if(mode === "login"){
                await loginEmail(emailLimpio, password);
            }else{
                await registerEmail(emailLimpio, password, name.trim());
            }

        }catch (error){
            console.log("Error de autenticación:", error.code, error.message);
            
            let mensaje = "Ocurrió un error. Inténtalo de nuevo.";
            
            switch (error.code) {
                case "auth/invalid-credential":
                case "auth/wrong-password":
                    mensaje = "La contraseña es incorrecta. Verifica e intenta de nuevo.";
                    break;
                case "auth/user-not-found":
                    mensaje = "No existe una cuenta con este correo electrónico.";
                    break;
                case "auth/invalid-email":
                    mensaje = "El formato del correo electrónico no es válido.";
                    break;
                case "auth/email-already-in-use":
                    mensaje = "Este correo ya está registrado. Intenta iniciar sesión.";
                    break;
                case "auth/weak-password":
                    mensaje = "La contraseña es muy débil. Usa al menos 6 caracteres.";
                    break;
                case "auth/too-many-requests":
                    mensaje = "Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.";
                    break;
                default:
                    mensaje = "No se pudo autenticar. Verifica tus datos e intenta de nuevo.";
            }
            
            Alert.alert("Error", mensaje);
        }finally{
            setOcupado(false);
        }
    }

    return(
        <KeyboardAvoidingView 
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>

                    <Image 
                        source={require("../assets/images/logo.png")}
                        style={styles.logo} 
                    />

                    <Text style={styles.title}>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</Text>
                    <Text style={styles.subtitle}>
                        {mode === "login" ? "Accede con tu correo" : "Regístrate para guardar tus datos"}
                    </Text>

                    {mode === "register" && (
                        <View style={styles.field}>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                value={name}
                                placeholderTextColor="#9ca3af"
                                onChangeText={setName}
                                placeholder="Escribe tu nombre"
                                autoCapitalize="words"
                                style={styles.input}
                            />
                        </View>
                    )}
                    <View style={styles.field}>
                        <Text style={styles.label}>Correo</Text>
                        <TextInput
                            value={email}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setEmail}
                            placeholder="correo@ejemplo.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            value={password}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <Pressable onPress={onSubmit} disabled={ocupado} style={[styles.buttonLog, ocupado && styles.buttonBlock]}>
                        <Text style={styles.buttonText}> {ocupado ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}</Text>
                    </Pressable>

                    <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
                        <Text style={styles.link}>
                            {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                        </Text>
                    </Pressable>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#e8f5ee",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 25,
        justifyContent: "center",
        elevation: 5,
    },
    logo: {
        width: 250,
        height: 80,
        marginBottom: 15,
        alignItems: "Center",
        justifyContent: "center",
        alignSelf: "center", 
        borderRadius: 15,  
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    subtitle: {
        marginTop: 10,
        color: "#666",
        marginBottom: 20,
    },
    field: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#fff",
    },
    label: {
        marginBottom: 5,
        color: "#555",
        fontWeight: "600",
        fontSize: 16,
    },
    buttonLog: {
        backgroundColor: "#4CAF50",
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",

    },
    buttonBlock: { 
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
    link: {
        marginTop: 15,
        textAlign: "center",
        color: "#577469ff",
        fontWeight: "700",
    },
});