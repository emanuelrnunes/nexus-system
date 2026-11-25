import FormularioTarefa from "../components/FormularioTarefa";
import { criarTarefa } from "../services/taskService";

// =====================================================
// TELA: NOVA TAREFA
// =====================================================

export default function NovaTarefaScreen({ navigation, route }) {
  const salvar = async (dados) => {
    await criarTarefa(dados);

    // Volta ao Kanban (sem empilhar outro) já na coluna da tarefa criada
    navigation.popTo("taskScreen", {
      projeto: dados.projeto,
      status: dados.status,
      atualizadoEm: Date.now(), // força o Kanban a trocar de coluna mesmo se o status for o mesmo
    });
  };

  return (
    <FormularioTarefa
      tituloTela="Nova Tarefa"
      textoBotao="Salvar Tarefa"
      valoresIniciais={{ projeto: route.params?.projeto }}
      onSalvar={salvar}
    />
  );
}
