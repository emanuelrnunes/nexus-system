import { lerJSON, salvarJSON } from "./storage";
const CHAVE = "nexus_tarefas";
export async function listarTarefas() {
  const dados = await lerJSON(CHAVE, []);
  return Array.isArray(dados) ? dados : [];
}
export async function obterTarefa(id) {
  return (await listarTarefas()).find(t => String(t.id) === String(id)) || null;
}
export async function criarTarefa(tarefa) {
  const lista = await listarTarefas();
  const nova = { ...tarefa, id: tarefa.id || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, criadoEm: tarefa.criadoEm || new Date().toISOString() };
  await salvarJSON(CHAVE, [...lista, nova]);
  return nova;
}
export async function atualizarTarefa(id, mudancas) {
  const lista = await listarTarefas();
  const indice = lista.findIndex(t => String(t.id) === String(id));
  if (indice < 0) throw new Error("Tarefa não encontrada");
  lista[indice] = { ...lista[indice], ...mudancas, id: lista[indice].id, criadoEm: lista[indice].criadoEm, atualizadoEm: new Date().toISOString() };
  await salvarJSON(CHAVE, lista);
  return lista[indice];
}
export async function excluirTarefa(id) {
  const lista = await listarTarefas();
  await salvarJSON(CHAVE, lista.filter(t => String(t.id) !== String(id)));
}
