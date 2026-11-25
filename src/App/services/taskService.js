import { requisicao } from "./api";
import { obterUsuarioId } from "./sessao";

// Valores usados pelas telas (o app mostra os textos em português)
export const STATUS = ["A Fazer", "Em andamento", "Concluída"];
export const PRIORIDADES = ["Baixa", "Média", "Alta"];

// As telas usam textos em português; a API usa os enums em inglês
const STATUS_API = {
  "A Fazer": "TODO",
  "Em andamento": "IN_PROGRESS",
  Concluída: "DONE",
};
const PRIORIDADE_API = { Baixa: "LOW", Média: "MEDIUM", Alta: "HIGH" };

const inverter = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
const STATUS_APP = inverter(STATUS_API);
const PRIORIDADE_APP = inverter(PRIORIDADE_API);

const doisDigitos = (n) => String(n).padStart(2, "0");

// Date -> "2026-12-01"
function dataParaApi(data) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

// "2026-12-01" -> data ISO no fuso do aparelho
function dataParaApp(texto) {
  if (!texto) return null;
  const [ano, mes, dia] = texto.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toISOString();
}

// API -> formato que as telas usam
function paraApp(t) {
  return {
    id: t.id,
    titulo: t.title,
    descricao: t.description || "",
    prioridade: PRIORIDADE_APP[t.priority] || "Média",
    status: STATUS_APP[t.status] || "A Fazer",
    dataVencimento: dataParaApp(t.dueDate),
    projeto: t.projectName || "",
    projetoId: t.projectId,
    criadoEm: t.createdAt,
    atualizadoEm: t.updatedAt,
  };
}

// Dados do formulário -> corpo da requisição
// { titulo, descricao, prioridade, status, dataVencimento (Date|null), projetoId }
function paraApi(tarefa) {
  return {
    projectId: tarefa.projetoId,
    title: tarefa.titulo,
    description: tarefa.descricao,
    priority: PRIORIDADE_API[tarefa.prioridade],
    status: STATUS_API[tarefa.status],
    dueDate: tarefa.dataVencimento ? dataParaApi(tarefa.dataVencimento) : null,
  };
}

// Todas as tarefas do usuário logado (uma única requisição)
export async function listarTarefas() {
  const userId = await obterUsuarioId();
  const lista = await requisicao("GET", `/task/usuario/${userId}`);
  return lista.map(paraApp);
}

export async function obterTarefa(id) {
  try {
    return paraApp(await requisicao("GET", `/task/listar/${id}`));
  } catch (erro) {
    if (erro.status === 404) return null;
    throw erro;
  }
}

export async function criarTarefa(tarefa) {
  return paraApp(await requisicao("POST", "/task/cadastrar", paraApi(tarefa)));
}

export async function atualizarTarefa(id, tarefa) {
  const corpo = paraApi(tarefa);
  // Sem data no formulário = remover o vencimento que já existia
  if (!corpo.dueDate) corpo.clearDueDate = true;
  return paraApp(await requisicao("PUT", `/task/atualizar/${id}`, corpo));
}

export async function excluirTarefa(id) {
  await requisicao("DELETE", `/task/excluir/${id}`);
}
