import { lerJSON, salvarJSON } from "./storage";
import { requisicao } from "./api";
import { obterUsuario, obterUsuarioId, salvarUsuario } from "./sessao";

const CHAVE_NOTIFICACOES = "nexus_notificacoes";

export async function obterPerfil() {
  const usuario = await obterUsuario();
  return {
    nome: usuario?.name || "Usuário Nexus",
    email: usuario?.email || "",
  };
}

export async function atualizarPerfil({ nome, email }) {
  const id = await obterUsuarioId();
  const corpo = { name: nome };
  if (email) corpo.email = email.toLowerCase();

  try {
    const usuario = await requisicao("PUT", `/user/atualizar/${id}`, corpo);
    await salvarUsuario(usuario);
    return { nome: usuario.name, email: usuario.email };
  } catch (erro) {
    if (erro.status === 409) throw new Error("Este e-mail já está em uso.");
    throw erro;
  }
}

// Preferência salva só no aparelho (a API não tem notificações)
export async function obterNotificacoes() {
  return Boolean(await lerJSON(CHAVE_NOTIFICACOES, false));
}

export async function atualizarNotificacoes(valor) {
  await salvarJSON(CHAVE_NOTIFICACOES, Boolean(valor));
}
