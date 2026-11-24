import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AvisoInline from "../components/AvisoInline";
import { obterProjeto, excluirProjeto } from "../services/projectService";

export default function MenuProjetoScreen({ navigation, route }) {
  const [projeto, setProjeto] = useState(null);
  const [mensagemAviso, setMensagemAviso] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const id = route.params?.projetoId;
  const aviso = (mensagem) => setMensagemAviso(mensagem);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      obterProjeto(id)
        .then((resultado) => { if (ativo) setProjeto(resultado); })
        .catch(() => { if (ativo) aviso("Não foi possível carregar os dados do projeto."); });
      return () => { ativo = false; };
    }, [id])
  );

  const executarExclusao = async () => {
    setConfirmar(false);
    try {
      await excluirProjeto(id);
      navigation.navigate("homeScreen");
    } catch (erro) {
      aviso(erro.message || "Não foi possível excluir o projeto.");
    }
  };

  const itens = [
    { icone: "edit", titulo: "Editar Projeto", cor: "#2563EB", acao: () => navigation.navigate("editarProjetoScreen", { projetoId: id }) },
    { icone: "group", titulo: "Membros", cor: "#7C3AED", acao: () => aviso("Gestão de membros ficará disponível com o backend.") },
    { icone: "person-add", titulo: "Convidar Membros", cor: "#2563EB", acao: () => aviso("Convites serão habilitados após a integração com o backend.") },
    { icone: "archive", titulo: "Arquivar Projeto", cor: "#D97706", acao: () => aviso("Arquivamento de projetos ainda não implementado.") },
    { icone: "delete-outline", titulo: "Excluir Projeto", cor: "#DC2626", acao: () => setConfirmar(true) },
  ];

  return (
    <>
      <View style={styles.fundo}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()} />
        <View style={styles.painel}>
          <AvisoInline mensagem={mensagemAviso} onFechar={() => setMensagemAviso("")} />
          <View style={styles.puxador} />
          <Text style={styles.titulo}>{projeto?.title || "Projeto"}</Text>
          <Text style={styles.sub}>{projeto?.descricao || "Gerenciar projeto"}</Text>
          {itens.map((item) => (
            <TouchableOpacity
              key={item.titulo}
              onPress={item.acao}
              style={[styles.item, item.titulo === "Excluir Projeto" && { backgroundColor: "#FEF2F2" }]}
            >
              <MaterialIcons name={item.icone} size={20} color={item.cor} />
              <Text style={[styles.itemTexto, { color: item.cor }]}>{item.titulo}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.fechar}>
            <Text style={{ color: "#64748B" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={confirmar} transparent animationType="fade" onRequestClose={() => setConfirmar(false)}>
        <View style={styles.modalFundo}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Excluir projeto?</Text>
            <Text style={styles.modalTexto}>Esta ação não pode ser desfeita. Projetos com tarefas não podem ser excluídos.</Text>
            <View style={styles.modalAcoes}>
              <TouchableOpacity onPress={() => setConfirmar(false)} style={styles.btnCancelar}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={executarExclusao} style={styles.btnExcluir}>
                <Text style={{ color: "#FFF", fontWeight: "700" }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" },
  painel: { backgroundColor: "#FFF", padding: 22, paddingBottom: 32, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  puxador: { alignSelf: "center", width: 42, height: 5, borderRadius: 5, backgroundColor: "#CBD5E1", marginBottom: 18 },
  titulo: { fontSize: 17, fontWeight: "700", color: "#0F172A" },
  sub: { fontSize: 12, color: "#64748B", marginBottom: 18 },
  item: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingHorizontal: 8, borderRadius: 8 },
  itemTexto: { flex: 1, fontSize: 14, fontWeight: "600" },
  fechar: { alignItems: "center", padding: 15, marginTop: 10 },
  modalFundo: { flex: 1, backgroundColor: "#0008", justifyContent: "center", padding: 24 },
  modal: { backgroundColor: "#FFF", borderRadius: 16, padding: 20 },
  modalTitulo: { fontSize: 17, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  modalTexto: { fontSize: 13, color: "#475569", lineHeight: 20 },
  modalAcoes: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  btnCancelar: { padding: 12 },
  btnExcluir: { backgroundColor: "#DC2626", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 9 },
});
