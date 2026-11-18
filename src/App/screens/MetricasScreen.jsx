import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { listarTarefas } from "../services/taskService";
import { listarProjetos } from "../services/projectService";
import BottomTab from "../components/BottomTab";

// Métricas calculadas a partir dos mesmos dados locais utilizados pelo Kanban.
const STATUS = [
  { nome: "A Fazer", cor: "#F59E0B" },
  { nome: "Em andamento", cor: "#3B82F6" },
  { nome: "Concluída", cor: "#22C55E" },
];
const PRIORIDADES = [
  { nome: "Alta", cor: "#EF4444" },
  { nome: "Média", cor: "#F59E0B" },
  { nome: "Baixa", cor: "#22C55E" },
];
const normalizar = valor => String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const concluida = tarefa => normalizar(tarefa.status) === "concluida";
const statusIgual = (tarefa, nome) => normalizar(tarefa.status) === normalizar(nome) || (nome === "Em andamento" && normalizar(tarefa.status) === "em progresso");

function Indicador({ titulo, valor, cor, icone }) {
  return <View style={styles.indicador}>
    <View style={[styles.icone, { backgroundColor: `${cor}18` }]}><MaterialIcons name={icone} size={23} color={cor} /></View>
    <Text style={styles.numero}>{valor}</Text><Text style={styles.rotulo}>{titulo}</Text>
  </View>;
}
function Barra({ titulo, valor, total, cor }) {
  const porcentagem = total ? Math.round(valor * 100 / total) : 0;
  return <View style={styles.linhaBarra}>
    <View style={styles.linhaLegenda}><Text style={styles.nomeBarra}>{titulo}</Text><Text style={styles.quantidade}>{valor} ({porcentagem}%)</Text></View>
    <View style={styles.trilho}><View style={[styles.preenchimento, { width: `${porcentagem}%`, backgroundColor: cor }]} /></View>
  </View>;
}
export default function MetricasScreen() {
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  useFocusEffect(useCallback(() => {
    let ativo = true;
    (async () => {
      try {
        const [lista, catalogo] = await Promise.all([listarTarefas(), listarProjetos()]);
        if (ativo) { setTarefas(lista); setProjetos(catalogo); setErro(""); }
      } catch (e) { if (ativo) setErro("Não foi possível carregar as métricas."); }
      finally { if (ativo) setCarregando(false); }
    })();
    return () => { ativo = false; };
  }, []));
  const filtradas = useMemo(() => filtro === "todos" ? tarefas : tarefas.filter(t => t.projeto === filtro), [tarefas, filtro]);
  const total = filtradas.length;
  const feitas = filtradas.filter(concluida).length;
  const pendentes = total - feitas;
  const taxa = total ? Math.round(feitas * 100 / total) : 0;
  const porProjeto = projetos.map(p => {
    const lista = tarefas.filter(t => t.projeto === p.title);
    return { ...p, total: lista.length, feitas: lista.filter(concluida).length };
  });
  return <View style={styles.tela}>
    <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
      <View style={styles.cabecalho}>
        <Text style={styles.sobretitulo}>NEXUS SYSTEM</Text>
        <Text style={styles.titulo}>Métricas</Text>
        <Text style={styles.subtitulo}>Acompanhe a evolução dos seus projetos e tarefas.</Text>
      </View>
      {carregando ? <ActivityIndicator size="large" color="#2563EB" style={{marginTop:35}} /> : <>
        {!!erro && <Text style={styles.erro}>{erro}</Text>}
        <Text style={styles.secaoTitulo}>Filtrar por projeto</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
          {[{ id: "todos", title: "Todos" }, ...projetos.map(p => ({ id: p.title, title: p.title }))].map(p =>
            <TouchableOpacity key={p.id} accessibilityRole="button" accessibilityState={{selected: filtro === p.id}}
              style={[styles.filtro, filtro === p.id && styles.filtroAtivo]} onPress={() => setFiltro(p.id)}>
              <Text style={[styles.filtroTexto, filtro === p.id && styles.filtroTextoAtivo]}>{p.title}</Text>
            </TouchableOpacity>)}
        </ScrollView>
        <View style={styles.grade}>
          <Indicador titulo="Total de tarefas" valor={total} cor="#2563EB" icone="assignment" />
          <Indicador titulo="Concluídas" valor={feitas} cor="#16A34A" icone="check-circle-outline" />
          <Indicador titulo="Pendentes" valor={pendentes} cor="#F59E0B" icone="schedule" />
          <Indicador titulo="Conclusão" valor={`${taxa}%`} cor="#8B5CF6" icone="trending-up" />
        </View>
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Progresso geral</Text>
          <Text style={styles.descricao}>{feitas} de {total} tarefas concluídas</Text>
          <View style={styles.trilhoGrande}><View style={[styles.preenchimento, {width: `${taxa}%`, backgroundColor: "#2563EB"}]} /></View>
          <Text style={styles.porcentagem}>{taxa}% concluído</Text>
        </View>
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Tarefas por status</Text>
          {STATUS.map(s => <Barra key={s.nome} titulo={s.nome} cor={s.cor} total={total} valor={filtradas.filter(t => statusIgual(t, s.nome)).length} />)}
        </View>
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Tarefas por prioridade</Text>
          {PRIORIDADES.map(p => <Barra key={p.nome} titulo={p.nome} cor={p.cor} total={total} valor={filtradas.filter(t => normalizar(t.prioridade) === normalizar(p.nome)).length} />)}
        </View>
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Desempenho por projeto</Text>
          {porProjeto.filter(p => filtro === "todos" || p.title === filtro).length === 0 && <Text style={styles.descricao}>Nenhum projeto cadastrado.</Text>}
          {porProjeto.filter(p => filtro === "todos" || p.title === filtro).map(p => <Barra key={p.id} titulo={p.title} valor={p.feitas} total={p.total} cor={p.color || "#2563EB"} />)}
          <Text style={styles.nota}>As barras mostram a proporção de tarefas concluídas em cada projeto.</Text>
        </View>
        {total === 0 && <Text style={styles.vazio}>Ainda não há tarefas para este filtro. Cadastre tarefas no Kanban para visualizar suas métricas.</Text>}
      </>}
    </ScrollView>
    <BottomTab activeRoute="metricasScreen" />
  </View>;
}
const styles = StyleSheet.create({
  tela: {flex:1, backgroundColor:"#F8FAFC"},
  conteudo: {paddingBottom:115, paddingHorizontal:18},
  cabecalho: {backgroundColor:"#2457DF", marginHorizontal:-18, paddingHorizontal:22, paddingTop:55, paddingBottom:27, marginBottom:22},
  sobretitulo: {color:"#DBEAFE", fontSize:12, fontWeight:"700", letterSpacing:1.5},
  titulo: {fontSize:29, color:"white", fontWeight:"800", marginTop:8},
  subtitulo: {color:"#E0E7FF", fontSize:13, marginTop:6},
  secaoTitulo: {fontSize:15, fontWeight:"700", color:"#0F172A", marginBottom:10},
  filtros: {gap:8, paddingBottom:16},
  filtro: {backgroundColor:"white", borderWidth:1, borderColor:"#CBD5E1", borderRadius:20, paddingHorizontal:15, paddingVertical:9},
  filtroAtivo: {backgroundColor:"#2563EB", borderColor:"#2563EB"},
  filtroTexto: {fontSize:12, color:"#475569", fontWeight:"600"},
  filtroTextoAtivo: {color:"white"},
  grade: {flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between", rowGap:10, marginBottom:15},
  indicador: {backgroundColor:"white", width:"48.5%", padding:15, borderRadius:14, borderWidth:1, borderColor:"#E2E8F0"},
  icone: {width:38, height:38, borderRadius:11, justifyContent:"center", alignItems:"center", marginBottom:10},
  numero: {fontSize:25, fontWeight:"800", color:"#0F172A"},
  rotulo: {fontSize:12, color:"#64748B", marginTop:4},
  cartao: {backgroundColor:"white", borderRadius:15, padding:17, marginBottom:14, borderWidth:1, borderColor:"#E2E8F0"},
  cartaoTitulo: {fontSize:16, fontWeight:"700", color:"#0F172A", marginBottom:12},
  descricao: {fontSize:12, color:"#64748B", marginBottom:11},
  trilhoGrande: {height:12, backgroundColor:"#E2E8F0", borderRadius:8, overflow:"hidden"},
  trilho: {height:9, backgroundColor:"#E2E8F0", borderRadius:6, overflow:"hidden"},
  preenchimento: {height:"100%", borderRadius:8},
  porcentagem: {textAlign:"right", fontSize:12, fontWeight:"700", color:"#2563EB", marginTop:9},
  linhaBarra: {marginTop:6, marginBottom:13},
  linhaLegenda: {flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:7, gap:10},
  nomeBarra: {fontSize:12, color:"#334155", flex:1},
  quantidade: {fontSize:12, color:"#64748B", fontWeight:"600"},
  nota: {fontSize:11, color:"#94A3B8", lineHeight:17},
  vazio: {textAlign:"center", color:"#64748B", marginTop:10, lineHeight:20},
  erro: {color:"#B91C1C", marginBottom:12},
});
