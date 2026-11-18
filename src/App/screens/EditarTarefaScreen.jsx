// Tela de edição: carrega pelo ID e preserva os dados originais.
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable, Platform, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { listarTarefas, atualizarTarefa } from "../services/taskService";
import { listarProjetos } from "../services/projectService";

export default function EditarTarefaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tarefaId = route.params?.tarefaId;
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [status, setStatus] = useState("A Fazer");
  const [modalStatus, setModalStatus] = useState(false);
  const [dataVencimento, setDataVencimento] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [projeto, setProjeto] = useState("Projeto Faculdade");
  const [modalProjeto, setModalProjeto] = useState(false);
  const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    listarProjetos().then(lista => { if (ativo) setProjetosDisponiveis(lista); }).catch(console.error);
    return () => { ativo = false; };
  }, []));
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [encontrada, setEncontrada] = useState(false);

  const mostrarMensagem = (tituloMensagem, mensagem) => {
    if (Platform.OS === "web") window.alert(`${tituloMensagem}\n\n${mensagem}`);
    else Alert.alert(tituloMensagem, mensagem);
  };

  const carregarTarefa = useCallback(async () => {
    setCarregando(true);
    try {
      const lista = await listarTarefas();
      const tarefa = lista.find(item => String(item.id) === String(tarefaId));
      if (!tarefa) { setEncontrada(false); return; }
      setTitulo(tarefa.titulo || "");
      setDescricao(tarefa.descricao || "");
      setPrioridade(tarefa.prioridade || "Média");
      setStatus(tarefa.status || "A Fazer");
      setProjeto(tarefa.projeto || "Projeto Faculdade");
      const data = tarefa.dataVencimento ? new Date(tarefa.dataVencimento) : null;
      setDataVencimento(data && !Number.isNaN(data.getTime()) ? data : null);
      setEncontrada(true);
    } catch (erro) {
      console.error("Erro ao carregar tarefa:", erro);
      setEncontrada(false);
    } finally { setCarregando(false); }
  }, [tarefaId]);

  useFocusEffect(useCallback(() => { carregarTarefa(); }, [carregarTarefa]));

  const formatarData = (data) => data
    ? `${String(data.getDate()).padStart(2,"0")}/${String(data.getMonth()+1).padStart(2,"0")}/${data.getFullYear()}`
    : "Selecionar data";

  // Atualiza apenas o registro selecionado, sem alterar o ID/criação.
  const salvarAlteracoes = async () => {
    if (!titulo.trim()) { mostrarMensagem("Campo obrigatório", "Digite um título para a tarefa."); return; }
    if (salvando || !encontrada) return;
    setSalvando(true);
    try {
      await atualizarTarefa(tarefaId, {
        titulo: titulo.trim(), descricao: descricao.trim(), prioridade, status, projeto,
        dataVencimento: dataVencimento ? dataVencimento.toISOString() : null,
      });
      navigation.goBack();
    } catch (erro) {
      console.error("Erro ao salvar edição:", erro);
      mostrarMensagem("Erro", "Não foi possível salvar as alterações.");
    } finally { setSalvando(false); }
  };

  if (carregando) return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><ActivityIndicator color="#2563EB"/><Text>Carregando tarefa...</Text></View>;
  if (!encontrada) return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text>Tarefa não encontrada.</Text><TouchableOpacity onPress={() => navigation.goBack()}><Text style={{color:"#2563EB"}}>Voltar</Text></TouchableOpacity></View>;

  // =====================================================
  // INTERFACE DA TELA
  // =====================================================

  return (
    <View style={styles.container}>
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <View style={styles.header}>
        {/* BOTÃO: VOLTAR */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("homeScreen");
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        {/* TÍTULO DA PÁGINA */}
        <Text style={styles.headerTitle}>Editar Tarefa</Text>
      </View>

      {/* =====================================================
          FORMULÁRIO DE CADASTRO
      ===================================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        {/* =====================================================
            CAMPO: TÍTULO DA TAREFA
        ===================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>Título da tarefa</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o título da tarefa"
            placeholderTextColor="#94A3B8"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* =====================================================
            CAMPO: DESCRIÇÃO
        ===================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descreva a tarefa..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* =====================================================
            CAMPO: PRIORIDADE
        ===================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>Prioridade</Text>

          <View style={styles.optionsRow}>
            {["Baixa", "Média", "Alta"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.option,
                  prioridade === item && styles.optionSelected,
                ]}
                onPress={() => setPrioridade(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    prioridade === item && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* =====================================================
            CAMPO: STATUS
        ===================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>

          {/* BOTÃO: ABRIR SELETOR DE STATUS */}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setModalStatus(true)}
          >
            <Text style={styles.selectText}>{status}</Text>

            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* =====================================================
            CAMPO: VENCIMENTO
        ===================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>Vencimento</Text>

          {Platform.OS === "web" ? (
            // CALENDÁRIO PARA NAVEGADOR
            <View style={styles.webDateContainer}>
              <input
                type="date"
                value={
                  dataVencimento
                    ? [
                        dataVencimento.getFullYear(),
                        String(dataVencimento.getMonth() + 1).padStart(2, "0"),
                        String(dataVencimento.getDate()).padStart(2, "0"),
                      ].join("-")
                    : ""
                }
                onChange={(event) => {
                  const valor = event.target.value;

                  if (!valor) {
                    setDataVencimento(null);
                    return;
                  }

                  const [ano, mes, dia] = valor.split("-").map(Number);

                  setDataVencimento(new Date(ano, mes - 1, dia));
                }}
                style={{
                  width: "100%",
                  height: 46,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: 14,
                  color: "#475569",
                  fontFamily: "inherit",
                }}
              />
            </View>
          ) : (
            // BOTÃO: ABRIR CALENDÁRIO NATIVO
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setMostrarCalendario(true)}
            >
              <Text style={styles.selectText}>
                {formatarData(dataVencimento)}
              </Text>

              <MaterialIcons name="calendar-today" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* =====================================================
            CAMPO: PROJETO
        ===================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>Projeto</Text>

          {/* BOTÃO: ABRIR SELETOR DE PROJETOS */}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setModalProjeto(true)}
          >
            <Text style={styles.selectText}>{projeto}</Text>

            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* =====================================================
            BOTÃO: SALVAR TAREFA
        ===================================================== */}

        <TouchableOpacity
          style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
          onPress={salvarAlteracoes}
          disabled={salvando}
        >
          <Text style={styles.saveButtonText}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* =====================================================
          MODAL: SELECIONAR STATUS
      ===================================================== */}

      <Modal
        visible={modalStatus}
        transparent
        animationType="fade"
        onRequestClose={() => setModalStatus(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalStatus(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Selecionar status</Text>

            {["A Fazer", "Em andamento", "Concluída"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.statusOption}
                onPress={() => {
                  setStatus(item);
                  setModalStatus(false);
                }}
              >
                <Text style={styles.selectText}>{item}</Text>

                {status === item && (
                  <MaterialIcons name="check" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* =====================================================
          MODAL: SELECIONAR PROJETO
      ===================================================== */}

      <Modal
        visible={modalProjeto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalProjeto(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalProjeto(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Selecionar projeto</Text>

            {projetosDisponiveis.map((p) => { const item = p.title; return (
              <TouchableOpacity
                key={item}
                style={styles.statusOption}
                onPress={() => {
                  setProjeto(item);
                  setModalProjeto(false);
                }}
              >
                <Text style={styles.selectText}>{item}</Text>

                {projeto === item && (
                  <MaterialIcons name="check" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ); })}
          </Pressable>
        </Pressable>
      </Modal>

      {/* =====================================================
          CALENDÁRIO NATIVO - ANDROID / IOS
      ===================================================== */}

      {Platform.OS !== "web" && mostrarCalendario && (
        <DateTimePickerNativo
          dataVencimento={dataVencimento}
          setDataVencimento={setDataVencimento}
          setMostrarCalendario={setMostrarCalendario}
        />
      )}
    </View>
  );
}

// =====================================================
// COMPONENTE: CALENDÁRIO NATIVO
// =====================================================

function DateTimePickerNativo({
  dataVencimento,
  setDataVencimento,
  setMostrarCalendario,
}) {
  const DateTimePicker =
    require("@react-native-community/datetimepicker").default;

  return (
    <DateTimePicker
      value={dataVencimento || new Date()}
      mode="date"
      display="default"
      onChange={(event, dataSelecionada) => {
        setMostrarCalendario(false);

        if (event.type === "set" && dataSelecionada) {
          setDataVencimento(dataSelecionada);
        }
      }}
    />
  );
}

// =====================================================
// ESTILOS DA TELA
// =====================================================

const styles = StyleSheet.create({
  // CONTAINER PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  // CABEÇALHO
  header: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },

  // BOTÃO VOLTAR
  backButton: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // TÍTULO DO CABEÇALHO
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  // ÁREA DE ROLAGEM
  scroll: {
    flex: 1,
  },

  // FORMULÁRIO
  form: {
    paddingTop: 24,
    paddingBottom: 30,
    gap: 20,
  },

  // AGRUPAMENTO DOS CAMPOS
  field: {
    gap: 8,
  },

  // TÍTULOS DOS CAMPOS
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  // CAMPOS DE TEXTO
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
  },

  // CAMPO DESCRIÇÃO
  descriptionInput: {
    height: 110,
    paddingTop: 12,
  },

  // LINHA DE PRIORIDADES
  optionsRow: {
    flexDirection: "row",
    gap: 8,
  },

  // BOTÕES DE PRIORIDADE
  option: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // TEXTO DAS PRIORIDADES
  optionText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },

  // PRIORIDADE SELECIONADA
  optionSelected: {
    backgroundColor: "#FFF7ED",
    borderColor: "#F97316",
  },

  // TEXTO DA PRIORIDADE SELECIONADA
  optionTextSelected: {
    color: "#EA580C",
    fontWeight: "700",
  },

  // CAMPOS DE SELEÇÃO
  selectButton: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // TEXTO DOS SELETORES
  selectText: {
    fontSize: 14,
    color: "#475569",
  },

  // CAMPO DE DATA WEB
  webDateContainer: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  // FUNDO DOS MODAIS
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    justifyContent: "center",
    padding: 24,
  },

  // CONTEÚDO DOS MODAIS
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
  },

  // TÍTULO DOS MODAIS
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },

  // OPÇÕES DOS MODAIS
  statusOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 8,
  },

  // BOTÃO SALVAR
  saveButton: {
    backgroundColor: "#2563EB",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  // BOTÃO DESABILITADO
  saveButtonDisabled: {
    opacity: 0.6,
  },

  // TEXTO DO BOTÃO SALVAR
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
