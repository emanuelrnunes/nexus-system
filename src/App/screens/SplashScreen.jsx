import React from "react";
import {View,Text,StyleSheet,TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
export default function SplashScreen({navigation}) {return <TouchableOpacity style={st.tela} activeOpacity={1} onPress={()=>navigation.replace("loginScreen")}><View style={st.marca}><MaterialIcons name="close" size={42} color="#FFF"/></View><Text style={st.nome}>NEXUS SYSTEM</Text><Text style={st.slogan}>Organize. Priorize. Entregue.</Text><Text style={st.rodape}>Toque para continuar</Text></TouchableOpacity>}
const st=StyleSheet.create({tela:{flex:1,backgroundColor:"#2563EB",alignItems:"center",justifyContent:"center"},marca:{width:82,height:82,borderRadius:22,backgroundColor:"#3B82F6",alignItems:"center",justifyContent:"center",marginBottom:20},nome:{fontSize:23,fontWeight:"800",color:"#FFF"},slogan:{fontSize:13,color:"#DBEAFE",marginTop:8},rodape:{position:"absolute",bottom:35,fontSize:12,color:"#DBEAFE"}});
