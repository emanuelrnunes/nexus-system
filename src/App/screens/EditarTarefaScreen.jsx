import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import FormularioTarefa from "../components/FormularioTarefa";
import { obterTarefa, atualizarTarefa } from "../services/taskService";

// =====================================================
// TELA: EDITAR TAREFA
// Carrega a tarefa pelo ID e abre o formulário preenchido.
// =====================================================

export default function EditarTarefaScreen({ navigation, route }) {
  const tarefaId = route.params?.tarefaId;
  const [tarefa, setTarefa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    obterTarefa(tarefaId)
      .then((resultado) => {
        if (ativo) setTarefa(resultado);
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [tarefaId]);

  const salvar = async (dados) => {
    await atualizarTarefa(tarefaId, dados);
    navigation.goBack();
  };

  if (carregando)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#2563EB" />
        <Text>Carregando tarefa...</Text>
      </View>
    );
  if (!tarefa)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{erro || "Tarefa não encontrada."}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#2563EB" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <FormularioTarefa
      tituloTela="Editar Tarefa"
      textoBotao="Salvar Alterações"
      valoresIniciais={{
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        prioridade: tarefa.prioridade,
        status: tarefa.status,
        dataVencimento: tarefa.dataVencimento
          ? new Date(tarefa.dataVencimento)
          : null,
        projeto: tarefa.projeto,
      }}
      onSalvar={salvar}
    />
  );
}
