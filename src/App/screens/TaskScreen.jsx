import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";

import { useState, useCallback } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { listarTarefas } from "../services/taskService";
import { listarProjetos } from "../services/projectService";

// =====================================================
// TELA PRINCIPAL - KANBAN
// =====================================================

export default function TaskScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Projeto e status recebidos da navegação
  const [projetos, setProjetos] = useState([]);
  const [projetoEscolhido, setProjetoEscolhido] = useState(null);
  const [mostrarProjetos, setMostrarProjetos] = useState(false);
  const projeto = route.params?.projeto || projetoEscolhido || projetos[0]?.title || "";

  const [statusAtivo, setStatusAtivo] = useState(
    route.params?.status || "A Fazer",
  );

  const [tarefas, setTarefas] = useState([]);

  // =====================================================
  // FUNÇÃO: CARREGAR TAREFAS
  // =====================================================

  const carregarTarefas = useCallback(async () => {
    try {
      const [lista, catalogo] = await Promise.all([listarTarefas(), listarProjetos()]);
      setTarefas(lista);
      setProjetos(catalogo);
      if (!route.params?.projeto && !projetoEscolhido && catalogo.length) setProjetoEscolhido(catalogo[0].title);
    } catch (erro) {
      console.error("Erro ao carregar tarefas:", erro);
      setTarefas([]);
    }
  }, [route.params?.projeto, projetoEscolhido]);

  // Atualiza a lista ao retornar para o Kanban
  useFocusEffect(
    useCallback(() => {
      carregarTarefas();
    }, [carregarTarefas]),
  );

  // =====================================================
  // FILTROS POR PROJETO E STATUS
  // =====================================================

  const tarefasDoProjeto = tarefas.filter(
    (tarefa) => tarefa.projeto === projeto,
  );

  const tarefasFiltradas = tarefasDoProjeto.filter(
    (tarefa) => tarefa.status === statusAtivo,
  );

  const totalTarefas = tarefasDoProjeto.length;

  const totalConcluidas = tarefasDoProjeto.filter(
    (tarefa) => tarefa.status === "Concluída",
  ).length;

  const percentualConcluido =
    totalTarefas > 0 ? Math.round((totalConcluidas / totalTarefas) * 100) : 0;

  // =====================================================
  // FUNÇÃO: CORES DA PRIORIDADE
  // =====================================================

  const obterCorPrioridade = (prioridade) => {
    switch (prioridade) {
      case "Alta":
        return {
          fundo: "#FEE2E2",
          texto: "#DC2626",
        };

      case "Média":
        return {
          fundo: "#FEF3C7",
          texto: "#D97706",
        };

      case "Baixa":
        return {
          fundo: "#DCFCE7",
          texto: "#16A34A",
        };

      default:
        return {
          fundo: "#F1F5F9",
          texto: "#475569",
        };
    }
  };

  // =====================================================
  // FUNÇÃO: FORMATAR DATA
  // =====================================================

  const formatarData = (valor) => {
    if (!valor) return null;

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return null;
    }

    return data.toLocaleDateString("pt-BR");
  };

  // =====================================================
  // FUNÇÃO: ABRIR DETALHES DA TAREFA
  // =====================================================

  const abrirDetalhes = (tarefa) => {
    navigation.navigate("detalhesTarefaScreen", {
      tarefaId: tarefa.id,
    });
  };

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <View style={styles.container}>
      {/* CABEÇALHO DO PROJETO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("homeScreen")}
        >
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{projeto}</Text>

          <Text style={styles.headerSubtitle}>
            {totalTarefas} tarefas · {percentualConcluido}% concluído
          </Text>
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={() => setMostrarProjetos(v => !v)} accessibilityLabel="Selecionar projeto">
          <MaterialIcons name="swap-horiz" size={24} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => { const selecionado=projetos.find(p=>p.title===projeto); if(selecionado) navigation.navigate("menuProjetoScreen",{projetoId:selecionado.id}); }} accessibilityLabel="Menu do projeto"><MaterialIcons name="more-vert" size={24} color="#475569" /></TouchableOpacity>
      </View>

      {mostrarProjetos && <ScrollView horizontal style={{maxHeight:56,backgroundColor:"#FFF"}} contentContainerStyle={{alignItems:"center",paddingHorizontal:12,gap:8}}>
        {projetos.map(p => <TouchableOpacity key={p.id} onPress={() => {
          setProjetoEscolhido(p.title);
          navigation.setParams({projeto:p.title});
          setMostrarProjetos(false);
        }} style={{paddingHorizontal:13,paddingVertical:9,backgroundColor:projeto===p.title?"#DBEAFE":"#F1F5F9",borderRadius:20}}>
          <Text style={{color:projeto===p.title?"#1D4ED8":"#475569",fontWeight:"600"}}>{p.title}</Text>
        </TouchableOpacity>)}
      </ScrollView>}
      {/* ABAS DO KANBAN */}
      <View style={styles.tabs}>
        {["A Fazer", "Em andamento", "Concluída"].map((item) => {
          const selecionado = statusAtivo === item;

          return (
            <TouchableOpacity
              key={item}
              style={[styles.tab, selecionado && styles.tabSelected]}
              onPress={() => setStatusAtivo(item)}
            >
              <Text
                style={[styles.tabText, selecionado && styles.tabTextSelected]}
              >
                {item === "Concluída" ? "CONCLUÍDO" : item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LISTA DE TAREFAS */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    statusAtivo === "A Fazer"
                      ? "#2563EB"
                      : statusAtivo === "Em andamento"
                        ? "#F59E0B"
                        : "#22C55E",
                },
              ]}
            />

            <Text style={styles.sectionTitle}>{statusAtivo.toUpperCase()}</Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{tarefasFiltradas.length}</Text>
          </View>
        </View>

        {/* CARDS CLICÁVEIS */}
        {tarefasFiltradas.map((tarefa) => {
          const cores = obterCorPrioridade(tarefa.prioridade);

          return (
            <TouchableOpacity
              key={tarefa.id}
              style={styles.taskCard}
              activeOpacity={0.75}
              onPress={() => abrirDetalhes(tarefa)}
            >
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {tarefa.titulo}
                </Text>

                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: cores.fundo },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: cores.texto }]}>
                    {tarefa.prioridade}
                  </Text>
                </View>
              </View>

              {Boolean(tarefa.descricao) && (
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {tarefa.descricao}
                </Text>
              )}

              {Boolean(tarefa.dataVencimento) && (
                <View style={styles.dateRow}>
                  <MaterialIcons
                    name="calendar-today"
                    size={13}
                    color="#64748B"
                  />

                  <Text style={styles.dateText}>
                    {formatarData(tarefa.dataVencimento)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* MENSAGEM DE LISTA VAZIA */}
        {tarefasFiltradas.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={42} color="#94A3B8" />

            <Text style={styles.emptyTitle}>Nenhuma tarefa encontrada</Text>

            <Text style={styles.emptyText}>
              Ainda não existem tarefas neste status.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BOTÃO ADICIONAR TAREFA */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("novaTarefaScreen", {projeto})}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// =====================================================
// ESTILOS DO KANBAN
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 72,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },

  backButton: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
  },

  menuButton: {
    padding: 6,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },

  tab: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  tabSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  tabText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },

  tabTextSelected: {
    color: "#FFFFFF",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },

  countBadge: {
    minWidth: 26,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    fontSize: 12,
    color: "#64748B",
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
  },

  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  taskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  taskDescription: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 7,
    lineHeight: 18,
  },

  priorityBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
  },

  dateText: {
    fontSize: 11,
    color: "#64748B",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 70,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },

  addButton: {
    position: "absolute",
    right: 22,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});
