import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const aviso = (texto) => Platform.OS === "web" ? window.alert(texto) : Alert.alert("Aviso", texto);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoRow}>
        <Image
          source={require("../img/logo.png")}
          style={{ width: 30, height: 34 }}
        />
        <Text style={styles.logoText}>NEXUS</Text>
      </View>

      {/* Saudação */}
      <View style={styles.greeting}>
        <Text style={styles.titulo}>Bem-vindo de volta</Text>
        <Text style={styles.subtitulo}>Entre na sua conta</Text>
      </View>

      {/* Campos */}
      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="voce@exemplo.com"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Pressable style={styles.esqueciRow} onPress={() => aviso("Recuperação de senha será disponibilizada com o backend.")}>
          <Text style={styles.esqueciText}>Esqueci minha senha</Text>
        </Pressable>
      </View>

      {/* Botão entrar */}
      <TouchableOpacity
        onPress={() => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return aviso("Digite um e-mail válido.");
          if (senha.length < 6) return aviso("A senha deve ter pelo menos 6 caracteres.");
          aviso("Modo demonstração: os dados não foram autenticados. A validação real depende do backend.");
          navigation.reset({index:0,routes:[{name:"homeScreen"}]});
        }}
        style={styles.btnPrimario}
        activeOpacity={0.85}
      >
        <Text style={styles.btnPrimarioText}>Entrar</Text>
      </TouchableOpacity>

      {/* Criar conta */}
      <View style={styles.cadastroRow}>
        <Text style={styles.cadastroTexto}>Não tem uma conta? </Text>
        <Pressable onPress={() => navigation.navigate("cadastrarScreen")}>
          <Text style={styles.cadastroLink}>Cadastre-se</Text>
        </Pressable>
      </View>

      {/* Divisor */}
      <View style={styles.divisorRow}>
        <View style={styles.divisorLinha} />
        <Text style={styles.divisorTexto}>ou continue com</Text>
        <View style={styles.divisorLinha} />
      </View>

      {/* Botões sociais */}
      <View style={styles.sociaisRow}>
        <TouchableOpacity style={styles.btnSocial} activeOpacity={0.8} onPress={() => aviso("Login social ainda não implementado.")}>
          <Text style={styles.btnSocialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSocial} activeOpacity={0.8} onPress={() => aviso("Login social ainda não implementado.")}>
          <Text style={styles.btnSocialText}>Facebook</Text>
        </TouchableOpacity>
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

  // Logo
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginLeft: 8,
  },

  // Saudação
  greeting: {
    gap: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 13,
    fontWeight: "400",
    color: "#64748B",
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
  esqueciRow: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  esqueciText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2563EB",
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

  // Divisor
  divisorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divisorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  divisorTexto: {
    fontSize: 12,
    color: "#64748B",
  },

  // Botões sociais
  sociaisRow: {
    flexDirection: "row",
    gap: 12,
  },
  btnSocial: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnSocialText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
});
