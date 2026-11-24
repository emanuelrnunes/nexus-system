// Arquivo responsável por criar um contexto de navegação
import { NavigationContainer} from "@react-navigation/native";

import { StackRoutes } from "./StackRouter";

export function Routes() {
    return(
        <NavigationContainer>
            <StackRoutes />
        </NavigationContainer>
    )
} 