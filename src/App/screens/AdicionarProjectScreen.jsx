import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import SeletorCorProject from "../components/SeletorCorProject";
import AvisoInline from "../components/AvisoInline";
import { criarProjeto } from "../services/projectService";

export default function AdicionarProjectScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("#2563EB");
  const [salvando, setSalvando] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState("");
  const salvar = async () => {
    if (salvando) return;
    if (!nome.trim()) {
      setMensagemAviso("Informe o nome do projeto.");
      return;
    }
    setSalvando(true);
    try {
      await criarProjeto({ nome, descricao, cor: corSelecionada });
      navigation.popTo("homeScreen");
    } catch (erro) {
      setMensagemAviso(erro.message || "Não foi possível criar o projeto.");
    } finally {
      setSalvando(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <AvisoInline
        mensagem={mensagemAviso}
        onFechar={() => setMensagemAviso("")}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingVertical: 10 }}
      >
        <Text style={{ color: "#2563EB", fontWeight: "700" }}>‹ Voltar</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#0F172A" }}>
        Novo projeto
      </Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Projeto</Text>

        <TextInput
          style={styles.input}
          placeholder="ex: App Mobile v2"
          placeholderTextColor="#64748B"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline={true}
          placeholder="Descreva os objetivos do projeto..."
          placeholderTextColor="#64748B"
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>

      <SeletorCorProject
        corSelecionada={corSelecionada}
        setCorSelecionada={setCorSelecionada}
      />

      <TouchableOpacity
        style={styles.btnPrimario}
        activeOpacity={0.85}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.btnPrimarioText}>
          {salvando ? "Salvando..." : "Criar Projeto"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 24,
    gap: 20,
  },

  form: {
    gap: 4,
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#0F172A",
    textAlignVertical: "top",
  },

  btnPrimario: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimarioText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
