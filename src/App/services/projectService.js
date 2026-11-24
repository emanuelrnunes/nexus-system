import { lerJSON, salvarJSON } from "./storage";
import { listarTarefas, atualizarTarefa } from "./taskService";
import { PROJETOS_INICIAIS } from "../config/projetos";

const CHAVE = "nexus_projetos";
const CHAVE_OCULTOS = "nexus_projetos_ocultos";
const nomeNormalizado = (valor) => String(valor || "").trim().toLocaleLowerCase("pt-BR");

// Migra automaticamente os projetos padrão para um catálogo editável.
async function obterCatalogo() {
  const catalogo = await lerJSON(CHAVE, null);
  const ocultos = await lerJSON(CHAVE_OCULTOS, []);
  const validos = Array.isArray(catalogo) ? catalogo : [];
  const ids = new Set(validos.map(p => String(p.id)));
  const iniciais = PROJETOS_INICIAIS.filter(p => !ids.has(String(p.id)) && !ocultos.includes(String(p.id)));
  return [...iniciais, ...validos];
}
export async function listarProjetos() { return obterCatalogo(); }
export async function obterProjeto(id) { return (await obterCatalogo()).find(p => String(p.id) === String(id)) || null; }
export async function criarProjeto({ nome, descricao = "", cor = "#2563EB" }) {
  const title = String(nome || "").trim();
  if (!title) throw new Error("Informe o nome do projeto.");
  const catalogo = await obterCatalogo();
  if (catalogo.some(p => nomeNormalizado(p.title) === nomeNormalizado(title))) throw new Error("Já existe um projeto com esse nome.");
  const novo = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, descricao: String(descricao).trim(), color: cor, criadoEm: new Date().toISOString() };
  await salvarJSON(CHAVE, [...catalogo, novo]);
  return novo;
}
export async function editarProjeto(id, { nome, descricao = "", cor = "#2563EB" }) {
  const title = String(nome || "").trim();
  if (!title) throw new Error("Informe o nome do projeto.");
  const catalogo = await obterCatalogo();
  const indice = catalogo.findIndex(p => String(p.id) === String(id));
  if (indice < 0) throw new Error("Projeto não encontrado.");
  if (catalogo.some(p => String(p.id) !== String(id) && nomeNormalizado(p.title) === nomeNormalizado(title))) throw new Error("Já existe um projeto com esse nome.");
  const anterior = catalogo[indice];
  catalogo[indice] = { ...anterior, title, descricao: String(descricao).trim(), color: cor, atualizadoEm: new Date().toISOString() };
  await salvarJSON(CHAVE, catalogo);
  // Mantém as tarefas vinculadas ao nome atualizado do projeto.
  if (anterior.title !== title) {
    const tarefas = await listarTarefas();
    for (const tarefa of tarefas.filter(t => t.projeto === anterior.title)) await atualizarTarefa(tarefa.id, { projeto: title });
  }
  return catalogo[indice];
}
export async function excluirProjeto(id) {
  const catalogo = await obterCatalogo();
  const alvo = catalogo.find(p => String(p.id) === String(id));
  if (!alvo) throw new Error("Projeto não encontrado.");
  const tarefas = await listarTarefas();
  if (tarefas.some(t => t.projeto === alvo.title)) throw new Error("Este projeto contém tarefas. Mova ou exclua as tarefas antes de remover o projeto.");
  const ocultos = await lerJSON(CHAVE_OCULTOS, []);
  if (PROJETOS_INICIAIS.some(p => String(p.id) === String(id))) await salvarJSON(CHAVE_OCULTOS, [...new Set([...ocultos, String(id)])]);
  await salvarJSON(CHAVE, catalogo.filter(p => String(p.id) !== String(id)));
}
