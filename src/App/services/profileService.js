import { lerJSON, salvarJSON } from "./storage";
const PADRAO = { nome: "Usuário Nexus", email: "" };
export async function obterPerfil() { return { ...PADRAO, ...(await lerJSON("nexus_perfil", {})) }; }
export async function atualizarPerfil(mudancas) {
  const perfil = { ...(await obterPerfil()), ...mudancas, atualizadoEm: new Date().toISOString() };
  await salvarJSON("nexus_perfil", perfil);
  return perfil;
}
export async function obterNotificacoes() { return Boolean(await lerJSON("nexus_notificacoes", false)); }
export async function atualizarNotificacoes(valor) { await salvarJSON("nexus_notificacoes", Boolean(valor)); }
