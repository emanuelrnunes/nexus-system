import React, { useCallback, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import SeletorCorProject from "../components/SeletorCorProject";
import { obterProjeto, editarProjeto, excluirProjeto } from "../services/projectService";

function aviso(titulo, mensagem) { if (Platform.OS === "web") window.alert(`${titulo}\n${mensagem}`); else Alert.alert(titulo, mensagem); }
function confirmar(titulo, mensagem, confirmarAcao) {
  if (Platform.OS === "web") { if (window.confirm(`${titulo}\n${mensagem}`)) confirmarAcao(); }
  else Alert.alert(titulo, mensagem, [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: confirmarAcao }]);
}
export default function EditarProjetoScreen({ navigation, route }) {
  const id = route.params?.projetoId;
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState("#2563EB");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    obterProjeto(id).then(projeto => {
      if (!ativo) return;
      if (!projeto) { aviso("Projeto", "Projeto não encontrado."); navigation.navigate("homeScreen"); return; }
      setNome(projeto.title); setDescricao(projeto.descricao || ""); setCor(projeto.color || "#2563EB");
    }).catch(e => aviso("Erro", e.message)).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [id, navigation]));
  const salvar = async () => {
    if (salvando) return;
    setSalvando(true);
    try { await editarProjeto(id, { nome, descricao, cor }); navigation.navigate("homeScreen"); }
    catch (e) { aviso("Não foi possível salvar", e.message); }
    finally { setSalvando(false); }
  };
  const remover = () => confirmar("Excluir projeto?", "A exclusão não pode ser desfeita. Projetos com tarefas não podem ser excluídos.", async () => {
    try { await excluirProjeto(id); navigation.navigate("homeScreen"); }
    catch (e) { aviso("Não foi possível excluir", e.message); }
  });
  if (carregando) return <View style={styles.centro}><ActivityIndicator color="#2563EB" size="large" /></View>;
  return <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}><MaterialIcons name="arrow-back" size={22} color="#2563EB" /><Text style={styles.voltarTexto}>Voltar</Text></TouchableOpacity>
    <Text style={styles.titulo}>Editar projeto</Text>
    <Text style={styles.label}>Nome do projeto</Text><TextInput style={styles.input} value={nome} onChangeText={setNome} maxLength={80} placeholder="Nome do projeto" />
    <Text style={styles.label}>Descrição</Text><TextInput style={[styles.input, styles.multilinha]} value={descricao} onChangeText={setDescricao} multiline maxLength={500} placeholder="Descreva os objetivos" />
    <SeletorCorProject corSelecionada={cor} setCorSelecionada={setCor} />
    <TouchableOpacity onPress={salvar} disabled={salvando} style={styles.salvar}><Text style={styles.salvarTexto}>{salvando ? "Salvando..." : "Salvar alterações"}</Text></TouchableOpacity>
    <TouchableOpacity onPress={remover} style={styles.excluir}><MaterialIcons name="delete-outline" size={20} color="#DC2626"/><Text style={styles.excluirTexto}>Excluir projeto</Text></TouchableOpacity>
  </ScrollView>;
}
const styles = StyleSheet.create({
  tela:{flex:1,backgroundColor:"#F8FAFC"},conteudo:{padding:24,paddingBottom:70,gap:12},centro:{flex:1,alignItems:"center",justifyContent:"center"},
  voltar:{flexDirection:"row",alignItems:"center",gap:8,paddingVertical:10},voltarTexto:{color:"#2563EB",fontWeight:"700"},
  titulo:{fontSize:23,fontWeight:"700",color:"#0F172A",marginBottom:12},label:{fontSize:13,color:"#334155",fontWeight:"600",marginTop:12},
  input:{backgroundColor:"#FFF",borderWidth:1,borderColor:"#CBD5E1",borderRadius:12,padding:14,fontSize:14,color:"#0F172A"},multilinha:{height:100,textAlignVertical:"top"},
  salvar:{backgroundColor:"#2563EB",borderRadius:13,padding:16,alignItems:"center",marginTop:16},salvarTexto:{color:"#FFF",fontWeight:"700"},
  excluir:{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8,padding:15,backgroundColor:"#FEF2F2",borderRadius:12,marginTop:8},excluirTexto:{color:"#DC2626",fontWeight:"700"}
});
