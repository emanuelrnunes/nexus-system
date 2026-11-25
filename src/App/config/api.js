import { Platform } from "react-native";
import Constants from "expo-constants";

const IP_MANUAL = null;

const PORTA_API = 8080;

function hostDaApi() {
  if (IP_MANUAL) return IP_MANUAL;
  if (Platform.OS === "web") return "localhost";

  const hostUri = Constants.expoConfig?.hostUri; // ex.: "192.168.0.15:8081"
  if (hostUri) return hostUri.split(":")[0];

  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
}

export const API_URL = `http://${hostDaApi()}:${PORTA_API}`;
