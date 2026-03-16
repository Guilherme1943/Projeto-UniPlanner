import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
    label: string
}

export function Button({ label, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 48,
        backgroundColor: "#4a0599",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    label: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
})