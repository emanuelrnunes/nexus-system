import { API_URL } from "../config/api";

// Tempo máximo de espera por uma resposta da API
const TEMPO_LIMITE_MS = 15000;

// Faz uma requisição para a API e devolve o JSON da resposta.
// Em caso de erro, lança um Error com uma mensagem pronta para mostrar na tela.
export async function requisicao(metodo, caminho, corpo) {
  const controle = new AbortController();
  const cronometro = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  let resposta;

  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se a API está rodando.",
    );
  } finally {
    clearTimeout(cronometro);
  }

  const texto = await resposta.text();
  let dados = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    const erro = new Error(mensagemDeErro(resposta.status, dados));
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}

function mensagemDeErro(status, dados) {
  // Erros de validação da API: [{ campo, mensagem }]
  if (Array.isArray(dados) && dados.length > 0) return dados[0].mensagem;
  if (dados?.mensagem) return dados.mensagem;

  if (status === 401) return "E-mail ou senha incorretos.";
  if (status === 404) return "Registro não encontrado.";
  if (status === 409) return "Já existe um registro com esses dados.";
  return "Erro inesperado no servidor.";
}
