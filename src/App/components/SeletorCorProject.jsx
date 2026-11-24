import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CORES = [
  "#2563EB", // Azul
  "#8B5CF6", // Roxo
  "#F97316", // Laranja
  "#22C55E", // Verde
  "#F59E0B", // Amarelo
  "#EF4444", // Vermelho
  "#EC4899", // Rosa
  "#06B6D4", // Ciano
];

export default function SeletorCorProject({
  corSelecionada,
  setCorSelecionada,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cor do Projeto</Text>

      <View style={styles.grade}>
        {CORES.map((cor) => {
          const ativo = corSelecionada === cor;

          return (
            <TouchableOpacity
              key={cor}
              onPress={() => setCorSelecionada(cor)}
              style={[
                styles.circulo,
                { backgroundColor: cor },
                ativo && styles.circuloAtivo,
              ]}
              activeOpacity={0.8}
            >
              {ativo && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0F172A",
  },

  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  circulo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  circuloAtivo: {
    borderWidth: 3,
    borderColor: "#0F172A",
  },

  check: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
