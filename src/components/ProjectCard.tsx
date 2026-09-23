import { StyleSheet, Text, View } from "react-native";

type ProjectCardProps = {
  title: string;
  tasks: number;
  progress: number;
};

export default function ProjectCard({
  title,
  tasks,
  progress,
}: ProjectCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{tasks} tarefas</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    marginTop: 5,
    color: "#6B7280",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  progressText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "600",
  },
});
