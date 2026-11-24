import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/** Mensagem de validação/erro exibida dentro da própria tela do aplicativo. */
export default function AvisoInline({ mensagem, onFechar }) {
  if (!mensagem) return null;
  return (
    <View accessibilityRole="alert" style={styles.container}>
      <MaterialIcons name="error-outline" size={19} color="#B91C1C" />
      <Text style={styles.texto}>{mensagem}</Text>
      <TouchableOpacity onPress={onFechar} accessibilityLabel="Fechar aviso" hitSlop={8}>
        <MaterialIcons name="close" size={18} color="#B91C1C" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 10,
  },
  texto: { flex: 1, color: "#B91C1C", fontSize: 13, fontWeight: "600", lineHeight: 18 },
});
