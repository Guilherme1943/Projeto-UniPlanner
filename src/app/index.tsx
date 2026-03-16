import { Image, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

import { Link } from "expo-router";

import { Input } from "@/components/input";

import { Button } from "@/components/button";

export default function Index() {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <Image
                source={require ("@/assets/NomeUniPlanner.png")}
                style={styles.ilustração}
                />

                <Text style={styles.título}>Bem-Vindo!</Text>
                <Text style={styles.subtítulo}>Acesse sua conta com e-mail e senha.</Text>

                <View style={styles.form}>
                    <Input placeholder="E-mail" keyboardType="email-address" placeholderTextColor={useColorScheme() === "dark" ? "#dbdbdb" : "#dbdbdb"}  />
                    <Input placeholder="Senha" secureTextEntry placeholderTextColor={useColorScheme() === "dark" ? "#dbdbdb" : "#dbdbdb"} />
                    <Button label="Entrar" />
                </View>

                <Text style={styles.textorodapé}> 
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" style={styles.cadastrolink}>
                        Cadastre-se aqui!
                    </Link>
                </Text>
            </View>
        </ScrollView>
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
    cadastrolink: {
        color: "#032ad7",
        fontWeight: "700",
    },
});