// Armazenamento local do aparelho (no navegador usa o localStorage).
// Hoje guarda só a sessão do usuário e a preferência de notificações.
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const naWeb = Platform.OS === "web";

export async function lerJSON(chave, padrao) {
  const texto = naWeb
    ? window.localStorage.getItem(chave)
    : await AsyncStorage.getItem(chave);
  if (!texto) return padrao;
  try {
    return JSON.parse(texto) ?? padrao;
  } catch {
    return padrao;
  }
}

export async function salvarJSON(chave, valor) {
  const texto = JSON.stringify(valor);
  if (naWeb) window.localStorage.setItem(chave, texto);
  else await AsyncStorage.setItem(chave, texto);
}

export async function removerChave(chave) {
  if (naWeb) window.localStorage.removeItem(chave);
  else await AsyncStorage.removeItem(chave);
}
