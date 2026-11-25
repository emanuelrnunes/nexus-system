// =====================================================
// FORMULÁRIO DE TAREFA
// Usado pelas telas "Nova Tarefa" e "Editar Tarefa".
// =====================================================

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AvisoInline from "./AvisoInline";
import { listarProjetos } from "../services/projectService";
import { STATUS, PRIORIDADES } from "../services/taskService";

// valoresIniciais: { titulo, descricao, prioridade, status, dataVencimento (Date), projeto (nome) }
// onSalvar(dados): recebe os dados prontos para o taskService
export default function FormularioTarefa({
  tituloTela,
  textoBotao,
  valoresIniciais = {},
  onSalvar,
}) {
  const navigation = useNavigation();

  // Campos do formulário
  const [titulo, setTitulo] = useState(valoresIniciais.titulo || "");
  const [descricao, setDescricao] = useState(valoresIniciais.descricao || "");
  const [prioridade, setPrioridade] = useState(valoresIniciais.prioridade || "Média");
  const [status, setStatus] = useState(valoresIniciais.status || "A Fazer");
  const [dataVencimento, setDataVencimento] = useState(valoresIniciais.dataVencimento || null);
  const [projeto, setProjeto] = useState(valoresIniciais.projeto || "");

  // Controles da tela
  const [modalStatus, setModalStatus] = useState(false);
  const [modalProjeto, setModalProjeto] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState("");

  // Carrega os projetos do usuário para o seletor
  useEffect(() => {
    let ativo = true;
    listarProjetos()
      .then((lista) => {
        if (!ativo) return;
        setProjetosDisponiveis(lista);
        // Se o projeto atual não existir, seleciona o primeiro
        setProjeto((atual) =>
          lista.some((p) => p.title === atual) ? atual : lista[0]?.title || "",
        );
      })
      .catch((erro) => {
        if (ativo) setMensagemAviso(erro.message);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const formatarData = (data) => {
    if (!data) return "Selecionar data";

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const salvar = async () => {
    if (salvando) return;

    if (!titulo.trim()) {
      setMensagemAviso("Digite um título para a tarefa.");
      return;
    }

    const projetoSelecionado = projetosDisponiveis.find((p) => p.title === projeto);
    if (!projetoSelecionado) {
      setMensagemAviso("Selecione um projeto. Crie um projeto antes, se ainda não tiver.");
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        prioridade,
        status,
        dataVencimento,
        projetoId: projetoSelecionado.id,
        projeto: projetoSelecionado.title,
      });
    } catch (erro) {
      setMensagemAviso(erro.message || "Não foi possível salvar a tarefa.");
    } finally {
      setSalvando(false);
    }
  };

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
              navigation.popTo("homeScreen");
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        {/* TÍTULO DA PÁGINA */}
        <Text style={styles.headerTitle}>{tituloTela}</Text>
      </View>

      {/* =====================================================
          FORMULÁRIO
      ===================================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <AvisoInline
          mensagem={mensagemAviso}
          onFechar={() => setMensagemAviso("")}
        />
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
            {PRIORIDADES.map((item) => (
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
            BOTÃO: SALVAR
        ===================================================== */}

        <TouchableOpacity
          style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.saveButtonText}>
            {salvando ? "Salvando..." : textoBotao}
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

            {STATUS.map((item) => (
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

            {projetosDisponiveis.map((p) => {
              const item = p.title;
              return (
                <TouchableOpacity
                  key={p.id}
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
              );
            })}
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
// COMPONENTE: CALENDÁRIO NATIVO (ANDROID / IOS)
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
