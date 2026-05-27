import { Image, ScrollView, StyleSheet, Text, useColorScheme, View, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";

import { Link } from "expo-router";

import { Input } from "@/components/input";

import { Button } from "@/components/button";

export default function signup() {
    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Image
                        source={require("@/assets/NomeUniPlanner.png")}
                        style={styles.ilustração}
                    />

                    <Text style={styles.título}>Cadastrar</Text>
                    <Text style={styles.subtítulo}>Crie sua conta para acessar.</Text>

                    <View style={styles.form}>
                        <Input placeholder="Nome" placeholderTextColor={useColorScheme() === "dark" ? "#dbdbdb" : "#dbdbdb"} />
                        <Input placeholder="E-mail" keyboardType="email-address" placeholderTextColor={useColorScheme() === "dark" ? "#dbdbdb" : "#dbdbdb"} />
                        <Input placeholder="Senha" secureTextEntry placeholderTextColor={useColorScheme() === "dark" ? "#dbdbdb" : "#dbdbdb"} />
                        <Input placeholder="Confirmar Senha" secureTextEntry placeholderTextColor={useColorScheme() === "dark" ? "#dbdbdb" : "#dbdbdb"} />
                        <Button label="Cadastrar" />
                    </View>

                    <Text style={styles.textorodapé}>
                        Já tem uma conta?{" "}
                        <Link href="/" style={styles.signuplink}>
                            Entre aqui!
                        </Link>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020324",
        padding: 32,
    },
    ilustração: {
        width: "100%",
        height: 255,
        marginTop: 80,
    },
    título: {
        fontSize: 32,
        fontWeight: "900",
        color: "#dbdbdb",
    },
    subtítulo: {
        fontSize: 16,
        color: "#dbdbdb",
        marginTop: 16,
    },
    form: {
        marginTop: 24,
        gap: 12,
    },
    textorodapé: {
        textAlign: "center",
        marginTop: 24,
        color: "#dbdbdb",
    },
    signuplink: {
        color: "#032ad7",
        fontWeight: "700",
    },
});