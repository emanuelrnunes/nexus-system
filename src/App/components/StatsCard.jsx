import { View, Text, StyleSheet } from "react-native";

/**
 * Card de estatística.
 * Exibe um valor e uma descrição.
 *
 * Exemplo:
 * <StatsCard
 *   value={5}
 *   label="Projetos"
 *   color="#2563EB"
 * />
 */

export default function StatsCard({
  value,
  label,
  color,
}) {
  return (
    <View style={styles.card}>
      <Text
        style={[
          styles.value,
          { color },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.label,
          { color },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    paddingVertical: 18,

    alignItems: "center",

    marginHorizontal: 4,

    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  value: {
    fontSize: 32,
    fontWeight: "700",
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
});