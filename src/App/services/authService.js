import { requisicao } from "./api";
import { salvarUsuario } from "./sessao";

export async function entrar(email, senha) {
  const usuario = await requisicao("POST", "/user/login", {
    email,
    password: senha,
  });
  await salvarUsuario(usuario);
  return usuario;
}

export async function cadastrar({ nome, email, senha }) {
  try {
    return await requisicao("POST", "/user/cadastrar", {
      name: nome,
      email,
      password: senha,
    });
  } catch (erro) {
    if (erro.status === 409) throw new Error("Este e-mail já está cadastrado.");
    throw erro;
  }
}
