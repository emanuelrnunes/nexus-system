import { StyleSheet, Text, TextInput, View } from "react-native";
import ProjectCard from "../../components/ProjectCard";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NEXUS SYSTEM</Text>

      <Text style={styles.greeting}>Olá, Emanuel 👋</Text>

      <TextInput placeholder="Buscar projetos..." style={styles.searchInput} />

      <ProjectCard title="Projeto Faculdade" tasks={12} progress={60} />

      <ProjectCard title="Aplicativo Delivery" tasks={24} progress={75} />

      <ProjectCard title="Site Institucional" tasks={8} progress={30} />
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
});
