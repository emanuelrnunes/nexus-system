
import { atualizarPerfil } from "../services/profileService";
import { useState } from "react";
import AvisoInline from "../components/AvisoInline";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function CadastrarScreen({ navigation }) {
  const [nome,setNome] = useState("");
  const [email,setEmail] = useState("");
  const [senha,setSenha] = useState("");
  const [confirmacao,setConfirmacao] = useState("");
  const [salvando,setSalvando] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState("");
  const avisar = (mensagem) => setMensagemAviso(mensagem);
  const cadastrar = async () => {
    if (!nome.trim() || nome.trim().length < 3) return avisar("Informe seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return avisar("Informe um e-mail válido.");
    if (senha.length < 6) return avisar("A senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirmacao) return avisar("As senhas não coincidem.");
    if (salvando) return;
    setSalvando(true);
    try {
      await atualizarPerfil({nome:nome.trim(),email:email.trim().toLowerCase()});
      // Nunca persistir senhas sem um backend seguro.
      navigation.navigate("loginScreen", { avisoInicial: "Cadastro salvo apenas para demonstração. A criação de conta real depende do backend." });
    } catch(e) { avisar("Não foi possível salvar o perfil."); }
    finally {setSalvando(false);}
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Inicio */}
      <View style={styles.blocoVoltarCriar}>
        <Pressable
          style={styles.btnVoltar}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 20 }}>🠔</Text>
        </Pressable>
        <Text style={styles.titulo}>Criar Conta</Text>
      </View>

      <AvisoInline mensagem={mensagemAviso} onFechar={() => setMensagemAviso("")} />

      {/* Campos */}
      <View style={styles.form}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          value={nome} onChangeText={setNome}
          placeholderTextColor="#64748B"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="voce@exemplo.com"
          value={email} onChangeText={setEmail}
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={senha} onChangeText={setSenha}
          placeholderTextColor="#64748B"
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={confirmacao} onChangeText={setConfirmacao}
          placeholderTextColor="#64748B"
          secureTextEntry
        />
      </View>

      {/* Botão Cadastrar */}
      <TouchableOpacity style={styles.btnPrimario} activeOpacity={0.85} onPress={cadastrar} disabled={salvando}>
        <Text style={styles.btnPrimarioText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Criar conta */}
      <View style={styles.cadastroRow}>
        <Text style={styles.cadastroTexto}>Já tem uma conta? </Text>
        <Pressable onPress={() => navigation.navigate("loginScreen")}>
          <Text style={styles.cadastroLink}>Entrar</Text>
        </Pressable>
      </View>
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

  blocoVoltarCriar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Titulo
  titulo: {
    fontSize: 19,
    fontWeight: "770",
    color: "#0F172A",
  },

  btnVoltar: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },

  // Formulário
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
  },

  // Botão primário
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

  // Criar conta
  cadastroRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cadastroTexto: {
    fontSize: 13,
    color: "#64748B",
  },
  cadastroLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});
