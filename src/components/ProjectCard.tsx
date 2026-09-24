import { StyleSheet, Text, View } from "react-native";

/**
 * Componente reutilizável para exibir
 * informações resumidas de um projeto.
 */

// Dados recebidos pelo componente
type ProjectCardProps = {
  title: string;
  tasks: number;
  progress: number;
  color: string;
};

export default function ProjectCard({
  title,
  tasks,
  progress,
  color,
}: ProjectCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{tasks} tarefas</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`,  backgroundColor: color,}]} />
        </View>

        <Text style={styles.progressText}>{progress}%</Text>
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
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  // Texto da porcentagem
  progressText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "600",
  },
});
