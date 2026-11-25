import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import { useState, useCallback } from "react";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AvisoInline from "../components/AvisoInline";
import {
  obterTarefa,
  excluirTarefa as removerTarefa,
} from "../services/taskService";

// =====================================================
// TELA: DETALHES DA TAREFA
// =====================================================

export default function DetalhesTarefaScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ID da tarefa selecionada no Kanban
  const tarefaId = route.params?.tarefaId;

  const [tarefa, setTarefa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemAviso, setMensagemAviso] = useState("");
  const [erroCarregar, setErroCarregar] = useState("");
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);

  // =====================================================
  // FUNÇÃO: BUSCAR TAREFA PELO ID
  // =====================================================

  const carregarTarefa = useCallback(async () => {
    setCarregando(true);

    try {
      setTarefa(await obterTarefa(tarefaId));
      setErroCarregar("");
    } catch (erro) {
      setErroCarregar(erro.message);
      setTarefa(null);
    } finally {
      setCarregando(false);
    }
  }, [tarefaId]);

  // Atualiza os detalhes quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarTarefa();
    }, [carregarTarefa]),
  );

  // =====================================================
  // FUNÇÃO: FORMATAR DATA
  // =====================================================

  const formatarData = (valor) => {
    if (!valor) return "Não informado";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return "Não informado";
    }

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FUNÇÃO: EXCLUIR TAREFA
  // =====================================================

  const excluirTarefa = async () => {
    if (!tarefa) return;

    try {
      await removerTarefa(tarefa.id);
      navigation.goBack();
    } catch (erro) {
      setMensagemAviso(erro.message || "Não foi possível excluir a tarefa.");
    }
  };

  // =====================================================
  // FUNÇÃO: CONFIRMAR EXCLUSÃO
  // =====================================================

  const confirmarExclusao = () => setConfirmacaoAberta(true);

  // =====================================================
  // FUNÇÃO: ABRIR EDIÇÃO
  // =====================================================

  const abrirEdicao = () => {
    if (!tarefa) return;
    navigation.navigate("editarTarefaScreen", { tarefaId: tarefa.id });
  };

  // =====================================================
  // ESTADOS DE CARREGAMENTO
  // =====================================================

  if (carregando) {
    return (
      <View style={styles.center}>
        <Text>Carregando tarefa...</Text>
      </View>
    );
  }

  if (!tarefa) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={42} color="#94A3B8" />

        <Text style={styles.emptyText}>
          {erroCarregar || "Tarefa não encontrada."}
        </Text>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar ao Kanban</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  // CORES DA PRIORIDADE E STATUS
  // =====================================================

  const coresPrioridade = {
    Alta: { cor: "#DC2626", fundo: "#FEF2F2" },
    Média: { cor: "#D97706", fundo: "#FFFBEB" },
    Baixa: { cor: "#16A34A", fundo: "#F0FDF4" },
  };

  const coresStatus = {
    "A Fazer": { cor: "#2563EB", fundo: "#EFF6FF" },
    "Em andamento": { cor: "#D97706", fundo: "#FFFBEB" },
    Concluída: { cor: "#16A34A", fundo: "#F0FDF4" },
  };

  const prioridadeCor = coresPrioridade[tarefa.prioridade] || {};

  const statusCor = coresStatus[tarefa.status] || {};

  // =====================================================
  // INTERFACE PRINCIPAL
  // =====================================================

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={21} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detalhes da Tarefa</Text>

        <View style={styles.headerActions}>
          {/* BOTÃO EDITAR */}
          <TouchableOpacity style={styles.iconButton} onPress={abrirEdicao}>
            <MaterialIcons name="edit-square" size={19} color="#0F172A" />
          </TouchableOpacity>

          {/* BOTÃO EXCLUIR */}
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={confirmarExclusao}
          >
            <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <AvisoInline
          mensagem={mensagemAviso}
          onFechar={() => setMensagemAviso("")}
        />
        {/* TÍTULO DA TAREFA */}
        <Text style={styles.taskTitle}>{tarefa.titulo}</Text>

        {/* DESCRIÇÃO */}
        <Text style={styles.description}>
          {tarefa.descricao || "Sem descrição cadastrada."}
        </Text>

        {/* QUADRO DE INFORMAÇÕES */}
        <View style={styles.infoCard}>
          <LinhaInformacao
            titulo="Status"
            valor={tarefa.status}
            cor={statusCor.cor}
            fundo={statusCor.fundo}
          />

          <LinhaInformacao
            titulo="Projeto"
            valor={tarefa.projeto}
            cor="#2563EB"
          />

          <LinhaInformacao
            titulo="Prioridade"
            valor={tarefa.prioridade}
            cor={prioridadeCor.cor}
            fundo={prioridadeCor.fundo}
          />

          <LinhaInformacao
            titulo="Vencimento"
            valor={formatarData(tarefa.dataVencimento)}
          />

          <LinhaInformacao
            titulo="Criado em"
            valor={formatarData(tarefa.criadoEm)}
          />

          <LinhaInformacao
            titulo="Atualizado"
            valor={formatarData(tarefa.atualizadoEm)}
          />
        </View>

        {/* BOTÃO EDITAR TAREFA */}
        <TouchableOpacity style={styles.editButton} onPress={abrirEdicao}>
          <Text style={styles.editButtonText}>Editar Tarefa</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={confirmacaoAberta}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmacaoAberta(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Excluir tarefa?</Text>
            <Text style={styles.modalText}>
              Deseja realmente excluir esta tarefa? Esta ação não pode ser
              desfeita.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmacaoAberta(false)}
                style={styles.modalCancel}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setConfirmacaoAberta(false);
                  excluirTarefa();
                }}
                style={styles.modalDelete}
              >
                <Text style={{ color: "#FFF", fontWeight: "700" }}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================================
// COMPONENTE: LINHA DE INFORMAÇÃO
// =====================================================

function LinhaInformacao({ titulo, valor, cor, fundo }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{titulo}</Text>

      <View
        style={[
          styles.valueContainer,
          fundo ? { backgroundColor: fundo } : null,
        ]}
      >
        <Text style={[styles.infoValue, cor ? { color: cor } : null]}>
          {valor}
        </Text>
      </View>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 10,
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerActions: {
    flexDirection: "row",
    gap: 8,
  },

  deleteIconButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 35,
  },

  taskTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    lineHeight: 21,
    color: "#64748B",
    marginBottom: 16,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4EF",
    borderRadius: 15,
    overflow: "hidden",
  },

  infoRow: {
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  infoLabel: {
    fontSize: 12,
    color: "#64748B",
  },

  valueContainer: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: "65%",
  },

  infoValue: {
    fontSize: 12,
    color: "#0F172A",
    textAlign: "right",
  },

  editButton: {
    marginTop: 20,
    height: 52,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
  },

  emptyText: {
    fontSize: 15,
    color: "#64748B",
  },

  backLink: { color: "#2563EB", fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: { backgroundColor: "#FFF", borderRadius: 16, padding: 20 },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  modalText: { fontSize: 13, color: "#475569", lineHeight: 20 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  modalCancel: { padding: 12 },
  modalDelete: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9,
  },
});
