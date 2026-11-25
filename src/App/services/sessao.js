import { lerJSON, salvarJSON, removerChave } from "./storage";

// Guarda no aparelho o usuário que fez login
const CHAVE = "nexus_usuario";

export async function obterUsuario() {
  return lerJSON(CHAVE, null);
}

export async function salvarUsuario(usuario) {
  await salvarJSON(CHAVE, usuario);
}

export async function encerrarSessao() {
  await removerChave(CHAVE);
}

export async function obterUsuarioId() {
  const usuario = await obterUsuario();
  if (!usuario?.id) throw new Error("Sessão expirada. Faça login novamente.");
  return usuario.id;
}
