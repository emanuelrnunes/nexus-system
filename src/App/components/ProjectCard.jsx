import { StyleSheet, Text, View } from "react-native";

/**
 * Componente reutilizável para exibir
 * informações resumidas de um projeto.
 */

export default function ProjectCard({ title, tasks, progress, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{tasks} tarefas</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Card principal do projeto
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    flexDirection: "row",
  },

  // Barra colorida lateral
  colorIndicator: {
    width: 4,
    borderRadius: 10,
  },

  // Conteúdo do card
  content: {
    flex: 1,
    marginLeft: 12,
  },

  // Nome do projeto
  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Quantidade de tarefas
  subtitle: {
    marginTop: 5,
    color: "#6B7280",
  },

  // Container da barra e porcentagem
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  // Barra de fundo
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },

  // Parte preenchida da barra
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  // Texto da porcentagem
  progressText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "600",
  },
});
