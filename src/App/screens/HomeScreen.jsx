import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { listarTarefas } from "../services/taskService";
import { listarProjetos } from "../services/projectService";
import { obterPerfil } from "../services/profileService";
import ProjectCard from "../components/ProjectCard";
import ButtonIcon from "../components/ButtonIcon";
import BottomTab from "../components/BottomTab";
import StatsCard from "../components/StatsCard";
import AvisoInline from "../components/AvisoInline";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Tela inicial do aplicativo.
 * Exibe saudação, busca e lista de projetos.
 */

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        try {
          const [lista, projetosSalvos, perfil] = await Promise.all([
            listarTarefas(),
            listarProjetos(),
            obterPerfil(),
          ]);
          if (ativo) {
            setTarefas(lista);
            setProjetos(projetosSalvos);
            setNomeUsuario((perfil.nome || "Usuário").trim().split(/\s+/)[0]);
            setErro("");
          }
        } catch (e) {
          if (ativo) setErro(e.message);
        }
      })();
      return () => {
        ativo = false;
      };
    }, []),
  );
  const projetosFiltrados = projetos.filter((p) =>
    p.title.toLowerCase().includes(busca.toLowerCase()),
  );
  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>NEXUS SYSTEM</Text>
          <MaterialIcons name="notifications-none" size={24} color="#111827" />
        </View>

        <Text style={styles.greeting}>Olá, {nomeUsuario} 👋</Text>

        <AvisoInline mensagem={erro} onFechar={() => setErro("")} />

        <Text style={styles.sectionTitle}>Seus projetos</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("buscaScreen")}
          style={{
            alignSelf: "flex-end",
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <MaterialIcons name="search" size={18} color="#2563EB" />
          <Text style={{ color: "#2563EB" }}>Buscar tarefas</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Buscar projetos..."
          style={styles.searchInput}
          value={busca}
          onChangeText={setBusca}
        />

        <View style={styles.statsContainer}>
          <StatsCard value={projetos.length} label="Projetos" color="#2563EB" />

          <StatsCard value={tarefas.length} label="Tarefas" color="#A855F7" />

          <StatsCard
            value={tarefas.filter((t) => t.status === "Concluída").length}
            label="Concluídas"
            color="#22C55E"
          />
        </View>

        {projetosFiltrados.length === 0 && (
          <Text
            style={{ color: "#64748B", textAlign: "center", marginTop: 25 }}
          >
            Nenhum projeto encontrado.
          </Text>
        )}
        {projetosFiltrados.map((p) => {
          const doProjeto = tarefas.filter((t) => t.projetoId === p.id);
          const concluidas = doProjeto.filter(
            (t) => t.status === "Concluída",
          ).length;
          const progresso = doProjeto.length
            ? Math.round((100 * concluidas) / doProjeto.length)
            : 0;
          return (
            <View key={p.id} style={styles.projetoLinha}>
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("taskScreen", {
                    projeto: p.title,
                    status: "A Fazer",
                  })
                }
              >
                <ProjectCard
                  title={p.title}
                  tasks={doProjeto.length}
                  progress={progresso}
                  color={p.color}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={`Editar projeto ${p.title}`}
                style={styles.editarProjeto}
                onPress={() =>
                  navigation.navigate("editarProjetoScreen", {
                    projetoId: p.id,
                  })
                }
              >
                <MaterialIcons name="edit" size={21} color="#2563EB" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <ButtonIcon
        icon="add"
        onPress={() => navigation.navigate("adicionarProjectScreen")}
      />

      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  projetoLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
  editarProjeto: {
    width: 44,
    height: 46,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

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

  sectionTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 15,
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

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
