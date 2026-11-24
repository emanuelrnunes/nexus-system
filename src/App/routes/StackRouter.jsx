import { createNativeStackNavigator } from "@react-navigation/native-stack";

// =====================================================
// IMPORTAÇÃO DAS TELAS
// =====================================================

import CadastrarScreen from "../screens/CadastrarScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import TaskScreen from "../screens/TaskScreen";
import PerfilScreen from "../screens/PerfilScreen";
import MetricasScreen from "../screens/MetricasScreen";
import BuscaScreen from "../screens/BuscaScreen";
import MenuProjetoScreen from "../screens/MenuProjetoScreen";
import SplashScreen from "../screens/SplashScreen";
import NovaTarefaScreen from "../screens/NovaTarefaScreen";

// Nova tela de detalhes
import DetalhesTarefaScreen from "../screens/DetalhesTarefaScreen";
import EditarTarefaScreen from "../screens/EditarTarefaScreen";
import AdicionarProjectScreen from "../screens/AdicionarProjectScreen";
import EditarProjetoScreen from "../screens/EditarProjetoScreen";

// =====================================================
// CONFIGURAÇÃO DAS ROTAS
// =====================================================

const Stack = createNativeStackNavigator();

export function StackRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="splashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="splashScreen" component={SplashScreen} />
      <Stack.Screen name="buscaScreen" component={BuscaScreen} />
      <Stack.Screen name="menuProjetoScreen" component={MenuProjetoScreen} options={{presentation:"transparentModal",animation:"fade"}} />
      <Stack.Screen name="homeScreen" component={HomeScreen} />

      <Stack.Screen name="loginScreen" component={LoginScreen} />

      <Stack.Screen name="cadastrarScreen" component={CadastrarScreen} />

      <Stack.Screen name="taskScreen" component={TaskScreen} />

      <Stack.Screen name="perfilScreen" component={PerfilScreen} />
      <Stack.Screen name="metricasScreen" component={MetricasScreen} />

      <Stack.Screen name="novaTarefaScreen" component={NovaTarefaScreen} />

      {/* ROTA: DETALHES DA TAREFA */}
      <Stack.Screen
        name="detalhesTarefaScreen"
        component={DetalhesTarefaScreen}
      />
      <Stack.Screen name="editarTarefaScreen" component={EditarTarefaScreen} />
      <Stack.Screen name="adicionarProjectScreen" component={AdicionarProjectScreen} />
      <Stack.Screen name="editarProjetoScreen" component={EditarProjetoScreen} />
    </Stack.Navigator>
  );
}
