import { requisicao } from "./api";
import { obterUsuarioId } from "./sessao";

const COR_PADRAO = "#2563EB";

// API -> formato que as telas usam
const paraApp = (p) => ({
  id: p.id,
  title: p.name,
  descricao: p.description || "",
  color: p.color || COR_PADRAO,
});

// API -> mensagem amigável para nome de projeto repetido
function tratarErro(erro) {
  if (erro.status === 409)
    throw new Error("Já existe um projeto com esse nome.");
  throw erro;
}

function montarCorpo({ nome, descricao = "", cor = COR_PADRAO }) {
  const name = String(nome || "").trim();
  if (!name) throw new Error("Informe o nome do projeto.");
  return { name, description: String(descricao).trim(), color: cor };
}

export async function listarProjetos() {
  const userId = await obterUsuarioId();
  const lista = await requisicao("GET", `/project/usuario/${userId}`);
  return lista.map(paraApp);
}

export async function obterProjeto(id) {
  try {
    return paraApp(await requisicao("GET", `/project/listar/${id}`));
  } catch (erro) {
    if (erro.status === 404) return null;
    throw erro;
  }
}

export async function criarProjeto(dados) {
  const corpo = montarCorpo(dados);
  const userId = await obterUsuarioId();
  try {
    return paraApp(
      await requisicao("POST", `/project/cadastrar?userId=${userId}`, corpo),
    );
  } catch (erro) {
    return tratarErro(erro);
  }
}

export async function editarProjeto(id, dados) {
  const corpo = montarCorpo(dados);
  try {
    return paraApp(await requisicao("PUT", `/project/atualizar/${id}`, corpo));
  } catch (erro) {
    return tratarErro(erro);
  }
}

export async function excluirProjeto(id) {
  const tarefas = await requisicao("GET", `/task/projeto/${id}`);
  if (tarefas.length > 0) {
    throw new Error(
      "Este projeto contém tarefas. Mova ou exclua as tarefas antes de remover o projeto.",
    );
  }
  await requisicao("DELETE", `/project/excluir/${id}`);
}
