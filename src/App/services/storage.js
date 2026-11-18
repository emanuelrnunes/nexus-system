// Armazenamento local intercambiável com uma API REST futura.
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export async function lerJSON(chave, padrao) {
  const texto = Platform.OS === "web" ? window.localStorage.getItem(chave) : await AsyncStorage.getItem(chave);
  if (!texto) return padrao;
  try { return JSON.parse(texto); }
  catch (erro) { console.warn(`Dados locais inválidos para ${chave}:`, erro); return padrao; }
}
export async function salvarJSON(chave, valor) {
  const texto = JSON.stringify(valor);
  if (Platform.OS === "web") window.localStorage.setItem(chave, texto);
  else await AsyncStorage.setItem(chave, texto);
}
