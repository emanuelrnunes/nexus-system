import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
export default function BottomTab({ activeRoute }) {
  const navigation = useNavigation();
  const route = useRoute();
  const atual = activeRoute || route.name;
  const abas = [
    { rota:"homeScreen", texto:"Início", icone:"home" },
    { rota:"metricasScreen", texto:"Métricas", icone:"bar-chart" },
    { rota:"perfilScreen", texto:"Perfil", icone:"person-outline" },
  ];
  return <View style={styles.container}>{abas.map(aba=>{
    const ativa = atual === aba.rota;
    return <TouchableOpacity key={aba.rota} style={styles.tab} onPress={()=>{
      if (ativa) return;
      if (aba.rota === "taskScreen") navigation.navigate("taskScreen", {status:"A Fazer"});
      else navigation.navigate(aba.rota);
    }}>
      <MaterialIcons name={aba.icone} size={24} color={ativa?"#2563EB":"#64748B"}/>
      <Text style={[styles.text,ativa&&styles.activeText]}>{aba.texto}</Text>
    </TouchableOpacity>;
  })}</View>;
}
const styles=StyleSheet.create({
  container:{position:"absolute",bottom:0,left:0,right:0,height:75,backgroundColor:"#FFF",flexDirection:"row",justifyContent:"space-around",alignItems:"center",borderTopWidth:1,borderTopColor:"#E5E7EB"},
  tab:{flex:1,alignItems:"center"},text:{fontSize:12,color:"#64748B",marginTop:2},activeText:{color:"#2563EB",fontWeight:"600"}
});
