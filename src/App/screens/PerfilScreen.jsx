import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Switch, Platform, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import BottomTab from "../components/BottomTab";
import AvisoInline from "../components/AvisoInline";
import { obterPerfil, atualizarPerfil, obterNotificacoes, atualizarNotificacoes } from "../services/profileService";
import { listarTarefas } from "../services/taskService";
import { listarProjetos } from "../services/projectService";

function iniciais(nome) {
  const partes = String(nome || "").trim().split(/\s+/).filter(Boolean);
  return partes.length > 1 ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase() : (partes[0]?.[0] || "U").toUpperCase();
}

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState({ nome: "Usuário Nexus", email: "" });
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [projetos, setProjetos] = useState(0);
  const [tarefas, setTarefas] = useState([]);
  const [notificacoes, setNotificacoes] = useState(false);
  const [editar, setEditar] = useState(false);
  const [configNotificacoes, setConfigNotificacoes] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState("");
  const avisar = (titulo, texto) => setMensagemAviso(texto || titulo);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    (async () => {
      try {
        const [p, t, ps, n] = await Promise.all([obterPerfil(), listarTarefas(), listarProjetos(), obterNotificacoes()]);
        if (ativo) { setPerfil(p); setNome(p.nome); setEmail(p.email); setTarefas(t); setProjetos(ps.length); setNotificacoes(n); }
      } catch (e) { console.error(e); avisar("Erro", "Não foi possível carregar o perfil."); }
      finally { if (ativo) setCarregando(false); }
    })();
    return () => { ativo = false; };
  }, []));
  const salvar = async () => {
    if (salvando) return;
    if (!nome.trim()) return avisar("Atenção", "Informe seu nome.");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return avisar("Atenção", "E-mail inválido.");
    setSalvando(true);
    try { const novo = await atualizarPerfil({ nome: nome.trim(), email: email.trim() }); setPerfil(novo); setEditar(false); }
    catch (e) { avisar("Erro", "Não foi possível salvar o perfil."); }
    finally { setSalvando(false); }
  };
  const opcao = (icone, titulo, acao, cor = "#2563EB") => (
    <TouchableOpacity style={styles.opcao} onPress={acao}>
      <MaterialIcons name={icone} size={22} color={cor} />
      <Text style={styles.opcaoTexto}>{titulo}</Text>
      <MaterialIcons name="chevron-right" size={20} color="#64748B" />
    </TouchableOpacity>
  );
  if (carregando) return <View style={styles.centro}><ActivityIndicator color="#2563EB" size="large" /></View>;
  return <View style={styles.tela}>
    <ScrollView contentContainerStyle={{paddingBottom:100}}>
      <View style={{paddingHorizontal:16,paddingTop:12}}><AvisoInline mensagem={mensagemAviso} onFechar={() => setMensagemAviso("")} /></View>
      <View style={styles.azul}>
        <Text style={styles.titulo}>Perfil</Text>
        <View style={styles.usuario}>
          <View style={styles.avatar}><Text style={styles.iniciais}>{iniciais(perfil.nome)}</Text></View>
          <View style={{flex:1}}><Text style={styles.nome}>{perfil.nome}</Text><Text style={styles.email}>{perfil.email || "E-mail não informado"}</Text></View>
        </View>
        <View style={styles.estatisticas}>
          {[{n:projetos,t:"Projetos"},{n:tarefas.length,t:"Tarefas"},{n:tarefas.filter(t=>t.status==="Concluída").length,t:"Feitas"}].map(x=><View key={x.t} style={styles.estatistica}><Text style={styles.numero}>{x.n}</Text><Text style={styles.rotulo}>{x.t}</Text></View>)}
        </View>
      </View>
      <View style={styles.conteudo}>
        <View style={styles.menu}>
          {opcao("person", "Editar Perfil", () => {setNome(perfil.nome);setEmail(perfil.email);setEditar(true);}, "#5B21B6")}
          {opcao("vpn-key", "Alterar Senha", () => avisar("Em desenvolvimento", "A troca de senha será ativada com a autenticação do Spring Boot."), "#F59E0B")}
          {opcao("notifications", "Notificações", () => setConfigNotificacoes(true), "#F59E0B")}
        </View>
        <TouchableOpacity style={styles.sair} onPress={()=>navigation.reset({index:0,routes:[{name:"loginScreen"}]})}><MaterialIcons name="logout" size={21} color="#EF4444" /><Text style={[styles.opcaoTexto,{color:"#EF4444"}]}>Sair</Text><MaterialIcons name="chevron-right" size={20} color="#EF4444" /></TouchableOpacity>
      </View>
    </ScrollView>
    <BottomTab activeRoute="perfilScreen" />
    <Modal visible={editar} transparent animationType="fade" onRequestClose={()=>setEditar(false)}><View style={styles.overlay}><View style={styles.modal}>
      <Text style={styles.modalTitulo}>Editar Perfil</Text><Text>Nome completo</Text><TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome completo" />
      <Text>E-mail</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seuemail@exemplo.com" />
      <TouchableOpacity style={styles.salvar} onPress={salvar} disabled={salvando}><Text style={styles.salvarTexto}>{salvando?"Salvando...":"Salvar alterações"}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.cancelar} onPress={()=>setEditar(false)}><Text>Cancelar</Text></TouchableOpacity>
    </View></View></Modal>
    <Modal visible={configNotificacoes} transparent animationType="fade" onRequestClose={()=>setConfigNotificacoes(false)}><View style={styles.overlay}><View style={styles.modal}>
      <Text style={styles.modalTitulo}>Notificações</Text><View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text>Ativar preferência</Text><Switch value={notificacoes} onValueChange={async v=>{try{await atualizarNotificacoes(v);setNotificacoes(v);}catch(e){avisar("Erro","Não foi possível salvar.");}}}/></View>
      <Text style={{color:"#64748B",fontSize:12,marginVertical:16}}>O envio de notificações será implementado futuramente.</Text>
      <TouchableOpacity style={styles.salvar} onPress={()=>setConfigNotificacoes(false)}><Text style={styles.salvarTexto}>Concluir</Text></TouchableOpacity>
    </View></View></Modal>
  </View>;
}
const styles=StyleSheet.create({
  tela:{flex:1,backgroundColor:"#F8FAFC"},centro:{flex:1,justifyContent:"center",alignItems:"center"},
  azul:{backgroundColor:"#2457DF",paddingTop:Platform.OS==="web"?24:55,paddingHorizontal:20,paddingBottom:24},
  titulo:{fontSize:19,fontWeight:"800",color:"#FFF",marginBottom:25},usuario:{flexDirection:"row",alignItems:"center",gap:14,marginBottom:25},
  avatar:{width:58,height:58,borderRadius:29,backgroundColor:"#5481EB",borderWidth:2,borderColor:"#AFC8FF",justifyContent:"center",alignItems:"center"},
  iniciais:{fontSize:21,fontWeight:"700",color:"#FFF"},nome:{fontSize:18,fontWeight:"700",color:"#FFF"},email:{fontSize:12,color:"#DBEAFE",marginTop:5},
  estatisticas:{flexDirection:"row",backgroundColor:"#3768E4",borderRadius:14,overflow:"hidden"},estatistica:{flex:1,alignItems:"center",paddingVertical:14},numero:{fontSize:19,fontWeight:"800",color:"#FFF"},rotulo:{fontSize:11,color:"#DBEAFE",marginTop:4},
  conteudo:{paddingHorizontal:16,paddingTop:16},menu:{backgroundColor:"#FFF",borderWidth:1,borderColor:"#DCE4EF",borderRadius:16,overflow:"hidden"},
  opcao:{height:55,paddingHorizontal:17,flexDirection:"row",alignItems:"center",gap:15,borderBottomWidth:1,borderBottomColor:"#E2E8F0"},opcaoTexto:{flex:1,fontSize:14,color:"#0F172A",fontWeight:"500"},
  sair:{marginTop:12,height:54,backgroundColor:"#FFF1F2",borderWidth:1,borderColor:"#FECACA",borderRadius:15,paddingHorizontal:17,flexDirection:"row",alignItems:"center",gap:15},
  overlay:{flex:1,backgroundColor:"rgba(15,23,42,0.45)",justifyContent:"center",padding:22},modal:{backgroundColor:"#FFF",borderRadius:18,padding:22,width:"100%",maxWidth:440,alignSelf:"center"},modalTitulo:{fontSize:19,fontWeight:"700",color:"#0F172A",marginBottom:20},
  input:{height:47,borderWidth:1,borderColor:"#CBD5E1",borderRadius:10,paddingHorizontal:13,marginTop:7,marginBottom:17},salvar:{backgroundColor:"#2563EB",height:48,borderRadius:11,justifyContent:"center",alignItems:"center"},salvarTexto:{color:"#FFF",fontWeight:"700"},cancelar:{alignItems:"center",padding:15}
});
