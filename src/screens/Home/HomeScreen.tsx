import { StyleSheet, Text, TextInput, View } from "react-native";
import ProjectCard from "../../components/ProjectCard";

/**
 * Tela inicial do aplicativo.
 * Exibe saudação, busca e lista de projetos.
 */

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NEXUS SYSTEM</Text>

      <Text style={styles.greeting}>Olá, Emanuel 👋</Text>

      <Text style={styles.sectionTitle}>Seus projetos</Text>

      <TextInput placeholder="Buscar projetos..." style={styles.searchInput} />

      <ProjectCard title="Projeto Faculdade" tasks={12} progress={60} color="#2563EB" />

      <ProjectCard title="Aplicativo Delivery" tasks={24} progress={75} color="#22C55E" />

      <ProjectCard title="Site Institucional" tasks={8} progress={30} color="#A855F7" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
  },

  greeting: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 15,
  },
});
